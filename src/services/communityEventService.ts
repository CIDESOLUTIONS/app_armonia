import { getPrisma } from '@/lib/prisma';
import { ServerLogger } from '@/lib/logging/server-logger';
import { PrismaClient } from '@prisma/client';

interface CommunityEventData {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location: string;
  type: string;
  visibility: string;
  targetRoles: string[];
  maxAttendees?: number;
  createdById: number;
  complexId: number;
}

export class CommunityEventService {
  private prisma: PrismaClient;
  private schemaName: string;

  constructor(schemaName: string) {
    this.schemaName = schemaName;
    this.prisma = getPrisma(schemaName);
  }

  async getEvents(complexId: number, filters: any, userRole: string): Promise<any[]> {
    try {
      const where: any = { complexId };

      if (filters.startDate && filters.endDate) {
        where.OR = [
          {
            startDate: {
              gte: new Date(filters.startDate),
              lte: new Date(filters.endDate),
            },
          },
          {
            endDate: {
              gte: new Date(filters.startDate),
              lte: new Date(filters.endDate),
            },
          },
          {
            AND: [
              { startDate: { lte: new Date(filters.startDate) } },
              { endDate: { gte: new Date(filters.endDate) } },
            ],
          },
        ];
      }

      if (filters.type) {
        where.type = filters.type;
      }

      // Filtrar por roles si no es admin
      if (userRole !== 'ADMIN' && userRole !== 'COMPLEX_ADMIN') {
        where.OR = [
          ...(where.OR || []),
          { visibility: 'public' },
          { targetRoles: { has: userRole } },
        ];
      }

      const events = await this.prisma.communityEvent.findMany({
        where,
        orderBy: { startDate: 'asc' },
        include: {
          createdBy: { select: { id: true, name: true } },
          attendees: { select: { userId: true, name: true, status: true } },
        },
      });

      return events;
    } catch (error) {
      ServerLogger.error(`[CommunityEventService] Error al obtener eventos para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async getEventById(id: number, complexId: number): Promise<any | null> {
    try {
      const event = await this.prisma.communityEvent.findUnique({
        where: { id, complexId },
        include: {
          createdBy: { select: { id: true, name: true } },
          attendees: { select: { userId: true, name: true, status: true } },
        },
      });
      return event;
    } catch (error) {
      ServerLogger.error(`[CommunityEventService] Error al obtener evento ${id} para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async createEvent(data: CommunityEventData): Promise<any> {
    try {
      const newEvent = await this.prisma.communityEvent.create({
        data: {
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location,
          type: data.type,
          visibility: data.visibility,
          targetRoles: data.targetRoles,
          maxAttendees: data.maxAttendees,
          createdById: data.createdById,
          complexId: data.complexId,
        },
      });
      ServerLogger.info(`[CommunityEventService] Evento ${newEvent.id} creado para ${this.schemaName}`);
      return newEvent;
    } catch (error) {
      ServerLogger.error(`[CommunityEventService] Error al crear evento para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async updateEvent(id: number, complexId: number, data: Partial<CommunityEventData>): Promise<any> {
    try {
      const updatedEvent = await this.prisma.communityEvent.update({
        where: { id, complexId },
        data: {
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location,
          type: data.type,
          visibility: data.visibility,
          targetRoles: data.targetRoles,
          maxAttendees: data.maxAttendees,
          updatedAt: new Date(),
        },
      });
      ServerLogger.info(`[CommunityEventService] Evento ${id} actualizado para ${this.schemaName}`);
      return updatedEvent;
    } catch (error) {
      ServerLogger.error(`[CommunityEventService] Error al actualizar evento ${id} para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async deleteEvent(id: number, complexId: number): Promise<void> {
    try {
      await this.prisma.communityEvent.delete({
        where: { id, complexId },
      });
      ServerLogger.info(`[CommunityEventService] Evento ${id} eliminado para ${this.schemaName}`);
    } catch (error) {
      ServerLogger.error(`[CommunityEventService] Error al eliminar evento ${id} para ${this.schemaName}:`, error);
      throw error;
    }
  }
}