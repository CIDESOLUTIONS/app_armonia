import * as z from "zod";

export const serviceProviderSchema = z.object({
  name: z.string().min(3, "El nombre es requerido."),
  category: z.string().min(1, "La categoría es requerida."),
  description: z.string().optional(),
  contact: z.string().min(5, "El contacto es requerido."),
  logoUrl: z.string().url("URL de logo inválida.").optional().or(z.literal("")),
});

export type ServiceProviderFormValues = z.infer<typeof serviceProviderSchema>;
