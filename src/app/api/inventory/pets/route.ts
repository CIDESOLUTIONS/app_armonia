import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';

const PetSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  species: z.string().min(1, "La especie es requerida."),
  breed: z.string().min(1, "La raza es requerida."),
  ownerName: z.string().min(1, "El nombre del propietario es requerido."),
  propertyId: z.number().int().positive("ID de propiedad inválido."),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const tenantPrisma = getPrisma(payload.schemaName);
    const pets = await tenantPrisma.pet.findMany({
      include: {
        property: { select: { unitNumber: true } },
      },
    });

    const petsWithUnitNumber = pets.map(pet => ({
      ...pet,
      unitNumber: pet.property?.unitNumber || 'N/A',
    }));

    ServerLogger.info(`Mascotas listadas para el complejo ${payload.complexId}`);
    return NextResponse.json(petsWithUnitNumber, { status: 200 });
  } catch (error) {
    ServerLogger.error('Error al obtener mascotas:', error);
    return NextResponse.json({ message: 'Error al obtener mascotas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const body = await request.json();
    const validatedData = PetSchema.parse(body);

    const tenantPrisma = getPrisma(payload.schemaName);
    const newPet = await tenantPrisma.pet.create({ data: validatedData });

    ServerLogger.info(`Mascota creada: ${newPet.name} en complejo ${payload.complexId}`);
    return NextResponse.json(newPet, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    ServerLogger.error('Error al crear mascota:', error);
    return NextResponse.json({ message: 'Error al crear mascota' }, { status: 500 });
  }
}


