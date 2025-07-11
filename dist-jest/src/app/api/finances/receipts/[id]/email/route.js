var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/finances/receipts/[id]/email/route.ts
import { NextResponse } from 'next/server';
import { FinancialService } from '@/services/financialService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ServerLogger } from '@/lib/logging/server-logger';
/**
 * POST /api/finances/receipts/[id]/email
 * Envía un recibo por correo electrónico
 */
export function POST(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        try {
            // Verificar autenticación
            const session = yield getServerSession(authOptions);
            if (!session) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            // Verificar rol de administrador o propietario
            if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF' && session.user.role !== 'OWNER') {
                return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
            }
            // Obtener esquema del tenant
            const schema = getSchemaFromHeaders(req.headers);
            // Obtener ID del recibo
            const receiptId = parseInt(params.id);
            // Obtener datos del cuerpo
            const body = yield req.json();
            const { email } = body;
            // Validar datos requeridos
            if (!email) {
                return NextResponse.json({ error: 'Correo electrónico requerido' }, { status: 400 });
            }
            // Inicializar servicio financiero
            const financialService = new FinancialService(schema);
            // Enviar recibo por correo
            const result = yield financialService.sendReceiptByEmail(receiptId, email);
            return NextResponse.json(result);
        }
        catch (error) {
            ServerLogger.error(`Error al enviar recibo por correo:`, error);
            return NextResponse.json({ error: 'Error al enviar recibo por correo' }, { status: 500 });
        }
    });
}
