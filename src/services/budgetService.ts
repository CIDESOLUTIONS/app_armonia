import { getPrisma } from '@/lib/prisma';
import { ServerLogger } from '@/lib/logging/server-logger';
import { PrismaClient } from '@prisma/client';

interface BudgetItemData {
  category: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
}

interface BudgetData {
  year: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  notes?: string;
  items: BudgetItemData[];
}

export class BudgetService {
  private prisma: PrismaClient;
  private schemaName: string;

  constructor(schemaName: string) {
    this.schemaName = schemaName;
    this.prisma = getPrisma(schemaName);
  }

  async getBudgets(complexId: number): Promise<any[]> {
    try {
      const budgets = await this.prisma.budget.findMany({
        where: { complexId },
        include: {
          items: true,
        },
        orderBy: { year: 'desc' },
      });
      return budgets;
    } catch (error) {
      ServerLogger.error(`[BudgetService] Error al obtener presupuestos para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async getBudgetById(id: number, complexId: number): Promise<any | null> {
    try {
      const budget = await this.prisma.budget.findUnique({
        where: { id, complexId },
        include: {
          items: true,
        },
      });
      return budget;
    } catch (error) {
      ServerLogger.error(`[BudgetService] Error al obtener presupuesto ${id} para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async createBudget(complexId: number, data: BudgetData): Promise<any> {
    try {
      const newBudget = await this.prisma.budget.create({
        data: {
          year: data.year,
          status: data.status,
          notes: data.notes,
          complexId,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: {
            create: data.items.map(item => ({
              category: item.category,
              description: item.description,
              amount: item.amount,
              type: item.type,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
          },
        },
        include: {
          items: true,
        },
      });
      ServerLogger.info(`[BudgetService] Presupuesto ${newBudget.id} creado para ${this.schemaName}`);
      return newBudget;
    } catch (error) {
      ServerLogger.error(`[BudgetService] Error al crear presupuesto para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async updateBudget(id: number, complexId: number, data: Partial<BudgetData>): Promise<any> {
    try {
      const updatedBudget = await this.prisma.budget.update({
        where: { id, complexId },
        data: {
          year: data.year,
          status: data.status,
          notes: data.notes,
          updatedAt: new Date(),
          // Para actualizar items, se necesitaría una lógica más compleja (deleteMany, createMany, updateMany)
          // Por simplicidad, aquí solo se actualizan los campos del presupuesto principal.
        },
        include: {
          items: true,
        },
      });
      ServerLogger.info(`[BudgetService] Presupuesto ${id} actualizado para ${this.schemaName}`);
      return updatedBudget;
    } catch (error) {
      ServerLogger.error(`[BudgetService] Error al actualizar presupuesto ${id} para ${this.schemaName}:`, error);
      throw error;
    }
  }

  async deleteBudget(id: number, complexId: number): Promise<void> {
    try {
      await this.prisma.budget.delete({
        where: { id, complexId },
      });
      ServerLogger.info(`[BudgetService] Presupuesto ${id} eliminado para ${this.schemaName}`);
    } catch (error) {
      ServerLogger.error(`[BudgetService] Error al eliminar presupuesto ${id} para ${this.schemaName}:`, error);
      throw error;
    }
  }
}
