var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPrisma } from '@/lib/prisma';
import { ServerLogger } from '@/lib/logging/server-logger';
export class BudgetService {
    constructor(schemaName) {
        this.schemaName = schemaName;
        this.prisma = getPrisma(schemaName);
    }
    getBudgets(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const budgets = yield this.prisma.budget.findMany({
                    where: { complexId },
                    include: {
                        items: true,
                    },
                    orderBy: { year: 'desc' },
                });
                return budgets;
            }
            catch (error) {
                ServerLogger.error(`[BudgetService] Error al obtener presupuestos para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    getBudgetById(id, complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const budget = yield this.prisma.budget.findUnique({
                    where: { id, complexId },
                    include: {
                        items: true,
                    },
                });
                return budget;
            }
            catch (error) {
                ServerLogger.error(`[BudgetService] Error al obtener presupuesto ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    createBudget(complexId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newBudget = yield this.prisma.budget.create({
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
            }
            catch (error) {
                ServerLogger.error(`[BudgetService] Error al crear presupuesto para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    updateBudget(id, complexId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedBudget = yield this.prisma.budget.update({
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
            }
            catch (error) {
                ServerLogger.error(`[BudgetService] Error al actualizar presupuesto ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    deleteBudget(id, complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.budget.delete({
                    where: { id, complexId },
                });
                ServerLogger.info(`[BudgetService] Presupuesto ${id} eliminado para ${this.schemaName}`);
            }
            catch (error) {
                ServerLogger.error(`[BudgetService] Error al eliminar presupuesto ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
}
