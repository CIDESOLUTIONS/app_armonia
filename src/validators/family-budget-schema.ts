import * as z from "zod";

export const familyBudgetEntrySchema = z.object({
  description: z.string().min(3, "La descripción es requerida."),
  amount: z.number().positive("El monto debe ser un número positivo."),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "La categoría es requerida."),
  date: z.string().min(1, "La fecha es requerida."),
});

export type FamilyBudgetEntryFormValues = z.infer<
  typeof familyBudgetEntrySchema
>;
