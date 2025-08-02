import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ReservationDto,
  ReservationFilterParamsDto,
  ReservationStatus,
} from '../common/dto/reservations.dto';
import { CommunicationsService } from '../communications/communications.service';
import {
  NotificationType,
  NotificationSourceType,
} from '../common/dto/communications.dto';
import { InventoryService } from '../inventory/inventory.service'; // Import InventoryService
import { CommonAreaDto } from '../common/dto/inventory.dto'; // Import CommonAreaDto

@Injectable()
export class ReservationsService {
  constructor(
    private prisma: PrismaService,
    private communicationsService: CommunicationsService,
    private inventoryService: InventoryService, // Inject InventoryService
  ) {}

  // Reservation Management
  async createReservation(
    schemaName: string,
    data: CreateReservationDto,
  ): Promise<ReservationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const commonArea = await this.inventoryService.getCommonAreaById(
      schemaName,
      data.amenityId,
    ); // Use InventoryService

    if (!commonArea) {
      throw new NotFoundException(
        `Área común con ID ${data.amenityId} no encontrada.`,
      );
    }

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    // 4. Check for overlapping reservations
    const overlappingReservations = await prisma.reservation.findMany({
      where: {
        amenityId: data.amenityId,
        status: { in: [ReservationStatus.PENDING, ReservationStatus.APPROVED] },
        OR: [
          { startTime: { lt: end, gte: start } },
          { endTime: { lte: end, gt: start } },
          {
            AND: [
              { startTime: { lte: start } },
              { endTime: { gte: end } },
            ],
          },
        ],
      },
    });

    if (overlappingReservations.length > 0) {
      throw new BadRequestException(
        'Ya existe una reserva que se solapa con el horario solicitado.',
      );
    }

    const reservation = await prisma.reservation.create({
      data: { ...data, status: ReservationStatus.PENDING },
    });

    // Notify user about reservation status
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      await this.communicationsService.notifyUser(schemaName, user.id, {
        type: NotificationType.INFO,
        title: 'Reserva Creada',
        message: `Tu reserva para ${commonArea.name} ha sido enviada para aprobación.`,
        link: `/resident/reservations/${reservation.id}`,
        sourceType: NotificationSourceType.RESERVATION,
        sourceId: reservation.id.toString(),
      });
    }

    return reservation;
  }

  async getReservations(
    schemaName: string,
    filters: ReservationFilterParamsDto,
  ): Promise<ReservationDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: any = {};

    if (filters.amenityId) {
      where.amenityId = filters.amenityId;
    }
    if (filters.userId) {
      where.userId = filters.userId;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.startDate) {
      where.startTime = { gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.endTime = { lte: new Date(filters.endDate) };
    }

    return prisma.reservation.findMany({
      where,
      include: { amenity: true, user: true },
      orderBy: { startTime: 'desc' },
    });
  }

  async getReservationById(
    schemaName: string,
    id: string,
  ): Promise<ReservationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { amenity: true, user: true },
    });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    return reservation;
  }

  async updateReservation(
    schemaName: string,
    id: string,
    data: UpdateReservationDto,
  ): Promise<ReservationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    // TODO: Re-validate rules on update if start/end times or amenityId change
    return prisma.reservation.update({ where: { id }, data });
  }

  async updateReservationStatus(
    schemaName: string,
    id: string,
    status: ReservationStatus,
  ): Promise<ReservationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    return prisma.reservation.update({ where: { id }, data: { status } });
  }

  async deleteReservation(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    await prisma.reservation.delete({ where: { id } });
  }

  async approveReservation(
    schemaName: string,
    reservationId: string,
    userId: string,
  ): Promise<ReservationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { amenity: true },
    });

    if (!reservation) {
      throw new NotFoundException(
        `Reserva con ID ${reservationId} no encontrada.`,
      );
    }
    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException(
        `La reserva no está en estado PENDIENTE y no puede ser aprobada.`,
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: ReservationStatus.APPROVED,
      },
      include: { amenity: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: updatedReservation.userId },
    });
    if (user) {
      await this.communicationsService.notifyUser(schemaName, user.id, {
        type: NotificationType.INFO,
        title: 'Reserva Aprobada',
        message: `Tu reserva para ${updatedReservation.amenity.name} ha sido aprobada.`,
        link: `/resident/reservations/${updatedReservation.id}`,
        sourceType: NotificationSourceType.RESERVATION,
        sourceId: updatedReservation.id.toString(),
      });
    }

    return updatedReservation;
  }

  async rejectReservation(
    schemaName: string,
    reservationId: string,
    userId: string,
    reason: string,
  ): Promise<ReservationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { amenity: true },
    });

    if (!reservation) {
      throw new NotFoundException(
        `Reserva con ID ${reservationId} no encontrada.`,
      );
    }
    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException(
        `La reserva no está en estado PENDIENTE y no puede ser rechazada.`,
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: ReservationStatus.REJECTED,
      },
      include: { amenity: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: updatedReservation.userId },
    });
    if (user) {
      await this.communicationsService.notifyUser(schemaName, user.id, {
        type: NotificationType.ERROR,
        title: 'Reserva Rechazada',
        message: `Tu reserva para ${updatedReservation.amenity.name} ha sido rechazada. Razón: ${reason}`,
        link: `/resident/reservations/${updatedReservation.id}`,
        sourceType: NotificationSourceType.RESERVATION,
        sourceId: updatedReservation.id.toString(),
      });
    }

    return updatedReservation;
  }
}