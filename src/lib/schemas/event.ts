import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Titolo obbligatorio").max(200),
  description: z.string().min(1, "Descrizione obbligatoria"),
  eventDate: z.string().datetime("Data non valida"),
  eventTime: z.string().optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  registrationOpen: z.boolean().default(false),
  maxParticipants: z.number().int().positive().optional().nullable(),
});

export const updateEventSchema = createEventSchema.partial();

type CreateEventInput = z.infer<typeof createEventSchema>;
type UpdateEventInput = z.infer<typeof updateEventSchema>;
