import { getPrisma } from "@/lib/prisma";
import { ServerLogger } from "@/lib/logging/server-logger";
import { PrismaClient } from "@prisma/client";

interface NotificationData {
  title: string;
  message: string;
  userId: number;
  type: string;
  sentBy?: number;
}

export class NotificationService {
  private prisma: PrismaClient;
  private schemaName: string;

  constructor(schemaName: string) {
    this.schemaName = schemaName;
    this.prisma = getPrisma(schemaName);
  }

  async getNotifications(
    userId: number,
    complexId: number,
    filters: any,
  ): Promise<any[]> {
    try {
      const where: any = { userId, complexId };
      if (filters.type) where.type = filters.type;
      if (filters.read !== undefined) where.read = filters.read;

      const notifications = await this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      return notifications;
    } catch (error) {
      ServerLogger.error(
        `[NotificationService] Error al obtener notificaciones para ${this.schemaName}:`,
        error,
      );
      throw error;
    }
  }

  async createNotification(data: NotificationData): Promise<any> {
    try {
      const newNotification = await this.prisma.notification.create({
        data: {
          title: data.title,
          message: data.message,
          userId: data.userId,
          type: data.type,
          sentBy: data.sentBy,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      ServerLogger.info(
        `[NotificationService] Notificación ${newNotification.id} creada para ${this.schemaName}`,
      );
      return newNotification;
    } catch (error) {
      ServerLogger.error(
        `[NotificationService] Error al crear notificación para ${this.schemaName}:`,
        error,
      );
      throw error;
    }
  }

  async sendNotificationToRecipients(
    complexId: number,
    schemaName: string,
    title: string,
    message: string,
    recipientType: string,
    recipientId?: string,
    sentBy?: number,
  ): Promise<void> {
    const prisma = getPrisma(schemaName);
    let usersToNotify: any[] = [];

    switch (recipientType) {
      case "ALL":
        usersToNotify = await prisma.user.findMany({ where: { complexId } });
        break;
      case "RESIDENT": {
        const resident = await prisma.resident.findUnique({
          where: { id: parseInt(recipientId as string) },
          include: { user: true },
        });
        if (resident?.user) usersToNotify.push(resident.user);
        break;
      }
      case "PROPERTY": {
        const propertyUsers = await prisma.user.findMany({
          where: { propertyId: parseInt(recipientId as string) },
        });
        usersToNotify = propertyUsers;
        break;
      }
      case "USER": {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(recipientId as string) },
        });
        if (user) usersToNotify.push(user);
        break;
      }
      default:
        break;
    }

    if (usersToNotify.length === 0) {
      ServerLogger.warn(
        `[NotificationService] No se encontraron destinatarios para la notificación en ${schemaName}`,
      );
      return;
    }

    const notificationPromises = usersToNotify.map((user) =>
      this.createNotification({
        title,
        message,
        userId: user.id,
        type: "GENERAL",
        sentBy,
      }),
    );

    await Promise.all(notificationPromises);
    ServerLogger.info(
      `[NotificationService] Notificación enviada a ${usersToNotify.length} usuarios en ${schemaName}`,
    );
  }

  async markAsRead(id: number): Promise<any> {
    try {
      const updatedNotification = await this.prisma.notification.update({
        where: { id },
        data: { read: true, updatedAt: new Date() },
      });
      ServerLogger.info(
        `[NotificationService] Notificación ${id} marcada como leída para ${this.schemaName}`,
      );
      return updatedNotification;
    } catch (error) {
      ServerLogger.error(
        `[NotificationService] Error al marcar notificación ${id} como leída para ${this.schemaName}:`,
        error,
      );
      throw error;
    }
  }

  async deleteNotification(id: number): Promise<void> {
    try {
      await this.prisma.notification.delete({ where: { id } });
      ServerLogger.info(
        `[NotificationService] Notificación ${id} eliminada para ${this.schemaName}`,
      );
    } catch (error) {
      ServerLogger.error(
        `[NotificationService] Error al eliminar notificación ${id} para ${this.schemaName}:`,
        error,
      );
      throw error;
    }
  }
}
