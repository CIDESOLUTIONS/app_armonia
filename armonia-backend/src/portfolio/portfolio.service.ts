import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(private prisma: PrismaService) {}

  async getConsolidatedMetrics(userId: string): Promise<any> {
    this.logger.log(`Fetching consolidated metrics for user ${userId}`);

    const userWithComplexes = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        administeredComplexes: true,
      },
    });

    if (!userWithComplexes) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const consolidatedMetrics = {
      totalProperties: 0,
      totalResidents: 0,
      totalIncome: 0,
      totalExpenses: 0,
      totalPendingFees: 0,
      totalOpenPqrs: 0,
      totalBudgetsApproved: 0,
    };

    for (const complex of userWithComplexes.administeredComplexes) {
      try {
        const tenantPrisma = this.prisma.getTenantDB(complex.id);

        const [properties, residents, pendingFees, openPqrs] = await Promise.all([
          tenantPrisma.property.count(),
          tenantPrisma.resident.count(),
          tenantPrisma.fee.aggregate({ _sum: { amount: true }, where: { paid: false } }),
          tenantPrisma.pqr.count({ where: { status: 'OPEN' } }),
        ]);

        consolidatedMetrics.totalProperties += properties;
        consolidatedMetrics.totalResidents += residents;
        consolidatedMetrics.totalPendingFees += pendingFees._sum.amount || 0;
        consolidatedMetrics.totalOpenPqrs += openPqrs;

      } catch (error) {
        this.logger.error(`Could not process metrics for complex ${complex.id}: ${error.message}`);
      }
    }

    return consolidatedMetrics;
  }

  async getMetricsByComplex(userId: string): Promise<any[]> {
    this.logger.log(`Fetching metrics per complex for user ${userId}`);

    const userWithComplexes = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          administeredComplexes: true,
        },
      });
  
      if (!userWithComplexes) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

    const metricsPerComplex = [];

    for (const complex of userWithComplexes.administeredComplexes) {
        try {
            const tenantPrisma = this.prisma.getTenantDB(complex.id);
    
            const [properties, residents, pendingFees, openPqrs] = await Promise.all([
              tenantPrisma.property.count(),
              tenantPrisma.resident.count(),
              tenantPrisma.fee.aggregate({ _sum: { amount: true }, where: { paid: false } }),
              tenantPrisma.pqr.count({ where: { status: 'OPEN' } }),
            ]);
    
            metricsPerComplex.push({
              complexId: complex.id,
              complexName: complex.name,
              totalProperties: properties,
              totalResidents: residents,
              totalPendingFees: pendingFees._sum.amount || 0,
              totalOpenPqrs: openPqrs,
            });

        } catch (error) {
            this.logger.error(`Could not process metrics for complex ${complex.id}: ${error.message}`);
            metricsPerComplex.push({
                complexId: complex.id,
                complexName: complex.name,
                error: 'Could not fetch metrics for this complex.',
            });
        }
    }

    return metricsPerComplex;
  }
}
