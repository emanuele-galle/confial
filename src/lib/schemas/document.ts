import { z } from "zod";

export const uploadDocumentSchema = z.object({
  title: z.string().min(1, "Titolo obbligatorio").max(200),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  file: z.instanceof(File).refine(
    (file) => file.type === "application/pdf",
    "Solo file PDF sono permessi"
  ).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB
    "File troppo grande (max 10MB)"
  ),
});

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
