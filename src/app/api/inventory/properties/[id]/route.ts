import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';

const PropertyUpdateSchema = z.object({
  unitNumber: z.string().min(1, "El número de unidad es requerido.").optional(),
  address: z.string().min(1, "La dirección es requerida.").optional(),
  type: z.string().min(1, "El tipo es requerido.").optional(),
  area: z.number().min(0, "El área debe ser un número positivo.").optional(),
  bedrooms: z.number().int().min(0, "El número de habitaciones debe ser un entero positivo.").optional(),
  bathrooms: z.number().min(0, "El número de baños debe ser un número positivo.").optional(),
  parkingSpaces: z.number().int().min(0, "El número de parqueaderos debe ser un entero positivo.").optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const id = parseInt(params.id);
    const updateData = await request.json();
    const validatedData = PropertyUpdateSchema.parse(updateData);

    const tenantPrisma = getPrisma(payload.schemaName);
    const updatedProperty = await tenantPrisma.property.update({
      where: { id },
      data: validatedData,
    });

    ServerLogger.info(`Propiedad actualizada: ${updatedProperty.unitNumber} en complejo ${payload.complexId}`);
    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    ServerLogger.error('Error al actualizar propiedad:', error);
    return NextResponse.json({ message: 'Error al actualizar propiedad' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const id = parseInt(params.id);

    const tenantPrisma = getPrisma(payload.schemaName);
    await tenantPrisma.property.delete({ where: { id } });

    ServerLogger.info(`Propiedad eliminada: ID ${id} en complejo ${payload.complexId}`);
    return NextResponse.json({ message: 'Propiedad eliminada exitosamente' }, { status: 200 });
  } catch (error) {
    ServerLogger.error('Error al eliminar propiedad:', error);
    return NextResponse.json({ message: 'Error al eliminar propiedad' }, { status: 500 });
  }
}
