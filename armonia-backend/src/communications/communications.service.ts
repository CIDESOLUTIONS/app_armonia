import { Injectable } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotificationType,
  NotificationDataDto,
  AnnouncementDataDto,
  MessageDataDto,
  EventDataDto,
  NotificationPriority,
  NotificationSourceType,
} from '../common/dto/communications.dto';

@Injectable()
export class CommunicationsService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService, // Inyectar PrismaService global
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  // NOTIFICACIONES (Modelos de tenant)
  async notifyUser(
    schemaName: string,
    userId: number,
    notification: NotificationDataDto,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      // Usar this.prisma para acceder al modelo User global
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error(`Usuario con ID ${userId} no encontrado`);
      }
      // Usar prisma (tenant-specific) para acceder al modelo Notification
      const dbNotification = await prisma.notification.create({
        data: {
          recipientId: userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          link: notification.link,
          data: notification.data,
          sourceType: notification.sourceType,
          sourceId: notification.sourceId,
          priority: notification.priority || NotificationPriority.MEDIUM,
          requireConfirmation: notification.requireConfirmation || false,
          expiresAt: notification.expiresAt,
        },
      });
      return dbNotification;
    } catch (error) {
      console.error('Error al enviar notificación al usuario:', error);
      throw new Error('No se pudo enviar la notificación');
    }
  }

  async notifyUsers(
    schemaName: string,
    userIds: number[],
    notification: NotificationDataDto,
  ) {
    const results = [];
    for (const userId of userIds) {
      try {
        const result = await this.notifyUser(schemaName, userId, notification);
        results.push(result);
      } catch (error) {
        console.error(
          `Error al enviar notificación al usuario ${userId}:`,
          error,
        );
      }
    }
    return results;
  }

  async notifyByRole(
    schemaName: string,
    role: string,
    notification: NotificationDataDto,
  ) {
    // Usar this.prisma para acceder al modelo User global
    const users = await this.prisma.user.findMany({
      where: { role },
      select: { id: true },
    });
    const userIds = users.map((user) => user.id);
    return await this.notifyUsers(schemaName, userIds, notification);
  }

  async getUserNotifications(
    schemaName: string,
    userId: number,
    filters: any = {},
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Usar prisma (tenant-specific) para acceder al modelo Notification
    const { read, type, sourceType, priority, limit } = filters;
    return await prisma.notification.findMany({
      where: {
        recipientId: userId,
        ...(read !== undefined && { read }),
        ...(type !== undefined && { type }),
        ...(sourceType !== undefined && { sourceType }),
        ...(priority !== undefined && { priority }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...(limit !== undefined && { take: limit }),
    });
  }

  async markNotificationAsRead(
    schemaName: string,
    notificationId: string,
    userId: number,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Usar prisma (tenant-specific) para acceder al modelo Notification
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        recipientId: userId,
      },
    });
    if (!notification) {
      throw new Error('Notificación no encontrada o no pertenece al usuario');
    }
    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async markAllNotificationsAsRead(schemaName: string, userId: number) {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Usar prisma (tenant-specific) para acceder al modelo Notification
    return await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async confirmNotificationReading(
    schemaName: string,
    notificationId: string,
    userId: number,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Usar prisma (tenant-specific) para acceder al modelo Notification
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        recipientId: userId,
        requireConfirmation: true,
      },
    });
    if (!notification) {
      throw new Error(
        'Notificación no encontrada, no pertenece al usuario o no requiere confirmación',
      );
    }
    // Asumiendo que NotificationConfirmation es un modelo de tenant
    await prisma.notificationConfirmation.create({
      data: {
        notificationId,
        userId,
      },
    });
    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  // ANUNCIOS (Modelos de tenant)
  async getAnnouncements(
    schemaName: string,
    userId: number,
    userRole: string,
    filters: any = {},
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    const { type, read, limit } = filters;
    const queryOptions: any = {
      where: {},
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdBy: { select: { id: true, name: true, image: true } },
        readBy: {
          where: {
            userId,
          },
          select: { userId: true, readAt: true },
        },
        attachments: true,
      },
    };
    if (type) {
      queryOptions.where.type = type;
    }
    if (read === true) {
      queryOptions.where.readBy = { some: { userId } };
    } else if (read === false) {
      queryOptions.where.readBy = { none: { userId } };
    }
    if (limit && !isNaN(Number(limit))) {
      queryOptions.take = Number(limit);
    }
    let announcements;
    if (userRole === 'ADMIN' || userRole === 'COMPLEX_ADMIN') {
      announcements = await prisma.announcement.findMany(queryOptions);
    } else {
      queryOptions.where.OR = [
        { visibility: 'public' },
        { targetRoles: { has: userRole } },
      ];
      announcements = await prisma.announcement.findMany(queryOptions);
    }
    return announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      createdAt: announcement.createdAt,
      expiresAt: announcement.expiresAt,
      createdBy: announcement.createdBy,
      attachments: announcement.attachments.map((attachment) => ({
        id: attachment.id,
        name: attachment.name,
        url: attachment.url,
        type: attachment.type,
        size: attachment.size,
      })),
      readBy: announcement.readBy,
      requireConfirmation: announcement.requireConfirmation, // Corregido
      isRead: announcement.readBy.length > 0,
    }));
  }

  async createAnnouncement(
    schemaName: string,
    userId: number,
    data: AnnouncementDataDto,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type || 'general',
        visibility: data.visibility || 'public',
        targetRoles: data.targetRoles || [],
        requireConfirmation: data.requireConfirmation || false, // Corregido
        expiresAt: data.expiresAt,
        createdById: userId,
      },
    });
    if (data.attachments && data.attachments.length > 0) {
      const attachmentRecords = data.attachments.map((attachment) => ({
        announcementId: announcement.id,
        name: attachment.name,
        url: attachment.url,
        type: attachment.type,
        size: attachment.size,
      }));
      await prisma.announcementAttachment.createMany({
        data: attachmentRecords,
      });
    }
    const completeAnnouncement = await prisma.announcement.findUnique({
      where: { id: announcement.id },
      include: {
        createdBy: { select: { id: true, name: true, image: true } },
        attachments: true,
      },
    });
    let targetUserIds: number[] = [];
    if (completeAnnouncement.visibility === 'public') {
      // Usar this.prisma para acceder al modelo User global
      const users = await this.prisma.user.findMany({ select: { id: true } });
      targetUserIds = users.map((user) => user.id);
    } else if (
      completeAnnouncement.visibility === 'role-based' &&
      completeAnnouncement.targetRoles.length > 0
    ) {
      // Usar this.prisma para acceder al modelo User global
      const users = await this.prisma.user.findMany({
        where: { role: { in: completeAnnouncement.targetRoles } },
        select: { id: true },
      });
      targetUserIds = users.map((user) => user.id);
    }
    if (targetUserIds.length > 0) {
      await this.notifyUsers(schemaName, targetUserIds, {
        type:
          completeAnnouncement.type === 'emergency'
            ? NotificationType.ERROR
            : completeAnnouncement.type === 'important'
              ? NotificationType.WARNING
              : NotificationType.INFO,
        title: completeAnnouncement.title,
        message: `Nuevo anuncio: ${completeAnnouncement.title}`,
        link: `/announcements/${completeAnnouncement.id}`,
        sourceType: NotificationSourceType.SYSTEM,
        sourceId: completeAnnouncement.id,
        priority:
          completeAnnouncement.type === 'emergency'
            ? NotificationPriority.URGENT
            : completeAnnouncement.type === 'important'
              ? NotificationPriority.HIGH
              : NotificationPriority.MEDIUM,
        requireConfirmation: completeAnnouncement.requireConfirmation, // Corregido
        expiresAt: completeAnnouncement.expiresAt,
      });
    }
    return completeAnnouncement;
  }

  async updateAnnouncement(
    schemaName: string,
    id: number,
    data: AnnouncementDataDto,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const announcement = await prisma.announcement.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          type: data.type,
          visibility: data.visibility,
          targetRoles: data.targetRoles,
          requireConfirmation: data.requireConfirmation, // Corregido
          expiresAt: data.expiresAt,
        },
      });
      return announcement;
    } catch (error) {
      console.error('Error al actualizar anuncio:', error);
      throw new Error('No se pudo actualizar el anuncio');
    }
  }

  async deleteAnnouncement(schemaName: string, id: number) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      await prisma.announcement.delete({ where: { id } });
      return { message: 'Anuncio eliminado correctamente' };
    } catch (error) {
      console.error('Error al eliminar anuncio:', error);
      throw new Error('No se pudo eliminar el anuncio');
    }
  }

  async markAnnouncementAsRead(
    schemaName: string,
    announcementId: string,
    userId: number,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Usar prisma (tenant-specific) para acceder al modelo AnnouncementRead
    const existingRead = await prisma.announcementRead.findUnique({
      where: {
        announcementId_userId: { announcementId, userId },
      },
    });
    if (existingRead) {
      return existingRead;
    }
    return await prisma.announcementRead.create({
      data: { announcementId, userId },
    });
  }

  // MENSAJES (Modelos de tenant)
  async getOrCreateDirectConversation(
    schemaName: string,
    userId1: number,
    userId2: number,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Usar prisma (tenant-specific) para acceder a los modelos Conversation y ConversationParticipant
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        type: 'direct',
        participants: {
          every: { userId: { in: [userId1, userId2] } },
        },
        AND: [
          { participants: { some: { userId: userId1 } } },
          { participants: { some: { userId: userId2 } } },
        ],
      },
      include: { participants: true },
    });
    if (existingConversation) {
      return existingConversation;
    }
    const newConversation = await prisma.conversation.create({
      data: {
        type: 'direct',
        participants: {
          create: [
            { userId: userId1, role: 'member' },
            { userId: userId2, role: 'member' },
          ],
        },
      },
      include: { participants: true },
    });
    return newConversation;
  }

  async sendMessage(
    schemaName: string,
    conversationId: string,
    senderId: number,
    data: MessageDataDto,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Usar prisma (tenant-specific) para acceder a los modelos ConversationParticipant y Message
    const participant = await prisma.conversationParticipant.findFirst({
      where: { conversationId, userId: senderId },
    });
    if (!participant) {
      throw new Error('El usuario no pertenece a esta conversación');
    }
    const message = await prisma.message.create({
      data: { conversationId, senderId, content: data.content, status: 'sent' },
      include: { sender: { select: { id: true, name: true, image: true } } },
    });
    if (data.attachments && data.attachments.length > 0) {
      const attachmentRecords = data.attachments.map((attachment) => ({
        messageId: message.id,
        name: attachment.name,
        url: attachment.url,
        type: attachment.type,
        size: attachment.size,
      }));
      await prisma.messageAttachment.createMany({ data: attachmentRecords });
    }
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: { conversationId, userId: { not: senderId } },
    });
    for (const participant of otherParticipants) {
      await this.notifyUser(schemaName, participant.userId, {
        type: NotificationType.INFO,
        title: 'Nuevo mensaje',
        message: `${message.sender.name}: ${data.content.substring(0, 50)}${data.content.length > 50 ? '...' : ''}`,
        link: `/messages/${conversationId}`,
        sourceType: NotificationSourceType.MESSAGE,
        sourceId: message.id.toString(), // Convertir a string
        priority: NotificationPriority.MEDIUM,
      });
    }
    return message;
  }

  async getConversationMessages(
    schemaName: string,
    conversationId: string,
    userId: number,
    options: any = {},
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Usar prisma (tenant-specific) para acceder a los modelos ConversationParticipant y Message
    const participant = await prisma.conversationParticipant.findFirst({
      where: { conversationId, userId },
    });
    if (!participant) {
      throw new Error('El usuario no pertenece a esta conversación');
    }
    const queryOptions: any = {
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        attachments: true,
        readBy: { where: { userId } },
      },
    };
    if (options.before) {
      queryOptions.where.createdAt = { lt: options.before };
    }
    if (options.limit) {
      queryOptions.take = options.limit;
    }
    const messages = await prisma.message.findMany(queryOptions);
    const messagesToUpdate = messages.filter(
      (m) => m.senderId !== userId && m.status === 'sent',
    );
    if (messagesToUpdate.length > 0) {
      await prisma.message.updateMany({
        where: { id: { in: messagesToUpdate.map((m) => m.id) } },
        data: { status: 'delivered' },
      });
    }
    return messages;
  }

  async markMessageAsRead(
    schemaName: string,
    messageId: string,
    userId: number,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Usar prisma (tenant-specific) para acceder a los modelos Message y MessageRead
    const message = await prisma.message.findUnique({
      where: { id: +messageId }, // Convertir a number
      include: {
        conversation: { include: { participants: { where: { userId } } } },
      },
    });
    if (!message) {
      throw new Error('Mensaje no encontrado');
    }
    if (message.conversation.participants.length === 0) {
      throw new Error('El usuario no pertenece a esta conversación');
    }
    const existingRead = await prisma.messageRead.findUnique({
      where: { messageId_userId: { messageId, userId } },
    });
    if (existingRead) {
      return existingRead;
    }
    const messageRead = await prisma.messageRead.create({
      data: { messageId, userId },
    });
    const allParticipants = await prisma.conversationParticipant.findMany({
      where: {
        conversationId: message.conversationId,
        userId: { not: message.senderId },
      },
    });
    const allReads = await prisma.messageRead.findMany({
      where: { messageId },
    });
    if (allReads.length >= allParticipants.length) {
      await prisma.message.update({
        where: { id: +messageId }, // Convertir a number
        data: { status: 'read' },
      });
    }
    return messageRead;
  }

  // EVENTOS COMUNITARIOS (Modelos de tenant)
  async createEvent(
    schemaName: string,
    organizerId: number,
    data: EventDataDto,
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    const event = await prisma.communityEvent.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        type: data.type || 'general',
        visibility: data.visibility || 'public',
        targetRoles: data.targetRoles || [],
        maxAttendees: data.maxAttendees,
        organizerId,
      },
    });
    if (data.attachments && data.attachments.length > 0) {
      const attachmentRecords = data.attachments.map((attachment) => ({
        eventId: event.id,
        name: attachment.name,
        url: attachment.url,
        type: attachment.type,
        size: attachment.size,
      }));
      await prisma.eventAttachment.createMany({ data: attachmentRecords });
    }
    const completeEvent = await prisma.communityEvent.findUnique({
      where: { id: event.id },
      include: {
        organizer: { select: { id: true, name: true, image: true } },
        attachments: true,
      },
    });
    let targetUserIds: number[] = [];
    if (completeEvent.visibility === 'public') {
      // Usar this.prisma para acceder al modelo User global
      const users = await this.prisma.user.findMany({ select: { id: true } });
      targetUserIds = users.map((user) => user.id);
    } else if (
      completeEvent.visibility === 'role-based' &&
      completeEvent.targetRoles.length > 0
    ) {
      // Usar this.prisma para acceder al modelo User global
      const users = await this.prisma.user.findMany({
        where: { role: { in: completeEvent.targetRoles } },
        select: { id: true },
      });
      targetUserIds = users.map((user) => user.id);
    }
    if (targetUserIds.length > 0) {
      await this.notifyUsers(schemaName, targetUserIds, {
        type: NotificationType.INFO,
        title: 'Nuevo evento',
        message: `${completeEvent.title} - ${new Date(completeEvent.startDateTime).toLocaleDateString()}`,
        link: `/events/${completeEvent.id}`,
        sourceType: NotificationSourceType.SYSTEM,
        sourceId: completeEvent.id.toString(), // Convertir a string
        priority: NotificationPriority.MEDIUM,
      });
    }
    return completeEvent;
  }

  async updateEvent(schemaName: string, id: number, data: EventDataDto) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const event = await prisma.communityEvent.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          location: data.location,
          startDateTime: data.startDateTime,
          endDateTime: data.endDateTime,
          type: data.type,
          visibility: data.visibility,
          targetRoles: data.targetRoles,
          maxAttendees: data.maxAttendees,
        },
      });
      return event;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      throw new Error('No se pudo actualizar el evento');
    }
  }

  async deleteEvent(schemaName: string, id: number) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      await prisma.communityEvent.delete({ where: { id } });
      return { message: 'Evento eliminado correctamente' };
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw new Error('No se pudo eliminar el evento');
    }
  }

  async getEvents(
    schemaName: string,
    userId: number,
    userRole: string,
    filters: any = {},
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    const { type, upcoming, limit, startDate, endDate } = filters;
    const queryOptions: any = {
      where: {},
      orderBy: {
        startDateTime: upcoming ? 'asc' : 'desc',
      },
      include: {
        organizer: { select: { id: true, name: true, image: true } },
        attendees: { where: { userId } },
        attachments: true,
      },
    };
    if (type) {
      queryOptions.where.type = type;
    }
    if (upcoming) {
      queryOptions.where.startDateTime = { gte: new Date() };
    }
    if (startDate) {
      queryOptions.where.startDateTime = {
        ...queryOptions.where.startDateTime,
        gte: startDate,
      };
    }
    if (endDate) {
      queryOptions.where.endDateTime = { lte: endDate };
    }
    let events;
    if (userRole === 'ADMIN' || userRole === 'COMPLEX_ADMIN') {
      events = await prisma.communityEvent.findMany(queryOptions);
    } else {
      queryOptions.where.OR = [
        { visibility: 'public' },
        { targetRoles: { has: userRole } },
      ];
      events = await prisma.communityEvent.findMany(queryOptions);
    }
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      type: event.type,
      visibility: event.visibility,
      maxAttendees: event.maxAttendees,
      organizer: event.organizer,
      attachments: event.attachments.map((attachment) => ({
        id: attachment.id,
        name: attachment.name,
        url: attachment.url,
        type: attachment.type,
        size: attachment.size,
      })),
      userAttendance: event.attendees.length > 0 ? event.attendees[0] : null,
    }));
  }

  async registerEventAttendance(
    schemaName: string,
    eventId: string,
    userId: number,
    status: 'confirmed' | 'tentative' | 'declined',
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    const event = await prisma.communityEvent.findUnique({
      where: { id: eventId },
      include: { attendees: { where: { userId } } },
    });
    if (!event) {
      throw new Error('Evento no encontrado');
    }
    if (status === 'confirmed' && event.maxAttendees) {
      const confirmedCount = await prisma.eventAttendee.count({
        where: { eventId, status: 'confirmed' },
      });
      if (
        confirmedCount >= event.maxAttendees &&
        event.attendees.length === 0
      ) {
        throw new Error('El evento ha alcanzado su capacidad máxima');
      }
    }
    if (event.attendees.length > 0) {
      return await prisma.eventAttendee.update({
        where: { id: event.attendees[0].id },
        data: { status },
      });
    } else {
      return await prisma.eventAttendee.create({
        data: { eventId, userId, status },
      });
    }
  }

  // UTILIDADES (Modelos globales y de tenant)
  async cleanupExpiredItems(schemaName: string) {
    const prismaTenant = this.getTenantPrismaClient(schemaName);
    const now = new Date();
    // Usar prisma (tenant-specific) para acceder al modelo Notification
    const deletedNotifications = await prismaTenant.notification.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    const updatedAnnouncements = await prismaTenant.announcement.updateMany({
      where: { expiresAt: { lt: now } },
      data: { data: { expired: true } },
    });
    return {
      deletedNotifications: deletedNotifications.count,
      updatedAnnouncements: updatedAnnouncements.count,
    };
  }

  async migrateReservationNotifications(schemaName: string) {
    // Usar this.prisma para acceder al modelo ReservationNotification global
    const reservationNotifications =
      await this.prisma.reservationNotification.findMany({
        where: { migrated: false },
        include: { reservation: true },
      });
    let migratedCount = 0;
    for (const oldNotification of reservationNotifications) {
      try {
        let type: NotificationType = NotificationType.INFO;
        if (oldNotification.type === 'rejection') type = NotificationType.ERROR;
        if (oldNotification.type === 'cancellation')
          type = NotificationType.WARNING;
        const prisma = this.getTenantPrismaClient(schemaName);
        // Usar prisma (tenant-specific) para acceder al modelo Notification
        await prisma.notification.create({
          data: {
            recipientId: oldNotification.userId,
            type,
            title: 'Notificación de reserva',
            message: oldNotification.message,
            sourceType: NotificationSourceType.RESERVATION,
            sourceId: oldNotification.reservationId?.toString(),
            read: oldNotification.isRead || false,
            readAt: oldNotification.readAt,
            data: {
              reservationId: oldNotification.reservationId,
              notificationType: oldNotification.type,
            },
          },
        });
        await this.prisma.reservationNotification.update({
          where: { id: oldNotification.id },
          data: { migrated: true },
        });
        migratedCount++;
      } catch (error) {
        console.error(
          `Error al migrar notificación ${oldNotification.id}:`,
          error,
        );
      }
    }
    return { migratedCount };
  }
}
