import { Injectable } from '@nestjs/common';
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
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';
import * as admin from 'firebase-admin';

@Injectable()
export class CommunicationsService {
  private twilioClient: any;
  private twilioPhoneNumber: string | undefined;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioPhoneNumber = this.configService.get<string>(
      'TWILIO_PHONE_NUMBER',
    );

    if (accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
    } else {
      console.warn(
        'Twilio credentials not found. SMS functionality will be disabled.',
      );
    }

    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      const firebaseConfig = this.configService.get<string>(
        'FIREBASE_SERVICE_ACCOUNT_KEY',
      );
      if (firebaseConfig) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(firebaseConfig)),
        });
      } else {
        console.warn(
          'Firebase service account key not found. Push notification functionality will be disabled.',
        );
      }
    }
  }

  private async sendSms(to: string, message: string): Promise<void> {
    if (!this.twilioClient || !this.twilioPhoneNumber) {
      console.warn('Twilio is not configured. SMS not sent.');
      return;
    }
    try {
      await this.twilioClient.messages.create({
        body: message,
        from: this.twilioPhoneNumber,
        to: to,
      });
      console.log(`SMS sent to ${to}: ${message}`);
    } catch (error) {
      console.error(`Error sending SMS to ${to}:`, error);
    }
  }

  private async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: { [key: string]: string },
  ): Promise<void> {
    if (!admin.apps.length) {
      console.warn(
        'Firebase Admin SDK is not initialized. Push notification not sent.',
      );
      return;
    }
    try {
      await admin.messaging().send({
        token: token,
        notification: {
          title: title,
          body: body,
        },
        data: data,
      });
      console.log(`Push notification sent to token: ${token}`);
    } catch (error) {
      console.error(
        `Error sending push notification to token ${token}:`,
        error,
      );
    }
  }

  // NOTIFICACIONES (Modelos de tenant)
  async notifyUser(
    schemaName: string,
    userId: string,
    notification: NotificationDataDto,
  ) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error(`Usuario con ID ${userId} no encontrado`);
      }

      // Send SMS if notification type is SMS and user has a phone number
      if (notification.type === NotificationType.SMS && user.phoneNumber) {
        await this.sendSms(user.phoneNumber, notification.message);
      }

      // Send Push Notification if notification type is PUSH and user has a device token
      if (notification.type === NotificationType.PUSH && user.deviceToken) {
        await this.sendPushNotification(
          user.deviceToken,
          notification.title,
          notification.message,
          notification.data,
        );
      }

      // Create database notification
      const dbNotification = await this.prisma.notification.create({
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
    userIds: string[],
    notification: NotificationDataDto,
  ) {
    const results: any[] = [];
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
    const users = await this.prisma.user.findMany({
      where: { role },
      select: { id: true, phoneNumber: true, deviceToken: true }, // Select phoneNumber and deviceToken
    });
    const userIds = users.map((user) => user.id.toString());
    return await this.notifyUsers(schemaName, userIds, notification);
  }

  async getUserNotifications(
    schemaName: string,
    userId: string,
    filters: any = {},
  ) {
    const { read, type, sourceType, priority, limit } = filters;
    return await this.prisma.notification.findMany({
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
    userId: string,
  ) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        recipientId: userId,
      },
    });
    if (!notification) {
      throw new Error('Notificación no encontrada o no pertenece al usuario');
    }
    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async markAllNotificationsAsRead(schemaName: string, userId: string) {
    return await this.prisma.notification.updateMany({
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
    userId: string,
  ) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        recipientId: userId,
        requireConfirmation: true,
      },
    });
    if (!notification) {
      throw new Error(
        'Notificación no encontrada, no pertenece o no requiere confirmación de usurio',
      );
    }
    await this.prisma.notificationConfirmation.create({
      data: {
        notificationId,
        userId,
      },
    });
    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async sendNotification(
    schemaName: string,
    senderId: string,
    notificationData: NotificationDataDto,
  ) {
    const { recipientType, recipientId, ...data } = notificationData;

    let targetUserIds: string[] = [];

    switch (recipientType) {
      case 'ALL': {
        const allUsers = await this.prisma.user.findMany({ select: { id: true } });
        targetUserIds = allUsers.map((user) => user.id);
        break;
      }
      case 'RESIDENT': {
        if (!recipientId)
          throw new Error('Recipient ID is required for RESIDENT type.');
        const resident = await this.prisma.resident.findUnique({
          where: { id: recipientId },
          select: { userId: true },
        });
        if (resident && resident.userId) targetUserIds.push(resident.userId);
        break;
      }
      case 'PROPERTY': {
        if (!recipientId)
          throw new Error('Recipient ID is required for PROPERTY type.');
        const propertyResidents = await this.prisma.resident.findMany({
          where: { propertyId: recipientId },
          select: { userId: true },
        });
        targetUserIds = propertyResidents
          .map((resident) => resident.userId)
          .filter(Boolean) as string[];
        break;
      }
      case 'USER':
        if (!recipientId)
          throw new Error('Recipient ID is required for USER type.');
        targetUserIds.push(recipientId);
        break;
      default:
        throw new Error('Invalid recipient type.');
    }

    if (targetUserIds.length === 0) {
      return { message: 'No recipients found for the given criteria.' };
    }

    const results = await this.notifyUsers(schemaName, targetUserIds, data);
    return { message: 'Notifications sent successfully', results };
  }

  // ANUNCIOS (Modelos de tenant)
  async getAnnouncements(
    schemaName: string,
    userId: string,
    userRole: string,
    filters: any = {},
  ) {
    const { type, read, limit } = filters;
    const queryOptions: any = {
      where: {},
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdBy: { select: { id: true, name: true } },
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
      announcements = await this.prisma.announcement.findMany(queryOptions);
    } else {
      queryOptions.where.OR = [
        { visibility: 'public' },
        { targetRoles: { has: userRole } },
      ];
      announcements = await this.prisma.announcement.findMany(queryOptions);
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
      isRead: announcement.readBy.length > 0,
      requireConfirmation: announcement.requireConfirmation,
    }));
  }

  async createAnnouncement(
    schemaName: string,
    userId: string,
    data: AnnouncementDataDto,
  ) {
    const announcement = await this.prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type || 'general',
        visibility: data.visibility || 'public',
        targetRoles: data.targetRoles || [],
        requireConfirmation: data.requireConfirmation || false, // Corregido
        expiresAt: data.expiresAt,
        createdBy: { connect: { id: userId } },
        residentialComplex: { connect: { id: schemaName } },
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
      await this.prisma.announcementAttachment.createMany({
        data: attachmentRecords,
      });
    }
    const completeAnnouncement = await this.prisma.announcement.findUnique({
      where: { id: announcement.id },
      include: {
        createdBy: { select: { id: true, name: true } },
        attachments: true,
      },
    });
    let targetUserIds: string[] = [];
    if (completeAnnouncement.visibility === 'public') {
      const users = await this.prisma.user.findMany({
        select: { id: true, phoneNumber: true, deviceToken: true },
      });
      targetUserIds = users.map((user) => user.id);
      if (completeAnnouncement.type === 'emergency') {
        for (const user of users) {
          if (user.phoneNumber) {
            await this.sendSms(
              user.phoneNumber,
              `Alerta de emergencia: ${completeAnnouncement.title}. ${completeAnnouncement.content.substring(0, 100)}...`,
            );
          }
        }
      }
      // Send push notifications for emergency announcements
      if (completeAnnouncement.type === 'emergency') {
        for (const user of users) {
          if (user.deviceToken) {
            await this.sendPushNotification(
              user.deviceToken,
              `Alerta de emergencia: ${completeAnnouncement.title}`,
              completeAnnouncement.content,
            );
          }
        }
      }
    } else if (
      completeAnnouncement.visibility === 'role-based' &&
      completeAnnouncement.targetRoles.length > 0
    ) {
      const users = await this.prisma.user.findMany({
        where: { role: { in: completeAnnouncement.targetRoles } },
        select: { id: true, phoneNumber: true, deviceToken: true },
      });
      targetUserIds = users.map((user) => user.id);
      if (completeAnnouncement.type === 'emergency') {
        for (const user of users) {
          if (user.phoneNumber) {
            await this.sendSms(
              user.phoneNumber,
              `Alerta de emergencia: ${completeAnnouncement.title}. ${completeAnnouncement.content.substring(0, 100)}...`,
            );
          }
        }
      }
      // Send push notifications for emergency announcements to targeted roles
      if (completeAnnouncement.type === 'emergency') {
        for (const user of users) {
          if (user.deviceToken) {
            await this.sendPushNotification(
              user.deviceToken,
              `Alerta de emergencia: ${completeAnnouncement.title}`,
              completeAnnouncement.content,
            );
          }
        }
      }
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
        sourceId: completeAnnouncement.id.toString(),
        priority:
          completeAnnouncement.type === 'emergency'
            ? NotificationPriority.URGENT
            : completeAnnouncement.type === 'important'
              ? NotificationPriority.HIGH
              : NotificationPriority.MEDIUM,
      });
    }
    return completeAnnouncement;
  }

  async updateAnnouncement(
    schemaName: string,
    id: string,
    data: AnnouncementDataDto,
  ) {
    try {
      const announcement = await this.prisma.announcement.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          type: data.type,
          visibility: data.visibility,
          targetRoles: data.targetRoles,
          requireConfirmation: data.requireConfirmation,
          expiresAt: data.expiresAt,
        },
      });
      return announcement;
    } catch (error) {
      console.error('Error al actualizar anuncio:', error);
      throw new Error('No se pudo actualizar el anuncio');
    }
  }

  async deleteAnnouncement(schemaName: string, id: string) {
    try {
      await this.prisma.announcement.delete({ where: { id } });
      return { message: 'Anuncio eliminado correctamente' };
    } catch (error) {
      console.error('Error al eliminar anuncio:', error);
      throw new Error('No se pudo eliminar el anuncio');
    }
  }

  async markAnnouncementAsRead(
    schemaName: string,
    announcementId: string,
    userId: string,
  ) {
    const existingRead = await this.prisma.announcementRead.findUnique({
      where: {
        announcementId_userId: { announcementId, userId },
      },
    });
    if (existingRead) {
      return existingRead;
    }
    return await this.prisma.announcementRead.create({
      data: { announcementId, userId },
    });
  }

  // MENSAJES (Modelos de tenant)
  async getOrCreateDirectConversation(
    schemaName: string,
    userId1: string,
    userId2: string,
  ) {
    const existingConversation = await this.prisma.conversation.findFirst({
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
    const newConversation = await this.prisma.conversation.create({
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
    senderId: string,
    recipientId: string,
    data: MessageDataDto,
  ) {
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId: senderId },
    });
    if (!participant) {
      throw new Error('El usuario no pertenece a esta conversación');
    }
    const message: any = await this.prisma.message.create({
      data: { conversation: { connect: { id: conversationId } }, sender: { connect: { id: senderId } }, recipient: { connect: { id: recipientId } }, content: data.content, status: 'sent' },
      include: { sender: { select: { id: true, name: true } } },
    });
    if (data.attachments && data.attachments.length > 0) {
      const attachmentRecords = data.attachments.map((attachment) => ({
        messageId: message.id,
        name: attachment.name,
        url: attachment.url,
        type: attachment.type,
        size: attachment.size,
      }));
      await this.prisma.messageAttachment.createMany({ data: attachmentRecords });
    }
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
    const otherParticipants = await this.prisma.conversationParticipant.findMany({
      where: { conversationId, userId: { not: senderId } },
    });
    for (const participant of otherParticipants) {
      await this.notifyUser(schemaName, participant.userId, {
        type: NotificationType.INFO,
        title: 'Nuevo mensaje',
        message: `${message.sender.name}: ${data.content.substring(0, 50)}${data.content.length > 50 ? '...' : ''}`,
        link: `/messages/${conversationId}`,
        sourceType: NotificationSourceType.MESSAGE,
        sourceId: message.id.toString(),
        priority: NotificationPriority.MEDIUM,
      });
    }
    return message;
  }

  async getConversationMessages(
    schemaName: string,
    conversationId: string,
    userId: string,
    options: any = {},
  ) {
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId },
    });
    if (!participant) {
      throw new Error('El usuario no pertenece a esta conversación');
    }
    const queryOptions: any = {
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true } },
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
    const messages = await this.prisma.message.findMany(queryOptions);
    const messagesToUpdate = messages.filter(
      (m) => m.senderId !== userId && m.status === 'sent',
    );
    if (messagesToUpdate.length > 0) {
      await this.prisma.message.updateMany({
        where: { id: { in: messagesToUpdate.map((m) => m.id) } },
        data: { status: 'delivered' },
      });
    }
    return messages;
  }
  async markMessageAsRead(
    schemaName: string,
    messageId: string,
    userId: string,
  ) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
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
    const existingRead = await this.prisma.messageRead.findUnique({
      where: { messageId_userId: { messageId, userId } },
    });
    if (existingRead) {
      return existingRead;
    }
    const messageRead = await this.prisma.messageRead.create({
      data: { messageId, userId },
    });
    const allParticipants = await this.prisma.conversationParticipant.findMany({
      where: {
        conversationId: message.conversationId,
        userId: { not: message.senderId },
      },
    });
    const allReads = await this.prisma.messageRead.findMany({
      where: { messageId },
    });
    if (allReads.length >= allParticipants.length) {
      await this.prisma.message.update({
        where: { id: messageId },
        data: { status: 'read' },
      });
    }
    return messageRead;
  }

  // EVENTOS COMUNITARIOS (Modelos de tenant)
  async createEvent(
    schemaName: string,
    organizerId: string,
    data: EventDataDto,
  ) {
    const event = await this.prisma.communityEvent.create({
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
        organizer: { connect: { id: organizerId } },
        residentialComplex: { connect: { id: schemaName } },
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
      await this.prisma.eventAttachment.createMany({ data: attachmentRecords });
    }
    const completeEvent = await this.prisma.communityEvent.findUnique({
      where: { id: event.id },
      include: {
        organizer: { select: { id: true, name: true } },
        attachments: true,
      },
    });
    let targetUserIds: string[] = [];
    if (completeEvent.visibility === 'public') {
      const users = await this.prisma.user.findMany({
        select: { id: true, phoneNumber: true, deviceToken: true },
      });
      targetUserIds = users.map((user) => user.id);
      if (completeEvent.type === 'emergency') {
        for (const user of users) {
          if (user.phoneNumber) {
            await this.sendSms(
              user.phoneNumber,
              `Alerta de emergencia: ${completeEvent.title}. ${completeEvent.description.substring(0, 100)}...`,
            );
          }
        }
      }
      if (completeEvent.type === 'emergency') {
        for (const user of users) {
          if (user.deviceToken) {
            await this.sendPushNotification(
              user.deviceToken,
              `Alerta de emergencia: ${completeEvent.title}`,
              completeEvent.description,
            );
          }
        }
      }
    } else if (
      completeEvent.visibility === 'role-based' &&
      completeEvent.targetRoles.length > 0
    ) {
      const users = await this.prisma.user.findMany({
        where: { role: { in: completeEvent.targetRoles } },
        select: { id: true, phoneNumber: true, deviceToken: true },
      });
      targetUserIds = users.map((user) => user.id);
      if (completeEvent.type === 'emergency') {
        for (const user of users) {
          if (user.phoneNumber) {
            await this.sendSms(
              user.phoneNumber,
              `Alerta de emergencia: ${completeEvent.title}. ${completeEvent.description.substring(0, 100)}...`,
            );
          }
        }
      }
      if (completeEvent.type === 'emergency') {
        for (const user of users) {
          if (user.deviceToken) {
            await this.sendPushNotification(
              user.deviceToken,
              `Alerta de emergencia: ${completeEvent.title}`,
              completeEvent.description,
            );
          }
        }
      }
    }
    if (targetUserIds.length > 0) {
      await this.notifyUsers(schemaName, targetUserIds, {
        type:
          completeEvent.type === 'emergency'
            ? NotificationType.ERROR
            : completeEvent.type === 'important'
              ? NotificationType.WARNING
              : NotificationType.INFO,
        title: completeEvent.title,
        message: `Nuevo evento: ${completeEvent.title}`,
        link: `/events/${completeEvent.id}`,
        sourceType: NotificationSourceType.SYSTEM,
        sourceId: completeEvent.id.toString(),
        priority:
          completeEvent.type === 'emergency'
            ? NotificationPriority.URGENT
            : completeEvent.type === 'important'
              ? NotificationPriority.HIGH
              : NotificationPriority.MEDIUM,
      });
    }
    return completeEvent;
  }

  async updateEvent(schemaName: string, id: string, data: EventDataDto) {
    try {
      const event = await this.prisma.communityEvent.update({
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

  async deleteEvent(schemaName: string, id: string) {
    try {
      await this.prisma.communityEvent.delete({ where: { id } });
      return { message: 'Evento eliminado correctamente' };
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw new Error('No se pudo eliminar el evento');
    }
  }

  async getEvents(
    schemaName: string,
    userId: string,
    userRole: string,
    filters: any = {},
  ) {
    const { type, upcoming, limit, startDate, endDate } = filters;
    const queryOptions: any = {
      where: {},
      orderBy: {
        startDateTime: upcoming ? 'asc' : 'desc',
      },
      include: {
        organizer: { select: { id: true, name: true } },
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
      events = await this.prisma.communityEvent.findMany(queryOptions);
    } else {
      queryOptions.where.OR = [
        { visibility: 'public' },
        { targetRoles: { has: userRole } },
      ];
      events = await this.prisma.communityEvent.findMany(queryOptions);
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
    userId: string,
    status: 'confirmed' | 'tentative' | 'declined',
  ) {
    const event = await this.prisma.communityEvent.findUnique({
      where: { id: eventId },
      include: { attendees: { where: { userId } } },
    });
    if (!event) {
      throw new Error('Evento no encontrado');
    }
    if (status === 'confirmed' && event.maxAttendees) {
      const confirmedCount = await this.prisma.eventAttendee.count({
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
      return await this.prisma.eventAttendee.update({
        where: { eventId_userId: { eventId: event.attendees[0].eventId, userId: event.attendees[0].userId } },
        data: { status },
      });
    } else {
      return await this.prisma.eventAttendee.create({
        data: { eventId, userId, status },
      });
    }
  }

  // UTILIDADES (Modelos globales y de tenant)
  async cleanupExpiredItems(schemaName: string) {
    const now = new Date();
    const deletedNotifications = await this.prisma.notification.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    return {
      deletedNotifications: deletedNotifications.count,
    };
  }

  async migrateReservationNotifications(schemaName: string) {
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
        await this.prisma.notification.create({
          data: {
            recipient: { connect: { id: oldNotification.userId } },
            type,
            title: 'Notificación de reserva',
            message: oldNotification.message,
            sourceType: NotificationSourceType.RESERVATION,
            sourceId: oldNotification.reservationId?.toString(),
            priority: NotificationPriority.MEDIUM,
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
