import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMicroCreditApplicationDto,
  UpdateMicroCreditApplicationDto,
  MicroCreditApplicationDto,
  MicroCreditFilterParamsDto,
  MicroCreditStatus,
} from '../common/dto/fintech.dto';

@Injectable()
export class FintechService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async createMicroCreditApplication(
    schemaName: string,
    userId: number,
    data: CreateMicroCreditApplicationDto,
  ): Promise<MicroCreditApplicationDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Placeholder for integration with external FinTech API
    console.log('Creating micro-credit application:', data);

    return prisma.microCreditApplication.create({
      data: {
        ...data,
        userId,
        userName: 'Placeholder User', // TODO: Fetch actual user name
        applicationDate: new Date().toISOString(),
        status: MicroCreditStatus.PENDING,
      },
    });
  }

  async getMicroCreditApplications(
    schemaName: string,
    filters: MicroCreditFilterParamsDto,
  ): Promise<MicroCreditApplicationDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { purpose: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.userId) {
      where.userId = filters.userId;
    }
    if (filters.startDate) {
      where.applicationDate = { gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.applicationDate = {
        ...where.applicationDate,
        lte: new Date(filters.endDate),
      };
    }

    return prisma.microCreditApplication.findMany({
      where,
      skip: (filters.page - 1) * filters.limit || 0,
      take: filters.limit || 10,
      orderBy: { applicationDate: 'desc' },
    });
  }

  async getMicroCreditApplicationById(
    schemaName: string,
    id: number,
  ): Promise<MicroCreditApplicationDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const application = await prisma.microCreditApplication.findUnique({
      where: { id },
    });
    if (!application) {
      throw new NotFoundException(
        `Solicitud de micro-crédito con ID ${id} no encontrada.`,
      );
    }
    return application;
  }

  async updateMicroCreditApplication(
    schemaName: string,
    id: number,
    data: UpdateMicroCreditApplicationDto,
  ): Promise<MicroCreditApplicationDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const application = await prisma.microCreditApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(
        `Solicitud de micro-crédito con ID ${id} no encontrada.`,
      );
    }

    return prisma.microCreditApplication.update({
      where: { id },
      data,
    });
  }
}
