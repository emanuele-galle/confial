import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Email non valida"),
  name: z.string().min(1, "Nome obbligatorio").max(100),
  password: z.string().min(8, "Password deve essere almeno 8 caratteri"),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]).default("ADMIN"),
});

export const updateUserSchema = z.object({
  email: z.string().email("Email non valida").optional(),
  name: z.string().min(1, "Nome obbligatorio").max(100).optional(),
  password: z.string().min(8, "Password deve essere almeno 8 caratteri").optional(),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]).optional(),
});

type CreateUserInput = z.infer<typeof createUserSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;
