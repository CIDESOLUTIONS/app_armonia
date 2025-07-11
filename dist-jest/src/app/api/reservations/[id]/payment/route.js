var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/reservations/[id]/payment/route.ts
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { billingEngine } from '@/lib/services/billing-engine';
import { getPrisma } from '@/lib/prisma';
import { z } from 'zod';
// Schema para creación de pago
const CreatePaymentSchema = z.object({
    returnUrl: z.string().url().optional(),
    methodId: z.number().optional()
});
// Schema para confirmación de pago
const ConfirmPaymentSchema = z.object({
    transactionId: z.string(),
    gatewayReference: z.string(),
    status: z.enum(['COMPLETED', 'FAILED', 'PENDING']),
    gatewayResponse: z.record(z.any()).optional()
});
// POST: Crear pago para una reserva
export function POST(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        var _b;
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            const reservationId = parseInt(params.id);
            if (isNaN(reservationId)) {
                return NextResponse.json({
                    message: 'ID de reserva inválido'
                }, { status: 400 });
            }
            const body = yield request.json();
            const validation = CreatePaymentSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({
                    message: 'Datos inválidos',
                    errors: validation.error.format()
                }, { status: 400 });
            }
            const { returnUrl, methodId } = validation.data;
            // Obtener información de la reserva
            const prisma = getPrisma();
            const reservation = yield prisma.reservation.findUnique({
                where: { id: reservationId },
                include: {
                    commonArea: true
                }
            });
            if (!reservation) {
                return NextResponse.json({
                    message: 'Reserva no encontrada'
                }, { status: 404 });
            }
            // Verificar que el usuario tiene acceso a esta reserva
            if (reservation.userId !== payload.userId && !['ADMIN', 'COMPLEX_ADMIN'].includes(payload.role)) {
                return NextResponse.json({
                    message: 'Sin permisos para acceder a esta reserva'
                }, { status: 403 });
            }
            // Verificar que la reserva requiere pago
            if (!((_b = reservation.commonArea) === null || _b === void 0 ? void 0 : _b.hasFee)) {
                return NextResponse.json({
                    message: 'Esta reserva no requiere pago'
                }, { status: 400 });
            }
            // Verificar que no se haya pagado ya
            if (reservation.paymentStatus === 'COMPLETED') {
                return NextResponse.json({
                    message: 'Esta reserva ya ha sido pagada'
                }, { status: 400 });
            }
            // Calcular monto del pago
            const paymentAmount = reservation.paymentAmount || reservation.commonArea.feeAmount || 0;
            if (paymentAmount <= 0) {
                return NextResponse.json({
                    message: 'Monto de pago inválido'
                }, { status: 400 });
            }
            // Crear el pago
            const paymentResult = yield billingEngine.createReservationPayment({
                reservationId,
                amount: Number(paymentAmount),
                description: `Pago de reserva - ${reservation.commonArea.name}`,
                dueDate: new Date(reservation.startDateTime) // Vence el día de la reserva
            });
            console.log(`[RESERVATION PAYMENT] Pago creado para reserva ${reservationId}: ${paymentResult.transactionId}`);
            return NextResponse.json({
                success: true,
                payment: {
                    transactionId: paymentResult.transactionId,
                    paymentUrl: paymentResult.paymentUrl,
                    amount: paymentAmount,
                    currency: 'COP',
                    expiresAt: paymentResult.expiresAt,
                    status: paymentResult.status
                }
            });
        }
        catch (error) {
            console.error('[RESERVATION PAYMENT POST] Error:', error);
            return NextResponse.json({
                message: error instanceof Error ? error.message : 'Error al crear el pago'
            }, { status: 500 });
        }
    });
}
// PUT: Confirmar pago de reserva
export function PUT(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            const reservationId = parseInt(params.id);
            if (isNaN(reservationId)) {
                return NextResponse.json({
                    message: 'ID de reserva inválido'
                }, { status: 400 });
            }
            const body = yield request.json();
            const validation = ConfirmPaymentSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({
                    message: 'Datos de confirmación inválidos',
                    errors: validation.error.format()
                }, { status: 400 });
            }
            const { transactionId, gatewayReference, status, gatewayResponse } = validation.data;
            // Verificar que la transacción existe y pertenece a esta reserva
            const prisma = getPrisma();
            const transaction = yield prisma.transaction.findUnique({
                where: { id: transactionId },
                include: {
                    metadata: true
                }
            });
            if (!transaction) {
                return NextResponse.json({
                    message: 'Transacción no encontrada'
                }, { status: 404 });
            }
            // Verificar que la transacción corresponde a esta reserva
            const metadata = transaction.metadata;
            if (!metadata || metadata.reservationId !== reservationId) {
                return NextResponse.json({
                    message: 'La transacción no corresponde a esta reserva'
                }, { status: 400 });
            }
            // Confirmar el pago
            yield billingEngine.confirmPayment(transactionId, {
                gatewayReference,
                gatewayResponse: gatewayResponse || {},
                status
            });
            // Obtener estado actualizado de la reserva
            const updatedReservation = yield prisma.reservation.findUnique({
                where: { id: reservationId },
                include: {
                    commonArea: {
                        select: { name: true }
                    }
                }
            });
            console.log(`[RESERVATION PAYMENT] Pago confirmado para reserva ${reservationId}: ${status}`);
            return NextResponse.json({
                success: true,
                message: status === 'COMPLETED'
                    ? 'Pago confirmado exitosamente'
                    : `Estado del pago actualizado: ${status}`,
                reservation: {
                    id: updatedReservation === null || updatedReservation === void 0 ? void 0 : updatedReservation.id,
                    paymentStatus: updatedReservation === null || updatedReservation === void 0 ? void 0 : updatedReservation.paymentStatus,
                    status: updatedReservation === null || updatedReservation === void 0 ? void 0 : updatedReservation.status
                }
            });
        }
        catch (error) {
            console.error('[RESERVATION PAYMENT PUT] Error:', error);
            return NextResponse.json({
                message: error instanceof Error ? error.message : 'Error al confirmar el pago'
            }, { status: 500 });
        }
    });
}
// GET: Obtener estado del pago de una reserva
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        var _b, _c, _d;
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            const reservationId = parseInt(params.id);
            if (isNaN(reservationId)) {
                return NextResponse.json({
                    message: 'ID de reserva inválido'
                }, { status: 400 });
            }
            // Obtener información de la reserva y transacciones relacionadas
            const prisma = getPrisma();
            const reservation = yield prisma.reservation.findUnique({
                where: { id: reservationId },
                include: {
                    commonArea: {
                        select: { name: true, hasFee: true, feeAmount: true }
                    }
                }
            });
            if (!reservation) {
                return NextResponse.json({
                    message: 'Reserva no encontrada'
                }, { status: 404 });
            }
            // Verificar acceso
            if (reservation.userId !== payload.userId && !['ADMIN', 'COMPLEX_ADMIN'].includes(payload.role)) {
                return NextResponse.json({
                    message: 'Sin permisos para acceder a esta reserva'
                }, { status: 403 });
            }
            // Buscar transacciones relacionadas
            const transactions = yield prisma.transaction.findMany({
                where: {
                    metadata: {
                        path: ['reservationId'],
                        equals: reservationId
                    }
                },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    amount: true,
                    currency: true,
                    status: true,
                    gatewayReference: true,
                    paymentUrl: true,
                    expiresAt: true,
                    createdAt: true,
                    completedAt: true
                }
            });
            return NextResponse.json({
                success: true,
                reservation: {
                    id: reservation.id,
                    requiresPayment: reservation.requiresPayment,
                    paymentAmount: reservation.paymentAmount,
                    paymentStatus: reservation.paymentStatus,
                    commonArea: {
                        name: (_b = reservation.commonArea) === null || _b === void 0 ? void 0 : _b.name,
                        hasFee: (_c = reservation.commonArea) === null || _c === void 0 ? void 0 : _c.hasFee,
                        feeAmount: (_d = reservation.commonArea) === null || _d === void 0 ? void 0 : _d.feeAmount
                    }
                },
                transactions
            });
        }
        catch (error) {
            console.error('[RESERVATION PAYMENT GET] Error:', error);
            return NextResponse.json({
                message: error instanceof Error ? error.message : 'Error al obtener información del pago'
            }, { status: 500 });
        }
    });
}
