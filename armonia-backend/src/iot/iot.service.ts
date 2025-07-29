import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  SmartMeterReadingDto,
  SmartMeterFilterParamsDto,
  AutomatedBillingDto,
} from '../common/dto/iot.dto.js';
import { FeeType } from '../common/dto/finances.dto.js';

interface FeeCreateInput {
  title: string;
  description: string;
  amount: number;
  type: string; // Changed from FeeType to string
  dueDate: string;
  propertyId: number;
  createdById: number;
}

@Injectable()
export class IotService {
  constructor(private prisma: PrismaService) {}

  async recordSmartMeterReading(
    schemaName: string,
    data: SmartMeterReadingDto,
  ): Promise<SmartMeterReadingDto> {
    const prisma = this.prisma;
    const device = await prisma.smartMeterDevice.findUnique({
      where: { meterId: data.meterId },
    });

    if (!device) {
      throw new NotFoundException(
        `Dispositivo de medidor inteligente con ID ${data.meterId} no encontrado.`,
      );
    }

    if (device.propertyId !== data.propertyId) {
      throw new Error(
        `El medidor ${data.meterId} no está asociado a la propiedad ${data.propertyId}.`,
      );
    }

    return prisma.smartMeterReading.create({
      data: { ...data, timestamp: new Date().toISOString() },
    });
  }

  async getSmartMeterReadings(
    schemaName: string,
    filters: SmartMeterFilterParamsDto,
  ): Promise<SmartMeterReadingDto[]> {
    const prisma = this.prisma;
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
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
      take: filters.limit ?? 10,
      orderBy: { timestamp: 'desc' },
    });
  }

  async triggerAutomatedBilling(
    schemaName: string,
    data: AutomatedBillingDto,
  ): Promise<any> {
    const prisma = this.prisma;

    if (!data.billingPeriodStart || !data.billingPeriodEnd) {
      throw new Error(
        'Las fechas de inicio y fin del período de facturación son obligatorias.',
      );
    }

    const billingPeriodStart = new Date(data.billingPeriodStart);
    const billingPeriodEnd = new Date(data.billingPeriodEnd);

    // Example: Fetch readings for the period and generate fees
    const readings = await prisma.smartMeterReading.findMany({
      where: {
        timestamp: {
          gte: billingPeriodStart,
          lte: billingPeriodEnd,
        },
      },
    });

    // Group readings by propertyId and calculate consumption
    const consumptionByProperty: {
      [propertyId: number]: {
        minReading: number;
        maxReading: number;
        unit: string;
        type: string;
      };
    } = {};

    for (const reading of readings) {
      const device = await prisma.smartMeterDevice.findUnique({
        where: { meterId: reading.meterId },
      });
      if (!device) continue; // Skip if device not found

      if (!consumptionByProperty[reading.propertyId]) {
        consumptionByProperty[reading.propertyId] = {
          minReading: reading.reading,
          maxReading: reading.reading,
          unit: reading.unit,
          type: device.type,
        };
      } else {
        consumptionByProperty[reading.propertyId].minReading = Math.min(
          consumptionByProperty[reading.propertyId].minReading,
          reading.reading,
        );
        consumptionByProperty[reading.propertyId].maxReading = Math.max(
          consumptionByProperty[reading.propertyId].maxReading,
          reading.reading,
        );
      }
    }

    const feesToCreate: FeeCreateInput[] = [];

    for (const [propertyId, consumptionData] of Object.entries(
      consumptionByProperty,
    )) {
      const rate = await prisma.utilityRate.findFirst({
        where: {
          complexId: data.complexId, // Assuming complexId is passed in AutomatedBillingDto
          type: consumptionData.type,
          unit: consumptionData.unit,
          effectiveDate: { lte: billingPeriodEnd },
          isActive: true,
        },
        orderBy: { effectiveDate: 'desc' },
      });

      if (!rate) {
        // ServerLogger.warn(`No se encontró tarifa para el tipo ${consumptionData.type} y unidad ${consumptionData.unit} en el complejo ${data.complexId}.`);
        continue; // Skip if no rate found
      }

      const consumedAmount =
        consumptionData.maxReading - consumptionData.minReading;
      const calculatedAmount = consumedAmount * rate.rate.toNumber();

      feesToCreate.push({
        title: `Factura de Consumo ${consumptionData.type} - ${new Date(billingPeriodStart).toLocaleDateString()} a ${new Date(billingPeriodEnd).toLocaleDateString()}`,
        description: `Consumo de ${consumedAmount} ${consumptionData.unit}`,
        amount: calculatedAmount,
        type: FeeType.UTILITY, // Still using FeeType enum here
        dueDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1),
        ).toISOString(),
        propertyId: parseInt(propertyId),
        createdById: 1, // Assuming a system user with ID 1 for automated billing
      });
    }

    await prisma.fee.createMany({ data: feesToCreate });

    return {
      message: 'Facturación automatizada iniciada y fees generados.',
      feesGenerated: feesToCreate.length,
    };
  }
}
