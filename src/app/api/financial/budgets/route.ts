import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth';
import { ServerLogger } from '@/lib/logging/server-logger';
import { BudgetService } from '@/services/budgetService';
import { z } from 'zod';

const BudgetSchema = z.object({
  year: z.number().int().min(2000, "El año debe ser un número válido."),
  status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED']).default('DRAFT'),
  notes: z.string().optional(),
  items: z.array(z.object({
    category: z.string().min(1, "La categoría es requerida."),
    description: z.string().optional(),
    amount: z.number().min(0, "El monto debe ser un número positivo."),
    type: z.enum(['INCOME', 'EXPENSE']), 
  })).min(1, "Se requiere al menos un ítem de presupuesto."),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
    }

    const budgetService = new BudgetService(payload.schemaName);
    const budgets = await budgetService.getBudgets(payload.complexId);

    ServerLogger.info(`Presupuestos listados para el complejo ${payload.complexId}`);
    return NextResponse.json(budgets, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    ServerLogger.error('Error al obtener presupuestos:', error);
    return NextResponse.json({ message: 'Error al obtener presupuestos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = BudgetSchema.parse(body);

    const budgetService = new BudgetService(payload.schemaName);
    const newBudget = await budgetService.createBudget(payload.complexId, validatedData);

    ServerLogger.info(`Presupuesto creado: ${newBudget.year} en complejo ${payload.complexId}`);
    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    ServerLogger.error('Error al crear presupuesto:', error);
    return NextResponse.json({ message: 'Error al crear presupuesto' }, { status: 500 });
  }
}
