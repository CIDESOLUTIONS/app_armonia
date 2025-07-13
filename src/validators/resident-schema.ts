
import { z } from 'zod';

export const residentSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido." }),
  email: z.string().email({ message: "Debe ser un email válido." }),
  phone: z.string().optional(),
  propertyId: z.number().min(1, { message: "El ID de propiedad es requerido." }),
  role: z.enum(['RESIDENT', 'OWNER', 'TENANT'], { message: "El rol es requerido." }),
  isActive: z.boolean(),
});

export type ResidentFormValues = z.infer<typeof residentSchema>;
