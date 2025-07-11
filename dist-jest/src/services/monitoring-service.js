/**
 * Servicio para gestión del sistema de monitoreo
 * Este servicio implementa la lógica de negocio para el monitoreo de infraestructura,
 * aplicación y experiencia de usuario, así como la gestión de alertas y notificaciones.
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
import { getTenantPrismaClient } from '@/lib/prisma';
import { ServerLogger } from '@/lib/logging/server-logger';
import { NotificationService } from '@/lib/services/notification-service';
import axios from 'axios';
import { performance } from 'perf_hooks';
// Tipos de monitoreo soportados
export var MonitoringType;
(function (MonitoringType) {
    MonitoringType["INFRASTRUCTURE"] = "INFRASTRUCTURE";
    MonitoringType["APPLICATION"] = "APPLICATION";
    MonitoringType["USER_EXPERIENCE"] = "USER_EXPERIENCE";
})(MonitoringType || (MonitoringType = {}));
// Estados de monitoreo
export var MonitoringStatus;
(function (MonitoringStatus) {
    MonitoringStatus["SUCCESS"] = "SUCCESS";
    MonitoringStatus["WARNING"] = "WARNING";
    MonitoringStatus["ERROR"] = "ERROR";
    MonitoringStatus["CRITICAL"] = "CRITICAL";
})(MonitoringStatus || (MonitoringStatus = {}));
// Estados de alerta
export var AlertStatus;
(function (AlertStatus) {
    AlertStatus["ACTIVE"] = "ACTIVE";
    AlertStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    AlertStatus["RESOLVED"] = "RESOLVED";
})(AlertStatus || (AlertStatus = {}));
// Severidad de alertas
export var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["INFO"] = "INFO";
    AlertSeverity["WARNING"] = "WARNING";
    AlertSeverity["ERROR"] = "ERROR";
    AlertSeverity["CRITICAL"] = "CRITICAL";
})(AlertSeverity || (AlertSeverity = {}));
// Canales de notificación
export var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["WEBHOOK"] = "WEBHOOK";
})(NotificationChannel || (NotificationChannel = {}));
/**
 * Clase principal del servicio de monitoreo
 */
export default class MonitoringService {
    /**
     * Constructor del servicio
     * @param schema Esquema del tenant
     */
    constructor(schema) {
        this.prisma = getTenantPrismaClient(schema);
        this.tenantId = schema;
        this.notificationService = new NotificationService(schema);
    }
    /**
     * Crea una nueva configuración de monitoreo
     * @param data Datos de la configuración
     * @param userId ID del usuario que crea la configuración
     * @returns Configuración creada
     */
    createMonitoringConfig(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield this.prisma.monitoringConfig.create({
                    data: {
                        tenantId: this.tenantId,
                        name: data.name,
                        description: data.description,
                        monitoringType: data.monitoringType,
                        checkInterval: data.checkInterval,
                        targetResource: data.targetResource,
                        parameters: data.parameters || {},
                        alertThresholds: data.alertThresholds,
                        isActive: data.isActive !== undefined ? data.isActive : true
                    }
                });
                ServerLogger.info(`Configuración de monitoreo creada: ${config.id}`, {
                    userId,
                    tenantId: this.tenantId,
                    configId: config.id
                });
                return config;
            }
            catch (error) {
                ServerLogger.error('Error al crear configuración de monitoreo:', error);
                throw new Error('Error al crear configuración de monitoreo');
            }
        });
    }
    /**
     * Actualiza una configuración de monitoreo existente
     * @param id ID de la configuración
     * @param data Datos actualizados
     * @param userId ID del usuario que actualiza la configuración
     * @returns Configuración actualizada
     */
    updateMonitoringConfig(id, data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield this.prisma.monitoringConfig.update({
                    where: { id },
                    data: {
                        name: data.name,
                        description: data.description,
                        monitoringType: data.monitoringType,
                        checkInterval: data.checkInterval,
                        targetResource: data.targetResource,
                        parameters: data.parameters,
                        alertThresholds: data.alertThresholds,
                        isActive: data.isActive
                    }
                });
                ServerLogger.info(`Configuración de monitoreo actualizada: ${id}`, {
                    userId,
                    tenantId: this.tenantId,
                    configId: id
                });
                return config;
            }
            catch (error) {
                ServerLogger.error(`Error al actualizar configuración de monitoreo ${id}:`, error);
                throw new Error('Error al actualizar configuración de monitoreo');
            }
        });
    }
    /**
     * Elimina una configuración de monitoreo
     * @param id ID de la configuración
     * @param userId ID del usuario que elimina la configuración
     * @returns Resultado de la operación
     */
    deleteMonitoringConfig(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Primero eliminamos resultados y alertas asociadas
                yield this.prisma.monitoringResult.deleteMany({
                    where: { configId: id }
                });
                // Eliminamos notificaciones de alertas
                const alerts = yield this.prisma.alert.findMany({
                    where: { configId: id },
                    select: { id: true }
                });
                const alertIds = alerts.map(alert => alert.id);
                yield this.prisma.notificationLog.deleteMany({
                    where: { alertId: { in: alertIds } }
                });
                // Eliminamos alertas
                yield this.prisma.alert.deleteMany({
                    where: { configId: id }
                });
                // Finalmente eliminamos la configuración
                yield this.prisma.monitoringConfig.delete({
                    where: { id }
                });
                ServerLogger.info(`Configuración de monitoreo eliminada: ${id}`, {
                    userId,
                    tenantId: this.tenantId,
                    configId: id
                });
                return { success: true, message: 'Configuración eliminada correctamente' };
            }
            catch (error) {
                ServerLogger.error(`Error al eliminar configuración de monitoreo ${id}:`, error);
                throw new Error('Error al eliminar configuración de monitoreo');
            }
        });
    }
    /**
     * Obtiene todas las configuraciones de monitoreo
     * @param includeInactive Incluir configuraciones inactivas
     * @returns Lista de configuraciones
     */
    getMonitoringConfigs() {
        return __awaiter(this, arguments, void 0, function* (includeInactive = false) {
            try {
                const where = Object.assign({ tenantId: this.tenantId }, (includeInactive ? {} : { isActive: true }));
                const configs = yield this.prisma.monitoringConfig.findMany({
                    where,
                    orderBy: { name: 'asc' }
                });
                return configs;
            }
            catch (error) {
                ServerLogger.error('Error al obtener configuraciones de monitoreo:', error);
                throw new Error('Error al obtener configuraciones de monitoreo');
            }
        });
    }
    /**
     * Obtiene una configuración de monitoreo por ID
     * @param id ID de la configuración
     * @returns Configuración encontrada
     */
    getMonitoringConfigById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield this.prisma.monitoringConfig.findUnique({
                    where: { id }
                });
                if (!config) {
                    throw new Error('Configuración de monitoreo no encontrada');
                }
                return config;
            }
            catch (error) {
                ServerLogger.error(`Error al obtener configuración de monitoreo ${id}:`, error);
                throw new Error('Error al obtener configuración de monitoreo');
            }
        });
    }
    /**
     * Ejecuta una verificación de monitoreo para una configuración específica
     * @param configId ID de la configuración
     * @returns Resultado de la verificación
     */
    executeCheck(configId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield this.getMonitoringConfigById(configId);
                if (!config.isActive) {
                    return { skipped: true, message: 'Configuración inactiva' };
                }
                let result;
                // Ejecutar verificación según el tipo de monitoreo
                switch (config.monitoringType) {
                    case MonitoringType.INFRASTRUCTURE:
                        result = yield this.checkInfrastructure(config);
                        break;
                    case MonitoringType.APPLICATION:
                        result = yield this.checkApplication(config);
                        break;
                    case MonitoringType.USER_EXPERIENCE:
                        result = yield this.checkUserExperience(config);
                        break;
                    default:
                        throw new Error(`Tipo de monitoreo no soportado: ${config.monitoringType}`);
                }
                // Guardar resultado
                const savedResult = yield this.saveMonitoringResult(configId, result);
                // Verificar si se debe generar una alerta
                yield this.checkForAlerts(config, result);
                return savedResult;
            }
            catch (error) {
                ServerLogger.error(`Error al ejecutar verificación para configuración ${configId}:`, error);
                // Guardar resultado de error
                const errorResult = {
                    status: MonitoringStatus.ERROR,
                    errorMessage: error instanceof Error ? error.message : 'Error desconocido'
                };
                yield this.saveMonitoringResult(configId, errorResult);
                throw new Error('Error al ejecutar verificación de monitoreo');
            }
        });
    }
    /**
     * Ejecuta verificaciones para todas las configuraciones activas
     * @returns Resultados de las verificaciones
     */
    executeAllChecks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const configs = yield this.getMonitoringConfigs(false);
                const results = [];
                for (const config of configs) {
                    try {
                        const result = yield this.executeCheck(config.id);
                        results.push({ configId: config.id, result });
                    }
                    catch (error) {
                        results.push({
                            configId: config.id,
                            error: error instanceof Error ? error.message : 'Error desconocido'
                        });
                    }
                }
                return results;
            }
            catch (error) {
                ServerLogger.error('Error al ejecutar todas las verificaciones:', error);
                throw new Error('Error al ejecutar verificaciones de monitoreo');
            }
        });
    }
    /**
     * Verifica infraestructura (servidores, bases de datos, etc.)
     * @param config Configuración de monitoreo
     * @returns Resultado de la verificación
     */
    checkInfrastructure(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = performance.now();
            try {
                const { targetResource, parameters } = config;
                let value;
                let details = {};
                let status = MonitoringStatus.SUCCESS;
                // Implementación según el tipo de recurso
                if (targetResource.startsWith('server:')) {
                    // Monitoreo de servidor (CPU, memoria, disco)
                    const resource = targetResource.split(':')[1];
                    // Aquí se implementaría la lógica real para obtener métricas del servidor
                    // Este es un ejemplo simulado
                    switch (resource) {
                        case 'cpu':
                            value = Math.random() * 100; // Simulación de uso de CPU
                            break;
                        case 'memory':
                            value = Math.random() * 100; // Simulación de uso de memoria
                            break;
                        case 'disk':
                            value = Math.random() * 100; // Simulación de uso de disco
                            break;
                        default:
                            throw new Error(`Recurso de servidor no soportado: ${resource}`);
                    }
                    details = { resource, unit: '%' };
                }
                else if (targetResource.startsWith('database:')) {
                    // Monitoreo de base de datos
                    const dbResource = targetResource.split(':')[1];
                    // Simulación de métricas de base de datos
                    switch (dbResource) {
                        case 'connections':
                            value = Math.floor(Math.random() * 100);
                            details = { resource: dbResource, unit: 'connections' };
                            break;
                        case 'queries':
                            value = Math.floor(Math.random() * 1000);
                            details = { resource: dbResource, unit: 'queries/sec' };
                            break;
                        case 'latency':
                            value = Math.random() * 500;
                            details = { resource: dbResource, unit: 'ms' };
                            break;
                        default:
                            throw new Error(`Recurso de base de datos no soportado: ${dbResource}`);
                    }
                }
                else {
                    throw new Error(`Tipo de recurso de infraestructura no soportado: ${targetResource}`);
                }
                // Determinar estado según umbrales
                const thresholds = config.alertThresholds;
                if (value !== undefined) {
                    if (thresholds.critical !== undefined && value >= thresholds.critical) {
                        status = MonitoringStatus.CRITICAL;
                    }
                    else if (thresholds.error !== undefined && value >= thresholds.error) {
                        status = MonitoringStatus.ERROR;
                    }
                    else if (thresholds.warning !== undefined && value >= thresholds.warning) {
                        status = MonitoringStatus.WARNING;
                    }
                }
                const responseTime = Math.round(performance.now() - startTime);
                return {
                    status,
                    responseTime,
                    value,
                    details
                };
            }
            catch (error) {
                ServerLogger.error(`Error en verificación de infraestructura:`, error);
                return {
                    status: MonitoringStatus.ERROR,
                    responseTime: Math.round(performance.now() - startTime),
                    errorMessage: error instanceof Error ? error.message : 'Error desconocido'
                };
            }
        });
    }
    /**
     * Verifica aplicación (APIs, servicios, etc.)
     * @param config Configuración de monitoreo
     * @returns Resultado de la verificación
     */
    checkApplication(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = performance.now();
            try {
                const { targetResource, parameters } = config;
                let responseTime;
                let details = {};
                let status = MonitoringStatus.SUCCESS;
                // Verificar endpoint de API
                if (targetResource.startsWith('api:')) {
                    const endpoint = targetResource.split(':')[1];
                    const method = (parameters === null || parameters === void 0 ? void 0 : parameters.method) || 'GET';
                    const timeout = (parameters === null || parameters === void 0 ? void 0 : parameters.timeout) || 5000;
                    const headers = (parameters === null || parameters === void 0 ? void 0 : parameters.headers) || {};
                    const data = parameters === null || parameters === void 0 ? void 0 : parameters.data;
                    try {
                        const requestStartTime = performance.now();
                        const response = yield axios({
                            method,
                            url: endpoint,
                            headers,
                            data,
                            timeout
                        });
                        responseTime = Math.round(performance.now() - requestStartTime);
                        details = {
                            statusCode: response.status,
                            contentLength: response.headers['content-length'],
                            contentType: response.headers['content-type']
                        };
                        // Verificar código de estado HTTP
                        if (response.status >= 500) {
                            status = MonitoringStatus.ERROR;
                        }
                        else if (response.status >= 400) {
                            status = MonitoringStatus.WARNING;
                        }
                        // Verificar tiempo de respuesta contra umbrales
                        const thresholds = config.alertThresholds;
                        if (responseTime !== undefined) {
                            if (thresholds.critical !== undefined && responseTime >= thresholds.critical) {
                                status = MonitoringStatus.CRITICAL;
                            }
                            else if (thresholds.error !== undefined && responseTime >= thresholds.error) {
                                status = MonitoringStatus.ERROR;
                            }
                            else if (thresholds.warning !== undefined && responseTime >= thresholds.warning) {
                                status = MonitoringStatus.WARNING;
                            }
                        }
                    }
                    catch (error) {
                        if (axios.isAxiosError(error)) {
                            if (error.code === 'ECONNABORTED') {
                                status = MonitoringStatus.CRITICAL;
                                details = { error: 'Timeout' };
                            }
                            else if (error.response) {
                                status = MonitoringStatus.ERROR;
                                details = {
                                    statusCode: error.response.status,
                                    statusText: error.response.statusText
                                };
                            }
                            else {
                                status = MonitoringStatus.CRITICAL;
                                details = { error: error.message };
                            }
                        }
                        else {
                            throw error;
                        }
                    }
                }
                else if (targetResource.startsWith('service:')) {
                    // Verificar estado de servicio interno
                    const service = targetResource.split(':')[1];
                    // Aquí se implementaría la lógica real para verificar servicios internos
                    // Este es un ejemplo simulado
                    const serviceStatus = Math.random() > 0.9 ? 'error' : 'ok';
                    status = serviceStatus === 'ok' ? MonitoringStatus.SUCCESS : MonitoringStatus.ERROR;
                    details = { service, status: serviceStatus };
                }
                else {
                    throw new Error(`Tipo de recurso de aplicación no soportado: ${targetResource}`);
                }
                const totalResponseTime = Math.round(performance.now() - startTime);
                return {
                    status,
                    responseTime: responseTime || totalResponseTime,
                    details
                };
            }
            catch (error) {
                ServerLogger.error(`Error en verificación de aplicación:`, error);
                return {
                    status: MonitoringStatus.ERROR,
                    responseTime: Math.round(performance.now() - startTime),
                    errorMessage: error instanceof Error ? error.message : 'Error desconocido'
                };
            }
        });
    }
    /**
     * Verifica experiencia de usuario (tiempos de carga, errores cliente, etc.)
     * @param config Configuración de monitoreo
     * @returns Resultado de la verificación
     */
    checkUserExperience(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = performance.now();
            try {
                const { targetResource, parameters } = config;
                let value;
                let details = {};
                let status = MonitoringStatus.SUCCESS;
                // Implementación según el tipo de métrica de UX
                if (targetResource.startsWith('pageload:')) {
                    // Simulación de tiempo de carga de página
                    const page = targetResource.split(':')[1];
                    value = Math.random() * 5000; // Tiempo en ms
                    details = { page, unit: 'ms' };
                }
                else if (targetResource.startsWith('errors:')) {
                    // Simulación de tasa de errores del cliente
                    const errorType = targetResource.split(':')[1];
                    value = Math.random() * 5; // Porcentaje de errores
                    details = { errorType, unit: '%' };
                }
                else if (targetResource.startsWith('interaction:')) {
                    // Simulación de métricas de interacción
                    const interaction = targetResource.split(':')[1];
                    value = Math.random() * 2000; // Tiempo en ms
                    details = { interaction, unit: 'ms' };
                }
                else {
                    throw new Error(`Tipo de métrica de experiencia de usuario no soportado: ${targetResource}`);
                }
                // Determinar estado según umbrales
                const thresholds = config.alertThresholds;
                if (value !== undefined) {
                    if (thresholds.critical !== undefined && value >= thresholds.critical) {
                        status = MonitoringStatus.CRITICAL;
                    }
                    else if (thresholds.error !== undefined && value >= thresholds.error) {
                        status = MonitoringStatus.ERROR;
                    }
                    else if (thresholds.warning !== undefined && value >= thresholds.warning) {
                        status = MonitoringStatus.WARNING;
                    }
                }
                const responseTime = Math.round(performance.now() - startTime);
                return {
                    status,
                    responseTime,
                    value,
                    details
                };
            }
            catch (error) {
                ServerLogger.error(`Error en verificación de experiencia de usuario:`, error);
                return {
                    status: MonitoringStatus.ERROR,
                    responseTime: Math.round(performance.now() - startTime),
                    errorMessage: error instanceof Error ? error.message : 'Error desconocido'
                };
            }
        });
    }
    /**
     * Guarda un resultado de monitoreo en la base de datos
     * @param configId ID de la configuración
     * @param result Resultado de la verificación
     * @returns Resultado guardado
     */
    saveMonitoringResult(configId, result) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedResult = yield this.prisma.monitoringResult.create({
                    data: {
                        configId,
                        status: result.status,
                        responseTime: result.responseTime,
                        value: result.value,
                        details: result.details || {},
                        errorMessage: result.errorMessage
                    }
                });
                return savedResult;
            }
            catch (error) {
                ServerLogger.error(`Error al guardar resultado de monitoreo para configuración ${configId}:`, error);
                throw new Error('Error al guardar resultado de monitoreo');
            }
        });
    }
    /**
     * Verifica si se debe generar una alerta basada en el resultado de monitoreo
     * @param config Configuración de monitoreo
     * @param result Resultado de la verificación
     * @returns Alerta generada o null
     */
    checkForAlerts(config, result) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Determinar si se debe generar una alerta según el estado
                let severity = null;
                switch (result.status) {
                    case MonitoringStatus.CRITICAL:
                        severity = AlertSeverity.CRITICAL;
                        break;
                    case MonitoringStatus.ERROR:
                        severity = AlertSeverity.ERROR;
                        break;
                    case MonitoringStatus.WARNING:
                        severity = AlertSeverity.WARNING;
                        break;
                    default:
                        // No generar alerta para estado SUCCESS
                        return null;
                }
                // Verificar si ya existe una alerta activa para esta configuración
                const existingAlert = yield this.prisma.alert.findFirst({
                    where: {
                        configId: config.id,
                        status: AlertStatus.ACTIVE
                    }
                });
                if (existingAlert) {
                    // Si ya existe una alerta activa, no crear otra
                    return null;
                }
                // Crear mensaje de alerta
                const message = this.generateAlertMessage(config, result);
                // Crear alerta
                const alert = yield this.prisma.alert.create({
                    data: {
                        configId: config.id,
                        severity,
                        message,
                        details: {
                            result: result.details || {},
                            value: result.value,
                            errorMessage: result.errorMessage
                        },
                        status: AlertStatus.ACTIVE
                    }
                });
                // Enviar notificaciones
                yield this.sendAlertNotifications(alert);
                return alert;
            }
            catch (error) {
                ServerLogger.error(`Error al verificar alertas para configuración ${config.id}:`, error);
                // No propagar el error para no interrumpir el flujo principal
                return null;
            }
        });
    }
    /**
     * Genera un mensaje descriptivo para una alerta
     * @param config Configuración de monitoreo
     * @param result Resultado de la verificación
     * @returns Mensaje de alerta
     */
    generateAlertMessage(config, result) {
        var _a;
        const resourceName = config.name;
        const status = result.status;
        let message = `[${status}] ${resourceName}: `;
        if (result.errorMessage) {
            message += result.errorMessage;
        }
        else if (result.value !== undefined) {
            message += `Valor ${result.value}`;
            if ((_a = result.details) === null || _a === void 0 ? void 0 : _a.unit) {
                message += ` ${result.details.unit}`;
            }
        }
        else {
            message += 'Problema detectado';
        }
        return message;
    }
    /**
     * Envía notificaciones para una alerta
     * @param alert Alerta generada
     */
    sendAlertNotifications(alert) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener configuración de monitoreo
                const config = yield this.getMonitoringConfigById(alert.configId);
                // Obtener destinatarios de notificaciones (esto dependería de la implementación específica)
                const recipients = yield this.getAlertRecipients(config);
                for (const recipient of recipients) {
                    try {
                        // Enviar notificación según el canal
                        let status = 'SENT';
                        let errorMessage = null;
                        try {
                            switch (recipient.channel) {
                                case NotificationChannel.EMAIL:
                                    yield this.notificationService.sendEmail({
                                        to: recipient.address,
                                        subject: `Alerta: ${alert.message}`,
                                        body: this.formatAlertEmailBody(alert, config)
                                    });
                                    break;
                                case NotificationChannel.SMS:
                                    yield this.notificationService.sendSMS({
                                        to: recipient.address,
                                        message: alert.message
                                    });
                                    break;
                                case NotificationChannel.WEBHOOK:
                                    yield axios.post(recipient.address, {
                                        alert: {
                                            id: alert.id,
                                            severity: alert.severity,
                                            message: alert.message,
                                            details: alert.details,
                                            timestamp: alert.timestamp
                                        },
                                        config: {
                                            id: config.id,
                                            name: config.name,
                                            type: config.monitoringType,
                                            resource: config.targetResource
                                        }
                                    });
                                    break;
                                default:
                                    throw new Error(`Canal de notificación no soportado: ${recipient.channel}`);
                            }
                        }
                        catch (error) {
                            status = 'FAILED';
                            errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                        }
                        // Registrar notificación
                        yield this.prisma.notificationLog.create({
                            data: {
                                alertId: alert.id,
                                channel: recipient.channel,
                                recipient: recipient.address,
                                status,
                                errorMessage
                            }
                        });
                    }
                    catch (error) {
                        ServerLogger.error(`Error al enviar notificación a ${recipient.address}:`, error);
                        // Continuar con el siguiente destinatario
                    }
                }
            }
            catch (error) {
                ServerLogger.error(`Error al enviar notificaciones para alerta ${alert.id}:`, error);
                // No propagar el error para no interrumpir el flujo principal
            }
        });
    }
    /**
     * Obtiene los destinatarios de notificaciones para una configuración
     * @param config Configuración de monitoreo
     * @returns Lista de destinatarios
     */
    getAlertRecipients(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // Esta implementación dependería de la lógica específica de la aplicación
            // Por ejemplo, podría obtener administradores del sistema, usuarios suscritos, etc.
            // Ejemplo simplificado
            return [
                { channel: NotificationChannel.EMAIL, address: 'admin@example.com' },
                { channel: NotificationChannel.EMAIL, address: 'alerts@example.com' },
                // Otros destinatarios...
            ];
        });
    }
    /**
     * Formatea el cuerpo de un email de alerta
     * @param alert Alerta generada
     * @param config Configuración de monitoreo
     * @returns Cuerpo del email formateado
     */
    formatAlertEmailBody(alert, config) {
        return `
      <h2>Alerta de Monitoreo</h2>
      <p><strong>Severidad:</strong> ${alert.severity}</p>
      <p><strong>Mensaje:</strong> ${alert.message}</p>
      <p><strong>Fecha y hora:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
      <h3>Detalles</h3>
      <p><strong>Recurso monitoreado:</strong> ${config.name} (${config.targetResource})</p>
      <p><strong>Tipo de monitoreo:</strong> ${config.monitoringType}</p>
      ${alert.details ? `<pre>${JSON.stringify(alert.details, null, 2)}</pre>` : ''}
      <p>Acceda al <a href="#">panel de monitoreo</a> para más información.</p>
    `;
    }
    /**
     * Obtiene alertas activas
     * @param includeAcknowledged Incluir alertas reconocidas
     * @returns Lista de alertas
     */
    getActiveAlerts() {
        return __awaiter(this, arguments, void 0, function* (includeAcknowledged = false) {
            try {
                const statuses = includeAcknowledged
                    ? [AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED]
                    : [AlertStatus.ACTIVE];
                const alerts = yield this.prisma.alert.findMany({
                    where: {
                        status: { in: statuses },
                        config: {
                            tenantId: this.tenantId
                        }
                    },
                    include: {
                        config: {
                            select: {
                                name: true,
                                monitoringType: true,
                                targetResource: true
                            }
                        }
                    },
                    orderBy: [
                        { severity: 'desc' },
                        { timestamp: 'desc' }
                    ]
                });
                return alerts;
            }
            catch (error) {
                ServerLogger.error('Error al obtener alertas activas:', error);
                throw new Error('Error al obtener alertas');
            }
        });
    }
    /**
     * Reconoce una alerta
     * @param alertId ID de la alerta
     * @param userId ID del usuario que reconoce la alerta
     * @returns Alerta actualizada
     */
    acknowledgeAlert(alertId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const alert = yield this.prisma.alert.update({
                    where: { id: alertId },
                    data: {
                        status: AlertStatus.ACKNOWLEDGED,
                        acknowledgedById: userId,
                        acknowledgedAt: new Date()
                    }
                });
                ServerLogger.info(`Alerta ${alertId} reconocida por usuario ${userId}`);
                return alert;
            }
            catch (error) {
                ServerLogger.error(`Error al reconocer alerta ${alertId}:`, error);
                throw new Error('Error al reconocer alerta');
            }
        });
    }
    /**
     * Resuelve una alerta
     * @param alertId ID de la alerta
     * @param userId ID del usuario que resuelve la alerta
     * @returns Alerta actualizada
     */
    resolveAlert(alertId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const alert = yield this.prisma.alert.update({
                    where: { id: alertId },
                    data: {
                        status: AlertStatus.RESOLVED,
                        resolvedAt: new Date()
                    }
                });
                ServerLogger.info(`Alerta ${alertId} resuelta por usuario ${userId}`);
                return alert;
            }
            catch (error) {
                ServerLogger.error(`Error al resolver alerta ${alertId}:`, error);
                throw new Error('Error al resolver alerta');
            }
        });
    }
    /**
     * Obtiene el historial de resultados de monitoreo para una configuración
     * @param configId ID de la configuración
     * @param limit Límite de resultados
     * @param offset Desplazamiento para paginación
     * @returns Lista de resultados
     */
    getMonitoringResults(configId_1) {
        return __awaiter(this, arguments, void 0, function* (configId, limit = 100, offset = 0) {
            try {
                const results = yield this.prisma.monitoringResult.findMany({
                    where: { configId },
                    orderBy: { timestamp: 'desc' },
                    take: limit,
                    skip: offset
                });
                return results;
            }
            catch (error) {
                ServerLogger.error(`Error al obtener resultados de monitoreo para configuración ${configId}:`, error);
                throw new Error('Error al obtener resultados de monitoreo');
            }
        });
    }
    /**
     * Obtiene estadísticas de monitoreo para una configuración
     * @param configId ID de la configuración
     * @param days Número de días para las estadísticas
     * @returns Estadísticas de monitoreo
     */
    getMonitoringStats(configId_1) {
        return __awaiter(this, arguments, void 0, function* (configId, days = 7) {
            try {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - days);
                // Obtener todos los resultados en el período
                const results = yield this.prisma.monitoringResult.findMany({
                    where: {
                        configId,
                        timestamp: { gte: startDate }
                    },
                    orderBy: { timestamp: 'asc' }
                });
                // Calcular estadísticas
                const totalChecks = results.length;
                const successChecks = results.filter(r => r.status === MonitoringStatus.SUCCESS).length;
                const warningChecks = results.filter(r => r.status === MonitoringStatus.WARNING).length;
                const errorChecks = results.filter(r => r.status === MonitoringStatus.ERROR).length;
                const criticalChecks = results.filter(r => r.status === MonitoringStatus.CRITICAL).length;
                // Calcular disponibilidad
                const availability = totalChecks > 0
                    ? (successChecks / totalChecks) * 100
                    : 0;
                // Calcular tiempo de respuesta promedio
                const responseTimes = results
                    .filter(r => r.responseTime !== null && r.responseTime !== undefined)
                    .map(r => r.responseTime);
                const avgResponseTime = responseTimes.length > 0
                    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
                    : 0;
                // Agrupar por día para gráficos
                const dailyStats = this.groupResultsByDay(results, startDate, new Date());
                return {
                    totalChecks,
                    successChecks,
                    warningChecks,
                    errorChecks,
                    criticalChecks,
                    availability,
                    avgResponseTime,
                    dailyStats
                };
            }
            catch (error) {
                ServerLogger.error(`Error al obtener estadísticas de monitoreo para configuración ${configId}:`, error);
                throw new Error('Error al obtener estadísticas de monitoreo');
            }
        });
    }
    /**
     * Agrupa resultados de monitoreo por día
     * @param results Resultados de monitoreo
     * @param startDate Fecha de inicio
     * @param endDate Fecha de fin
     * @returns Estadísticas agrupadas por día
     */
    groupResultsByDay(results, startDate, endDate) {
        const dailyStats = [];
        const currentDate = new Date(startDate);
        // Iterar por cada día en el rango
        while (currentDate <= endDate) {
            const dayStart = new Date(currentDate);
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            // Filtrar resultados para este día
            const dayResults = results.filter(r => {
                const timestamp = new Date(r.timestamp);
                return timestamp >= dayStart && timestamp <= dayEnd;
            });
            // Calcular estadísticas del día
            const totalChecks = dayResults.length;
            const successChecks = dayResults.filter(r => r.status === MonitoringStatus.SUCCESS).length;
            const warningChecks = dayResults.filter(r => r.status === MonitoringStatus.WARNING).length;
            const errorChecks = dayResults.filter(r => r.status === MonitoringStatus.ERROR).length;
            const criticalChecks = dayResults.filter(r => r.status === MonitoringStatus.CRITICAL).length;
            // Calcular disponibilidad del día
            const availability = totalChecks > 0
                ? (successChecks / totalChecks) * 100
                : 0;
            // Calcular tiempo de respuesta promedio del día
            const responseTimes = dayResults
                .filter(r => r.responseTime !== null && r.responseTime !== undefined)
                .map(r => r.responseTime);
            const avgResponseTime = responseTimes.length > 0
                ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
                : 0;
            // Añadir estadísticas del día
            dailyStats.push({
                date: new Date(currentDate).toISOString().split('T')[0],
                totalChecks,
                successChecks,
                warningChecks,
                errorChecks,
                criticalChecks,
                availability,
                avgResponseTime
            });
            // Avanzar al siguiente día
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dailyStats;
    }
}
