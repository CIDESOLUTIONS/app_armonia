// src/hooks/usePQR.ts
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
export function usePQR({ page = 1, limit = 10, status, autoLoad = true } = {}) {
    const [pqrs, setPqrs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const loadPQRs = useCallback((...args_1) => __awaiter(this, [...args_1], void 0, function* (currentPage = page) {
        try {
            setLoading(true);
            setError(null);
            const params = {
                page: currentPage,
                limit,
            };
            if (status) {
                params.status = status;
            }
            const response = yield apiClient.pqr.list(params);
            setPqrs(response.data);
            setPagination(response.pagination || null);
        }
        catch (err) {
            console.error('Error loading PQRs:', err);
            setError(err instanceof Error ? err.message : 'Error loading PQRs');
        }
        finally {
            setLoading(false);
        }
    }), [page, limit, status]);
    const refresh = useCallback(() => loadPQRs((pagination === null || pagination === void 0 ? void 0 : pagination.page) || 1), [loadPQRs, pagination]);
    const loadPage = useCallback((newPage) => __awaiter(this, void 0, void 0, function* () {
        yield loadPQRs(newPage);
    }), [loadPQRs]);
    const createPQR = useCallback((pqrData) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.pqr.create(pqrData);
            // Refresh the list to include the new PQR
            yield refresh();
            return response.data;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error creating PQR';
            setError(errorMessage);
            throw err;
        }
    }), [refresh]);
    const updatePQR = useCallback((id, updates) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.pqr.update(id, updates);
            // Update local state
            setPqrs(prevPqrs => prevPqrs.map(pqr => pqr.id === id ? Object.assign(Object.assign({}, pqr), response.data) : pqr));
            return response.data;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error updating PQR';
            setError(errorMessage);
            throw err;
        }
    }), []);
    const deletePQR = useCallback((id) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            yield apiClient.pqr.delete(id);
            // Remove from local state
            setPqrs(prevPqrs => prevPqrs.filter(pqr => pqr.id !== id));
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error deleting PQR';
            setError(errorMessage);
            throw err;
        }
    }), []);
    // Auto-load on mount and dependency changes
    useEffect(() => {
        if (autoLoad) {
            loadPQRs();
        }
    }, [loadPQRs, autoLoad]);
    return {
        pqrs,
        loading,
        error,
        pagination,
        refresh,
        loadPage,
        createPQR,
        updatePQR,
        deletePQR,
    };
}
export default usePQR;
