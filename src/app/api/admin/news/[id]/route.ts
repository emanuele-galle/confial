import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateNewsSchema } from "@/lib/schemas/news";
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

  const news = await prisma.news.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!news) {
    return NextResponse.json({ error: "News non trovata" }, { status: 404 });
  }

  return NextResponse.json({ data: news });
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
  const validationResult = updateNewsSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: validationResult.error.flatten() },
      { status: 400 }
    );
  }

  try {
    // Single transaction: fetch, update, log (atomic operation)
    const news = await prisma.$transaction(async (tx) => {
      // Fetch current values
      const oldNews = await tx.news.findUnique({ where: { id } });

      if (!oldNews) {
        throw new Error("News non trovata");
      }

      // Perform update
      const updatedNews = await tx.news.update({
        where: { id },
        data: validationResult.data,
      });

      // Log within same transaction
      await tx.auditLog.create({
        data: {
          userId: (session.user as any).id,
          action: "UPDATE",
          entityType: "news",
          entityId: id,
          oldValues: oldNews as any,
          newValues: updatedNews as any,
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      });

      return updatedNews;
    }, {
      maxWait: 5000,
      timeout: 10000,
    });

    return NextResponse.json(news);
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
      const news = await tx.news.findUnique({ where: { id } });

      if (!news) {
        throw new Error("News non trovata");
      }

      // Perform delete
      await tx.news.delete({ where: { id } });

      // Log within same transaction
      await tx.auditLog.create({
        data: {
          userId: (session.user as any).id,
          action: "DELETE",
          entityType: "news",
          entityId: id,
          oldValues: news as any,
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
