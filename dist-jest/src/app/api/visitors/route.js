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
import { visitorService } from '@/services/visitorService';
import { validateCsrfToken } from '@/lib/security/csrf-protection';
import { withValidation, validateRequest } from '@/lib/validation';
import { GetVisitorsSchema, CreateVisitorSchema, GetVisitorStatsSchema } from '@/validators/visitors/visitor.validator';
/**
 * GET /api/visitors
 * Obtiene la lista de visitantes con paginación y filtros
 */
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Extraer parámetros de consulta
            const searchParams = request.nextUrl.searchParams;
            const queryParams = {
                page: searchParams.get('page'),
                limit: searchParams.get('limit'),
                status: searchParams.get('status'),
                search: searchParams.get('search'),
                startDate: searchParams.get('startDate'),
                endDate: searchParams.get('endDate')
            };
            // Validar parámetros
            const validation = validateRequest(GetVisitorsSchema, queryParams);
            if (!validation.success) {
                return validation.response;
            }
            const validatedParams = validation.data;
            // Obtener visitantes
            const result = yield visitorService.getAllVisitors(validatedParams);
            return NextResponse.json(result);
        }
        catch (error) {
            console.error('Error al obtener visitantes:', error);
            return NextResponse.json({ error: 'Error al obtener visitantes', message: error.message }, { status: 500 });
        }
    });
}
/**
 * POST /api/visitors
 * Crea un nuevo registro de visitante
 */
function createVisitorHandler(validatedData, request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validar token CSRF
            const csrfValidation = yield validateCsrfToken(request);
            if (!csrfValidation.valid) {
                return NextResponse.json({ error: 'Token CSRF inválido' }, { status: 403 });
            }
            // Sanitizar datos
            const sanitizedData = Object.assign(Object.assign({}, validatedData), { name: sanitizeInput(validatedData.name), documentType: validatedData.documentType, documentNumber: sanitizeInput(validatedData.documentNumber), destination: sanitizeInput(validatedData.destination), residentName: sanitizeInput(validatedData.residentName), plate: validatedData.plate ? sanitizeInput(validatedData.plate) : undefined, photoUrl: validatedData.photoUrl ? sanitizeInput(validatedData.photoUrl) : undefined, purpose: validatedData.purpose ? sanitizeInput(validatedData.purpose) : undefined, company: validatedData.company ? sanitizeInput(validatedData.company) : undefined, signature: validatedData.signature ? sanitizeInput(validatedData.signature) : undefined });
            // Crear visitante
            const visitor = yield visitorService.createVisitor(sanitizedData);
            // Registrar evento de auditoría
            yield logAuditEvent({
                userId: sanitizedData.registeredBy,
                entityType: 'VISITOR',
                entityId: visitor.id.toString(),
                action: 'VISITOR_CREATED',
                details: JSON.stringify({
                    name: visitor.name,
                    documentNumber: visitor.documentNumber,
                    destination: visitor.destination
                })
            });
            return NextResponse.json(visitor, { status: 201 });
        }
        catch (error) {
            console.error('Error al crear visitante:', error);
            return NextResponse.json({ error: 'Error al crear visitante', message: error.message }, { status: 400 });
        }
    });
}
/**
 * GET /api/visitors/stats
 * Obtiene estadísticas de visitantes
 */
export function GET_STATS(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Extraer parámetros de consulta
            const searchParams = request.nextUrl.searchParams;
            const queryParams = {
                startDate: searchParams.get('startDate'),
                endDate: searchParams.get('endDate')
            };
            // Validar parámetros
            const validation = validateRequest(GetVisitorStatsSchema, queryParams);
            if (!validation.success) {
                return validation.response;
            }
            const validatedParams = validation.data;
            // Obtener estadísticas
            const stats = yield visitorService.getVisitorStats(validatedParams);
            return NextResponse.json(stats);
        }
        catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return NextResponse.json({ error: 'Error al obtener estadísticas', message: error.message }, { status: 500 });
        }
    });
}
// Exportar POST con validación
export const POST = withValidation(CreateVisitorSchema, createVisitorHandler);
