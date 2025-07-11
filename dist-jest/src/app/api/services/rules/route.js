var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';
const ReservationRuleSchema = z.object({
    commonAreaId: z.number().int().positive("ID de área común inválido."),
    name: z.string().min(1, "El nombre es requerido."),
    description: z.string().optional(),
    maxDurationHours: z.number().int().min(0, "La duración máxima debe ser un número positivo."),
    minDurationHours: z.number().int().min(0, "La duración mínima debe ser un número positivo."),
    maxAdvanceDays: z.number().int().min(0, "Los días de anticipación máxima deben ser un número positivo."),
    minAdvanceDays: z.number().int().min(0, "Los días de anticipación mínima deben ser un número positivo."),
    maxReservationsPerMonth: z.number().int().min(0, "El máximo de reservas por mes debe ser un número positivo."),
    maxReservationsPerWeek: z.number().int().min(0, "El máximo de reservas por semana debe ser un número positivo."),
    maxConcurrentReservations: z.number().int().min(0, "El máximo de reservas concurrentes debe ser un número positivo."),
    allowCancellation: z.boolean().default(true),
    cancellationHours: z.number().int().min(0, "Las horas de cancelación deben ser un número positivo."),
    isActive: z.boolean().default(true),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const tenantPrisma = getPrisma(payload.schemaName);
            const rules = yield tenantPrisma.reservationRule.findMany({
                where: { commonArea: { complexId: payload.complexId } },
                include: {
                    commonArea: { select: { name: true } },
                },
            });
            const rulesWithCommonAreaName = rules.map(rule => {
                var _a;
                return (Object.assign(Object.assign({}, rule), { commonAreaName: ((_a = rule.commonArea) === null || _a === void 0 ? void 0 : _a.name) || 'N/A' }));
            });
            ServerLogger.info(`Reglas de reserva listadas para el complejo ${payload.complexId}`);
            return NextResponse.json(rulesWithCommonAreaName, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener reglas de reserva:', error);
            return NextResponse.json({ message: 'Error al obtener reglas de reserva' }, { status: 500 });
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
            const body = yield request.json();
            const validatedData = ReservationRuleSchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const newRule = yield tenantPrisma.reservationRule.create({ data: validatedData });
            ServerLogger.info(`Regla de reserva creada: ${newRule.name} en complejo ${payload.complexId}`);
            return NextResponse.json(newRule, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear regla de reserva:', error);
            return NextResponse.json({ message: 'Error al crear regla de reserva' }, { status: 500 });
        }
    });
}
export function PUT(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const _a = yield request.json(), { id } = _a, updateData = __rest(_a, ["id"]);
            const validatedData = ReservationRuleSchema.partial().parse(updateData); // Partial para actualizaciones
            if (!id) {
                return NextResponse.json({ message: 'ID de regla de reserva requerido para actualizar' }, { status: 400 });
            }
            const tenantPrisma = getPrisma(payload.schemaName);
            const updatedRule = yield tenantPrisma.reservationRule.update({
                where: { id: parseInt(id) },
                data: validatedData,
            });
            ServerLogger.info(`Regla de reserva actualizada: ${updatedRule.name} en complejo ${payload.complexId}`);
            return NextResponse.json(updatedRule, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al actualizar regla de reserva:', error);
            return NextResponse.json({ message: 'Error al actualizar regla de reserva' }, { status: 500 });
        }
    });
}
export function DELETE(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const { id } = yield request.json();
            if (!id) {
                return NextResponse.json({ message: 'ID de regla de reserva requerido para eliminar' }, { status: 400 });
            }
            const tenantPrisma = getPrisma(payload.schemaName);
            yield tenantPrisma.reservationRule.delete({ where: { id: parseInt(id) } });
            ServerLogger.info(`Regla de reserva eliminada: ID ${id} en complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Regla de reserva eliminada exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al eliminar regla de reserva:', error);
            return NextResponse.json({ message: 'Error al eliminar regla de reserva' }, { status: 500 });
        }
    });
}
