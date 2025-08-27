import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@armonia-backend/common/guards/roles.guard';
import { Roles } from '@armonia-backend/common/decorators/roles.decorator';
import {
  DevicesService,
  ReadingsService,
  AlertsService,
  AnalyticsService,
} from './services';
import {
  CreateDeviceDto,
  UpdateDeviceDto,
  DeviceConfigDto,
  CreateReadingDto,
  SmartMeterReadingDto,
  BulkReadingDto,
  ReadingQueryDto,
  CreateAlertDto,
  UpdateAlertDto,
  AlertQueryDto,
  BulkAlertActionDto,
  AlertStatsDto,
  CreateAnalyticsDto,
  AnalyticsQueryDto,
  DashboardAnalyticsDto,
  ConsumptionComparisonDto,
  DeviceResponseDto,
  DeviceListResponseDto,
  ReadingResponseDto,
  ReadingListResponseDto,
  AlertResponseDto,
  AlertListResponseDto,
  AnalyticsResponseDto,
  ConsumptionAnalysisResponseDto,
  DashboardStatsResponseDto,
  DeviceType,
  UtilityType,
  AnalyticsPeriod,
} from './dto';

@ApiTags('IoT - Dispositivos y Medidores Inteligentes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('iot')
export class IoTController {
  private readonly logger = new Logger(IoTController.name);

  constructor(
    private readonly devicesService: DevicesService,
    private readonly readingsService: ReadingsService,
    private readonly alertsService: AlertsService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  // ============ DISPOSITIVOS ============

  @Post('devices')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Crear un nuevo dispositivo IoT' })
  @ApiResponse({ status: 201, description: 'Dispositivo creado exitosamente.' })
  async createDevice(
    @Body() createDeviceDto: CreateDeviceDto,
    @Request() req: any,
  ): Promise<DeviceResponseDto> {
    return this.devicesService.createDevice(
      createDeviceDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Get('devices')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Obtener lista de dispositivos IoT' })
  @ApiResponse({ status: 200, description: 'Lista de dispositivos obtenida exitosamente.' })
  async getDevices(
    @Query('type') type?: DeviceType,
    @Query('status') status?: string,
    @Query('propertyId') propertyId?: string,
    @Query('utilityType') utilityType?: UtilityType,
    @Query('isSmartMeter') isSmartMeter?: boolean,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Request() req: any,
  ): Promise<DeviceListResponseDto> {
    return this.devicesService.getDevices(
      req.user.residentialComplexId,
      req.user.schemaName,
      {
        type,
        status,
        propertyId,
        utilityType,
        isSmartMeter,
        search,
        page,
        limit,
      },
    );
  }

  @Get('devices/:deviceId')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Obtener un dispositivo por ID' })
  @ApiResponse({ status: 200, description: 'Dispositivo obtenido exitosamente.' })
  async getDeviceById(
    @Param('deviceId') deviceId: string,
    @Query('includeReadings') includeReadings?: boolean,
    @Request() req: any,
  ): Promise<DeviceResponseDto> {
    return this.devicesService.getDeviceById(
      deviceId,
      req.user.residentialComplexId,
      req.user.schemaName,
      includeReadings,
    );
  }

  @Put('devices/:deviceId')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Actualizar un dispositivo' })
  @ApiResponse({ status: 200, description: 'Dispositivo actualizado exitosamente.' })
  async updateDevice(
    @Param('deviceId') deviceId: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @Request() req: any,
  ): Promise<DeviceResponseDto> {
    return this.devicesService.updateDevice(
      deviceId,
      updateDeviceDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Delete('devices/:deviceId')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Eliminar un dispositivo' })
  @ApiResponse({ status: 200, description: 'Dispositivo eliminado exitosamente.' })
  async deleteDevice(
    @Param('deviceId') deviceId: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    return this.devicesService.deleteDevice(
      deviceId,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Post('devices/:deviceId/configure')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Configurar un dispositivo' })
  @ApiResponse({ status: 200, description: 'Configuración aplicada exitosamente.' })
  async configureDevice(
    @Param('deviceId') deviceId: string,
    @Body() configDto: DeviceConfigDto,
    @Request() req: any,
  ): Promise<{ message: string }> {
    return this.devicesService.configureDevice(
      deviceId,
      configDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Get('devices/:deviceId/config')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Obtener configuración de un dispositivo' })
  @ApiResponse({ status: 200, description: 'Configuración obtenida exitosamente.' })
  async getDeviceConfig(
    @Param('deviceId') deviceId: string,
    @Request() req: any,
  ): Promise<any[]> {
    return this.devicesService.getDeviceConfig(
      deviceId,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  // ============ LECTURAS ============

  @Post('readings')
  @Roles('ADMIN', 'MANAGER', 'DEVICE_API')
  @ApiOperation({ summary: 'Crear una nueva lectura de medidor' })
  @ApiResponse({ status: 201, description: 'Lectura creada exitosamente.' })
  async createReading(
    @Body() createReadingDto: CreateReadingDto,
    @Request() req: any,
  ): Promise<ReadingResponseDto> {
    return this.readingsService.createReading(
      createReadingDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Post('readings/smart-meter')
  @Roles('ADMIN', 'MANAGER', 'DEVICE_API')
  @ApiOperation({ summary: 'Crear lectura de medidor inteligente' })
  @ApiResponse({ status: 201, description: 'Lectura de medidor inteligente creada exitosamente.' })
  async createSmartMeterReading(
    @Body() readingDto: SmartMeterReadingDto,
    @Request() req: any,
  ) {
    return this.readingsService.createSmartMeterReading(
      readingDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Post('readings/bulk')
  @Roles('ADMIN', 'MANAGER', 'DEVICE_API')
  @ApiOperation({ summary: 'Crear múltiples lecturas en lote' })
  @ApiResponse({ status: 201, description: 'Lecturas en lote procesadas exitosamente.' })
  async createBulkReadings(
    @Body() bulkReadingDto: BulkReadingDto,
    @Request() req: any,
  ): Promise<{ created: number; errors: string[] }> {
    return this.readingsService.createBulkReadings(
      bulkReadingDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Get('readings')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Obtener lecturas con filtros' })
  @ApiResponse({ status: 200, description: 'Lecturas obtenidas exitosamente.' })
  async getReadings(
    @Query() queryDto: ReadingQueryDto,
    @Request() req: any,
  ): Promise<ReadingListResponseDto> {
    return this.readingsService.getReadings(
      queryDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Get('readings/smart-meter/:deviceId')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Obtener lecturas de medidor inteligente' })
  @ApiResponse({ status: 200, description: 'Lecturas de medidor inteligente obtenidas exitosamente.' })
  async getSmartMeterReadings(
    @Param('deviceId') deviceId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('processed') processed?: boolean,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Request() req: any,
  ) {
    return this.readingsService.getSmartMeterReadings(
      deviceId,
      req.user.residentialComplexId,
      req.user.schemaName,
      {
        startDate,
        endDate,
        processed,
        page,
        limit,
      },
    );
  }

  @Post('readings/smart-meter/:deviceId/process')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Procesar lecturas de medidores inteligentes pendientes' })
  @ApiResponse({ status: 200, description: 'Lecturas procesadas exitosamente.' })
  async processSmartMeterReadings(
    @Param('deviceId') deviceId: string,
    @Request() req: any,
  ): Promise<{ processed: number }> {
    return this.readingsService.processSmartMeterReadings(
      deviceId,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  // ============ ALERTAS ============

  @Post('alerts')
  @Roles('ADMIN', 'MANAGER', 'SYSTEM')
  @ApiOperation({ summary: 'Crear una nueva alerta' })
  @ApiResponse({ status: 201, description: 'Alerta creada exitosamente.' })
  async createAlert(
    @Body() createAlertDto: CreateAlertDto,
    @Request() req: any,
  ): Promise<AlertResponseDto> {
    return this.alertsService.createAlert(
      createAlertDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Get('alerts')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Obtener alertas con filtros' })
  @ApiResponse({ status: 200, description: 'Alertas obtenidas exitosamente.' })
  async getAlerts(
    @Query() queryDto: AlertQueryDto,
    @Request() req: any,
  ): Promise<AlertListResponseDto> {
    return this.alertsService.getAlerts(
      queryDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Get('alerts/:alertId')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Obtener una alerta por ID' })
  @ApiResponse({ status: 200, description: 'Alerta obtenida exitosamente.' })
  async getAlertById(
    @Param('alertId') alertId: string,
    @Request() req: any,
  ): Promise<AlertResponseDto> {
    return this.alertsService.getAlertById(
      alertId,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Put('alerts/:alertId')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Actualizar una alerta' })
  @ApiResponse({ status: 200, description: 'Alerta actualizada exitosamente.' })
  async updateAlert(
    @Param('alertId') alertId: string,
    @Body() updateAlertDto: UpdateAlertDto,
    @Request() req: any,
  ): Promise<AlertResponseDto> {
    return this.alertsService.updateAlert(
      alertId,
      updateAlertDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Post('alerts/:alertId/acknowledge')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Reconocer una alerta' })
  @ApiResponse({ status: 200, description: 'Alerta reconocida exitosamente.' })
  async acknowledgeAlert(
    @Param('alertId') alertId: string,
    @Request() req: any,
  ): Promise<AlertResponseDto> {
    return this.alertsService.acknowledgeAlert(
      alertId,
      req.user.id,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Post('alerts/:alertId/resolve')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Resolver una alerta' })
  @ApiResponse({ status: 200, description: 'Alerta resuelta exitosamente.' })
  async resolveAlert(
    @Param('alertId') alertId: string,
    @Body('resolution') resolution: string,
    @Request() req: any,
  ): Promise<AlertResponseDto> {
    return this.alertsService.resolveAlert(
      alertId,
      req.user.id,
      resolution,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Post('alerts/bulk-action')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Realizar acción en lote sobre alertas' })
  @ApiResponse({ status: 200, description: 'Acción en lote aplicada exitosamente.' })
  async bulkAlertAction(
    @Body() bulkActionDto: BulkAlertActionDto,
    @Request() req: any,
  ): Promise<{ updated: number; errors: string[] }> {
    return this.alertsService.bulkAlertAction(
      { ...bulkActionDto, userId: req.user.id },
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Get('alerts/stats')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Obtener estadísticas de alertas' })
  @ApiResponse({ status: 200, description: 'Estadísticas de alertas obtenidas exitosamente.' })
  async getAlertsStats(
    @Query() statsDto: AlertStatsDto,
    @Request() req: any,
  ): Promise<any> {
    return this.alertsService.getAlertsStats(
      statsDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  // ============ ANÁLISIS Y ANALYTICS ============

  @Post('analytics')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Crear análisis de consumo' })
  @ApiResponse({ status: 201, description: 'Análisis creado exitosamente.' })
  async createAnalytics(
    @Body() createAnalyticsDto: CreateAnalyticsDto,
    @Request() req: any,
  ): Promise<AnalyticsResponseDto> {
    return this.analyticsService.createAnalytics(
      createAnalyticsDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Get('analytics')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Obtener análisis con filtros' })
  @ApiResponse({ status: 200, description: 'Análisis obtenidos exitosamente.' })
  async getAnalytics(
    @Query() queryDto: AnalyticsQueryDto,
    @Request() req: any,
  ) {
    return this.analyticsService.getAnalytics(
      queryDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Get('analytics/dashboard')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Obtener análisis para dashboard' })
  @ApiResponse({ status: 200, description: 'Análisis de dashboard obtenidos exitosamente.' })
  async getDashboardAnalytics(
    @Query() dashboardDto: DashboardAnalyticsDto,
    @Request() req: any,
  ) {
    return this.analyticsService.getDashboardAnalytics(
      dashboardDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Post('analytics/comparison')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Generar comparación de consumo' })
  @ApiResponse({ status: 200, description: 'Comparación de consumo generada exitosamente.' })
  async getConsumptionComparison(
    @Body() comparisonDto: ConsumptionComparisonDto,
    @Request() req: any,
  ): Promise<ConsumptionAnalysisResponseDto> {
    return this.analyticsService.getConsumptionComparison(
      comparisonDto,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  @Post('analytics/generate/:propertyId')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Generar análisis automático' })
  @ApiResponse({ status: 201, description: 'Análisis automático generado exitosamente.' })
  async generateAutomaticAnalysis(
    @Param('propertyId') propertyId: string,
    @Query('utilityType') utilityType: UtilityType,
    @Query('period') period: AnalyticsPeriod,
    @Request() req: any,
  ): Promise<AnalyticsResponseDto> {
    return this.analyticsService.generateAutomaticAnalysis(
      propertyId,
      utilityType,
      period,
      req.user.residentialComplexId,
      req.user.schemaName,
    );
  }

  // ============ DASHBOARD Y ESTADÍSTICAS ============

  @Get('dashboard/stats')
  @Roles('ADMIN', 'MANAGER', 'RESIDENT')
  @ApiOperation({ summary: 'Obtener estadísticas del dashboard IoT' })
  @ApiResponse({ status: 200, description: 'Estadísticas del dashboard obtenidas exitosamente.' })
  async getDashboardStats(
    @Query('propertyId') propertyId?: string,
    @Request() req: any,
  ): Promise<DashboardStatsResponseDto> {
    try {
      // Obtener estadísticas de dispositivos
      const devicesStats = await this.devicesService.getDevices(
        req.user.residentialComplexId,
        req.user.schemaName,
        { propertyId }
      );

      // Obtener lecturas recientes
      const recentReadings = await this.readingsService.getReadings(
        { propertyId, limit: 10, sortBy: 'readingDate', sortOrder: 'desc' },
        req.user.residentialComplexId,
        req.user.schemaName,
      );

      // Obtener alertas activas
      const activeAlerts = await this.alertsService.getAlerts(
        { propertyId, status: 'ACTIVE', limit: 5 },
        req.user.residentialComplexId,
        req.user.schemaName,
      );

      // Calcular estadísticas de consumo (simplificado)
      const consumptionStats = {
        electricity: {
          current: recentReadings.summary.totalConsumption || 0,
          previous: 0, // Se calcularía con datos históricos
          trend: 'stable',
          unit: 'kWh',
        },
        water: {
          current: 0,
          previous: 0,
          trend: 'stable',
          unit: 'm3',
        },
        gas: {
          current: 0,
          previous: 0,
          trend: 'stable',
          unit: 'm3',
        },
      };

      return {
        devices: {
          total: devicesStats.summary.totalDevices,
          active: devicesStats.summary.activeDevices,
          offline: devicesStats.summary.offlineDevices,
          maintenance: 0, // Se calcularía desde la base de datos
          withAlerts: devicesStats.summary.devicesWithAlerts,
        },
        readings: {
          totalToday: 0, // Se calcularía con filtro de fecha
          totalThisMonth: recentReadings.summary.totalReadings,
          averageDaily: recentReadings.summary.averageConsumption,
          lastReading: recentReadings.summary.lastReading?.readingDate,
        },
        consumption: consumptionStats,
        alerts: {
          active: activeAlerts.summary.activeAlerts,
          critical: activeAlerts.summary.criticalAlerts,
          resolved: activeAlerts.summary.resolvedAlerts,
          newToday: 0, // Se calcularía con filtro de fecha
        },
        costs: {
          currentMonth: 0, // Se calcularía con datos de facturación
          previousMonth: 0,
          projected: 0,
          savings: 0,
        },
        recentActivity: {
          latestReadings: recentReadings.readings.slice(0, 5),
          recentAlerts: activeAlerts.alerts.slice(0, 5),
          deviceChanges: [], // Se implementaría con log de cambios
        },
      };
    } catch (error) {
      this.logger.error(`Error obteniendo estadísticas del dashboard: ${error.message}`);
      throw error;
    }
  }

  // ============ INTEGRACIÓN CON DISPOSITIVOS ============

  @Post('devices/:deviceId/connectivity')
  @Roles('ADMIN', 'MANAGER', 'DEVICE_API')
  @ApiOperation({ summary: 'Actualizar estado de conectividad de dispositivo' })
  @ApiResponse({ status: 200, description: 'Estado de conectividad actualizado exitosamente.' })
  @HttpCode(HttpStatus.OK)
  async updateDeviceConnectivity(
    @Param('deviceId') deviceId: string,
    @Body('isOnline') isOnline: boolean,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.devicesService.updateDeviceConnectivity(
      deviceId,
      isOnline,
      req.user.residentialComplexId,
      req.user.schemaName,
    );

    return { message: 'Estado de conectividad actualizado exitosamente' };
  }

  @Post('devices/:deviceId/heartbeat')
  @Roles('DEVICE_API')
  @ApiOperation({ summary: 'Recibir heartbeat de dispositivo' })
  @ApiResponse({ status: 200, description: 'Heartbeat recibido exitosamente.' })
  @HttpCode(HttpStatus.OK)
  async deviceHeartbeat(
    @Param('deviceId') deviceId: string,
    @Body() heartbeatData: any,
    @Request() req: any,
  ): Promise<{ message: string; timestamp: Date }> {
    // Actualizar última comunicación
    await this.devicesService.updateDeviceConnectivity(
      deviceId,
      true,
      req.user.residentialComplexId,
      req.user.schemaName,
    );

    // Si el heartbeat incluye datos de lectura, procesarlos
    if (heartbeatData.reading) {
      try {
        await this.readingsService.createSmartMeterReading(
          {
            deviceId,
            value: heartbeatData.reading.value,
            unit: heartbeatData.reading.unit,
            timestamp: heartbeatData.reading.timestamp || new Date().toISOString(),
            quality: heartbeatData.reading.quality,
            rawData: heartbeatData,
          },
          req.user.residentialComplexId,
          req.user.schemaName,
        );
      } catch (error) {
        this.logger.warn(`Error procesando lectura en heartbeat: ${error.message}`);
      }
    }

    return {
      message: 'Heartbeat procesado exitosamente',
      timestamp: new Date(),
    };
  }
}
