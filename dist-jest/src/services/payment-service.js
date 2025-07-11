/**
 * Servicio para la integración de pagos
 * Incluye funcionalidades para procesamiento de pagos con múltiples pasarelas
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from '@/lib/prisma';
import { ServerLogger } from '@/lib/logging/server-logger';
import { ActivityLogger } from '@/lib/logging/activity-logger';
import { NotificationService } from '@/lib/communications/notification-service';
import { TransactionStatus } from '@prisma/client';
// Implementación de adaptador para PayU Latam
export class PayUAdapter {
    initialize(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.apiKey = config.apiKey;
                this.apiSecret = config.apiSecret;
                this.merchantId = config.merchantId;
                this.accountId = config.accountId || '';
                this.testMode = config.testMode || false;
                // Validar credenciales con una llamada de prueba
                // Implementación simplificada para el ejemplo
                return true;
            }
            catch (error) {
                ServerLogger.error('Error inicializando PayU', error);
                throw error;
            }
        });
    }
    createPayment(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Implementación simplificada - en producción se haría una llamada real a la API de PayU
                const paymentUrl = this.testMode
                    ? `https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/payment/${transaction.id}`
                    : `https://checkout.payulatam.com/ppp-web-gateway-payu/payment/${transaction.id}`;
                return {
                    success: true,
                    paymentUrl,
                    gatewayReference: `PAYU_${Date.now()}_${transaction.id}`,
                    status: 'PENDING'
                };
            }
            catch (error) {
                ServerLogger.error('Error creando pago en PayU', error);
                throw error;
            }
        });
    }
    processPayment(transactionId, paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Implementación simplificada - en producción se procesaría el pago con PayU
                return {
                    success: true,
                    gatewayReference: `PAYU_${Date.now()}_${transactionId}`,
                    status: 'COMPLETED',
                    response: {
                        authorizationCode: `AUTH_${Math.floor(Math.random() * 1000000)}`,
                        processorResponseCode: '00',
                        transactionDate: new Date().toISOString()
                    }
                };
            }
            catch (error) {
                ServerLogger.error('Error procesando pago en PayU', error);
                throw error;
            }
        });
    }
    verifyPayment(gatewayReference) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Implementación simplificada - en producción se verificaría el estado con PayU
                return {
                    success: true,
                    status: 'COMPLETED',
                    response: {
                        authorizationCode: gatewayReference.split('_')[2],
                        processorResponseCode: '00',
                        transactionDate: new Date().toISOString()
                    }
                };
            }
            catch (error) {
                ServerLogger.error('Error verificando pago en PayU', error);
                throw error;
            }
        });
    }
    refundPayment(gatewayReference, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Implementación simplificada - en producción se procesaría el reembolso con PayU
                return {
                    success: true,
                    refundReference: `REFUND_${gatewayReference}`,
                    status: 'REFUNDED',
                    amount: amount
                };
            }
            catch (error) {
                ServerLogger.error('Error reembolsando pago en PayU', error);
                throw error;
            }
        });
    }
    validateWebhook(payload, signature) {
        try {
            // Implementación simplificada - en producción se validaría la firma con el algoritmo correcto
            // Ejemplo: HMAC-SHA256 del payload con el secreto
            return true;
        }
        catch (error) {
            ServerLogger.error('Error validando webhook de PayU', error);
            throw error;
        }
    }
}
// Implementación de adaptador para Wompi
export class WompiAdapter {
    initialize(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.apiKey = config.apiKey;
                this.apiSecret = config.apiSecret;
                this.testMode = config.testMode || false;
                // Validar credenciales con una llamada de prueba
                // Implementación simplificada para el ejemplo
                return true;
            }
            catch (error) {
                ServerLogger.error('Error inicializando Wompi', error);
                throw error;
            }
        });
    }
    createPayment(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Implementación simplificada - en producción se haría una llamada real a la API de Wompi
                const paymentUrl = this.testMode
                    ? `https://sandbox.checkout.wompi.co/p/${transaction.id}`
                    : `https://checkout.wompi.co/p/${transaction.id}`;
                return {
                    success: true,
                    paymentUrl,
                    gatewayReference: `WOMPI_${Date.now()}_${transaction.id}`,
                    status: 'PENDING'
                };
            }
            catch (error) {
                ServerLogger.error('Error creando pago en Wompi', error);
                throw error;
            }
        });
    }
    processPayment(transactionId, paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Implementación simplificada - en producción se procesaría el pago con Wompi
                return {
                    success: true,
                    gatewayReference: `WOMPI_${Date.now()}_${transactionId}`,
                    status: 'COMPLETED',
                    response: {
                        authorizationCode: `AUTH_${Math.floor(Math.random() * 1000000)}`,
                        processorResponseCode: 'APPROVED',
                        transactionDate: new Date().toISOString()
                    }
                };
            }
            catch (error) {
                ServerLogger.error('Error procesando pago en Wompi', error);
                throw error;
            }
        });
    }
    verifyPayment(gatewayReference) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Implementación simplificada - en producción se verificaría el estado con Wompi
                return {
                    success: true,
                    status: 'COMPLETED',
                    response: {
                        authorizationCode: gatewayReference.split('_')[2],
                        processorResponseCode: 'APPROVED',
                        transactionDate: new Date().toISOString()
                    }
                };
            }
            catch (error) {
                ServerLogger.error('Error verificando pago en Wompi', error);
                throw error;
            }
        });
    }
    refundPayment(gatewayReference, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Implementación simplificada - en producción se procesaría el reembolso con Wompi
                return {
                    success: true,
                    refundReference: `REFUND_${gatewayReference}`,
                    status: 'REFUNDED',
                    amount: amount
                };
            }
            catch (error) {
                ServerLogger.error('Error reembolsando pago en Wompi', error);
                throw error;
            }
        });
    }
    validateWebhook(payload, signature) {
        try {
            // Implementación simplificada - en producción se validaría la firma con el algoritmo correcto
            return true;
        }
        catch (error) {
            ServerLogger.error('Error validando webhook de Wompi', error);
            throw error;
        }
    }
}
// Fábrica de adaptadores de pasarelas
export class PaymentGatewayFactory {
    static createAdapter(gatewayName) {
        switch (gatewayName.toLowerCase()) {
            case 'payu':
                return new PayUAdapter();
            case 'wompi':
                return new WompiAdapter();
            default:
                ServerLogger.error(`Pasarela no soportada: ${gatewayName}`);
                return null;
        }
    }
}
// Servicio principal de pagos
export class PaymentService {
    /**
     * Crea una nueva transacción de pago
     */
    static createTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validar datos básicos
                if (!data.amount || data.amount <= 0) {
                    throw new Error('El monto debe ser mayor a cero');
                }
                // Obtener configuración de la pasarela
                const gateway = yield prisma.paymentGateway.findUnique({
                    where: { id: data.gatewayId, isActive: true }
                });
                if (!gateway) {
                    throw new Error('Pasarela de pago no encontrada o inactiva');
                }
                // Obtener método de pago
                const paymentMethod = yield prisma.paymentMethod.findUnique({
                    where: { id: data.methodId, isActive: true }
                });
                if (!paymentMethod) {
                    throw new Error('Método de pago no encontrado o inactivo');
                }
                // Validar límites del método de pago
                if (paymentMethod.minAmount && data.amount < paymentMethod.minAmount) {
                    throw new Error(`El monto mínimo para este método de pago es ${paymentMethod.minAmount}`);
                }
                if (paymentMethod.maxAmount && data.amount > paymentMethod.maxAmount) {
                    throw new Error(`El monto máximo para este método de pago es ${paymentMethod.maxAmount}`);
                }
                // Aplicar recargo si corresponde
                let finalAmount = data.amount;
                if (paymentMethod.surcharge > 0) {
                    finalAmount += data.amount * (paymentMethod.surcharge / 100);
                }
                // Crear transacción en la base de datos
                const transaction = yield prisma.transaction.create({
                    data: {
                        userId: data.userId,
                        invoiceId: data.invoiceId,
                        amount: finalAmount,
                        currency: data.currency || 'COP',
                        description: data.description,
                        status: TransactionStatus.PENDING,
                        gatewayId: data.gatewayId,
                        methodId: data.methodId,
                        paymentData: data.paymentData || {},
                        metadata: data.metadata || {},
                        ipAddress: data.ipAddress,
                        userAgent: data.userAgent,
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas por defecto
                    }
                });
                // Registrar actividad
                yield ActivityLogger.log({
                    action: 'payment.transaction.create',
                    userId: data.userId,
                    entityType: 'transaction',
                    entityId: transaction.id,
                    details: { amount: finalAmount, currency: transaction.currency }
                });
                // Crear pago en la pasarela
                const adapter = PaymentGatewayFactory.createAdapter(gateway.name);
                if (!adapter) {
                    throw new Error(`No se pudo crear adaptador para la pasarela ${gateway.name}`);
                }
                // Inicializar adaptador con configuración
                const gatewayConfig = Object.assign({ apiKey: yield EncryptionService.decrypt(gateway.apiKey), apiSecret: yield EncryptionService.decrypt(gateway.apiSecret), merchantId: gateway.merchantId, accountId: gateway.accountId, testMode: gateway.testMode }, gateway.config);
                yield adapter.initialize(gatewayConfig);
                // Crear pago en la pasarela
                const gatewayResponse = yield adapter.createPayment({
                    id: transaction.id,
                    amount: finalAmount,
                    currency: transaction.currency,
                    description: transaction.description,
                    userId: transaction.userId,
                    invoiceId: transaction.invoiceId,
                    paymentData: transaction.paymentData
                });
                // Actualizar transacción con datos de la pasarela
                const updatedTransaction = yield prisma.transaction.update({
                    where: { id: transaction.id },
                    data: {
                        gatewayReference: gatewayResponse.gatewayReference,
                        paymentUrl: gatewayResponse.paymentUrl,
                        gatewayResponse: gatewayResponse,
                        status: this.mapGatewayStatus(gatewayResponse.status)
                    }
                });
                return updatedTransaction;
            }
            catch (error) {
                ServerLogger.error('Error al crear transacción de pago', error);
                throw new Error('No se pudo crear la transacción de pago');
            }
        });
    }
    /**
     * Verifica el estado de una transacción en la pasarela
     */
    static verifyTransaction(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield prisma.transaction.findUnique({
                    where: { id: transactionId },
                    include: {
                        gateway: true
                    }
                });
                if (!transaction) {
                    throw new Error('Transacción no encontrada');
                }
                if (!transaction.gatewayReference) {
                    throw new Error('La transacción no tiene referencia de pasarela');
                }
                // Verificar estado en la pasarela
                const adapter = PaymentGatewayFactory.createAdapter(transaction.gateway.name);
                if (!adapter) {
                    throw new Error(`No se pudo crear adaptador para la pasarela ${transaction.gateway.name}`);
                }
                // Inicializar adaptador con configuración
                const gatewayConfig = Object.assign({ apiKey: yield EncryptionService.decrypt(transaction.gateway.apiKey), apiSecret: yield EncryptionService.decrypt(transaction.gateway.apiSecret), merchantId: transaction.gateway.merchantId, accountId: transaction.gateway.accountId, testMode: transaction.gateway.testMode }, transaction.gateway.config);
                yield adapter.initialize(gatewayConfig);
                // Verificar pago
                const gatewayResponse = yield adapter.verifyPayment(transaction.gatewayReference);
                // Determinar estado final
                const finalStatus = this.mapGatewayStatus(gatewayResponse.status);
                const statusChanged = finalStatus !== transaction.status;
                const isCompleted = finalStatus === TransactionStatus.COMPLETED;
                // Actualizar transacción si cambió el estado
                if (statusChanged) {
                    const updatedTransaction = yield prisma.transaction.update({
                        where: { id: transaction.id },
                        data: {
                            status: finalStatus,
                            gatewayResponse: gatewayResponse,
                            completedAt: isCompleted ? new Date() : transaction.completedAt
                        }
                    });
                    // Si el pago fue completado y no estaba completado antes
                    if (isCompleted && transaction.status !== TransactionStatus.COMPLETED) {
                        // Actualizar factura si existe
                        if (transaction.invoiceId) {
                            yield prisma.invoice.update({
                                where: { id: transaction.invoiceId },
                                data: {
                                    status: 'PAID',
                                    paidAt: new Date(),
                                    paidAmount: transaction.amount
                                }
                            });
                        }
                        // Generar recibo
                        const receipt = yield ReceiptService.generatePaymentReceipt(transaction.id);
                        // Actualizar transacción con recibo
                        yield prisma.transaction.update({
                            where: { id: transaction.id },
                            data: {
                                receiptId: receipt.id,
                                receiptUrl: receipt.url
                            }
                        });
                        // Enviar notificación al usuario
                        yield NotificationService.sendNotification({
                            userId: transaction.userId,
                            title: 'Pago confirmado',
                            content: `Su pago por ${transaction.amount} ${transaction.currency} ha sido confirmado.`,
                            type: 'PAYMENT',
                            actionUrl: `/payments/receipt/${receipt.id}`
                        });
                        // Registrar actividad
                        yield ActivityLogger.log({
                            action: 'payment.transaction.completed',
                            userId: transaction.userId,
                            entityType: 'transaction',
                            entityId: transaction.id,
                            details: {
                                amount: transaction.amount,
                                currency: transaction.currency,
                                gatewayReference: transaction.gatewayReference
                            }
                        });
                    }
                    return updatedTransaction;
                }
                return transaction;
            }
            catch (error) {
                ServerLogger.error('Error al verificar transacción', error);
                throw new Error('No se pudo verificar la transacción');
            }
        });
    }
    /**
     * Procesa un webhook de pasarela de pago
     */
    static processWebhook(gatewayName, payload, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener configuración de la pasarela
                const gateway = yield prisma.paymentGateway.findFirst({
                    where: {
                        name: { equals: gatewayName, mode: 'insensitive' },
                        isActive: true
                    }
                });
                if (!gateway) {
                    throw new Error(`Pasarela ${gatewayName} no encontrada o inactiva`);
                }
                // Crear adaptador
                const adapter = PaymentGatewayFactory.createAdapter(gateway.name);
                if (!adapter) {
                    throw new Error(`No se pudo crear adaptador para la pasarela ${gateway.name}`);
                }
                // Validar firma del webhook
                const isValid = adapter.validateWebhook(payload, signature);
                if (!isValid) {
                    throw new Error('Firma de webhook inválida');
                }
                // Extraer referencia de transacción del payload
                // Nota: Esto depende de la estructura específica del webhook de cada pasarela
                const gatewayReference = this.extractGatewayReference(gateway.name, payload);
                if (!gatewayReference) {
                    throw new Error('No se pudo extraer referencia de transacción del webhook');
                }
                // Buscar transacción por referencia de pasarela
                const transaction = yield prisma.transaction.findFirst({
                    where: { gatewayReference }
                });
                if (!transaction) {
                    throw new Error(`Transacción con referencia ${gatewayReference} no encontrada`);
                }
                // Extraer estado del payload
                const gatewayStatus = this.extractGatewayStatus(gateway.name, payload);
                const newStatus = this.mapGatewayStatus(gatewayStatus);
                // Actualizar transacción
                yield prisma.transaction.update({
                    where: { id: transaction.id },
                    data: {
                        status: newStatus,
                        gatewayResponse: payload,
                        completedAt: newStatus === TransactionStatus.COMPLETED ? new Date() : transaction.completedAt
                    }
                });
                // Verificar transacción para procesar lógica adicional
                yield this.verifyTransaction(transaction.id);
                return { success: true };
            }
            catch (error) {
                ServerLogger.error('Error al procesar webhook', error);
                throw new Error('No se pudo procesar el webhook');
            }
        });
    }
    /**
     * Reembolsa una transacción
     */
    static refundTransaction(transactionId, amount, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield prisma.transaction.findUnique({
                    where: { id: transactionId },
                    include: {
                        gateway: true
                    }
                });
                if (!transaction) {
                    throw new Error('Transacción no encontrada');
                }
                if (transaction.status !== TransactionStatus.COMPLETED) {
                    throw new Error('Solo se pueden reembolsar transacciones completadas');
                }
                if (!transaction.gatewayReference) {
                    throw new Error('La transacción no tiene referencia de pasarela');
                }
                // Validar monto de reembolso
                const refundAmount = amount || transaction.amount;
                if (refundAmount <= 0 || refundAmount > transaction.amount) {
                    throw new Error('Monto de reembolso inválido');
                }
                // Procesar reembolso en la pasarela
                const adapter = PaymentGatewayFactory.createAdapter(transaction.gateway.name);
                if (!adapter) {
                    throw new Error(`No se pudo crear adaptador para la pasarela ${transaction.gateway.name}`);
                }
                // Inicializar adaptador con configuración
                const gatewayConfig = Object.assign({ apiKey: yield EncryptionService.decrypt(transaction.gateway.apiKey), apiSecret: yield EncryptionService.decrypt(transaction.gateway.apiSecret), merchantId: transaction.gateway.merchantId, accountId: transaction.gateway.accountId, testMode: transaction.gateway.testMode }, transaction.gateway.config);
                yield adapter.initialize(gatewayConfig);
                // Procesar reembolso
                const refundResponse = yield adapter.refundPayment(transaction.gatewayReference, refundAmount);
                // Actualizar transacción
                const updatedTransaction = yield prisma.transaction.update({
                    where: { id: transaction.id },
                    data: {
                        status: TransactionStatus.REFUNDED,
                        gatewayResponse: Object.assign(Object.assign({}, transaction.gatewayResponse), { refund: refundResponse }),
                        metadata: Object.assign(Object.assign({}, transaction.metadata), { refund: {
                                amount: refundAmount,
                                reason: reason || 'Reembolso solicitado',
                                date: new Date()
                            } })
                    }
                });
                // Si hay factura asociada, actualizar su estado
                if (transaction.invoiceId) {
                    yield prisma.invoice.update({
                        where: { id: transaction.invoiceId },
                        data: {
                            status: 'UNPAID',
                            paidAmount: 0
                        }
                    });
                }
                // Enviar notificación al usuario
                yield NotificationService.sendNotification({
                    userId: transaction.userId,
                    title: 'Reembolso procesado',
                    content: `Su pago por ${refundAmount} ${transaction.currency} ha sido reembolsado.`,
                    type: 'PAYMENT',
                    actionUrl: `/payments/transaction/${transaction.id}`
                });
                // Registrar actividad
                yield ActivityLogger.log({
                    action: 'payment.transaction.refunded',
                    userId: transaction.userId,
                    entityType: 'transaction',
                    entityId: transaction.id,
                    details: {
                        amount: refundAmount,
                        currency: transaction.currency,
                        reason: reason || 'Reembolso solicitado'
                    }
                });
                return updatedTransaction;
            }
            catch (error) {
                ServerLogger.error('Error al reembolsar transacción', error);
                throw new Error('No se pudo reembolsar la transacción');
            }
        });
    }
    /**
     * Guarda un token de pago para uso futuro
     */
    static savePaymentToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Encriptar token
                const encryptedToken = yield EncryptionService.encrypt(data.token);
                // Si este token será el predeterminado, quitar ese estado de otros tokens
                if (data.isDefault) {
                    yield prisma.paymentToken.updateMany({
                        where: {
                            userId: data.userId,
                            isDefault: true
                        },
                        data: { isDefault: false }
                    });
                }
                // Crear token
                const paymentToken = yield prisma.paymentToken.create({
                    data: {
                        userId: data.userId,
                        gatewayId: data.gatewayId,
                        type: data.type,
                        token: encryptedToken,
                        lastFour: data.lastFour,
                        brand: data.brand,
                        expiryMonth: data.expiryMonth,
                        expiryYear: data.expiryYear,
                        holderName: data.holderName,
                        isDefault: data.isDefault || false
                    }
                });
                // Registrar actividad
                yield ActivityLogger.log({
                    action: 'payment.token.create',
                    userId: data.userId,
                    entityType: 'paymentToken',
                    entityId: paymentToken.id,
                    details: {
                        type: data.type,
                        brand: data.brand,
                        lastFour: data.lastFour
                    }
                });
                return {
                    id: paymentToken.id,
                    type: paymentToken.type,
                    lastFour: paymentToken.lastFour,
                    brand: paymentToken.brand,
                    expiryMonth: paymentToken.expiryMonth,
                    expiryYear: paymentToken.expiryYear,
                    holderName: paymentToken.holderName,
                    isDefault: paymentToken.isDefault
                };
            }
            catch (error) {
                ServerLogger.error('Error al guardar token de pago', error);
                throw new Error('No se pudo guardar el token de pago');
            }
        });
    }
    /**
     * Obtiene tokens de pago de un usuario
     */
    static getUserPaymentTokens(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokens = yield prisma.paymentToken.findMany({
                    where: {
                        userId,
                        isActive: true
                    },
                    include: {
                        gateway: {
                            select: {
                                name: true
                            }
                        }
                    },
                    orderBy: [
                        { isDefault: 'desc' },
                        { createdAt: 'desc' }
                    ]
                });
                // No devolver el token encriptado
                return tokens.map(token => ({
                    id: token.id,
                    type: token.type,
                    lastFour: token.lastFour,
                    brand: token.brand,
                    expiryMonth: token.expiryMonth,
                    expiryYear: token.expiryYear,
                    holderName: token.holderName,
                    isDefault: token.isDefault,
                    gateway: token.gateway.name,
                    createdAt: token.createdAt
                }));
            }
            catch (error) {
                ServerLogger.error(`Error al obtener tokens de pago del usuario ${userId}`, error);
                throw new Error('No se pudieron obtener los tokens de pago');
            }
        });
    }
    /**
     * Elimina un token de pago
     */
    static deletePaymentToken(tokenId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar que el token pertenece al usuario
                const token = yield prisma.paymentToken.findFirst({
                    where: {
                        id: tokenId,
                        userId
                    }
                });
                if (!token) {
                    throw new Error('Token de pago no encontrado');
                }
                // Desactivar token en lugar de eliminarlo
                yield prisma.paymentToken.update({
                    where: { id: tokenId },
                    data: { isActive: false }
                });
                // Registrar actividad
                yield ActivityLogger.log({
                    action: 'payment.token.delete',
                    userId,
                    entityType: 'paymentToken',
                    entityId: tokenId,
                    details: {
                        type: token.type,
                        brand: token.brand,
                        lastFour: token.lastFour
                    }
                });
                return { success: true };
            }
            catch (error) {
                ServerLogger.error(`Error al eliminar token de pago ${tokenId}`, error);
                throw new Error('No se pudo eliminar el token de pago');
            }
        });
    }
    /**
     * Configura una pasarela de pago
     */
    static configureGateway(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Encriptar credenciales
                const encryptedApiKey = yield EncryptionService.encrypt(data.apiKey);
                const encryptedApiSecret = yield EncryptionService.encrypt(data.apiSecret);
                // Buscar si ya existe la pasarela
                const existingGateway = yield prisma.paymentGateway.findFirst({
                    where: {
                        name: { equals: data.name, mode: 'insensitive' }
                    }
                });
                let gateway;
                if (existingGateway) {
                    // Actualizar pasarela existente
                    gateway = yield prisma.paymentGateway.update({
                        where: { id: existingGateway.id },
                        data: {
                            apiKey: encryptedApiKey,
                            apiSecret: encryptedApiSecret,
                            merchantId: data.merchantId,
                            accountId: data.accountId,
                            testMode: data.testMode !== undefined ? data.testMode : existingGateway.testMode,
                            supportedMethods: data.supportedMethods,
                            webhookUrl: data.webhookUrl,
                            webhookSecret: data.webhookSecret,
                            config: data.config,
                            isActive: true,
                            updatedAt: new Date()
                        }
                    });
                }
                else {
                    // Crear nueva pasarela
                    gateway = yield prisma.paymentGateway.create({
                        data: {
                            name: data.name,
                            apiKey: encryptedApiKey,
                            apiSecret: encryptedApiSecret,
                            merchantId: data.merchantId,
                            accountId: data.accountId,
                            testMode: data.testMode !== undefined ? data.testMode : true,
                            supportedMethods: data.supportedMethods,
                            webhookUrl: data.webhookUrl,
                            webhookSecret: data.webhookSecret,
                            config: data.config,
                            isActive: true
                        }
                    });
                }
                // Validar configuración con la pasarela
                const adapter = PaymentGatewayFactory.createAdapter(gateway.name);
                if (!adapter) {
                    throw new Error(`No se pudo crear adaptador para la pasarela ${gateway.name}`);
                }
                const gatewayConfig = Object.assign({ apiKey: data.apiKey, apiSecret: data.apiSecret, merchantId: data.merchantId, accountId: data.accountId, testMode: gateway.testMode }, data.config);
                const isValid = yield adapter.initialize(gatewayConfig);
                if (!isValid) {
                    throw new Error(`Configuración inválida para la pasarela ${gateway.name}`);
                }
                return {
                    id: gateway.id,
                    name: gateway.name,
                    supportedMethods: gateway.supportedMethods,
                    testMode: gateway.testMode,
                    isActive: gateway.isActive
                };
            }
            catch (error) {
                ServerLogger.error('Error al configurar pasarela de pago', error);
                throw new Error('No se pudo configurar la pasarela de pago');
            }
        });
    }
    /**
     * Configura un método de pago
     */
    static configurePaymentMethod(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar si ya existe el método
                const existingMethod = yield prisma.paymentMethod.findFirst({
                    where: {
                        code: { equals: data.code, mode: 'insensitive' }
                    }
                });
                let paymentMethod;
                if (existingMethod) {
                    // Actualizar método existente
                    paymentMethod = yield prisma.paymentMethod.update({
                        where: { id: existingMethod.id },
                        data: {
                            name: data.name,
                            icon: data.icon,
                            gatewayMethods: data.gatewayMethods,
                            surcharge: data.surcharge !== undefined ? data.surcharge : existingMethod.surcharge,
                            minAmount: data.minAmount,
                            maxAmount: data.maxAmount,
                            instructions: data.instructions,
                            isActive: true,
                            updatedAt: new Date()
                        }
                    });
                }
                else {
                    // Crear nuevo método
                    paymentMethod = yield prisma.paymentMethod.create({
                        data: {
                            name: data.name,
                            code: data.code,
                            icon: data.icon,
                            gatewayMethods: data.gatewayMethods,
                            surcharge: data.surcharge || 0,
                            minAmount: data.minAmount,
                            maxAmount: data.maxAmount,
                            instructions: data.instructions,
                            isActive: true
                        }
                    });
                }
                return paymentMethod;
            }
            catch (error) {
                ServerLogger.error('Error al configurar método de pago', error);
                throw new Error('No se pudo configurar el método de pago');
            }
        });
    }
    /**
     * Obtiene transacciones de un usuario
     */
    static getUserTransactions(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 10, status) {
            try {
                const skip = (page - 1) * limit;
                const where = Object.assign({ userId }, (status && { status }));
                const total = yield prisma.transaction.count({ where });
                const transactions = yield prisma.transaction.findMany({
                    where,
                    include: {
                        gateway: {
                            select: {
                                name: true
                            }
                        },
                        method: {
                            select: {
                                name: true,
                                code: true,
                                icon: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit
                });
                return {
                    data: transactions,
                    pagination: {
                        total,
                        page,
                        limit,
                        pages: Math.ceil(total / limit)
                    }
                };
            }
            catch (error) {
                ServerLogger.error(`Error al obtener transacciones del usuario ${userId}`, error);
                throw new Error('No se pudieron obtener las transacciones');
            }
        });
    }
    /**
     * Obtiene estadísticas de pagos
     */
    static getPaymentStats(dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const fromDate = dateFrom || new Date(now.setMonth(now.getMonth() - 1));
                const toDate = dateTo || new Date();
                // Total de transacciones por estado
                const transactionsByStatus = yield prisma.transaction.groupBy({
                    by: ['status'],
                    where: {
                        createdAt: {
                            gte: fromDate,
                            lte: toDate
                        }
                    },
                    _count: true,
                    _sum: {
                        amount: true
                    }
                });
                // Transacciones por método de pago
                const transactionsByMethod = yield prisma.transaction.groupBy({
                    by: ['methodId'],
                    where: {
                        status: TransactionStatus.COMPLETED,
                        createdAt: {
                            gte: fromDate,
                            lte: toDate
                        }
                    },
                    _count: true,
                    _sum: {
                        amount: true
                    }
                });
                // Obtener nombres de métodos
                const methodIds = transactionsByMethod.map(item => item.methodId);
                const methods = yield prisma.paymentMethod.findMany({
                    where: {
                        id: { in: methodIds }
                    },
                    select: {
                        id: true,
                        name: true,
                        code: true
                    }
                });
                // Mapear IDs a nombres
                const methodMap = new Map(methods.map(method => [method.id, { name: method.name, code: method.code }]));
                const paymentsByMethod = transactionsByMethod.map(item => {
                    var _a, _b;
                    return ({
                        methodId: item.methodId,
                        methodName: ((_a = methodMap.get(item.methodId)) === null || _a === void 0 ? void 0 : _a.name) || 'Desconocido',
                        methodCode: ((_b = methodMap.get(item.methodId)) === null || _b === void 0 ? void 0 : _b.code) || 'unknown',
                        count: item._count,
                        amount: item._sum.amount
                    });
                });
                // Transacciones por día
                const transactionsByDay = yield prisma.$queryRaw `
        SELECT 
          DATE_TRUNC('day', "createdAt") as day,
          COUNT(*) as count,
          SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'COMPLETED' THEN amount ELSE 0 END) as amount
        FROM "tenant"."Transaction"
        WHERE "createdAt" >= ${fromDate} AND "createdAt" <= ${toDate}
        GROUP BY DATE_TRUNC('day', "createdAt")
        ORDER BY day ASC
      `;
                return {
                    transactionsByStatus,
                    paymentsByMethod,
                    transactionsByDay,
                    period: {
                        from: fromDate,
                        to: toDate
                    }
                };
            }
            catch (error) {
                ServerLogger.error('Error al obtener estadísticas de pagos', error);
                throw new Error('No se pudieron obtener las estadísticas');
            }
        });
    }
    /**
     * Método privado para mapear estados de pasarela a estados internos
     */
    static mapGatewayStatus(gatewayStatus) {
        const status = gatewayStatus.toUpperCase();
        if (['COMPLETED', 'APPROVED', 'SUCCESS', 'SUCCESSFUL'].includes(status)) {
            return TransactionStatus.COMPLETED;
        }
        if (['PENDING', 'CREATED', 'INITIALIZED'].includes(status)) {
            return TransactionStatus.PENDING;
        }
        if (['PROCESSING', 'IN_PROGRESS', 'WAITING'].includes(status)) {
            return TransactionStatus.PROCESSING;
        }
        if (['FAILED', 'DECLINED', 'REJECTED', 'ERROR'].includes(status)) {
            return TransactionStatus.FAILED;
        }
        if (['REFUNDED', 'REVERSED'].includes(status)) {
            return TransactionStatus.REFUNDED;
        }
        if (['CANCELLED', 'CANCELED'].includes(status)) {
            return TransactionStatus.CANCELLED;
        }
        if (['EXPIRED', 'TIMEOUT'].includes(status)) {
            return TransactionStatus.EXPIRED;
        }
        return TransactionStatus.PENDING;
    }
    /**
     * Método privado para extraer referencia de transacción de un webhook
     */
    static extractGatewayReference(gatewayName, payload) {
        var _a, _b, _c;
        try {
            switch (gatewayName.toLowerCase()) {
                case 'payu':
                    return payload.reference_sale || payload.referenceCode;
                case 'wompi':
                    return ((_b = (_a = payload.data) === null || _a === void 0 ? void 0 : _a.transaction) === null || _b === void 0 ? void 0 : _b.id) || ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.reference);
                default:
                    return null;
            }
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Método privado para extraer estado de un webhook
     */
    static extractGatewayStatus(gatewayName, payload) {
        var _a, _b, _c;
        try {
            switch (gatewayName.toLowerCase()) {
                case 'payu':
                    return payload.state_pol || payload.transactionState || 'PENDING';
                case 'wompi':
                    return ((_b = (_a = payload.data) === null || _a === void 0 ? void 0 : _a.transaction) === null || _b === void 0 ? void 0 : _b.status) || ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.status) || 'PENDING';
                default:
                    return 'PENDING';
            }
        }
        catch (error) {
            return 'PENDING';
        }
    }
}
