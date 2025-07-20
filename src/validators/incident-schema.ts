import * as z from "zod";

export const incidentSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres."),
  category: z.enum(["security", "maintenance", "emergency", "other"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  location: z.string().min(5, "La ubicación es requerida."),
  reportedBy: z.string().min(3, "El nombre de quien reporta es requerido."),
  attachments: z.array(z.any()).optional(), // Files will be handled separately
});

export const incidentUpdateSchema = z.object({
  content: z.string().min(10, "El contenido de la actualización es requerido."),
  status: z.enum(["reported", "in_progress", "resolved", "closed"]),
  attachments: z.array(z.any()).optional(), // Files will be handled separately
});

export type IncidentFormValues = z.infer<typeof incidentSchema>;
export type IncidentUpdateFormValues = z.infer<typeof incidentUpdateSchema>;
