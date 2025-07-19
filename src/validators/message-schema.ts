import * as z from "zod";

export const messageSchema = z.object({
  content: z.string().min(1, "El mensaje no puede estar vacío."),
  // attachments: z.array(z.instanceof(File)).optional(), // Si se implementan adjuntos
});

export type MessageFormValues = z.infer<typeof messageSchema>;
