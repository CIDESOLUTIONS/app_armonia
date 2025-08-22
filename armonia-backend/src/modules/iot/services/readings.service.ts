import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateReadingDto,
  SmartMeterReadingDto,
  BulkReadingDto,
  ReadingQueryDto,
  ReadingResponseDto,
  ReadingListResponseDto,
  SmartMeterReadingResponseDto,
  ReadingSource
} from '../dto';

@Injectable()
export class ReadingsService {
  private readonly logger = new Logger(ReadingsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Crear una nueva lectura de medidor
   */
  async createReading(
    createReadingDto: CreateReadingDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<ReadingResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Verificar que el dispositivo existe
      const device = await prisma.ioTDevice.findFirst({
        where: {
          id: createReadingDto.deviceId,
          residentialComplexId,
        },
      });

      if (!device) {
        throw new NotFoundException('Dispositivo no encontrado');
      }

      // Obtener la lectura anterior para calcular consumo
      const previousReading = await prisma.utilityReading.findFirst({
        where: {
          deviceId: createReadingDto.deviceId,
          utilityType: createReadingDto.utilityType,
        },
        orderBy: { readingDate: 'desc' },
      });

      // Calcular consumo si hay lectura anterior
      let consumption = createReadingDto.consumption;
      if (!consumption && previousReading) {
        consumption = createReadingDto.reading - previousReading.reading;
      }

      // Crear la lectura
      const reading = await prisma.utilityReading.create({
        data: {
          deviceId: createReadingDto.deviceId,
          propertyId: createReadingDto.propertyId || device.propertyId,
          utilityType: createReadingDto.utilityType,
          reading: createReadingDto.reading,
          previousReading: previousReading?.reading,
          consumption,
          unit: createReadingDto.unit,
          cost: createReadingDto.cost,
          readingDate: createReadingDto.readingDate ? new Date(createReadingDto.readingDate) : new Date(),
          isAutomatic: createReadingDto.isAutomatic ?? true,
          metadata: createReadingDto.metadata,
          residentialComplexId,
        },
        include: {
          device: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          property: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Actualizar estadísticas del dispositivo
      await prisma.ioTDevice.update({
        where: { id: createReadingDto.deviceId },
        data: {
          lastReading: createReadingDto.reading,
          lastReadingDate: reading.readingDate,
          lastCommunication: new Date(),
          totalReadings: { increment: 1 },
          isOnline: true,
        },
      });

      this.logger.log(`Lectura creada: ${reading.id} - Dispositivo: ${device.name}`);

      return this.mapReadingToResponse(reading);
    } catch (error) {
      this.logger.error(`Error creando lectura: ${error.message}`);
      throw error;
    }
  }

  /**
   * Crear lectura de medidor inteligente
   */
  async createSmartMeterReading(
    readingDto: SmartMeterReadingDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<SmartMeterReadingResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Verificar que el dispositivo existe y es un medidor inteligente
      const device = await prisma.ioTDevice.findFirst({
        where: {
          id: readingDto.deviceId,
          residentialComplexId,
          isSmartMeter: true,
        },
      });

      if (!device) {
        throw new NotFoundException('Medidor inteligente no encontrado');
      }

      // Crear la lectura del medidor inteligente
      const reading = await prisma.smartMeterReading.create({
        data: {
          deviceId: readingDto.deviceId,
          value: readingDto.value,
          unit: readingDto.unit,
          timestamp: new Date(readingDto.timestamp),
          quality: readingDto.quality,
          rawData: readingDto.rawData,
          source: readingDto.source || ReadingSource.DEVICE,
          processed: readingDto.processed ?? false,
          residentialComplexId,
        },
        include: {
          device: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      });

      // Actualizar dispositivo
      await prisma.ioTDevice.update({
        where: { id: readingDto.deviceId },
        data: {
          lastCommunication: new Date(),
          isOnline: true,
        },
      });

      this.logger.log(`Lectura de medidor inteligente creada: ${reading.id}`);

      return {
        id: reading.id,
        deviceId: reading.deviceId,
        value: reading.value,
        unit: reading.unit,
        timestamp: reading.timestamp,
        quality: reading.quality,
        rawData: reading.rawData,
        source: reading.source as ReadingSource,
        processed: reading.processed,
        createdAt: reading.createdAt,
        device: reading.device,
      };
    } catch (error) {
      this.logger.error(`Error creando lectura de medidor inteligente: ${error.message}`);
      throw error;
    }
  }

  /**
   * Crear múltiples lecturas en lote
   */
  async createBulkReadings(
    bulkReadingDto: BulkReadingDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<{ created: number; errors: string[] }> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Verificar que el dispositivo existe
      const device = await prisma.ioTDevice.findFirst({
        where: {
          id: bulkReadingDto.deviceId,
          residentialComplexId,
          isSmartMeter: true,
        },
      });

      if (!device) {
        throw new NotFoundException('Medidor inteligente no encontrado');
      }

      const results = {
        created: 0,
        errors: [] as string[],
      };

      // Procesar cada lectura
      for (const reading of bulkReadingDto.readings) {
        try {
          await prisma.smartMeterReading.create({
            data: {
              deviceId: bulkReadingDto.deviceId,
              value: reading.value,
              unit: reading.unit,
              timestamp: new Date(reading.timestamp),
              quality: reading.quality,
              rawData: reading.rawData,
              source: bulkReadingDto.source || ReadingSource.DEVICE,
              processed: bulkReadingDto.processed ?? false,
              residentialComplexId,
            },
          });
          results.created++;
        } catch (error) {
          results.errors.push(`Error en lectura ${reading.timestamp}: ${error.message}`);
        }
      }

      // Actualizar dispositivo
      if (results.created > 0) {
        await prisma.ioTDevice.update({
          where: { id: bulkReadingDto.deviceId },
          data: {
            lastCommunication: new Date(),
            isOnline: true,
          },
        });
      }

      this.logger.log(`Lecturas en lote procesadas: ${results.created} creadas, ${results.errors.length} errores`);

      return results;
    } catch (error) {
      this.logger.error(`Error procesando lecturas en lote: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener lecturas con filtros
   */
  async getReadings(
    queryDto: ReadingQueryDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<ReadingListResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const page = queryDto.page || 1;
      const limit = Math.min(queryDto.limit || 50, 100);
      const skip = (page - 1) * limit;

      // Construir condiciones de filtrado
      const whereConditions: any = {
        residentialComplexId,
      };

      if (queryDto.deviceId) {
        whereConditions.deviceId = queryDto.deviceId;
      }

      if (queryDto.propertyId) {
        whereConditions.propertyId = queryDto.propertyId;
      }

      if (queryDto.utilityType) {
        whereConditions.utilityType = queryDto.utilityType;
      }

      if (queryDto.startDate || queryDto.endDate) {
        whereConditions.readingDate = {};
        if (queryDto.startDate) {
          whereConditions.readingDate.gte = new Date(queryDto.startDate);
        }
        if (queryDto.endDate) {
          whereConditions.readingDate.lte = new Date(queryDto.endDate);
        }
      }

      // Definir ordenamiento
      const orderBy: any = {};
      if (queryDto.sortBy && ['readingDate', 'reading', 'consumption', 'cost'].includes(queryDto.sortBy)) {
        orderBy[queryDto.sortBy] = queryDto.sortOrder || 'desc';
      } else {
        orderBy.readingDate = 'desc';
      }

      // Obtener lecturas y conteo
      const [readings, total] = await Promise.all([
        prisma.utilityReading.findMany({
          where: whereConditions,
          include: {
            device: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
            property: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.utilityReading.count({ where: whereConditions }),
      ]);

      // Calcular resúmenes
      const summary = await this.calculateReadingsSummary(whereConditions, prisma);

      return {
        readings: readings.map(reading => this.mapReadingToResponse(reading)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        summary,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo lecturas: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener lecturas de medidores inteligentes
   */
  async getSmartMeterReadings(
    deviceId: string,
    residentialComplexId: string,
    schemaName: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      processed?: boolean;
      page?: number;
      limit?: number;
    }
  ): Promise<{ readings: SmartMeterReadingResponseDto[]; pagination: any }> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const page = filters?.page || 1;
      const limit = Math.min(filters?.limit || 100, 500);
      const skip = (page - 1) * limit;

      const whereConditions: any = {
        deviceId,
        residentialComplexId,
      };

      if (filters?.processed !== undefined) {
        whereConditions.processed = filters.processed;
      }

      if (filters?.startDate || filters?.endDate) {
        whereConditions.timestamp = {};
        if (filters.startDate) {
          whereConditions.timestamp.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          whereConditions.timestamp.lte = new Date(filters.endDate);
        }
      }

      const [readings, total] = await Promise.all([
        prisma.smartMeterReading.findMany({
          where: whereConditions,
          include: {
            device: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
          orderBy: { timestamp: 'desc' },
          skip,
          take: limit,
        }),
        prisma.smartMeterReading.count({ where: whereConditions }),
      ]);

      return {
        readings: readings.map(reading => ({
          id: reading.id,
          deviceId: reading.deviceId,
          value: reading.value,
          unit: reading.unit,
          timestamp: reading.timestamp,
          quality: reading.quality,
          rawData: reading.rawData,
          source: reading.source as ReadingSource,
          processed: reading.processed,
          createdAt: reading.createdAt,
          device: reading.device,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error obteniendo lecturas de medidor inteligente: ${error.message}`);
      throw error;
    }
  }

  /**
   * Procesar lecturas de medidores inteligentes pendientes
   */
  async processSmartMeterReadings(
    deviceId: string,
    residentialComplexId: string,
    schemaName: string
  ): Promise<{ processed: number }> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Obtener lecturas no procesadas
      const unprocessedReadings = await prisma.smartMeterReading.findMany({
        where: {
          deviceId,
          residentialComplexId,
          processed: false,
        },
        orderBy: { timestamp: 'asc' },
      });

      let processed = 0;

      for (const reading of unprocessedReadings) {
        try {
          // Procesar la lectura y crear entrada en utilityReading
          // Esto es un procesamiento básico, se puede extender según las necesidades
          
          // Marcar como procesada
          await prisma.smartMeterReading.update({
            where: { id: reading.id },
            data: { processed: true },
          });

          processed++;
        } catch (error) {
          this.logger.warn(`Error procesando lectura ${reading.id}: ${error.message}`);
        }
      }

      this.logger.log(`Lecturas procesadas: ${processed} de ${unprocessedReadings.length}`);

      return { processed };
    } catch (error) {
      this.logger.error(`Error procesando lecturas: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calcular resúmenes de lecturas
   */
  private async calculateReadingsSummary(whereConditions: any, prisma: any) {
    const aggregations = await prisma.utilityReading.aggregate({
      where: whereConditions,
      _count: { id: true },
      _sum: { consumption: true },
      _avg: { consumption: true },
    });

    const lastReading = await prisma.utilityReading.findFirst({
      where: whereConditions,
      orderBy: { readingDate: 'desc' },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        property: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      totalReadings: aggregations._count.id || 0,
      totalConsumption: aggregations._sum.consumption || 0,
      averageConsumption: aggregations._avg.consumption || 0,
      lastReading: lastReading ? this.mapReadingToResponse(lastReading) : undefined,
    };
  }

  /**
   * Mapear lectura a respuesta
   */
  private mapReadingToResponse(reading: any): ReadingResponseDto {
    return {
      id: reading.id,
      deviceId: reading.deviceId,
      utilityType: reading.utilityType,
      reading: reading.reading,
      previousReading: reading.previousReading,
      consumption: reading.consumption,
      unit: reading.unit,
      cost: reading.cost,
      readingDate: reading.readingDate,
      source: reading.source,
      isAutomatic: reading.isAutomatic,
      metadata: reading.metadata,
      propertyId: reading.propertyId,
      createdAt: reading.createdAt,
      updatedAt: reading.updatedAt,
      device: reading.device,
      property: reading.property,
    };
  }
}
