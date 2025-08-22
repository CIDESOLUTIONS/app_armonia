import {
  Injectable,
  Logger,
  OnModuleInit,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
  MonitoringMetricType,
  HealthCheckStatus,
  AlertThresholdType,
} from '../common/dto/monitoring.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as os from 'os';

@Injectable()
export class MonitoringService implements OnModuleInit {
  private readonly logger = new Logger(MonitoringService.name);
  private startTime = Date.now();
  private metrics = new Map<string, any[]>();
  private systemStats = {
    requestCount: 0,
    errorCount: 0,
    responseTimes: [] as number[],
  };

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    this.logger.log('Sistema de monitoreo inicializado');
    this.startHealthChecks();
  }

  // ========== HEALTH CHECKS ==========
  
  async getSystemHealth(): Promise<SystemHealthDto> {
    const checks = await this.runHealthChecks();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = os.loadavg()[0] / os.cpus().length * 100;
    
    const overall = this.determineOverallHealth(checks);
    
    return {
      overall,
      checks,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      memoryUsage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
      cpuUsage: Math.round(cpuUsage),
      diskUsage: await this.getDiskUsage(),
      responseTime: this.calculateResponseTimeStats(),
      lastUpdated: new Date().toISOString(),
    };
  }

  private async runHealthChecks(): Promise<SystemHealthDto['checks']> {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      s3: await this.checkS3(),
      emailService: await this.checkEmailService(),
      paymentGateway: await this.checkPaymentGateway(),
    };
    
    return checks;
  }

  private async checkDatabase(): Promise<HealthCheckStatus> {
    try {
      await this.prisma.user.findFirst({ take: 1 });
      return HealthCheckStatus.HEALTHY;
    } catch (error) {
      this.logger.error('Health check fallido - Database:', error);
      return HealthCheckStatus.UNHEALTHY;
    }
  }

  private async checkRedis(): Promise<HealthCheckStatus> {
    try {
      // Implementar verificación de Redis si está configurado
      return HealthCheckStatus.HEALTHY;
    } catch (error) {
      this.logger.error('Health check fallido - Redis:', error);
      return HealthCheckStatus.DEGRADED;
    }
  }

  private async checkS3(): Promise<HealthCheckStatus> {
    try {
      // Implementar verificación de S3
      return HealthCheckStatus.HEALTHY;
    } catch (error) {
      this.logger.error('Health check fallido - S3:', error);
      return HealthCheckStatus.DEGRADED;
    }
  }

  private async checkEmailService(): Promise<HealthCheckStatus> {
    try {
      // Implementar verificación del servicio de email
      return HealthCheckStatus.HEALTHY;
    } catch (error) {
      this.logger.error('Health check fallido - Email Service:', error);
      return HealthCheckStatus.DEGRADED;
    }
  }

  private async checkPaymentGateway(): Promise<HealthCheckStatus> {
    try {
      // Implementar verificación de pasarela de pago
      return HealthCheckStatus.HEALTHY;
    } catch (error) {
      this.logger.error('Health check fallido - Payment Gateway:', error);
      return HealthCheckStatus.DEGRADED;
    }
  }

  private determineOverallHealth(checks: SystemHealthDto['checks']): HealthCheckStatus {
    const statuses = Object.values(checks);
    
    if (statuses.some(status => status === HealthCheckStatus.UNHEALTHY)) {
      return HealthCheckStatus.UNHEALTHY;
    }
    if (statuses.some(status => status === HealthCheckStatus.DEGRADED)) {
      return HealthCheckStatus.DEGRADED;
    }
    if (statuses.every(status => status === HealthCheckStatus.HEALTHY)) {
      return HealthCheckStatus.HEALTHY;
    }
    return HealthCheckStatus.UNKNOWN;
  }

  private async getDiskUsage(): Promise<number> {
    try {
      const stats = await import('fs').then(fs => fs.promises.stat('.'));
      // This is a simplified implementation
      return Math.round(Math.random() * 100); // Placeholder
    } catch {
      return 0;
    }
  }

  private calculateResponseTimeStats(): SystemHealthDto['responseTime'] {
    if (this.systemStats.responseTimes.length === 0) {
      return { avg: 0, p95: 0, p99: 0 };
    }
    
    const sorted = [...this.systemStats.responseTimes].sort((a, b) => a - b);
    const avg = sorted.reduce((sum, time) => sum + time, 0) / sorted.length;
    const p95Index = Math.floor(sorted.length * 0.95);
    const p99Index = Math.floor(sorted.length * 0.99);
    
    return {
      avg: Math.round(avg),
      p95: sorted[p95Index] || 0,
      p99: sorted[p99Index] || 0,
    };
  }

  // ========== METRICS ==========
  
  async recordMetric(
    schemaName: string,
    data: CreateMetricDto,
  ): Promise<MetricDataPointDto> {
    try {
      const metricId = `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.prisma.$executeRaw`
        INSERT INTO metric_data_points (
          id, metric_name, type, value, tags, metadata, source, unit, schema_name
        ) VALUES (
          ${metricId}, ${data.metricName}, ${data.type}, ${data.value},
          ${JSON.stringify(data.tags || {})}, ${JSON.stringify(data.metadata || {})},
          ${data.source || 'api'}, ${data.unit || ''}, ${schemaName}
        )
      `;

      // Store in memory for quick access
      if (!this.metrics.has(data.metricName)) {
        this.metrics.set(data.metricName, []);
      }
      this.metrics.get(data.metricName)!.push({
        value: data.value,
        timestamp: new Date(),
      });

      // Check alerts for this metric
      await this.checkMetricAlerts(schemaName, data.metricName, data.value);

      return {
        id: metricId,
        metricName: data.metricName,
        type: data.type,
        value: data.value,
        tags: data.tags,
        metadata: data.metadata,
        timestamp: new Date().toISOString(),
        source: data.source || 'api',
        unit: data.unit,
        residentialComplexId: '',
      };
    } catch (error) {
      throw new BadRequestException('Error al registrar métrica: ' + error.message);
    }
  }

  async getMetrics(
    schemaName: string,
    filters: MetricsFilterDto,
  ): Promise<{ metrics: MetricDataPointDto[]; total: number }> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 100;
      const offset = (page - 1) * limit;

      let whereClause = `WHERE schema_name = '${schemaName}'`;
      
      if (filters.metricName) {
        whereClause += ` AND metric_name = '${filters.metricName}'`;
      }
      if (filters.type) {
        whereClause += ` AND type = '${filters.type}'`;
      }
      if (filters.source) {
        whereClause += ` AND source = '${filters.source}'`;
      }
      if (filters.startDate) {
        whereClause += ` AND timestamp >= '${filters.startDate}'`;
      }
      if (filters.endDate) {
        whereClause += ` AND timestamp <= '${filters.endDate}'`;
      }

      const metrics = await this.prisma.$queryRaw`
        SELECT * FROM metric_data_points ${whereClause}
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      ` as any[];

      const total = await this.prisma.$queryRaw`
        SELECT COUNT(*) as count FROM metric_data_points ${whereClause}
      ` as any[];

      return {
        metrics: metrics.map(metric => this.mapMetricToDto(metric)),
        total: Number(total[0]?.count || 0),
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener métricas: ' + error.message);
    }
  }

  // ========== ALERTS ==========
  
  async createAlert(
    schemaName: string,
    data: CreateMonitoringAlertDto,
  ): Promise<MonitoringAlertDto> {
    try {
      const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.prisma.$executeRaw`
        INSERT INTO monitoring_alerts (
          id, name, description, metric_name, threshold_type, threshold_value,
          threshold_value2, is_active, notification_channel, recipients,
          cooldown_period, schema_name
        ) VALUES (
          ${alertId}, ${data.name}, ${data.description}, ${data.metricName},
          ${data.thresholdType}, ${data.thresholdValue}, ${data.thresholdValue2 || null},
          true, ${data.notificationChannel || 'email'},
          ${JSON.stringify(data.recipients || [])}, ${data.cooldownPeriod || 15},
          ${schemaName}
        )
      `;

      this.logger.log(`Alerta de monitoreo creada: ${data.name}`);

      return {
        id: alertId,
        name: data.name,
        description: data.description,
        metricName: data.metricName,
        thresholdType: data.thresholdType,
        thresholdValue: data.thresholdValue,
        thresholdValue2: data.thresholdValue2,
        isActive: true,
        notificationChannel: data.notificationChannel,
        recipients: data.recipients,
        cooldownPeriod: data.cooldownPeriod,
        createdAt: new Date().toISOString(),
        residentialComplexId: '',
      };
    } catch (error) {
      throw new BadRequestException('Error al crear alerta: ' + error.message);
    }
  }

  async getAlerts(
    schemaName: string,
    isActive?: boolean,
  ): Promise<MonitoringAlertDto[]> {
    try {
      let whereClause = `WHERE schema_name = '${schemaName}'`;
      if (isActive !== undefined) {
        whereClause += ` AND is_active = ${isActive}`;
      }

      const alerts = await this.prisma.$queryRaw`
        SELECT * FROM monitoring_alerts ${whereClause}
        ORDER BY created_at DESC
      ` as any[];

      return alerts.map(alert => this.mapAlertToDto(alert));
    } catch (error) {
      throw new BadRequestException('Error al obtener alertas: ' + error.message);
    }
  }

  async updateAlert(
    schemaName: string,
    alertId: string,
    data: UpdateMonitoringAlertDto,
  ): Promise<MonitoringAlertDto> {
    try {
      const updateFields = [];
      const updateValues = [];

      if (data.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(data.name);
      }
      if (data.description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(data.description);
      }
      if (data.thresholdType !== undefined) {
        updateFields.push('threshold_type = ?');
        updateValues.push(data.thresholdType);
      }
      if (data.thresholdValue !== undefined) {
        updateFields.push('threshold_value = ?');
        updateValues.push(data.thresholdValue);
      }
      if (data.thresholdValue2 !== undefined) {
        updateFields.push('threshold_value2 = ?');
        updateValues.push(data.thresholdValue2);
      }
      if (data.isActive !== undefined) {
        updateFields.push('is_active = ?');
        updateValues.push(data.isActive);
      }
      if (data.notificationChannel !== undefined) {
        updateFields.push('notification_channel = ?');
        updateValues.push(data.notificationChannel);
      }
      if (data.recipients !== undefined) {
        updateFields.push('recipients = ?');
        updateValues.push(JSON.stringify(data.recipients));
      }
      if (data.cooldownPeriod !== undefined) {
        updateFields.push('cooldown_period = ?');
        updateValues.push(data.cooldownPeriod);
      }

      updateFields.push('updated_at = NOW()');

      await this.prisma.$executeRaw`
        UPDATE monitoring_alerts SET ${updateFields.join(', ')}
        WHERE id = ${alertId} AND schema_name = ${schemaName}
      `;

      const alerts = await this.prisma.$queryRaw`
        SELECT * FROM monitoring_alerts 
        WHERE id = ${alertId} AND schema_name = ${schemaName}
      ` as any[];

      if (!alerts.length) {
        throw new NotFoundException('Alerta no encontrada');
      }

      return this.mapAlertToDto(alerts[0]);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar alerta: ' + error.message);
    }
  }

  async deleteAlert(schemaName: string, alertId: string): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        DELETE FROM monitoring_alerts 
        WHERE id = ${alertId} AND schema_name = ${schemaName}
      `;

      this.logger.log(`Alerta de monitoreo eliminada: ${alertId}`);
    } catch (error) {
      throw new BadRequestException('Error al eliminar alerta: ' + error.message);
    }
  }

  // ========== LOGGING ==========
  
  async logEvent(
    schemaName: string,
    data: CreateLogEventDto,
  ): Promise<LogEventDto> {
    try {
      const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.prisma.$executeRaw`
        INSERT INTO log_events (
          id, level, message, category, user_id, session_id, context,
          metadata, stack_trace, source, schema_name
        ) VALUES (
          ${logId}, ${data.level}, ${data.message}, ${data.category || ''},
          ${data.userId || null}, ${data.sessionId || null},
          ${JSON.stringify(data.context || {})}, ${JSON.stringify(data.metadata || {})},
          ${data.stackTrace || null}, ${data.source || 'application'}, ${schemaName}
        )
      `;

      return {
        id: logId,
        level: data.level,
        message: data.message,
        category: data.category,
        userId: data.userId,
        sessionId: data.sessionId,
        context: data.context,
        metadata: data.metadata,
        stackTrace: data.stackTrace,
        timestamp: new Date().toISOString(),
        source: data.source || 'application',
        residentialComplexId: '',
      };
    } catch (error) {
      throw new BadRequestException('Error al registrar evento de log: ' + error.message);
    }
  }

  async getLogs(
    schemaName: string,
    filters: LogsFilterDto,
  ): Promise<{ logs: LogEventDto[]; total: number }> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const offset = (page - 1) * limit;

      let whereClause = `WHERE schema_name = '${schemaName}'`;
      
      if (filters.level) {
        whereClause += ` AND level = '${filters.level}'`;
      }
      if (filters.category) {
        whereClause += ` AND category = '${filters.category}'`;
      }
      if (filters.userId) {
        whereClause += ` AND user_id = '${filters.userId}'`;
      }
      if (filters.source) {
        whereClause += ` AND source = '${filters.source}'`;
      }
      if (filters.search) {
        whereClause += ` AND message ILIKE '%${filters.search}%'`;
      }
      if (filters.startDate) {
        whereClause += ` AND timestamp >= '${filters.startDate}'`;
      }
      if (filters.endDate) {
        whereClause += ` AND timestamp <= '${filters.endDate}'`;
      }

      const logs = await this.prisma.$queryRaw`
        SELECT * FROM log_events ${whereClause}
        ORDER BY timestamp ${filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}
        LIMIT ${limit} OFFSET ${offset}
      ` as any[];

      const total = await this.prisma.$queryRaw`
        SELECT COUNT(*) as count FROM log_events ${whereClause}
      ` as any[];

      return {
        logs: logs.map(log => this.mapLogToDto(log)),
        total: Number(total[0]?.count || 0),
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener logs: ' + error.message);
    }
  }

  // ========== DASHBOARD ==========
  
  async getDashboardData(schemaName: string): Promise<MonitoringDashboardDto> {
    try {
      const [systemHealth, keyMetrics, activeAlerts] = await Promise.all([
        this.getSystemHealth(),
        this.getKeyMetrics(schemaName),
        this.getActiveAlerts(schemaName),
      ]);

      return {
        systemHealth,
        keyMetrics,
        alerts: activeAlerts,
        recentEvents: await this.getRecentEvents(schemaName),
        performanceMetrics: {
          cpu: systemHealth.cpuUsage,
          memory: systemHealth.memoryUsage,
          disk: systemHealth.diskUsage,
          network: 85, // Placeholder
        },
        businessMetrics: await this.getBusinessMetrics(schemaName),
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener datos del dashboard: ' + error.message);
    }
  }

  // ========== SCHEDULED TASKS ==========
  
  @Cron(CronExpression.EVERY_5_MINUTES)
  private async runScheduledHealthChecks() {
    try {
      const health = await this.getSystemHealth();
      
      // Record system metrics
      await this.recordMetric('system', {
        metricName: 'system.health.overall',
        type: MonitoringMetricType.SYSTEM_HEALTH,
        value: health.overall === HealthCheckStatus.HEALTHY ? 1 : 0,
        source: 'system',
      });

      await this.recordMetric('system', {
        metricName: 'system.cpu.usage',
        type: MonitoringMetricType.PERFORMANCE,
        value: health.cpuUsage,
        unit: 'percentage',
        source: 'system',
      });

      await this.recordMetric('system', {
        metricName: 'system.memory.usage',
        type: MonitoringMetricType.PERFORMANCE,
        value: health.memoryUsage,
        unit: 'percentage',
        source: 'system',
      });
    } catch (error) {
      this.logger.error('Error en health checks programados:', error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  private async cleanupOldMetrics() {
    try {
      // Clean up metrics older than 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      await this.prisma.$executeRaw`
        DELETE FROM metric_data_points 
        WHERE timestamp < ${thirtyDaysAgo}
      `;

      // Clean up logs older than 90 days
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      
      await this.prisma.$executeRaw`
        DELETE FROM log_events 
        WHERE timestamp < ${ninetyDaysAgo}
      `;
    } catch (error) {
      this.logger.error('Error en limpieza de datos antiguos:', error);
    }
  }

  // ========== PRIVATE HELPER METHODS ==========
  
  private startHealthChecks() {
    // Initial health check
    this.runScheduledHealthChecks();
  }

  private async checkMetricAlerts(schemaName: string, metricName: string, value: number): Promise<void> {
    try {
      const alerts = await this.prisma.$queryRaw`
        SELECT * FROM monitoring_alerts 
        WHERE schema_name = ${schemaName} 
        AND metric_name = ${metricName} 
        AND is_active = true
      ` as any[];

      for (const alert of alerts) {
        const shouldTrigger = this.evaluateAlertThreshold(alert, value);
        
        if (shouldTrigger) {
          await this.triggerAlert(alert, value);
        }
      }
    } catch (error) {
      this.logger.error(`Error verificando alertas para métrica ${metricName}:`, error);
    }
  }

  private evaluateAlertThreshold(alert: any, value: number): boolean {
    switch (alert.threshold_type) {
      case AlertThresholdType.ABOVE:
        return value > alert.threshold_value;
      case AlertThresholdType.BELOW:
        return value < alert.threshold_value;
      case AlertThresholdType.EQUALS:
        return value === alert.threshold_value;
      case AlertThresholdType.BETWEEN:
        return alert.threshold_value2 
          ? value >= alert.threshold_value && value <= alert.threshold_value2
          : false;
      case AlertThresholdType.OUTSIDE:
        return alert.threshold_value2 
          ? value < alert.threshold_value || value > alert.threshold_value2
          : false;
      default:
        return false;
    }
  }

  private async triggerAlert(alert: any, value: number): Promise<void> {
    try {
      // Check cooldown period
      if (alert.last_triggered) {
        const lastTriggered = new Date(alert.last_triggered);
        const cooldownExpired = Date.now() - lastTriggered.getTime() > (alert.cooldown_period * 60 * 1000);
        
        if (!cooldownExpired) {
          return;
        }
      }

      // Update last triggered time
      await this.prisma.$executeRaw`
        UPDATE monitoring_alerts 
        SET last_triggered = NOW() 
        WHERE id = ${alert.id}
      `;

      // Log alert trigger
      this.logger.warn(`Alerta disparada: ${alert.name} - Valor: ${value}`);

      // Here you would implement notification sending (email, Slack, webhook, etc.)
      // await this.sendNotification(alert, value);
    } catch (error) {
      this.logger.error(`Error disparando alerta ${alert.id}:`, error);
    }
  }

  private async getKeyMetrics(schemaName: string): Promise<MonitoringDashboardDto['keyMetrics']> {
    try {
      // These would be real queries to get actual metrics
      return {
        totalUsers: 0,
        activeUsers24h: 0,
        totalTransactions: 0,
        errorRate: 0,
        avgResponseTime: 0,
      };
    } catch (error) {
      this.logger.error('Error obteniendo métricas clave:', error);
      return {
        totalUsers: 0,
        activeUsers24h: 0,
        totalTransactions: 0,
        errorRate: 0,
        avgResponseTime: 0,
      };
    }
  }

  private async getActiveAlerts(schemaName: string): Promise<MonitoringAlertDto[]> {
    try {
      return await this.getAlerts(schemaName, true);
    } catch (error) {
      this.logger.error('Error obteniendo alertas activas:', error);
      return [];
    }
  }

  private async getRecentEvents(schemaName: string): Promise<any[]> {
    try {
      const logs = await this.getLogs(schemaName, {
        level: 'error',
        limit: 10,
        sortOrder: 'desc',
      });
      return logs.logs;
    } catch (error) {
      this.logger.error('Error obteniendo eventos recientes:', error);
      return [];
    }
  }

  private async getBusinessMetrics(schemaName: string): Promise<MonitoringDashboardDto['businessMetrics']> {
    try {
      // These would be real business metric calculations
      return {
        totalRevenue: 0,
        monthlyRecurringRevenue: 0,
        paymentSuccessRate: 0,
        userGrowthRate: 0,
      };
    } catch (error) {
      this.logger.error('Error obteniendo métricas de negocio:', error);
      return {
        totalRevenue: 0,
        monthlyRecurringRevenue: 0,
        paymentSuccessRate: 0,
        userGrowthRate: 0,
      };
    }
  }

  private mapMetricToDto(metric: any): MetricDataPointDto {
    return {
      id: metric.id,
      metricName: metric.metric_name,
      type: metric.type,
      value: metric.value,
      tags: metric.tags,
      metadata: metric.metadata,
      timestamp: metric.timestamp?.toISOString() || new Date().toISOString(),
      source: metric.source,
      unit: metric.unit,
      residentialComplexId: metric.residential_complex_id || '',
    };
  }

  private mapAlertToDto(alert: any): MonitoringAlertDto {
    return {
      id: alert.id,
      name: alert.name,
      description: alert.description,
      metricName: alert.metric_name,
      thresholdType: alert.threshold_type,
      thresholdValue: alert.threshold_value,
      thresholdValue2: alert.threshold_value2,
      isActive: alert.is_active,
      notificationChannel: alert.notification_channel,
      recipients: alert.recipients,
      cooldownPeriod: alert.cooldown_period,
      lastTriggered: alert.last_triggered?.toISOString(),
      createdAt: alert.created_at?.toISOString() || new Date().toISOString(),
      residentialComplexId: alert.residential_complex_id || '',
    };
  }

  private mapLogToDto(log: any): LogEventDto {
    return {
      id: log.id,
      level: log.level,
      message: log.message,
      category: log.category,
      userId: log.user_id,
      sessionId: log.session_id,
      context: log.context,
      metadata: log.metadata,
      stackTrace: log.stack_trace,
      timestamp: log.timestamp?.toISOString() || new Date().toISOString(),
      source: log.source,
      residentialComplexId: log.residential_complex_id || '',
    };
  }

  // ========== PUBLIC UTILITY METHODS ==========
  
  recordResponseTime(responseTime: number): void {
    this.systemStats.responseTimes.push(responseTime);
    
    // Keep only last 1000 response times
    if (this.systemStats.responseTimes.length > 1000) {
      this.systemStats.responseTimes = this.systemStats.responseTimes.slice(-1000);
    }
  }

  incrementRequestCount(): void {
    this.systemStats.requestCount++;
  }

  incrementErrorCount(): void {
    this.systemStats.errorCount++;
  }
}