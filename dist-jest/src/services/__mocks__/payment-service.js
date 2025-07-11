/**
 * Mock de PaymentService para pruebas unitarias y de integración
 * Implementado como clase constructora para compatibilidad con tests
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
class PaymentService {
    constructor(schema = 'public') {
        this.schema = schema;
        this.prisma = {
            payment: {
                findUnique: jest.fn().mockResolvedValue({
                    id: 1,
                    receiptId: 1,
                    userId: 1,
                    amount: 150000,
                    paymentMethod: 'CREDIT_CARD',
                    transactionId: 'txn_123456',
                    status: 'COMPLETED',
                    createdAt: new Date(),
                    completedAt: new Date()
                }),
                findMany: jest.fn().mockResolvedValue([
                    {
                        id: 1,
                        receiptId: 1,
                        userId: 1,
                        amount: 150000,
                        paymentMethod: 'CREDIT_CARD',
                        transactionId: 'txn_123456',
                        status: 'COMPLETED',
                        createdAt: new Date(),
                        completedAt: new Date()
                    }
                ]),
                create: jest.fn().mockResolvedValue({
                    id: 2,
                    receiptId: 2,
                    userId: 2,
                    amount: 150000,
                    paymentMethod: 'BANK_TRANSFER',
                    transactionId: 'txn_654321',
                    status: 'PENDING',
                    createdAt: new Date(),
                    completedAt: null
                }),
                update: jest.fn().mockResolvedValue({
                    id: 2,
                    receiptId: 2,
                    userId: 2,
                    amount: 150000,
                    paymentMethod: 'BANK_TRANSFER',
                    transactionId: 'txn_654321',
                    status: 'COMPLETED',
                    createdAt: new Date(),
                    completedAt: new Date()
                })
            },
            receipt: {
                update: jest.fn().mockResolvedValue({
                    id: 2,
                    receiptNumber: 'REC-002',
                    userId: 2,
                    amount: 150000,
                    concept: 'Cuota de administración',
                    status: 'PAID',
                    pdfUrl: '/receipts/REC-002.pdf',
                    createdAt: new Date(),
                    paidAt: new Date()
                })
            }
        };
    }
    /**
     * Procesa una transacción de pago
     * @param transactionId - ID de la transacción
     * @returns Resultado del procesamiento
     */
    processTransaction(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Simular búsqueda de transacción
                const transaction = yield this.prisma.payment.findUnique({
                    where: { id: transactionId }
                });
                if (!transaction) {
                    throw new Error('Transacción no encontrada');
                }
                if (transaction.status !== 'PENDING') {
                    throw new Error('La transacción no está pendiente');
                }
                // Simular procesamiento exitoso
                const updatedTransaction = yield this.prisma.payment.update({
                    where: { id: transactionId },
                    data: {
                        status: 'COMPLETED',
                        completedAt: new Date()
                    }
                });
                // Actualizar recibo asociado
                yield this.prisma.receipt.update({
                    where: { id: transaction.receiptId },
                    data: {
                        status: 'PAID',
                        paidAt: new Date()
                    }
                });
                return {
                    success: true,
                    transaction: updatedTransaction
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        });
    }
    /**
     * Procesa un webhook de pago
     * @param webhookData - Datos del webhook
     * @param signature - Firma del webhook
     * @returns Resultado del procesamiento
     */
    processWebhook(webhookData, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validar firma
                if (!this.validateSignature(webhookData, signature)) {
                    throw new Error('Firma inválida');
                }
                // Procesar según el tipo de evento
                if (webhookData.event === 'payment.success') {
                    const transactionId = webhookData.data.transactionId;
                    return yield this.processTransaction(transactionId);
                }
                return {
                    success: true,
                    message: 'Webhook procesado correctamente'
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        });
    }
    /**
     * Valida la firma de un webhook
     * @param data - Datos a validar
     * @param signature - Firma a validar
     * @returns Resultado de la validación
     */
    validateSignature(data, signature) {
        // En un entorno real, aquí se validaría la firma criptográficamente
        // Para pruebas, simplemente verificamos que exista una firma
        return !!signature && signature.length > 10;
    }
    /**
     * Obtiene transacciones con paginación
     * @param options - Opciones de filtrado y paginación
     * @returns Resultado paginado
     */
    getTransactions() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const { page = 1, limit = 10, userId, status } = options;
            const skip = (page - 1) * limit;
            const where = {};
            if (userId)
                where.userId = userId;
            if (status)
                where.status = status;
            const transactions = yield this.prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            });
            return {
                data: transactions,
                pagination: {
                    page,
                    limit,
                    total: transactions.length // En un caso real, se haría un count
                }
            };
        });
    }
}
export default PaymentService;
