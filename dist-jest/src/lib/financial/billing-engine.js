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
import { FreemiumService } from '@/lib/freemium-service';
export class BillingEngine {
    /**
     * Genera facturas automáticas para un período específico
     */
    static generateBillsForPeriod(complexId, period) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            // Verificar si el complejo tiene acceso a facturación avanzada
            const complex = yield prisma.residentialComplex.findUnique({
                where: { id: complexId },
                select: { planType: true, isTrialActive: true }
            });
            if (!complex) {
                throw new Error('Complejo no encontrado');
            }
            const hasAccess = FreemiumService.hasFeatureAccess(complex.planType, 'facturación_automática');
            if (!hasAccess && !complex.isTrialActive) {
                throw new Error('Funcionalidad no disponible en su plan actual');
            }
            // Obtener propiedades activas del complejo
            const properties = yield prisma.property.findMany({
                where: {
                    complexId,
                    isActive: true
                },
                include: {
                    owner: true,
                    residents: true
                }
            });
            // Obtener estructura de cuotas activas
            const fees = yield prisma.fee.findMany({
                where: {
                    complexId,
                    isActive: true
                }
            });
            const generatedBills = [];
            // Generar factura para cada propiedad
            for (const property of properties) {
                const billFees = [];
                let totalAmount = 0;
                // Calcular cada cuota
                for (const fee of fees) {
                    let amount = fee.baseAmount;
                    // Si es por unidad, calcular según área o valor de la propiedad
                    if (fee.isPerUnit && property.area) {
                        amount = fee.baseAmount * property.area;
                    }
                    billFees.push({
                        feeId: fee.id,
                        name: fee.name,
                        amount,
                        type: fee.type
                    });
                    totalAmount += amount;
                }
                // Fecha de vencimiento (por defecto día 15 del mes siguiente)
                const dueDate = new Date(period.year, period.month, 15);
                const generatedBill = {
                    propertyId: property.id,
                    period,
                    fees: billFees,
                    totalAmount,
                    dueDate,
                    generatedAt: new Date()
                };
                generatedBills.push(generatedBill);
            }
            return generatedBills;
        });
    }
    /**
     * Persiste las facturas generadas en la base de datos
     */
    static saveBills(bills) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                for (const bill of bills) {
                    yield tx.bill.create({
                        data: {
                            propertyId: bill.propertyId,
                            billingPeriod: `${bill.period.year}-${String(bill.period.month).padStart(2, '0')}`,
                            totalAmount: bill.totalAmount,
                            dueDate: bill.dueDate,
                            status: 'PENDING',
                            generatedAt: bill.generatedAt,
                            billItems: {
                                create: bill.fees.map(fee => ({
                                    feeId: fee.feeId,
                                    name: fee.name,
                                    amount: fee.amount,
                                    type: fee.type
                                }))
                            }
                        }
                    });
                }
            }));
        });
    }
    /**
     * Obtiene período de facturación actual
     */
    static getCurrentBillingPeriod() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // JavaScript months are 0-indexed
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of the month
        return {
            startDate,
            endDate,
            year,
            month
        };
    }
    /**
     * Calcula intereses por mora
     */
    static calculateLateFee(originalAmount, daysLate, interestRate = 0.03 // 3% mensual por defecto
    ) {
        if (daysLate <= 0)
            return 0;
        const monthlyRate = interestRate;
        const dailyRate = monthlyRate / 30;
        const lateFee = originalAmount * dailyRate * daysLate;
        return Math.round(lateFee * 100) / 100; // Redondear a 2 decimales
    }
    /**
     * Procesa pagos automáticamente
     */
    static processPayment(billId, amount, paymentMethod, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            const bill = yield prisma.bill.findUnique({
                where: { id: billId },
                include: { billItems: true }
            });
            if (!bill) {
                throw new Error('Factura no encontrada');
            }
            if (bill.status === 'PAID') {
                throw new Error('Factura ya está pagada');
            }
            // Verificar si el monto cubre la deuda
            const isFullPayment = amount >= bill.totalAmount;
            yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Crear registro de pago
                yield tx.payment.create({
                    data: {
                        billId,
                        amount,
                        paymentMethod,
                        reference: reference || `PAY-${Date.now()}`,
                        paidAt: new Date(),
                        status: 'CONFIRMED'
                    }
                });
                // Actualizar estado de la factura si está completamente pagada
                if (isFullPayment) {
                    yield tx.bill.update({
                        where: { id: billId },
                        data: {
                            status: 'PAID',
                            paidAt: new Date()
                        }
                    });
                }
            }));
            return isFullPayment;
        });
    }
    /**
     * Genera reporte financiero del período
     */
    static generateFinancialReport(complexId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const prisma = getPrisma();
            const [bills, payments, expenses] = yield Promise.all([
                // Facturas del período
                prisma.bill.findMany({
                    where: {
                        property: { complexId },
                        generatedAt: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    include: {
                        billItems: true,
                        payments: true,
                        property: true
                    }
                }),
                // Pagos del período
                prisma.payment.findMany({
                    where: {
                        bill: {
                            property: { complexId }
                        },
                        paidAt: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                }),
                // Gastos del período (si existe tabla de expenses)
                ((_a = prisma.expense) === null || _a === void 0 ? void 0 : _a.findMany({
                    where: {
                        complexId,
                        expenseDate: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                })) || []
            ]);
            const totalBilled = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
            const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);
            const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const collectionRate = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;
            return {
                period: { startDate, endDate },
                summary: {
                    totalBilled,
                    totalCollected,
                    totalExpenses,
                    netIncome: totalCollected - totalExpenses,
                    collectionRate,
                    pendingAmount: totalBilled - totalCollected
                },
                bills: bills.length,
                payments: payments.length,
                expenses: expenses.length
            };
        });
    }
}
