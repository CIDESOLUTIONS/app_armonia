import { z } from "zod";

export const amenitySchema = z
  .object({
    name: z.string().min(1, { message: "El nombre es requerido." }),
    description: z.string().optional(),
    location: z.string().min(1, { message: "La ubicación es requerida." }),
    capacity: z
      .number()
      .min(0, { message: "La capacidad debe ser un número positivo." }),
    requiresApproval: z.boolean(),
    hasFee: z.boolean(),
    feeAmount: z.number().optional(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (
        data.hasFee &&
        (data.feeAmount === undefined || data.feeAmount === null)
      ) {
        return false; // feeAmount is required if hasFee is true
      }
      return true;
    },
    {
      message: "El costo es requerido si tiene costo.",
      path: ["feeAmount"],
    },
  );

export type AmenityFormValues = z.infer<typeof amenitySchema>;
