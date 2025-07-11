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
import { getPrisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ServerLogger } from '@/lib/logging/server-logger';
import { startOfYear, endOfYear } from 'date-fns';
export function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = yield getServerSession(authOptions);
            if (!session || !session.user) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            }
            const userId = session.user.id;
            const complexId = session.user.complexId;
            const schemaName = session.user.schemaName;
            if (!userId || !complexId || !schemaName) {
                return NextResponse.json({ message: 'User, Complex ID or schema name not found in session' }, { status: 400 });
            }
            const tenantPrisma = getPrisma(schemaName);
            // Get user's property ID
            const userProperty = yield tenantPrisma.resident.findFirst({
                where: { userId: parseInt(userId) },
                select: { propertyId: true },
            });
            const propertyId = userProperty === null || userProperty === void 0 ? void 0 : userProperty.propertyId;
            if (!propertyId) {
                return NextResponse.json({ message: 'Propiedad del usuario no encontrada' }, { status: 404 });
            }
            // Financial Summary
            const currentAccountBalance = yield tenantPrisma.bill.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    propertyId,
                    status: { not: 'PAID' },
                },
            }).then(result => { var _a; return ((_a = result._sum.totalAmount) === null || _a === void 0 ? void 0 : _a.toNumber()) || 0; });
            const totalPaidThisYear = yield tenantPrisma.payment.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    propertyId,
                    status: 'PAID',
                    paidAt: {
                        gte: startOfYear(new Date()),
                        lte: endOfYear(new Date()),
                    },
                },
            }).then(result => { var _a; return ((_a = result._sum.amount) === null || _a === void 0 ? void 0 : _a.toNumber()) || 0; });
            const totalPendingFees = yield tenantPrisma.bill.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    propertyId,
                    status: { not: 'PAID' },
                },
            }).then(result => { var _a; return ((_a = result._sum.totalAmount) === null || _a === void 0 ? void 0 : _a.toNumber()) || 0; });
            const summary = {
                currentAccountBalance,
                totalPaidThisYear,
                totalPendingFees,
            };
            // Payment History
            const payments = yield tenantPrisma.payment.findMany({
                where: {
                    propertyId,
                },
                select: {
                    id: true,
                    amount: true,
                    paidAt: true,
                    status: true,
                    bill: { select: { billNumber: true } },
                },
                orderBy: { paidAt: 'desc' },
                take: 10, // Limit to recent payments
            });
            const formattedPayments = payments.map(p => {
                var _a;
                return (Object.assign(Object.assign({}, p), { billNumber: ((_a = p.bill) === null || _a === void 0 ? void 0 : _a.billNumber) || 'N/A' }));
            });
            // Pending Fees (detailed)
            const pendingFees = yield tenantPrisma.bill.findMany({
                where: {
                    propertyId,
                    status: { not: 'PAID' },
                },
                select: {
                    id: true,
                    billNumber: true,
                    totalAmount: true,
                    dueDate: true,
                    billingPeriod: true,
                },
                orderBy: { dueDate: 'asc' },
            });
            ServerLogger.info(`Datos financieros de residente para usuario ${userId} en complejo ${complexId} obtenidos.`);
            return NextResponse.json({ summary, payments: formattedPayments, pendingFees }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener datos financieros de residente:', error);
            return NextResponse.json({ message: 'Error al obtener datos financieros de residente', error: error.message }, { status: 500 });
        }
    });
}
