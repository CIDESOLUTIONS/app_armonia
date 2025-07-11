// src/hooks/useNotifications.ts
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
export function useNotifications() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [templates, setTemplates] = useState({});
    const [history, setHistory] = useState([]);
    const loadHistory = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.get('/notifications/send');
            if (response.success) {
                setHistory(response.notifications || []);
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error cargando historial';
            setError(errorMessage);
            console.error('Error cargando historial:', err);
        }
    }), [setHistory, setError]); // Dependencias: setters de estado
    const sendNotification = useCallback((payload, target, options) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.post('/notifications/send', {
                payload,
                target,
                options
            });
            if (response.success) {
                // Recargar historial después del envío
                yield loadHistory(); // Ahora loadHistory es una dependencia estable
                return true;
            }
            throw new Error(response.message || 'Error enviando notificación');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error enviando notificación';
            setError(errorMessage);
            console.error('Error enviando notificación:', err);
            return false;
        }
        finally {
            setLoading(false);
        }
    }), [loadHistory, setLoading, setError]); // Añadir loadHistory y setters como dependencia
    const sendTemplateNotification = useCallback((type, data, target) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.post('/notifications/template', {
                type,
                data,
                target
            });
            if (response.success) {
                // Recargar historial después del envío
                yield loadHistory(); // Ahora loadHistory es una dependencia estable
                return true;
            }
            throw new Error(response.message || 'Error enviando notificación por plantilla');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error enviando notificación por plantilla';
            setError(errorMessage);
            console.error('Error enviando notificación por plantilla:', err);
            return false;
        }
        finally {
            setLoading(false);
        }
    }), [loadHistory, setLoading, setError]); // Añadir loadHistory y setters como dependencia
    const loadTemplates = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.get('/notifications/template');
            if (response.success) {
                setTemplates(response.templates || {});
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error cargando plantillas';
            setError(errorMessage);
            console.error('Error cargando plantillas:', err);
        }
    }), [setTemplates, setError]); // Dependencias: setters de estado
    // Métodos de conveniencia para casos comunes
    const sendPaymentReminder = useCallback((amount, dueDate, target) => __awaiter(this, void 0, void 0, function* () {
        return sendTemplateNotification('payment_reminder', { amount, dueDate }, target);
    }), [sendTemplateNotification]);
    const sendAssemblyInvitation = useCallback((date, topic, target) => __awaiter(this, void 0, void 0, function* () {
        return sendTemplateNotification('assembly_invitation', { date, topic }, target);
    }), [sendTemplateNotification]);
    const sendIncidentUpdate = useCallback((incidentId, status, target) => __awaiter(this, void 0, void 0, function* () {
        return sendTemplateNotification('incident_update', { incidentId, status }, target);
    }), [sendTemplateNotification]);
    const sendPQRResponse = useCallback((pqrId, status, target) => __awaiter(this, void 0, void 0, function* () {
        return sendTemplateNotification('pqr_response', { pqrId, status }, target);
    }), [sendTemplateNotification]);
    const sendGeneralAnnouncement = useCallback((title, message, target) => __awaiter(this, void 0, void 0, function* () {
        return sendTemplateNotification('general_announcement', { title, message }, target);
    }), [sendTemplateNotification]);
    return {
        // Estado
        loading,
        error,
        templates,
        history,
        // Métodos principales
        sendNotification,
        sendTemplateNotification,
        loadTemplates,
        loadHistory,
        // Métodos de conveniencia
        sendPaymentReminder,
        sendAssemblyInvitation,
        sendIncidentUpdate,
        sendPQRResponse,
        sendGeneralAnnouncement
    };
}
export default useNotifications;
