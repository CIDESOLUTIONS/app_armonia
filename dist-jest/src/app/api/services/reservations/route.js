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
const ReservationSchema = z.object({
    commonAreaId: z.number().int().positive("ID de área común inválido."),
    userId: z.number().int().positive("ID de usuario inválido."),
    propertyId: z.number().int().positive("ID de propiedad inválido."),
    title: z.string().min(1, "El título es requerido."),
    description: z.string().optional(),
    startDateTime: z.string().datetime("Fecha y hora de inicio inválidas."),
    endDateTime: z.string().datetime("Fecha y hora de fin inválidas."),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED']).default('PENDING'),
    attendees: z.number().int().min(1, "El número de asistentes debe ser al menos 1."),
    requiresPayment: z.boolean().default(false),
    paymentAmount: z.number().optional(),
    paymentStatus: z.string().optional(),
    rejectionReason: z.string().optional(),
    approvedById: z.number().int().optional(),
    approvedAt: z.string().datetime().optional(),
    cancellationReason: z.string().optional(),
    cancelledAt: z.string().datetime().optional(),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const tenantPrisma = getPrisma(payload.schemaName);
            let where = { complexId: payload.complexId };
            // Si es residente, solo mostrar sus reservas
            if (payload.role === 'RESIDENT') {
                where.userId = payload.id;
            }
            const reservations = yield tenantPrisma.reservation.findMany({
                where,
                include: {
                    commonArea: { select: { name: true } },
                    user: { select: { name: true } },
                    property: { select: { unitNumber: true } },
                },
                orderBy: { startDateTime: 'desc' },
            });
            const formattedReservations = reservations.map(res => {
                var _a, _b, _c;
                return (Object.assign(Object.assign({}, res), { commonAreaName: ((_a = res.commonArea) === null || _a === void 0 ? void 0 : _a.name) || 'N/A', userName: ((_b = res.user) === null || _b === void 0 ? void 0 : _b.name) || 'N/A', unitNumber: ((_c = res.property) === null || _c === void 0 ? void 0 : _c.unitNumber) || 'N/A' }));
            });
            ServerLogger.info(`Reservas listadas para el complejo ${payload.complexId}`);
            return NextResponse.json(formattedReservations, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener reservas:', error);
            return NextResponse.json({ message: 'Error al obtener reservas' }, { status: 500 });
        }
    });
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const body = yield request.json();
            const validatedData = ReservationSchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const newReservation = yield tenantPrisma.reservation.create({ data: validatedData });
            ServerLogger.info(`Reserva creada: ${newReservation.title} en complejo ${payload.complexId}`);
            return NextResponse.json(newReservation, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear reserva:', error);
            return NextResponse.json({ message: 'Error al crear reserva' }, { status: 500 });
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
            const validatedData = ReservationSchema.partial().parse(updateData); // Partial para actualizaciones
            if (!id) {
                return NextResponse.json({ message: 'ID de reserva requerido para actualizar' }, { status: 400 });
            }
            const tenantPrisma = getPrisma(payload.schemaName);
            const updatedReservation = yield tenantPrisma.reservation.update({
                where: { id: parseInt(id) },
                data: validatedData,
            });
            ServerLogger.info(`Reserva actualizada: ${updatedReservation.title} en complejo ${payload.complexId}`);
            return NextResponse.json(updatedReservation, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al actualizar reserva:', error);
            return NextResponse.json({ message: 'Error al actualizar reserva' }, { status: 500 });
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
                return NextResponse.json({ message: 'ID de reserva requerido para eliminar' }, { status: 400 });
            }
            const tenantPrisma = getPrisma(payload.schemaName);
            yield tenantPrisma.reservation.delete({ where: { id: parseInt(id) } });
            ServerLogger.info(`Reserva eliminada: ID ${id} en complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Reserva eliminada exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al eliminar reserva:', error);
            return NextResponse.json({ message: 'Error al eliminar reserva' }, { status: 500 });
        }
    });
}
