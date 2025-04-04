import { prisma } from '@/lib/prisma';
import { Fee } from '@prisma/client';

export class CommonServiceFeeService {
  /**
   * Calcula y genera cuotas de servicios comunes para todas las propiedades de un conjunto
   * @param complexId ID del conjunto residencial
   * @param year Año para el cálculo de cuotas
   * @param month Mes para el cálculo de cuotas
   */
  static async generateCommonServiceFees(
    complexId: number,
    year: number,
    month: number
  ): Promise<Fee[]> {
    // Obtener servicios comunes del conjunto
    const services = await prisma.service.findMany({
      where: { complexId }
    });

    // Calcular costo total de servicios comunes
    const totalServicesCost = services.reduce((sum, service) => 
      sum + (service.cost || 0), 0);

    // Obtener total de propiedades
    const totalProperties = await prisma.property.count({
      where: { complexId }
    });

    // Calcular cuota por propiedad
    const feePerProperty = totalServicesCost / totalProperties;

    // Obtener propiedades del conjunto
    const properties = await prisma.property.findMany({
      where: { complexId }
    });

    // Generar cuotas de servicios comunes para cada propiedad
    const commonServiceFees = await Promise.all(
      properties.map(property => 
        prisma.fee.create({
          data: {
            amount: feePerProperty,
            dueDate: new Date(year, month, 15), // Día 15 del mes siguiente
            type: 'COMMON_SERVICES',
            concept: `Servicios comunes ${year}-${month + 1}`,
            propertyId: property.id,
            authorId: 1, // TODO: Reemplazar con ID del usuario actual
            complexId,
            status: 'PENDING',
            unit: property.unitNumber
          }
        })
      )
    );

    return commonServiceFees;
  }

  /**
   * Obtiene cuotas de servicios comunes de un conjunto
   * @param complexId ID del conjunto residencial
   * @param year Año de las cuotas (opcional)
   * @param month Mes de las cuotas (opcional)
   */
  static async getCommonServiceFees(
    complexId: number, 
    year?: number, 
    month?: number
  ) {
    const whereCondition: any = { 
      complexId, 
      type: 'COMMON_SERVICES' 
    };

    if (year) {
      whereCondition.dueDate = {
        gte: new Date(year, month || 0, 1),
        lt: new Date(year, (month || 11) + 1, 1)
      };
    }

    return prisma.fee.findMany({
      where: whereCondition,
      include: {
        property: true,
        payments: true
      },
      orderBy: {
        dueDate: 'desc'
      }
    });
  }

  /**
   * Calcula estadísticas de pagos de servicios comunes
   * @param complexId ID del conjunto residencial
   */
  static async getCommonServiceFeesStats(complexId: number) {
    const fees = await prisma.fee.findMany({
      where: { 
        complexId, 
        type: 'COMMON_SERVICES' 
      },
      include: {
        payments: true
      }
    });

    const totalFees = fees.length;
    const paidFees = fees.filter(fee => 
      fee.payments.length > 0 && 
      fee.payments.reduce((sum, payment) => sum + payment.amount, 0) >= fee.amount
    ).length;

    return {
      totalFees,
      paidFees,
      paymentPercentage: (paidFees / totalFees) * 100
    };
  }
}
