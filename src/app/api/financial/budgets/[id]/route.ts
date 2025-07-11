import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth';
import { ServerLogger } from '@/lib/logging/server-logger';
import { BudgetService } from '@/services/budgetService';
import { z } from 'zod';

const BudgetUpdateSchema = z.object({
  year: z.number().int().min(2000, "El año debe ser un número válido.").optional(),
  status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED']).optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    id: z.number().int().optional(), // ID es opcional para nuevos ítems
    category: z.string().min(1, "La categoría es requerida."),
    description: z.string().optional(),
    amount: z.number().min(0, "El monto debe ser un número positivo."),
    type: z.enum(['INCOME', 'EXPENSE']), 
  })).optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const budgetId = parseInt(params.id);

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
    }

    const budgetService = new BudgetService(payload.schemaName);
    const budget = await budgetService.getBudgetById(budgetId, payload.complexId);

    if (!budget) {
      return NextResponse.json({ message: 'Presupuesto no encontrado' }, { status: 404 });
    }

    ServerLogger.info(`Presupuesto ${budgetId} obtenido para el complejo ${payload.complexId}`);
    return NextResponse.json(budget, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al obtener presupuesto ${params.id}:`, error);
    return NextResponse.json({ message: 'Error al obtener presupuesto' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const budgetId = parseInt(params.id);
    const body = await request.json();
    const validatedData = BudgetUpdateSchema.parse(body);

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
    }

    const budgetService = new BudgetService(payload.schemaName);
    const updatedBudget = await budgetService.updateBudget(budgetId, payload.complexId, validatedData);

    ServerLogger.info(`Presupuesto ${budgetId} actualizado en complejo ${payload.complexId}`);
    return NextResponse.json(updatedBudget, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    ServerLogger.error(`Error al actualizar presupuesto ${params.id}:`, error);
    return NextResponse.json({ message: 'Error al actualizar presupuesto' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const budgetId = parseInt(params.id);

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
    }

    const budgetService = new BudgetService(payload.schemaName);
    await budgetService.deleteBudget(budgetId, payload.complexId);

    ServerLogger.info(`Presupuesto ${budgetId} eliminado del complejo ${payload.complexId}`);
    return NextResponse.json({ message: 'Presupuesto eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al eliminar presupuesto ${params.id}:`, error);
    return NextResponse.json({ message: 'Error al eliminar presupuesto' }, { status: 500 });
  }
}
