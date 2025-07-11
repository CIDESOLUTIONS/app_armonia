/**
 * Audit Trail System
 *
 * Este módulo implementa un sistema de auditoría para registrar acciones
 * importantes en el sistema, permitiendo trazabilidad y cumplimiento normativo.
 */
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
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
// Tipos de acciones auditables
export var AuditActionType;
(function (AuditActionType) {
    AuditActionType["LOGIN"] = "LOGIN";
    AuditActionType["LOGOUT"] = "LOGOUT";
    AuditActionType["LOGIN_FAILED"] = "LOGIN_FAILED";
    AuditActionType["DATA_CREATE"] = "DATA_CREATE";
    AuditActionType["DATA_UPDATE"] = "DATA_UPDATE";
    AuditActionType["DATA_DELETE"] = "DATA_DELETE";
    AuditActionType["SETTINGS_CHANGE"] = "SETTINGS_CHANGE";
    AuditActionType["USER_MANAGEMENT"] = "USER_MANAGEMENT";
    AuditActionType["ACCESS_ATTEMPT"] = "ACCESS_ATTEMPT";
    AuditActionType["API_ACCESS"] = "API_ACCESS";
    AuditActionType["BACKUP"] = "BACKUP";
    AuditActionType["SYSTEM_CHANGE"] = "SYSTEM_CHANGE";
})(AuditActionType || (AuditActionType = {}));
// Estados de los registros de auditoría
export var AuditStatus;
(function (AuditStatus) {
    AuditStatus["SUCCESS"] = "success";
    AuditStatus["FAILURE"] = "failure";
    AuditStatus["WARNING"] = "warning";
})(AuditStatus || (AuditStatus = {}));
// Cliente Prisma para operaciones de base de datos
const prisma = getPrisma();
/**
 * Registra una acción en el sistema de auditoría
 */
export function logAuditAction(data, request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar si la auditoría está habilitada en la configuración
            const config = yield import('@/config/security').then(mod => mod.default);
            const { auditSettings } = config;
            // Verificar si este tipo de acción debe ser registrada
            if ((data.action.startsWith('LOGIN') && !auditSettings.logLogins) ||
                (data.action === AuditActionType.LOGIN_FAILED && !auditSettings.logFailedLogins) ||
                (data.action.startsWith('DATA_') && !auditSettings.logDataChanges) ||
                ((data.action === AuditActionType.SETTINGS_CHANGE ||
                    data.action === AuditActionType.SYSTEM_CHANGE) &&
                    !auditSettings.logSystemChanges)) {
                return;
            }
            // Obtener información del cliente si hay una solicitud
            let ipAddress = '0.0.0.0';
            let userAgent = 'Unknown';
            if (request) {
                // Obtener IP real considerando proxies
                ipAddress = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    request.ip || '0.0.0.0';
                // Si hay múltiples IPs (proxy chain), tomar la primera
                if (typeof ipAddress === 'string' && ipAddress.includes(',')) {
                    ipAddress = ipAddress.split(',')[0].trim();
                }
                userAgent = request.headers.get('user-agent') || 'Unknown';
            }
            // Si no se proporcionó usuario, intentar obtenerlo de la sesión
            if (!data.userId || !data.userName) {
                try {
                    const session = request ? yield getServerSession(authOptions) : null;
                    if (session === null || session === void 0 ? void 0 : session.user) {
                        data.userId = session.user.id;
                        data.userName = session.user.name || session.user.email || 'Unknown';
                    }
                }
                catch (error) {
                    console.error('Error al obtener sesión para auditoría:', error);
                }
            }
            // Crear registro de auditoría en la base de datos
            yield prisma.auditLog.create({
                data: {
                    action: data.action,
                    details: data.details,
                    userId: data.userId || 0,
                    userName: data.userName || 'system',
                    ipAddress,
                    userAgent,
                    status: data.status,
                    metadata: data.metadata ? JSON.stringify(data.metadata) : null
                }
            });
        }
        catch (error) {
            // No fallar la operación principal si hay error en la auditoría
            console.error('Error al registrar acción de auditoría:', error);
        }
    });
}
/**
 * Middleware para auditar acciones automáticamente
 */
export function auditMiddleware(actionType, detailsGenerator) {
    return (handler) => {
        return (request, ...args) => __awaiter(this, void 0, void 0, function* () {
            // Procesar la solicitud primero
            const response = yield handler(request, ...args);
            // Determinar el estado basado en la respuesta
            const status = response.status >= 400
                ? AuditStatus.FAILURE
                : (response.status >= 300 ? AuditStatus.WARNING : AuditStatus.SUCCESS);
            // Generar detalles para el registro
            const details = detailsGenerator(request);
            // Registrar la acción
            yield logAuditAction({
                action: actionType,
                details,
                status
            }, request);
            return response;
        });
    };
}
/**
 * Obtiene registros de auditoría con filtros
 */
export function getAuditLogs(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 50, userId, action, status, startDate, endDate, searchQuery }) {
        try {
            // Construir filtros
            const where = {};
            if (userId)
                where.userId = userId;
            if (action)
                where.action = action;
            if (status)
                where.status = status;
            // Filtro de rango de fechas
            if (startDate || endDate) {
                where.timestamp = {};
                if (startDate)
                    where.timestamp.gte = startDate;
                if (endDate)
                    where.timestamp.lte = endDate;
            }
            // Búsqueda por texto
            if (searchQuery) {
                where.OR = [
                    { userName: { contains: searchQuery, mode: 'insensitive' } },
                    { details: { contains: searchQuery, mode: 'insensitive' } },
                    { ipAddress: { contains: searchQuery } }
                ];
            }
            // Obtener total de registros para paginación
            const total = yield prisma.auditLog.count({ where });
            // Obtener registros paginados
            const logs = yield prisma.auditLog.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            });
            return {
                logs,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            console.error('Error al obtener logs de auditoría:', error);
            throw new Error('No se pudieron recuperar los registros de auditoría');
        }
    });
}
/**
 * Limpia registros de auditoría antiguos según la política de retención
 */
export function cleanupAuditLogs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtener configuración de retención
            const config = yield import('@/config/security').then(mod => mod.default);
            const { retentionDays } = config.auditSettings;
            // Calcular fecha límite para retención
            const retentionDate = new Date();
            retentionDate.setDate(retentionDate.getDate() - retentionDays);
            // Eliminar registros antiguos
            const result = yield prisma.auditLog.deleteMany({
                where: {
                    timestamp: {
                        lt: retentionDate
                    }
                }
            });
            return { deletedCount: result.count };
        }
        catch (error) {
            console.error('Error al limpiar logs de auditoría antiguos:', error);
            throw new Error('No se pudieron limpiar los registros de auditoría antiguos');
        }
    });
}
