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
 * GET /api/visitors/access-pass
 * Obtiene la lista de pases de acceso con paginación y filtros
 */
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Extraer parámetros de consulta
            const searchParams = request.nextUrl.searchParams;
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '10');
            const status = searchParams.get('status') || undefined;
            const passType = searchParams.get('passType') || undefined;
            const search = searchParams.get('search') || undefined;
            const startDate = searchParams.get('startDate') || undefined;
            const endDate = searchParams.get('endDate') || undefined;
            // Obtener pases de acceso
            const result = yield accessPassService.getAllAccessPasses({
                page,
                limit,
                status,
                passType,
                search,
                startDate,
                endDate
            });
            return NextResponse.json(result);
        }
        catch (error) {
            console.error('Error al obtener pases de acceso:', error);
            return NextResponse.json({ error: 'Error al obtener pases de acceso', message: error.message }, { status: 500 });
        }
    });
}
/**
 * POST /api/visitors/access-pass
 * Genera un nuevo pase de acceso
 */
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validar token CSRF
            const csrfValidation = yield validateCsrfToken(request);
            if (!csrfValidation.valid) {
                return NextResponse.json({ error: 'Token CSRF inválido' }, { status: 403 });
            }
            // Obtener y sanitizar datos
            const requestData = yield request.json();
            const sanitizedData = {
                visitorName: sanitizeInput(requestData.visitorName),
                documentType: sanitizeInput(requestData.documentType),
                documentNumber: sanitizeInput(requestData.documentNumber),
                destination: sanitizeInput(requestData.destination),
                residentId: requestData.residentId,
                residentName: sanitizeInput(requestData.residentName),
                validFrom: new Date(requestData.validFrom),
                validUntil: new Date(requestData.validUntil),
                passType: requestData.passType,
                createdBy: requestData.createdBy,
                preRegisterId: requestData.preRegisterId,
                notes: sanitizeInput(requestData.notes)
            };
            // Generar pase de acceso
            const accessPass = yield accessPassService.generateAccessPass(sanitizedData);
            // Registrar evento de auditoría
            yield logAuditEvent({
                userId: sanitizedData.createdBy,
                entityType: 'ACCESS_PASS',
                entityId: accessPass.id.toString(),
                action: 'ACCESS_PASS_CREATED',
                details: JSON.stringify({
                    visitorName: accessPass.visitorName,
                    documentNumber: accessPass.documentNumber,
                    passType: accessPass.passType,
                    validUntil: accessPass.validUntil
                })
            });
            return NextResponse.json(accessPass, { status: 201 });
        }
        catch (error) {
            console.error('Error al generar pase de acceso:', error);
            return NextResponse.json({ error: 'Error al generar pase de acceso', message: error.message }, { status: 400 });
        }
    });
}
