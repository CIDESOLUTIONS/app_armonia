import { fetchApi } from "@/lib/api";

// ========== INTERFACES ==========

export enum IoTDeviceType {
  SMART_METER = 'SMART_METER',
  CAMERA = 'CAMERA',
  SENSOR = 'SENSOR',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  THERMOSTAT = 'THERMOSTAT',
  SMOKE_DETECTOR = 'SMOKE_DETECTOR',
  WATER_LEAK_SENSOR = 'WATER_LEAK_SENSOR',
  MOTION_SENSOR = 'MOTION_SENSOR',
  OTHER = 'OTHER',
}

export enum IoTDeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
}

export enum SmartMeterUnit {
  KWH = 'kWh',
  M3 = 'm3',
  LITERS = 'liters',
  GALLONS = 'gallons',
  OTHER = 'other',
}

export enum AlertType {
  CONSUMPTION_SPIKE = 'CONSUMPTION_SPIKE',
  DEVICE_OFFLINE = 'DEVICE_OFFLINE',
  THRESHOLD_EXCEEDED = 'THRESHOLD_EXCEEDED',
  MAINTENANCE_DUE = 'MAINTENANCE_DUE',
  SECURITY_BREACH = 'SECURITY_BREACH',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  OTHER = 'OTHER',
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export interface IoTDevice {
  id: string;
  name: string;
  type: IoTDeviceType;
  status: IoTDeviceStatus;
  location: string;
  description?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  firmwareVersion?: string;
  metadata?: any;
  lastSeen?: string;
  installedAt?: string;
  nextMaintenanceAt?: string;
  residentialComplexId: string;
  propertyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIoTDevice {
  name: string;
  type: IoTDeviceType;
  location: string;
  description?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  firmwareVersion?: string;
  metadata?: any;
  installedAt?: string;
  nextMaintenanceAt?: string;
  propertyId?: string;
}

export interface UpdateIoTDevice {
  name?: string;
  status?: IoTDeviceStatus;
  location?: string;
  description?: string;
  firmwareVersion?: string;
  metadata?: any;
  nextMaintenanceAt?: string;
  propertyId?: string;
}

export interface SmartMeterReading {
  id?: string;
  deviceId: string;
  meterId: string;
  propertyId: string;
  reading: number;
  previousReading?: number;
  unit: SmartMeterUnit;
  timestamp: string;
  residentialComplexId: string;
  additionalData?: any;
  isAutomatic?: boolean;
  source?: string;
  consumption?: number;
  cost?: number;
}

export interface TelemetryData {
  deviceId: string;
  dataType?: string;
  payload: any;
  timestamp: string;
  metadata?: any;
  source?: string;
  processed?: boolean;
}

export interface IoTAlert {
  id?: string;
  deviceId: string;
  deviceName?: string;
  type: AlertType;
  severity: AlertSeverity;
  status?: AlertStatus;
  title: string;
  message: string;
  data?: any;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
  updatedAt?: string;
  residentialComplexId: string;
}

export interface AutomatedBilling {
  residentialComplexId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  notes?: string;
  propertyIds?: string[];
  meterTypes?: SmartMeterUnit[];
  dryRun?: boolean;
}

export interface IoTDashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  maintenanceDevices: number;
  errorDevices: number;
  activeAlerts: number;
  criticalAlerts: number;
  todayReadings: number;
  totalConsumption: number;
  devicesByType: { [key in IoTDeviceType]: number };
  recentAlerts: IoTAlert[];
  topConsumers: any[];
  consumptionTrends: any;
}

export interface DeviceFilters {
  type?: IoTDeviceType;
  status?: IoTDeviceStatus;
  location?: string;
  propertyId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReadingFilters {
  meterId?: string;
  propertyId?: string;
  unit?: SmartMeterUnit;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AlertFilters {
  type?: AlertType;
  severity?: AlertSeverity;
  status?: AlertStatus;
  deviceId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ========== API FUNCTIONS ==========

// Dashboard
export async function getDashboardStats(): Promise<IoTDashboardStats> {
  try {
    const response = await fetchApi("/iot/dashboard");
    return response.data || response;
  } catch (error) {
    console.error("Error fetching IoT dashboard stats:", error);
    throw error;
  }
}

// Device Management
export async function createDevice(data: CreateIoTDevice): Promise<IoTDevice> {
  try {
    const response = await fetchApi("/iot/devices", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data || response;
  } catch (error) {
    console.error("Error creating IoT device:", error);
    throw error;
  }
}

export async function getDevices(filters?: DeviceFilters): Promise<{ devices: IoTDevice[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await fetchApi(`/iot/devices?${params.toString()}`);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching IoT devices:", error);
    throw error;
  }
}

export async function getDeviceById(deviceId: string): Promise<IoTDevice> {
  try {
    const response = await fetchApi(`/iot/devices/${deviceId}`);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching IoT device:", error);
    throw error;
  }
}

export async function updateDevice(deviceId: string, data: UpdateIoTDevice): Promise<IoTDevice> {
  try {
    const response = await fetchApi(`/iot/devices/${deviceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data || response;
  } catch (error) {
    console.error("Error updating IoT device:", error);
    throw error;
  }
}

export async function deleteDevice(deviceId: string): Promise<void> {
  try {
    await fetchApi(`/iot/devices/${deviceId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting IoT device:", error);
    throw error;
  }
}

// Telemetry
export async function sendTelemetryData(data: TelemetryData): Promise<any> {
  try {
    const response = await fetchApi("/iot/telemetry", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data || response;
  } catch (error) {
    console.error("Error sending telemetry data:", error);
    throw error;
  }
}

// Smart Meter Readings
export async function recordSmartMeterReading(data: SmartMeterReading): Promise<SmartMeterReading> {
  try {
    const response = await fetchApi("/iot/meters/readings", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data || response;
  } catch (error) {
    console.error("Error recording smart meter reading:", error);
    throw error;
  }
}

export async function getSmartMeterReadings(filters?: ReadingFilters): Promise<{ readings: SmartMeterReading[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await fetchApi(`/iot/meters/readings?${params.toString()}`);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching smart meter readings:", error);
    throw error;
  }
}

// Automated Billing
export async function triggerAutomatedBilling(data: AutomatedBilling): Promise<any> {
  try {
    const response = await fetchApi("/iot/billing/automated", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data || response;
  } catch (error) {
    console.error("Error triggering automated billing:", error);
    throw error;
  }
}

// Alerts
export async function getAlerts(filters?: AlertFilters): Promise<{ alerts: IoTAlert[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await fetchApi(`/iot/alerts?${params.toString()}`);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching IoT alerts:", error);
    throw error;
  }
}

export async function acknowledgeAlert(alertId: string, notes?: string): Promise<IoTAlert> {
  try {
    const response = await fetchApi(`/iot/alerts/${alertId}/acknowledge`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
    return response.data || response;
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    throw error;
  }
}

export async function resolveAlert(alertId: string, resolution: string, notes?: string): Promise<IoTAlert> {
  try {
    const response = await fetchApi(`/iot/alerts/${alertId}/resolve`, {
      method: "POST",
      body: JSON.stringify({ resolution, notes }),
    });
    return response.data || response;
  } catch (error) {
    console.error("Error resolving alert:", error);
    throw error;
  }
}

// Analytics
export async function getConsumptionAnalytics(filters: {
  startDate?: string;
  endDate?: string;
  propertyId?: string;
  meterType?: string;
}): Promise<any> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await fetchApi(`/iot/analytics/consumption?${params.toString()}`);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching consumption analytics:", error);
    throw error;
  }
}

export async function getConsumptionTrends(period: string = '30d', groupBy: string = 'day'): Promise<any> {
  try {
    const response = await fetchApi(`/iot/analytics/trends?period=${period}&groupBy=${groupBy}`);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching consumption trends:", error);
    throw error;
  }
}

export async function getEfficiencyMetrics(propertyId?: string): Promise<any> {
  try {
    const params = propertyId ? `?propertyId=${propertyId}` : '';
    const response = await fetchApi(`/iot/analytics/efficiency${params}`);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching efficiency metrics:", error);
    throw error;
  }
}

// Configuration
export async function getThresholdConfigurations(): Promise<any> {
  try {
    const response = await fetchApi("/iot/config/thresholds");
    return response.data || response;
  } catch (error) {
    console.error("Error fetching threshold configurations:", error);
    throw error;
  }
}

export async function updateThresholdConfigurations(thresholds: any): Promise<any> {
  try {
    const response = await fetchApi("/iot/config/thresholds", {
      method: "POST",
      body: JSON.stringify(thresholds),
    });
    return response.data || response;
  } catch (error) {
    console.error("Error updating threshold configurations:", error);
    throw error;
  }
}

export async function getUtilityRates(): Promise<any> {
  try {
    const response = await fetchApi("/iot/config/rates");
    return response.data || response;
  } catch (error) {
    console.error("Error fetching utility rates:", error);
    throw error;
  }
}

export async function updateUtilityRates(rates: any): Promise<any> {
  try {
    const response = await fetchApi("/iot/config/rates", {
      method: "POST",
      body: JSON.stringify(rates),
    });
    return response.data || response;
  } catch (error) {
    console.error("Error updating utility rates:", error);
    throw error;
  }
}
