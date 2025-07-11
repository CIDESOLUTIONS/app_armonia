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
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
export default function RealTimeVoting({ assemblyId, agendaNumeral, topic, language, userVote, onVoteSubmitted }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const fetchVotingStats = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`/api/assemblies/${assemblyId}/agenda/${agendaNumeral}/votes`);
            if (!response.ok) {
                throw new Error(language === 'Español' ? 'Error al cargar estadísticas de votación' : 'Error loading voting statistics');
            }
            const data = yield response.json();
            setStats(data);
            setLastUpdate(new Date());
            setError(null);
        }
        catch (err) {
            console.error('[RealTimeVoting] Error:', err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }), [assemblyId, agendaNumeral, language]);
    const submitVote = (value) => __awaiter(this, void 0, void 0, function* () {
        if (submitting)
            return;
        setSubmitting(true);
        try {
            const response = yield fetch(`/api/assemblies/${assemblyId}/agenda/${agendaNumeral}/votes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value }),
            });
            if (!response.ok) {
                const errorData = yield response.json();
                throw new Error(errorData.error || (language === 'Español' ? 'Error al enviar voto' : 'Error submitting vote'));
            }
            toast({
                title: language === 'Español' ? 'Voto registrado' : 'Vote submitted',
                description: language === 'Español' ? 'Tu voto ha sido registrado exitosamente' : 'Your vote has been successfully recorded',
                variant: 'default',
            });
            // Actualizar estadísticas y notificar al componente padre
            fetchVotingStats();
            onVoteSubmitted();
        }
        catch (err) {
            console.error('[RealTimeVoting] Error submitting vote:', err);
            toast({
                title: language === 'Español' ? 'Error' : 'Error',
                description: err.message,
                variant: 'destructive',
            });
        }
        finally {
            setSubmitting(false);
        }
    });
    // Efecto inicial para cargar datos
    useEffect(() => {
        fetchVotingStats();
        // Configurar actualización en tiempo real cada 15 segundos
        const intervalId = setInterval(() => {
            fetchVotingStats();
        }, 15000);
        return () => clearInterval(intervalId);
    }, [assemblyId, agendaNumeral, fetchVotingStats]);
    if (loading) {
        return (_jsxs("div", { className: "flex items-center justify-center p-4", children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin text-indigo-600 mr-2" }), _jsx("span", { className: "text-sm", children: language === 'Español' ? 'Cargando resultados...' : 'Loading results...' })] }));
    }
    if (error) {
        return (_jsx("div", { className: "text-sm text-red-600 p-2", children: error }));
    }
    if (!stats) {
        return null;
    }
    return (_jsxs(Card, { className: "p-4 mb-2", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsxs("h4", { className: "font-medium text-sm", children: ["#", agendaNumeral, ": ", topic] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [language === 'Español' ? 'Votos totales:' : 'Total votes:', " ", stats.totalVotes] })] }), _jsx(Badge, { variant: stats.isOpen ? "outline" : "secondary", children: stats.isOpen
                            ? (language === 'Español' ? 'Votación Abierta' : 'Voting Open')
                            : (language === 'Español' ? 'Votación Cerrada' : 'Voting Closed') })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-3", children: [_jsxs("div", { className: `p-3 rounded-md flex items-center justify-between ${userVote === 'YES' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`, children: [_jsxs("div", { className: "flex items-center", children: [_jsx(CheckCircle2, { className: `w-4 h-4 mr-2 ${userVote === 'YES' ? 'text-green-600' : 'text-gray-400'}` }), _jsx("span", { className: "text-sm font-medium", children: language === 'Español' ? 'A favor' : 'In favor' })] }), _jsxs("div", { children: [_jsxs("span", { className: "text-sm font-bold", children: [stats.yesPercentage, "%"] }), _jsxs("span", { className: "text-xs text-gray-500 ml-1", children: ["(", stats.yesVotes, ")"] })] })] }), _jsxs("div", { className: `p-3 rounded-md flex items-center justify-between ${userVote === 'NO' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`, children: [_jsxs("div", { className: "flex items-center", children: [_jsx(XCircle, { className: `w-4 h-4 mr-2 ${userVote === 'NO' ? 'text-red-600' : 'text-gray-400'}` }), _jsx("span", { className: "text-sm font-medium", children: language === 'Español' ? 'En contra' : 'Against' })] }), _jsxs("div", { children: [_jsxs("span", { className: "text-sm font-bold", children: [stats.noPercentage, "%"] }), _jsxs("span", { className: "text-xs text-gray-500 ml-1", children: ["(", stats.noVotes, ")"] })] })] })] }), stats.isOpen && userVote === null && (_jsxs("div", { className: "flex space-x-2 mt-4 mb-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "flex-1 bg-green-50 hover:bg-green-100 border-green-200", onClick: () => submitVote('YES'), disabled: submitting, children: [submitting ? _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : _jsx(CheckCircle2, { className: "w-4 h-4 mr-2" }), language === 'Español' ? 'Votar a favor' : 'Vote in favor'] }), _jsxs(Button, { variant: "outline", size: "sm", className: "flex-1 bg-red-50 hover:bg-red-100 border-red-200", onClick: () => submitVote('NO'), disabled: submitting, children: [submitting ? _jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : _jsx(XCircle, { className: "w-4 h-4 mr-2" }), language === 'Español' ? 'Votar en contra' : 'Vote against'] })] })), stats.endTime && !stats.isOpen && (_jsx("div", { className: "text-xs text-gray-500", children: language === 'Español'
                    ? `Votación cerrada el ${new Date(stats.endTime).toLocaleString()}`
                    : `Voting closed on ${new Date(stats.endTime).toLocaleString()}` })), _jsx("div", { className: "mt-2 text-xs text-gray-500 text-right", children: language === 'Español'
                    ? `Última actualización: ${lastUpdate.toLocaleTimeString()}`
                    : `Last update: ${lastUpdate.toLocaleTimeString()}` })] }));
}
