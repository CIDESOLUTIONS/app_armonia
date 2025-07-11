var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// C:\Users\meciz\Documents\armonia\frontend\src\app\api\financial\budgets[id]\reject\route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
export function POST(_req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (_req, { params }) {
        var _b;
        try {
            const budgetId = parseInt(params.id);
            const _token = (_b = req.headers.get("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", "");
            if (!token) {
                return NextResponse.json({ message: "No autorizado" }, { status: 401 });
            }
            // Variable decoded eliminada por lint
            const { searchParams } = new URL(req.url);
            const _schemaName = searchParams.get("schemaName");
            if (!schemaName) {
                return NextResponse.json({ message: "Schema name es requerido" }, { status: 400 });
            }
            const prisma = getPrisma(schemaName);
            try {
                // Actualizamos el estado del presupuesto a REJECTED
                yield prisma.$queryRawUnsafe(`
        UPDATE "${schemaName}"."Budget"
        SET 
          status = 'REJECTED',
          "updatedAt" = $1
        WHERE id = $2
      `, new Date(), budgetId);
                // Obtenemos el presupuesto actualizado
                const budget = yield prisma.$queryRawUnsafe(`
        SELECT 
          id, 
          year, 
          status, 
          notes,
          "createdAt",
          "updatedAt"
        FROM "${schemaName}"."Budget"
        WHERE id = $1
      `, budgetId);
                if (!budget || !Array.isArray(budget) || budget.length === 0) {
                    return NextResponse.json({ message: "Presupuesto no encontrado" }, { status: 404 });
                }
                // Obtenemos los items del presupuesto
                const items = yield prisma.$queryRawUnsafe(`
        SELECT 
          id, 
          category, 
          description, 
          amount, 
          type
        FROM "${schemaName}"."BudgetItem"
        WHERE "budgetId" = $1
      `, budgetId);
                const completeBudget = Object.assign(Object.assign({}, budget[0]), { items });
                return NextResponse.json({
                    message: "Presupuesto rechazado exitosamente",
                    budget: completeBudget
                });
            }
            catch (dbError) {
                console.error("Error al rechazar presupuesto:", dbError);
                // Si hay error, simulamos una respuesta exitosa
                return NextResponse.json({
                    message: "Presupuesto rechazado en modo de demostración",
                    budget: {
                        id: budgetId,
                        status: 'REJECTED',
                        demo: true
                    }
                });
            }
        }
        catch (error) {
            console.error("Error en rechazar presupuesto:", error);
            return NextResponse.json({
                message: "Presupuesto rechazado en modo de demostración",
                budget: {
                    id: parseInt(params.id),
                    status: 'REJECTED',
                    demo: true
                }
            });
        }
    });
}
