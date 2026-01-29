import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseCSV, newsSchema, eventSchema } from "@/lib/csv";
import type { NewsImport, EventImport } from "@/lib/csv";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type ValidationResult = {
  valid: Array<NewsImport | EventImport>;
  invalid: Array<{ row: number; errors: string[] }>;
};

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const entityType = formData.get("entityType") as string | null;
    const executeParam = request.nextUrl.searchParams.get("execute");
    const shouldExecute = executeParam === "true";

    // Validation
    if (!file) {
      return NextResponse.json({ error: "File CSV mancante" }, { status: 400 });
    }

    if (!entityType || !["news", "events"].includes(entityType)) {
      return NextResponse.json(
        { error: "entityType deve essere 'news' o 'events'" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File troppo grande (max 5MB)" },
        { status: 400 }
      );
    }

    // Parse CSV
    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length < 2) {
      return NextResponse.json(
        { error: "File CSV vuoto o invalido" },
        { status: 400 }
      );
    }

    // Extract headers and data
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Validate rows
    const schema = entityType === "news" ? newsSchema : eventSchema;
    const validationResult: ValidationResult = {
      valid: [],
      invalid: [],
    };

    for (let i = 0; i < dataRows.length; i++) {
      const rowData = dataRows[i];
      const rowObject: Record<string, string> = {};

      // Map CSV columns to object
      headers.forEach((header, index) => {
        rowObject[header] = rowData[index] || "";
      });

      // Validate with Zod
      const parseResult = schema.safeParse(rowObject);

      if (parseResult.success) {
        validationResult.valid.push(parseResult.data);
      } else {
        const errors = parseResult.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
        validationResult.invalid.push({ row: i + 2, errors }); // +2 for header row + 1-indexed
      }
    }

    // If no valid rows, return error
    if (validationResult.valid.length === 0) {
      return NextResponse.json(
        {
          error: "Nessuna riga valida trovata",
          invalid: validationResult.invalid,
        },
        { status: 400 }
      );
    }

    // If not executing, return validation results
    if (!shouldExecute) {
      return NextResponse.json({
        validCount: validationResult.valid.length,
        invalidCount: validationResult.invalid.length,
        invalid: validationResult.invalid.length > 0 ? validationResult.invalid : undefined,
      });
    }

    // Execute import with SSE streaming
    if (!session.user?.id) {
      return NextResponse.json({ error: "User ID mancante" }, { status: 401 });
    }

    const userId = session.user.id;
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let inserted = 0;

          // Use transaction for all-or-nothing import
          await prisma.$transaction(async (tx) => {
            for (let i = 0; i < validationResult.valid.length; i++) {
              const row = validationResult.valid[i];

              // Progress event
              const progressEvent = JSON.stringify({
                type: "progress",
                current: i + 1,
                total: validationResult.valid.length,
                item: "title" in row ? row.title : "",
              });
              controller.enqueue(encoder.encode(`data: ${progressEvent}\n\n`));

              // Insert based on entity type
              if (entityType === "news") {
                const newsRow = row as NewsImport;
                // Generate slug from title
                const slug =
                  newsRow.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "") +
                  "-" +
                  Math.random().toString(36).substr(2, 6);

                await tx.news.create({
                  data: {
                    title: newsRow.title,
                    slug,
                    content: newsRow.content,
                    excerpt: newsRow.excerpt || "",
                    status: newsRow.status || "DRAFT",
                    authorId: userId,
                    publishedAt: newsRow.status === "PUBLISHED" ? new Date() : null,
                  },
                });
              } else if (entityType === "events") {
                const eventRow = row as EventImport;
                // Generate slug from title
                const slug =
                  eventRow.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "") +
                  "-" +
                  Math.random().toString(36).substr(2, 6);

                await tx.event.create({
                  data: {
                    title: eventRow.title,
                    slug,
                    description: eventRow.description,
                    eventDate: new Date(eventRow.startDate),
                    eventTime: eventRow.endDate || null,
                    location: eventRow.location || "",
                    status: eventRow.status || "DRAFT",
                  },
                });
              }

              inserted++;
            }

            // Create audit log entry
            await tx.auditLog.create({
              data: {
                userId: userId,
                action: "BULK_IMPORT",
                entityType: entityType,
                newValues: JSON.stringify({ count: inserted, source: "csv" }),
              },
            });
          });

          // Success event
          const completeEvent = JSON.stringify({
            type: "complete",
            inserted,
          });
          controller.enqueue(encoder.encode(`data: ${completeEvent}\n\n`));
          controller.close();
        } catch (error) {
          // Error event (transaction will auto-rollback)
          const errorEvent = JSON.stringify({
            type: "error",
            message: error instanceof Error ? error.message : "Errore durante l'importazione",
            rollback: true,
          });
          controller.enqueue(encoder.encode(`data: ${errorEvent}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}
