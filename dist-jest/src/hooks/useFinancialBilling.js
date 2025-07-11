// src/hooks/useFinancialBilling.ts
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
import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
export function useFinancialBilling() {
    const [bills, setBills] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const loadBills = useCallback((filters) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const queryParams = new URLSearchParams();
            if (filters === null || filters === void 0 ? void 0 : filters.period)
                queryParams.append('period', filters.period);
            if (filters === null || filters === void 0 ? void 0 : filters.status)
                queryParams.append('status', filters.status);
            if (filters === null || filters === void 0 ? void 0 : filters.propertyId)
                queryParams.append('propertyId', filters.propertyId.toString());
            const response = yield apiClient.get(`/financial/bills?${queryParams.toString()}`);
            setBills(response.data || []);
        }
        catch (err) {
            console.error('Error cargando facturas:', err);
            setError(err instanceof Error ? err.message : 'Error cargando facturas');
        }
        finally {
            setLoading(false);
        }
    }), [setBills, setError, setLoading]); // Dependencias: setters de estado
    const loadStats = useCallback((startDate, endDate) => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const queryParams = new URLSearchParams();
            if (startDate)
                queryParams.append('startDate', startDate.toISOString());
            if (endDate)
                queryParams.append('endDate', endDate.toISOString());
            const response = yield apiClient.get(`/financial/stats?${queryParams.toString()}`);
            setStats(response.data);
        }
        catch (err) {
            console.error('Error cargando estadísticas:', err);
            setError(err instanceof Error ? err.message : 'Error cargando estadísticas financieras');
        }
    }), [setStats, setError]); // Dependencias: setters de estado
    const generateBills = useCallback((year, month) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.post('/financial/bills/generate', {
                year,
                month
            });
            if (response.success) {
                // Recargar datos después de generar facturas
                yield loadBills();
                yield loadStats();
            }
        }
        catch (err) {
            console.error('Error generando facturas:', err);
            setError(err instanceof Error ? err.message : 'Error generando facturas');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), [loadBills, loadStats, setLoading, setError]); // Dependencias: loadBills, loadStats, setters
    const processPayment = useCallback((billId, amount, paymentMethod, reference) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.post('/financial/payments/process', {
                billId,
                amount,
                paymentMethod,
                reference
            });
            if (response.success) {
                // Actualizar factura en estado local
                setBills(prevBills => prevBills.map(bill => bill.id === billId
                    ? Object.assign(Object.assign({}, bill), { status: response.isFullPayment ? 'PAID' : 'PARTIAL', payments: [
                            ...bill.payments,
                            {
                                id: Date.now(), // Temporal hasta reload
                                amount,
                                paymentMethod,
                                paidAt: new Date().toISOString()
                            }
                        ] }) : bill));
                // Actualizar estadísticas
                if (stats) {
                    setStats(prevStats => (Object.assign(Object.assign({}, prevStats), { totalCollected: prevStats.totalCollected + amount, pendingAmount: prevStats.pendingAmount - amount, collectionRate: ((prevStats.totalCollected + amount) / prevStats.totalBilled) * 100 })));
                }
            }
        }
        catch (err) {
            console.error('Error procesando pago:', err);
            setError(err instanceof Error ? err.message : 'Error procesando pago');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), [stats, setBills, setStats, setError, setLoading, loadBills, loadStats]); // Dependencias: stats, setters
    const refreshData = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([
            loadBills(),
            loadStats()
        ]);
    }), [loadBills, loadStats]); // Dependencias: loadBills, loadStats
    return {
        bills,
        stats,
        loading,
        error,
        generateBills,
        processPayment,
        loadBills,
        loadStats,
        refreshData
    };
}
export default useFinancialBilling;
