import * as z from "zod";

export const userProfileSchema = z.object({
  name: z.string().min(3, "El nombre es requerido."),
  email: z.string().email("Email inválido."),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
