import { z } from "zod";

export const serviceProviderSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  category: z.string().min(1, "La categoría es requerida."),
  description: z.string().optional(),
  contact: z.string().min(1, "El contacto es requerido."),
  logoUrl: z
    .string()
    .url("Debe ser una URL válida.")
    .optional()
    .or(z.literal("")),
});

export type ServiceProviderFormValues = z.infer<typeof serviceProviderSchema>;
