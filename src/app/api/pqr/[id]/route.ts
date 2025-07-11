import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';

const PQRUpdateSchema = z.object({
  subject: z.string().min(1, "El asunto es requerido.").optional(),
  description: z.string().min(1, "La descripción es requerida.").optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'REJECTED']).default('OPEN').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM').optional(),
  category: z.string().min(1, "La categoría es requerida.").optional(),
  assignedToId: z.number().int().positive("ID de asignado inválido.").optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'STAFF', 'RESIDENT']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const pqrId = parseInt(params.id);

    const tenantPrisma = getPrisma(payload.schemaName);
    const pqr = await tenantPrisma.pQR.findUnique({
      where: { id: pqrId, complexId: payload.complexId },
      include: {
        reportedBy: { select: { name: true } },
        assignedTo: { select: { name: true } },
        comments: { include: { author: { select: { name: true } } } },
      },
    });

    if (!pqr) {
      return NextResponse.json({ message: 'PQR no encontrada' }, { status: 404 });
    }

    // Si es residente, asegurar que solo puede ver sus propios PQRs
    if (payload.role === 'RESIDENT' && pqr.reportedById !== payload.id) {
      return NextResponse.json({ message: 'Permisos insuficientes' }, { status: 403 });
    }

    const formattedPQR = {
      ...pqr,
      reportedByName: pqr.reportedBy?.name || 'N/A',
      assignedToName: pqr.assignedTo?.name || 'N/A',
      comments: pqr.comments.map(comment => ({
        ...comment,
        authorName: comment.author?.name || 'N/A',
      })),
    };

    ServerLogger.info(`PQR ${pqrId} obtenida para el complejo ${payload.complexId}`);
    return NextResponse.json(formattedPQR, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al obtener PQR ${params.id}:`, error);
    return NextResponse.json({ message: 'Error al obtener PQR' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'STAFF']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const pqrId = parseInt(params.id);
    const body = await request.json();
    const validatedData = PQRUpdateSchema.parse(body);

    const tenantPrisma = getPrisma(payload.schemaName);
    const updatedPQR = await tenantPrisma.pQR.update({
      where: { id: pqrId, complexId: payload.complexId },
      data: validatedData,
    });

    ServerLogger.info(`PQR ${pqrId} actualizada en complejo ${payload.complexId}`);
    return NextResponse.json(updatedPQR, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    ServerLogger.error(`Error al actualizar PQR ${params.id}:`, error);
    return NextResponse.json({ message: 'Error al actualizar PQR' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const pqrId = parseInt(params.id);

    const tenantPrisma = getPrisma(payload.schemaName);
    await tenantPrisma.pQR.delete({
      where: { id: pqrId, complexId: payload.complexId },
    });

    ServerLogger.info(`PQR ${pqrId} eliminada del complejo ${payload.complexId}`);
    return NextResponse.json({ message: 'PQR eliminada exitosamente' }, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al eliminar PQR ${params.id}:`, error);
    return NextResponse.json({ message: 'Error al eliminar PQR' }, { status: 500 });
  }
}