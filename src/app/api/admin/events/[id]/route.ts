import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateEventSchema } from "@/lib/schemas/event";
import { logAction } from "@/lib/audit-log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    return NextResponse.json({ error: "Evento non trovato" }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const validationResult = updateEventSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: validationResult.error.flatten() },
      { status: 400 }
    );
  }

  const data = validationResult.data;
  if (data.eventDate) {
    (data as any).eventDate = new Date(data.eventDate);
  }

  try {
    // Single transaction: fetch, update, log (atomic operation)
    const event = await prisma.$transaction(async (tx) => {
      // Fetch current values
      const oldEvent = await tx.event.findUnique({ where: { id } });

      if (!oldEvent) {
        throw new Error("Evento non trovato");
      }

      // Perform update
      const updatedEvent = await tx.event.update({ where: { id }, data });

      // Log within same transaction
      await tx.auditLog.create({
        data: {
          userId: (session.user as any).id,
          action: "UPDATE",
          entityType: "events",
          entityId: id,
          oldValues: oldEvent as any,
          newValues: updatedEvent as any,
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      });

      return updatedEvent;
    }, {
      maxWait: 5000,
      timeout: 10000,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Errore durante l'aggiornamento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Single transaction: fetch, delete, log (atomic operation)
    await prisma.$transaction(async (tx) => {
      // Fetch current values
      const event = await tx.event.findUnique({ where: { id } });

      if (!event) {
        throw new Error("Evento non trovato");
      }

      // Perform delete
      await tx.event.delete({ where: { id } });

      // Log within same transaction
      await tx.auditLog.create({
        data: {
          userId: (session.user as any).id,
          action: "DELETE",
          entityType: "events",
          entityId: id,
          oldValues: event as any,
          newValues: null,
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      });
    }, {
      maxWait: 5000,
      timeout: 10000,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Errore durante l'eliminazione" },
      { status: 500 }
    );
  }
}
