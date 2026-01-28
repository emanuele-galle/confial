import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(1, "Titolo obbligatorio").max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Contenuto obbligatorio"),
  coverImage: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const updateNewsSchema = createNewsSchema.partial();

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
