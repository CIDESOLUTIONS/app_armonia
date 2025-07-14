import { z } from "zod";

export const vehicleSchema = z.object({
  licensePlate: z.string().min(1, { message: "La placa es requerida." }),
  brand: z.string().min(1, { message: "La marca es requerida." }),
  model: z.string().min(1, { message: "El modelo es requerido." }),
  color: z.string().min(1, { message: "El color es requerido." }),
  ownerName: z
    .string()
    .min(1, { message: "El nombre del propietario es requerido." }),
  propertyId: z
    .number()
    .min(1, { message: "El ID de propiedad es requerido." }),
  parkingSpace: z.string().optional(),
  isActive: z.boolean(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
