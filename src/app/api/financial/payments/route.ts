import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth';
import { ServerLogger } from '@/lib/logging/server-logger';
import { PaymentService } from '@/services/paymentService';
import { z } from 'zod';

const PaymentFilterSchema = z.object({
  status: z.string().optional(),
  paymentMethod: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortField: z.enum(['paymentDate', 'amount', 'unitNumber', 'status']).default('paymentDate'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get('status') || undefined,
      paymentMethod: searchParams.get('paymentMethod') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      sortField: (searchParams.get('sortField') as 'paymentDate' | 'amount' | 'unitNumber' | 'status') || undefined,
      sortDirection: (searchParams.get('sortDirection') as 'asc' | 'desc') || undefined,
    };

    const validatedFilters = PaymentFilterSchema.parse(filters);

    const paymentService = new PaymentService(payload.schemaName);
    const payments = await paymentService.getPayments(validatedFilters);

    ServerLogger.info(`Pagos listados para el complejo ${payload.complexId}`);
    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    ServerLogger.error('Error al obtener pagos:', error);
    return NextResponse.json({ message: 'Error al obtener pagos' }, { status: 500 });
  }
}