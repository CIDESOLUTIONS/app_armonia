var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPrisma } from '@/lib/prisma';
import { ServerLogger } from '@/lib/logging/server-logger';
export class PaymentService {
    constructor(schemaName) {
        this.schemaName = schemaName;
        this.prisma = getPrisma(schemaName);
    }
    getPayments(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const where = {};
                if (filters.status)
                    where.status = filters.status;
                if (filters.paymentMethod)
                    where.paymentMethod = filters.paymentMethod;
                if (filters.startDate)
                    where.paymentDate = { gte: new Date(filters.startDate) };
                if (filters.endDate)
                    where.paymentDate = Object.assign(Object.assign({}, where.paymentDate), { lte: new Date(filters.endDate) });
                const orderBy = {};
                if (filters.sortField) {
                    orderBy[filters.sortField] = filters.sortDirection || 'desc';
                }
                else {
                    orderBy.paymentDate = 'desc';
                }
                const payments = yield this.prisma.payment.findMany({
                    where,
                    include: {
                        fee: {
                            select: {
                                type: true,
                                dueDate: true,
                                unit: { select: { unitNumber: true } },
                            },
                        },
                    },
                    orderBy,
                });
                return payments.map(payment => {
                    var _a, _b, _c, _d;
                    return (Object.assign(Object.assign({}, payment), { feeType: ((_a = payment.fee) === null || _a === void 0 ? void 0 : _a.type) || 'N/A', feeDueDate: ((_b = payment.fee) === null || _b === void 0 ? void 0 : _b.dueDate) || null, unitNumber: ((_d = (_c = payment.fee) === null || _c === void 0 ? void 0 : _c.unit) === null || _d === void 0 ? void 0 : _d.unitNumber) || 'N/A' }));
                });
            }
            catch (error) {
                ServerLogger.error(`[PaymentService] Error al obtener pagos para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    getPaymentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield this.prisma.payment.findUnique({
                    where: { id },
                    include: {
                        fee: {
                            select: {
                                type: true,
                                dueDate: true,
                                unit: { select: { unitNumber: true } },
                            },
                        },
                    },
                });
                return payment;
            }
            catch (error) {
                ServerLogger.error(`[PaymentService] Error al obtener pago ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    updatePayment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedPayment = yield this.prisma.payment.update({
                    where: { id },
                    data: Object.assign(Object.assign({}, data), { updatedAt: new Date() }),
                });
                ServerLogger.info(`[PaymentService] Pago ${id} actualizado para ${this.schemaName}`);
                return updatedPayment;
            }
            catch (error) {
                ServerLogger.error(`[PaymentService] Error al actualizar pago ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    deletePayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.payment.delete({ where: { id } });
                ServerLogger.info(`[PaymentService] Pago ${id} eliminado para ${this.schemaName}`);
            }
            catch (error) {
                ServerLogger.error(`[PaymentService] Error al eliminar pago ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
}
