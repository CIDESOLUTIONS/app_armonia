/**
 * Servicio de Notificaciones Push para la aplicación Armonía
 * Proporciona funcionalidades para envío de notificaciones push a dispositivos móviles
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
import { ServerLogger } from '../logging/server-logger';
const logger = ServerLogger;
/**
 * Envía una notificación push a un dispositivo
 * @param options - Opciones de la notificación
 * @returns Resultado del envío
 */
export function sendPushNotification(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!options || !options.deviceToken) {
                throw new Error('Se requiere un token de dispositivo para enviar notificación push');
            }
            if (!options.title || !options.body) {
                throw new Error('Se requieren título y cuerpo para la notificación push');
            }
            // En una implementación real, aquí se integraría con Firebase Cloud Messaging,
            // Apple Push Notification Service, u otro proveedor de notificaciones push
            // Mock de envío de notificación push
            logger.info(`[MOCK] Enviando notificación push a dispositivo ${options.deviceToken}: ${options.title}`);
            // Simular tiempo de respuesta del servicio externo
            yield new Promise(resolve => setTimeout(resolve, 100));
            return {
                success: true,
                messageId: `mock_push_${Date.now()}`,
                deviceToken: options.deviceToken,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            logger.error(`Error al enviar notificación push: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    });
}
/**
 * Envía una notificación push a múltiples dispositivos
 * @param deviceTokens - Lista de tokens de dispositivos
 * @param notification - Datos de la notificación
 * @returns Resultado del envío
 */
export function sendMulticastPushNotification(deviceTokens, notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!deviceTokens || !Array.isArray(deviceTokens) || deviceTokens.length === 0) {
                throw new Error('Se requiere al menos un token de dispositivo para envío multicast');
            }
            if (!notification || !notification.title || !notification.body) {
                throw new Error('Se requieren título y cuerpo para la notificación push');
            }
            logger.info(`[MOCK] Enviando notificación push multicast a ${deviceTokens.length} dispositivos: ${notification.title}`);
            const results = {
                success: true,
                total: deviceTokens.length,
                successful: 0,
                failed: 0,
                responses: []
            };
            // Procesar cada token
            for (const token of deviceTokens) {
                try {
                    const result = yield sendPushNotification(Object.assign({ deviceToken: token }, notification));
                    results.responses.push({
                        deviceToken: token,
                        success: result.success,
                        messageId: result.messageId,
                        error: result.error
                    });
                    if (result.success) {
                        results.successful++;
                    }
                    else {
                        results.failed++;
                    }
                }
                catch (tokenError) {
                    results.failed++;
                    results.responses.push({
                        deviceToken: token,
                        success: false,
                        error: tokenError.message
                    });
                }
            }
            results.success = results.successful > 0;
            return results;
        }
        catch (error) {
            logger.error(`Error al enviar notificación push multicast: ${error.message}`);
            return {
                success: false,
                error: error.message,
                total: deviceTokens ? deviceTokens.length : 0,
                successful: 0,
                failed: deviceTokens ? deviceTokens.length : 0
            };
        }
    });
}
/**
 * Envía una notificación push de PQR
 * @param pqr - Datos de la PQR
 * @param user - Datos del usuario
 * @param action - Acción realizada (created, updated, resolved, etc.)
 * @returns Resultado del envío
 */
export function sendPQRPushNotification(pqr, user, action) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!pqr || !user || !user.deviceToken) {
                throw new Error('Datos incompletos para notificación push de PQR');
            }
            let title, body;
            switch (action) {
                case 'created':
                    title = 'Nueva PQR registrada';
                    body = `Su PQR "${pqr.title}" ha sido registrada correctamente.`;
                    break;
                case 'updated':
                    title = 'PQR actualizada';
                    body = `Su PQR "${pqr.title}" ha sido actualizada. Estado: ${pqr.status}`;
                    break;
                case 'resolved':
                    title = 'PQR resuelta';
                    body = `Su PQR "${pqr.title}" ha sido marcada como resuelta.`;
                    break;
                case 'closed':
                    title = 'PQR cerrada';
                    body = `Su PQR "${pqr.title}" ha sido cerrada.`;
                    break;
                default:
                    title = 'Actualización de PQR';
                    body = `Su PQR "${pqr.title}" ha sido actualizada.`;
            }
            return yield sendPushNotification({
                deviceToken: user.deviceToken,
                title,
                body,
                data: {
                    type: 'PQR',
                    pqrId: pqr.id,
                    status: pqr.status,
                    action
                },
                sound: 'default',
                badge: 1,
                channel: 'pqr_notifications'
            });
        }
        catch (error) {
            logger.error(`Error al enviar notificación push de PQR: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    });
}
/**
 * Envía una notificación push de asamblea
 * @param assembly - Datos de la asamblea
 * @param user - Datos del usuario
 * @param action - Acción realizada (scheduled, reminder, started, etc.)
 * @returns Resultado del envío
 */
export function sendAssemblyPushNotification(assembly, user, action) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!assembly || !user || !user.deviceToken) {
                throw new Error('Datos incompletos para notificación push de asamblea');
            }
            let title, body;
            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const formattedDate = new Date(assembly.date).toLocaleDateString('es-ES', dateOptions);
            switch (action) {
                case 'scheduled':
                    title = 'Nueva asamblea programada';
                    body = `Se ha programado la asamblea "${assembly.title}" para el ${formattedDate}.`;
                    break;
                case 'reminder':
                    title = 'Recordatorio de asamblea';
                    body = `La asamblea "${assembly.title}" se realizará mañana ${formattedDate}.`;
                    break;
                case 'started':
                    title = 'Asamblea iniciada';
                    body = `La asamblea "${assembly.title}" ha comenzado. Puede unirse ahora.`;
                    break;
                case 'ended':
                    title = 'Asamblea finalizada';
                    body = `La asamblea "${assembly.title}" ha finalizado. Gracias por su participación.`;
                    break;
                default:
                    title = 'Actualización de asamblea';
                    body = `La asamblea "${assembly.title}" ha sido actualizada.`;
            }
            return yield sendPushNotification({
                deviceToken: user.deviceToken,
                title,
                body,
                data: {
                    type: 'ASSEMBLY',
                    assemblyId: assembly.id,
                    status: assembly.status,
                    action
                },
                sound: 'default',
                badge: 1,
                channel: 'assembly_notifications'
            });
        }
        catch (error) {
            logger.error(`Error al enviar notificación push de asamblea: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    });
}
/**
 * Envía una notificación push de pago
 * @param payment - Datos del pago
 * @param user - Datos del usuario
 * @param action - Acción realizada (received, confirmed, rejected, etc.)
 * @returns Resultado del envío
 */
export function sendPaymentPushNotification(payment, user, action) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!payment || !user || !user.deviceToken) {
                throw new Error('Datos incompletos para notificación push de pago');
            }
            let title, body;
            const amount = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(payment.amount);
            switch (action) {
                case 'received':
                    title = 'Pago recibido';
                    body = `Se ha recibido su pago por ${amount}. Referencia: ${payment.reference}`;
                    break;
                case 'confirmed':
                    title = 'Pago confirmado';
                    body = `Su pago por ${amount} ha sido confirmado. Referencia: ${payment.reference}`;
                    break;
                case 'rejected':
                    title = 'Pago rechazado';
                    body = `Su pago por ${amount} ha sido rechazado. Motivo: ${payment.rejectionReason || 'No especificado'}`;
                    break;
                default:
                    title = 'Actualización de pago';
                    body = `El estado de su pago por ${amount} ha sido actualizado a ${payment.status}.`;
            }
            return yield sendPushNotification({
                deviceToken: user.deviceToken,
                title,
                body,
                data: {
                    type: 'PAYMENT',
                    paymentId: payment.id,
                    status: payment.status,
                    action
                },
                sound: 'default',
                badge: 1,
                channel: 'payment_notifications'
            });
        }
        catch (error) {
            logger.error(`Error al enviar notificación push de pago: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    });
}
/**
 * Registra un token de dispositivo para un usuario
 * @param userId - ID del usuario
 * @param deviceToken - Token del dispositivo
 * @param deviceInfo - Información del dispositivo (opcional)
 * @returns Resultado del registro
 */
export function registerDeviceToken(userId_1, deviceToken_1) {
    return __awaiter(this, arguments, void 0, function* (userId, deviceToken, deviceInfo = {}) {
        try {
            if (!userId || !deviceToken) {
                throw new Error('Se requieren ID de usuario y token de dispositivo para registro');
            }
            // En una implementación real, aquí se guardaría el token en la base de datos
            logger.info(`[MOCK] Registrado token de dispositivo para usuario ${userId}: ${deviceToken}`);
            return {
                success: true,
                userId,
                deviceToken,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            logger.error(`Error al registrar token de dispositivo: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    });
}
/**
 * Elimina un token de dispositivo
 * @param userId - ID del usuario
 * @param deviceToken - Token del dispositivo
 * @returns Resultado de la eliminación
 */
export function unregisterDeviceToken(userId, deviceToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!userId || !deviceToken) {
                throw new Error('Se requieren ID de usuario y token de dispositivo para eliminación');
            }
            // En una implementación real, aquí se eliminaría el token de la base de datos
            logger.info(`[MOCK] Eliminado token de dispositivo para usuario ${userId}: ${deviceToken}`);
            return {
                success: true,
                userId,
                deviceToken,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            logger.error(`Error al eliminar token de dispositivo: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    });
}
