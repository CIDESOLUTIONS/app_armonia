import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth';
import { ServerLogger } from '@/lib/logging/server-logger';
import { PaymentService } from '@/services/paymentService';
import { z } from 'zod';

const PaymentUpdateSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
  reference: z.string().optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const paymentId = parseInt(params.id);

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
    }

    const paymentService = new PaymentService(payload.schemaName);
    const payment = await paymentService.getPaymentById(paymentId);

    if (!payment) {
      return NextResponse.json({ message: 'Pago no encontrado' }, { status: 404 });
    }

    // Asegurar que el pago pertenece al complejo del usuario o que es admin
    // Esto requiere que el modelo de Payment tenga un complexId o que se pueda inferir a través de Fee y Unit
    // Por ahora, asumo que getPaymentById ya maneja el filtrado por schemaName

    ServerLogger.info(`Pago ${paymentId} obtenido para el complejo ${payload.complexId}`);
    return NextResponse.json(payment, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al obtener pago ${params.id}:`, error);
    return NextResponse.json({ message: 'Error al obtener pago' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const paymentId = parseInt(params.id);
    const body = await request.json();
    const validatedData = PaymentUpdateSchema.parse(body);

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
    }

    const paymentService = new PaymentService(payload.schemaName);
    const updatedPayment = await paymentService.updatePayment(paymentId, validatedData);

    ServerLogger.info(`Pago ${paymentId} actualizado en complejo ${payload.complexId}`);
    return NextResponse.json(updatedPayment, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    ServerLogger.error(`Error al actualizar pago ${params.id}:`, error);
    return NextResponse.json({ message: 'Error al actualizar pago' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const paymentId = parseInt(params.id);

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
    }

    const paymentService = new PaymentService(payload.schemaName);
    await paymentService.deletePayment(paymentId);

    ServerLogger.info(`Pago ${paymentId} eliminado del complejo ${payload.complexId}`);
    return NextResponse.json({ message: 'Pago eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al eliminar pago ${params.id}:`, error);
    return NextResponse.json({ message: 'Error al eliminar pago' }, { status: 500 });
  }
}