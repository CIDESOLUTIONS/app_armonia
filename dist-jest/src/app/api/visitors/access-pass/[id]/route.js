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
import { accessPassService } from '@/services/accessPassService';
import { validateCsrfToken } from '@/lib/security/csrf-protection';
/**
 * GET /api/visitors/access-pass/[id]
 * Obtiene un pase de acceso por su ID
 */
export function GET(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        try {
            const id = parseInt(params.id);
            if (isNaN(id)) {
                return NextResponse.json({ error: 'ID de pase de acceso inválido' }, { status: 400 });
            }
            const accessPass = yield accessPassService.getAccessPassById(id);
            return NextResponse.json(accessPass);
        }
        catch (error) {
            console.error(`Error al obtener pase de acceso ${params.id}:`, error);
            return NextResponse.json({ error: 'Error al obtener pase de acceso', message: error.message }, { status: error.message === 'Pase de acceso no encontrado' ? 404 : 500 });
        }
    });
}
/**
 * POST /api/visitors/access-pass/[id]/validate
 * Valida un pase de acceso
 */
export function POST(request_1, _a) {
    return __awaiter(this, arguments, void 0, function* (request, { params }) {
        // Verificar si es una solicitud de validación
        const url = new URL(request.url);
        const isValidateRequest = url.pathname.endsWith('/validate');
        if (isValidateRequest) {
            try {
                // Validar token CSRF
                const csrfValidation = yield validateCsrfToken(request);
                if (!csrfValidation.valid) {
                    return NextResponse.json({ error: 'Token CSRF inválido' }, { status: 403 });
                }
                const id = parseInt(params.id);
                if (isNaN(id)) {
                    return NextResponse.json({ error: 'ID de pase de acceso inválido' }, { status: 400 });
                }
                // Obtener el pase
                const accessPass = yield accessPassService.getAccessPassById(id);
                // Validar el pase
                const validationResult = yield accessPassService.validateAccessPass(accessPass.passCode);
                // Registrar evento de auditoría
                yield logAuditEvent({
                    userId: (yield request.json()).validatedBy || 0,
                    entityType: 'ACCESS_PASS',
                    entityId: id.toString(),
                    action: 'ACCESS_PASS_VALIDATED',
                    details: JSON.stringify({
                        valid: validationResult.valid,
                        message: validationResult.message
                    })
                });
                return NextResponse.json(validationResult);
            }
            catch (error) {
                console.error(`Error al validar pase de acceso ${params.id}:`, error);
                return NextResponse.json({ error: 'Error al validar pase de acceso', message: error.message }, { status: error.message === 'Pase de acceso no encontrado' ? 404 : 500 });
            }
        }
        // Verificar si es una solicitud de registro de uso
        const isUsageRequest = url.pathname.endsWith('/usage');
        if (isUsageRequest) {
            try {
                // Validar token CSRF
                const csrfValidation = yield validateCsrfToken(request);
                if (!csrfValidation.valid) {
                    return NextResponse.json({ error: 'Token CSRF inválido' }, { status: 403 });
                }
                const id = parseInt(params.id);
                if (isNaN(id)) {
                    return NextResponse.json({ error: 'ID de pase de acceso inválido' }, { status: 400 });
                }
                // Obtener y sanitizar datos
                const requestData = yield request.json();
                const sanitizedData = {
                    action: requestData.action,
                    location: sanitizeInput(requestData.location),
                    registeredBy: requestData.registeredBy,
                    notes: sanitizeInput(requestData.notes)
                };
                // Registrar uso del pase
                const result = yield accessPassService.registerPassUsage(id, sanitizedData);
                // Registrar evento de auditoría
                yield logAuditEvent({
                    userId: sanitizedData.registeredBy,
                    entityType: 'ACCESS_PASS',
                    entityId: id.toString(),
                    action: 'ACCESS_PASS_USAGE',
                    details: JSON.stringify({
                        action: sanitizedData.action,
                        location: sanitizedData.location
                    })
                });
                return NextResponse.json(result);
            }
            catch (error) {
                console.error(`Error al registrar uso de pase de acceso ${params.id}:`, error);
                return NextResponse.json({ error: 'Error al registrar uso de pase de acceso', message: error.message }, { status: error.message === 'Pase de acceso no encontrado' ? 404 : 400 });
            }
        }
        // Verificar si es una solicitud de revocación
        const isRevokeRequest = url.pathname.endsWith('/revoke');
        if (isRevokeRequest) {
            try {
                // Validar token CSRF
                const csrfValidation = yield validateCsrfToken(request);
                if (!csrfValidation.valid) {
                    return NextResponse.json({ error: 'Token CSRF inválido' }, { status: 403 });
                }
                const id = parseInt(params.id);
                if (isNaN(id)) {
                    return NextResponse.json({ error: 'ID de pase de acceso inválido' }, { status: 400 });
                }
                // Obtener y sanitizar datos
                const requestData = yield request.json();
                const sanitizedData = {
                    revokedBy: requestData.revokedBy,
                    reason: sanitizeInput(requestData.reason)
                };
                // Revocar pase
                const accessPass = yield accessPassService.revokeAccessPass(id, sanitizedData);
                // Registrar evento de auditoría
                yield logAuditEvent({
                    userId: sanitizedData.revokedBy,
                    entityType: 'ACCESS_PASS',
                    entityId: id.toString(),
                    action: 'ACCESS_PASS_REVOKED',
                    details: JSON.stringify({
                        reason: sanitizedData.reason
                    })
                });
                return NextResponse.json(accessPass);
            }
            catch (error) {
                console.error(`Error al revocar pase de acceso ${params.id}:`, error);
                return NextResponse.json({ error: 'Error al revocar pase de acceso', message: error.message }, { status: error.message === 'Pase de acceso no encontrado' ? 404 : 400 });
            }
        }
        // Si no es ninguna de las solicitudes anteriores, devolver error
        return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
    });
}
