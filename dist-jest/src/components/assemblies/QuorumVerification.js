// src/components/assemblies/QuorumVerification.tsx
"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, CheckCircle, AlertCircle } from 'lucide-react';
export default function QuorumVerification({ assemblyId, token, language, totalUnits, quorumPercentage }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, _setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const fetchQuorumStats = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            // En un entorno real, esto sería una llamada a la API
            // const response = await fetch(`/api/assemblies/${assemblyId}/quorum`, {
            //   headers: { Authorization: `Bearer ${token}` }
            // });
            // if (!response.ok) {
            //   throw new Error(language === 'Español' ? 'Error al cargar datos de quórum' : 'Error loading quorum data');
            // }
            // const data = await response.json();
            // setStats(data);
            // setLastUpdate(new Date());
            // setError(null);
            // Mock data for demonstration
            const mockStats = {
                confirmedAttendees: Math.floor(Math.random() * totalUnits),
                totalEligible: totalUnits,
                quorumReached: Math.random() > 0.5,
                quorumPercentage: quorumPercentage,
                currentPercentage: (Math.random() * 100),
            };
            setStats(mockStats);
            setLastUpdate(new Date());
            _setError(null);
        }
        catch (err) {
            console.error('[QuorumVerification] Error:', err);
            _setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }), [totalUnits, quorumPercentage, _setError, setStats, setLoading]);
    // Efecto inicial para cargar datos
    useEffect(() => {
        fetchQuorumStats();
        // Configurar actualización en tiempo real cada 30 segundos
        const intervalId = setInterval(() => {
            fetchQuorumStats();
        }, 30000);
        return () => clearInterval(intervalId);
    }, [assemblyId, token, fetchQuorumStats]);
    if (loading) {
        return (_jsxs("div", { className: "flex items-center justify-center p-4", children: [_jsx(Loader2, { className: "w-6 h-6 animate-spin text-indigo-600 mr-2" }), _jsx("span", { children: language === 'Español' ? 'Verificando quórum...' : 'Verifying quorum...' })] }));
    }
    if (error) {
        return (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md", children: _jsxs("div", { className: "flex", children: [_jsx(AlertCircle, { className: "w-5 h-5 mr-2" }), _jsx("span", { children: error })] }) }));
    }
    if (!stats) {
        return null;
    }
    return (_jsxs("div", { className: "bg-white shadow-sm rounded-lg p-4 mb-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h3", { className: "text-lg font-medium", children: language === 'Español' ? 'Verificación de Quórum' : 'Quorum Verification' }), _jsx(Badge, { variant: stats.quorumReached ? "success" : "outline", children: stats.quorumReached
                            ? (language === 'Español' ? 'Quórum Alcanzado' : 'Quorum Reached')
                            : (language === 'Español' ? 'Quórum Pendiente' : 'Quorum Pending') })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { children: language === 'Español' ? 'Progreso actual' : 'Current progress' }), _jsxs("span", { className: "font-medium", children: [Math.round(stats.currentPercentage), "%"] })] }), _jsx(Progress, { value: stats.currentPercentage, className: "h-2" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsxs("span", { children: [language === 'Español' ? 'Asistentes confirmados:' : 'Confirmed attendees:', _jsx("span", { className: "font-medium ml-1", children: stats.confirmedAttendees })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(CheckCircle, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsxs("span", { children: [language === 'Español' ? 'Quórum requerido:' : 'Required quorum:', _jsxs("span", { className: "font-medium ml-1", children: [stats.quorumPercentage, "%"] })] })] })] }), _jsx("div", { className: "mt-3 text-xs text-gray-500 text-right", children: language === 'Español'
                    ? `Última actualización: ${lastUpdate.toLocaleTimeString()}`
                    : `Last update: ${lastUpdate.toLocaleTimeString()}` })] }));
}
