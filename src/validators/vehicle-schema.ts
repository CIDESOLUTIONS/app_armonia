import { z } from "zod";

export const vehicleSchema = z.object({
  licensePlate: z.string().min(1, { message: "La placa es requerida." }),
  brand: z.string().min(1, { message: "La marca es requerida." }),
  model: z.string().min(1, { message: "El modelo es requerido." }),
  year: z.number().min(1900, { message: "El año debe ser válido." }),
  color: z.string().min(1, { message: "El color es requerido." }),
  type: z.enum(["CAR", "MOTORCYCLE", "BICYCLE", "OTHER"], {
    message: "El tipo de vehículo es requerido.",
  }),
  parkingSpot: z.string().optional(),
  notes: z.string().optional(),
  propertyId: z
    .number()
    .min(1, { message: "El ID de propiedad es requerido." }),
  residentId: z
    .number()
    .min(1, { message: "El ID de residente es requerido." }),
  isActive: z.boolean(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
