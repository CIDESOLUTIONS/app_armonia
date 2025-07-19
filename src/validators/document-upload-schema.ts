import * as z from "zod";

export const documentUploadSchema = z.object({
  file: z.any()
    .refine((file) => file instanceof File, "El archivo es requerido.")
    .refine((file) => file.size <= 5 * 1024 * 1024, `El tamaño máximo del archivo es 5MB.`)
    .refine(
      (file) => ["application/pdf", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"].includes(file.type),
      "Solo se permiten archivos PDF, imágenes, Excel y Word."
    ),
});

export type DocumentUploadFormValues = z.infer<typeof documentUploadSchema>;
