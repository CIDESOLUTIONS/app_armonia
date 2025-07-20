import * as z from "zod";

export const communityEventSchema = z
  .object({
    title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
    description: z.string().optional(),
    startDateTime: z
      .string()
      .min(1, "La fecha y hora de inicio son requeridas."),
    endDateTime: z.string().min(1, "La fecha y hora de fin son requeridas."),
    location: z.string().min(1, "La ubicación es requerida."),
    isPublic: z.boolean(),
    // type: z.enum(["general", "social", "maintenance", "emergency"]), // Uncomment and adjust as needed
    // targetRoles: z.array(z.string()).optional(), // Uncomment and adjust as needed
    // maxAttendees: z.number().int().positive().optional(), // Uncomment and adjust as needed
  })
  .refine((data) => new Date(data.endDateTime) > new Date(data.startDateTime), {
    message: "La fecha y hora de fin deben ser posteriores a la de inicio.",
    path: ["endDateTime"],
  });

export type CommunityEventFormValues = z.infer<typeof communityEventSchema>;
