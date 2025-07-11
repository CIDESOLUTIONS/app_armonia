// src/components/security/DigitalMinutes.tsx
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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Plus, Search, Calendar, Clock, User, AlertTriangle, CheckCircle, Eye, Trash2, Shield, Loader2 } from 'lucide-react';
import { useDigitalLogs } from '@/hooks/useDigitalLogs';
import { useAuthStore } from '@/store/authStore';
export function DigitalMinutes({ complexId }) {
    var _a;
    const { user } = useAuthStore();
    const { digitalLogs, selectedLog, loading, error, pagination, createLog, updateLog, deleteLog, searchLogs, reviewLog, setSelectedLog, clearError, getLogStats } = useDigitalLogs();
    // Estados locales
    const [activeTab, setActiveTab] = useState('list');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        logType: '',
        priority: '',
        status: '',
        category: ''
    });
    // Formulario de creación
    const [formData, setFormData] = useState({
        shiftDate: new Date().toISOString().split('T')[0],
        shiftStart: new Date().toISOString(),
        title: '',
        description: '',
        logType: 'GENERAL',
        priority: 'NORMAL',
        category: 'OTHER',
        requiresFollowUp: false
    });
    const handleCreateLog = () => __awaiter(this, void 0, void 0, function* () {
        const success = yield createLog(formData);
        if (success) {
            setCreateDialogOpen(false);
            setFormData({
                shiftDate: new Date().toISOString().split('T')[0],
                shiftStart: new Date().toISOString(),
                title: '',
                description: '',
                logType: 'GENERAL',
                priority: 'NORMAL',
                category: 'OTHER',
                requiresFollowUp: false
            });
        }
    });
    const handleSearch = () => {
        const searchFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ''));
        searchLogs(searchFilters);
    };
    const getPriorityColor = (priority) => {
        const colors = {
            'LOW': 'bg-gray-100 text-gray-800',
            'NORMAL': 'bg-blue-100 text-blue-800',
            'HIGH': 'bg-orange-100 text-orange-800',
            'URGENT': 'bg-red-100 text-red-800',
            'CRITICAL': 'bg-red-600 text-white'
        };
        return colors[priority] || colors.NORMAL;
    };
    const getStatusColor = (status) => {
        const colors = {
            'OPEN': 'bg-green-100 text-green-800',
            'IN_REVIEW': 'bg-yellow-100 text-yellow-800',
            'RESOLVED': 'bg-blue-100 text-blue-800',
            'CLOSED': 'bg-gray-100 text-gray-800',
            'CANCELLED': 'bg-red-100 text-red-800'
        };
        return colors[status] || colors.OPEN;
    };
    // Verificar permisos
    if (!user || !['ADMIN', 'COMPLEX_ADMIN', 'RECEPTION', 'GUARD'].includes(user.role)) {
        return (_jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: _jsxs(Alert, { children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "No tienes permisos para acceder al sistema de minutas digitales." })] }) }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [_jsx(FileText, { className: "h-6 w-6" }), "Minutas Digitales de Seguridad"] }), _jsx("p", { className: "text-muted-foreground", children: "Registro digital de novedades y turnos de guardia" })] }), _jsxs(Dialog, { open: createDialogOpen, onOpenChange: setCreateDialogOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Nueva Minuta"] }) }), _jsxs(DialogContent, { className: "max-w-2xl max-h-[80vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Crear Nueva Minuta Digital" }), _jsx(DialogDescription, { children: "Registra las novedades del turno de seguridad" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "shiftDate", children: "Fecha del Turno" }), _jsx(Input, { id: "shiftDate", type: "date", value: formData.shiftDate, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { shiftDate: e.target.value })) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "shiftStart", children: "Hora de Inicio" }), _jsx(Input, { id: "shiftStart", type: "datetime-local", value: (_a = formData.shiftStart) === null || _a === void 0 ? void 0 : _a.slice(0, 16), onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { shiftStart: new Date(e.target.value).toISOString() })) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "logType", children: "Tipo de Registro" }), _jsxs(Select, { value: formData.logType, onValueChange: (value) => setFormData(Object.assign(Object.assign({}, formData), { logType: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "GENERAL", children: "General" }), _jsx(SelectItem, { value: "INCIDENT", children: "Incidente" }), _jsx(SelectItem, { value: "VISITOR", children: "Visitante" }), _jsx(SelectItem, { value: "MAINTENANCE", children: "Mantenimiento" }), _jsx(SelectItem, { value: "PATROL", children: "Ronda" }), _jsx(SelectItem, { value: "HANDOVER", children: "Entrega de Turno" }), _jsx(SelectItem, { value: "EMERGENCY", children: "Emergencia" }), _jsx(SelectItem, { value: "SYSTEM_CHECK", children: "Verificaci\u00F3n de Sistemas" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "priority", children: "Prioridad" }), _jsxs(Select, { value: formData.priority, onValueChange: (value) => setFormData(Object.assign(Object.assign({}, formData), { priority: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "LOW", children: "Baja" }), _jsx(SelectItem, { value: "NORMAL", children: "Normal" }), _jsx(SelectItem, { value: "HIGH", children: "Alta" }), _jsx(SelectItem, { value: "URGENT", children: "Urgente" }), _jsx(SelectItem, { value: "CRITICAL", children: "Cr\u00EDtica" })] })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "T\u00EDtulo de la Novedad" }), _jsx(Input, { id: "title", value: formData.title, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { title: e.target.value })), placeholder: "Ej: Incidente en zona de parqueadero" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Descripci\u00F3n Detallada" }), _jsx(Textarea, { id: "description", value: formData.description, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { description: e.target.value })), placeholder: "Describe detalladamente la novedad, personas involucradas, acciones tomadas...", className: "min-h-24" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "location", children: "Ubicaci\u00F3n" }), _jsx(Input, { id: "location", value: formData.location || '', onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { location: e.target.value })), placeholder: "Ej: Torre A - Primer piso" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "category", children: "Categor\u00EDa" }), _jsxs(Select, { value: formData.category, onValueChange: (value) => setFormData(Object.assign(Object.assign({}, formData), { category: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "ACCESS_CONTROL", children: "Control de Acceso" }), _jsx(SelectItem, { value: "VISITOR_MGMT", children: "Gesti\u00F3n de Visitantes" }), _jsx(SelectItem, { value: "INCIDENT", children: "Incidentes" }), _jsx(SelectItem, { value: "MAINTENANCE", children: "Mantenimiento" }), _jsx(SelectItem, { value: "SAFETY", children: "Seguridad" }), _jsx(SelectItem, { value: "EMERGENCY", children: "Emergencias" }), _jsx(SelectItem, { value: "PATROL", children: "Rondas" }), _jsx(SelectItem, { value: "SYSTEM_ALERT", children: "Alertas del Sistema" }), _jsx(SelectItem, { value: "COMMUNICATION", children: "Comunicaciones" }), _jsx(SelectItem, { value: "OTHER", children: "Otros" })] })] })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "requiresFollowUp", checked: formData.requiresFollowUp, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { requiresFollowUp: e.target.checked })) }), _jsx(Label, { htmlFor: "requiresFollowUp", children: "Requiere seguimiento" })] }), _jsxs(Button, { onClick: handleCreateLog, disabled: loading || !formData.title || !formData.description, className: "w-full", children: [loading ? (_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" })) : (_jsx(Plus, { className: "h-4 w-4 mr-2" })), "Crear Minuta"] })] })] })] })] }), error && (_jsxs(Alert, { variant: "destructive", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: error })] })), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsx(TabsTrigger, { value: "list", children: "Lista de Minutas" }), _jsx(TabsTrigger, { value: "stats", children: "Estad\u00EDsticas" }), _jsx(TabsTrigger, { value: "filters", children: "Filtros" })] }), _jsx(TabsContent, { value: "list", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Minutas Digitales" }), _jsx(CardDescription, { children: "Registro de novedades y eventos del personal de seguridad" })] }), _jsx(CardContent, { children: digitalLogs.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [_jsx(FileText, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "No hay minutas registradas" }), _jsx("p", { className: "text-sm", children: "Crea la primera minuta del turno" })] })) : (_jsxs("div", { className: "space-y-4", children: [digitalLogs.map((log) => (_jsx(Card, { className: "relative", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("h3", { className: "font-medium", children: log.title }), _jsx(Badge, { className: getPriorityColor(log.priority), children: log.priority }), _jsx(Badge, { className: getStatusColor(log.status), children: log.status })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-2", children: log.description.length > 100
                                                                            ? `${log.description.substring(0, 100)}...`
                                                                            : log.description }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), new Date(log.shiftDate).toLocaleDateString()] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3" }), new Date(log.shiftStart).toLocaleTimeString()] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(User, { className: "h-3 w-3" }), log.guard.name] }), log.location && (_jsx("span", { children: log.location }))] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [log.requiresFollowUp && (_jsx(AlertTriangle, { className: "h-4 w-4 text-orange-600" })), log.supervisorReview && (_jsx(CheckCircle, { className: "h-4 w-4 text-green-600" })), _jsx(Button, { size: "sm", variant: "outline", onClick: () => {
                                                                            setSelectedLog(log);
                                                                            setViewDialogOpen(true);
                                                                        }, children: _jsx(Eye, { className: "h-4 w-4" }) }), ['ADMIN', 'COMPLEX_ADMIN'].includes((user === null || user === void 0 ? void 0 : user.role) || '') && (_jsxs(_Fragment, { children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => reviewLog(log.id, 'Revisado por supervisor'), children: _jsx(Shield, { className: "h-4 w-4" }) }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => deleteLog(log.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] }))] })] }) }) }, log.id))), pagination && pagination.totalPages > 1 && (_jsxs("div", { className: "flex justify-center gap-2 mt-4", children: [_jsx(Button, { variant: "outline", disabled: !pagination.hasPrevious, onClick: () => searchLogs(Object.assign(Object.assign({}, filters), { page: pagination.page - 1 })), children: "Anterior" }), _jsxs("span", { className: "flex items-center px-4", children: ["P\u00E1gina ", pagination.page, " de ", pagination.totalPages] }), _jsx(Button, { variant: "outline", disabled: !pagination.hasNext, onClick: () => searchLogs(Object.assign(Object.assign({}, filters), { page: pagination.page + 1 })), children: "Siguiente" })] }))] })) })] }) }), _jsx(TabsContent, { value: "stats", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Estad\u00EDsticas de Minutas" }), _jsx(CardDescription, { children: "Resumen de actividad del personal de seguridad" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: digitalLogs.length }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Total Minutas" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-orange-600", children: digitalLogs.filter(log => log.requiresFollowUp).length }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Requieren Seguimiento" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: digitalLogs.filter(log => log.supervisorReview).length }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Revisadas" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-red-600", children: digitalLogs.filter(log => ['HIGH', 'URGENT', 'CRITICAL'].includes(log.priority)).length }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Alta Prioridad" })] })] }) })] }) }), _jsx(TabsContent, { value: "filters", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Filtros de B\u00FAsqueda" }), _jsx(CardDescription, { children: "Filtra las minutas por diferentes criterios" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "startDate", children: "Fecha Desde" }), _jsx(Input, { id: "startDate", type: "date", value: filters.startDate, onChange: (e) => setFilters(Object.assign(Object.assign({}, filters), { startDate: e.target.value })) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "endDate", children: "Fecha Hasta" }), _jsx(Input, { id: "endDate", type: "date", value: filters.endDate, onChange: (e) => setFilters(Object.assign(Object.assign({}, filters), { endDate: e.target.value })) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "logType", children: "Tipo" }), _jsxs(Select, { value: filters.logType, onValueChange: (value) => setFilters(Object.assign(Object.assign({}, filters), { logType: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Todos los tipos" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Todos" }), _jsx(SelectItem, { value: "GENERAL", children: "General" }), _jsx(SelectItem, { value: "INCIDENT", children: "Incidente" }), _jsx(SelectItem, { value: "VISITOR", children: "Visitante" }), _jsx(SelectItem, { value: "EMERGENCY", children: "Emergencia" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "priority", children: "Prioridad" }), _jsxs(Select, { value: filters.priority, onValueChange: (value) => setFilters(Object.assign(Object.assign({}, filters), { priority: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Todas las prioridades" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Todas" }), _jsx(SelectItem, { value: "LOW", children: "Baja" }), _jsx(SelectItem, { value: "NORMAL", children: "Normal" }), _jsx(SelectItem, { value: "HIGH", children: "Alta" }), _jsx(SelectItem, { value: "URGENT", children: "Urgente" }), _jsx(SelectItem, { value: "CRITICAL", children: "Cr\u00EDtica" })] })] })] })] }), _jsxs(Button, { onClick: handleSearch, className: "w-full", children: [_jsx(Search, { className: "h-4 w-4 mr-2" }), "Aplicar Filtros"] })] })] }) })] }), _jsx(Dialog, { open: viewDialogOpen, onOpenChange: setViewDialogOpen, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[80vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Detalle de Minuta Digital" }) }), selectedLog && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Fecha y Hora" }), _jsx("p", { children: new Date(selectedLog.shiftStart).toLocaleString() })] }), _jsxs("div", { children: [_jsx(Label, { children: "Guardia" }), _jsx("p", { children: selectedLog.guard.name })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "T\u00EDtulo" }), _jsx("p", { className: "font-medium", children: selectedLog.title })] }), _jsxs("div", { children: [_jsx(Label, { children: "Descripci\u00F3n" }), _jsx("p", { children: selectedLog.description })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Badge, { className: getPriorityColor(selectedLog.priority), children: selectedLog.priority }), _jsx(Badge, { className: getStatusColor(selectedLog.status), children: selectedLog.status }), selectedLog.requiresFollowUp && (_jsx(Badge, { variant: "outline", children: "Requiere Seguimiento" }))] })] }))] }) })] }));
}
export default DigitalMinutes;
