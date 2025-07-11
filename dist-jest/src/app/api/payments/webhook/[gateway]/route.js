var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment-service';
import { ServerLogger } from '@/lib/logging/server-logger';
/**
 * Manejador de solicitudes POST para procesar webhooks de pasarelas de pago
 * Esta ruta no requiere autenticación ya que es llamada por las pasarelas de pago
 */
export function POST(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        try {
            // Obtener la pasarela de pago
            const gateway = params.gateway.toLowerCase();
            // Validar pasarela soportada
            if (!['payu', 'wompi'].includes(gateway)) {
                return NextResponse.json({ error: 'Pasarela no soportada' }, { status: 400 });
            }
            // Obtener datos del webhook
            const body = yield req.json();
            const headers = Object.fromEntries(req.headers.entries());
            const ip = req.headers.get('x-forwarded-for') || req.ip;
            // Obtener el tenant desde los parámetros de consulta
            const { searchParams } = new URL(req.url);
            const tenantSchema = searchParams.get('tenant');
            if (!tenantSchema) {
                return NextResponse.json({ error: 'Tenant no especificado' }, { status: 400 });
            }
            // Inicializar servicio de pagos
            const paymentService = new PaymentService(tenantSchema);
            // Procesar webhook
            const result = yield paymentService.processWebhook({
                gateway,
                body,
                headers,
                ip
            });
            // Registrar evento
            ServerLogger.info(`Webhook de ${gateway} procesado correctamente`, {
                gateway,
                result,
                tenant: tenantSchema
            });
            return NextResponse.json(Object.assign({ success: true }, result));
        }
        catch (error) {
            ServerLogger.error(`Error al procesar webhook:`, error);
            return NextResponse.json({ error: 'Error al procesar webhook' }, { status: 500 });
        }
    });
}
