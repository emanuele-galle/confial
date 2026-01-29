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

    // Execute import with SSE streaming (Task 2)
    // This will be implemented in Task 2
    return NextResponse.json(
      { error: "Esecuzione non ancora implementata" },
      { status: 501 }
    );
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}
