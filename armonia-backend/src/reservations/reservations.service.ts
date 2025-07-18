import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ReservationDto,
  ReservationFilterParamsDto,
  CreateCommonAreaDto,
  UpdateCommonAreaDto,
  CommonAreaDto,
  ReservationStatus,
} from '../common/dto/reservations.dto';

@Injectable()
export class ReservationsService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  // Common Area Management
  async createCommonArea(schemaName: string, data: CreateCommonAreaDto): Promise<CommonAreaDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.commonArea.create({ data });
  }

  async getCommonAreas(schemaName: string): Promise<CommonAreaDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.commonArea.findMany();
  }

  async getCommonAreaById(schemaName: string, id: number): Promise<CommonAreaDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const commonArea = await prisma.commonArea.findUnique({ where: { id } });
    if (!commonArea) {
      throw new NotFoundException(`Área común con ID ${id} no encontrada.`);
    }
    return commonArea;
  }

  async updateCommonArea(schemaName: string, id: number, data: UpdateCommonAreaDto): Promise<CommonAreaDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const commonArea = await prisma.commonArea.findUnique({ where: { id } });
    if (!commonArea) {
      throw new NotFoundException(`Área común con ID ${id} no encontrada.`);
    }
    return prisma.commonArea.update({ where: { id }, data });
  }

  async deleteCommonArea(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const commonArea = await prisma.commonArea.findUnique({ where: { id } });
    if (!commonArea) {
      throw new NotFoundException(`Área común con ID ${id} no encontrada.`);
    }
    await prisma.commonArea.delete({ where: { id } });
  }

  // Reservation Management
  async createReservation(schemaName: string, data: CreateReservationDto): Promise<ReservationDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.reservation.create({ data: { ...data, status: ReservationStatus.PENDING } });
  }

  async getReservations(schemaName: string, filters: ReservationFilterParamsDto): Promise<ReservationDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const where: any = {};

    if (filters.commonAreaId) {
      where.commonAreaId = filters.commonAreaId;
    }
    if (filters.userId) {
      where.userId = filters.userId;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.startDate) {
      where.startDateTime = { gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.endDateTime = { lte: new Date(filters.endDate) };
    }

    return prisma.reservation.findMany({
      where,
      include: { commonArea: true, user: true },
      orderBy: { startDateTime: 'desc' },
    });
  }

  async getReservationById(schemaName: string, id: number): Promise<ReservationDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const reservation = await prisma.reservation.findUnique({ where: { id }, include: { commonArea: true, user: true } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    return reservation;
  }

  async updateReservation(schemaName: string, id: number, data: UpdateReservationDto): Promise<ReservationDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    return prisma.reservation.update({ where: { id }, data });
  }

  async updateReservationStatus(schemaName: string, id: number, status: ReservationStatus): Promise<ReservationDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    return prisma.reservation.update({ where: { id }, data: { status } });
  }

  async deleteReservation(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    await prisma.reservation.delete({ where: { id } });
  }
}