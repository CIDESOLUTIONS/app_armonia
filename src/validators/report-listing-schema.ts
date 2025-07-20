import * as z from "zod";

export const reportListingSchema = z.object({
  reason: z
    .string()
    .min(10, "La razón del reporte debe tener al menos 10 caracteres."),
});

export type ReportListingFormValues = z.infer<typeof reportListingSchema>;
