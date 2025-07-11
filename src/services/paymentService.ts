import { getPrisma } from '@/lib/prisma';
import { ServerLogger } from '@/lib/logging/server-logger';
import { PrismaClient } from '@prisma/client';

export class PaymentService {
  private prisma: PrismaClient;
  private schemaName: string;

  constructor(schemaName: string) {
    this.schemaName = schemaName;
    this.prisma = getPrisma(schemaName);
  }

  async getPayments(filters: any): Promise<any[]> {
    try {
      const where: any = {};
      if (filters.status) where.status = filters.status;
      if (filters.paymentMethod) where.paymentMethod = filters.paymentMethod;
      if (filters.startDate) where.paymentDate = { gte: new Date(filters.startDate) };
      if (filters.endDate) where.paymentDate = { ...where.paymentDate, lte: new Date(filters.endDate) };

      const orderBy: any = {};
      if (filters.sortField) {
        orderBy[filters.sortField] = filters.sortDirection || 'desc';
      } else {
        orderBy.paymentDate = 'desc';
      }

      const payments = await this.prisma.payment.findMany({
        where,
        include: {
          fee: {
            select: {
              type: true,
              dueDate: true,
              unit: { select: { unitNumber: true } },
            },
          },
        },
        orderBy,
      });

      return payments.map(payment => ({
        ...payment,
        feeType: payment.fee?.type || 'N/A',
        feeDueDate: payment.fee?.dueDate || null,
        unitNumber: payment.fee?.unit?.unitNumber || 'N/A',
      }));
    } catch (error) {
      ServerLogger.error(`[PaymentService] Error al obtener pagos para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async getPaymentById(id: number): Promise<any> {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id },
        include: {
          fee: {
            select: {
              type: true,
              dueDate: true,
              unit: { select: { unitNumber: true } },
            },
          },
        },
      });
      return payment;
    } catch (error) {
      ServerLogger.error(`[PaymentService] Error al obtener pago ${id} para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async updatePayment(id: number, data: any): Promise<any> {
    try {
      const updatedPayment = await this.prisma.payment.update({
        where: { id },
        data: { ...data, updatedAt: new Date() },
      });
      ServerLogger.info(`[PaymentService] Pago ${id} actualizado para ${this.schemaName}`);
      return updatedPayment;
    } catch (error) {
      ServerLogger.error(`[PaymentService] Error al actualizar pago ${id} para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async deletePayment(id: number): Promise<void> {
    try {
      await this.prisma.payment.delete({ where: { id } });
      ServerLogger.info(`[PaymentService] Pago ${id} eliminado para ${this.schemaName}`);
    } catch (error) {
      ServerLogger.error(`[PaymentService] Error al eliminar pago ${id} para ${this.schemaName}:`, error);
      throw error;
    }
  }
}
