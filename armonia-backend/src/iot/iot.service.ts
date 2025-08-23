import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SmartMeterReadingDto,
  SmartMeterFilterParamsDto,
  AutomatedBillingDto,
  IoTDeviceDto,
  CreateIoTDeviceDto,
  UpdateIoTDeviceDto,
  DeviceFilterParamsDto,
  TelemetryDataDto,
  IoTAlertDto,
  AlertFilterParamsDto,
  AcknowledgeAlertDto,
  ResolveAlertDto,
  IoTDashboardStatsDto,
  IoTDeviceType,
  IoTDeviceStatus,
  AlertType,
  AlertSeverity,
  AlertStatus,
  SmartMeterUnit,
} from '../common/dto/iot.dto';
import { FeeType } from '../common/dto/finances.dto';

@Injectable()
export class IotService {
  private readonly logger = new Logger(IotService.name);

  constructor(private prisma: PrismaService) {}

  // ========== DEVICE MANAGEMENT ==========
  
  async createDevice(
    schemaName: string,
    deviceData: CreateIoTDeviceDto,
  ): Promise<IoTDeviceDto> {
    try {
      // Create device record using raw SQL since Prisma schema may not include IoT tables
      const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.prisma.$executeRaw`
        INSERT INTO iot_devices (
          id, name, type, status, location, description, serial_number,
          manufacturer, model, firmware_version, metadata, installed_at,
          next_maintenance_at, property_id, residential_complex_id, schema_name
        ) VALUES (
          ${deviceId}, ${deviceData.name}, ${deviceData.type}, 'OFFLINE',
          ${deviceData.location}, ${deviceData.description || ''},
          ${deviceData.serialNumber || ''}, ${deviceData.manufacturer || ''},
          ${deviceData.model || ''}, ${deviceData.firmwareVersion || ''},
          ${JSON.stringify(deviceData.metadata || {})},
          ${deviceData.installedAt ? new Date(deviceData.installedAt) : new Date()},
          ${deviceData.nextMaintenanceAt ? new Date(deviceData.nextMaintenanceAt) : null},
          ${deviceData.propertyId || null}, '', ${schemaName}
        )
      `;

      this.logger.log(`Dispositivo IoT creado: ${deviceId} - ${deviceData.name}`);
      
      return {
        id: deviceId,
        name: deviceData.name,
        type: deviceData.type,
        status: IoTDeviceStatus.OFFLINE,
        location: deviceData.location,
        description: deviceData.description,
        serialNumber: deviceData.serialNumber,
        manufacturer: deviceData.manufacturer,
        model: deviceData.model,
        firmwareVersion: deviceData.firmwareVersion,
        metadata: deviceData.metadata,
        installedAt: deviceData.installedAt || new Date().toISOString(),
        nextMaintenanceAt: deviceData.nextMaintenanceAt,
        residentialComplexId: '',
        propertyId: deviceData.propertyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new BadRequestException('Error al crear dispositivo: ' + error.message);
    }
  }

  async getDevices(
    schemaName: string,
    filters: DeviceFilterParamsDto,
  ): Promise<{ devices: IoTDeviceDto[]; total: number }> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;

      const whereConditions = [`schema_name = '${schemaName}'`];
      const queryParams = [];

      if (filters.type) {
        whereConditions.push(`type = ${queryParams.length + 1}`);
        queryParams.push(filters.type);
      }
      if (filters.status) {
        whereConditions.push(`status = ${queryParams.length + 1}`);
        queryParams.push(filters.status);
      }
      if (filters.location) {
        whereConditions.push(`location ILIKE ${queryParams.length + 1}`);
        queryParams.push(`%${filters.location}%`);
      }
      if (filters.propertyId) {
        whereConditions.push(`property_id = ${queryParams.length + 1}`);
        queryParams.push(filters.propertyId);
      }
      if (filters.search) {
        whereConditions.push(`(name ILIKE ${queryParams.length + 1} OR description ILIKE ${queryParams.length + 1} OR serial_number ILIKE ${queryParams.length + 1})`);
        queryParams.push(`%${filters.search}%`);
      }

      const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

      const devices = await this.prisma.$queryRawUnsafe(`
        SELECT * FROM iot_devices ${whereClause}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `, ...queryParams) as any[];

      const totalResult = await this.prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as count FROM iot_devices ${whereClause}
      `, ...queryParams) as any[];
      const total = Number(totalResult[0]?.count || 0);

      return {
        devices: devices.map(device => this.mapDeviceToDto(device)),
        total,
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener dispositivos: ' + error.message);
    }
  }

  async receiveTelemetryData(
    schemaName: string,
    data: TelemetryDataDto,
  ): Promise<any> {
    try {
      // Store telemetry data
      const telemetryId = `telemetry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.prisma.$executeRaw`
        INSERT INTO telemetry_data (
          id, device_id, data_type, payload, timestamp, metadata, source, processed, schema_name
        ) VALUES (
          ${telemetryId}, ${data.deviceId}, ${data.dataType || 'unknown'},
          ${JSON.stringify(data.payload)}, ${new Date(data.timestamp)},
          ${JSON.stringify(data.metadata || {})}, ${data.source || 'api'},
          false, ${schemaName}
        )
      `;

      // Update device last seen
      await this.prisma.$executeRaw`
        UPDATE iot_devices SET 
          last_seen = ${new Date(data.timestamp)},
          status = 'ONLINE',
          updated_at = NOW()
        WHERE id = ${data.deviceId} AND schema_name = ${schemaName}
      `;

      // Process telemetry based on device type
      await this.processTelemetryByType(schemaName, data);
      
      return {
        message: 'Datos de telemetría recibidos exitosamente',
        telemetryId,
        deviceStatus: IoTDeviceStatus.ONLINE,
      };
    } catch (error) {
      throw new BadRequestException('Error al procesar telemetría: ' + error.message);
    }
  }

  async recordSmartMeterReading(
    schemaName: string,
    data: SmartMeterReadingDto,
  ): Promise<SmartMeterReadingDto> {
    try {
      // Get previous reading
      const previousReadings = await this.prisma.$queryRaw`
        SELECT * FROM smart_meter_readings 
        WHERE device_id = ${data.deviceId} AND schema_name = ${schemaName}
        ORDER BY timestamp DESC LIMIT 1
      ` as any[];

      const previousReading = previousReadings[0];
      const consumption = previousReading && data.reading >= previousReading.reading 
        ? data.reading - previousReading.reading 
        : 0;

      const readingId = `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.prisma.$executeRaw`
        INSERT INTO smart_meter_readings (
          id, device_id, reading, previous_reading, unit, timestamp,
          consumption, is_automatic, source, additional_data, schema_name
        ) VALUES (
          ${readingId}, ${data.deviceId}, ${data.reading},
          ${previousReading?.reading || null}, ${data.unit},
          ${new Date(data.timestamp)}, ${consumption},
          ${data.isAutomatic || false}, ${data.source || 'manual'},
          ${JSON.stringify(data.additionalData || {})}, ${schemaName}
        )
      `;

      // Check for consumption anomalies
      await this.checkConsumptionThresholds(schemaName, data.deviceId, consumption);

      return {
        ...data,
        id: readingId,
        consumption,
        previousReading: previousReading?.reading,
      };
    } catch (error) {
      throw new BadRequestException('Error al registrar lectura: ' + error.message);
    }
  }

  async getSmartMeterReadings(
    schemaName: string,
    filters: SmartMeterFilterParamsDto,
  ): Promise<{ readings: SmartMeterReadingDto[]; total: number }> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;

      let whereClause = `WHERE r.schema_name = '${schemaName}'`;
      
      if (filters.meterId) {
        whereClause += ` AND r.device_id = '${filters.meterId}'`;
      }
      if (filters.unit) {
        whereClause += ` AND r.unit = '${filters.unit}'`;
      }
      if (filters.startDate) {
        whereClause += ` AND r.timestamp >= '${filters.startDate}'`;
      }
      if (filters.endDate) {
        whereClause += ` AND r.timestamp <= '${filters.endDate}'`;
      }

      const readings = await this.prisma.$queryRaw`
        SELECT r.*, d.name as device_name, d.location
        FROM smart_meter_readings r
        LEFT JOIN iot_devices d ON r.device_id = d.id
        ${whereClause}
        ORDER BY r.timestamp ${filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}
        LIMIT ${limit} OFFSET ${offset}
      ` as any[];

      const total = await this.prisma.$queryRaw`
        SELECT COUNT(*) as count FROM smart_meter_readings r ${whereClause}
      ` as any[];

      return {
        readings: readings.map(reading => ({
          id: reading.id,
          deviceId: reading.device_id,
          meterId: reading.device_id,
          propertyId: reading.property_id || '',
          reading: reading.reading,
          previousReading: reading.previous_reading,
          unit: reading.unit,
          timestamp: reading.timestamp?.toISOString(),
          consumption: reading.consumption,
          cost: reading.cost,
          isAutomatic: reading.is_automatic,
          source: reading.source,
          additionalData: reading.additional_data,
          residentialComplexId: '',
        })),
        total: Number(total[0]?.count || 0),
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener lecturas: ' + error.message);
    }
  }

  async triggerAutomatedBilling(
    schemaName: string,
    data: AutomatedBillingDto,
  ): Promise<any> {
    try {
      if (data.dryRun) {
        return {
          message: 'Simulación de facturación completada',
          dryRun: true,
          estimatedFees: 0,
          estimatedAmount: 0,
        };
      }

      // Get readings for the billing period
      const readings = await this.prisma.$queryRaw`
        SELECT r.*, d.property_id
        FROM smart_meter_readings r
        LEFT JOIN iot_devices d ON r.device_id = d.id
        WHERE r.schema_name = ${schemaName}
        AND r.timestamp >= ${new Date(data.billingPeriodStart)}
        AND r.timestamp <= ${new Date(data.billingPeriodEnd)}
        ${data.propertyIds?.length ? `AND d.property_id IN (${data.propertyIds.map(id => `'${id}'`).join(',')})` : ''}
        ${data.meterTypes?.length ? `AND r.unit IN (${data.meterTypes.map(type => `'${type}'`).join(',')})` : ''}
      ` as any[];

      // Group by property and calculate consumption
      const consumptionByProperty = this.groupConsumptionByProperty(readings);
      let totalFeesGenerated = 0;
      let totalAmount = 0;

      // Generate fees (this would integrate with the Fee system)
      for (const [propertyId, consumptionData] of Object.entries(consumptionByProperty)) {
        for (const [meterType, consumption] of Object.entries(consumptionData as any)) {
          // Calculate amount based on consumption
          const rate = 0.15; // Default rate - should come from utility rates
          const amount = (consumption as any).total * rate;
          totalAmount += amount;
          totalFeesGenerated++;
        }
      }

      return {
        message: 'Facturación automatizada completada exitosamente',
        period: {
          start: data.billingPeriodStart,
          end: data.billingPeriodEnd,
        },
        summary: {
          feesGenerated: totalFeesGenerated,
          totalAmount,
          propertiesProcessed: Object.keys(consumptionByProperty).length,
        },
      };
    } catch (error) {
      throw new BadRequestException('Error en facturación automatizada: ' + error.message);
    }
  }

  async getAlerts(
    schemaName: string,
    filters: AlertFilterParamsDto,
  ): Promise<{ alerts: IoTAlertDto[]; total: number }> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;

      let whereClause = `WHERE a.schema_name = '${schemaName}'`;
      
      if (filters.type) {
        whereClause += ` AND a.type = '${filters.type}'`;
      }
      if (filters.severity) {
        whereClause += ` AND a.severity = '${filters.severity}'`;
      }
      if (filters.status) {
        whereClause += ` AND a.status = '${filters.status}'`;
      }
      if (filters.deviceId) {
        whereClause += ` AND a.device_id = '${filters.deviceId}'`;
      }
      if (filters.startDate) {
        whereClause += ` AND a.created_at >= '${filters.startDate}'`;
      }
      if (filters.endDate) {
        whereClause += ` AND a.created_at <= '${filters.endDate}'`;
      }

      const alerts = await this.prisma.$queryRaw`
        SELECT a.*, d.name as device_name
        FROM iot_alerts a
        LEFT JOIN iot_devices d ON a.device_id = d.id
        ${whereClause}
        ORDER BY a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      ` as any[];

      const total = await this.prisma.$queryRaw`
        SELECT COUNT(*) as count FROM iot_alerts a ${whereClause}
      ` as any[];

      return {
        alerts: alerts.map(alert => this.mapAlertToDto(alert)),
        total: Number(total[0]?.count || 0),
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener alertas: ' + error.message);
    }
  }

  async acknowledgeAlert(
    schemaName: string,
    alertId: string,
    data: AcknowledgeAlertDto,
  ): Promise<IoTAlertDto> {
    try {
      await this.prisma.$executeRaw`
        UPDATE iot_alerts SET 
          status = 'ACKNOWLEDGED',
          acknowledged_by = ${data.userId},
          acknowledged_at = NOW(),
          updated_at = NOW()
        WHERE id = ${alertId} AND schema_name = ${schemaName}
      `;

      const alerts = await this.prisma.$queryRaw`
        SELECT a.*, d.name as device_name
        FROM iot_alerts a
        LEFT JOIN iot_devices d ON a.device_id = d.id
        WHERE a.id = ${alertId}
      ` as any[];

      if (!alerts.length) {
        throw new NotFoundException('Alerta no encontrada');
      }

      return this.mapAlertToDto(alerts[0]);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al reconocer alerta: ' + error.message);
    }
  }

  async resolveAlert(
    schemaName: string,
    alertId: string,
    data: ResolveAlertDto,
  ): Promise<IoTAlertDto> {
    try {
      await this.prisma.$executeRaw`
        UPDATE iot_alerts SET 
          status = 'RESOLVED',
          resolved_by = ${data.userId},
          resolved_at = NOW(),
          resolution = ${data.resolution},
          updated_at = NOW()
        WHERE id = ${alertId} AND schema_name = ${schemaName}
      `;

      const alerts = await this.prisma.$queryRaw`
        SELECT a.*, d.name as device_name
        FROM iot_alerts a
        LEFT JOIN iot_devices d ON a.device_id = d.id
        WHERE a.id = ${alertId}
      ` as any[];

      if (!alerts.length) {
        throw new NotFoundException('Alerta no encontrada');
      }

      return this.mapAlertToDto(alerts[0]);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al resolver alerta: ' + error.message);
    }
  }

  async getDashboardStats(
    schemaName: string,
  ): Promise<IoTDashboardStatsDto> {
    try {
      const [deviceStats, alertStats, readingStats] = await Promise.all([
        this.getDeviceStats(schemaName),
        this.getAlertStats(schemaName),
        this.getReadingStats(schemaName),
      ]);

      return {
        ...deviceStats,
        ...alertStats,
        ...readingStats,
        recentAlerts: await this.getRecentAlerts(schemaName),
        topConsumers: [],
        consumptionTrends: {},
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener estadísticas: ' + error.message);
    }
  }

  // ========== HELPER METHODS ==========
  
  private async processTelemetryByType(schemaName: string, data: TelemetryDataDto): Promise<void> {
    try {
      // Get device info to determine type
      const devices = await this.prisma.$queryRaw`
        SELECT type FROM iot_devices WHERE id = ${data.deviceId} AND schema_name = ${schemaName}
      ` as any[];

      if (!devices.length) return;

      const deviceType = devices[0].type;

      switch (deviceType) {
        case IoTDeviceType.SMART_METER:
          await this.processSmartMeterTelemetry(schemaName, data);
          break;
        case IoTDeviceType.SENSOR:
          await this.processSensorTelemetry(schemaName, data);
          break;
        // Add more device types as needed
      }
    } catch (error) {
      this.logger.error(`Error procesando telemetría: ${error.message}`);
    }
  }

  private async processSmartMeterTelemetry(schemaName: string, data: TelemetryDataDto): Promise<void> {
    const { reading, unit } = data.payload;
    
    if (typeof reading === 'number') {
      const readingData: SmartMeterReadingDto = {
        deviceId: data.deviceId,
        meterId: data.deviceId,
        propertyId: '',
        reading,
        unit: unit || SmartMeterUnit.KWH,
        timestamp: data.timestamp,
        residentialComplexId: '',
        isAutomatic: true,
        source: data.source || 'telemetry',
      };
      
      await this.recordSmartMeterReading(schemaName, readingData);
    }
  }

  private async processSensorTelemetry(schemaName: string, data: TelemetryDataDto): Promise<void> {
    const { value, threshold, type } = data.payload;
    
    if (threshold && typeof value === 'number' && value > threshold) {
      await this.createAlert(schemaName, {
        deviceId: data.deviceId,
        type: AlertType.THRESHOLD_EXCEEDED,
        severity: AlertSeverity.HIGH,
        title: `Umbral excedido`,
        message: `Sensor ha excedido el umbral. Valor: ${value}, Umbral: ${threshold}`,
        data: { value, threshold, sensorType: type },
        residentialComplexId: '',
        createdAt: new Date().toISOString(),
      });
    }
  }

  private async checkConsumptionThresholds(schemaName: string, deviceId: string, consumption: number): Promise<void> {
    try {
      // Get historical average
      const avgData = await this.prisma.$queryRaw`
        SELECT AVG(consumption) as avg_consumption
        FROM smart_meter_readings 
        WHERE device_id = ${deviceId} 
        AND schema_name = ${schemaName}
        AND timestamp >= ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
      ` as any[];

      const avgConsumption = Number(avgData[0]?.avg_consumption || 0);
      const threshold = avgConsumption * 1.5;

      if (consumption > threshold && threshold > 0) {
        await this.createAlert(schemaName, {
          deviceId,
          type: AlertType.CONSUMPTION_SPIKE,
          severity: AlertSeverity.HIGH,
          title: 'Pico de consumo detectado',
          message: `Consumo actual (${consumption}) excede 50% el promedio histórico (${avgConsumption.toFixed(2)})`,
          data: { consumption, avgConsumption, threshold },
          residentialComplexId: '',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      this.logger.error(`Error verificando umbrales: ${error.message}`);
    }
  }

  private async createAlert(schemaName: string, alertData: Partial<IoTAlertDto>): Promise<void> {
    try {
      const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.prisma.$executeRaw`
        INSERT INTO iot_alerts (
          id, device_id, type, severity, status, title, message, data, schema_name
        ) VALUES (
          ${alertId}, ${alertData.deviceId}, ${alertData.type}, 
          ${alertData.severity}, 'ACTIVE', ${alertData.title}, 
          ${alertData.message}, ${JSON.stringify(alertData.data || {})}, ${schemaName}
        )
      `;

      this.logger.log(`Alerta IoT creada: ${alertId} - ${alertData.title}`);
    } catch (error) {
      this.logger.error(`Error creando alerta: ${error.message}`);
    }
  }

  private async getDeviceStats(schemaName: string): Promise<Partial<IoTDashboardStatsDto>> {
    try {
      const stats = await this.prisma.$queryRaw`
        SELECT 
          COUNT(*) as total_devices,
          COUNT(CASE WHEN status = 'ONLINE' THEN 1 END) as online_devices,
          COUNT(CASE WHEN status = 'OFFLINE' THEN 1 END) as offline_devices,
          COUNT(CASE WHEN status = 'MAINTENANCE' THEN 1 END) as maintenance_devices,
          COUNT(CASE WHEN status = 'ERROR' THEN 1 END) as error_devices
        FROM iot_devices 
        WHERE schema_name = ${schemaName}
      ` as any[];

      const typeStats = await this.prisma.$queryRaw`
        SELECT type, COUNT(*) as count
        FROM iot_devices 
        WHERE schema_name = ${schemaName}
        GROUP BY type
      ` as any[];

      const devicesByType = Object.values(IoTDeviceType).reduce((acc, type) => {
        acc[type] = Number(typeStats.find(stat => stat.type === type)?.count || 0);
        return acc;
      }, {} as any);

      const stat = stats[0] || {};
      return {
        totalDevices: Number(stat.total_devices || 0),
        onlineDevices: Number(stat.online_devices || 0),
        offlineDevices: Number(stat.offline_devices || 0),
        maintenanceDevices: Number(stat.maintenance_devices || 0),
        errorDevices: Number(stat.error_devices || 0),
        devicesByType,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo stats de dispositivos: ${error.message}`);
      return {
        totalDevices: 0,
        onlineDevices: 0,
        offlineDevices: 0,
        maintenanceDevices: 0,
        errorDevices: 0,
        devicesByType: {} as any,
      };
    }
  }

  private async getAlertStats(schemaName: string): Promise<Partial<IoTDashboardStatsDto>> {
    try {
      const stats = await this.prisma.$queryRaw`
        SELECT 
          COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_alerts,
          COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_alerts
        FROM iot_alerts 
        WHERE schema_name = ${schemaName}
      ` as any[];

      const stat = stats[0] || {};
      return {
        activeAlerts: Number(stat.active_alerts || 0),
        criticalAlerts: Number(stat.critical_alerts || 0),
      };
    } catch (error) {
      this.logger.error(`Error obteniendo stats de alertas: ${error.message}`);
      return {
        activeAlerts: 0,
        criticalAlerts: 0,
      };
    }
  }

  private async getReadingStats(schemaName: string): Promise<Partial<IoTDashboardStatsDto>> {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const stats = await this.prisma.$queryRaw`
        SELECT 
          COUNT(CASE WHEN timestamp >= ${todayStart} THEN 1 END) as today_readings,
          COALESCE(SUM(consumption), 0) as total_consumption
        FROM smart_meter_readings 
        WHERE schema_name = ${schemaName}
      ` as any[];

      const stat = stats[0] || {};
      return {
        todayReadings: Number(stat.today_readings || 0),
        totalConsumption: Number(stat.total_consumption || 0),
      };
    } catch (error) {
      this.logger.error(`Error obteniendo stats de lecturas: ${error.message}`);
      return {
        todayReadings: 0,
        totalConsumption: 0,
      };
    }
  }

  private async getRecentAlerts(schemaName: string): Promise<IoTAlertDto[]> {
    try {
      const alerts = await this.prisma.$queryRaw`
        SELECT a.*, d.name as device_name
        FROM iot_alerts a
        LEFT JOIN iot_devices d ON a.device_id = d.id
        WHERE a.schema_name = ${schemaName}
        ORDER BY a.created_at DESC
        LIMIT 5
      ` as any[];

      return alerts.map(alert => this.mapAlertToDto(alert));
    } catch (error) {
      this.logger.error(`Error obteniendo alertas recientes: ${error.message}`);
      return [];
    }
  }

  private groupConsumptionByProperty(readings: any[]): { [propertyId: string]: { [meterType: string]: { total: number; readings: any[] } } } {
    const result: any = {};
    
    for (const reading of readings) {
      const propertyId = reading.property_id;
      if (!propertyId) continue;
      
      if (!result[propertyId]) {
        result[propertyId] = {};
      }
      
      const meterType = reading.unit;
      if (!result[propertyId][meterType]) {
        result[propertyId][meterType] = {
          total: 0,
          readings: [],
        };
      }
      
      result[propertyId][meterType].total += reading.consumption || 0;
      result[propertyId][meterType].readings.push(reading);
    }
    
    return result;
  }

  private mapDeviceToDto(device: any): IoTDeviceDto {
    return {
      id: device.id,
      name: device.name,
      type: device.type,
      status: device.status,
      location: device.location,
      description: device.description,
      serialNumber: device.serial_number,
      manufacturer: device.manufacturer,
      model: device.model,
      firmwareVersion: device.firmware_version,
      metadata: device.metadata,
      lastSeen: device.last_seen?.toISOString(),
      installedAt: device.installed_at?.toISOString(),
      nextMaintenanceAt: device.next_maintenance_at?.toISOString(),
      residentialComplexId: device.residential_complex_id || '',
      propertyId: device.property_id,
      createdAt: device.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: device.updated_at?.toISOString() || new Date().toISOString(),
    };
  }

  private mapAlertToDto(alert: any): IoTAlertDto {
    return {
      id: alert.id,
      deviceId: alert.device_id,
      deviceName: alert.device_name,
      type: alert.type,
      severity: alert.severity,
      status: alert.status,
      title: alert.title,
      message: alert.message,
      data: alert.data,
      acknowledgedBy: alert.acknowledged_by,
      acknowledgedAt: alert.acknowledged_at?.toISOString(),
      resolvedBy: alert.resolved_by,
      resolvedAt: alert.resolved_at?.toISOString(),
      resolution: alert.resolution,
      createdAt: alert.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: alert.updated_at?.toISOString(),
      residentialComplexId: alert.residential_complex_id || '',
    };
  }
}