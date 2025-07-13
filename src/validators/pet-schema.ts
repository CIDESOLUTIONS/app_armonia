
import { z } from 'zod';

export const petSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido." }),
  species: z.string().min(1, { message: "La especie es requerida." }),
  breed: z.string().min(1, { message: "La raza es requerida." }),
  ownerName: z.string().min(1, { message: "El nombre del propietario es requerido." }),
  propertyId: z.number().min(1, { message: "El ID de propiedad es requerido." }),
  isActive: z.boolean(),
});

export type PetFormValues = z.infer<typeof petSchema>;
