import { z } from "zod";

export const propertySchema = z.object({
  unitNumber: z
    .string()
    .min(1, { message: "El número de unidad es requerido." }),
  address: z.string().min(1, { message: "La dirección es requerida." }),
  type: z.string().min(1, { message: "El tipo de propiedad es requerido." }),
  area: z.number().min(0, { message: "El área debe ser un número positivo." }),
  bedrooms: z.number().min(0, {
    message: "El número de habitaciones debe ser un número positivo.",
  }),
  bathrooms: z
    .number()
    .min(0, { message: "El número de baños debe ser un número positivo." }),
  parkingSpaces: z.number().min(0, {
    message: "El número de parqueaderos debe ser un número positivo.",
  }),
  isActive: z.boolean(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
