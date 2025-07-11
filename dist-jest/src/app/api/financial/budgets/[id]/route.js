var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NextResponse } from 'next/server';
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
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const budgetId = parseInt(params.id);
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const budgetService = new BudgetService(payload.schemaName);
            const budget = yield budgetService.getBudgetById(budgetId, payload.complexId);
            if (!budget) {
                return NextResponse.json({ message: 'Presupuesto no encontrado' }, { status: 404 });
            }
            ServerLogger.info(`Presupuesto ${budgetId} obtenido para el complejo ${payload.complexId}`);
            return NextResponse.json(budget, { status: 200 });
        }
        catch (error) {
            ServerLogger.error(`Error al obtener presupuesto ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al obtener presupuesto' }, { status: 500 });
        }
    });
}
export function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const budgetId = parseInt(params.id);
            const body = yield request.json();
            const validatedData = BudgetUpdateSchema.parse(body);
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const budgetService = new BudgetService(payload.schemaName);
            const updatedBudget = yield budgetService.updateBudget(budgetId, payload.complexId, validatedData);
            ServerLogger.info(`Presupuesto ${budgetId} actualizado en complejo ${payload.complexId}`);
            return NextResponse.json(updatedBudget, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error(`Error al actualizar presupuesto ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al actualizar presupuesto' }, { status: 500 });
        }
    });
}
export function DELETE(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const budgetId = parseInt(params.id);
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const budgetService = new BudgetService(payload.schemaName);
            yield budgetService.deleteBudget(budgetId, payload.complexId);
            ServerLogger.info(`Presupuesto ${budgetId} eliminado del complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Presupuesto eliminado exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error(`Error al eliminar presupuesto ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al eliminar presupuesto' }, { status: 500 });
        }
    });
}
