import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const MAX_BATCH_SIZE = 100;

const batchSchema = z.object({
  action: z.enum(["delete", "publish", "unpublish", "archive"]),
  entityType: z.enum(["news", "events", "documents"]),
  ids: z.array(z.string()).min(1).max(MAX_BATCH_SIZE),
});

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validationResult = batchSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { action, entityType, ids } = validationResult.data;

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    // Execute batch operation in transaction
    try {
      await prisma.$transaction(async (tx) => {
        for (const id of ids) {
          try {
            switch (entityType) {
              case "news":
                await executeBatchNews(tx, action, id);
                break;
              case "events":
                await executeBatchEvents(tx, action, id);
                break;
              case "documents":
                await executeBatchDocuments(tx, action, id);
                break;
            }
            success++;
          } catch (error) {
            failed++;
            errors.push(`${id}: ${error instanceof Error ? error.message : "Errore sconosciuto"}`);
          }
        }
      });
    } catch (error) {
      console.error("Batch operation error:", error);
      return NextResponse.json(
        { error: "Errore durante l'operazione batch" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Batch API error:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}

// Helper functions for batch operations
async function executeBatchNews(tx: any, action: string, id: string) {
  switch (action) {
    case "delete":
      await tx.news.delete({ where: { id } });
      break;
    case "publish":
      await tx.news.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });
      break;
    case "unpublish":
      await tx.news.update({
        where: { id },
        data: { status: "DRAFT" },
      });
      break;
    case "archive":
      await tx.news.update({
        where: { id },
        data: { status: "ARCHIVED" },
      });
      break;
  }
}

async function executeBatchEvents(tx: any, action: string, id: string) {
  switch (action) {
    case "delete":
      await tx.event.delete({ where: { id } });
      break;
    case "publish":
      await tx.event.update({
        where: { id },
        data: { status: "PUBLISHED" },
      });
      break;
    case "unpublish":
      await tx.event.update({
        where: { id },
        data: { status: "DRAFT" },
      });
      break;
    case "archive":
      await tx.event.update({
        where: { id },
        data: { status: "ARCHIVED" },
      });
      break;
  }
}

async function executeBatchDocuments(tx: any, action: string, id: string) {
  switch (action) {
    case "delete":
      // Note: MinIO deletion handled separately (not in transaction)
      await tx.document.delete({ where: { id } });
      break;
    default:
      throw new Error("Azione non supportata per documenti");
  }
}
