import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateMicroCreditApplicationDto,
  UpdateMicroCreditApplicationDto,
  MicroCreditApplicationDto,
  MicroCreditStatus,
} from '../../common/dto/fintech.dto';

@Injectable()
export class MicroCreditService {
  constructor(private prisma: PrismaService) {}

  private mapToMicroCreditApplicationDto(application: any): MicroCreditApplicationDto {
    return {
      id: application.id,
      userId: application.userId,
      amount: application.amount,
      status: application.status as MicroCreditStatus,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }

  async createApplication(
    schemaName: string,
    userId: string,
    data: CreateMicroCreditApplicationDto,
  ): Promise<MicroCreditApplicationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const application = await prisma.microCreditApplication.create({
      data: {
        amount: data.amount,
        userId: userId,
        status: MicroCreditStatus.PENDING,
      },
    });
    return this.mapToMicroCreditApplicationDto(application);
  }

  async getApplications(
    schemaName: string,
    userId: string,
  ): Promise<MicroCreditApplicationDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const applications = await prisma.microCreditApplication.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return applications.map(this.mapToMicroCreditApplicationDto);
  }

  async updateApplication(
    schemaName: string,
    id: string,
    data: UpdateMicroCreditApplicationDto,
  ): Promise<MicroCreditApplicationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
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
      },
    });
    return this.mapToMicroCreditApplicationDto(updatedApplication);
  }
}