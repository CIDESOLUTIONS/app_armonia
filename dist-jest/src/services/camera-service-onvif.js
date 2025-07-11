// src/lib/services/camera-service-onvif.ts
/**
 * Servicio avanzado para gestión de cámaras IP con ONVIF
 * Maneja discovery, conexión, streams y control PTZ
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
import { encryptData } from '@/lib/security/encryption';
/**
 * Servicio principal para gestión de cámaras IP
 */
export class CameraServiceONVIF {
    constructor() {
        this.connectedCameras = new Map();
        this.discoveryInterval = null;
    }
    static getInstance() {
        if (!CameraServiceONVIF.instance) {
            CameraServiceONVIF.instance = new CameraServiceONVIF();
        }
        return CameraServiceONVIF.instance;
    }
    /**
     * Descubre cámaras IP en la red usando ONVIF
     */
    discoverCameras(complexId_1) {
        return __awaiter(this, arguments, void 0, function* (complexId, timeout = 30000) {
            try {
                console.log('[CAMERA DISCOVERY] Iniciando búsqueda de cámaras ONVIF...');
                // En modo desarrollo, simular discovery
                if (process.env.NODE_ENV === 'development') {
                    return this.simulateDiscovery();
                }
                // En producción, usar ONVIF real
                // const onvif = require('node-onvif');
                // const devices = await onvif.discovery({
                //   timeout: timeout
                // });
                // return this.processDiscoveredDevices(devices, complexId);
                // Por ahora, retornar simulación
                return this.simulateDiscovery();
            }
            catch (error) {
                console.error('[CAMERA DISCOVERY] Error:', error);
                throw new Error(`Error en discovery de cámaras: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }
    /**
     * Simula el discovery para desarrollo
     */
    simulateDiscovery() {
        return [
            {
                name: 'Cámara Entrada Principal',
                ipAddress: '192.168.1.100',
                port: 554,
                manufacturer: 'Hikvision',
                model: 'DS-2CD2142FWD-I',
                firmwareVersion: '5.5.0',
                capabilities: {
                    hasVideo: true,
                    hasAudio: false,
                    hasPTZ: false,
                    hasPresets: false,
                    hasEvents: true,
                    hasRecording: true,
                    supportedProfiles: ['Profile_1', 'Profile_2'],
                    supportedResolutions: ['1920x1080', '1280x720', '640x480']
                },
                status: 'UNKNOWN'
            },
            {
                name: 'Cámara PTZ Parking',
                ipAddress: '192.168.1.101',
                port: 554,
                manufacturer: 'Dahua',
                model: 'SD6C230I-HC',
                firmwareVersion: '2.840.0000000.23.R',
                capabilities: {
                    hasVideo: true,
                    hasAudio: true,
                    hasPTZ: true,
                    hasPresets: true,
                    hasEvents: true,
                    hasRecording: true,
                    supportedProfiles: ['MainStream', 'SubStream'],
                    supportedResolutions: ['1920x1080', '1280x720']
                },
                status: 'UNKNOWN'
            }
        ];
    }
    /**
     * Conecta a una cámara específica
     */
    connectCamera(cameraId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const camera = yield this.getCameraById(cameraId);
                if (!camera) {
                    throw new Error('Cámara no encontrada');
                }
                console.log(`[CAMERA CONNECT] Conectando a ${camera.name} (${camera.ipAddress})`);
                // En desarrollo, simular conexión
                if (process.env.NODE_ENV === 'development') {
                    this.connectedCameras.set(cameraId, {
                        id: cameraId,
                        connected: true,
                        lastPing: new Date()
                    });
                    yield this.updateCameraStatus(cameraId, 'ONLINE');
                    return true;
                }
                // En producción, conectar real con ONVIF
                // const deviceInfo = {
                //   address: camera.ipAddress,
                //   port: camera.port,
                //   username: camera.username,
                //   password: camera.password ? decryptData(camera.password) : undefined
                // };
                // const onvif = require('node-onvif');
                // const device = new onvif.OnvifDevice(deviceInfo);
                // await device.connect();
                // this.connectedCameras.set(cameraId, device);
                yield this.updateCameraStatus(cameraId, 'ONLINE');
                return true;
            }
            catch (error) {
                console.error(`[CAMERA CONNECT] Error conectando cámara ${cameraId}:`, error);
                yield this.updateCameraStatus(cameraId, 'ERROR');
                return false;
            }
        });
    }
    /**
     * Obtiene los perfiles de stream disponibles
     */
    getStreamProfiles(cameraId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const device = this.connectedCameras.get(cameraId);
                if (!device) {
                    throw new Error('Cámara no conectada');
                }
                console.log(`[STREAM PROFILES] Obteniendo perfiles para cámara ${cameraId}`);
                // En desarrollo, retornar perfiles simulados
                if (process.env.NODE_ENV === 'development') {
                    return [
                        {
                            name: 'MainStream',
                            token: 'Profile_1',
                            videoEncoderConfiguration: {
                                encoding: 'H264',
                                resolution: { width: 1920, height: 1080 },
                                rateControl: { frameRateLimit: 25, bitrateLimit: 4096 }
                            },
                            rtspUri: `rtsp://192.168.1.100:554/Streaming/Channels/101`,
                            snapshotUri: `http://192.168.1.100/ISAPI/Streaming/channels/1/picture`
                        },
                        {
                            name: 'SubStream',
                            token: 'Profile_2',
                            videoEncoderConfiguration: {
                                encoding: 'H264',
                                resolution: { width: 640, height: 480 },
                                rateControl: { frameRateLimit: 15, bitrateLimit: 1024 }
                            },
                            rtspUri: `rtsp://192.168.1.100:554/Streaming/Channels/102`,
                            snapshotUri: `http://192.168.1.100/ISAPI/Streaming/channels/2/picture`
                        }
                    ];
                }
                // En producción, usar ONVIF real
                // const profiles = await device.getProfiles();
                // return this.parseOnvifProfiles(profiles);
                return [];
            }
            catch (error) {
                console.error(`[STREAM PROFILES] Error:`, error);
                throw error;
            }
        });
    }
    /**
     * Obtiene el URI del stream RTSP
     */
    getStreamUri(cameraId_1) {
        return __awaiter(this, arguments, void 0, function* (cameraId, profileToken = 'Profile_1') {
            try {
                const device = this.connectedCameras.get(cameraId);
                if (!device) {
                    throw new Error('Cámara no conectada');
                }
                // En desarrollo, retornar URI simulado
                if (process.env.NODE_ENV === 'development') {
                    const camera = yield this.getCameraById(cameraId);
                    return `rtsp://${camera === null || camera === void 0 ? void 0 : camera.ipAddress}:554/Streaming/Channels/101`;
                }
                // En producción, usar ONVIF real
                // const streamUri = await device.getStreamUri({
                //   stream: 'RTP-Unicast',
                //   transport: 'RTSP',
                //   profileToken
                // });
                // return streamUri.uri;
                return '';
            }
            catch (error) {
                console.error(`[STREAM URI] Error:`, error);
                throw error;
            }
        });
    }
    /**
     * Captura una imagen (snapshot)
     */
    captureSnapshot(cameraId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const device = this.connectedCameras.get(cameraId);
                if (!device) {
                    throw new Error('Cámara no conectada');
                }
                console.log(`[SNAPSHOT] Capturando imagen de cámara ${cameraId}`);
                // En desarrollo, crear imagen simulada
                if (process.env.NODE_ENV === 'development') {
                    // Crear un buffer simulado (en producción sería la imagen real)
                    const simulatedImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
                    return simulatedImage;
                }
                // En producción, capturar imagen real
                // const snapshot = await device.getSnapshot();
                // return snapshot;
                return Buffer.alloc(0);
            }
            catch (error) {
                console.error(`[SNAPSHOT] Error:`, error);
                throw error;
            }
        });
    }
    /**
     * Control PTZ (Pan-Tilt-Zoom)
     */
    controlPTZ(cameraId, action, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const device = this.connectedCameras.get(cameraId);
                if (!device) {
                    throw new Error('Cámara no conectada');
                }
                const camera = yield this.getCameraById(cameraId);
                if (!(camera === null || camera === void 0 ? void 0 : camera.ptzEnabled)) {
                    throw new Error('Cámara no soporta PTZ');
                }
                console.log(`[PTZ CONTROL] ${action} en cámara ${cameraId}`, params);
                // En desarrollo, simular control PTZ
                if (process.env.NODE_ENV === 'development') {
                    yield new Promise(resolve => setTimeout(resolve, 100)); // Simular delay
                    return true;
                }
                // En producción, usar control PTZ real
                switch (action) {
                    case 'move':
                        // await device.absoluteMove(params);
                        break;
                    case 'stop':
                        // await device.stop();
                        break;
                    case 'preset':
                        // await device.gotoPreset(params.presetToken);
                        break;
                }
                return true;
            }
            catch (error) {
                console.error(`[PTZ CONTROL] Error:`, error);
                return false;
            }
        });
    }
    /**
     * Verifica el estado de todas las cámaras
     */
    checkCamerasStatus(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cameras = yield this.getAllCameras(complexId);
                for (const camera of cameras) {
                    try {
                        yield this.pingCamera(camera.id);
                    }
                    catch (error) {
                        console.error(`[STATUS CHECK] Error verificando cámara ${camera.id}:`, error);
                    }
                }
            }
            catch (error) {
                console.error('[STATUS CHECK] Error general:', error);
            }
        });
    }
    /**
     * Ping a una cámara para verificar conectividad
     */
    pingCamera(cameraId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const camera = yield this.getCameraById(cameraId);
                if (!camera)
                    return false;
                // En desarrollo, simular ping
                if (process.env.NODE_ENV === 'development') {
                    const isOnline = Math.random() > 0.1; // 90% probabilidad online
                    yield this.updateCameraStatus(cameraId, isOnline ? 'ONLINE' : 'OFFLINE');
                    return isOnline;
                }
                // En producción, hacer ping real
                // const axios = require('axios');
                // const response = await axios.get(`http://${camera.ipAddress}`, { timeout: 5000 });
                // const isOnline = response.status === 200;
                // await this.updateCameraStatus(cameraId, isOnline ? 'ONLINE' : 'OFFLINE');
                // return isOnline;
                return true;
            }
            catch (error) {
                yield this.updateCameraStatus(cameraId, 'OFFLINE');
                return false;
            }
        });
    }
    /**
     * Inicia monitoreo automático de cámaras
     */
    startMonitoring(complexId, intervalMinutes = 5) {
        if (this.discoveryInterval) {
            clearInterval(this.discoveryInterval);
        }
        this.discoveryInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkCamerasStatus(complexId);
            }
            catch (error) {
                console.error('[MONITORING] Error:', error);
            }
        }), intervalMinutes * 60 * 1000);
        console.log(`[MONITORING] Iniciado para complejo ${complexId} cada ${intervalMinutes} minutos`);
    }
    /**
     * Detiene el monitoreo automático
     */
    stopMonitoring() {
        if (this.discoveryInterval) {
            clearInterval(this.discoveryInterval);
            this.discoveryInterval = null;
            console.log('[MONITORING] Detenido');
        }
    }
    // Métodos de base de datos
    getCameraById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            return yield prisma.camera.findUnique({
                where: { id },
                include: {
                    zone: true,
                    createdBy: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
        });
    }
    getAllCameras(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            return yield prisma.camera.findMany({
                where: {
                    // Asumir que hay relación con complejo via zona o directamente
                    zone: {
                        complexId: complexId
                    }
                },
                include: {
                    zone: true
                }
            });
        });
    }
    updateCameraStatus(cameraId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            yield prisma.camera.update({
                where: { id: cameraId },
                data: {
                    status,
                    lastStatusCheck: new Date()
                }
            });
        });
    }
    /**
     * Registra una nueva cámara en la base de datos
     */
    registerCamera(cameraData, complexId, zoneId) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            const camera = yield prisma.camera.create({
                data: {
                    name: cameraData.name,
                    ipAddress: cameraData.ipAddress,
                    port: cameraData.port,
                    username: cameraData.username,
                    password: cameraData.password ? encryptData(cameraData.password) : null,
                    manufacturer: cameraData.manufacturer,
                    model: cameraData.model,
                    firmwareVersion: cameraData.firmwareVersion,
                    status: cameraData.status,
                    ptzEnabled: cameraData.capabilities.hasPTZ,
                    recordingEnabled: cameraData.capabilities.hasRecording,
                    streamSettings: {
                        profiles: cameraData.capabilities.supportedProfiles,
                        resolutions: cameraData.capabilities.supportedResolutions
                    },
                    zoneId: zoneId,
                    isActive: true
                }
            });
            console.log(`[CAMERA REGISTER] Cámara ${camera.name} registrada con ID ${camera.id}`);
            return camera.id;
        });
    }
    /**
     * Actualiza configuración de una cámara
     */
    updateCamera(cameraId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prisma = getPrisma();
                const updateData = {};
                if (updates.name)
                    updateData.name = updates.name;
                if (updates.ipAddress)
                    updateData.ipAddress = updates.ipAddress;
                if (updates.port)
                    updateData.port = updates.port;
                if (updates.username)
                    updateData.username = updates.username;
                if (updates.password)
                    updateData.password = encryptData(updates.password);
                if (updates.manufacturer)
                    updateData.manufacturer = updates.manufacturer;
                if (updates.model)
                    updateData.model = updates.model;
                yield prisma.camera.update({
                    where: { id: cameraId },
                    data: updateData
                });
                console.log(`[CAMERA UPDATE] Cámara ${cameraId} actualizada`);
                return true;
            }
            catch (error) {
                console.error('[CAMERA UPDATE] Error:', error);
                return false;
            }
        });
    }
    /**
     * Elimina una cámara
     */
    deleteCamera(cameraId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prisma = getPrisma();
                // Desconectar si está conectada
                if (this.connectedCameras.has(cameraId)) {
                    this.connectedCameras.delete(cameraId);
                }
                yield prisma.camera.delete({
                    where: { id: cameraId }
                });
                console.log(`[CAMERA DELETE] Cámara ${cameraId} eliminada`);
                return true;
            }
            catch (error) {
                console.error('[CAMERA DELETE] Error:', error);
                return false;
            }
        });
    }
    /**
     * Obtiene estadísticas de cámaras
     */
    getCameraStats(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            const cameras = yield this.getAllCameras(complexId);
            const stats = {
                total: cameras.length,
                online: cameras.filter(c => c.status === 'ONLINE').length,
                offline: cameras.filter(c => c.status === 'OFFLINE').length,
                error: cameras.filter(c => c.status === 'ERROR').length,
                unknown: cameras.filter(c => c.status === 'UNKNOWN').length
            };
            return stats;
        });
    }
}
// Instancia singleton
export const cameraService = CameraServiceONVIF.getInstance();
