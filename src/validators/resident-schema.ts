import { z } from "zod";

export const residentSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido." }),
  email: z.string().email({ message: "Debe ser un email válido." }).optional(),
  phone: z.string().optional(),
  idNumber: z.string().optional(),
  idType: z.string().optional(),
  propertyId: z
    .number()
    .min(1, { message: "El ID de propiedad es requerido." }),
  userId: z.number().optional(),
  isOwner: z.boolean().optional(),
  relationshipWithOwner: z.string().optional(),
  isActive: z.boolean(),
});

export type ResidentFormValues = z.infer<typeof residentSchema>;
