import * as z from "zod";

export const commonAssetSchema = z.object({
  name: z.string().min(3, "El nombre es requerido."),
  description: z.string().optional(),
  location: z.string().min(1, "La ubicación es requerida."),
  assetType: z.string().min(1, "El tipo de activo es requerido."),
  purchaseDate: z.string().optional(),
  value: z.number().min(0, "El valor debe ser un número positivo.").optional(),
  isActive: z.boolean(),
});

export type CommonAssetFormValues = z.infer<typeof commonAssetSchema>;
