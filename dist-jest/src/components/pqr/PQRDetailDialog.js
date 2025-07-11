// src/components/pqr/PQRDetailDialog.tsx
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
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { CheckCircle, Clock, UserCheck, AlertCircle } from 'lucide-react';
// Enums para los estados de PQR
var PQRStatus;
(function (PQRStatus) {
    PQRStatus["PENDING"] = "PENDING";
    PQRStatus["IN_PROGRESS"] = "IN_PROGRESS";
    PQRStatus["RESOLVED"] = "RESOLVED";
    PQRStatus["CLOSED"] = "CLOSED";
    PQRStatus["CANCELLED"] = "CANCELLED";
})(PQRStatus || (PQRStatus = {}));
var PQRPriority;
(function (PQRPriority) {
    PQRPriority["LOW"] = "LOW";
    PQRPriority["MEDIUM"] = "MEDIUM";
    PQRPriority["HIGH"] = "HIGH";
    PQRPriority["URGENT"] = "URGENT";
})(PQRPriority || (PQRPriority = {}));
var PQRType;
(function (PQRType) {
    PQRType["PETITION"] = "PETITION";
    PQRType["COMPLAINT"] = "COMPLAINT";
    PQRType["CLAIM"] = "CLAIM";
})(PQRType || (PQRType = {}));
export function PQRDetailDialog({ isOpen, onClose, pqrId, onStatusChange }) {
    // Estados
    const [pqr, setPqr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, _setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [assigneeId, setAssigneeId] = useState(null);
    const [assignees, setAssignees] = useState([]);
    const [isAdmin, setIsAdmin] = useState(true); // Simulamos que es administrador
    const [isUpdating, setIsUpdating] = useState(false);
    // Cargar datos del PQR cuando cambia el ID
    useEffect(() => {
        if (pqrId === null)
            return;
        const loadPQRDetails = () => __awaiter(this, void 0, void 0, function* () {
            try {
                setLoading(true);
                setError(null);
                // Datos simulados - Aquí iría una llamada a la API
                yield new Promise(resolve => setTimeout(resolve, 500));
                // Simular datos recuperados
                const mockPQR = {
                    id: 1,
                    title: "Gotera en el techo del parqueadero",
                    description: "Hay una gotera grande en el parqueadero comunal que está afectando mi vehículo. He notado que cuando llueve, cae agua directamente sobre donde estaciono, lo que está causando daños a la pintura. Por favor, solicito una revisión y reparación urgente del techo.",
                    type: PQRType.COMPLAINT,
                    status: PQRStatus.IN_PROGRESS,
                    priority: PQRPriority.HIGH,
                    createdAt: "2024-03-10T14:30:00Z",
                    updatedAt: "2024-03-15T09:20:00Z",
                    residentId: 101,
                    residentName: "Ana María Gómez",
                    propertyUnit: "A-303",
                    assignedToId: 5,
                    assignedToName: "Carlos Martínez",
                    response: "Se realizó una inspección inicial y se detectó la filtración. Se ha programado una reparación con el contratista para la próxima semana.",
                    category: "infrastructure",
                    subcategory: "damages"
                };
                // Comentarios simulados
                const mockComments = [
                    {
                        id: 1,
                        pqrId: 1,
                        userId: 101,
                        userName: "Ana María Gómez",
                        content: "Necesito que se resuelva pronto, está afectando la pintura de mi vehículo.",
                        createdAt: "2024-03-11T10:15:00Z",
                        isInternal: false
                    },
                    {
                        id: 2,
                        pqrId: 1,
                        userId: 5,
                        userName: "Carlos Martínez",
                        content: "Programado para revisión técnica el día 12 de marzo.",
                        createdAt: "2024-03-11T15:30:00Z",
                        isInternal: true
                    },
                    {
                        id: 3,
                        pqrId: 1,
                        userId: 5,
                        userName: "Carlos Martínez",
                        content: "Se ha identificado una filtración en el techo. Necesitamos contratar una impermeabilización.",
                        createdAt: "2024-03-12T16:45:00Z",
                        isInternal: true
                    },
                    {
                        id: 4,
                        pqrId: 1,
                        userId: 5,
                        userName: "Carlos Martínez",
                        content: "Hemos programado el servicio de reparación para el próximo martes. Le informaremos cuando esté completado.",
                        createdAt: "2024-03-14T11:20:00Z",
                        isInternal: false
                    }
                ];
                // Asignables simulados
                const mockAssignees = [
                    { id: 5, name: "Carlos Martínez" },
                    { id: 6, name: "Laura Sánchez" },
                    { id: 7, name: "Pedro Ramírez" }
                ];
                setPqr(mockPQR);
                setComments(mockComments);
                setAssignees(mockAssignees);
                setNewStatus(mockPQR.status);
                setAssigneeId(mockPQR.assignedToId || null);
            }
            catch (err) {
                console.error("Error al cargar detalles del PQR:", err);
                setError("No se pudieron cargar los detalles de la solicitud.");
            }
            finally {
                setLoading(false);
            }
        });
        loadPQRDetails();
    }, [pqrId]);
    // Función para actualizar el estado
    const handleUpdateStatus = () => __awaiter(this, void 0, void 0, function* () {
        if (!pqr || !newStatus)
            return;
        try {
            setIsUpdating(true);
            setError(null);
            // Simulación - Aquí iría una llamada a la API
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Actualizar datos locales
            setPqr(prev => {
                if (!prev)
                    return prev;
                return Object.assign(Object.assign({}, prev), { status: newStatus });
            });
            // Añadir un comentario interno automático
            const newStatusComment = {
                id: comments.length + 1,
                pqrId: pqr.id,
                userId: 999, // ID del sistema
                userName: "Sistema",
                content: `Estado actualizado a "${getStatusText(newStatus)}"`,
                createdAt: new Date().toISOString(),
                isInternal: true
            };
            setComments([...comments, newStatusComment]);
            // Notificar cambio
            if (onStatusChange)
                onStatusChange();
        }
        catch (err) {
            console.error("Error al actualizar estado:", err);
            setError("No se pudo actualizar el estado.");
        }
        finally {
            setIsUpdating(false);
        }
    });
    // Función para asignar
    const handleAssign = () => __awaiter(this, void 0, void 0, function* () {
        if (!pqr || !assigneeId)
            return;
        try {
            setIsUpdating(true);
            setError(null);
            // Simulación - Aquí iría una llamada a la API
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Encontrar el nombre del asignado
            const assignee = assignees.find(a => a.id === assigneeId);
            // Actualizar datos locales
            setPqr(prev => {
                if (!prev)
                    return prev;
                return Object.assign(Object.assign({}, prev), { assignedToId: assigneeId, assignedToName: (assignee === null || assignee === void 0 ? void 0 : assignee.name) || "Desconocido" });
            });
            // Añadir un comentario interno automático
            const newAssignComment = {
                id: comments.length + 1,
                pqrId: pqr.id,
                userId: 999, // ID del sistema
                userName: "Sistema",
                content: `Asignado a ${(assignee === null || assignee === void 0 ? void 0 : assignee.name) || "Desconocido"}`,
                createdAt: new Date().toISOString(),
                isInternal: true
            };
            setComments([...comments, newAssignComment]);
            // Notificar cambio
            if (onStatusChange)
                onStatusChange();
        }
        catch (err) {
            console.error("Error al asignar PQR:", err);
            setError("No se pudo asignar la solicitud.");
        }
        finally {
            setIsUpdating(false);
        }
    });
    // Función para añadir comentario
    const handleAddComment = () => __awaiter(this, void 0, void 0, function* () {
        if (!pqr || !newComment.trim())
            return;
        try {
            setIsUpdating(true);
            setError(null);
            // Simulación - Aquí iría una llamada a la API
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Crear nuevo comentario
            const comment = {
                id: comments.length + 1,
                pqrId: pqr.id,
                userId: 5, // ID del usuario actual (simulado)
                userName: "Carlos Martínez", // Nombre del usuario actual (simulado)
                content: newComment,
                createdAt: new Date().toISOString(),
                isInternal: false // Por defecto los comentarios son públicos
            };
            // Actualizar comentarios
            setComments([...comments, comment]);
            // Limpiar campo
            setNewComment("");
        }
        catch (err) {
            console.error("Error al añadir comentario:", err);
            setError("No se pudo añadir el comentario.");
        }
        finally {
            setIsUpdating(false);
        }
    });
    // Formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    // Formatear categoría
    const getCategoryText = (category) => {
        const categories = {
            'infrastructure': 'Infraestructura',
            'security': 'Seguridad',
            'noise': 'Ruido',
            'payments': 'Pagos',
            'services': 'Servicios comunes',
            'other': 'Otro'
        };
        return categories[category] || category;
    };
    // Obtener texto del estado
    const getStatusText = (status) => {
        switch (status) {
            case PQRStatus.PENDING:
                return "Pendiente";
            case PQRStatus.IN_PROGRESS:
                return "En proceso";
            case PQRStatus.RESOLVED:
                return "Resuelto";
            case PQRStatus.CLOSED:
                return "Cerrado";
            case PQRStatus.CANCELLED:
                return "Cancelado";
            default:
                return status;
        }
    };
    // Obtener texto de la prioridad
    const getPriorityText = (priority) => {
        switch (priority) {
            case PQRPriority.LOW:
                return "Baja";
            case PQRPriority.MEDIUM:
                return "Media";
            case PQRPriority.HIGH:
                return "Alta";
            case PQRPriority.URGENT:
                return "Urgente";
            default:
                return priority;
        }
    };
    // Obtener texto del tipo
    const getTypeText = (type) => {
        switch (type) {
            case PQRType.PETITION:
                return "Petición";
            case PQRType.COMPLAINT:
                return "Queja";
            case PQRType.CLAIM:
                return "Reclamo";
            default:
                return type;
        }
    };
    // Obtener color del estado
    const getStatusColor = (status) => {
        switch (status) {
            case PQRStatus.PENDING:
                return "bg-yellow-500";
            case PQRStatus.IN_PROGRESS:
                return "bg-blue-500";
            case PQRStatus.RESOLVED:
                return "bg-green-500";
            case PQRStatus.CLOSED:
                return "bg-gray-500";
            case PQRStatus.CANCELLED:
                return "bg-red-500";
            default:
                return "bg-gray-400";
        }
    };
    // Obtener icono del estado
    const getStatusIcon = (status) => {
        switch (status) {
            case PQRStatus.PENDING:
                return _jsx(Clock, { className: "h-4 w-4" });
            case PQRStatus.IN_PROGRESS:
                return _jsx(UserCheck, { className: "h-4 w-4" });
            case PQRStatus.RESOLVED:
                return _jsx(CheckCircle, { className: "h-4 w-4" });
            case PQRStatus.CLOSED:
                return _jsx(CheckCircle, { className: "h-4 w-4" });
            case PQRStatus.CANCELLED:
                return _jsx(AlertCircle, { className: "h-4 w-4" });
            default:
                return _jsx(Clock, { className: "h-4 w-4" });
        }
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-xl font-semibold", children: loading ? "Cargando solicitud..." : pqr ? pqr.title : "Detalle de solicitud" }) }), loading ? (_jsxs("div", { className: "flex justify-center items-center py-12", children: [_jsx("div", { className: "animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent" }), _jsx("span", { className: "ml-3", children: "Cargando detalles..." })] })) : error ? (_jsxs("div", { className: "bg-red-50 text-red-700 p-4 rounded-md border border-red-200", children: [_jsx("p", { className: "font-medium", children: "Error" }), _jsx("p", { children: error }), _jsx(Button, { variant: "outline", size: "sm", className: "mt-2", onClick: onClose, children: "Cerrar" })] })) : pqr ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-sm text-gray-500", children: "Tipo" }), _jsx("p", { className: "font-medium", children: getTypeText(pqr.type) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-sm text-gray-500", children: "Prioridad" }), _jsx("p", { className: "font-medium", children: getPriorityText(pqr.priority) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-sm text-gray-500", children: "Estado" }), _jsx("div", { className: "flex items-center", children: _jsx(Badge, { className: getStatusColor(pqr.status), children: _jsxs("span", { className: "flex items-center gap-1", children: [getStatusIcon(pqr.status), getStatusText(pqr.status)] }) }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-sm text-gray-500", children: "Categor\u00EDa" }), _jsx("p", { className: "font-medium", children: getCategoryText(pqr.category || 'other') })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-sm text-gray-500", children: "Residente" }), _jsxs("p", { className: "font-medium", children: [pqr.residentName, " (", pqr.propertyUnit, ")"] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-sm text-gray-500", children: "Asignado a" }), _jsx("p", { className: "font-medium", children: pqr.assignedToName || "Sin asignar" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-sm text-gray-500", children: "Fecha de creaci\u00F3n" }), _jsx("p", { className: "font-medium", children: formatDate(pqr.createdAt) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-sm text-gray-500", children: "\u00DAltima actualizaci\u00F3n" }), _jsx("p", { className: "font-medium", children: formatDate(pqr.updatedAt) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-sm text-gray-500", children: "Descripci\u00F3n" }), _jsx("div", { className: "bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700", children: _jsx("p", { className: "whitespace-pre-line", children: pqr.description }) })] }), pqr.response && (_jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-sm text-gray-500", children: "Respuesta" }), _jsx("div", { className: "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800", children: _jsx("p", { className: "whitespace-pre-line", children: pqr.response }) })] })), isAdmin && (_jsxs("div", { className: "bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700", children: [_jsx("h3", { className: "font-medium mb-3", children: "Gesti\u00F3n administrativa" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "status", children: "Cambiar estado" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Select, { value: newStatus, onValueChange: (value) => setNewStatus(value), children: [_jsx(SelectTrigger, { className: "flex-1", children: _jsx(SelectValue, { placeholder: "Seleccionar estado" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: PQRStatus.PENDING, children: "Pendiente" }), _jsx(SelectItem, { value: PQRStatus.IN_PROGRESS, children: "En Proceso" }), _jsx(SelectItem, { value: PQRStatus.RESOLVED, children: "Resuelto" }), _jsx(SelectItem, { value: PQRStatus.CLOSED, children: "Cerrado" }), _jsx(SelectItem, { value: PQRStatus.CANCELLED, children: "Cancelado" })] })] }), _jsx(Button, { onClick: handleUpdateStatus, disabled: isUpdating || newStatus === pqr.status || !newStatus, children: "Actualizar" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "assignee", children: "Asignar a" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Select, { value: (assigneeId === null || assigneeId === void 0 ? void 0 : assigneeId.toString()) || "", onValueChange: (value) => setAssigneeId(parseInt(value)), children: [_jsx(SelectTrigger, { className: "flex-1", children: _jsx(SelectValue, { placeholder: "Seleccionar responsable" }) }), _jsx(SelectContent, { children: assignees.map(assignee => (_jsx(SelectItem, { value: assignee.id.toString(), children: assignee.name }, assignee.id))) })] }), _jsx(Button, { onClick: handleAssign, disabled: isUpdating || assigneeId === pqr.assignedToId || !assigneeId, children: "Asignar" })] })] })] })] })), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "font-medium", children: "Historial de actividad" }), _jsx("div", { className: "space-y-4 max-h-60 overflow-y-auto", children: comments.length === 0 ? (_jsx("p", { className: "text-gray-500 italic text-sm", children: "No hay actividad registrada" })) : (comments.map((comment) => (_jsxs("div", { className: `p-3 rounded-md border ${comment.isInternal
                                            ? "bg-gray-50 border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                            : "bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-900"}`, children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("span", { className: "font-medium", children: comment.userName }), _jsx("span", { className: "text-xs text-gray-500", children: formatDate(comment.createdAt) })] }), _jsx("p", { className: "mt-1 whitespace-pre-line", children: comment.content }), comment.isInternal && isAdmin && (_jsx("span", { className: "mt-1 text-xs text-gray-500 italic", children: "Nota interna (solo visible para administradores)" }))] }, comment.id)))) }), _jsxs("div", { className: "mt-4", children: [_jsx(Label, { htmlFor: "new-comment", children: "Agregar comentario" }), _jsx(Textarea, { id: "new-comment", placeholder: "Escribe un comentario...", value: newComment, onChange: (e) => setNewComment(e.target.value), className: "mt-1", rows: 3 }), _jsx("div", { className: "flex justify-end mt-2", children: _jsx(Button, { onClick: handleAddComment, disabled: isUpdating || !newComment.trim(), children: isUpdating ? "Enviando..." : "Enviar comentario" }) })] })] })] })) : (_jsx("div", { className: "py-8 text-center text-gray-500", children: "No se encontr\u00F3 la solicitud" })), _jsx(DialogFooter, { children: _jsx(Button, { onClick: onClose, variant: "outline", children: "Cerrar" }) })] }) }));
}
