import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreatePanicAlertDto,
  UpdatePanicAlertDto,
  CreatePanicResponseDto,
} from '../common/dto/panic.dto.js';
import { PanicGateway } from './panic.gateway.js'; // Import PanicGateway
import { NotificationType, NotificationSourceType, } from '../common/dto/communications.dto.js';

@Injectable()
export class PanicService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => PanicGateway))
    private panicGateway: PanicGateway, // Inject PanicGateway
  ) {}

  async createPanicAlert(schemaName: string, data: CreatePanicAlertDto) {
    const prisma = this.prisma;
    const newAlert = await prisma.panicAlert.create({ data });

    // Emit real-time notification
    this.panicGateway.sendNotificationToSchema(schemaName, {
      id: newAlert.id.toString(),
      title: '¡Alerta de Pánico!',
      message: `Alerta de pánico activada en ${newAlert.location} por ${newAlert.userId}.`,
      type: NotificationType.ERROR,
      link: `/reception/panic/${newAlert.id}`,
      createdAt: newAlert.alertTime.toISOString(),
    });

    return newAlert;
  }

  async getPanicAlerts(schemaName: string, filters: any = {}) {
    const prisma = this.prisma;
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.userId) where.userId = filters.userId;
    if (filters.complexId) where.complexId = filters.complexId;
    if (filters.propertyId) where.propertyId = filters.propertyId;
    return prisma.panicAlert.findMany({
      where,
      include: { user: true, complex: true, property: true, responses: true },
      orderBy: { alertTime: 'desc' },
    });
  }

  async getPanicAlertById(schemaName: string, id: number) {
    const prisma = this.prisma;
    const alert = await prisma.panicAlert.findUnique({
      where: { id },
      include: { user: true, complex: true, property: true, responses: true },
    });
    if (!alert) {
      throw new NotFoundException(
        `Alerta de pánico con ID ${id} no encontrada.`,
      );
    }
    return alert;
  }

  async updatePanicAlert(
    schemaName: string,
    id: number,
    data: UpdatePanicAlertDto,
  ) {
    const prisma = this.prisma;
    const updatedAlert = await prisma.panicAlert.update({
      where: { id },
      data,
    });

    // Emit real-time notification for update
    this.panicGateway.sendNotificationToSchema(schemaName, {
      id: updatedAlert.id.toString(),
      title: 'Alerta de Pánico Actualizada',
      message: `La alerta de pánico en ${updatedAlert.location} ha sido actualizada a ${updatedAlert.status}.`,
      type: NotificationType.INFO,
      link: `/reception/panic/${updatedAlert.id}`,
      createdAt: new Date().toISOString(),
    });

    return updatedAlert;
  }

  async addPanicResponse(schemaName: string, data: CreatePanicResponseDto) {
    const prisma = this.prisma;
    return prisma.panicResponse.create({ data });
  }

  async getPanicResponses(schemaName: string, alertId: number) {
    const prisma = this.prisma;
    return prisma.panicResponse.findMany({
      where: { alertId },
      include: { responder: true },
      orderBy: { responseTime: 'asc' },
    });
  }
}