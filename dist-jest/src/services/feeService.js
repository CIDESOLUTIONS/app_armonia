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
export class FeeService {
    constructor(schemaName) {
        this.schemaName = schemaName;
        this.prisma = getPrisma(schemaName);
    }
    getFees(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const where = {};
                if (filters.type)
                    where.type = filters.type;
                if (filters.status)
                    where.status = filters.status;
                if (filters.startDate)
                    where.dueDate = { gte: new Date(filters.startDate) };
                if (filters.endDate)
                    where.dueDate = Object.assign(Object.assign({}, where.dueDate), { lte: new Date(filters.endDate) });
                const fees = yield this.prisma.fee.findMany({
                    where,
                    include: {
                        unit: { select: { unitNumber: true } },
                        payment: { select: { id: true, amount: true, paymentDate: true, paymentMethod: true, reference: true } },
                    },
                    orderBy: { dueDate: 'desc' },
                });
                return fees.map(fee => {
                    var _a;
                    return (Object.assign(Object.assign({}, fee), { unitNumber: ((_a = fee.unit) === null || _a === void 0 ? void 0 : _a.unitNumber) || 'N/A' }));
                });
            }
            catch (error) {
                ServerLogger.error(`[FeeService] Error al obtener cuotas para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    createBulkFees(feeType, baseAmount, startDate, endDate, unitIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const dates = [];
                const currentDate = new Date(startDate);
                const endDateTime = new Date(endDate);
                while (currentDate <= endDateTime) {
                    dates.push(new Date(currentDate));
                    currentDate.setMonth(currentDate.getMonth() + 1);
                }
                for (const unitId of unitIds) {
                    for (const dueDate of dates) {
                        yield tx.fee.create({
                            data: {
                                unitId,
                                type: feeType,
                                amount: baseAmount,
                                dueDate,
                                status: 'PENDING',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        });
                    }
                }
            }));
            ServerLogger.info(`[FeeService] Cuotas masivas creadas para ${this.schemaName}`);
        });
    }
    updateFee(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedFee = yield this.prisma.fee.update({
                    where: { id },
                    data: Object.assign(Object.assign({}, data), { updatedAt: new Date() }),
                });
                ServerLogger.info(`[FeeService] Cuota ${id} actualizada para ${this.schemaName}`);
                return updatedFee;
            }
            catch (error) {
                ServerLogger.error(`[FeeService] Error al actualizar cuota ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    deleteFee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.fee.delete({ where: { id } });
                ServerLogger.info(`[FeeService] Cuota ${id} eliminada para ${this.schemaName}`);
            }
            catch (error) {
                ServerLogger.error(`[FeeService] Error al eliminar cuota ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    registerPayment(feeId, paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fee = yield this.prisma.fee.findUnique({ where: { id: feeId } });
                if (!fee) {
                    throw new Error('Cuota no encontrada.');
                }
                const payment = yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const newPayment = yield tx.payment.create({
                        data: {
                            feeId,
                            amount: paymentData.amount,
                            paymentDate: new Date(),
                            paymentMethod: paymentData.paymentMethod,
                            reference: paymentData.reference,
                            status: 'COMPLETED',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    });
                    yield tx.fee.update({
                        where: { id: feeId },
                        data: {
                            status: 'PAID',
                            paymentDate: new Date(),
                            updatedAt: new Date(),
                        },
                    });
                    return newPayment;
                }));
                ServerLogger.info(`[FeeService] Pago registrado para cuota ${feeId} en ${this.schemaName}`);
                return payment;
            }
            catch (error) {
                ServerLogger.error(`[FeeService] Error al registrar pago para cuota ${feeId} en ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
}
