import { z } from "zod";

/**
 * Parse CSV text into array of rows
 * Handles quoted values with commas inside
 */
export function parseCSV(text: string): string[][] {
  const lines = text.trim().split(/\r?\n/);
  const rows: string[][] = [];

  for (const line of lines) {
    // Simple CSV parser with quoted value support
    const row: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
  }

  return rows;
}

/**
 * Generate CSV text from headers and rows
 * Properly escapes values with quotes and commas
 */
export function generateCSV(headers: string[], rows: string[][]): string {
  const escapeValue = (value: string): string => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const headerRow = headers.map(escapeValue).join(",");
  const dataRows = rows.map((row) => row.map(escapeValue).join(","));

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Zod schema for News CSV import
 */
export const newsSchema = z.object({
  title: z.string().min(1, "Titolo obbligatorio"),
  content: z.string().min(1, "Contenuto obbligatorio"),
  excerpt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  category: z.string().optional(),
});

/**
 * Zod schema for Event CSV import
 */
export const eventSchema = z.object({
  title: z.string().min(1, "Titolo obbligatorio"),
  description: z.string().min(1, "Descrizione obbligatoria"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inizio non valida (formato ISO richiesto)",
  }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Data fine non valida (formato ISO richiesto)",
    }),
  location: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type NewsImport = z.infer<typeof newsSchema>;
export type EventImport = z.infer<typeof eventSchema>;
