import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateMicroCreditApplicationDto,
  UpdateMicroCreditApplicationDto,
  MicroCreditApplicationDto,
  MicroCreditStatus,
} from '../../common/dto/fintech.dto.js';

@Injectable()
export class MicroCreditService {
  constructor(private prisma: PrismaService) {}

  async createApplication(
    schemaName: string,
    userId: number,
    data: CreateMicroCreditApplicationDto,
  ): Promise<MicroCreditApplicationDto> {
    const prisma = this.prisma;
    const application = await prisma.microCreditApplication.create({
      data: {
        amount: data.amount,
        purpose: data.purpose,
        userId: userId,
        status: MicroCreditStatus.PENDING,
        applicationDate: new Date(),
      },
    });
    return application;
  }

  async getApplications(
    schemaName: string,
    userId: number,
  ): Promise<MicroCreditApplicationDto[]> {
    const prisma = this.prisma;
    return prisma.microCreditApplication.findMany({
      where: { userId: userId },
      orderBy: { applicationDate: 'desc' },
    });
  }

  async updateApplication(
    schemaName: string,
    id: number,
    data: UpdateMicroCreditApplicationDto,
  ): Promise<MicroCreditApplicationDto> {
    const prisma = this.prisma;
    const application = await prisma.microCreditApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(
        `Solicitud de micro-crédito con ID ${id} no encontrada.`,
      );
    }

    const updatedApplication = await prisma.microCreditApplication.update({
      where: { id },
      data: {
        status: data.status,
        approvalDate:
          data.status === MicroCreditStatus.APPROVED ? new Date() : undefined,
      },
    });
    return updatedApplication;
  }
}
