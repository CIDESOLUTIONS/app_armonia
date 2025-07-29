import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommunicationsService } from '../communications/communications.service.js';
import { CreatePanicAlertDto, UpdatePanicAlertDto, CreatePanicResponseDto } from '../common/dto/panic.dto.js';
import { NotificationType, NotificationSourceType } from '../common/dto/communications.dto.js';
import { UserRole } from '../common/enums/user-role.enum.js';

@Injectable()
export class PanicService {
  constructor(
    private prisma: PrismaService,
    private communicationsService: CommunicationsService,
  ) {}

  async createAlert(schemaName: string, createPanicAlertDto: CreatePanicAlertDto) {
    const prisma = this.prisma;
    const alert = await prisma.panicAlert.create({
      data: createPanicAlertDto,
    });

    // Notify security personnel
    await this.communicationsService.notifyByRole(schemaName, UserRole.SECURITY, {
      type: NotificationType.ERROR,
      title: '¡Alerta de Pánico!',
      message: `Alerta de pánico activada por un residente. Tipo: ${alert.type}.`,
      link: `/security/panic/${alert.id}`,
      sourceType: NotificationSourceType.PANIC,
      sourceId: alert.id.toString(),
    });

    return alert;
  }

  async getAlerts(schemaName: string, filters: any) {
    const prisma = this.prisma;
    return prisma.panicAlert.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAlertById(schemaName: string, id: number) {
    const prisma = this.prisma;
    const alert = await prisma.panicAlert.findUnique({ where: { id } });
    if (!alert) {
      throw new NotFoundException(`Alerta de pánico con ID ${id} no encontrada.`);
    }
    return alert;
  }

  async updateAlert(schemaName: string, id: number, updatePanicAlertDto: UpdatePanicAlertDto) {
    const prisma = this.prisma;
    return prisma.panicAlert.update({
      where: { id },
      data: updatePanicAlertDto,
    });
  }

  async createResponse(schemaName: string, createPanicResponseDto: CreatePanicResponseDto) {
    const prisma = this.prisma;
    return prisma.panicResponse.create({
      data: createPanicResponseDto,
    });
  }
}
