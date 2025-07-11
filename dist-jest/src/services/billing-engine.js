var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/lib/services/billing-engine.ts
import { getPrisma } from '@/lib/prisma';
import { z } from 'zod';
// Schemas de validación
const PaymentRequestSchema = z.object({
    userId: z.number(),
    amount: z.number().positive(),
    currency: z.string().default('COP'),
    description: z.string(),
    metadata: z.record(z.any()).optional(),
    methodId: z.number().optional(),
    returnUrl: z.string().url().optional(),
    expiresAt: z.date().optional()
});
const PaymentConfirmationSchema = z.object({
    transactionId: z.string(),
    gatewayReference: z.string(),
    gatewayResponse: z.record(z.any()),
    status: z.enum(['COMPLETED', 'FAILED', 'PENDING'])
});
// Servicio de BillingEngine para gestión de pagos
export class BillingEngine {
    constructor() {
        this.prisma = getPrisma();
    }
    /**
     * Crear una nueva transacción de pago
     */
    createPayment(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validation = PaymentRequestSchema.safeParse(request);
                if (!validation.success) {
                    throw new Error(`Datos de pago inválidos: ${validation.error.message}`);
                }
                const data = validation.data;
                // Obtener configuración de pagos por defecto
                const paymentSettings = yield this.getPaymentSettings();
                // Obtener pasarela de pago por defecto
                const defaultGateway = yield this.getDefaultGateway();
                if (!defaultGateway) {
                    throw new Error('No hay pasarela de pago configurada');
                }
                // Calcular fecha de expiración si no se proporciona
                const expiresAt = data.expiresAt || new Date(Date.now() + (paymentSettings.paymentExpiry * 60 * 60 * 1000));
                // Crear transacción en base de datos
                const transaction = yield this.prisma.transaction.create({
                    data: {
                        userId: data.userId,
                        amount: data.amount,
                        currency: data.currency || 'COP',
                        description: data.description,
                        status: 'PENDING',
                        gatewayId: defaultGateway.id,
                        methodId: data.methodId || (yield this.getDefaultPaymentMethod()),
                        paymentData: data.metadata,
                        metadata: {
                            returnUrl: data.returnUrl,
                            ipAddress: null, // Se llenará desde el cliente
                            userAgent: null
                        },
                        expiresAt,
                        attempts: 1
                    }
                });
                // Procesar pago con la pasarela
                const paymentResult = yield this.processPaymentWithGateway(transaction.id, defaultGateway, {
                    amount: data.amount,
                    currency: data.currency || 'COP',
                    description: data.description,
                    returnUrl: data.returnUrl
                });
                // Actualizar transacción con la respuesta de la pasarela
                yield this.prisma.transaction.update({
                    where: { id: transaction.id },
                    data: {
                        paymentUrl: paymentResult.paymentUrl,
                        gatewayReference: paymentResult.gatewayReference,
                        gatewayResponse: paymentResult.gatewayResponse
                    }
                });
                return {
                    transactionId: transaction.id,
                    paymentUrl: paymentResult.paymentUrl,
                    status: 'PENDING',
                    gatewayReference: paymentResult.gatewayReference,
                    expiresAt
                };
            }
            catch (error) {
                console.error('[BILLING ENGINE] Error creando pago:', error);
                throw new Error(`Error creando pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
        });
    }
    /**
     * Crear pago específico para reserva
     */
    createReservationPayment(reservationPayment) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Obtener información de la reserva
                const reservation = yield this.prisma.reservation.findUnique({
                    where: { id: reservationPayment.reservationId },
                    include: {
                        commonArea: true
                    }
                });
                if (!reservation) {
                    throw new Error('Reserva no encontrada');
                }
                // Crear el pago con metadata específica de la reserva
                const paymentRequest = {
                    userId: reservation.userId,
                    amount: reservationPayment.amount,
                    description: reservationPayment.description,
                    metadata: {
                        type: 'reservation',
                        reservationId: reservationPayment.reservationId,
                        commonAreaId: reservation.commonAreaId,
                        commonAreaName: (_a = reservation.commonArea) === null || _a === void 0 ? void 0 : _a.name,
                        startDateTime: reservation.startDateTime,
                        endDateTime: reservation.endDateTime
                    },
                    expiresAt: reservationPayment.dueDate
                };
                const paymentResult = yield this.createPayment(paymentRequest);
                // Actualizar la reserva con información del pago
                yield this.prisma.reservation.update({
                    where: { id: reservationPayment.reservationId },
                    data: {
                        requiresPayment: true,
                        paymentAmount: reservationPayment.amount,
                        paymentStatus: 'PENDING'
                    }
                });
                return paymentResult;
            }
            catch (error) {
                console.error('[BILLING ENGINE] Error creando pago de reserva:', error);
                throw new Error(`Error creando pago de reserva: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
        });
    }
    /**
     * Confirmar pago completado
     */
    confirmPayment(transactionId, confirmation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validation = PaymentConfirmationSchema.safeParse(Object.assign({ transactionId }, confirmation));
                if (!validation.success) {
                    throw new Error(`Datos de confirmación inválidos: ${validation.error.message}`);
                }
                const data = validation.data;
                // Actualizar transacción
                const transaction = yield this.prisma.transaction.update({
                    where: { id: transactionId },
                    data: {
                        status: data.status,
                        gatewayReference: data.gatewayReference,
                        gatewayResponse: data.gatewayResponse,
                        completedAt: data.status === 'COMPLETED' ? new Date() : null
                    },
                    include: {
                        paymentData: true,
                        metadata: true
                    }
                });
                // Si es un pago de reserva y está completado, actualizar la reserva
                if (data.status === 'COMPLETED' && transaction.metadata &&
                    typeof transaction.metadata === 'object' &&
                    'type' in transaction.metadata &&
                    transaction.metadata.type === 'reservation') {
                    const reservationId = transaction.metadata.reservationId;
                    if (reservationId) {
                        yield this.prisma.reservation.update({
                            where: { id: reservationId },
                            data: {
                                paymentStatus: 'COMPLETED',
                                status: 'APPROVED' // Auto-aprobar si el pago está completo
                            }
                        });
                    }
                }
                console.log(`[BILLING ENGINE] Pago ${transactionId} confirmado con status: ${data.status}`);
            }
            catch (error) {
                console.error('[BILLING ENGINE] Error confirmando pago:', error);
                throw new Error(`Error confirmando pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
        });
    }
    /**
     * Obtener estado de transacción
     */
    getTransactionStatus(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.prisma.transaction.findUnique({
                    where: { id: transactionId },
                    select: {
                        status: true,
                        amount: true,
                        currency: true,
                        description: true,
                        createdAt: true,
                        completedAt: true,
                        gatewayReference: true
                    }
                });
                if (!transaction) {
                    throw new Error('Transacción no encontrada');
                }
                return transaction;
            }
            catch (error) {
                console.error('[BILLING ENGINE] Error obteniendo estado de transacción:', error);
                throw new Error(`Error obteniendo estado de transacción: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
        });
    }
    /**
     * Procesar reembolso
     */
    processRefund(transactionId, amount, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const originalTransaction = yield this.prisma.transaction.findUnique({
                    where: { id: transactionId }
                });
                if (!originalTransaction) {
                    throw new Error('Transacción original no encontrada');
                }
                if (originalTransaction.status !== 'COMPLETED') {
                    throw new Error('Solo se pueden reembolsar transacciones completadas');
                }
                const refundAmount = amount || originalTransaction.amount;
                // Crear transacción de reembolso
                const refundTransaction = yield this.prisma.transaction.create({
                    data: {
                        userId: originalTransaction.userId,
                        amount: -refundAmount, // Monto negativo para reembolso
                        currency: originalTransaction.currency,
                        description: `Reembolso: ${originalTransaction.description}`,
                        status: 'COMPLETED',
                        gatewayId: originalTransaction.gatewayId,
                        methodId: originalTransaction.methodId,
                        gatewayReference: `REFUND-${originalTransaction.gatewayReference}`,
                        metadata: {
                            originalTransactionId: transactionId,
                            refundReason: reason,
                            refundType: 'full'
                        },
                        completedAt: new Date()
                    }
                });
                // Actualizar transacción original
                yield this.prisma.transaction.update({
                    where: { id: transactionId },
                    data: {
                        status: 'REFUNDED'
                    }
                });
                return {
                    refundId: refundTransaction.id,
                    status: 'COMPLETED'
                };
            }
            catch (error) {
                console.error('[BILLING ENGINE] Error procesando reembolso:', error);
                throw new Error(`Error procesando reembolso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
        });
    }
    // Métodos privados auxiliares
    getPaymentSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            let settings = yield this.prisma.paymentSettings.findFirst();
            if (!settings) {
                // Crear configuración por defecto
                settings = yield this.prisma.paymentSettings.create({
                    data: {
                        allowSaveCards: true,
                        minPaymentAmount: 1000, // $1,000 COP mínimo
                        paymentExpiry: 24, // 24 horas
                        autoGenerateReceipt: true,
                        notifyOnPayment: true
                    }
                });
            }
            return settings;
        });
    }
    getDefaultGateway() {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield this.getPaymentSettings();
            if (settings.defaultGatewayId) {
                return yield this.prisma.paymentGateway.findUnique({
                    where: { id: settings.defaultGatewayId }
                });
            }
            // Buscar la primera pasarela activa
            return yield this.prisma.paymentGateway.findFirst({
                where: { isActive: true }
            });
        });
    }
    getDefaultPaymentMethod() {
        return __awaiter(this, void 0, void 0, function* () {
            const method = yield this.prisma.paymentMethod.findFirst({
                where: { isActive: true },
                orderBy: { id: 'asc' }
            });
            if (!method) {
                throw new Error('No hay métodos de pago configurados');
            }
            return method.id;
        });
    }
    processPaymentWithGateway(transactionId, gateway, paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementación mock para desarrollo
            // En producción esto se integraría con PayU, Wompi, etc.
            const mockGatewayReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            return {
                paymentUrl: `https://checkout.example.com/pay/${transactionId}`,
                gatewayReference: mockGatewayReference,
                gatewayResponse: {
                    status: 'pending',
                    reference: mockGatewayReference,
                    amount: paymentData.amount,
                    currency: paymentData.currency,
                    description: paymentData.description,
                    timestamp: new Date().toISOString()
                }
            };
        });
    }
}
// Instancia singleton del servicio
export const billingEngine = new BillingEngine();
