import * as z from "zod";

export const optionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "El texto de la opción es requerido."),
  votes: z.number().optional(),
});

export const questionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "El texto de la pregunta es requerido."),
  options: z.array(optionSchema).min(1, "Al menos una opción es requerida."),
});

export const surveySchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres."),
  status: z.enum(["active", "completed", "draft"]),
  startDate: z.string().min(1, "La fecha de inicio es requerida."),
  endDate: z.string().min(1, "La fecha de fin es requerida."),
  questions: z
    .array(questionSchema)
    .min(1, "Al menos una pregunta es requerida."),
});

export type SurveyFormValues = z.infer<typeof surveySchema>;
export type QuestionFormValues = z.infer<typeof questionSchema>;
export type OptionFormValues = z.infer<typeof optionSchema>;
