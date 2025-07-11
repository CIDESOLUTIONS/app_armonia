var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/financial/bills/generate/route.ts
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { BillingEngine } from '@/lib/financial/billing-engine';
import { z } from 'zod';
const GenerateBillsSchema = z.object({
    year: z.number().min(2020).max(2030),
    month: z.number().min(1).max(12)
});
// POST: Generar facturas para un período específico
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            if (!['ADMIN', 'COMPLEX_ADMIN'].includes(payload.role)) {
                return NextResponse.json({ message: 'Solo administradores pueden generar facturas' }, { status: 403 });
            }
            if (!payload.complexId) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const body = yield request.json();
            const validation = GenerateBillsSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({ message: 'Datos inválidos', errors: validation.error.format() }, { status: 400 });
            }
            const { year, month } = validation.data;
            // Crear período de facturación
            const period = {
                startDate: new Date(year, month - 1, 1),
                endDate: new Date(year, month, 0),
                year,
                month
            };
            // Generar facturas
            const bills = yield BillingEngine.generateBillsForPeriod(payload.complexId, period);
            // Guardar facturas en base de datos
            yield BillingEngine.saveBills(bills);
            console.log(`[BILLS GENERATE] ${bills.length} facturas generadas para ${payload.complexId} - ${year}/${month} por ${payload.email}`);
            return NextResponse.json({
                success: true,
                message: `${bills.length} facturas generadas exitosamente`,
                period: `${year}-${String(month).padStart(2, '0')}`,
                billsGenerated: bills.length,
                totalAmount: bills.reduce((sum, bill) => sum + bill.totalAmount, 0)
            });
        }
        catch (error) {
            console.error('[BILLS GENERATE] Error:', error);
            return NextResponse.json({
                message: error instanceof Error ? error.message : 'Error interno del servidor'
            }, { status: 500 });
        }
    });
}
