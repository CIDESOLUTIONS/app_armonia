import { Injectable } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  SmartMeterReadingDto,
  SmartMeterFilterParamsDto,
  AutomatedBillingDto,
} from '../common/dto/iot.dto';

@Injectable()
export class IotService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async recordSmartMeterReading(
    schemaName: string,
    data: SmartMeterReadingDto,
  ): Promise<SmartMeterReadingDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // In a real scenario, you'd validate the meterId and propertyId against registered devices
    return prisma.smartMeterReading.create({
      data: { ...data, timestamp: new Date().toISOString() },
    });
  }

  async getSmartMeterReadings(
    schemaName: string,
    filters: SmartMeterFilterParamsDto,
  ): Promise<SmartMeterReadingDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const where: any = {};

    if (filters.meterId) {
      where.meterId = filters.meterId;
    }
    if (filters.propertyId) {
      where.propertyId = filters.propertyId;
    }
    if (filters.startDate) {
      where.timestamp = { gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.timestamp = { ...where.timestamp, lte: new Date(filters.endDate) };
    }

    return prisma.smartMeterReading.findMany({
      where,
      skip: (filters.page - 1) * filters.limit || 0,
      take: filters.limit || 10,
      orderBy: { timestamp: 'desc' },
    });
  }

  async triggerAutomatedBilling(
    schemaName: string,
    data: AutomatedBillingDto,
  ): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Lógica para la facturación automatizada basada en lecturas de medidores
    console.log(
      `Triggering automated billing for ${schemaName} from ${data.billingPeriodStart} to ${data.billingPeriodEnd}`,
    );

    // Example: Fetch readings for the period and generate fees
    const readings = await prisma.smartMeterReading.findMany({
      where: {
        timestamp: {
          gte: data.billingPeriodStart
            ? new Date(data.billingPeriodStart)
            : undefined,
          lte: data.billingPeriodEnd
            ? new Date(data.billingPeriodEnd)
            : undefined,
        },
      },
    });

    // Group readings by propertyId and calculate consumption
    const consumptionByProperty: { [propertyId: number]: { minReading: number; maxReading: number; unit: string } } = {};

    readings.forEach((reading) => {
      if (!consumptionByProperty[reading.propertyId]) {
        consumptionByProperty[reading.propertyId] = { minReading: reading.reading, maxReading: reading.reading, unit: reading.unit };
      } else {
        consumptionByProperty[reading.propertyId].minReading = Math.min(consumptionByProperty[reading.propertyId].minReading, reading.reading);
        consumptionByProperty[reading.propertyId].maxReading = Math.max(consumptionByProperty[reading.propertyId].maxReading, reading.reading);
      }
    });

    const feesToCreate = Object.entries(consumptionByProperty).map(
      ([propertyId, data]) => ({
        title: `Factura de Consumo ${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
        description: `Consumo de ${data.maxReading - data.minReading} ${data.unit}`,
        amount: (data.maxReading - data.minReading) * 100, // Example: $100 per unit of consumption
        type: 'UTILITY',
        dueDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1),
        ).toISOString(),
        propertyId: parseInt(propertyId),
      }),
    );

    await prisma.fee.createMany({ data: feesToCreate });

    return {
      message: 'Facturación automatizada iniciada y fees generados.',
      feesGenerated: feesToCreate.length,
    };
  }
}
