// src/hooks/useDigitalLogs.ts
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
export function useDigitalLogs() {
    const [digitalLogs, setDigitalLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const createLog = useCallback((data) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.post('/security/digital-logs', data);
            if (response.success) {
                // Actualizar lista local
                setDigitalLogs(prev => [response.digitalLog, ...prev]);
                return true;
            }
            throw new Error(response.message || 'Error creando minuta');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error creando minuta digital';
            setError(errorMessage);
            console.error('Error creando minuta:', err);
            return false;
        }
        finally {
            setLoading(false);
        }
    }), []);
    const updateLog = useCallback((id, updates) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.put(`/security/digital-logs/${id}`, updates);
            if (response.success) {
                // Actualizar en lista local
                setDigitalLogs(prev => prev.map(log => log.id === id ? Object.assign(Object.assign({}, log), response.digitalLog) : log));
                // Actualizar log seleccionado si corresponde
                if ((selectedLog === null || selectedLog === void 0 ? void 0 : selectedLog.id) === id) {
                    setSelectedLog(Object.assign(Object.assign({}, selectedLog), response.digitalLog));
                }
                return true;
            }
            throw new Error(response.message || 'Error actualizando minuta');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error actualizando minuta';
            setError(errorMessage);
            console.error('Error actualizando minuta:', err);
            return false;
        }
        finally {
            setLoading(false);
        }
    }), [selectedLog]);
    const deleteLog = useCallback((id) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.delete(`/security/digital-logs/${id}`);
            if (response.success) {
                // Remover de lista local
                setDigitalLogs(prev => prev.filter(log => log.id !== id));
                // Limpiar selección si era el log eliminado
                if ((selectedLog === null || selectedLog === void 0 ? void 0 : selectedLog.id) === id) {
                    setSelectedLog(null);
                }
                return true;
            }
            throw new Error(response.message || 'Error eliminando minuta');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error eliminando minuta';
            setError(errorMessage);
            console.error('Error eliminando minuta:', err);
            return false;
        }
        finally {
            setLoading(false);
        }
    }), [selectedLog]);
    const getLog = useCallback((id) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.get(`/security/digital-logs/${id}`);
            if (response.success) {
                return response.digitalLog;
            }
            throw new Error(response.message || 'Error obteniendo minuta');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error obteniendo minuta';
            setError(errorMessage);
            console.error('Error obteniendo minuta:', err);
            return null;
        }
    }), []);
    const searchLogs = useCallback((filters) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            });
            const response = yield apiClient.get(`/security/digital-logs?${params.toString()}`);
            if (response.success) {
                setDigitalLogs(response.digitalLogs);
                setPagination(response.pagination);
            }
            else {
                throw new Error(response.message || 'Error buscando minutas');
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error buscando minutas';
            setError(errorMessage);
            console.error('Error buscando minutas:', err);
        }
        finally {
            setLoading(false);
        }
    }), []);
    const loadLogs = useCallback((...args_1) => __awaiter(this, [...args_1], void 0, function* (page = 1) {
        yield searchLogs({ page, limit: 20 });
    }), [searchLogs]);
    const reviewLog = useCallback((id, reviewNotes) => __awaiter(this, void 0, void 0, function* () {
        return yield updateLog(id, {
            supervisorReview: true,
            reviewNotes,
            status: 'IN_REVIEW'
        });
    }), [updateLog]);
    const getLogStats = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            // Para este ejemplo, calculamos estadísticas desde los logs cargados
            const stats = {
                total: digitalLogs.length,
                byStatus: digitalLogs.reduce((acc, log) => {
                    acc[log.status] = (acc[log.status] || 0) + 1;
                    return acc;
                }, {}),
                byPriority: digitalLogs.reduce((acc, log) => {
                    acc[log.priority] = (acc[log.priority] || 0) + 1;
                    return acc;
                }, {}),
                byCategory: digitalLogs.reduce((acc, log) => {
                    acc[log.category] = (acc[log.category] || 0) + 1;
                    return acc;
                }, {}),
                pending: digitalLogs.filter(log => ['OPEN', 'IN_REVIEW'].includes(log.status)).length,
                requiresFollowUp: digitalLogs.filter(log => log.requiresFollowUp).length
            };
            return stats;
        }
        catch (err) {
            console.error('Error obteniendo estadísticas:', err);
            return null;
        }
    }), [digitalLogs]);
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    // Cargar logs al montar
    useEffect(() => {
        loadLogs();
    }, [loadLogs]);
    return {
        // Estado
        digitalLogs,
        selectedLog,
        loading,
        error,
        pagination,
        // CRUD
        createLog,
        updateLog,
        deleteLog,
        getLog,
        // Búsqueda
        searchLogs,
        loadLogs,
        // Revisión
        reviewLog,
        // Control local
        setSelectedLog,
        clearError,
        // Estadísticas
        getLogStats
    };
}
export default useDigitalLogs;
