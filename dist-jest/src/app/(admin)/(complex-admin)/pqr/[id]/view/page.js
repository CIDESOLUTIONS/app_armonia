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
import { Label } from '@/components/ui/label';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { getPQRById, updatePQR, deletePQR, addPQRComment, assignPQR } from '@/services/pqrService';
export default function ViewPQRPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const pqrId = params.id ? parseInt(params.id) : null;
    const [pqr, setPqr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState(''); // Assuming assignee ID or name
    const fetchPQR = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const data = yield getPQRById(pqrId);
            setPqr(data);
            setSelectedStatus(data.status);
            setSelectedAssignee(data.assignedToId || '');
        }
        catch (error) {
            console.error('Error fetching PQR:', error);
            toast({
                title: 'Error',
                description: 'No se pudo cargar la PQR.',
                variant: 'destructive',
            });
            router.push('/admin/pqr/list');
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
    const handleUpdateStatus = () => __awaiter(this, void 0, void 0, function* () {
        if (!pqrId || !selectedStatus)
            return;
        try {
            yield updatePQR(pqrId, { status: selectedStatus });
            toast({
                title: 'Éxito',
                description: 'Estado de PQR actualizado correctamente.',
            });
            fetchPQR();
        }
        catch (error) {
            console.error('Error updating PQR status:', error);
            toast({
                title: 'Error',
                description: 'Error al actualizar estado.',
                variant: 'destructive',
            });
        }
    });
    const handleAssignPQR = () => __awaiter(this, void 0, void 0, function* () {
        if (!pqrId || !selectedAssignee)
            return;
        try {
            yield assignPQR(pqrId, selectedAssignee); // Assuming selectedAssignee is ID
            toast({
                title: 'Éxito',
                description: 'PQR asignada correctamente.',
            });
            fetchPQR();
        }
        catch (error) {
            console.error('Error assigning PQR:', error);
            toast({
                title: 'Error',
                description: 'Error al asignar PQR.',
                variant: 'destructive',
            });
        }
    });
    const handleDeletePQR = () => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar esta PQR?')) {
            try {
                yield deletePQR(pqrId);
                toast({
                    title: 'Éxito',
                    description: 'PQR eliminada correctamente.',
                });
                router.push('/admin/pqr/list');
            }
            catch (error) {
                console.error('Error deleting PQR:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar la PQR.',
                    variant: 'destructive',
                });
            }
        }
    });
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN' && user.role !== 'STAFF' && user.role !== 'RESIDENT')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    if (!pqr) {
        return null; // Should not happen due to redirects above
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: ["Detalles de PQR: ", pqr.subject] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Link, { href: `/admin/pqr/${pqr.id}/edit`, children: _jsxs(Button, { variant: "outline", children: [_jsx(Edit, { className: "mr-2 h-4 w-4" }), " Editar PQR"] }) }), _jsxs(Button, { variant: "destructive", onClick: handleDeletePQR, children: [_jsx(Trash2, { className: "mr-2 h-4 w-4" }), " Eliminar PQR"] })] })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Informaci\u00F3n General" }) }), _jsxs(CardContent, { className: "grid gap-4", children: [_jsxs("p", { children: [_jsx("strong", { children: "Descripci\u00F3n:" }), " ", pqr.description] }), _jsxs("p", { children: [_jsx("strong", { children: "Reportado por:" }), " ", pqr.reportedByName] }), _jsxs("p", { children: [_jsx("strong", { children: "Categor\u00EDa:" }), " ", pqr.category] }), _jsxs("p", { children: [_jsx("strong", { children: "Prioridad:" }), _jsx(Badge, { variant: pqr.priority === 'HIGH' ? 'destructive' : pqr.priority === 'MEDIUM' ? 'secondary' : 'default', children: pqr.priority })] }), _jsxs("p", { children: [_jsx("strong", { children: "Estado:" }), _jsx(Badge, { variant: pqr.status === 'OPEN' ? 'destructive' : pqr.status === 'IN_PROGRESS' ? 'secondary' : 'default', children: pqr.status })] }), _jsxs("p", { children: [_jsx("strong", { children: "Asignado a:" }), " ", pqr.assignedToName || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha de Creaci\u00F3n:" }), " ", new Date(pqr.createdAt).toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "\u00DAltima Actualizaci\u00F3n:" }), " ", new Date(pqr.updatedAt).toLocaleString()] })] })] }), ((user === null || user === void 0 ? void 0 : user.role) === 'ADMIN' || (user === null || user === void 0 ? void 0 : user.role) === 'COMPLEX_ADMIN' || (user === null || user === void 0 ? void 0 : user.role) === 'STAFF') && (_jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Gesti\u00F3n de PQR" }) }), _jsxs(CardContent, { className: "grid gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "status-select", children: "Cambiar Estado" }), _jsxs(Select, { value: selectedStatus, onValueChange: (value) => setSelectedStatus(value), children: [_jsx(SelectTrigger, { id: "status-select", children: _jsx(SelectValue, { placeholder: "Seleccionar estado" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "OPEN", children: "Abierta" }), _jsx(SelectItem, { value: "IN_PROGRESS", children: "En Progreso" }), _jsx(SelectItem, { value: "CLOSED", children: "Cerrada" }), _jsx(SelectItem, { value: "REJECTED", children: "Rechazada" })] })] }), _jsx(Button, { onClick: handleUpdateStatus, className: "mt-2", children: "Actualizar Estado" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "assignee-select", children: "Asignar a" }), _jsxs(Select, { value: selectedAssignee, onValueChange: (value) => setSelectedAssignee(parseInt(value)), children: [_jsx(SelectTrigger, { id: "assignee-select", children: _jsx(SelectValue, { placeholder: "Seleccionar responsable" }) }), _jsx(SelectContent, { children: _jsx(SelectItem, { value: (user === null || user === void 0 ? void 0 : user.id) || '', children: (user === null || user === void 0 ? void 0 : user.name) || 'Yo' }) })] }), _jsx(Button, { onClick: handleAssignPQR, className: "mt-2", children: "Asignar PQR" })] })] })] })), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(MessageSquare, { className: "mr-2 h-5 w-5" }), " Comentarios"] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "space-y-4 mb-4", children: pqr.comments.length > 0 ? (pqr.comments.map((comment) => (_jsxs("div", { className: "border-b pb-2", children: [_jsxs("p", { className: "text-sm font-semibold", children: [comment.authorName, " ", _jsxs("span", { className: "text-gray-500 text-xs", children: ["(", new Date(comment.createdAt).toLocaleString(), ")"] })] }), _jsx("p", { className: "text-gray-700", children: comment.comment })] }, comment.id)))) : (_jsx("p", { className: "text-gray-500", children: "No hay comentarios a\u00FAn." })) }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Textarea, { placeholder: "A\u00F1adir un comentario...", value: newComment, onChange: (e) => setNewComment(e.target.value), rows: 3 }), _jsx(Button, { onClick: handleAddComment, disabled: !newComment.trim(), children: "A\u00F1adir Comentario" })] })] })] })] }));
}
