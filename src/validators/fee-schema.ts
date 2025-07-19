import * as z from "zod";

export const feeSchema = z.object({
  title: z.string().min(3, "El título es requerido."),
  description: z.string().optional(),
  amount: z.number().positive("El monto debe ser un número positivo."),
  dueDate: z.string().min(1, "La fecha de vencimiento es requerida."),
  type: z.enum(["ORDINARY", "EXTRAORDINARY", "FINE"]),
  propertyId: z.number().int().positive("La propiedad es requerida.").optional(),
  unitId: z.number().int().positive("La unidad es requerida.").optional(),
  residentId: z.number().int().positive("El residente es requerido.").optional(),
});

export type FeeFormValues = z.infer<typeof feeSchema>;
