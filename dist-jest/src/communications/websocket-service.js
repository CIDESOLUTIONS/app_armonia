/**
 * @fileoverview Servicio de WebSocket para comunicación en tiempo real.
 */
import WebSocket from 'ws';
import { ServerLogger } from '../lib/logging/server-logger';
const logger = new ServerLogger('WebSocketService');
// Almacenamiento de conexiones activas
const activeConnections = new Map();
/**
 * Inicializa el servidor WebSocket.
 * @param {HttpServer | HttpsServer} server - Servidor HTTP/HTTPS.
 * @returns {WebSocket.Server} - Instancia del servidor WebSocket.
 */
export function initializeWebSocketServer(server) {
    try {
        const wss = new WebSocket.Server({ server });
        wss.on('connection', (ws, req) => {
            const clientId = req.headers['x-client-id'] || generateClientId();
            const schemaName = req.headers['x-schema-name'] || 'default';
            if (!activeConnections.has(schemaName)) {
                activeConnections.set(schemaName, new Map());
            }
            activeConnections.get(schemaName).set(clientId, ws);
            logger.info(`Cliente WebSocket conectado: ${clientId} (Schema: ${schemaName})`);
            ws.send(JSON.stringify({
                type: 'CONNECTION_ESTABLISHED',
                clientId,
                timestamp: new Date().toISOString(),
            }));
            ws.on('message', (message) => {
                try {
                    const parsedMessage = JSON.parse(message);
                    logger.debug(`Mensaje recibido de ${clientId}: ${JSON.stringify(parsedMessage)}`);
                    switch (parsedMessage.type) {
                        case 'PING':
                            ws.send(JSON.stringify({
                                type: 'PONG',
                                timestamp: new Date().toISOString(),
                            }));
                            break;
                        default:
                            logger.warn(`Tipo de mensaje no reconocido: ${parsedMessage.type}`);
                    }
                }
                catch (error) {
                    logger.error(`Error al procesar mensaje WebSocket: ${error.message}`);
                }
            });
            ws.on('close', () => {
                if (activeConnections.has(schemaName)) {
                    activeConnections.get(schemaName).delete(clientId);
                }
                logger.info(`Cliente WebSocket desconectado: ${clientId}`);
            });
            ws.on('error', (error) => {
                logger.error(`Error en conexión WebSocket (${clientId}): ${error.message}`);
            });
        });
        logger.info('Servidor WebSocket inicializado correctamente');
        return wss;
    }
    catch (error) {
        logger.error(`Error al inicializar servidor WebSocket: ${error.message}`);
        throw error;
    }
}
/**
 * Envía una notificación a un cliente específico.
 * @param {string} schemaName - Nombre del esquema.
 * @param {string} clientId - ID del cliente.
 * @param {any} data - Datos a enviar.
 * @returns {boolean} - Éxito de la operación.
 */
export function sendToClient(schemaName, clientId, data) {
    try {
        const schemaConnections = activeConnections.get(schemaName);
        if (!schemaConnections || !schemaConnections.has(clientId)) {
            logger.warn(`Cliente no encontrado: ${clientId} (Schema: ${schemaName})`);
            return false;
        }
        const ws = schemaConnections.get(clientId);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(Object.assign(Object.assign({}, data), { timestamp: new Date().toISOString() })));
            logger.debug(`Mensaje enviado a cliente ${clientId}: ${JSON.stringify(data)}`);
            return true;
        }
        else {
            logger.warn(`Conexión no disponible para cliente ${clientId}`);
            return false;
        }
    }
    catch (error) {
        logger.error(`Error al enviar mensaje a cliente ${clientId}: ${error.message}`);
        return false;
    }
}
/**
 * Envía una notificación a todos los clientes de un esquema.
 * @param {string} schemaName - Nombre del esquema.
 * @param {any} data - Datos a enviar.
 * @returns {number} - Número de clientes notificados.
 */
export function broadcastToSchema(schemaName, data) {
    try {
        const schemaConnections = activeConnections.get(schemaName);
        if (!schemaConnections) {
            logger.warn(`No hay clientes conectados para el schema: ${schemaName}`);
            return 0;
        }
        let notifiedCount = 0;
        schemaConnections.forEach((ws, clientId) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(Object.assign(Object.assign({}, data), { timestamp: new Date().toISOString() })));
                notifiedCount++;
            }
        });
        logger.info(`Broadcast enviado a ${notifiedCount} clientes en schema ${schemaName}`);
        return notifiedCount;
    }
    catch (error) {
        logger.error(`Error en broadcast a schema ${schemaName}: ${error.message}`);
        return 0;
    }
}
/**
 * Genera un ID de cliente único.
 * @returns {string} - ID generado.
 */
function generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
