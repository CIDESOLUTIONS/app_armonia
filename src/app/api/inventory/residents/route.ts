import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';

const ResidentSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  email: z.string().email("Email inválido."),
  phone: z.string().optional(),
  propertyId: z.number().int().positive("ID de propiedad inválido."),
  role: z.enum(['RESIDENT', 'OWNER', 'TENANT'], { message: "Rol inválido." }),
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
    const residents = await tenantPrisma.resident.findMany({
      include: {
        property: { select: { unitNumber: true } },
      },
    });

    const residentsWithUnitNumber = residents.map(resident => ({
      ...resident,
      unitNumber: resident.property?.unitNumber || 'N/A',
    }));

    ServerLogger.info(`Residentes listados para el complejo ${payload.complexId}`);
    return NextResponse.json(residentsWithUnitNumber, { status: 200 });
  } catch (error) {
    ServerLogger.error('Error al obtener residentes:', error);
    return NextResponse.json({ message: 'Error al obtener residentes' }, { status: 500 });
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
    const validatedData = ResidentSchema.parse(body);

    const tenantPrisma = getPrisma(payload.schemaName);
    const newResident = await tenantPrisma.resident.create({ data: validatedData });

    ServerLogger.info(`Residente creado: ${newResident.name} en complejo ${payload.complexId}`);
    return NextResponse.json(newResident, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    ServerLogger.error('Error al crear residente:', error);
    return NextResponse.json({ message: 'Error al crear residente' }, { status: 500 });
  }
}


