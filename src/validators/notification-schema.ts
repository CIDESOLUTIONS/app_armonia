import * as z from "zod";

export const notificationSchema = z.object({
  title: z.string().min(3, "El título es requerido."),
  message: z.string().min(10, "El mensaje es requerido."),
  recipientType: z.enum(["ALL", "RESIDENT", "PROPERTY", "USER"]),
  recipientId: z.string().optional(), // Optional based on recipientType
});

export type NotificationFormValues = z.infer<typeof notificationSchema>;
