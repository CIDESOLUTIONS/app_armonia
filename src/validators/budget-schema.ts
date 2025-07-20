import { z } from "zod";

export const budgetItemSchema = z.object({
  description: z.string().min(1, "La descripción es requerida."),
  amount: z.number().positive("El monto debe ser un número positivo."),
  type: z.enum(["INCOME", "EXPENSE"]),
});

export const budgetSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  title: z.string().min(1, "El título es requerido."),
  description: z.string().optional(),
  items: z.array(budgetItemSchema),
});

export type BudgetItemFormValues = z.infer<typeof budgetItemSchema>;
export type BudgetFormValues = z.infer<typeof budgetSchema>;
