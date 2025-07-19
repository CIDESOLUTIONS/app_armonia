import * as z from "zod";

export const assemblySchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres."),
  scheduledDate: z.string().min(1, "La fecha programada es requerida."),
  location: z.string().min(1, "La ubicación es requerida."),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export type AssemblyFormValues = z.infer<typeof assemblySchema>;
