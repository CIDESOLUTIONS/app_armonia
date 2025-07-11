/**
 * Integraciones del sistema de comunicaciones con el módulo de seguridad
 *
 * Este archivo proporciona funciones para enviar notificaciones automáticas
 * relacionadas con eventos del módulo de seguridad y auditoría.
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
import { notifyUser, notifyByRole, notifyAll } from '@/lib/communications/notification-service';
import { getPrisma } from '@/lib/prisma';
import { AuditActionType, AuditStatus } from '@/lib/security/audit-trail';
const prisma = getPrisma();
/**
 * Envía notificación de intento de acceso fallido
 */
export function notifyFailedLoginAttempt(userId, ipAddress, userAgent, attemptCount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar al usuario afectado
            yield notifyUser(userId, {
                type: 'warning',
                title: 'Intento de acceso fallido',
                message: `Se ha detectado un intento de acceso fallido a su cuenta desde la dirección IP ${ipAddress}. Este es el intento número ${attemptCount}.`,
                priority: 'high',
                requireConfirmation: attemptCount > 3,
                data: {
                    ipAddress,
                    userAgent,
                    attemptCount,
                    timestamp: new Date().toISOString()
                }
            });
            // Si hay muchos intentos fallidos, notificar también a los administradores
            if (attemptCount > 5) {
                yield notifyByRole('admin', {
                    type: 'error',
                    title: 'Múltiples intentos de acceso fallidos',
                    message: `Se han detectado ${attemptCount} intentos de acceso fallidos para el usuario ID: ${userId} desde la IP ${ipAddress}.`,
                    priority: 'high',
                    link: `/dashboard/security/audit-logs?userId=${userId}&action=${AuditActionType.LOGIN_FAILED}`,
                    data: {
                        userId,
                        ipAddress,
                        userAgent,
                        attemptCount,
                        timestamp: new Date().toISOString()
                    }
                });
            }
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de intento de acceso fallido:', error);
            throw error;
        }
    });
}
/**
 * Envía notificación de acceso desde ubicación nueva o inusual
 */
export function notifyUnusualAccess(userId, ipAddress, location, deviceInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar al usuario afectado
            yield notifyUser(userId, {
                type: 'warning',
                title: 'Acceso desde ubicación nueva',
                message: `Se ha detectado un acceso a su cuenta desde una ubicación nueva o inusual: ${location} (IP: ${ipAddress}). Si no fue usted, por favor cambie su contraseña inmediatamente.`,
                priority: 'urgent',
                requireConfirmation: true,
                link: '/resident/profile/security',
                data: {
                    ipAddress,
                    location,
                    deviceInfo,
                    timestamp: new Date().toISOString()
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de acceso inusual:', error);
            throw error;
        }
    });
}
/**
 * Envía notificación de cambio de contraseña
 */
export function notifyPasswordChanged(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar al usuario afectado
            yield notifyUser(userId, {
                type: 'success',
                title: 'Contraseña actualizada',
                message: 'Su contraseña ha sido actualizada correctamente. Si no realizó este cambio, contacte al administrador inmediatamente.',
                priority: 'high',
                requireConfirmation: true,
                data: {
                    timestamp: new Date().toISOString()
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de cambio de contraseña:', error);
            throw error;
        }
    });
}
/**
 * Envía notificación de cambio en permisos de usuario
 */
export function notifyPermissionChange(userId, changedBy, oldRole, newRole) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar al usuario afectado
            yield notifyUser(userId, {
                type: 'info',
                title: 'Cambio en sus permisos',
                message: `Sus permisos en el sistema han sido modificados de "${oldRole}" a "${newRole}".`,
                priority: 'high',
                data: {
                    oldRole,
                    newRole,
                    changedBy,
                    timestamp: new Date().toISOString()
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de cambio de permisos:', error);
            throw error;
        }
    });
}
/**
 * Envía notificación de actividad sospechosa
 */
export function notifySuspiciousActivity(details, severity, affectedUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Determinar tipo de notificación según severidad
            let notificationType = 'info';
            let priority = 'medium';
            switch (severity) {
                case 'low':
                    notificationType = 'info';
                    priority = 'low';
                    break;
                case 'medium':
                    notificationType = 'warning';
                    priority = 'medium';
                    break;
                case 'high':
                    notificationType = 'warning';
                    priority = 'high';
                    break;
                case 'critical':
                    notificationType = 'error';
                    priority = 'urgent';
                    break;
            }
            // Notificar a administradores
            yield notifyByRole('admin', {
                type: notificationType,
                title: 'Actividad sospechosa detectada',
                message: details,
                priority,
                link: '/dashboard/security/audit-logs',
                data: {
                    severity,
                    affectedUserId,
                    timestamp: new Date().toISOString()
                }
            });
            // Si hay un usuario afectado, notificarle también
            if (affectedUserId) {
                yield notifyUser(affectedUserId, {
                    type: notificationType,
                    title: 'Alerta de seguridad',
                    message: 'Se ha detectado actividad inusual en su cuenta. Por favor verifique sus accesos recientes.',
                    priority,
                    link: '/resident/profile/security',
                    data: {
                        severity,
                        timestamp: new Date().toISOString()
                    }
                });
            }
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de actividad sospechosa:', error);
            throw error;
        }
    });
}
/**
 * Envía notificación de sesión cerrada por inactividad
 */
export function notifySessionTimeout(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar al usuario afectado
            yield notifyUser(userId, {
                type: 'info',
                title: 'Sesión cerrada por inactividad',
                message: 'Su sesión ha sido cerrada automáticamente por inactividad. Por favor inicie sesión nuevamente.',
                priority: 'low',
                data: {
                    timestamp: new Date().toISOString()
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de sesión cerrada:', error);
            throw error;
        }
    });
}
/**
 * Envía notificación de actualización de seguridad del sistema
 */
export function notifySecurityUpdate(title, details, requiresAction) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar a todos los usuarios
            yield notifyAll({
                type: 'info',
                title: `Actualización de seguridad: ${title}`,
                message: details,
                priority: requiresAction ? 'high' : 'medium',
                requireConfirmation: requiresAction,
                data: {
                    requiresAction,
                    timestamp: new Date().toISOString()
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de actualización de seguridad:', error);
            throw error;
        }
    });
}
/**
 * Procesa eventos de auditoría y envía notificaciones según sea necesario
 */
export function processAuditEvent(action, details, userId, userName, status, metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Determinar si este evento de auditoría requiere notificación
            switch (action) {
                case AuditActionType.LOGIN_FAILED:
                    if (userId) {
                        const attemptCount = (metadata === null || metadata === void 0 ? void 0 : metadata.attemptCount) || 1;
                        yield notifyFailedLoginAttempt(userId, (metadata === null || metadata === void 0 ? void 0 : metadata.ipAddress) || 'Unknown', (metadata === null || metadata === void 0 ? void 0 : metadata.userAgent) || 'Unknown', attemptCount);
                    }
                    break;
                case AuditActionType.ACCESS_ATTEMPT:
                    if (userId && status === AuditStatus.FAILURE) {
                        yield notifySuspiciousActivity(details, 'medium', userId);
                    }
                    break;
                case AuditActionType.SETTINGS_CHANGE:
                case AuditActionType.SYSTEM_CHANGE:
                    // Notificar a administradores sobre cambios importantes en el sistema
                    if (status === AuditStatus.SUCCESS) {
                        yield notifyByRole('admin', {
                            type: 'info',
                            title: 'Cambio en configuración del sistema',
                            message: details,
                            priority: 'medium',
                            data: Object.assign({ action,
                                userId,
                                userName, timestamp: new Date().toISOString() }, metadata)
                        });
                    }
                    break;
                case AuditActionType.USER_MANAGEMENT:
                    // Si es un cambio de rol, notificar al usuario afectado
                    if ((metadata === null || metadata === void 0 ? void 0 : metadata.changeType) === 'role' && (metadata === null || metadata === void 0 ? void 0 : metadata.targetUserId)) {
                        yield notifyPermissionChange(metadata.targetUserId, userId || 0, metadata.oldRole || 'Unknown', metadata.newRole || 'Unknown');
                    }
                    break;
            }
            return true;
        }
        catch (error) {
            console.error('Error al procesar evento de auditoría para notificaciones:', error);
            // No propagar el error para evitar interrumpir el flujo principal
            return false;
        }
    });
}
