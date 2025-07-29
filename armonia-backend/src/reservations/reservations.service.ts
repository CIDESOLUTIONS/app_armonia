import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateReservationDto,
  UpdateReservationDto,
  ReservationDto,
  ReservationFilterParamsDto,
  ReservationStatus,
} from '../common/dto/reservations.dto.js';
import { CommunicationsService } from '../communications/communications.service.js';
import {
  NotificationType,
  NotificationSourceType,
} from '../common/dto/communications.dto.js';
import { InventoryService } from '../inventory/inventory.service.js'; // Import InventoryService
import { CommonAreaDto } from '../common/dto/inventory.dto.js'; // Import CommonAreaDto

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
    const prisma = this.prisma;
    const commonArea = await this.inventoryService.getCommonAreaById(
      schemaName,
      data.commonAreaId,
    ); // Use InventoryService

    if (!commonArea) {
      throw new NotFoundException(
        `Área común con ID ${data.commonAreaId} no encontrada.`,
      );
    }

    const start = new Date(data.startDateTime);
    const end = new Date(data.endDateTime);
    const now = new Date();

    // 1. Validate against common area's available days
    const dayOfWeek = start
      .toLocaleString('en-us', { weekday: 'long' })
      .toUpperCase();
    if (
      commonArea.availableDays &&
      commonArea.availableDays.length > 0 &&
      !commonArea.availableDays.includes(dayOfWeek)
    ) {
      throw new BadRequestException(
        `El área común no está disponible los ${dayOfWeek}s.`,
      );
    }

    // 2. Validate against common area's opening and closing times
    if (commonArea.openingTime && commonArea.closingTime) {
      const [openHour, openMinute] = commonArea.openingTime
        .split(':')
        .map(Number);
      const [closeHour, closeMinute] = commonArea.closingTime
        .split(':')
        .map(Number);

      const openingTimeToday = new Date(start);
      openingTimeToday.setHours(openHour, openMinute, 0, 0);

      const closingTimeToday = new Date(start);
      closingTimeToday.setHours(closeHour, closeMinute, 0, 0);

      if (start < openingTimeToday || end > closingTimeToday) {
        throw new BadRequestException(
          `La reserva debe estar dentro del horario de ${commonArea.openingTime} a ${commonArea.closingTime}.`,
        );
      }
    }

    // 3. Validate capacity
    if (
      commonArea.capacity &&
      data.attendees &&
      data.attendees > commonArea.capacity
    ) {
      throw new BadRequestException(
        `El número de asistentes excede la capacidad máxima (${commonArea.capacity}).`,
      );
    }

    // 4. Check for overlapping reservations
    const overlappingReservations = await prisma.reservation.findMany({
      where: {
        commonAreaId: data.commonAreaId,
        status: { in: [ReservationStatus.PENDING, ReservationStatus.APPROVED] },
        OR: [
          { startDateTime: { lt: end, gte: start } },
          { endDateTime: { lte: end, gt: start } },
          {
            AND: [
              { startDateTime: { lte: start } },
              { endDateTime: { gte: end } },
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

    // Set initial status based on common area configuration
    const status = commonArea.requiresApproval
      ? ReservationStatus.PENDING
      : ReservationStatus.APPROVED;

    const reservation = await prisma.reservation.create({
      data: { ...data, status },
    });

    // Notify user about reservation status
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      await this.communicationsService.notifyUser(schemaName, user.id, {
        type: NotificationType.INFO,
        title: 'Reserva Creada',
        message: `Tu reserva para ${commonArea.name} ha sido ${status === ReservationStatus.APPROVED ? 'aprobada automáticamente' : 'enviada para aprobación'}.`,
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
    const prisma = this.prisma;
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

  async getReservationById(
    schemaName: string,
    id: number,
  ): Promise<ReservationDto> {
    const prisma = this.prisma;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { commonArea: true, user: true },
    });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    return reservation;
  }

  async updateReservation(
    schemaName: string,
    id: number,
    data: UpdateReservationDto,
  ): Promise<ReservationDto> {
    const prisma = this.prisma;
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    // TODO: Re-validate rules on update if start/end times or commonAreaId change
    return prisma.reservation.update({ where: { id }, data });
  }

  async updateReservationStatus(
    schemaName: string,
    id: number,
    status: ReservationStatus,
  ): Promise<ReservationDto> {
    const prisma = this.prisma;
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    return prisma.reservation.update({ where: { id }, data: { status } });
  }

  async deleteReservation(schemaName: string, id: number): Promise<void> {
    const prisma = this.prisma;
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada.`);
    }
    await prisma.reservation.delete({ where: { id } });
  }

  async approveReservation(
    schemaName: string,
    reservationId: number,
    userId: number,
  ): Promise<ReservationDto> {
    const prisma = this.prisma;
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
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
        approvedById: userId,
        approvedAt: new Date(),
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: updatedReservation.userId },
    });
    if (user) {
      await this.communicationsService.notifyUser(schemaName, user.id, {
        type: NotificationType.INFO,
        title: 'Reserva Aprobada',
        message: `Tu reserva para ${updatedReservation.commonArea.name} ha sido aprobada.`, // Assuming commonArea is included
        link: `/resident/reservations/${updatedReservation.id}`,
        sourceType: NotificationSourceType.RESERVATION,
        sourceId: updatedReservation.id.toString(),
      });
    }

    return updatedReservation;
  }

  async rejectReservation(
    schemaName: string,
    reservationId: number,
    userId: number,
    reason: string,
  ): Promise<ReservationDto> {
    const prisma = this.prisma;
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
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
        rejectionReason: reason,
        approvedById: userId, // Record who rejected it
        approvedAt: new Date(), // Record rejection time
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: updatedReservation.userId },
    });
    if (user) {
      await this.communicationsService.notifyUser(schemaName, user.id, {
        type: NotificationType.ERROR,
        title: 'Reserva Rechazada',
        message: `Tu reserva para ${updatedReservation.commonArea.name} ha sido rechazada. Razón: ${reason}`,
        link: `/resident/reservations/${updatedReservation.id}`,
        sourceType: NotificationSourceType.RESERVATION,
        sourceId: updatedReservation.id.toString(),
      });
    }

    return updatedReservation;
  }
}
