import * as z from "zod";

export const packageSchema = z.object({
  trackingNumber: z.string().min(3, "El número de seguimiento es requerido."),
  recipientUnit: z.string().min(1, "La unidad destinataria es requerida."),
  sender: z.string().optional(),
  description: z.string().optional(),
});

export type PackageFormValues = z.infer<typeof packageSchema>;
