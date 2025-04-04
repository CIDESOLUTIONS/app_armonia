import { prisma } from '@/lib/prisma';
import { NotificationService } from '@/lib/notifications/notification-service';
import { ActivityLogger } from '@/lib/logging/activity-logger';
import { AuthorizationService, UserRole } from '@/lib/auth/authorization';
import { PQR, User } from '@prisma/client';

export interface PQRCreateData {
  type: string;
  title: string;
  description: string;
  priority: string;
  userId: number;
  complexId: number;
}

export interface PQRUpdateData {
  status?: string;
  assignedToId?: number;
  response?: string;
}

export class PQRService {
  /**
   * Crear una nueva PQR con validaciones de seguridad
   * @param data Datos de la PQR
   * @param user Usuario que crea la PQR
   */
  static async createPQR(
    data: PQRCreateData, 
    user: Pick<User, 'id' | 'role' | 'complexId'>
  ): Promise<PQR> {
    // Validar permisos de creación
    if (!AuthorizationService.canPerformAction(
      user, 
      'CREATE_PQR', 
      data.complexId
    )) {
      throw new Error('No tiene permisos para crear PQRs');
    }

    // Validar que el usuario pertenezca al conjunto
    if (user.complexId !== data.complexId) {
      throw new Error('No puede crear PQRs en un conjunto diferente');
    }

    // Validaciones de datos
    this.validatePQRData(data);

    // Crear PQR en la base de datos
    const newPQR = await prisma.pqR.create({ 
      data: {
        ...data,
        userId: user.id
      } 
    });

    // Enviar notificación de creación
    await NotificationService.notifyPQRCreation(newPQR);

    // Registrar actividad
    await ActivityLogger.log({
      userId: user.id,
      entityType: 'PQR',
      entityId: newPQR.id,
      action: 'CREATE',
      details: `Nueva PQR creada: ${data.title}`
    });

    return newPQR;
  }

  /**
   * Actualizar PQR con validaciones de seguridad
   * @param pqrId ID de la PQR
   * @param data Datos a actualizar
   * @param user Usuario que actualiza
   */
  static async updatePQR(
    pqrId: number, 
    data: PQRUpdateData, 
    user: Pick<User, 'id' | 'role' | 'complexId'>
  ) {
    // Obtener PQR actual
    const currentPQR = await prisma.pqR.findUnique({
      where: { id: pqrId },
      include: { 
        user: true,
        complex: true 
      }
    });

    if (!currentPQR) {
      throw new Error('PQR no encontrada');
    }

    // Validar permisos de actualización
    if (!AuthorizationService.canPerformAction(
      user, 
      'UPDATE_PQR', 
      currentPQR.complexId
    )) {
      throw new Error('No tiene permisos para actualizar esta PQR');
    }

    // Validaciones adicionales según el rol
    this.validateUpdatePermissions(user, currentPQR);

    // Actualizar PQR
    const updatedPQR = await prisma.pqR.update({
      where: { id: pqrId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    // Si el estado cambió, enviar notificación
    if (data.status && data.status !== currentPQR.status) {
      await NotificationService.notifyPQRStatusChange(
        updatedPQR, 
        currentPQR.status
      );

      // Registrar cambio de estado
      await ActivityLogger.log({
        userId: user.id,
        entityType: 'PQR',
        entityId: pqrId,
        action: 'STATUS_CHANGE',
        details: `Estado cambiado de ${currentPQR.status} a ${data.status}`
      });
    }

    // Registrar actualización general
    await ActivityLogger.log({
      userId: user.id,
      entityType: 'PQR',
      entityId: pqrId,
      action: 'UPDATE',
      details: JSON.stringify(data)
    });

    return updatedPQR;
  }

  /**
   * Obtener PQRs con filtros y control de acceso
   * @param user Usuario que consulta
   * @param filters Filtros de búsqueda
   */
  static async getPQRs(
    user: Pick<User, 'id' | 'role' | 'complexId'>, 
    filters: {
      status?: string;
      type?: string;
      priority?: string;
      search?: string;
    } = {}
  ) {
    // Construir condición de filtro base
    const whereCondition: any = { 
      complexId: user.complexId 
    };

    // Filtros adicionales
    if (filters.status) whereCondition.status = filters.status;
    if (filters.type) whereCondition.type = filters.type;
    if (filters.priority) whereCondition.priority = filters.priority;
    
    // Filtro de búsqueda
    if (filters.search) {
      whereCondition.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    // Filtro adicional para usuarios sin permisos de administración
    if (user.role !== UserRole.COMPLEX_ADMIN && 
        user.role !== UserRole.APP_ADMIN) {
      whereCondition.userId = user.id;
    }

    return prisma.pqR.findMany({
      where: whereCondition,
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
   * Validar datos de creación de PQR
   * @param data Datos de la PQR
   */
  private static validatePQRData(data: PQRCreateData) {
    // Validaciones de campos
    if (!data.title || data.title.length < 5) {
      throw new Error('El título debe tener al menos 5 caracteres');
    }

    if (!data.description || data.description.length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }

    // Validar tipos y prioridades permitidos
    const validTypes = ['PETITION', 'COMPLAINT', 'CLAIM'];
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];

    if (!validTypes.includes(data.type)) {
      throw new Error('Tipo de PQR no válido');
    }

    if (!validPriorities.includes(data.priority)) {
      throw new Error('Prioridad no válida');
    }
  }

  /**
   * Validar permisos de actualización según rol
   * @param user Usuario que actualiza
   * @param pqr PQR a actualizar
   */
  private static validateUpdatePermissions(
    user: Pick<User, 'id' | 'role'>, 
    pqr: PQR & { user: User }
  ) {
    // Administradores pueden actualizar cualquier PQR
    if (user.role === UserRole.COMPLEX_ADMIN || 
        user.role === UserRole.APP_ADMIN) {
      return;
    }

    // El creador solo puede actualizar sus propias PQRs
    if (pqr.userId !== user.id) {
      throw new Error('Solo puede actualizar sus propias PQRs');
    }

    // Prevenir cambios en PQRs cerradas
    if (pqr.status === 'CLOSED') {
      throw new Error('No se pueden modificar PQRs cerradas');
    }
  }

  /**
   * Obtener historial de actividad de una PQR
   * @param pqrId ID de la PQR
   * @param user Usuario que consulta
   */
  static async getPQRActivityHistory(
    pqrId: number, 
    user: Pick<User, 'id' | 'role' | 'complexId'>
  ) {
    // Verificar permisos de acceso
    const pqr = await prisma.pqR.findUnique({
      where: { id: pqrId }
    });

    if (!pqr) {
      throw new Error('PQR no encontrada');
    }

    if (!AuthorizationService.canPerformAction(
      user, 
      'VIEW_PQR', 
      pqr.complexId
    )) {
      throw new Error('No tiene permisos para ver el historial de esta PQR');
    }

    return ActivityLogger.getEntityLogs('PQR', pqrId);
  }
}
