import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateAlertDto,
  UpdateAlertDto,
  AlertQueryDto,
  BulkAlertActionDto,
  AlertStatsDto,
  AlertResponseDto,
  AlertListResponseDto,
  AlertType,
  AlertSeverity,
  AlertStatus
} from '../dto';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Crear una nueva alerta
   */
  async createAlert(
    createAlertDto: CreateAlertDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<AlertResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Verificar que el dispositivo existe
      const device = await prisma.ioTDevice.findFirst({
        where: {
          id: createAlertDto.deviceId,
          residentialComplexId,
        },
      });

      if (!device) {
        throw new NotFoundException('Dispositivo no encontrado');
      }

      // Verificar si ya existe una alerta activa del mismo tipo para el dispositivo
      const existingAlert = await prisma.ioTAlert.findFirst({
        where: {
          deviceId: createAlertDto.deviceId,
          type: createAlertDto.type,
          status: AlertStatus.ACTIVE,
        },
      });

      if (existingAlert) {
        this.logger.warn(`Alerta duplicada evitada: ${createAlertDto.type} para dispositivo ${createAlertDto.deviceId}`);
        return this.mapAlertToResponse(existingAlert);
      }

      // Crear la alerta
      const alert = await prisma.ioTAlert.create({
        data: {
          deviceId: createAlertDto.deviceId,
          type: createAlertDto.type,
          severity: createAlertDto.severity,
          status: AlertStatus.ACTIVE,
          title: createAlertDto.title,
          message: createAlertDto.message,
          data: createAlertDto.data,
          resolution: createAlertDto.resolution,
          residentialComplexId,
        },
        include: {
          device: {
            select: {
              id: true,
              name: true,
              type: true,
              location: true,
            },
          },
        },
      });

      this.logger.log(`Alerta creada: ${alert.id} - ${alert.type} (${alert.severity})`);

      return this.mapAlertToResponse(alert);
    } catch (error) {
      this.logger.error(`Error creando alerta: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener alertas con filtros
   */
  async getAlerts(
    queryDto: AlertQueryDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<AlertListResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const page = parseInt(queryDto.page) || 1;
      const limit = Math.min(parseInt(queryDto.limit) || 50, 100);
      const skip = (page - 1) * limit;

      // Construir condiciones de filtrado
      const whereConditions: any = {
        residentialComplexId,
      };

      if (queryDto.deviceId) {
        whereConditions.deviceId = queryDto.deviceId;
      }

      if (queryDto.propertyId) {
        whereConditions.device = {
          propertyId: queryDto.propertyId,
        };
      }

      if (queryDto.type) {
        whereConditions.type = queryDto.type;
      }

      if (queryDto.severity) {
        whereConditions.severity = queryDto.severity;
      }

      if (queryDto.status) {
        whereConditions.status = queryDto.status;
      }

      if (queryDto.startDate || queryDto.endDate) {
        whereConditions.createdAt = {};
        if (queryDto.startDate) {
          whereConditions.createdAt.gte = new Date(queryDto.startDate);
        }
        if (queryDto.endDate) {
          whereConditions.createdAt.lte = new Date(queryDto.endDate);
        }
      }

      // Definir ordenamiento
      const orderBy: any = {};
      if (queryDto.sortBy && ['createdAt', 'severity', 'status'].includes(queryDto.sortBy)) {
        orderBy[queryDto.sortBy] = queryDto.sortOrder || 'desc';
      } else {
        orderBy.createdAt = 'desc';
      }

      // Obtener alertas y conteo
      const [alerts, total] = await Promise.all([
        prisma.ioTAlert.findMany({
          where: whereConditions,
          include: {
            device: {
              select: {
                id: true,
                name: true,
                type: true,
                location: true,
              },
            },
            acknowledgedByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            resolvedByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.ioTAlert.count({ where: whereConditions }),
      ]);

      // Calcular resúmenes
      const summary = await this.calculateAlertsSummary(residentialComplexId, prisma);

      return {
        alerts: alerts.map(alert => this.mapAlertToResponse(alert)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        summary,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo alertas: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener una alerta por ID
   */
  async getAlertById(
    alertId: string,
    residentialComplexId: string,
    schemaName: string
  ): Promise<AlertResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const alert = await prisma.ioTAlert.findFirst({
        where: {
          id: alertId,
          residentialComplexId,
        },
        include: {
          device: {
            select: {
              id: true,
              name: true,
              type: true,
              location: true,
            },
          },
          acknowledgedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          resolvedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!alert) {
        throw new NotFoundException('Alerta no encontrada');
      }

      return this.mapAlertToResponse(alert);
    } catch (error) {
      this.logger.error(`Error obteniendo alerta: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualizar una alerta
   */
  async updateAlert(
    alertId: string,
    updateAlertDto: UpdateAlertDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<AlertResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Verificar que la alerta existe
      const existingAlert = await prisma.ioTAlert.findFirst({
        where: {
          id: alertId,
          residentialComplexId,
        },
      });

      if (!existingAlert) {
        throw new NotFoundException('Alerta no encontrada');
      }

      // Actualizar la alerta
      const updatedAlert = await prisma.ioTAlert.update({
        where: { id: alertId },
        data: {
          ...updateAlertDto,
          updatedAt: new Date(),
        },
        include: {
          device: {
            select: {
              id: true,
              name: true,
              type: true,
              location: true,
            },
          },
          acknowledgedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          resolvedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Alerta actualizada: ${alertId} - Estado: ${updateAlertDto.status}`);

      return this.mapAlertToResponse(updatedAlert);
    } catch (error) {
      this.logger.error(`Error actualizando alerta: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reconocer una alerta
   */
  async acknowledgeAlert(
    alertId: string,
    userId: string,
    residentialComplexId: string,
    schemaName: string
  ): Promise<AlertResponseDto> {
    try {
      const updateDto: UpdateAlertDto = {
        status: AlertStatus.ACKNOWLEDGED,
        acknowledgedBy: userId,
        acknowledgedAt: new Date().toISOString(),
      };

      return await this.updateAlert(alertId, updateDto, residentialComplexId, schemaName);
    } catch (error) {
      this.logger.error(`Error reconociendo alerta: ${error.message}`);
      throw error;
    }
  }

  /**
   * Resolver una alerta
   */
  async resolveAlert(
    alertId: string,
    userId: string,
    resolution: string,
    residentialComplexId: string,
    schemaName: string
  ): Promise<AlertResponseDto> {
    try {
      const updateDto: UpdateAlertDto = {
        status: AlertStatus.RESOLVED,
        resolvedBy: userId,
        resolvedAt: new Date().toISOString(),
        resolution,
      };

      return await this.updateAlert(alertId, updateDto, residentialComplexId, schemaName);
    } catch (error) {
      this.logger.error(`Error resolviendo alerta: ${error.message}`);
      throw error;
    }
  }

  /**
   * Realizar acción en lote sobre alertas
   */
  async bulkAlertAction(
    bulkActionDto: BulkAlertActionDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<{ updated: number; errors: string[] }> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const results = {
        updated: 0,
        errors: [] as string[],
      };

      for (const alertId of bulkActionDto.alertIds) {
        try {
          const updateData: any = {
            status: bulkActionDto.action,
            updatedAt: new Date(),
          };

          if (bulkActionDto.action === AlertStatus.ACKNOWLEDGED) {
            updateData.acknowledgedBy = bulkActionDto.userId;
            updateData.acknowledgedAt = new Date();
          } else if (bulkActionDto.action === AlertStatus.RESOLVED) {
            updateData.resolvedBy = bulkActionDto.userId;
            updateData.resolvedAt = new Date();
            updateData.resolution = bulkActionDto.notes;
          }

          await prisma.ioTAlert.updateMany({
            where: {
              id: alertId,
              residentialComplexId,
            },
            data: updateData,
          });

          results.updated++;
        } catch (error) {
          results.errors.push(`Error actualizando alerta ${alertId}: ${error.message}`);
        }
      }

      this.logger.log(`Acción en lote completada: ${results.updated} actualizadas, ${results.errors.length} errores`);

      return results;
    } catch (error) {
      this.logger.error(`Error en acción en lote: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de alertas
   */
  async getAlertsStats(
    statsDto: AlertStatsDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<any> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const whereConditions: any = {
        residentialComplexId,
      };

      if (statsDto.propertyId) {
        whereConditions.device = {
          propertyId: statsDto.propertyId,
        };
      }

      if (statsDto.startDate || statsDto.endDate) {
        whereConditions.createdAt = {};
        if (statsDto.startDate) {
          whereConditions.createdAt.gte = new Date(statsDto.startDate);
        }
        if (statsDto.endDate) {
          whereConditions.createdAt.lte = new Date(statsDto.endDate);
        }
      }

      if (!statsDto.includeResolved) {
        whereConditions.status = {
          not: AlertStatus.RESOLVED,
        };
      }

      // Estadísticas básicas
      const totalAlerts = await prisma.ioTAlert.count({ where: whereConditions });
      const activeAlerts = await prisma.ioTAlert.count({ 
        where: { ...whereConditions, status: AlertStatus.ACTIVE } 
      });
      const criticalAlerts = await prisma.ioTAlert.count({ 
        where: { ...whereConditions, severity: AlertSeverity.CRITICAL } 
      });

      // Agrupaciones opcionales
      const stats: any = {
        total: totalAlerts,
        active: activeAlerts,
        critical: criticalAlerts,
      };

      if (statsDto.groupBySeverity) {
        const bySeverity = await prisma.ioTAlert.groupBy({
          by: ['severity'],
          where: whereConditions,
          _count: true,
        });
        stats.bySeverity = this.formatGroupByResults(bySeverity, 'severity');
      }

      if (statsDto.groupByType) {
        const byType = await prisma.ioTAlert.groupBy({
          by: ['type'],
          where: whereConditions,
          _count: true,
        });
        stats.byType = this.formatGroupByResults(byType, 'type');
      }

      if (statsDto.groupByDevice) {
        const byDevice = await prisma.ioTAlert.groupBy({
          by: ['deviceId'],
          where: whereConditions,
          _count: true,
          orderBy: { _count: { deviceId: 'desc' } },
          take: 10, // Top 10 dispositivos con más alertas
        });
        
        // Obtener nombres de dispositivos
        const deviceIds = byDevice.map(item => item.deviceId);
        const devices = await prisma.ioTDevice.findMany({
          where: { id: { in: deviceIds } },
          select: { id: true, name: true },
        });

        stats.byDevice = byDevice.map(item => {
          const device = devices.find(d => d.id === item.deviceId);
          return {
            deviceId: item.deviceId,
            deviceName: device?.name || 'Desconocido',
            count: item._count,
          };
        });
      }

      return stats;
    } catch (error) {
      this.logger.error(`Error obteniendo estadísticas de alertas: ${error.message}`);
      throw error;
    }
  }

  /**
   * Crear alertas automáticas basadas en condiciones
   */
  async createAutomaticAlerts(
    deviceId: string,
    conditions: {
      type: AlertType;
      data: any;
    }[],
    residentialComplexId: string,
    schemaName: string
  ): Promise<AlertResponseDto[]> {
    try {
      const alerts: AlertResponseDto[] = [];

      for (const condition of conditions) {
        const alertDto = this.buildAlertFromCondition(deviceId, condition);
        if (alertDto) {
          const alert = await this.createAlert(alertDto, residentialComplexId, schemaName);
          alerts.push(alert);
        }
      }

      return alerts;
    } catch (error) {
      this.logger.error(`Error creando alertas automáticas: ${error.message}`);
      throw error;
    }
  }

  /**
   * Construir alerta desde condición
   */
  private buildAlertFromCondition(deviceId: string, condition: any): CreateAlertDto | null {
    switch (condition.type) {
      case AlertType.CONSUMPTION_SPIKE:
        return {
          deviceId,
          type: AlertType.CONSUMPTION_SPIKE,
          severity: AlertSeverity.HIGH,
          title: 'Pico de Consumo Detectado',
          message: `Se detectó un consumo inusualmente alto: ${condition.data.value} ${condition.data.unit}`,
          data: condition.data,
        };

      case AlertType.DEVICE_OFFLINE:
        return {
          deviceId,
          type: AlertType.DEVICE_OFFLINE,
          severity: AlertSeverity.MEDIUM,
          title: 'Dispositivo Desconectado',
          message: 'El dispositivo no ha enviado datos en las últimas horas',
          data: condition.data,
        };

      case AlertType.THRESHOLD_EXCEEDED:
        return {
          deviceId,
          type: AlertType.THRESHOLD_EXCEEDED,
          severity: AlertSeverity.HIGH,
          title: 'Umbral Excedido',
          message: `El consumo ha excedido el umbral establecido: ${condition.data.threshold}`,
          data: condition.data,
        };

      default:
        return null;
    }
  }

  /**
   * Calcular resúmenes de alertas
   */
  private async calculateAlertsSummary(residentialComplexId: string, prisma: any) {
    const whereConditions = { residentialComplexId };

    const [totalAlerts, activeAlerts, criticalAlerts, resolvedAlerts] = await Promise.all([
      prisma.ioTAlert.count({ where: whereConditions }),
      prisma.ioTAlert.count({ where: { ...whereConditions, status: AlertStatus.ACTIVE } }),
      prisma.ioTAlert.count({ where: { ...whereConditions, severity: AlertSeverity.CRITICAL } }),
      prisma.ioTAlert.count({ where: { ...whereConditions, status: AlertStatus.RESOLVED } }),
    ]);

    return {
      totalAlerts,
      activeAlerts,
      criticalAlerts,
      resolvedAlerts,
    };
  }

  /**
   * Formatear resultados de groupBy
   */
  private formatGroupByResults(results: any[], field: string): Record<string, number> {
    const formatted: Record<string, number> = {};
    results.forEach(result => {
      formatted[result[field]] = result._count;
    });
    return formatted;
  }

  /**
   * Mapear alerta a respuesta
   */
  private mapAlertToResponse(alert: any): AlertResponseDto {
    return {
      id: alert.id,
      deviceId: alert.deviceId,
      type: alert.type,
      severity: alert.severity,
      status: alert.status,
      title: alert.title,
      message: alert.message,
      data: alert.data,
      acknowledgedBy: alert.acknowledgedBy,
      acknowledgedAt: alert.acknowledgedAt,
      resolvedBy: alert.resolvedBy,
      resolvedAt: alert.resolvedAt,
      resolution: alert.resolution,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
      device: alert.device,
      acknowledgedByUser: alert.acknowledgedByUser,
      resolvedByUser: alert.resolvedByUser,
    };
  }
}
