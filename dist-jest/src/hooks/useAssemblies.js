// src/hooks/useAssemblies.ts
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
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
export function useAssemblies({ page = 1, limit = 10, status, type, autoLoad = true } = {}) {
    const [assemblies, setAssemblies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const loadAssemblies = useCallback((...args_1) => __awaiter(this, [...args_1], void 0, function* (currentPage = page) {
        try {
            setLoading(true);
            setError(null);
            const params = {
                page: currentPage,
                limit,
            };
            if (status)
                params.status = status;
            if (type)
                params.type = type;
            const response = yield apiClient.assemblies.list(params);
            setAssemblies(response.data);
            setPagination(response.pagination || null);
        }
        catch (err) {
            console.error('Error loading assemblies:', err);
            setError(err instanceof Error ? err.message : 'Error cargando asambleas');
        }
        finally {
            setLoading(false);
        }
    }), [page, limit, status, type]);
    const refresh = useCallback(() => loadAssemblies((pagination === null || pagination === void 0 ? void 0 : pagination.page) || 1), [loadAssemblies, pagination]);
    const loadPage = useCallback((newPage) => __awaiter(this, void 0, void 0, function* () {
        yield loadAssemblies(newPage);
    }), [loadAssemblies]);
    const createAssembly = useCallback((assemblyData) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.assemblies.create(assemblyData);
            yield refresh();
            return response.data;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error creando asamblea';
            setError(errorMessage);
            throw err;
        }
    }), [refresh]);
    const updateAssembly = useCallback((id, updates) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.put(`/assemblies/${id}`, updates);
            setAssemblies(prevAssemblies => prevAssemblies.map(assembly => assembly.id === id ? Object.assign(Object.assign({}, assembly), response.data) : assembly));
            return response.data;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error actualizando asamblea';
            setError(errorMessage);
            throw err;
        }
    }), []);
    const deleteAssembly = useCallback((id) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            yield apiClient.delete(`/assemblies/${id}`);
            setAssemblies(prevAssemblies => prevAssemblies.filter(assembly => assembly.id !== id));
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error eliminando asamblea';
            setError(errorMessage);
            throw err;
        }
    }), []);
    const getAssemblyById = useCallback((id) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.get(`/assemblies/${id}`);
            return response.data;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error obteniendo asamblea';
            setError(errorMessage);
            throw err;
        }
    }), []);
    const registerAttendance = useCallback((assemblyId, residentId) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            yield apiClient.post(`/assemblies/${assemblyId}/attendance`, { residentId });
            // Update local state to reflect new attendance
            setAssemblies(prevAssemblies => prevAssemblies.map(assembly => assembly.id === assemblyId
                ? Object.assign(Object.assign({}, assembly), { currentAttendance: assembly.currentAttendance + 1 }) : assembly));
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error registrando asistencia';
            setError(errorMessage);
            throw err;
        }
    }), []);
    const startAssembly = useCallback((id) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.post(`/assemblies/${id}/start`);
            setAssemblies(prevAssemblies => prevAssemblies.map(assembly => assembly.id === id ? Object.assign(Object.assign({}, assembly), { status: 'IN_PROGRESS' }) : assembly));
            return response.data;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error iniciando asamblea';
            setError(errorMessage);
            throw err;
        }
    }), []);
    const endAssembly = useCallback((id) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.post(`/assemblies/${id}/end`);
            setAssemblies(prevAssemblies => prevAssemblies.map(assembly => assembly.id === id ? Object.assign(Object.assign({}, assembly), { status: 'COMPLETED' }) : assembly));
            return response.data;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error finalizando asamblea';
            setError(errorMessage);
            throw err;
        }
    }), []);
    useEffect(() => {
        if (autoLoad) {
            loadAssemblies();
        }
    }, [loadAssemblies, autoLoad]);
    return {
        assemblies,
        loading,
        error,
        pagination,
        refresh,
        loadPage,
        createAssembly,
        updateAssembly,
        deleteAssembly,
        getAssemblyById,
        registerAttendance,
        startAssembly,
        endAssembly,
    };
}
export default useAssemblies;
