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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/user.decorator';
import { IotService } from './iot.service';
import { UtilityReadingService } from './utility-reading.service';
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
  UtilityReadingDto,
  CreateUtilityReadingDto,
  UtilityReadingFilterDto,
  ConsumptionAnalyticsDto,
  AnalyticsFilterDto,
  CreateAnalyticsDto,
  UtilityType,
  AnalyticsPeriod,
} from '../common/dto/iot.dto';

@UseGuards(JwtAuthGuard)
@Controller('iot')
export class IotController {
  constructor(
    private readonly iotService: IotService,
    private readonly utilityReadingService: UtilityReadingService,
  ) {}

  // ========== DASHBOARD ==========
  
  @Get('dashboard')
  async getDashboardStats(
    @GetUser() user: any,
  ): Promise<IoTDashboardStatsDto> {
    return this.iotService.getDashboardStats(user.schemaName);
  }

  // ========== DEVICE MANAGEMENT ==========
  
  @Post('devices')
  @UseGuards(RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
  async createDevice(
    @GetUser() user: any,
    @Body() deviceData: CreateIoTDeviceDto,
  ): Promise<IoTDeviceDto> {
    return this.iotService.createDevice(user.schemaName, deviceData);
  }

  @Get('devices')
  async getDevices(
    @GetUser() user: any,
    @Query() filters: DeviceFilterParamsDto,
  ): Promise<{ devices: IoTDeviceDto[]; total: number }> {
    return this.iotService.getDevices(user.schemaName, filters);
  }

  @Get('devices/:id')
  async getDeviceById(
    @GetUser() user: any,
    @Param('id') deviceId: string,
  ): Promise<IoTDeviceDto> {
    return this.iotService.getDeviceById(user.schemaName, deviceId);
  }

  @Put('devices/:id')
  @UseGuards(RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
  async updateDevice(
    @GetUser() user: any,
    @Param('id') deviceId: string,
    @Body() updateData: UpdateIoTDeviceDto,
  ): Promise<IoTDeviceDto> {
    return this.iotService.updateDevice(user.schemaName, deviceId, updateData);
  }

  @Delete('devices/:id')
  @UseGuards(RolesGuard([UserRole.ADMIN]))
  async deleteDevice(
    @GetUser() user: any,
    @Param('id') deviceId: string,
  ): Promise<void> {
    return this.iotService.deleteDevice(user.schemaName, deviceId);
  }

  // ========== TELEMETRY DATA ==========
  
  @Post('telemetry')
  async receiveTelemetryData(
    @GetUser() user: any,
    @Body() data: TelemetryDataDto,
  ): Promise<any> {
    return this.iotService.receiveTelemetryData(user.schemaName, data);
  }

  // Public endpoint for IoT devices to send data without authentication
  @Post('telemetry/public/:deviceId')
  async receivePublicTelemetryData(
    @Param('deviceId') deviceId: string,
    @Body() payload: any,
  ): Promise<any> {
    // This would typically use device authentication via API key
    // For now, we'll use a default schema
    const telemetryData: TelemetryDataDto = {
      deviceId,
      payload,
      timestamp: new Date().toISOString(),
      source: 'device',
    };
    
    return this.iotService.receiveTelemetryData('default', telemetryData);
  }

  // ========== SMART METER READINGS ==========
  
  @Post('meters/readings')
  async recordSmartMeterReading(
    @GetUser() user: any,
    @Body() data: SmartMeterReadingDto,
  ): Promise<SmartMeterReadingDto> {
    return this.iotService.recordSmartMeterReading(user.schemaName, data);
  }

  @Get('meters/readings')
  async getSmartMeterReadings(
    @GetUser() user: any,
    @Query() filters: SmartMeterFilterParamsDto,
  ): Promise<{ readings: SmartMeterReadingDto[]; total: number }> {
    return this.iotService.getSmartMeterReadings(user.schemaName, filters);
  }

  // ========== AUTOMATED BILLING ==========
  
  @Post('billing/automated')
  @UseGuards(RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
  async triggerAutomatedBilling(
    @GetUser() user: any,
    @Body() data: AutomatedBillingDto,
  ): Promise<any> {
    return this.iotService.triggerAutomatedBilling(user.schemaName, data);
  }

  // ========== ALERTS ==========
  
  @Get('alerts')
  async getAlerts(
    @GetUser() user: any,
    @Query() filters: AlertFilterParamsDto,
  ): Promise<{ alerts: IoTAlertDto[]; total: number }> {
    return this.iotService.getAlerts(user.schemaName, filters);
  }

  @Post('alerts/:id/acknowledge')
  async acknowledgeAlert(
    @GetUser() user: any,
    @Param('id') alertId: string,
    @Body() data: AcknowledgeAlertDto,
  ): Promise<IoTAlertDto> {
    return this.iotService.acknowledgeAlert(user.schemaName, alertId, {
      ...data,
      userId: user.userId,
    });
  }

  @Post('alerts/:id/resolve')
  @UseGuards(RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
  async resolveAlert(
    @GetUser() user: any,
    @Param('id') alertId: string,
    @Body() data: ResolveAlertDto,
  ): Promise<IoTAlertDto> {
    return this.iotService.resolveAlert(user.schemaName, alertId, {
      ...data,
      userId: user.userId,
    });
  }

// ========== UTILITY READINGS ==========
  
  @Post('utility-readings')
  @UseGuards(RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
  async createUtilityReading(
    @GetUser() user: any,
    @Body() data: CreateUtilityReadingDto,
  ): Promise<UtilityReadingDto> {
    return this.utilityReadingService.createReading(user.schemaName, data);
  }

  @Get('utility-readings')
  async getUtilityReadings(
    @GetUser() user: any,
    @Query() filters: UtilityReadingFilterDto,
  ): Promise<{ readings: UtilityReadingDto[]; total: number }> {
    return this.utilityReadingService.getReadings(user.schemaName, filters);
  }

  @Get('utility-readings/:id')
  async getUtilityReadingById(
    @GetUser() user: any,
    @Param('id') readingId: string,
  ): Promise<UtilityReadingDto> {
    return this.utilityReadingService.getReadingById(user.schemaName, readingId);
  }

  // ========== CONSUMPTION ANALYTICS ==========
  
  @Post('analytics')
  @UseGuards(RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
  async generateAnalytics(
    @GetUser() user: any,
    @Body() data: CreateAnalyticsDto,
  ): Promise<ConsumptionAnalyticsDto> {
    return this.utilityReadingService.generateAnalytics(user.schemaName, data);
  }

  @Get('analytics')
  async getConsumptionAnalytics(
    @GetUser() user: any,
    @Query() filters: AnalyticsFilterDto,
  ): Promise<{ analytics: ConsumptionAnalyticsDto[]; total: number }> {
    return this.utilityReadingService.getAnalytics(user.schemaName, filters);
  }

  @Get('analytics/reports/consumption')
  async getConsumptionReport(
    @GetUser() user: any,
    @Query('propertyId') propertyId: string,
    @Query('utilityType') utilityType: UtilityType,
    @Query('period') period: AnalyticsPeriod,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.utilityReadingService.getConsumptionReport(
      user.schemaName,
      propertyId,
      utilityType,
      period,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('analytics/predictive/:propertyId')
  async getPredictiveAnalysis(
    @GetUser() user: any,
    @Param('propertyId') propertyId: string,
    @Query('utilityType') utilityType: UtilityType,
  ): Promise<any> {
    return this.utilityReadingService.getPredictiveAnalysis(
      user.schemaName,
      propertyId,
      utilityType,
    );
  }

  // ========== ADVANCED ANALYTICS ==========
  
  @Get('analytics/consumption/trends')
  async getConsumptionTrends(
    @GetUser() user: any,
    @Query('period') period: string = '30d',
    @Query('groupBy') groupBy: string = 'day',
    @Query('propertyId') propertyId?: string,
  ): Promise<any> {
    // Implementación básica de tendencias de consumo
    const filters: AnalyticsFilterDto = {
      propertyId,
      period: period.includes('month') ? AnalyticsPeriod.MONTHLY : AnalyticsPeriod.DAILY,
    };
    
    const result = await this.utilityReadingService.getAnalytics(user.schemaName, filters);
    
    return {
      period,
      groupBy,
      trends: result.analytics.map(analytic => ({
        date: analytic.periodStart,
        consumption: analytic.totalConsumption,
        trend: analytic.consumptionTrend,
        anomalyDetected: analytic.anomalyDetected,
      })),
      summary: {
        totalAnalytics: result.total,
        anomaliesDetected: result.analytics.filter(a => a.anomalyDetected).length,
      },
    };
  }

  @Get('analytics/efficiency')
  async getEfficiencyMetrics(
    @GetUser() user: any,
    @Query('propertyId') propertyId?: string,
    @Query('utilityType') utilityType?: UtilityType,
  ): Promise<any> {
    const filters: AnalyticsFilterDto = {
      propertyId,
      utilityType,
      period: AnalyticsPeriod.MONTHLY,
    };
    
    const result = await this.utilityReadingService.getAnalytics(user.schemaName, filters);
    
    if (result.analytics.length === 0) {
      return {
        message: 'No hay datos suficientes para calcular métricas de eficiencia',
        propertyId,
        utilityType,
      };
    }
    
    const totalConsumption = result.analytics.reduce((sum, a) => sum + a.totalConsumption, 0);
    const averageEfficiency = result.analytics.reduce((sum, a) => sum + a.averageConsumption, 0) / result.analytics.length;
    const improvementOpportunities = result.analytics.filter(a => a.anomalyDetected).length;
    
    return {
      propertyId,
      utilityType,
      metrics: {
        totalConsumption,
        averageEfficiency,
        improvementOpportunities,
        efficiencyScore: Math.max(0, 100 - (improvementOpportunities * 10)),
      },
      recommendations: result.analytics[0]?.recommendations || {},
    };
  }
  
  // ========== MAINTENANCE ==========
  
  @Get('maintenance/schedule')
  async getMaintenanceSchedule(
    @GetUser() user: any,
    @Query('upcoming') upcoming: boolean = true,
  ): Promise<any> {
    // This would return maintenance schedules
    return {
      message: 'Cronograma de mantenimiento no implementado aún',
      upcoming,
    };
  }

  @Post('maintenance/:deviceId/schedule')
  @UseGuards(RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
  async scheduleMaintenanceDelivery(
    @GetUser() user: any,
    @Param('deviceId') deviceId: string,
    @Body() maintenanceData: any,
  ): Promise<any> {
    // This would schedule device maintenance
    return {
      message: 'Programación de mantenimiento no implementada aún',
      deviceId,
      maintenanceData,
    };
  }

  // ========== CONFIGURATION ==========
  
  @Get('config/thresholds')
  async getThresholdConfigurations(@GetUser() user: any): Promise<any> {
    // This would return threshold configurations
    return {
      message: 'Configuración de umbrales no implementada aún',
    };
  }

  @Post('config/thresholds')
  @UseGuards(RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
  async updateThresholdConfigurations(
    @GetUser() user: any,
    @Body() thresholds: any,
  ): Promise<any> {
    // This would update threshold configurations
    return {
      message: 'Actualización de umbrales no implementada aún',
      thresholds,
    };
  }

  @Get('config/rates')
  async getUtilityRates(@GetUser() user: any): Promise<any> {
    // This would return utility rates configuration
    return {
      message: 'Tarifas de servicios públicos no implementadas aún',
    };
  }

  @Post('config/rates')
  @UseGuards(RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
  async updateUtilityRates(
    @GetUser() user: any,
    @Body() rates: any,
  ): Promise<any> {
    // This would update utility rates
    return {
      message: 'Actualización de tarifas no implementada aún',
      rates,
    };
  }
}