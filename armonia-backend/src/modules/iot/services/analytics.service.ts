import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateAnalyticsDto,
  AnalyticsQueryDto,
  DashboardAnalyticsDto,
  ConsumptionComparisonDto,
  AnalyticsResponseDto,
  ConsumptionAnalysisResponseDto,
  AnalyticsPeriod,
  ConsumptionTrend,
  UtilityType
} from '../dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Crear análisis de consumo
   */
  async createAnalytics(
    createAnalyticsDto: CreateAnalyticsDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<AnalyticsResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Verificar que la propiedad existe
      const property = await prisma.property.findUnique({
        where: { id: createAnalyticsDto.propertyId },
      });

      if (!property) {
        throw new NotFoundException('Propiedad no encontrada');
      }

      // Crear análisis
      const analytics = await prisma.consumptionAnalytics.create({
        data: {
          ...createAnalyticsDto,
          periodStart: new Date(createAnalyticsDto.periodStart),
          periodEnd: new Date(createAnalyticsDto.periodEnd),
          residentialComplexId,
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      this.logger.log(`Análisis creado: ${analytics.id} - ${analytics.utilityType}`);

      return this.mapAnalyticsToResponse(analytics);
    } catch (error) {
      this.logger.error(`Error creando análisis: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener análisis con filtros
   */
  async getAnalytics(
    queryDto: AnalyticsQueryDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<{ analytics: AnalyticsResponseDto[]; pagination: any }> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const page = queryDto.page || 1;
      const limit = Math.min(queryDto.limit || 20, 100);
      const skip = (page - 1) * limit;

      // Construir condiciones de filtrado
      const whereConditions: any = {
        residentialComplexId,
      };

      if (queryDto.propertyId) {
        whereConditions.propertyId = queryDto.propertyId;
      }

      if (queryDto.utilityType) {
        whereConditions.utilityType = queryDto.utilityType;
      }

      if (queryDto.period) {
        whereConditions.period = queryDto.period;
      }

      if (queryDto.startDate || queryDto.endDate) {
        whereConditions.periodStart = {};
        if (queryDto.startDate) {
          whereConditions.periodStart.gte = new Date(queryDto.startDate);
        }
        if (queryDto.endDate) {
          whereConditions.periodStart.lte = new Date(queryDto.endDate);
        }
      }

      if (queryDto.includeAnomalies) {
        whereConditions.anomalyDetected = true;
      }

      // Obtener análisis
      const [analytics, total] = await Promise.all([
        prisma.consumptionAnalytics.findMany({
          where: whereConditions,
          include: {
            property: {
              select: {
                id: true,
                name: true,
              },
            },
            ...(queryDto.includeRecommendations && {
              // Se pueden incluir lecturas relacionadas si es necesario
            }),
          },
          orderBy: { periodStart: 'desc' },
          skip,
          take: limit,
        }),
        prisma.consumptionAnalytics.count({ where: whereConditions }),
      ]);

      return {
        analytics: analytics.map(item => this.mapAnalyticsToResponse(item)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error obteniendo análisis: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generar análisis de dashboard
   */
  async getDashboardAnalytics(
    dashboardDto: DashboardAnalyticsDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<any> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - (dashboardDto.months || 6));

      const whereConditions: any = {
        residentialComplexId,
        periodStart: {
          gte: startDate,
          lte: endDate,
        },
      };

      if (dashboardDto.propertyId) {
        whereConditions.propertyId = dashboardDto.propertyId;
      }

      if (dashboardDto.utilityTypes && dashboardDto.utilityTypes.length > 0) {
        whereConditions.utilityType = {
          in: dashboardDto.utilityTypes,
        };
      }

      // Análisis por tipo de utilidad
      const analyticsByUtility = await prisma.consumptionAnalytics.groupBy({
        by: ['utilityType'],
        where: whereConditions,
        _sum: {
          totalConsumption: true,
        },
        _avg: {
          averageConsumption: true,
        },
        _count: true,
      });

      // Análisis de tendencias mensuales
      const monthlyTrends = await prisma.consumptionAnalytics.findMany({
        where: {
          ...whereConditions,
          period: AnalyticsPeriod.MONTHLY,
        },
        select: {
          utilityType: true,
          totalConsumption: true,
          periodStart: true,
          consumptionTrend: true,
        },
        orderBy: { periodStart: 'asc' },
      });

      // Anomalías detectadas
      let anomalies = [];
      if (dashboardDto.includeAnomalies) {
        anomalies = await prisma.consumptionAnalytics.findMany({
          where: {
            ...whereConditions,
            anomalyDetected: true,
          },
          select: {
            id: true,
            utilityType: true,
            anomalyScore: true,
            totalConsumption: true,
            periodStart: true,
            property: {
              select: { id: true, name: true },
            },
          },
          orderBy: { anomalyScore: 'desc' },
          take: 10,
        });
      }

      // Análisis de costos
      let costAnalysis = null;
      if (dashboardDto.includeCostAnalysis) {
        const costData = await prisma.consumptionAnalytics.aggregate({
          where: whereConditions,
          _sum: {
            totalConsumption: true,
          },
        });

        costAnalysis = {
          totalConsumption: costData._sum.totalConsumption || 0,
          estimatedCost: this.calculateEstimatedCost(costData._sum.totalConsumption || 0),
        };
      }

      // Predicciones
      let forecasts = null;
      if (dashboardDto.includeForecasts) {
        forecasts = await this.generateForecasts(whereConditions, prisma);
      }

      return {
        summary: {
          totalAnalytics: await prisma.consumptionAnalytics.count({ where: whereConditions }),
          utilitiesTracked: analyticsByUtility.length,
          anomaliesDetected: anomalies.length,
          period: {
            start: startDate,
            end: endDate,
            months: dashboardDto.months || 6,
          },
        },
        consumption: {
          byUtility: analyticsByUtility.map(item => ({
            utilityType: item.utilityType,
            totalConsumption: item._sum.totalConsumption || 0,
            averageConsumption: item._avg.averageConsumption || 0,
            recordCount: item._count,
          })),
          monthlyTrends: this.formatMonthlyTrends(monthlyTrends),
        },
        anomalies,
        costAnalysis,
        forecasts,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo análisis de dashboard: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generar análisis de comparación de consumo
   */
  async getConsumptionComparison(
    comparisonDto: ConsumptionComparisonDto,
    residentialComplexId: string,
    schemaName: string
  ): Promise<ConsumptionAnalysisResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Obtener análisis actual
      const currentAnalysis = await prisma.consumptionAnalytics.findFirst({
        where: {
          propertyId: comparisonDto.propertyId,
          utilityType: comparisonDto.utilityType,
          period: comparisonDto.comparisonPeriod,
          periodStart: {
            gte: new Date(comparisonDto.currentPeriodStart),
            lte: new Date(comparisonDto.currentPeriodEnd),
          },
          residentialComplexId,
        },
        include: {
          property: {
            select: { id: true, name: true },
          },
        },
      });

      if (!currentAnalysis) {
        throw new NotFoundException('Análisis actual no encontrado');
      }

      // Obtener análisis anterior para comparación
      const previousAnalysis = await this.getPreviousAnalysis(
        comparisonDto,
        residentialComplexId,
        schemaName
      );

      // Calcular comparación
      const comparison = this.calculateComparison(currentAnalysis, previousAnalysis);

      // Generar recomendaciones
      const recommendations = this.generateRecommendations(currentAnalysis, comparison);

      // Generar predicciones
      const forecasts = this.generateConsumptionForecasts(currentAnalysis, previousAnalysis);

      return {
        propertyId: comparisonDto.propertyId,
        utilityType: comparisonDto.utilityType,
        period: comparisonDto.comparisonPeriod,
        analysis: {
          current: this.mapAnalyticsToResponse(currentAnalysis),
          previous: previousAnalysis ? this.mapAnalyticsToResponse(previousAnalysis) : undefined,
          comparison,
        },
        recommendations,
        forecasts,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo comparación de consumo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generar análisis automático de consumo
   */
  async generateAutomaticAnalysis(
    propertyId: string,
    utilityType: UtilityType,
    period: AnalyticsPeriod,
    residentialComplexId: string,
    schemaName: string
  ): Promise<AnalyticsResponseDto> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);

      // Definir rango de fechas basado en el período
      const { periodStart, periodEnd } = this.calculatePeriodRange(period);

      // Obtener lecturas del período
      const readings = await prisma.utilityReading.findMany({
        where: {
          propertyId,
          utilityType,
          readingDate: {
            gte: periodStart,
            lte: periodEnd,
          },
          residentialComplexId,
        },
        orderBy: { readingDate: 'asc' },
      });

      if (readings.length === 0) {
        throw new BadRequestException('No hay lecturas disponibles para el período especificado');
      }

      // Calcular métricas
      const totalConsumption = readings.reduce((sum, reading) => sum + (reading.consumption || 0), 0);
      const averageConsumption = totalConsumption / readings.length;
      const consumptions = readings.map(r => r.consumption || 0).filter(c => c > 0);
      const peakConsumption = Math.max(...consumptions);
      const minConsumption = Math.min(...consumptions);

      // Detectar tendencia
      const consumptionTrend = this.detectConsumptionTrend(readings);

      // Detectar anomalías
      const { anomalyDetected, anomalyScore } = this.detectAnomalies(readings);

      // Generar predicción
      const predictedConsumption = this.predictNextPeriodConsumption(readings);

      // Crear análisis
      const analyticsDto: CreateAnalyticsDto = {
        propertyId,
        utilityType,
        period,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        totalConsumption,
        averageConsumption,
        peakConsumption,
        minConsumption,
        consumptionTrend,
        anomalyDetected,
        anomalyScore,
        predictedConsumption,
        costAnalysis: this.generateCostAnalysis(totalConsumption, utilityType),
        recommendations: this.generateBasicRecommendations(totalConsumption, consumptionTrend),
        comparisonData: { readingsCount: readings.length },
      };

      return await this.createAnalytics(analyticsDto, residentialComplexId, schemaName);
    } catch (error) {
      this.logger.error(`Error generando análisis automático: ${error.message}`);
      throw error;
    }
  }

  // Métodos auxiliares privados

  private async getPreviousAnalysis(comparisonDto: any, residentialComplexId: string, schemaName: string) {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const currentStart = new Date(comparisonDto.currentPeriodStart);
    let previousStart: Date;
    let previousEnd: Date;

    // Calcular período anterior basado en el tipo de comparación
    switch (comparisonDto.comparisonPeriod) {
      case AnalyticsPeriod.MONTHLY:
        previousStart = new Date(currentStart);
        previousStart.setMonth(previousStart.getMonth() - 1);
        previousEnd = new Date(previousStart);
        previousEnd.setMonth(previousEnd.getMonth() + 1);
        break;
      case AnalyticsPeriod.YEARLY:
        previousStart = new Date(currentStart);
        previousStart.setFullYear(previousStart.getFullYear() - 1);
        previousEnd = new Date(previousStart);
        previousEnd.setFullYear(previousEnd.getFullYear() + 1);
        break;
      default:
        previousStart = new Date(currentStart.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 días atrás
        previousEnd = new Date(currentStart);
    }

    return await prisma.consumptionAnalytics.findFirst({
      where: {
        propertyId: comparisonDto.propertyId,
        utilityType: comparisonDto.utilityType,
        period: comparisonDto.comparisonPeriod,
        periodStart: {
          gte: previousStart,
          lt: previousEnd,
        },
        residentialComplexId,
      },
    });
  }

  private calculateComparison(current: any, previous: any) {
    if (!previous) {
      return {
        consumptionChange: 0,
        costChange: 0,
        efficiencyChange: 0,
        trend: ConsumptionTrend.STABLE,
      };
    }

    const consumptionChange = ((current.totalConsumption - previous.totalConsumption) / previous.totalConsumption) * 100;
    const costChange = 0; // Se puede implementar cálculo de costo
    const efficiencyChange = ((current.averageConsumption - previous.averageConsumption) / previous.averageConsumption) * 100;

    let trend: ConsumptionTrend;
    if (consumptionChange > 5) {
      trend = ConsumptionTrend.INCREASING;
    } else if (consumptionChange < -5) {
      trend = ConsumptionTrend.DECREASING;
    } else {
      trend = ConsumptionTrend.STABLE;
    }

    return {
      consumptionChange,
      costChange,
      efficiencyChange,
      trend,
    };
  }

  private generateRecommendations(analysis: any, comparison: any) {
    const recommendations = [];

    if (comparison.consumptionChange > 15) {
      recommendations.push({
        priority: 'high' as const,
        category: 'Ahorro de Energía',
        title: 'Consumo Alto Detectado',
        description: 'El consumo ha aumentado significativamente. Revise equipos y hábitos de consumo.',
        potentialSavings: analysis.totalConsumption * 0.1,
        implementationCost: 0,
        paybackPeriod: 0,
      });
    }

    if (analysis.anomalyDetected) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Detección de Anomalías',
        title: 'Patrón de Consumo Inusual',
        description: 'Se han detectado patrones de consumo atípicos que requieren revisión.',
        potentialSavings: analysis.totalConsumption * 0.05,
        implementationCost: 100,
        paybackPeriod: 2,
      });
    }

    return recommendations;
  }

  private generateConsumptionForecasts(current: any, previous: any) {
    const baseConsumption = current.totalConsumption;
    const trend = previous ? (current.totalConsumption - previous.totalConsumption) / previous.totalConsumption : 0;

    return {
      nextPeriod: {
        predictedConsumption: baseConsumption * (1 + trend),
        predictedCost: baseConsumption * (1 + trend) * 0.12, // Tarifa ejemplo
        confidence: 0.75,
      },
      yearly: {
        predictedConsumption: baseConsumption * 12 * (1 + trend),
        predictedCost: baseConsumption * 12 * (1 + trend) * 0.12,
        confidence: 0.65,
      },
    };
  }

  private calculatePeriodRange(period: AnalyticsPeriod) {
    const now = new Date();
    let periodStart: Date;
    let periodEnd: Date = new Date(now);

    switch (period) {
      case AnalyticsPeriod.DAILY:
        periodStart = new Date(now);
        periodStart.setHours(0, 0, 0, 0);
        periodEnd.setHours(23, 59, 59, 999);
        break;
      case AnalyticsPeriod.WEEKLY:
        periodStart = new Date(now);
        periodStart.setDate(periodStart.getDate() - 7);
        break;
      case AnalyticsPeriod.MONTHLY:
        periodStart = new Date(now);
        periodStart.setMonth(periodStart.getMonth() - 1);
        break;
      case AnalyticsPeriod.YEARLY:
        periodStart = new Date(now);
        periodStart.setFullYear(periodStart.getFullYear() - 1);
        break;
      default:
        periodStart = new Date(now);
        periodStart.setMonth(periodStart.getMonth() - 1);
    }

    return { periodStart, periodEnd };
  }

  private detectConsumptionTrend(readings: any[]): ConsumptionTrend {
    if (readings.length < 2) return ConsumptionTrend.STABLE;

    const firstHalf = readings.slice(0, Math.floor(readings.length / 2));
    const secondHalf = readings.slice(Math.floor(readings.length / 2));

    const firstAvg = firstHalf.reduce((sum, r) => sum + (r.consumption || 0), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, r) => sum + (r.consumption || 0), 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (change > 10) return ConsumptionTrend.INCREASING;
    if (change < -10) return ConsumptionTrend.DECREASING;
    return ConsumptionTrend.STABLE;
  }

  private detectAnomalies(readings: any[]) {
    const consumptions = readings.map(r => r.consumption || 0).filter(c => c > 0);
    if (consumptions.length < 3) return { anomalyDetected: false, anomalyScore: 0 };

    const mean = consumptions.reduce((sum, c) => sum + c, 0) / consumptions.length;
    const variance = consumptions.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / consumptions.length;
    const stdDev = Math.sqrt(variance);

    // Detectar valores atípicos usando regla de 2 sigma
    const outliers = consumptions.filter(c => Math.abs(c - mean) > 2 * stdDev);
    const anomalyScore = outliers.length / consumptions.length;

    return {
      anomalyDetected: anomalyScore > 0.1, // 10% de outliers
      anomalyScore,
    };
  }

  private predictNextPeriodConsumption(readings: any[]): number {
    if (readings.length < 2) return 0;

    // Simple linear regression para predicción
    const consumptions = readings.map(r => r.consumption || 0).filter(c => c > 0);
    const recent = consumptions.slice(-5); // Últimas 5 lecturas
    
    return recent.reduce((sum, c) => sum + c, 0) / recent.length;
  }

  private generateCostAnalysis(totalConsumption: number, utilityType: UtilityType) {
    // Tarifas ejemplo - deberían venir de configuración
    const rates = {
      [UtilityType.ELECTRICITY]: 0.12, // $/kWh
      [UtilityType.WATER]: 0.003, // $/litro
      [UtilityType.GAS]: 0.08, // $/m3
    };

    const rate = rates[utilityType] || 0.1;
    const estimatedCost = totalConsumption * rate;

    return {
      totalConsumption,
      rate,
      estimatedCost,
      currency: 'USD',
    };
  }

  private generateBasicRecommendations(totalConsumption: number, trend: ConsumptionTrend) {
    const recommendations = [];

    if (trend === ConsumptionTrend.INCREASING) {
      recommendations.push({
        category: 'Eficiencia',
        message: 'El consumo está aumentando. Considere revisar equipos y hábitos.',
        priority: 'medium',
      });
    }

    if (totalConsumption > 1000) { // Umbral ejemplo
      recommendations.push({
        category: 'Alto Consumo',
        message: 'Consumo elevado detectado. Revise dispositivos de alto consumo.',
        priority: 'high',
      });
    }

    return recommendations;
  }

  private formatMonthlyTrends(trends: any[]) {
    const grouped = trends.reduce((acc, trend) => {
      const month = trend.periodStart.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = {};
      }
      acc[month][trend.utilityType] = {
        consumption: trend.totalConsumption,
        trend: trend.consumptionTrend,
      };
      return acc;
    }, {});

    return Object.entries(grouped).map(([month, data]) => ({
      month,
      ...data,
    }));
  }

  private calculateEstimatedCost(consumption: number): number {
    return consumption * 0.12; // Tarifa ejemplo
  }

  private async generateForecasts(whereConditions: any, prisma: any) {
    // Implementación básica de predicciones
    const recentData = await prisma.consumptionAnalytics.findMany({
      where: whereConditions,
      orderBy: { periodStart: 'desc' },
      take: 6, // Últimos 6 registros
    });

    if (recentData.length < 2) {
      return null;
    }

    const avgConsumption = recentData.reduce((sum, item) => sum + item.totalConsumption, 0) / recentData.length;
    
    return {
      nextMonth: {
        predictedConsumption: avgConsumption * 1.05, // 5% de crecimiento estimado
        confidence: 0.7,
      },
      nextQuarter: {
        predictedConsumption: avgConsumption * 3 * 1.05,
        confidence: 0.6,
      },
    };
  }

  private mapAnalyticsToResponse(analytics: any): AnalyticsResponseDto {
    return {
      id: analytics.id,
      propertyId: analytics.propertyId,
      utilityType: analytics.utilityType,
      period: analytics.period,
      periodStart: analytics.periodStart,
      periodEnd: analytics.periodEnd,
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
      createdAt: analytics.createdAt,
      updatedAt: analytics.updatedAt,
      property: analytics.property,
      readings: analytics.readings,
    };
  }
}
