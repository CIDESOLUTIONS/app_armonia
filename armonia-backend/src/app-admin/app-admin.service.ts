import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@armonia-backend/prisma/prisma.service';
import Decimal from 'decimal.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppAdminService {
  constructor(private prisma: PrismaService) {}

  async getOperativeMetrics(): Promise<any> {
    const publicPrisma = this.prisma.getTenantDB('public');

    const [totalComplexes, totalUsers, plans, subscriptions] = await Promise.all([
      publicPrisma.residentialComplex.count({ where: { isActive: true } }),
      publicPrisma.user.count(),
      publicPrisma.plan.findMany(),
      publicPrisma.subscription.findMany({
        where: { status: Prisma.SubscriptionStatus.ACTIVE },
        include: { plan: true },
      }),
    ]);

    let mrr = new Decimal(0);
    for (const sub of subscriptions) {
      let monthlyPrice = new Decimal(sub.plan.price);
      if (sub.plan.billingCycle === Prisma.BillingCycle.YEARLY) {
        monthlyPrice = monthlyPrice.div(12);
      } else if (sub.plan.billingCycle === Prisma.BillingCycle.QUARTERLY) {
        monthlyPrice = monthlyPrice.div(3);
      }
      mrr = mrr.plus(monthlyPrice);
    }
    const arr = mrr.times(12);

    const complexesByPlanRaw = await publicPrisma.residentialComplex.groupBy({
      by: ['planId'],
      _count: { id: true },
      where: { isActive: true },
    });

    const complexesByPlan = complexesByPlanRaw.map((group) => {
      const plan = plans.find((p) => p.id === group.planId);
      return {
        name: plan ? plan.name : 'Desconocido',
        count: group._count.id,
      };
    });

    return {
      totalComplexes,
      totalUsers,
      mrr: mrr.toDP(2).toNumber(),
      arr: arr.toDP(2).toNumber(),
      mrrChange: 0, // Placeholder
      complexesByPlan,
    };
  }

  async getComplexMetrics(): Promise<any[]> {
    const publicPrisma = this.prisma.getTenantDB('public');
    const complexes = await publicPrisma.residentialComplex.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    const complexMetricsPromises = complexes.map(async (complex) => {
      try {
        const tenantPrisma = this.prisma.getTenantDB(complex.id);
        const [residents, pendingFees, income, openPqrs] = await Promise.all([
          tenantPrisma.user.count({ where: { role: Prisma.UserRole.RESIDENT } }),
          tenantPrisma.fee.aggregate({ _sum: { amount: true }, where: { paid: false } }),
          tenantPrisma.payment.aggregate({ _sum: { amount: true }, where: { status: Prisma.PaymentStatus.COMPLETED } }),
          tenantPrisma.pQR.count({ where: { status: { notIn: [Prisma.PQRStatus.RESOLVED, Prisma.PQRStatus.CLOSED] } } }),
        ]);

        return {
          id: complex.id,
          name: complex.name,
          residents,
          pendingFees: (pendingFees._sum.amount || new Decimal(0)).toNumber(),
          income: (income._sum.amount || new Decimal(0)).toNumber(),
          openPqrs,
        };
      } catch (error) {
        return {
          id: complex.id,
          name: complex.name,
          error: `Could not fetch metrics: ${error.message}`,
        };
      }
    });

    return Promise.all(complexMetricsPromises);
  }

  async getFinancialSummary(startDate: string, endDate: string): Promise<any> {
    const publicPrisma = this.prisma.getTenantDB('public');
    const complexes = await publicPrisma.residentialComplex.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    let totalIncomeAllComplexes = new Decimal(0);
    let totalExpensesAllComplexes = new Decimal(0);

    const reportDataPromises = complexes.map(async (complex) => {
      try {
        const tenantPrisma = this.prisma.getTenantDB(complex.id);
        const [income, expenses] = await Promise.all([
          tenantPrisma.payment.aggregate({
            _sum: { amount: true },
            where: { date: { gte: new Date(startDate), lte: new Date(endDate) }, status: Prisma.PaymentStatus.COMPLETED },
          }),
          tenantPrisma.expense.aggregate({
            _sum: { amount: true },
            where: { expenseDate: { gte: new Date(startDate), lte: new Date(endDate) } },
          }),
        ]);

        const complexIncome = new Decimal(income._sum.amount || 0);
        const complexExpenses = new Decimal(expenses._sum.amount || 0);

        totalIncomeAllComplexes = totalIncomeAllComplexes.plus(complexIncome);
        totalExpensesAllComplexes = totalExpensesAllComplexes.plus(complexExpenses);

        return {
          complexName: complex.name,
          income: complexIncome.toNumber(),
          expenses: complexExpenses.toNumber(),
          netBalance: complexIncome.minus(complexExpenses).toNumber(),
        };
      } catch (error) {
        return {
          complexName: complex.name,
          error: `Could not fetch financial summary: ${error.message}`,
        };
      }
    });

    const complexReports = await Promise.all(reportDataPromises);

    return {
      startDate,
      endDate,
      totalIncomeAllComplexes: totalIncomeAllComplexes.toNumber(),
      totalExpensesAllComplexes: totalExpensesAllComplexes.toNumber(),
      netBalanceAllComplexes: totalIncomeAllComplexes.minus(totalExpensesAllComplexes).toNumber(),
      complexReports,
    };
  }
}
