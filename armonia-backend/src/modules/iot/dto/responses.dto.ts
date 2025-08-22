import { DeviceStatus, DeviceType, UtilityType } from './create-device.dto';
import { AlertType, AlertSeverity, AlertStatus } from './alert.dto';
import { AnalyticsPeriod, ConsumptionTrend } from './analytics.dto';
import { ReadingSource } from './reading.dto';

export interface DeviceResponseDto {
  id: string;
  name: string;
  description?: string;
  type: DeviceType;
  serialNumber: string;
  manufacturer: string;
  model?: string;
  firmwareVersion?: string;
  status: DeviceStatus;
  location?: string;
  propertyId?: string;
  unitId?: string;
  utilityType?: UtilityType;
  isSmartMeter: boolean;
  capabilities?: Record<string, any>;
  configuration?: Record<string, any>;
  readingInterval?: number;
  alertsEnabled: boolean;
  thresholds?: Record<string, number>;
  lastReading?: number;
  lastReadingDate?: Date;
  lastCommunication?: Date;
  batteryLevel?: number;
  signalStrength?: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  totalReadings?: number;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones
  property?: {
    id: string;
    name: string;
    unitNumber?: string;
  };
  unit?: {
    id: string;
    unitNumber: string;
  };
  recentReadings?: ReadingResponseDto[];
  activeAlerts?: AlertResponseDto[];
}

export interface ReadingResponseDto {
  id: string;
  deviceId: string;
  utilityType: UtilityType;
  reading: number;
  previousReading?: number;
  consumption?: number;
  unit: string;
  cost?: number;
  readingDate: Date;
  source: ReadingSource;
  isAutomatic: boolean;
  metadata?: Record<string, any>;
  propertyId?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones
  device?: {
    id: string;
    name: string;
    type: DeviceType;
  };
  property?: {
    id: string;
    name: string;
  };
}

export interface SmartMeterReadingResponseDto {
  id: string;
  deviceId: string;
  value: number;
  unit: string;
  timestamp: Date;
  quality?: number;
  rawData?: Record<string, any>;
  source: ReadingSource;
  processed: boolean;
  createdAt: Date;
  // Relaciones
  device?: {
    id: string;
    name: string;
    type: DeviceType;
  };
}

export interface AlertResponseDto {
  id: string;
  deviceId: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  data?: Record<string, any>;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones
  device?: {
    id: string;
    name: string;
    type: DeviceType;
    location?: string;
  };
  acknowledgedByUser?: {
    id: string;
    name: string;
    email: string;
  };
  resolvedByUser?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AnalyticsResponseDto {
  id: string;
  propertyId: string;
  utilityType: UtilityType;
  period: AnalyticsPeriod;
  periodStart: Date;
  periodEnd: Date;
  totalConsumption: number;
  averageConsumption: number;
  peakConsumption: number;
  minConsumption: number;
  consumptionTrend: ConsumptionTrend;
  anomalyDetected: boolean;
  anomalyScore?: number;
  predictedConsumption?: number;
  costAnalysis?: Record<string, any>;
  recommendations?: Record<string, any>;
  comparisonData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  // Relaciones
  property?: {
    id: string;
    name: string;
    unitNumber?: string;
  };
  readings?: ReadingResponseDto[];
}

export interface DeviceListResponseDto {
  devices: DeviceResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalDevices: number;
    activeDevices: number;
    offlineDevices: number;
    devicesWithAlerts: number;
    smartMeters: number;
  };
}

export interface ReadingListResponseDto {
  readings: ReadingResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalReadings: number;
    totalConsumption: number;
    averageConsumption: number;
    lastReading?: ReadingResponseDto;
  };
}

export interface AlertListResponseDto {
  alerts: AlertResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalAlerts: number;
    activeAlerts: number;
    criticalAlerts: number;
    resolvedAlerts: number;
  };
}

export interface DashboardStatsResponseDto {
  devices: {
    total: number;
    active: number;
    offline: number;
    maintenance: number;
    withAlerts: number;
  };
  readings: {
    totalToday: number;
    totalThisMonth: number;
    averageDaily: number;
    lastReading?: Date;
  };
  consumption: {
    electricity: {
      current: number;
      previous: number;
      trend: string;
      unit: string;
    };
    water: {
      current: number;
      previous: number;
      trend: string;
      unit: string;
    };
    gas: {
      current: number;
      previous: number;
      trend: string;
      unit: string;
    };
  };
  alerts: {
    active: number;
    critical: number;
    resolved: number;
    newToday: number;
  };
  costs: {
    currentMonth: number;
    previousMonth: number;
    projected: number;
    savings: number;
  };
  recentActivity: {
    latestReadings: ReadingResponseDto[];
    recentAlerts: AlertResponseDto[];
    deviceChanges: any[];
  };
}

export interface ConsumptionAnalysisResponseDto {
  propertyId: string;
  utilityType: UtilityType;
  period: AnalyticsPeriod;
  analysis: {
    current: AnalyticsResponseDto;
    previous?: AnalyticsResponseDto;
    comparison: {
      consumptionChange: number;
      costChange: number;
      efficiencyChange: number;
      trend: ConsumptionTrend;
    };
  };
  recommendations: {
    priority: 'low' | 'medium' | 'high';
    category: string;
    title: string;
    description: string;
    potentialSavings: number;
    implementationCost: number;
    paybackPeriod: number;
  }[];
  forecasts: {
    nextPeriod: {
      predictedConsumption: number;
      predictedCost: number;
      confidence: number;
    };
    yearly: {
      predictedConsumption: number;
      predictedCost: number;
      confidence: number;
    };
  };
}