import * as z from "zod";

export const complexInfoSchema = z.object({
  name: z.string().min(3, "El nombre es requerido."),
  schemaName: z.string().min(3, "El nombre del esquema es requerido."),
  totalUnits: z
    .number()
    .min(1, "El número total de unidades debe ser al menos 1."),
  adminEmail: z.string().email("Email del administrador inválido."),
  adminName: z.string().min(3, "El nombre del administrador es requerido."),
  adminPhone: z.string().optional(),
  address: z.string().min(5, "La dirección es requerida."),
  city: z.string().min(3, "La ciudad es requerida."),
  state: z.string().min(3, "El departamento/estado es requerido."),
  country: z.string().min(3, "El país es requerido."),
  propertyTypes: z.array(z.string()).optional(),
  legalName: z.string().optional(),
  nit: z.string().optional(),
  registrationDate: z.string().optional(),
});

export type ComplexInfoFormValues = z.infer<typeof complexInfoSchema>;
