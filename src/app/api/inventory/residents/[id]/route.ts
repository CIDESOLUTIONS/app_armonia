import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';

const ResidentUpdateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido.").optional(),
  email: z.string().email("Email inválido.").optional(),
  phone: z.string().optional(),
  propertyId: z.number().int().positive("ID de propiedad inválido.").optional(),
  role: z.enum(['RESIDENT', 'OWNER', 'TENANT'], { message: "Rol inválido." }).optional(),
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
    const validatedData = ResidentUpdateSchema.parse(updateData);

    const tenantPrisma = getPrisma(payload.schemaName);
    const updatedResident = await tenantPrisma.resident.update({
      where: { id },
      data: validatedData,
    });

    ServerLogger.info(`Residente actualizado: ${updatedResident.name} en complejo ${payload.complexId}`);
    return NextResponse.json(updatedResident, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    ServerLogger.error('Error al actualizar residente:', error);
    return NextResponse.json({ message: 'Error al actualizar residente' }, { status: 500 });
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
    await tenantPrisma.resident.delete({ where: { id } });

    ServerLogger.info(`Residente eliminado: ID ${id} en complejo ${payload.complexId}`);
    return NextResponse.json({ message: 'Residente eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    ServerLogger.error('Error al eliminar residente:', error);
    return NextResponse.json({ message: 'Error al eliminar residente' }, { status: 500 });
  }
}
