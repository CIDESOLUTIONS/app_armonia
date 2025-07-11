var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// C:\Users\meciz\Documents\armonia\frontend\src\app\api\dashboard\stats\route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ActivityLogger } from '@/lib/logging/activity-logger';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'; // Import date-fns
const logger = new ActivityLogger();
export function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = yield getServerSession(authOptions);
            if (!session || !session.user) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            }
            const complexId = session.user.complexId;
            const schemaName = session.user.schemaName;
            if (!complexId || !schemaName) {
                return NextResponse.json({ message: 'Complex ID or schema name not found in session' }, { status: 400 });
            }
            // Obtener cliente Prisma para el esquema 'armonia' (global)
            const armoniaPrisma = getPrisma('armonia');
            // Obtener datos del ResidentialComplex desde 'armonia'
            const complexResult = (yield armoniaPrisma.$queryRawUnsafe(`SELECT * FROM "armonia"."ResidentialComplex" WHERE id = $1 LIMIT 1`, complexId));
            if (!complexResult || complexResult.length === 0) {
                return NextResponse.json({ message: 'Conjunto no encontrado' }, { status: 404 });
            }
            const complex = complexResult[0];
            // Obtener cliente Prisma para el esquema del tenant
            const tenantPrisma = getPrisma(schemaName);
            // Verificar existencia de tablas en el esquema del tenant
            const tableExists = (tableName) => __awaiter(this, void 0, void 0, function* () {
                const queryResult = yield tenantPrisma.$queryRawUnsafe(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2)`, schemaName, tableName.toLowerCase());
                return queryResult[0].exists;
            });
            // --- KPI Calculations ---
            const [totalProperties, totalResidents, pendingPayments, totalRevenue, upcomingAssemblies, pendingPQRs, resolvedPQRs, activeProjects, totalVehicles, totalPets, 
            // New for commonAreaUsage and budgetExecution
            allCommonAreas, completedReservationsLastMonth, currentBudget, totalExpensesCurrentBudget] = yield Promise.all([
                (yield tableExists('Property')) ? tenantPrisma.property.count() : 0,
                (yield tableExists('Resident')) ? tenantPrisma.resident.count() : 0,
                (yield tableExists('Fee')) ? tenantPrisma.fee.aggregate({
                    _sum: {
                        amount: true,
                    },
                    where: {
                        status: 'PENDING',
                        dueDate: {
                            lt: new Date(),
                        },
                    },
                }).then((result) => result._sum.amount || 0) : 0,
                (yield tableExists('Payment')) ? tenantPrisma.payment.aggregate({
                    _sum: {
                        amount: true,
                    },
                    where: {
                        status: 'COMPLETED',
                    },
                }).then((result) => result._sum.amount || 0) : 0,
                (yield tableExists('Assembly')) ? tenantPrisma.assembly.count({
                    where: {
                        date: {
                            gte: new Date(),
                        },
                    },
                }) : 0,
                (yield tableExists('PQR')) ? tenantPrisma.pQR.count({
                    where: {
                        status: {
                            in: ['OPEN', 'IN_PROGRESS'],
                        },
                    },
                }) : 0,
                (yield tableExists('PQR')) ? tenantPrisma.pQR.count({
                    where: {
                        status: 'CLOSED',
                    },
                }) : 0,
                (yield tableExists('Project')) ? tenantPrisma.project.count({
                    where: {
                        status: 'ACTIVE',
                    },
                }) : 0,
                (yield tableExists('Vehicle')) ? tenantPrisma.vehicle.count() : 0,
                (yield tableExists('Pet')) ? tenantPrisma.pet.count() : 0,
                // Fetch data for commonAreaUsage
                (yield tableExists('CommonArea')) ? tenantPrisma.commonArea.findMany({
                    include: {
                        availabilityConfig: true,
                    },
                }) : [],
                (yield tableExists('Reservation')) ? tenantPrisma.reservation.findMany({
                    where: {
                        status: 'COMPLETED',
                        createdAt: {
                            gte: subMonths(new Date(), 1), // Last month
                        },
                    },
                }) : [],
                // Fetch data for budgetExecution
                (yield tableExists('Budget')) ? tenantPrisma.budget.findFirst({
                    where: {
                        status: {
                            in: ['APPROVED', 'ACTIVE'],
                        },
                        year: new Date().getFullYear(), // Current year's budget
                    },
                    include: {
                        budgetItems: true,
                    },
                }) : null,
                (yield tableExists('Expense')) ? tenantPrisma.expense.aggregate({
                    _sum: {
                        amount: true,
                    },
                    where: {
                        expenseDate: {
                            gte: startOfMonth(new Date()), // Expenses for current month
                            lte: endOfMonth(new Date()),
                        },
                    },
                }).then((result) => result._sum.amount || 0) : 0,
            ]);
            // Calculate commonAreaUsage
            let commonAreaUsage = 0;
            if (allCommonAreas.length > 0 && completedReservationsLastMonth.length > 0) {
                let totalReservedMinutes = 0;
                completedReservationsLastMonth.forEach(res => {
                    totalReservedMinutes += (res.endDateTime.getTime() - res.startDateTime.getTime()) / (1000 * 60);
                });
                // Simplified total available minutes: assume 12 hours/day for 30 days for each common area
                const totalPossibleMinutesPerArea = 12 * 60 * 30;
                const totalAvailableMinutes = allCommonAreas.length * totalPossibleMinutesPerArea;
                if (totalAvailableMinutes > 0) {
                    commonAreaUsage = parseFloat(((totalReservedMinutes / totalAvailableMinutes) * 100).toFixed(2));
                }
            }
            // Calculate budgetExecution
            let budgetExecution = 0;
            if (currentBudget) {
                const totalBudgeted = currentBudget.budgetItems.reduce((sum, item) => sum + item.budgetedAmount.toNumber(), 0);
                if (totalBudgeted > 0) {
                    budgetExecution = parseFloat(((totalExpensesCurrentBudget / totalBudgeted) * 100).toFixed(2));
                }
            }
            const stats = {
                totalProperties,
                totalResidents,
                pendingPayments,
                totalRevenue,
                upcomingAssemblies,
                pendingPQRs,
                resolvedPQRs,
                commonAreaUsage, // Calculated
                budgetExecution, // Calculated
                activeProjects,
                totalVehicles,
                totalPets,
            };
            // --- Trend Data (Last 12 months) ---
            const revenueTrend = [];
            const commonAreaUsageTrend = [];
            const today = new Date();
            for (let i = 11; i >= 0; i--) {
                const month = subMonths(today, i);
                const monthStart = startOfMonth(month);
                const monthEnd = endOfMonth(month);
                const monthLabel = format(month, 'MMM yyyy');
                // Revenue for the month
                const monthlyRevenue = (yield tableExists('Payment')) ? yield tenantPrisma.payment.aggregate({
                    _sum: {
                        amount: true,
                    },
                    where: {
                        status: 'COMPLETED',
                        createdAt: {
                            gte: monthStart,
                            lte: monthEnd,
                        },
                    },
                }).then((result) => result._sum.amount || 0) : 0;
                revenueTrend.push({ month: monthLabel, value: monthlyRevenue });
                // Common Area Usage for the month (simplified calculation)
                const monthlyReservations = (yield tableExists('Reservation')) ? yield tenantPrisma.reservation.findMany({
                    where: {
                        status: 'COMPLETED',
                        createdAt: {
                            gte: monthStart,
                            lte: monthEnd,
                        },
                    },
                }) : [];
                let monthlyReservedMinutes = 0;
                monthlyReservations.forEach(res => {
                    monthlyReservedMinutes += (res.endDateTime.getTime() - res.startDateTime.getTime()) / (1000 * 60);
                });
                let monthlyCommonAreaUsage = 0;
                if (allCommonAreas.length > 0) {
                    const monthlyPossibleMinutesPerArea = 12 * 60 * (monthEnd.getDate() - monthStart.getDate() + 1); // Days in month
                    const monthlyTotalAvailableMinutes = allCommonAreas.length * monthlyPossibleMinutesPerArea;
                    if (monthlyTotalAvailableMinutes > 0) {
                        monthlyCommonAreaUsage = parseFloat(((monthlyReservedMinutes / monthlyTotalAvailableMinutes) * 100).toFixed(2));
                    }
                }
                commonAreaUsageTrend.push({ month: monthLabel, value: monthlyCommonAreaUsage });
            }
            // Obtener actividad reciente del tenant
            const [recentPayments, recentPQRs, recentAssemblies, recentIncidents] = yield Promise.all([
                (yield tableExists('Payment')) ? tenantPrisma.payment.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: { invoice: { include: { property: true } } },
                }) : [],
                (yield tableExists('PQR')) ? tenantPrisma.pQR.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                }) : [],
                (yield tableExists('Assembly')) ? tenantPrisma.assembly.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                }) : [],
                (yield tableExists('Incident')) ? tenantPrisma.incident.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                }) : [],
            ]);
            const recentActivity = [
                ...recentPayments.map(p => {
                    var _a, _b, _c;
                    return ({
                        id: p.id,
                        type: 'payment',
                        title: 'Pago recibido',
                        description: `Apartamento ${((_b = (_a = p.invoice) === null || _a === void 0 ? void 0 : _a.property) === null || _b === void 0 ? void 0 : _b.unitNumber) || 'N/A'} - ${((_c = p.invoice) === null || _c === void 0 ? void 0 : _c.description) || 'Pago de cuota'}`,
                        timestamp: p.createdAt.toISOString(),
                        status: 'success',
                    });
                }),
                ...recentPQRs.map(pqr => ({
                    id: pqr.id,
                    type: 'pqr',
                    title: `Nueva PQR: ${pqr.subject}`,
                    description: pqr.description,
                    timestamp: pqr.createdAt.toISOString(),
                    status: pqr.status === 'OPEN' || pqr.status === 'IN_PROGRESS' ? 'warning' : 'info',
                })),
                ...recentAssemblies.map(a => ({
                    id: a.id,
                    type: 'assembly',
                    title: `Asamblea: ${a.title}`,
                    description: a.description,
                    timestamp: a.createdAt.toISOString(),
                    status: 'info',
                })),
                ...recentIncidents.map(i => ({
                    id: i.id,
                    type: 'incident',
                    title: `Incidente: ${i.subject}`,
                    description: i.description,
                    timestamp: i.createdAt.toISOString(),
                    status: i.status === 'OPEN' || i.status === 'IN_PROGRESS' ? 'error' : 'info',
                })),
            ];
            // Sort activity by timestamp
            recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            logger.logActivity({
                module: 'dashboard',
                action: 'fetch_dashboard_data',
                entityId: complexId,
                details: { stats, activityCount: recentActivity.length },
            });
            return NextResponse.json({ stats, recentActivity, complexName: complex.name, revenueTrend, commonAreaUsageTrend }, { status: 200 });
        }
        catch (error) {
            logger.error('[API Dashboard] Error:', error);
            return NextResponse.json({ message: 'Error al obtener datos del dashboard', error: error.message }, { status: 500 });
        }
    });
}
