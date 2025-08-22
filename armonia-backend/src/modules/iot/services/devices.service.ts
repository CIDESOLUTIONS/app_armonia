import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateDeviceDto,
  UpdateDeviceDto,
  DeviceConfigDto,
  DeviceResponseDto,
  DeviceListResponseDto,
  DeviceStatus,
  DeviceType
} from '../dto';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Crear un nuevo dispositivo IoT
   */
  async createDevice(
    createDeviceDto: CreateDeviceDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<DeviceResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Verificar que el serial number sea único
      const existingDevice = await prisma.ioTDevice.findFirst({
        where: {
          serialNumber: createDeviceDto.serialNumber,
          residentialComplexId,
        },
      });

      if (existingDevice) {
        throw new BadRequestException('Ya existe un dispositivo con este número de serie');
      }

      // Verificar que la propiedad existe si se especifica
      if (createDeviceDto.propertyId) {
        const property = await prisma.property.findUnique({
          where: { id: createDeviceDto.propertyId },
        });

        if (!property) {
          throw new NotFoundException('Propiedad no encontrada');
        }
      }

      const device = await prisma.ioTDevice.create({
        data: {
          ...createDeviceDto,
          status: DeviceStatus.ACTIVE,
          residentialComplexId,
          isOnline: true,
          totalReadings: 0,
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
            },
          },
          unit: {
            select: {
              id: true,
              unitNumber: true,
            },
          },
        },
      });

      this.logger.log(`Dispositivo IoT creado: ${device.id} - ${device.name}`);

      return this.mapDeviceToResponse(device);
    } catch (error) {
      this.logger.error(`Error creando dispositivo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener todos los dispositivos
   */
  async getDevices(
    residentialComplexId: string,
    schemaName: string,
    filters?: {
      type?: DeviceType;
      status?: DeviceStatus;
      propertyId?: string;
      utilityType?: string;
      isSmartMeter?: boolean;
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<DeviceListResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const page = filters?.page || 1;
      const limit = Math.min(filters?.limit || 20, 100);
      const skip = (page - 1) * limit;

      // Construir condiciones de filtrado
      const whereConditions: any = {
        residentialComplexId,
      };

      if (filters?.type) {
        whereConditions.type = filters.type;
      }

      if (filters?.status) {
        whereConditions.status = filters.status;
      }

      if (filters?.propertyId) {
        whereConditions.propertyId = filters.propertyId;
      }

      if (filters?.utilityType) {
        whereConditions.utilityType = filters.utilityType;
      }

      if (filters?.isSmartMeter !== undefined) {
        whereConditions.isSmartMeter = filters.isSmartMeter;
      }

      if (filters?.search) {
        whereConditions.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { serialNumber: { contains: filters.search, mode: 'insensitive' } },
          { location: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      // Obtener dispositivos y conteo
      const [devices, total] = await Promise.all([
        prisma.ioTDevice.findMany({
          where: whereConditions,
          include: {
            property: {
              select: {
                id: true,
                name: true,
              },
            },
            unit: {
              select: {
                id: true,
                unitNumber: true,
              },
            },
            _count: {
              select: {
                alerts: {
                  where: { status: 'ACTIVE' },
                },
                readings: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.ioTDevice.count({ where: whereConditions }),
      ]);

      // Calcular resúmenes
      const summary = {
        totalDevices: total,
        activeDevices: await prisma.ioTDevice.count({
          where: { ...whereConditions, status: DeviceStatus.ACTIVE },
        }),
        offlineDevices: await prisma.ioTDevice.count({
          where: { ...whereConditions, isOnline: false },
        }),
        devicesWithAlerts: await prisma.ioTDevice.count({
          where: {
            ...whereConditions,
            alerts: {
              some: { status: 'ACTIVE' },
            },
          },
        }),
        smartMeters: await prisma.ioTDevice.count({
          where: { ...whereConditions, isSmartMeter: true },
        }),
      };

      return {
        devices: devices.map(device => ({
          ...this.mapDeviceToResponse(device),
          activeAlerts: device._count.alerts || 0,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        summary,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo dispositivos: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener un dispositivo por ID
   */
  async getDeviceById(
    deviceId: string,
    residentialComplexId: string,
    schemaName: string,
    includeReadings = false
  ): Promise<DeviceResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const device = await prisma.ioTDevice.findFirst({
        where: {
          id: deviceId,
          residentialComplexId,
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
            },
          },
          unit: {
            select: {
              id: true,
              unitNumber: true,
            },
          },
          alerts: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          ...(includeReadings && {
            readings: {
              orderBy: { readingDate: 'desc' },
              take: 10,
            },
          }),
        },
      });

      if (!device) {
        throw new NotFoundException('Dispositivo no encontrado');
      }

      return this.mapDeviceToResponse(device);
    } catch (error) {
      this.logger.error(`Error obteniendo dispositivo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualizar un dispositivo
   */
  async updateDevice(
    deviceId: string,
    updateDeviceDto: UpdateDeviceDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<DeviceResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Verificar que el dispositivo existe
      const existingDevice = await prisma.ioTDevice.findFirst({
        where: {
          id: deviceId,
          residentialComplexId,
        },
      });

      if (!existingDevice) {
        throw new NotFoundException('Dispositivo no encontrado');
      }

      // Verificar propiedad si se especifica
      if (updateDeviceDto.propertyId) {
        const property = await prisma.property.findUnique({
          where: { id: updateDeviceDto.propertyId },
        });

        if (!property) {
          throw new NotFoundException('Propiedad no encontrada');
        }
      }

      const updatedDevice = await prisma.ioTDevice.update({
        where: { id: deviceId },
        data: {
          ...updateDeviceDto,
          updatedAt: new Date(),
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
            },
          },
          unit: {
            select: {
              id: true,
              unitNumber: true,
            },
          },
        },
      });

      this.logger.log(`Dispositivo actualizado: ${deviceId}`);

      return this.mapDeviceToResponse(updatedDevice);
    } catch (error) {
      this.logger.error(`Error actualizando dispositivo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Eliminar un dispositivo
   */
  async deleteDevice(
    deviceId: string,
    residentialComplexId: string,
    schemaName: string
  ): Promise<{ message: string }> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const device = await prisma.ioTDevice.findFirst({
        where: {
          id: deviceId,
          residentialComplexId,
        },
      });

      if (!device) {
        throw new NotFoundException('Dispositivo no encontrado');
      }

      // Eliminar el dispositivo y todas sus relaciones
      await prisma.ioTDevice.delete({
        where: { id: deviceId },
      });

      this.logger.log(`Dispositivo eliminado: ${deviceId}`);

      return { message: 'Dispositivo eliminado exitosamente' };
    } catch (error) {
      this.logger.error(`Error eliminando dispositivo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Configurar un dispositivo
   */
  async configureDevice(
    deviceId: string,
    configDto: DeviceConfigDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<{ message: string }> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Verificar que el dispositivo existe
      const device = await prisma.ioTDevice.findFirst({
        where: {
          id: deviceId,
          residentialComplexId,
        },
      });

      if (!device) {
        throw new NotFoundException('Dispositivo no encontrado');
      }

      // Crear o actualizar configuración
      await prisma.deviceConfig.upsert({
        where: {
          deviceId_configKey: {
            deviceId,
            configKey: configDto.configKey,
          },
        },
        update: {
          configValue: configDto.configValue,
          description: configDto.description,
          isActive: configDto.isActive,
          updatedAt: new Date(),
        },
        create: {
          deviceId,
          configType: configDto.configType,
          configKey: configDto.configKey,
          configValue: configDto.configValue,
          description: configDto.description,
          isActive: configDto.isActive,
          residentialComplexId,
        },
      });

      this.logger.log(`Configuración actualizada para dispositivo: ${deviceId}`);

      return { message: 'Configuración actualizada exitosamente' };
    } catch (error) {
      this.logger.error(`Error configurando dispositivo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener configuración de un dispositivo
   */
  async getDeviceConfig(
    deviceId: string,
    residentialComplexId: string,
    schemaName: string
  ): Promise<any[]> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const configs = await prisma.deviceConfig.findMany({
        where: {
          deviceId,
          residentialComplexId,
          isActive: true,
        },
        orderBy: { configType: 'asc' },
      });

      return configs;
    } catch (error) {
      this.logger.error(`Error obteniendo configuración: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualizar estado de conectividad de un dispositivo
   */
  async updateDeviceConnectivity(
    deviceId: string,
    isOnline: boolean,
    residentialComplexId: string,
    schemaName: string
  ): Promise<void> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      await prisma.ioTDevice.update({
        where: { id: deviceId },
        data: {
          isOnline,
          lastCommunication: new Date(),
        },
      });

      this.logger.log(`Estado de conectividad actualizado: ${deviceId} - ${isOnline ? 'online' : 'offline'}`);
    } catch (error) {
      this.logger.error(`Error actualizando conectividad: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mapear dispositivo a respuesta
   */
  private mapDeviceToResponse(device: any): DeviceResponseDto {
    return {
      id: device.id,
      name: device.name,
      description: device.description,
      type: device.type,
      serialNumber: device.serialNumber,
      manufacturer: device.manufacturer,
      model: device.model,
      firmwareVersion: device.firmwareVersion,
      status: device.status,
      location: device.location,
      propertyId: device.propertyId,
      unitId: device.unitId,
      utilityType: device.utilityType,
      isSmartMeter: device.isSmartMeter,
      capabilities: device.capabilities,
      configuration: device.configuration,
      readingInterval: device.readingInterval,
      alertsEnabled: device.alertsEnabled,
      thresholds: device.thresholds,
      lastReading: device.lastReading,
      lastReadingDate: device.lastReadingDate,
      lastCommunication: device.lastCommunication,
      batteryLevel: device.batteryLevel,
      signalStrength: device.signalStrength,
      lastMaintenanceDate: device.lastMaintenanceDate,
      nextMaintenanceDate: device.nextMaintenanceDate,
      totalReadings: device.totalReadings,
      isOnline: device.isOnline,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
      property: device.property,
      unit: device.unit,
      recentReadings: device.readings,
      activeAlerts: device.alerts,
    };
  }
}
