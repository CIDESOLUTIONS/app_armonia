import { z } from "zod";

export const petSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido." }),
  type: z.enum(["DOG", "CAT", "BIRD", "OTHER"], {
    message: "El tipo de mascota es requerido.",
  }),
  breed: z.string().optional(),
  age: z
    .number()
    .min(0, { message: "La edad debe ser un número positivo." })
    .optional(),
  weight: z
    .number()
    .min(0, { message: "El peso debe ser un número positivo." })
    .optional(),
  color: z.string().optional(),
  vaccinated: z.boolean(),
  vaccineExpiryDate: z.string().optional(),
  notes: z.string().optional(),
  propertyId: z
    .number()
    .min(1, { message: "El ID de propiedad es requerido." }),
  residentId: z
    .number()
    .min(1, { message: "El ID de residente es requerido." }),
  isActive: z.boolean(),
});

export type PetFormValues = z.infer<typeof petSchema>;
