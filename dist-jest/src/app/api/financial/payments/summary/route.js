var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// frontend/src/app/api/financial/payments/summary/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
// GET /api/financial/payments/summary
export function GET(_req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield pool.connect();
            try {
                const summary = {
                    totalCollected: 0,
                    monthlyPayments: 0,
                    pendingPayments: 0
                };
                // Total recaudado
                const totalResult = yield client.query(`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM payments
        WHERE status = 'COMPLETED'
      `);
                summary.totalCollected = totalResult.rows[0].total;
                // Pagos del mes actual
                const monthlyResult = yield client.query(`
        SELECT COUNT(*) as count
        FROM payments
        WHERE 
          status = 'COMPLETED' AND
          DATE_TRUNC('month', payment_date) = DATE_TRUNC('month', CURRENT_DATE)
      `);
                summary.monthlyPayments = monthlyResult.rows[0].count;
                // Pagos pendientes
                const pendingResult = yield client.query(`
        SELECT COUNT(*) as count
        FROM payments
        WHERE status = 'PENDING'
      `);
                summary.pendingPayments = pendingResult.rows[0].count;
                return NextResponse.json(summary);
            }
            finally {
                client.release();
            }
        }
        catch (error) {
            console.error('Error fetching payment summary:', error);
            return NextResponse.json({ error: 'Error al obtener resumen de pagos' }, { status: 500 });
        }
    });
}
