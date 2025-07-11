import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';

const PQRAssignSchema = z.object({
  assignedToId: z.number().int().positive("ID de asignado inválido."),
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const pqrId = parseInt(params.id);
    const body = await request.json();
    const validatedData = PQRAssignSchema.parse(body);

    const tenantPrisma = getPrisma(payload.schemaName);
    const updatedPQR = await tenantPrisma.pQR.update({
      where: { id: pqrId, complexId: payload.complexId },
      data: { assignedToId: validatedData.assignedToId },
    });

    ServerLogger.info(`PQR ${pqrId} asignada a ${validatedData.assignedToId} por ${payload.email}`);
    return NextResponse.json(updatedPQR, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    ServerLogger.error(`Error al asignar PQR ${params.id}:`, error);
    return NextResponse.json({ message: 'Error al asignar PQR' }, { status: 500 });
  }
}
