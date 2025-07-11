// src/hooks/useResidents.ts
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
export function useResidents({ page = 1, limit = 10, search, status, autoLoad = true } = {}) {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const loadResidents = useCallback((...args_1) => __awaiter(this, [...args_1], void 0, function* (currentPage = page) {
        try {
            setLoading(true);
            setError(null);
            const params = {
                page: currentPage,
                limit,
            };
            if (search)
                params.search = search;
            if (status)
                params.status = status;
            const response = yield apiClient.residents.list(params);
            setResidents(response.data);
            setPagination(response.pagination || null);
        }
        catch (err) {
            console.error('Error loading residents:', err);
            setError(err instanceof Error ? err.message : 'Error cargando residentes');
        }
        finally {
            setLoading(false);
        }
    }), [page, limit, search, status]);
    const refresh = useCallback(() => loadResidents((pagination === null || pagination === void 0 ? void 0 : pagination.page) || 1), [loadResidents, pagination]);
    const loadPage = useCallback((newPage) => __awaiter(this, void 0, void 0, function* () {
        yield loadResidents(newPage);
    }), [loadResidents]);
    const createResident = useCallback((residentData) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.residents.create(residentData);
            yield refresh();
            return response.data;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error creando residente';
            setError(errorMessage);
            throw err;
        }
    }), [refresh]);
    const updateResident = useCallback((id, updates) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.put(`/inventory/residents/${id}`, updates);
            setResidents(prevResidents => prevResidents.map(resident => resident.id === id ? Object.assign(Object.assign({}, resident), response.data) : resident));
            return response.data;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error actualizando residente';
            setError(errorMessage);
            throw err;
        }
    }), []);
    const deleteResident = useCallback((id) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            yield apiClient.delete(`/inventory/residents/${id}`);
            setResidents(prevResidents => prevResidents.filter(resident => resident.id !== id));
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error eliminando residente';
            setError(errorMessage);
            throw err;
        }
    }), []);
    useEffect(() => {
        if (autoLoad) {
            loadResidents();
        }
    }, [loadResidents, autoLoad]);
    return {
        residents,
        loading,
        error,
        pagination,
        refresh,
        loadPage,
        createResident,
        updateResident,
        deleteResident,
    };
}
export default useResidents;
