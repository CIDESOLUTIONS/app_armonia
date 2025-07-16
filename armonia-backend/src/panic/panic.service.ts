import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePanicAlertDto,
  UpdatePanicAlertDto,
  PanicAlertDto,
  PanicStatus,
} from '../common/dto/panic.dto';

@Injectable()
export class PanicService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async createPanicAlert(
    schemaName: string,
    data: CreatePanicAlertDto,
  ): Promise<PanicAlertDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.panicAlert.create({
      data: { ...data, status: PanicStatus.ACTIVE },
    });
  }

  async getActivePanicAlerts(schemaName: string): Promise<PanicAlertDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.panicAlert.findMany({
      where: { status: PanicStatus.ACTIVE },
    });
  }

  async updatePanicAlertStatus(
    schemaName: string,
    id: number,
    data: UpdatePanicAlertDto,
  ): Promise<PanicAlertDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const alert = await prisma.panicAlert.findUnique({ where: { id } });

    if (!alert) {
      throw new NotFoundException(
        `Alerta de pánico con ID ${id} no encontrada.`,
      );
    }

    return prisma.panicAlert.update({ where: { id }, data });
  }
}
