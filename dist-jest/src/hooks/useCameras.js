// src/hooks/useCameras.ts
'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
export function useCameras() {
    const [cameras, setCameras] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const discoverCameras = useCallback((...args_1) => __awaiter(this, [...args_1], void 0, function* (timeout = 30000) {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.post('/cameras/discovery', { timeout });
            if (response.success) {
                return response.cameras || [];
            }
            throw new Error(response.message || 'Error en discovery');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error descubriendo cámaras';
            setError(errorMessage);
            console.error('Error en discovery:', err);
            return [];
        }
        finally {
            setLoading(false);
        }
    }), []);
    const registerCamera = useCallback((data) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.post('/cameras/manage', data);
            if (response.success) {
                // Recargar lista de cámaras
                yield loadCameras();
                return true;
            }
            throw new Error(response.message || 'Error registrando cámara');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error registrando cámara';
            setError(errorMessage);
            console.error('Error registrando cámara:', err);
            return false;
        }
        finally {
            setLoading(false);
        }
    }), []);
    const updateCamera = useCallback((id, updates) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.put('/cameras/manage', Object.assign({ id }, updates));
            if (response.success) {
                // Actualizar cámara en estado local
                setCameras(prevCameras => prevCameras.map(camera => camera.id === id ? Object.assign(Object.assign({}, camera), updates) : camera));
                return true;
            }
            throw new Error(response.message || 'Error actualizando cámara');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error actualizando cámara';
            setError(errorMessage);
            console.error('Error actualizando cámara:', err);
            return false;
        }
        finally {
            setLoading(false);
        }
    }), []);
    const deleteCamera = useCallback((id) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.delete(`/cameras/manage?id=${id}`);
            if (response.success) {
                // Remover cámara del estado local
                setCameras(prevCameras => prevCameras.filter(camera => camera.id !== id));
                // Actualizar estadísticas
                if (stats) {
                    setStats(prevStats => (Object.assign(Object.assign({}, prevStats), { total: prevStats.total - 1 })));
                }
                return true;
            }
            throw new Error(response.message || 'Error eliminando cámara');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error eliminando cámara';
            setError(errorMessage);
            console.error('Error eliminando cámara:', err);
            return false;
        }
        finally {
            setLoading(false);
        }
    }), [stats]);
    const loadCameras = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            // Por ahora, usar mock data hasta implementar GET endpoint
            const mockCameras = [
                {
                    id: 1,
                    name: 'Cámara Entrada Principal',
                    ipAddress: '192.168.1.100',
                    port: 554,
                    manufacturer: 'Hikvision',
                    model: 'DS-2CD2142FWD-I',
                    status: 'ONLINE',
                    ptzEnabled: false,
                    recordingEnabled: true,
                    isActive: true,
                    lastStatusCheck: new Date().toISOString(),
                    zone: { id: 1, name: 'Entrada' }
                }
            ];
            setCameras(mockCameras);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error cargando cámaras';
            setError(errorMessage);
            console.error('Error cargando cámaras:', err);
        }
    }), [setCameras, setError]);
    const loadStats = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.get('/cameras/discovery');
            if (response.success) {
                setStats(response.stats);
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error cargando estadísticas';
            setError(errorMessage);
            console.error('Error cargando estadísticas:', err);
        }
    }), []);
    const getStreamUrl = useCallback((cameraId, profileToken) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.post('/cameras/stream', {
                cameraId,
                profileToken,
                streamType: 'rtsp'
            });
            if (response.success) {
                return response.streamUri;
            }
            throw new Error(response.message || 'Error obteniendo stream');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error obteniendo stream';
            setError(errorMessage);
            console.error('Error obteniendo stream:', err);
            return null;
        }
    }), []);
    const getStreamProfiles = useCallback((cameraId) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.post('/cameras/stream', {
                cameraId,
                streamType: 'rtsp'
            });
            if (response.success) {
                return response.profiles || [];
            }
            return [];
        }
        catch (err) {
            console.error('Error obteniendo perfiles:', err);
            return [];
        }
    }), []);
    const captureSnapshot = useCallback((cameraId) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            // Hacer request para snapshot
            const response = yield fetch(`/api/cameras/stream?cameraId=${cameraId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const blob = yield response.blob();
                return URL.createObjectURL(blob);
            }
            throw new Error('Error capturando imagen');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error capturando imagen';
            setError(errorMessage);
            console.error('Error capturando snapshot:', err);
            return null;
        }
    }), []);
    const movePTZ = useCallback((cameraId, x, y, z) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.post('/cameras/ptz', {
                cameraId,
                action: 'move',
                params: { x, y, z }
            });
            return response.success;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error moviendo cámara PTZ';
            setError(errorMessage);
            console.error('Error PTZ move:', err);
            return false;
        }
    }), []);
    const stopPTZ = useCallback((cameraId) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.post('/cameras/ptz', {
                cameraId,
                action: 'stop'
            });
            return response.success;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error deteniendo PTZ';
            setError(errorMessage);
            console.error('Error PTZ stop:', err);
            return false;
        }
    }), []);
    const gotoPreset = useCallback((cameraId, presetToken) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.post('/cameras/ptz', {
                cameraId,
                action: 'preset',
                params: { presetToken }
            });
            return response.success;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error yendo a preset';
            setError(errorMessage);
            console.error('Error PTZ preset:', err);
            return false;
        }
    }), []);
    const getPTZCapabilities = useCallback((cameraId) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.get(`/cameras/ptz?cameraId=${cameraId}`);
            if (response.success) {
                return response.ptzCapabilities;
            }
            return null;
        }
        catch (err) {
            console.error('Error obteniendo capacidades PTZ:', err);
            return null;
        }
    }), []);
    const connectCamera = useCallback((cameraId) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Simular conexión exitosa
            setCameras(prevCameras => prevCameras.map(camera => camera.id === cameraId
                ? Object.assign(Object.assign({}, camera), { status: 'ONLINE', lastStatusCheck: new Date().toISOString() }) : camera));
            return true;
        }
        catch (err) {
            console.error('Error conectando cámara:', err);
            return false;
        }
    }), []);
    const checkCameraStatus = useCallback((cameraId) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Simular verificación de estado
            const statuses = ['ONLINE', 'OFFLINE', 'ERROR'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            // Actualizar estado en la lista local
            setCameras(prevCameras => prevCameras.map(camera => camera.id === cameraId
                ? Object.assign(Object.assign({}, camera), { status: randomStatus, lastStatusCheck: new Date().toISOString() }) : camera));
            return randomStatus;
        }
        catch (err) {
            console.error('Error verificando estado:', err);
            return 'ERROR';
        }
    }), []);
    // Cargar datos al montar el componente
    useEffect(() => {
        loadCameras();
        loadStats();
    }, [loadCameras, loadStats]);
    return {
        // Estado
        cameras,
        stats,
        loading,
        error,
        // Discovery
        discoverCameras,
        // Gestión
        registerCamera,
        updateCamera,
        deleteCamera,
        loadCameras,
        loadStats,
        // Streams
        getStreamUrl,
        getStreamProfiles,
        captureSnapshot,
        // PTZ
        movePTZ,
        stopPTZ,
        gotoPreset,
        getPTZCapabilities,
        // Estado
        connectCamera,
        checkCameraStatus
    };
}
export default useCameras;
