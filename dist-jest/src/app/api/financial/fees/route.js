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
const FeeFilterSchema = z.object({
    type: z.string().optional(),
    status: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});
const BulkFeeCreateSchema = z.object({
    feeType: z.string().min(1, "El tipo de cuota es requerido."),
    baseAmount: z.number().min(0, "El monto base debe ser un número positivo."),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)."),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)."),
    unitIds: z.array(z.number().int().positive("ID de unidad inválido.")).min(1, "Se requiere al menos un ID de unidad."),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const { searchParams } = new URL(request.url);
            const filters = {
                type: searchParams.get('type') || undefined,
                status: searchParams.get('status') || undefined,
                startDate: searchParams.get('startDate') || undefined,
                endDate: searchParams.get('endDate') || undefined,
            };
            const validatedFilters = FeeFilterSchema.parse(filters);
            const feeService = new FeeService(payload.schemaName);
            const fees = yield feeService.getFees(validatedFilters);
            ServerLogger.info(`Cuotas listadas para el complejo ${payload.complexId}`);
            return NextResponse.json(fees, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al obtener cuotas:', error);
            return NextResponse.json({ message: 'Error al obtener cuotas' }, { status: 500 });
        }
    });
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            if (!payload.complexId || !payload.schemaName) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const body = yield request.json();
            const validatedData = BulkFeeCreateSchema.parse(body);
            const feeService = new FeeService(payload.schemaName);
            yield feeService.createBulkFees(validatedData.feeType, validatedData.baseAmount, validatedData.startDate, validatedData.endDate, validatedData.unitIds);
            ServerLogger.info(`Cuotas masivas creadas para el complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Cuotas creadas exitosamente' }, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear cuotas:', error);
            return NextResponse.json({ message: 'Error al crear cuotas' }, { status: 500 });
        }
    });
}
