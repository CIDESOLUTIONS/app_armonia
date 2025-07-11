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
import { subMonths } from 'date-fns';
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
            // KPIs
            const [totalResidentsInProperty, currentAccountBalance, annualPaymentsSummary, pendingFees, upcomingReservations, reportedPQRs, resolvedPQRs, commonAreaUsage] = yield Promise.all([
                tenantPrisma.resident.count({ where: { propertyId } }),
                tenantPrisma.bill.aggregate({
                    _sum: {
                        totalAmount: true,
                    },
                    where: {
                        propertyId,
                        status: { not: 'PAID' },
                    },
                }).then(result => { var _a; return ((_a = result._sum.totalAmount) === null || _a === void 0 ? void 0 : _a.toNumber()) || 0; }),
                tenantPrisma.payment.aggregate({
                    _sum: {
                        amount: true,
                    },
                    where: {
                        propertyId,
                        status: 'PAID',
                        paidAt: {
                            gte: new Date(new Date().getFullYear(), 0, 1), // Start of current year
                            lte: new Date(new Date().getFullYear(), 11, 31), // End of current year
                        },
                    },
                }).then(result => { var _a; return ((_a = result._sum.amount) === null || _a === void 0 ? void 0 : _a.toNumber()) || 0; }),
                tenantPrisma.bill.findMany({
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
                }),
                tenantPrisma.reservation.findMany({
                    where: {
                        userId: parseInt(userId),
                        startDateTime: { gte: new Date() },
                    },
                    orderBy: { startDateTime: 'asc' },
                    take: 3,
                }),
                tenantPrisma.pQR.count({ where: { reportedById: parseInt(userId), status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
                tenantPrisma.pQR.count({ where: { reportedById: parseInt(userId), status: 'CLOSED' } }),
                // Common Area Usage for resident (simplified: count their completed reservations last month)
                tenantPrisma.reservation.count({
                    where: {
                        userId: parseInt(userId),
                        status: 'COMPLETED',
                        createdAt: {
                            gte: subMonths(new Date(), 1),
                        },
                    },
                }),
            ]);
            const stats = {
                totalResidentsInProperty,
                currentAccountBalance,
                annualPaymentsSummary,
                pendingFees,
                upcomingReservations,
                reportedPQRs,
                resolvedPQRs,
                commonAreaUsage: commonAreaUsage > 0 ? 1 : 0, // Simple indicator if they used common areas
            };
            // Monthly expenses trend (placeholder for now)
            const monthlyExpensesTrend = [];
            for (let i = 5; i >= 0; i--) { // Last 6 months
                const month = subMonths(new Date(), i);
                monthlyExpensesTrend.push({
                    month: format(month, 'MMM yyyy'),
                    value: Math.floor(Math.random() * 1000000) // Simulated data
                });
            }
            ServerLogger.info(`Dashboard de residente para usuario ${userId} en complejo ${complexId} obtenido.`);
            return NextResponse.json({ stats, monthlyExpensesTrend }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener datos del dashboard de residente:', error);
            return NextResponse.json({ message: 'Error al obtener datos del dashboard de residente', error: error.message }, { status: 500 });
        }
    });
}
