var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/financial/payments/process/route.ts
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { BillingEngine } from '@/lib/financial/billing-engine';
import { z } from 'zod';
const ProcessPaymentSchema = z.object({
    billId: z.number(),
    amount: z.number().positive(),
    paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'PSE']),
    reference: z.string().optional()
});
// POST: Procesar pago de factura
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            const body = yield request.json();
            const validation = ProcessPaymentSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({ message: 'Datos inválidos', errors: validation.error.format() }, { status: 400 });
            }
            const { billId, amount, paymentMethod, reference } = validation.data;
            // Procesar pago
            const isFullPayment = yield BillingEngine.processPayment(billId, amount, paymentMethod, reference);
            console.log(`[PAYMENT PROCESSED] Factura ${billId}: $${amount} - ${isFullPayment ? 'COMPLETO' : 'PARCIAL'} por ${payload.email}`);
            return NextResponse.json({
                success: true,
                message: isFullPayment ? 'Pago procesado completamente' : 'Pago parcial registrado',
                billId,
                amountPaid: amount,
                paymentMethod,
                isFullPayment,
                processedAt: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('[PAYMENT PROCESS] Error:', error);
            return NextResponse.json({
                message: error instanceof Error ? error.message : 'Error procesando pago'
            }, { status: 500 });
        }
    });
}
