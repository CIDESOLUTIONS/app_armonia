
import { z } from 'zod';

export const documentSchema = z.object({
  name: z.string().min(1, { message: "El nombre del documento es requerido." }),
  file: z.any() // File object will be handled separately
    .refine((file) => file instanceof File, "El archivo es requerido.")
    .refine((file) => file.size <= 5 * 1024 * 1024, `El tamaño máximo del archivo es 5MB.`)
    .refine(
      (file) => ["application/pdf", "image/jpeg", "image/png"].includes(file.type),
      "Solo se permiten archivos PDF, JPG y PNG."
    ),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;
