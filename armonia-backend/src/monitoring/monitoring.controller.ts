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
import { MonitoringService } from './monitoring.service';
import {
  SystemHealthDto,
  MetricDataPointDto,
  MonitoringAlertDto,
  CreateMetricDto,
  CreateMonitoringAlertDto,
  UpdateMonitoringAlertDto,
  MetricsFilterDto,
  MonitoringDashboardDto,
  LogEventDto,
  CreateLogEventDto,
  LogsFilterDto,
} from '../common/dto/monitoring.dto';

@UseGuards(JwtAuthGuard)
@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  // ========== DASHBOARD ==========
  
  @Get('dashboard')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getDashboard(
    @GetUser() user: any,
  ): Promise<MonitoringDashboardDto> {
    return this.monitoringService.getDashboardData(user.schemaName);
  }

  // ========== SYSTEM HEALTH ==========
  
  @Get('health')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getSystemHealth(): Promise<SystemHealthDto> {
    return this.monitoringService.getSystemHealth();
  }

  @Get('health/ping')
  async ping(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  // ========== METRICS ==========
  
  @Post('metrics')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async recordMetric(
    @GetUser() user: any,
    @Body() data: CreateMetricDto,
  ): Promise<MetricDataPointDto> {
    return this.monitoringService.recordMetric(user.schemaName, data);
  }

  @Get('metrics')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getMetrics(
    @GetUser() user: any,
    @Query() filters: MetricsFilterDto,
  ): Promise<{ metrics: MetricDataPointDto[]; total: number }> {
    return this.monitoringService.getMetrics(user.schemaName, filters);
  }

  // Public endpoint for system metrics collection
  @Post('metrics/system')
  async recordSystemMetric(
    @Body() data: CreateMetricDto,
  ): Promise<{ message: string }> {
    // This would typically be called by monitoring agents
    await this.monitoringService.recordMetric('system', data);
    return { message: 'Métrica registrada exitosamente' };
  }

  // ========== ALERTS ==========
  
  @Post('alerts')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async createAlert(
    @GetUser() user: any,
    @Body() data: CreateMonitoringAlertDto,
  ): Promise<MonitoringAlertDto> {
    return this.monitoringService.createAlert(user.schemaName, data);
  }

  @Get('alerts')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getAlerts(
    @GetUser() user: any,
    @Query('active') active?: string,
  ): Promise<MonitoringAlertDto[]> {
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    return this.monitoringService.getAlerts(user.schemaName, isActive);
  }

  @Put('alerts/:id')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async updateAlert(
    @GetUser() user: any,
    @Param('id') alertId: string,
    @Body() data: UpdateMonitoringAlertDto,
  ): Promise<MonitoringAlertDto> {
    return this.monitoringService.updateAlert(user.schemaName, alertId, data);
  }

  @Delete('alerts/:id')
  @UseGuards(RolesGuard([UserRole.ADMIN]))
  async deleteAlert(
    @GetUser() user: any,
    @Param('id') alertId: string,
  ): Promise<void> {
    return this.monitoringService.deleteAlert(user.schemaName, alertId);
  }

  // ========== LOGGING ==========
  
  @Post('logs')
  async logEvent(
    @GetUser() user: any,
    @Body() data: CreateLogEventDto,
  ): Promise<LogEventDto> {
    return this.monitoringService.logEvent(user.schemaName, data);
  }

  @Get('logs')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getLogs(
    @GetUser() user: any,
    @Query() filters: LogsFilterDto,
  ): Promise<{ logs: LogEventDto[]; total: number }> {
    return this.monitoringService.getLogs(user.schemaName, filters);
  }

  // Public endpoint for log collection from external services
  @Post('logs/external')
  async logExternalEvent(
    @Body() data: CreateLogEventDto & { apiKey: string },
  ): Promise<{ message: string }> {
    // Verify API key and log event
    // For now, we'll use a default schema
    await this.monitoringService.logEvent('default', data);
    return { message: 'Evento registrado exitosamente' };
  }

  // ========== ANALYTICS ==========
  
  @Get('analytics/errors')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getErrorAnalytics(
    @GetUser() user: any,
    @Query('period') period: string = '24h',
  ): Promise<any> {
    // This would return error analytics
    return {
      message: 'Análisis de errores no implementado aún',
      period,
    };
  }

  @Get('analytics/performance')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getPerformanceAnalytics(
    @GetUser() user: any,
    @Query('period') period: string = '24h',
  ): Promise<any> {
    // This would return performance analytics
    return {
      message: 'Análisis de rendimiento no implementado aún',
      period,
    };
  }

  @Get('analytics/usage')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getUsageAnalytics(
    @GetUser() user: any,
    @Query('period') period: string = '24h',
  ): Promise<any> {
    // This would return usage analytics
    return {
      message: 'Análisis de uso no implementado aún',
      period,
    };
  }

  // ========== REPORTS ==========
  
  @Get('reports/system')
  @UseGuards(RolesGuard([UserRole.ADMIN]))
  async getSystemReport(
    @GetUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    // This would generate a comprehensive system report
    return {
      message: 'Reporte del sistema no implementado aún',
      period: { startDate, endDate },
    };
  }

  @Get('reports/uptime')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getUptimeReport(
    @GetUser() user: any,
    @Query('period') period: string = '30d',
  ): Promise<any> {
    // This would return uptime statistics
    return {
      message: 'Reporte de tiempo activo no implementado aún',
      period,
    };
  }

  @Get('reports/alerts')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getAlertsReport(
    @GetUser() user: any,
    @Query('period') period: string = '30d',
  ): Promise<any> {
    // This would return alert statistics and trends
    return {
      message: 'Reporte de alertas no implementado aún',
      period,
    };
  }
}