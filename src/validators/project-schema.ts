import * as z from "zod";

export const projectSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres."),
  startDate: z.string().min(1, "La fecha de inicio es requerida."),
  endDate: z.string().min(1, "La fecha de fin es requerida."),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  budget: z.number().positive("El presupuesto debe ser un número positivo."),
  collectedFunds: z.number().min(0, "Los fondos recaudados no pueden ser negativos."),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
