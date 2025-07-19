import * as z from "zod";

export const announcementSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  content: z.string().min(20, "La descripción debe tener al menos 20 caracteres."),
  publishedAt: z.string().min(1, "La fecha de publicación es requerida."),
  expiresAt: z.string().optional(),
  isActive: z.boolean(),
  targetRoles: z.array(z.string()),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
