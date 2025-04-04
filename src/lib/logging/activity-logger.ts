import { prisma } from '@/lib/prisma';

export interface ActivityLogData {
  userId: number;
  entityType: string;
  entityId: number;
  action: string;
  details?: string;
}

export class ActivityLogger {
  /**
   * Registrar una actividad en el sistema
   * @param data Datos de la actividad
   */
  static async log(data: ActivityLogData) {
    try {
      return await prisma.activityLog.create({
        data: {
          userId: data.userId,
          entityType: data.entityType,
          entityId: data.entityId,
          action: data.action,
          details: data.details || null
        }
      });
    } catch (error) {
      console.error('Error registrando actividad:', error);
    }
  }

  /**
   * Obtener logs de actividad para una entidad específica
   * @param entityType Tipo de entidad
   * @param entityId ID de la entidad
   */
  static async getEntityLogs(entityType: string, entityId: number) {
    return prisma.activityLog.findMany({
      where: { 
        entityType, 
        entityId 
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Obtener logs de actividad recientes
   * @param complexId ID del conjunto residencial
   * @param limit Número máximo de logs a recuperar
   */
  static async getRecentLogs(complexId: number, limit: number = 20) {
    return prisma.activityLog.findMany({
      where: {
        user: {
          complexId: complexId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }
}
