import { getPrisma } from '@/lib/prisma';
import { ServerLogger } from '@/lib/logging/server-logger';
import { PrismaClient } from '@prisma/client';

interface FeeData {
  unitId: number;
  type: string;
  amount: number;
  dueDate: Date;
  status: string;
}

export class FeeService {
  private prisma: PrismaClient;
  private schemaName: string;

  constructor(schemaName: string) {
    this.schemaName = schemaName;
    this.prisma = getPrisma(schemaName);
  }

  async getFees(filters: any): Promise<any[]> {
    try {
      const where: any = {};
      if (filters.type) where.type = filters.type;
      if (filters.status) where.status = filters.status;
      if (filters.startDate) where.dueDate = { gte: new Date(filters.startDate) };
      if (filters.endDate) where.dueDate = { ...where.dueDate, lte: new Date(filters.endDate) };

      const fees = await this.prisma.fee.findMany({
        where,
        include: {
          unit: { select: { unitNumber: true } },
          payment: { select: { id: true, amount: true, paymentDate: true, paymentMethod: true, reference: true } },
        },
        orderBy: { dueDate: 'desc' },
      });

      return fees.map(fee => ({
        ...fee,
        unitNumber: fee.unit?.unitNumber || 'N/A',
      }));
    } catch (error) {
      ServerLogger.error(`[FeeService] Error al obtener cuotas para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async createBulkFees(feeType: string, baseAmount: number, startDate: string, endDate: string, unitIds: number[]): Promise<void> {
    const client = await this.prisma.$transaction(async (tx) => {
      const dates = [];
      const currentDate = new Date(startDate);
      const endDateTime = new Date(endDate);
      
      while (currentDate <= endDateTime) {
        dates.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      for (const unitId of unitIds) {
        for (const dueDate of dates) {
          await tx.fee.create({
            data: {
              unitId,
              type: feeType,
              amount: baseAmount,
              dueDate,
              status: 'PENDING',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
      }
    });
    ServerLogger.info(`[FeeService] Cuotas masivas creadas para ${this.schemaName}`);
  }

  async updateFee(id: number, data: Partial<FeeData>): Promise<any> {
    try {
      const updatedFee = await this.prisma.fee.update({
        where: { id },
        data: { ...data, updatedAt: new Date() },
      });
      ServerLogger.info(`[FeeService] Cuota ${id} actualizada para ${this.schemaName}`);
      return updatedFee;
    } catch (error) {
      ServerLogger.error(`[FeeService] Error al actualizar cuota ${id} para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async deleteFee(id: number): Promise<void> {
    try {
      await this.prisma.fee.delete({ where: { id } });
      ServerLogger.info(`[FeeService] Cuota ${id} eliminada para ${this.schemaName}`);
    } catch (error) {
      ServerLogger.error(`[FeeService] Error al eliminar cuota ${id} para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async registerPayment(feeId: number, paymentData: { amount: number; paymentMethod: string; reference?: string }): Promise<any> {
    try {
      const fee = await this.prisma.fee.findUnique({ where: { id: feeId } });
      if (!fee) {
        throw new Error('Cuota no encontrada.');
      }

      const payment = await this.prisma.$transaction(async (tx) => {
        const newPayment = await tx.payment.create({
          data: {
            feeId,
            amount: paymentData.amount,
            paymentDate: new Date(),
            paymentMethod: paymentData.paymentMethod,
            reference: paymentData.reference,
            status: 'COMPLETED',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        await tx.fee.update({
          where: { id: feeId },
          data: {
            status: 'PAID',
            paymentDate: new Date(),
            updatedAt: new Date(),
          },
        });
        return newPayment;
      });
      ServerLogger.info(`[FeeService] Pago registrado para cuota ${feeId} en ${this.schemaName}`);
      return payment;
    } catch (error) {
      ServerLogger.error(`[FeeService] Error al registrar pago para cuota ${feeId} en ${this.schemaName}:`, error);
      throw error;
    }
  }
}
