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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getPQRById, addPQRComment } from '@/services/pqrService';
export default function ViewResidentPQRPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const pqrId = params.id ? parseInt(params.id) : null;
    const [pqr, setPqr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const fetchPQR = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getPQRById(pqrId);
            setPqr(data);
        }
        catch (error) {
            console.error('Error fetching PQR:', error);
            toast({
                title: 'Error',
                description: 'No se pudo cargar la PQR.',
                variant: 'destructive',
            });
            router.push('/resident/pqr');
        }
        finally {
            setLoading(false);
        }
    }), [pqrId, router, toast]);
    useEffect(() => {
        if (!authLoading && user && pqrId) {
            fetchPQR();
        }
    }, [authLoading, user, pqrId, fetchPQR]);
    const handleAddComment = () => __awaiter(this, void 0, void 0, function* () {
        if (!pqrId || !newComment.trim())
            return;
        try {
            yield addPQRComment(pqrId, newComment);
            setNewComment('');
            toast({
                title: 'Éxito',
                description: 'Comentario añadido correctamente.',
            });
            fetchPQR();
        }
        catch (error) {
            console.error('Error adding comment:', error);
            toast({
                title: 'Error',
                description: 'Error al añadir comentario.',
                variant: 'destructive',
            });
        }
    });
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user) {
        return null; // Redirect handled by AuthLayout
    }
    if (!pqr) {
        return null; // Should not happen due to redirects above
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("div", { className: "flex justify-between items-center mb-6", children: _jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: ["Detalles de PQR: ", pqr.subject] }) }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Informaci\u00F3n General" }) }), _jsxs(CardContent, { className: "grid gap-4", children: [_jsxs("p", { children: [_jsx("strong", { children: "Descripci\u00F3n:" }), " ", pqr.description] }), _jsxs("p", { children: [_jsx("strong", { children: "Reportado por:" }), " ", pqr.reportedByName] }), _jsxs("p", { children: [_jsx("strong", { children: "Categor\u00EDa:" }), " ", pqr.category] }), _jsxs("p", { children: [_jsx("strong", { children: "Prioridad:" }), _jsx(Badge, { variant: pqr.priority === 'HIGH' ? 'destructive' : pqr.priority === 'MEDIUM' ? 'secondary' : 'default', children: pqr.priority })] }), _jsxs("p", { children: [_jsx("strong", { children: "Estado:" }), _jsx(Badge, { variant: pqr.status === 'OPEN' ? 'destructive' : pqr.status === 'IN_PROGRESS' ? 'secondary' : 'default', children: pqr.status })] }), _jsxs("p", { children: [_jsx("strong", { children: "Asignado a:" }), " ", pqr.assignedToName || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha de Creaci\u00F3n:" }), " ", new Date(pqr.createdAt).toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "\u00DAltima Actualizaci\u00F3n:" }), " ", new Date(pqr.updatedAt).toLocaleString()] })] })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(MessageSquare, { className: "mr-2 h-5 w-5" }), " Comentarios"] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "space-y-4 mb-4", children: pqr.comments.length > 0 ? (pqr.comments.map((comment) => (_jsxs("div", { className: "border-b pb-2", children: [_jsxs("p", { className: "text-sm font-semibold", children: [comment.authorName, " ", _jsxs("span", { className: "text-gray-500 text-xs", children: ["(", new Date(comment.createdAt).toLocaleString(), ")"] })] }), _jsx("p", { className: "text-gray-700", children: comment.comment })] }, comment.id)))) : (_jsx("p", { className: "text-gray-500", children: "No hay comentarios a\u00FAn." })) }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Textarea, { placeholder: "A\u00F1adir un comentario...", value: newComment, onChange: (e) => setNewComment(e.target.value), rows: 3 }), _jsx(Button, { onClick: handleAddComment, disabled: !newComment.trim(), children: "A\u00F1adir Comentario" })] })] })] })] }));
}
