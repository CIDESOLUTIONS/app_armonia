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
import { FeeService } from '@/services/feeService';
import { z } from 'zod';
const FeeUpdateSchema = z.object({
    amount: z.number().min(0, "El monto debe ser un número positivo.").optional(),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD).").optional(),
    status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
});
const PaymentRegisterSchema = z.object({
    amount: z.number().min(0, "El monto del pago debe ser un número positivo."),
    paymentMethod: z.string().min(1, "El método de pago es requerido."),
    reference: z.string().optional(),
});
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const feeId = parseInt(params.id);
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const feeService = new FeeService(payload.schemaName);
            const fee = yield feeService.getFees({ id: feeId }); // Asumiendo que getFees puede filtrar por ID
            if (!fee || fee.length === 0) {
                return NextResponse.json({ message: 'Cuota no encontrada' }, { status: 404 });
            }
            ServerLogger.info(`Cuota ${feeId} obtenida para el complejo ${payload.complexId}`);
            return NextResponse.json(fee[0], { status: 200 });
        }
        catch (error) {
            ServerLogger.error(`Error al obtener cuota ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al obtener cuota' }, { status: 500 });
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
            const feeId = parseInt(params.id);
            const body = yield request.json();
            const validatedData = FeeUpdateSchema.parse(body);
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const feeService = new FeeService(payload.schemaName);
            const updatedFee = yield feeService.updateFee(feeId, validatedData);
            ServerLogger.info(`Cuota ${feeId} actualizada en complejo ${payload.complexId}`);
            return NextResponse.json(updatedFee, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error(`Error al actualizar cuota ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al actualizar cuota' }, { status: 500 });
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
            const feeId = parseInt(params.id);
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const feeService = new FeeService(payload.schemaName);
            yield feeService.deleteFee(feeId);
            ServerLogger.info(`Cuota ${feeId} eliminada del complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Cuota eliminada exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error(`Error al eliminar cuota ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al eliminar cuota' }, { status: 500 });
        }
    });
}
export function POST(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const feeId = parseInt(params.id);
            const body = yield request.json();
            const validatedData = PaymentRegisterSchema.parse(body);
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const feeService = new FeeService(payload.schemaName);
            // Asumiendo que FeeService tiene un método para registrar pagos
            // Esto podría ser un método en FeeService o un nuevo PaymentService
            // Por ahora, lo simulo aquí o lo añadiré a FeeService si es simple.
            // Idealmente, un PaymentService manejaría esto.
            const newPayment = yield feeService.registerPayment(feeId, validatedData);
            ServerLogger.info(`Pago registrado para cuota ${feeId} en complejo ${payload.complexId}`);
            return NextResponse.json(newPayment, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error(`Error al registrar pago para cuota ${params.id}:`, error);
            return NextResponse.json({ message: 'Error al registrar pago' }, { status: 500 });
        }
    });
}
