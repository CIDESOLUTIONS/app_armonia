import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  UtilityReadingDto,
  CreateUtilityReadingDto,
  UtilityReadingFilterDto,
  ConsumptionAnalyticsDto,
  AnalyticsFilterDto,
  CreateAnalyticsDto,
  UtilityType,
  AnalyticsPeriod,
  ConsumptionTrend,
} from '../dto/iot.dto';
import { addDays, addWeeks, addMonths, addYears, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class UtilityReadingService {
  private readonly logger = new Logger(UtilityReadingService.name);

  constructor(private prisma: PrismaService) {}

  // ========== UTILITY READINGS ==========

  async createReading(
    residentialComplexId: string,
    data: CreateUtilityReadingDto,
  ): Promise<UtilityReadingDto> {
    try {
      // Verificar que el dispositivo existe
      const device = await this.prisma.ioTDevice.findFirst({
        where: {
          id: data.deviceId,
          residentialComplexId,
        },
      });

      if (!device) {
        throw new NotFoundException('Dispositivo IoT no encontrado');
      }

      // Obtener la lectura anterior para calcular consumo
      const previousReading = await this.prisma.utilityReading.findFirst({
        where: {
          deviceId: data.deviceId,
          utilityType: data.utilityType,
          residentialComplexId,
        },
        orderBy: { readingDate: 'desc' },
      });

      const consumption = previousReading 
        ? Math.max(0, data.reading - previousReading.reading)
        : 0;

      // Calcular costo básico (esto se puede personalizar según tarifas)
      const ratePerUnit = await this.getUtilityRate(residentialComplexId, data.utilityType);
      const cost = consumption * ratePerUnit;

      const reading = await this.prisma.utilityReading.create({
        data: {
          deviceId: data.deviceId,
          propertyId: data.propertyId,
          utilityType: data.utilityType,
          reading: data.reading,
          previousReading: previousReading?.reading,
          consumption,
          unit: data.unit,
          cost,
          readingDate: data.readingDate ? new Date(data.readingDate) : new Date(),
          isAutomatic: data.isAutomatic ?? true,
          metadata: data.metadata,
          residentialComplexId,
        },
      });

      this.logger.log(`Nueva lectura de servicio creada: ${reading.id} - ${data.utilityType}`);
      
      // Triggear análisis de patrones en background
      this.analyzeConsumptionPatterns(residentialComplexId, data.propertyId, data.utilityType)
        .catch(error => this.logger.error('Error en análisis de patrones:', error));

      return this.mapReadingToDto(reading);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al crear lectura: ' + error.message);
    }
  }

  async getReadings(
    residentialComplexId: string,
    filters: UtilityReadingFilterDto,
  ): Promise<{ readings: UtilityReadingDto[]; total: number }> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const where: any = {
        residentialComplexId,
      };

      if (filters.deviceId) {
        where.deviceId = filters.deviceId;
      }
      if (filters.propertyId) {
        where.propertyId = filters.propertyId;
      }
      if (filters.utilityType) {
        where.utilityType = filters.utilityType;
      }
      if (filters.startDate) {
        where.readingDate = { gte: new Date(filters.startDate) };
      }
      if (filters.endDate) {
        where.readingDate = {
          ...where.readingDate,
          lte: new Date(filters.endDate),
        };
      }

      const [readings, total] = await Promise.all([
        this.prisma.utilityReading.findMany({
          where,
          skip,
          take: limit,
          orderBy: { readingDate: 'desc' },
          include: {
            device: {
              select: { name: true, type: true, location: true },
            },
            property: {
              select: { number: true, type: true },
            },
          },
        }),
        this.prisma.utilityReading.count({ where }),
      ]);

      return {
        readings: readings.map(reading => this.mapReadingToDto(reading)),
        total,
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener lecturas: ' + error.message);
    }
  }

  async getReadingById(
    residentialComplexId: string,
    readingId: string,
  ): Promise<UtilityReadingDto> {
    try {
      const reading = await this.prisma.utilityReading.findFirst({
        where: {
          id: readingId,
          residentialComplexId,
        },
        include: {
          device: {
            select: { name: true, type: true, location: true },
          },
          property: {
            select: { number: true, type: true },
          },
        },
      });

      if (!reading) {
        throw new NotFoundException('Lectura no encontrada');
      }

      return this.mapReadingToDto(reading);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener lectura: ' + error.message);
    }
  }

  // ========== CONSUMPTION ANALYTICS ==========

  async generateAnalytics(
    residentialComplexId: string,
    data: CreateAnalyticsDto,
  ): Promise<ConsumptionAnalyticsDto> {
    try {
      const readings = await this.prisma.utilityReading.findMany({
        where: {
          propertyId: data.propertyId,
          utilityType: data.utilityType,
          residentialComplexId,
          readingDate: {
            gte: new Date(data.periodStart),
            lte: new Date(data.periodEnd),
          },
        },
        orderBy: { readingDate: 'asc' },
      });

      if (readings.length === 0) {
        throw new BadRequestException('No hay lecturas disponibles para el período especificado');
      }

      // Calcular estadísticas
      const consumptions = readings.map(r => r.consumption || 0).filter(c => c > 0);
      const totalConsumption = consumptions.reduce((sum, c) => sum + c, 0);
      const averageConsumption = totalConsumption / consumptions.length;
      const peakConsumption = Math.max(...consumptions);
      const minConsumption = Math.min(...consumptions);

      // Detectar tendencia
      const trend = this.calculateConsumptionTrend(consumptions);

      // Detectar anomalías
      const { anomalyDetected, anomalyScore } = this.detectAnomalies(consumptions);

      // Predicción simple basada en tendencia
      const predictedConsumption = this.predictNextPeriodConsumption(consumptions, data.period);

      // Análisis de costos
      const costAnalysis = await this.generateCostAnalysis(
        residentialComplexId,
        data.utilityType,
        totalConsumption,
        data.period,
      );

      // Recomendaciones
      const recommendations = this.generateRecommendations(
        totalConsumption,
        averageConsumption,
        anomalyDetected,
        trend,
      );

      // Datos de comparación con períodos anteriores
      const comparisonData = await this.getComparisonData(
        residentialComplexId,
        data.propertyId,
        data.utilityType,
        data.period,
        new Date(data.periodStart),
      );

      const analytics = await this.prisma.consumptionAnalytics.create({
        data: {
          propertyId: data.propertyId,
          utilityType: data.utilityType,
          period: data.period,
          periodStart: new Date(data.periodStart),
          periodEnd: new Date(data.periodEnd),
          totalConsumption,
          averageConsumption,
          peakConsumption,
          minConsumption,
          consumptionTrend: trend,
          anomalyDetected,
          anomalyScore,
          predictedConsumption,
          costAnalysis,
          recommendations,
          comparisonData,
          residentialComplexId,
        },
      });

      this.logger.log(`Análisis de consumo generado: ${analytics.id}`);
      
      return this.mapAnalyticsToDto(analytics);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al generar análisis: ' + error.message);
    }
  }

  async getAnalytics(
    residentialComplexId: string,
    filters: AnalyticsFilterDto,
  ): Promise<{ analytics: ConsumptionAnalyticsDto[]; total: number }> {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const where: any = {
        residentialComplexId,
      };

      if (filters.propertyId) {
        where.propertyId = filters.propertyId;
      }
      if (filters.utilityType) {
        where.utilityType = filters.utilityType;
      }
      if (filters.period) {
        where.period = filters.period;
      }
      if (filters.anomalyDetected !== undefined) {
        where.anomalyDetected = filters.anomalyDetected;
      }
      if (filters.startDate) {
        where.periodStart = { gte: new Date(filters.startDate) };
      }
      if (filters.endDate) {
        where.periodEnd = {
          ...where.periodEnd,
          lte: new Date(filters.endDate),
        };
      }

      const [analytics, total] = await Promise.all([
        this.prisma.consumptionAnalytics.findMany({
          where,
          skip,
          take: limit,
          orderBy: { periodStart: 'desc' },
          include: {
            property: {
              select: { number: true, type: true },
            },
          },
        }),
        this.prisma.consumptionAnalytics.count({ where }),
      ]);

      return {
        analytics: analytics.map(analytic => this.mapAnalyticsToDto(analytic)),
        total,
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener análisis: ' + error.message);
    }
  }

  // ========== HISTORICAL REPORTS ==========

  async getConsumptionReport(
    residentialComplexId: string,
    propertyId: string,
    utilityType: UtilityType,
    period: AnalyticsPeriod,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    try {
      const readings = await this.prisma.utilityReading.findMany({
        where: {
          propertyId,
          utilityType,
          residentialComplexId,
          readingDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { readingDate: 'asc' },
        include: {
          device: {
            select: { name: true, type: true },
          },
        },
      });

      const grouped = this.groupReadingsByPeriod(readings, period);
      const totalCost = readings.reduce((sum, r) => sum + (r.cost || 0), 0);
      const totalConsumption = readings.reduce((sum, r) => sum + (r.consumption || 0), 0);

      return {
        propertyId,
        utilityType,
        period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalReadings: readings.length,
        totalConsumption,
        totalCost,
        averageDailyCost: totalCost / Math.max(1, this.getDaysDifference(startDate, endDate)),
        averageDailyConsumption: totalConsumption / Math.max(1, this.getDaysDifference(startDate, endDate)),
        groupedData: grouped,
        rawReadings: readings.map(r => this.mapReadingToDto(r)),
      };
    } catch (error) {
      throw new BadRequestException('Error al generar reporte: ' + error.message);
    }
  }

  async getPredictiveAnalysis(
    residentialComplexId: string,
    propertyId: string,
    utilityType: UtilityType,
  ): Promise<any> {
    try {
      // Obtener datos históricos de los últimos 12 meses
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const readings = await this.prisma.utilityReading.findMany({
        where: {
          propertyId,
          utilityType,
          residentialComplexId,
          readingDate: {
            gte: oneYearAgo,
          },
        },
        orderBy: { readingDate: 'asc' },
      });

      if (readings.length < 3) {
        throw new BadRequestException('Datos insuficientes para análisis predictivo');
      }

      const monthlyConsumption = this.groupConsumptionByMonth(readings);
      const trend = this.calculateLongTermTrend(monthlyConsumption);
      const seasonality = this.detectSeasonality(monthlyConsumption);
      
      // Predicciones para los próximos 3 meses
      const predictions = this.generatePredictions(monthlyConsumption, trend, seasonality, 3);

      return {
        propertyId,
        utilityType,
        analysisDate: new Date().toISOString(),
        historicalPeriod: {
          start: oneYearAgo.toISOString(),
          end: new Date().toISOString(),
        },
        monthlyConsumption,
        trend,
        seasonality,
        predictions,
        recommendations: this.generatePredictiveRecommendations(trend, predictions),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error en análisis predictivo: ' + error.message);
    }
  }

  // ========== PRIVATE HELPER METHODS ==========

  private async getUtilityRate(residentialComplexId: string, utilityType: UtilityType): Promise<number> {
    try {
      const rate = await this.prisma.utilityRate.findFirst({
        where: {
          residentialComplexId,
          name: utilityType,
        },
      });
      
      // Tarifas por defecto si no están configuradas
      const defaultRates = {
        electricity: 0.15, // por kWh
        water: 0.003,      // por litro
        gas: 0.05,         // por m3
        other: 0.01,
      };
      
      return rate?.rate || defaultRates[utilityType] || defaultRates.other;
    } catch (error) {
      this.logger.warn(`Error obteniendo tarifa para ${utilityType}, usando valor por defecto`);
      return 0.01;
    }
  }

  private calculateConsumptionTrend(consumptions: number[]): ConsumptionTrend {
    if (consumptions.length < 3) return ConsumptionTrend.STABLE;
    
    const firstHalf = consumptions.slice(0, Math.floor(consumptions.length / 2));
    const secondHalf = consumptions.slice(Math.floor(consumptions.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, c) => sum + c, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, c) => sum + c, 0) / secondHalf.length;
    
    const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (percentChange > 10) return ConsumptionTrend.INCREASING;
    if (percentChange < -10) return ConsumptionTrend.DECREASING;
    return ConsumptionTrend.STABLE;
  }

  private detectAnomalies(consumptions: number[]): { anomalyDetected: boolean; anomalyScore: number } {
    if (consumptions.length < 3) {
      return { anomalyDetected: false, anomalyScore: 0 };
    }
    
    const mean = consumptions.reduce((sum, c) => sum + c, 0) / consumptions.length;
    const variance = consumptions.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / consumptions.length;
    const stdDev = Math.sqrt(variance);
    
    // Detectar valores que están más de 2 desviaciones estándar de la media
    const anomalies = consumptions.filter(c => Math.abs(c - mean) > 2 * stdDev);
    const anomalyScore = anomalies.length / consumptions.length;
    
    return {
      anomalyDetected: anomalyScore > 0.1, // Más del 10% de lecturas anómalas
      anomalyScore: Math.round(anomalyScore * 100) / 100,
    };
  }

  private predictNextPeriodConsumption(consumptions: number[], period: AnalyticsPeriod): number {
    if (consumptions.length === 0) return 0;
    
    // Predicción simple basada en promedio móvil ponderado
    const recent = consumptions.slice(-Math.min(3, consumptions.length));
    const weights = recent.map((_, i) => i + 1);
    const weightSum = weights.reduce((sum, w) => sum + w, 0);
    
    return recent.reduce((sum, consumption, i) => {
      return sum + (consumption * weights[i] / weightSum);
    }, 0);
  }

  private async generateCostAnalysis(
    residentialComplexId: string,
    utilityType: UtilityType,
    totalConsumption: number,
    period: AnalyticsPeriod,
  ): Promise<any> {
    const rate = await this.getUtilityRate(residentialComplexId, utilityType);
    const baseCost = totalConsumption * rate;
    
    // Cargos fijos según el período
    const fixedCharges = {
      daily: 1,
      weekly: 5,
      monthly: 15,
      yearly: 180,
    };
    
    const fixedCharge = fixedCharges[period] || 0;
    const taxes = (baseCost + fixedCharge) * 0.1; // 10% de impuestos
    const totalCost = baseCost + fixedCharge + taxes;
    
    return {
      baseCost: Math.round(baseCost * 100) / 100,
      fixedCharges: fixedCharge,
      taxes: Math.round(taxes * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      ratePerUnit: rate,
      period,
      breakdown: {
        consumption: totalConsumption,
        unit: this.getUnitForUtilityType(utilityType),
      },
    };
  }

  private generateRecommendations(
    totalConsumption: number,
    averageConsumption: number,
    anomalyDetected: boolean,
    trend: ConsumptionTrend,
  ): any {
    const recommendations = [];
    
    if (anomalyDetected) {
      recommendations.push({
        type: 'ANOMALY_ALERT',
        priority: 'HIGH',
        title: 'Consumo anómalo detectado',
        description: 'Se detectaron patrones de consumo inusuales. Revisar dispositivos y hábitos.',
        actions: [
          'Verificar funcionamiento de dispositivos',
          'Revisar posibles fugas o fallas',
          'Analizar cambios en hábitos de consumo',
        ],
      });
    }
    
    if (trend === ConsumptionTrend.INCREASING) {
      recommendations.push({
        type: 'CONSUMPTION_INCREASE',
        priority: 'MEDIUM',
        title: 'Tendencia de consumo creciente',
        description: 'El consumo ha aumentado consistentemente.',
        actions: [
          'Implementar medidas de ahorro energético',
          'Revisar eficiencia de equipos',
          'Considerar mejoras en aislamiento',
        ],
      });
    }
    
    if (averageConsumption > totalConsumption * 1.2) {
      recommendations.push({
        type: 'HIGH_CONSUMPTION',
        priority: 'MEDIUM',
        title: 'Consumo por encima del promedio',
        description: 'El consumo actual supera el promedio esperado.',
        actions: [
          'Implementar horarios de uso eficientes',
          'Considerar equipos más eficientes',
          'Establecer metas de reducción',
        ],
      });
    }
    
    return {
      generated: new Date().toISOString(),
      totalRecommendations: recommendations.length,
      recommendations,
    };
  }

  private async getComparisonData(
    residentialComplexId: string,
    propertyId: string,
    utilityType: UtilityType,
    period: AnalyticsPeriod,
    currentPeriodStart: Date,
  ): Promise<any> {
    // Calcular período anterior
    const previousPeriodStart = this.getPreviousPeriodStart(currentPeriodStart, period);
    const previousPeriodEnd = new Date(currentPeriodStart.getTime() - 1); // Un día antes del período actual
    
    const previousAnalytics = await this.prisma.consumptionAnalytics.findFirst({
      where: {
        propertyId,
        utilityType,
        period,
        residentialComplexId,
        periodStart: {
          gte: previousPeriodStart,
          lte: previousPeriodEnd,
        },
      },
    });
    
    return {
      hasPreviousData: !!previousAnalytics,
      previousPeriod: previousAnalytics ? {
        start: previousAnalytics.periodStart.toISOString(),
        end: previousAnalytics.periodEnd.toISOString(),
        totalConsumption: previousAnalytics.totalConsumption,
        averageConsumption: previousAnalytics.averageConsumption,
      } : null,
      comparison: previousAnalytics ? {
        consumptionChange: 0, // Se calculará en el frontend
        consumptionChangePercent: 0, // Se calculará en el frontend
      } : null,
    };
  }

  private getPreviousPeriodStart(currentStart: Date, period: AnalyticsPeriod): Date {
    switch (period) {
      case AnalyticsPeriod.DAILY:
        return addDays(currentStart, -1);
      case AnalyticsPeriod.WEEKLY:
        return addWeeks(currentStart, -1);
      case AnalyticsPeriod.MONTHLY:
        return addMonths(currentStart, -1);
      case AnalyticsPeriod.YEARLY:
        return addYears(currentStart, -1);
      default:
        return addDays(currentStart, -1);
    }
  }

  private async analyzeConsumptionPatterns(
    residentialComplexId: string,
    propertyId: string,
    utilityType: UtilityType,
  ): Promise<void> {
    try {
      // Análisis automático para detectar patrones y alertas
      const recentReadings = await this.prisma.utilityReading.findMany({
        where: {
          propertyId,
          utilityType,
          residentialComplexId,
          readingDate: {
            gte: addDays(new Date(), -30), // Últimos 30 días
          },
        },
        orderBy: { readingDate: 'desc' },
      });

      if (recentReadings.length < 7) return; // Necesitamos al menos una semana de datos

      const consumptions = recentReadings
        .map(r => r.consumption || 0)
        .filter(c => c > 0);

      if (consumptions.length === 0) return;

      const { anomalyDetected, anomalyScore } = this.detectAnomalies(consumptions);
      
      // Crear alerta si se detecta anomalía significativa
      if (anomalyDetected && anomalyScore > 0.2) {
        await this.createConsumptionAlert(
          residentialComplexId,
          recentReadings[0].deviceId,
          propertyId,
          utilityType,
          anomalyScore,
        );
      }
    } catch (error) {
      this.logger.error('Error en análisis de patrones automático:', error);
    }
  }

  private async createConsumptionAlert(
    residentialComplexId: string,
    deviceId: string,
    propertyId: string,
    utilityType: UtilityType,
    anomalyScore: number,
  ): Promise<void> {
    try {
      await this.prisma.ioTAlert.create({
        data: {
          deviceId,
          type: 'CONSUMPTION_SPIKE',
          severity: anomalyScore > 0.5 ? 'HIGH' : 'MEDIUM',
          status: 'ACTIVE',
          title: `Consumo anómalo detectado - ${utilityType}`,
          message: `Se detectó un patrón de consumo inusual en ${utilityType}. Puntuación de anomalía: ${Math.round(anomalyScore * 100)}%`,
          data: {
            propertyId,
            utilityType,
            anomalyScore,
            detectedAt: new Date().toISOString(),
          },
          residentialComplexId,
        },
      });

      this.logger.log(`Alerta de consumo anómalo creada para ${utilityType} en propiedad ${propertyId}`);
    } catch (error) {
      this.logger.error('Error creando alerta de consumo:', error);
    }
  }

  private groupReadingsByPeriod(readings: any[], period: AnalyticsPeriod): any {
    // Implementar agrupación por período
    const grouped = {};
    
    readings.forEach(reading => {
      const key = this.getPeriodKey(reading.readingDate, period);
      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          readings: [],
          totalConsumption: 0,
          totalCost: 0,
        };
      }
      
      grouped[key].readings.push(reading);
      grouped[key].totalConsumption += reading.consumption || 0;
      grouped[key].totalCost += reading.cost || 0;
    });
    
    return Object.values(grouped);
  }

  private getPeriodKey(date: Date, period: AnalyticsPeriod): string {
    switch (period) {
      case AnalyticsPeriod.DAILY:
        return date.toISOString().split('T')[0];
      case AnalyticsPeriod.WEEKLY:
        const weekStart = startOfDay(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return `${weekStart.toISOString().split('T')[0]}-week`;
      case AnalyticsPeriod.MONTHLY:
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      case AnalyticsPeriod.YEARLY:
        return String(date.getFullYear());
      default:
        return date.toISOString().split('T')[0];
    }
  }

  private getDaysDifference(start: Date, end: Date): number {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  private groupConsumptionByMonth(readings: any[]): any[] {
    const monthly = {};
    
    readings.forEach(reading => {
      const monthKey = `${reading.readingDate.getFullYear()}-${String(reading.readingDate.getMonth() + 1).padStart(2, '0')}`;
      if (!monthly[monthKey]) {
        monthly[monthKey] = {
          month: monthKey,
          consumption: 0,
          cost: 0,
          readings: 0,
        };
      }
      
      monthly[monthKey].consumption += reading.consumption || 0;
      monthly[monthKey].cost += reading.cost || 0;
      monthly[monthKey].readings += 1;
    });
    
    return Object.values(monthly).sort((a: any, b: any) => a.month.localeCompare(b.month));
  }

  private calculateLongTermTrend(monthlyData: any[]): any {
    if (monthlyData.length < 3) {
      return { trend: 'insufficient_data', slope: 0 };
    }
    
    const consumptions = monthlyData.map(m => m.consumption);
    const trend = this.calculateConsumptionTrend(consumptions);
    
    // Calcular pendiente para tendencia numérica
    const x = monthlyData.map((_, i) => i);
    const y = consumptions;
    const n = x.length;
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    return {
      trend,
      slope: Math.round(slope * 100) / 100,
      direction: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
    };
  }

  private detectSeasonality(monthlyData: any[]): any {
    if (monthlyData.length < 12) {
      return { hasSeasonality: false, pattern: 'insufficient_data' };
    }
    
    // Análisis básico de estacionalidad comparando mismo mes de diferentes años
    const monthlyAverages = {};
    
    monthlyData.forEach(data => {
      const month = data.month.split('-')[1];
      if (!monthlyAverages[month]) {
        monthlyAverages[month] = [];
      }
      monthlyAverages[month].push(data.consumption);
    });
    
    const seasonalPattern = Object.keys(monthlyAverages).map(month => {
      const consumptions = monthlyAverages[month];
      const average = consumptions.reduce((sum, c) => sum + c, 0) / consumptions.length;
      return {
        month: parseInt(month),
        averageConsumption: Math.round(average * 100) / 100,
      };
    }).sort((a, b) => a.month - b.month);
    
    // Detectar si hay variación estacional significativa
    const consumptions = seasonalPattern.map(p => p.averageConsumption);
    const mean = consumptions.reduce((sum, c) => sum + c, 0) / consumptions.length;
    const variance = consumptions.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / consumptions.length;
    const coefficientOfVariation = Math.sqrt(variance) / mean;
    
    return {
      hasSeasonality: coefficientOfVariation > 0.2, // 20% de variación
      pattern: seasonalPattern,
      variationCoefficient: Math.round(coefficientOfVariation * 100) / 100,
    };
  }

  private generatePredictions(monthlyData: any[], trend: any, seasonality: any, months: number): any[] {
    const predictions = [];
    const lastDataPoint = monthlyData[monthlyData.length - 1];
    let baseConsumption = lastDataPoint.consumption;
    
    for (let i = 1; i <= months; i++) {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + i);
      const monthKey = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`;
      
      // Aplicar tendencia
      baseConsumption += trend.slope || 0;
      
      // Aplicar estacionalidad si existe
      let seasonalAdjustment = 1;
      if (seasonality.hasSeasonality && seasonality.pattern) {
        const monthPattern = seasonality.pattern.find(p => p.month === futureDate.getMonth() + 1);
        if (monthPattern) {
          const overallAverage = monthlyData.reduce((sum, m) => sum + m.consumption, 0) / monthlyData.length;
          seasonalAdjustment = monthPattern.averageConsumption / overallAverage;
        }
      }
      
      const predictedConsumption = Math.max(0, baseConsumption * seasonalAdjustment);
      
      predictions.push({
        month: monthKey,
        predictedConsumption: Math.round(predictedConsumption * 100) / 100,
        confidence: Math.max(0.5, 1 - (i * 0.1)), // Confianza decrece con el tiempo
        factors: {
          trend: trend.slope || 0,
          seasonalAdjustment,
        },
      });
    }
    
    return predictions;
  }

  private generatePredictiveRecommendations(trend: any, predictions: any[]): any[] {
    const recommendations = [];
    
    if (trend.direction === 'increasing') {
      recommendations.push({
        type: 'TREND_ALERT',
        priority: 'MEDIUM',
        title: 'Tendencia de consumo creciente detectada',
        description: 'Las predicciones muestran un aumento continuo en el consumo.',
        suggestedActions: [
          'Revisar eficiencia de equipos',
          'Implementar medidas de ahorro',
          'Considerar actualización de tecnología',
        ],
      });
    }
    
    const highestPrediction = Math.max(...predictions.map(p => p.predictedConsumption));
    const currentConsumption = predictions[0] ? predictions[0].predictedConsumption : 0;
    
    if (highestPrediction > currentConsumption * 1.3) {
      recommendations.push({
        type: 'SEASONAL_ALERT',
        priority: 'LOW',
        title: 'Pico de consumo estacional previsto',
        description: 'Se prevé un aumento estacional del consumo.',
        suggestedActions: [
          'Prepararse para mayor consumo',
          'Revisar presupuesto de servicios',
          'Considerar medidas preventivas',
        ],
      });
    }
    
    return recommendations;
  }

  private getUnitForUtilityType(utilityType: UtilityType): string {
    const units = {
      electricity: 'kWh',
      water: 'L',
      gas: 'm³',
      other: 'unit',
    };
    
    return units[utilityType] || 'unit';
  }

  private mapReadingToDto(reading: any): UtilityReadingDto {
    return {
      id: reading.id,
      deviceId: reading.deviceId,
      propertyId: reading.propertyId,
      utilityType: reading.utilityType,
      reading: reading.reading,
      previousReading: reading.previousReading,
      consumption: reading.consumption,
      unit: reading.unit,
      cost: reading.cost,
      readingDate: reading.readingDate.toISOString(),
      isAutomatic: reading.isAutomatic,
      metadata: reading.metadata,
      residentialComplexId: reading.residentialComplexId,
      createdAt: reading.createdAt.toISOString(),
      updatedAt: reading.updatedAt.toISOString(),
    };
  }

  private mapAnalyticsToDto(analytics: any): ConsumptionAnalyticsDto {
    return {
      id: analytics.id,
      propertyId: analytics.propertyId,
      utilityType: analytics.utilityType,
      period: analytics.period,
      periodStart: analytics.periodStart.toISOString(),
      periodEnd: analytics.periodEnd.toISOString(),
      totalConsumption: analytics.totalConsumption,
      averageConsumption: analytics.averageConsumption,
      peakConsumption: analytics.peakConsumption,
      minConsumption: analytics.minConsumption,
      consumptionTrend: analytics.consumptionTrend,
      anomalyDetected: analytics.anomalyDetected,
      anomalyScore: analytics.anomalyScore,
      predictedConsumption: analytics.predictedConsumption,
      costAnalysis: analytics.costAnalysis,
      recommendations: analytics.recommendations,
      comparisonData: analytics.comparisonData,
      residentialComplexId: analytics.residentialComplexId,
      createdAt: analytics.createdAt.toISOString(),
      updatedAt: analytics.updatedAt.toISOString(),
    };
  }
}