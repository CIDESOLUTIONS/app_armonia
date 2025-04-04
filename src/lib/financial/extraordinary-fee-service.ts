import { prisma } from '@/lib/prisma';
import { Fee } from '@prisma/client';

export class ExtraordinaryFeeService {
  /**
   * Genera una cuota extraordinaria para un conjunto residencial
   * @param complexId ID del conjunto residencial
   * @param amount Monto de la cuota
   * @param concept Concepto de la cuota extraordinaria
   * @param dueDate Fecha de vencimiento
   */
  static async createExtraordinaryFee(
    complexId: number, 
    amount: number, 
    concept: string, 
    dueDate: Date
  ): Promise<Fee[]> {
    // Obtener todas las propiedades del conjunto
    const properties = await prisma.property.findMany({
      where: { complexId }
    });

    // Generar cuotas extraordinarias para cada propiedad
    const extraordinaryFees = await Promise.all(
      properties.map(property => 
        prisma.fee.create({
          data: {
            amount,
            dueDate,
            type: 'EXTRAORDINARY',
            concept,
            propertyId: property.id,
            authorId: 1, // TODO: Reemplazar con ID del usuario actual
            complexId,
            status: 'PENDING',
            unit: property.unitNumber
          }
        })
      )
    );

    return extraordinaryFees;
  }

  /**
   * Obtiene cuotas extraordinarias de un conjunto
   * @param complexId ID del conjunto residencial
   */
  static async getExtraordinaryFees(complexId: number) {
    return prisma.fee.findMany({
      where: { 
        complexId, 
        type: 'EXTRAORDINARY' 
      },
      include: {
        property: true,
        payments: true
      }
    });
  }
}
