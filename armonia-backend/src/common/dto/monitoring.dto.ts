import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MonitoringMetricType {
  SYSTEM_HEALTH = 'SYSTEM_HEALTH',
  PERFORMANCE = 'PERFORMANCE',
  USER_ACTIVITY = 'USER_ACTIVITY',
  BUSINESS = 'BUSINESS',
  SECURITY = 'SECURITY',
  ERROR = 'ERROR',
  CUSTOM = 'CUSTOM',
}

export enum HealthCheckStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  UNHEALTHY = 'UNHEALTHY',
  UNKNOWN = 'UNKNOWN',
}

export enum AlertThresholdType {
  ABOVE = 'ABOVE',
  BELOW = 'BELOW',
  EQUALS = 'EQUALS',
  BETWEEN = 'BETWEEN',
  OUTSIDE = 'OUTSIDE',
}

export class SystemHealthDto {
  @IsEnum(HealthCheckStatus)
  overall: HealthCheckStatus;

  @IsObject()
  checks: {
    database: HealthCheckStatus;
    redis: HealthCheckStatus;
    s3: HealthCheckStatus;
    emailService: HealthCheckStatus;
    paymentGateway: HealthCheckStatus;
  };

  @IsNumber()
  uptime: number; // seconds

  @IsNumber()
  memoryUsage: number; // percentage

  @IsNumber()
  cpuUsage: number; // percentage

  @IsNumber()
  diskUsage: number; // percentage

  @IsObject()
  responseTime: {
    avg: number;
    p95: number;
    p99: number;
  };

  @IsDateString()
  lastUpdated: string;
}

export class MetricDataPointDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  metricName: string;

  @IsEnum(MonitoringMetricType)
  type: MonitoringMetricType;

  @IsNumber()
  value: number;

  @IsObject()
  @IsOptional()
  tags?: { [key: string]: string };

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsDateString()
  timestamp: string;

  @IsString()
  source: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  residentialComplexId: string;
}

export class MonitoringAlertDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  metricName: string;

  @IsEnum(AlertThresholdType)
  thresholdType: AlertThresholdType;

  @IsNumber()
  thresholdValue: number;

  @IsNumber()
  @IsOptional()
  thresholdValue2?: number; // For BETWEEN/OUTSIDE comparisons

  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsOptional()
  notificationChannel?: string; // email, slack, webhook

  @IsArray()
  @IsOptional()
  recipients?: string[];

  @IsNumber()
  @IsOptional()
  cooldownPeriod?: number; // minutes

  @IsDateString()
  @IsOptional()
  lastTriggered?: string;

  @IsDateString()
  createdAt: string;

  @IsString()
  residentialComplexId: string;
}

export class CreateMetricDto {
  @IsString()
  metricName: string;

  @IsEnum(MonitoringMetricType)
  type: MonitoringMetricType;

  @IsNumber()
  value: number;

  @IsObject()
  @IsOptional()
  tags?: { [key: string]: string };

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  unit?: string;
}

export class CreateMonitoringAlertDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  metricName: string;

  @IsEnum(AlertThresholdType)
  thresholdType: AlertThresholdType;

  @IsNumber()
  thresholdValue: number;

  @IsNumber()
  @IsOptional()
  thresholdValue2?: number;

  @IsString()
  @IsOptional()
  notificationChannel?: string;

  @IsArray()
  @IsOptional()
  recipients?: string[];

  @IsNumber()
  @IsOptional()
  cooldownPeriod?: number;
}

export class UpdateMonitoringAlertDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(AlertThresholdType)
  @IsOptional()
  thresholdType?: AlertThresholdType;

  @IsNumber()
  @IsOptional()
  thresholdValue?: number;

  @IsNumber()
  @IsOptional()
  thresholdValue2?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notificationChannel?: string;

  @IsArray()
  @IsOptional()
  recipients?: string[];

  @IsNumber()
  @IsOptional()
  cooldownPeriod?: number;
}

export class MetricsFilterDto {
  @IsOptional()
  @IsString()
  metricName?: string;

  @IsOptional()
  @IsEnum(MonitoringMetricType)
  type?: MonitoringMetricType;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsObject()
  tags?: { [key: string]: string };

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 100;

  @IsOptional()
  @IsString()
  groupBy?: string; // time interval: 1m, 5m, 15m, 1h, 1d

  @IsOptional()
  @IsString()
  aggregation?: 'avg' | 'sum' | 'min' | 'max' | 'count';
}

export class MonitoringDashboardDto {
  @IsObject()
  systemHealth: SystemHealthDto;

  @IsObject()
  keyMetrics: {
    totalUsers: number;
    activeUsers24h: number;
    totalTransactions: number;
    errorRate: number;
    avgResponseTime: number;
  };

  @IsArray()
  alerts: MonitoringAlertDto[];

  @IsArray()
  recentEvents: any[];

  @IsObject()
  performanceMetrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };

  @IsObject()
  businessMetrics: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    paymentSuccessRate: number;
    userGrowthRate: number;
  };
}

export class LogEventDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsObject()
  @IsOptional()
  context?: any;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsString()
  @IsOptional()
  stackTrace?: string;

  @IsDateString()
  timestamp: string;

  @IsString()
  source: string;

  @IsString()
  residentialComplexId: string;
}

export class CreateLogEventDto {
  @IsString()
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsObject()
  @IsOptional()
  context?: any;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsString()
  @IsOptional()
  stackTrace?: string;

  @IsString()
  @IsOptional()
  source?: string;
}

export class LogsFilterDto {
  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 50;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}