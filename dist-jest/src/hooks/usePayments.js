// src/hooks/usePayments.ts
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
export const usePayments = () => {
    const [payments, setPayments] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, _setError] = useState(null);
    const fetchPayments = useCallback((filters) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (filters === null || filters === void 0 ? void 0 : filters.status)
                queryParams.append('status', filters.status);
            if (filters === null || filters === void 0 ? void 0 : filters.paymentMethod)
                queryParams.append('paymentMethod', filters.paymentMethod);
            if (filters === null || filters === void 0 ? void 0 : filters.startDate)
                queryParams.append('startDate', filters.startDate);
            if (filters === null || filters === void 0 ? void 0 : filters.endDate)
                queryParams.append('endDate', filters.endDate);
            if (filters === null || filters === void 0 ? void 0 : filters.sortField)
                queryParams.append('sortField', filters.sortField);
            if (filters === null || filters === void 0 ? void 0 : filters.sortDirection)
                queryParams.append('sortDirection', filters.sortDirection);
            const _response = yield fetch(`/api/financial/payments?${queryParams}`);
            if (!response.ok)
                throw new Error('Error al obtener pagos');
            const _data = yield response.json();
            setPayments(data);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al cargar pagos');
        }
        finally {
            setLoading(false);
        }
    }), []);
    const fetchPaymentSummary = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const _response = yield fetch('/api/financial/payments/summary');
            if (!response.ok)
                throw new Error('Error al obtener resumen de pagos');
            const _data = yield response.json();
            setSummary(data);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al cargar resumen de pagos');
        }
        finally {
            setLoading(false);
        }
    }), []);
    const getPaymentById = useCallback((id) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const _response = yield fetch(`/api/financial/payments/${id}`);
            if (!response.ok)
                throw new Error('Error al obtener pago');
            const payment = yield response.json();
            return payment;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al obtener pago');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), []);
    const updatePayment = useCallback((id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const _response = yield fetch(`/api/financial/payments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok)
                throw new Error('Error al actualizar pago');
            // Actualizar la lista de pagos y el resumen
            yield Promise.all([
                fetchPayments(),
                fetchPaymentSummary()
            ]);
            toast.success('Pago actualizado exitosamente');
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al actualizar pago');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), [fetchPayments, fetchPaymentSummary]);
    const exportPayments = useCallback((filters) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters === null || filters === void 0 ? void 0 : filters.startDate)
                queryParams.append('startDate', filters.startDate);
            if (filters === null || filters === void 0 ? void 0 : filters.endDate)
                queryParams.append('endDate', filters.endDate);
            const _response = yield fetch(`/api/financial/payments/export?${queryParams}`);
            if (!response.ok)
                throw new Error('Error al exportar pagos');
            const _data = yield response.json();
            // Convertir a CSV
            const csvContent = convertToCSV(data);
            // Crear y descargar archivo
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `pagos_${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
            toast.success('Reporte exportado exitosamente');
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al exportar pagos');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), []);
    // Función auxiliar para convertir a CSV
    const convertToCSV = (data) => {
        if (data.length === 0)
            return '';
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => Object.values(obj)
            .map(value => `"${value}"`)
            .join(','));
        return [headers, ...rows].join('\n');
    };
    // Funciones auxiliares para análisis de datos
    const getPaymentStatistics = useCallback(() => {
        const total = payments.length;
        const completed = payments.filter(p => p.status === 'COMPLETED').length;
        const pending = payments.filter(p => p.status === 'PENDING').length;
        const rejected = payments.filter(p => p.status === 'REJECTED').length;
        return {
            total,
            completed,
            pending,
            rejected,
            completionRate: total > 0 ? (completed / total) * 100 : 0
        };
    }, [payments]);
    const getPaymentsByMethod = useCallback(() => {
        return payments.reduce((acc, payment) => {
            acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
            return acc;
        }, {});
    }, [payments]);
    return {
        payments,
        summary,
        loading,
        error,
        fetchPayments,
        fetchPaymentSummary,
        getPaymentById,
        updatePayment,
        exportPayments,
        getPaymentStatistics,
        getPaymentsByMethod
    };
};
