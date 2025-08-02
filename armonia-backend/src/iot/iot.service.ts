import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SmartMeterReadingDto,
  SmartMeterFilterParamsDto,
  AutomatedBillingDto,
} from '../common/dto/iot.dto';
import { FeeType } from '../common/dto/finances.dto';

interface FeeCreateInput {
  title: string;
  description: string;
  amount: number;
  type: string;
  dueDate: string;
  propertyId: string;
  createdById: string;
}

@Injectable()
export class IotService {
  constructor(private prisma: PrismaService) {}

  async recordSmartMeterReading(
    schemaName: string,
    data: SmartMeterReadingDto,
  ): Promise<SmartMeterReadingDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const device = await prisma.ioTDevice.findUnique({
      where: { id: data.deviceId }, // Use deviceId from DTO
    });

    if (!device) {
      throw new NotFoundException(
        `Dispositivo de medidor inteligente con ID ${data.deviceId} no encontrado.`,
      );
    }

    const createdReading = await prisma.smartMeterReading.create({
      data: {
        deviceId: data.deviceId,
        reading: data.reading,
        timestamp: new Date(data.timestamp),
      },
    });

    return {
      id: createdReading.id,
      deviceId: createdReading.deviceId,
      meterId: data.meterId, // Keep meterId from original DTO if needed for mapping
      propertyId: data.propertyId, // Keep propertyId from original DTO if needed for mapping
      reading: createdReading.reading,
      unit: data.unit, // Keep unit from original DTO if needed for mapping
      timestamp: createdReading.timestamp.toISOString(),
      residentialComplexId: data.residentialComplexId, // Keep residentialComplexId from original DTO if needed for mapping
    };
  }

  async getSmartMeterReadings(
    schemaName: string,
    filters: SmartMeterFilterParamsDto,
  ): Promise<SmartMeterReadingDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: any = {};

    if (filters.meterId) {
      // Assuming meterId in filter maps to deviceId in Prisma model
      where.deviceId = filters.meterId;
    }
    if (filters.propertyId) {
      // Assuming propertyId in filter maps to a related field in Prisma model
      // This might require a 'where' clause on a relation, e.g., device: { propertyId: filters.propertyId }
      // For now, leaving as is, but this might need further refinement based on schema.prisma relations
      where.propertyId = filters.propertyId;
    }
    if (filters.startDate) {
      where.timestamp = { gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.timestamp = { ...where.timestamp, lte: new Date(filters.endDate) };
    }

    const readings = await prisma.smartMeterReading.findMany({
      where,
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
      take: filters.limit ?? 10,
      orderBy: { timestamp: 'desc' },
    });

    return readings.map(reading => ({
      id: reading.id,
      deviceId: reading.deviceId,
      meterId: reading.deviceId, // Assuming meterId is deviceId for mapping
      propertyId: '', // Placeholder, as propertyId is not directly in SmartMeterReading model
      reading: reading.reading,
      unit: SmartMeterReadingDto.prototype.unit, // Placeholder, as unit is not directly in SmartMeterReading model
      timestamp: reading.timestamp.toISOString(),
      residentialComplexId: '', // Placeholder, as residentialComplexId is not directly in SmartMeterReading model
    }));
  }

  async triggerAutomatedBilling(
    schemaName: string,
    data: AutomatedBillingDto,
  ): Promise<any> {
    const prisma = this.prisma.getTenantDB(schemaName);

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
      [propertyId: string]: {
        minReading: number;
        maxReading: number;
        unit: string;
        type: string;
      };
    } = {};

    for (const reading of readings) {
      const device = await prisma.ioTDevice.findUnique({
        where: { id: reading.deviceId },
      });
      if (!device) continue; // Skip if device not found

      // Need to get the propertyId from the device or a related model
      // For now, using device.id as a placeholder for propertyId in consumptionByProperty
      if (!consumptionByProperty[device.id]) {
        consumptionByProperty[device.id] = {
          minReading: reading.reading,
          maxReading: reading.reading,
          unit: 'kWh', // Assuming kWh for now
          type: device.type,
        };
      } else {
        consumptionByProperty[device.id].minReading = Math.min(
          consumptionByProperty[device.id].minReading,
          reading.reading,
        );
        consumptionByProperty[device.id].maxReading = Math.max(
          consumptionByProperty[device.id].maxReading,
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
          name: consumptionData.type,
          residentialComplexId: data.residentialComplexId, // Use residentialComplexId
        },
        orderBy: { id: 'desc' },
      });

      if (!rate) {
        // ServerLogger.warn(`No se encontró tarifa para el tipo ${consumptionData.type} y unidad ${consumptionData.unit} en el complejo ${data.residentialComplexId}.`);
        continue; // Skip if no rate found
      }

      const consumedAmount =
        consumptionData.maxReading - consumptionData.minReading;
      const calculatedAmount = consumedAmount * rate.rate;

      feesToCreate.push({
        title: `Factura de Consumo ${consumptionData.type} - ${new Date(billingPeriodStart).toLocaleDateString()} a ${new Date(billingPeriodEnd).toLocaleDateString()}`,
        description: `Consumo de ${consumedAmount} ${consumptionData.unit}`,
        amount: calculatedAmount,
        type: FeeType.UTILITY,
        dueDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1),
        ).toISOString(),
        propertyId: propertyId, // propertyId is string
        createdById: 'system_user_id', // Placeholder for a system user ID (string)
      });
    }

    await prisma.fee.createMany({ data: feesToCreate as any });

    return {
      message: 'Facturación automatizada iniciada y fees generados.',
      feesGenerated: feesToCreate.length,
    };
  }
}
