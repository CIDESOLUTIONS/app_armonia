import { z } from "zod";

export const pqrSchema = z.object({
  subject: z.string().min(1, { message: "El asunto es requerido." }),
  description: z.string().min(1, { message: "La descripción es requerida." }),
  category: z.string().min(1, { message: "La categoría es requerida." }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  reportedById: z.number(),
});

export type PqrFormValues = z.infer<typeof pqrSchema>;
