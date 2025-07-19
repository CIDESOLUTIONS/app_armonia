import * as z from "zod";

export const visitorSchema = z.object({
  name: z.string().min(3, "El nombre es requerido."),
  documentType: z.string().min(1, "El tipo de documento es requerido."),
  documentNumber: z.string().min(5, "El número de documento es requerido."),
  unitId: z.number().int().positive("La unidad es requerida."),
  entryTime: z.string().min(1, "La hora de entrada es requerida."),
  exitTime: z.string().optional(),
  purpose: z.string().optional(),
  photoUrl: z.string().optional(),
});

export type VisitorFormValues = z.infer<typeof visitorSchema>;
