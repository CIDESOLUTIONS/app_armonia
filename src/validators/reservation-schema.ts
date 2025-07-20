import * as z from "zod";

export const reservationSchema = z
  .object({
    commonAreaId: z.number().int().positive("El área común es requerida."),
    title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
    description: z.string().optional(),
    startDateTime: z
      .string()
      .min(1, "La fecha y hora de inicio son requeridas."),
    endDateTime: z.string().min(1, "La fecha y hora de fin son requeridas."),
    attendees: z
      .number()
      .int()
      .min(1, "El número de asistentes debe ser al menos 1.")
      .optional(),
    requiresPayment: z.boolean().optional(),
    paymentAmount: z
      .number()
      .positive("El monto de pago debe ser positivo.")
      .optional(),
  })
  .refine((data) => new Date(data.endDateTime) > new Date(data.startDateTime), {
    message: "La fecha y hora de fin deben ser posteriores a la de inicio.",
    path: ["endDateTime"],
  });

export type ReservationFormValues = z.infer<typeof reservationSchema>;
