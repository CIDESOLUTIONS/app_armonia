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
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw as RefreshIcon, PlusCircle as AddIcon, Edit as EditIcon, Trash2 as DeleteIcon, CheckCircle as CheckIcon, AlertTriangle as WarningIcon, XCircle as ErrorIcon, Info as InfoIcon, Bell as NotificationsIcon, Settings as SettingsIcon, LayoutDashboard as DashboardIcon, Ban as CancelIcon, Loader2 } from 'lucide-react';
// Enums para tipos de monitoreo
var MonitoringType;
(function (MonitoringType) {
    MonitoringType["INFRASTRUCTURE"] = "INFRASTRUCTURE";
    MonitoringType["APPLICATION"] = "APPLICATION";
    MonitoringType["USER_EXPERIENCE"] = "USER_EXPERIENCE";
})(MonitoringType || (MonitoringType = {}));
// Estados de monitoreo
var MonitoringStatus;
(function (MonitoringStatus) {
    MonitoringStatus["SUCCESS"] = "SUCCESS";
    MonitoringStatus["WARNING"] = "WARNING";
    MonitoringStatus["ERROR"] = "ERROR";
    MonitoringStatus["CRITICAL"] = "CRITICAL";
})(MonitoringStatus || (MonitoringStatus = {}));
// Estados de alerta
var AlertStatus;
(function (AlertStatus) {
    AlertStatus["ACTIVE"] = "ACTIVE";
    AlertStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    AlertStatus["RESOLVED"] = "RESOLVED";
})(AlertStatus || (AlertStatus = {}));
// Severidad de alertas
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["INFO"] = "INFO";
    AlertSeverity["WARNING"] = "WARNING";
    AlertSeverity["ERROR"] = "ERROR";
    AlertSeverity["CRITICAL"] = "CRITICAL";
})(AlertSeverity || (AlertSeverity = {}));
/**
 * Componente principal para el Dashboard de Monitoreo
 */
const MonitoringDashboard = () => {
    var _a, _b, _c;
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('summary');
    const [loading, setLoading] = useState(true);
    const [configs, setConfigs] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState(null);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [openConfigDialog, setOpenConfigDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [configFormData, setConfigFormData] = useState({
        name: '',
        description: '',
        monitoringType: MonitoringType.APPLICATION,
        checkInterval: 300,
        targetResource: '',
        parameters: {},
        alertThresholds: {
            warning: 1000,
            error: 3000,
            critical: 5000
        },
        isActive: true
    });
    const [refreshing, setRefreshing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    // Verificar si el usuario es administrador
    useEffect(() => {
        if (session && session.user) {
            setIsAdmin(session.user.role === 'ADMIN');
        }
    }, [session]);
    // Cargar configuraciones de monitoreo
    const loadConfigs = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios.get('/api/monitoring/configs');
            setConfigs(response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error al cargar configuraciones:', error);
            toast({
                title: 'Error',
                description: 'Error al cargar configuraciones',
                variant: 'destructive',
            });
            throw error;
        }
    }), []);
    // Cargar alertas activas
    const loadAlerts = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios.get('/api/monitoring/alerts');
            setAlerts(response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error al cargar alertas:', error);
            toast({
                title: 'Error',
                description: 'Error al cargar alertas',
                variant: 'destructive',
            });
            throw error;
        }
    }), []);
    // Cargar estadísticas generales
    const loadStats = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios.get('/api/monitoring/stats');
            setStats(response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error al cargar estadísticas:', error);
            toast({
                title: 'Error',
                description: 'Error al cargar estadísticas',
                variant: 'destructive',
            });
            throw error;
        }
    }), []);
    // Cargar datos del dashboard
    const loadDashboardData = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            yield Promise.all([
                loadConfigs(),
                loadAlerts(),
                loadStats()
            ]);
        }
        catch (error) {
            console.error('Error al cargar datos del dashboard:', error);
            toast({
                title: 'Error',
                description: 'Error al cargar datos del dashboard',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [loadConfigs, loadAlerts, loadStats]);
    // Cargar datos al iniciar
    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);
    // Refrescar datos
    const handleRefresh = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setRefreshing(true);
            yield loadDashboardData();
            toast({
                title: 'Éxito',
                description: 'Datos actualizados correctamente',
            });
        }
        catch (error) {
            toast({
                title: 'Error',
                description: 'Error al actualizar datos',
                variant: 'destructive',
            });
        }
        finally {
            setRefreshing(false);
        }
    });
    // Ejecutar verificación manual
    const handleExecuteCheck = (configId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setRefreshing(true);
            yield axios.post(`/api/monitoring/configs/${configId}/check`);
            yield loadDashboardData();
            toast({
                title: 'Éxito',
                description: 'Verificación ejecutada correctamente',
            });
        }
        catch (error) {
            console.error('Error al ejecutar verificación:', error);
            toast({
                title: 'Error',
                description: 'Error al ejecutar verificación',
                variant: 'destructive',
            });
        }
        finally {
            setRefreshing(false);
        }
    });
    // Manejar cambio de pestaña
    const handleTabChange = (value) => {
        setActiveTab(value);
    };
    // Manejar cambios en formulario
    const handleFormChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        if (name.startsWith('alertThresholds.')) {
            const threshold = name.split('.')[1];
            setConfigFormData(prev => (Object.assign(Object.assign({}, prev), { alertThresholds: Object.assign(Object.assign({}, prev.alertThresholds), { [threshold]: type === 'number' ? Number(value) : value }) })));
        }
        else if (name.startsWith('parameters.')) {
            const param = name.split('.')[1];
            setConfigFormData(prev => (Object.assign(Object.assign({}, prev), { parameters: Object.assign(Object.assign({}, prev.parameters), { [param]: value }) })));
        }
        else {
            setConfigFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'checkbox' ? checked : value })));
        }
    };
    // Abrir diálogo para crear configuración
    const handleOpenCreateDialog = () => {
        setConfigFormData({
            name: '',
            description: '',
            monitoringType: MonitoringType.APPLICATION,
            checkInterval: 300,
            targetResource: '',
            parameters: {},
            alertThresholds: {
                warning: 1000,
                error: 3000,
                critical: 5000
            },
            isActive: true
        });
        setSelectedConfig(null);
        setOpenConfigDialog(true);
    };
    // Abrir diálogo para editar configuración
    const handleOpenEditDialog = (config) => {
        setConfigFormData({
            name: config.name,
            description: config.description || '',
            monitoringType: config.monitoringType,
            checkInterval: config.checkInterval,
            targetResource: config.targetResource,
            parameters: config.parameters || {},
            alertThresholds: config.alertThresholds,
            isActive: config.isActive
        });
        setSelectedConfig(config);
        setOpenConfigDialog(true);
    };
    // Abrir diálogo para eliminar configuración
    const handleOpenDeleteDialog = (config) => {
        setSelectedConfig(config);
        setOpenDeleteDialog(true);
    };
    // Abrir diálogo para gestionar alerta
    const handleOpenAlertDialog = (alert) => {
        setSelectedAlert(alert);
        setOpenAlertDialog(true);
    };
    // Crear o actualizar configuración
    const handleSaveConfig = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (selectedConfig) {
                // Actualizar configuración existente
                yield axios.put(`/api/monitoring/configs/${selectedConfig.id}`, configFormData);
                toast({
                    title: 'Éxito',
                    description: 'Configuración actualizada correctamente',
                });
            }
            else {
                // Crear nueva configuración
                yield axios.post('/api/monitoring/configs', configFormData);
                toast({
                    title: 'Éxito',
                    description: 'Configuración creada correctamente',
                });
            }
            setOpenConfigDialog(false);
            yield loadConfigs();
        }
        catch (error) {
            console.error('Error al guardar configuración:', error);
            toast({
                title: 'Error',
                description: 'Error al guardar configuración',
                variant: 'destructive',
            });
        }
    });
    // Eliminar configuración
    const handleDeleteConfig = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield axios.delete(`/api/monitoring/configs/${selectedConfig.id}`);
            setOpenDeleteDialog(false);
            yield loadConfigs();
            toast({
                title: 'Éxito',
                description: 'Configuración eliminada correctamente',
            });
        }
        catch (error) {
            console.error('Error al eliminar configuración:', error);
            toast({
                title: 'Error',
                description: 'Error al eliminar configuración',
                variant: 'destructive',
            });
        }
    });
    // Reconocer alerta
    const handleAcknowledgeAlert = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield axios.post(`/api/monitoring/alerts/${selectedAlert.id}/acknowledge`);
            setOpenAlertDialog(false);
            yield loadAlerts();
            toast({
                title: 'Éxito',
                description: 'Alerta reconocida correctamente',
            });
        }
        catch (error) {
            console.error('Error al reconocer alerta:', error);
            toast({
                title: 'Error',
                description: 'Error al reconocer alerta',
                variant: 'destructive',
            });
        }
    });
    // Resolver alerta
    const handleResolveAlert = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield axios.post(`/api/monitoring/alerts/${selectedAlert.id}/resolve`);
            setOpenAlertDialog(false);
            yield loadAlerts();
            toast({
                title: 'Éxito',
                description: 'Alerta resuelta correctamente',
            });
        }
        catch (error) {
            console.error('Error al resolver alerta:', error);
            toast({
                title: 'Error',
                description: 'Error al resolver alerta',
                variant: 'destructive',
            });
        }
    });
    // Renderizar icono según estado de monitoreo
    const renderStatusIcon = (status) => {
        switch (status) {
            case MonitoringStatus.SUCCESS:
                return _jsx(CheckIcon, { className: "h-5 w-5 text-green-500" });
            case MonitoringStatus.WARNING:
                return _jsx(WarningIcon, { className: "h-5 w-5 text-yellow-500" });
            case MonitoringStatus.ERROR:
                return _jsx(ErrorIcon, { className: "h-5 w-5 text-red-500" });
            case MonitoringStatus.CRITICAL:
                return _jsx(CancelIcon, { className: "h-5 w-5 text-red-700" });
            default:
                return _jsx(InfoIcon, { className: "h-5 w-5 text-blue-500" });
        }
    };
    // Renderizar chip según severidad de alerta
    const renderAlertSeverity = (severity) => {
        switch (severity) {
            case AlertSeverity.CRITICAL:
                return _jsx(Badge, { variant: "destructive", children: "Cr\u00EDtica" });
            case AlertSeverity.ERROR:
                return _jsx(Badge, { variant: "destructive", children: "Error" });
            case AlertSeverity.WARNING:
                return _jsx(Badge, { variant: "secondary", children: "Advertencia" });
            case AlertSeverity.INFO:
                return _jsx(Badge, { variant: "outline", children: "Informaci\u00F3n" });
            default:
                return _jsx(Badge, { variant: "outline", children: severity });
        }
    };
    // Renderizar chip según estado de alerta
    const renderAlertStatus = (status) => {
        switch (status) {
            case AlertStatus.ACTIVE:
                return _jsx(Badge, { variant: "destructive", children: "Activa" });
            case AlertStatus.ACKNOWLEDGED:
                return _jsx(Badge, { variant: "secondary", children: "Reconocida" });
            case AlertStatus.RESOLVED:
                return _jsx(Badge, { variant: "default", children: "Resuelta" });
            default:
                return _jsx(Badge, { variant: "outline", children: status });
        }
    };
    // Renderizar tipo de monitoreo
    const renderMonitoringType = (type) => {
        switch (type) {
            case MonitoringType.INFRASTRUCTURE:
                return 'Infraestructura';
            case MonitoringType.APPLICATION:
                return 'Aplicación';
            case MonitoringType.USER_EXPERIENCE:
                return 'Experiencia de Usuario';
            default:
                return type;
        }
    };
    // Renderizar pestaña de resumen
    const renderSummaryTab = () => {
        if (loading) {
            return (_jsx("div", { className: "flex justify-center my-4", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
        }
        return (_jsxs("div", { children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Configuraciones Activas" }), _jsx("p", { className: "text-2xl font-bold", children: configs.filter(c => c.isActive).length })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Alertas Activas" }), _jsx("p", { className: `text-2xl font-bold ${alerts.length > 0 ? 'text-red-600' : 'text-gray-900'}`, children: alerts.length })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Disponibilidad Promedio" }), _jsx("p", { className: "text-2xl font-bold", children: (stats === null || stats === void 0 ? void 0 : stats.overallAvailability) ? `${stats.overallAvailability.toFixed(2)}%` : 'N/A' })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Tiempo de Respuesta Promedio" }), _jsx("p", { className: "text-2xl font-bold", children: (stats === null || stats === void 0 ? void 0 : stats.overallResponseTime) ? `${stats.overallResponseTime.toFixed(0)}ms` : 'N/A' })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Disponibilidad por D\u00EDa" }), _jsx(CardDescription, { children: "Gr\u00E1fico de disponibilidad (placeholder)" })] }), _jsx(CardContent, { children: _jsx("div", { className: "h-48 bg-gray-100 flex items-center justify-center rounded-md", children: _jsx("p", { className: "text-gray-500", children: "Gr\u00E1fico de L\u00EDnea aqu\u00ED" }) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Distribuci\u00F3n de Estados" }), _jsx(CardDescription, { children: "Gr\u00E1fico de distribuci\u00F3n (placeholder)" })] }), _jsx(CardContent, { children: _jsx("div", { className: "h-48 bg-gray-100 flex items-center justify-center rounded-md", children: _jsx("p", { className: "text-gray-500", children: "Gr\u00E1fico de Pastel aqu\u00ED" }) }) })] })] }), _jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Alertas Recientes" }), alerts.length > 0 ? (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Severidad" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { children: "Mensaje" }), _jsx(TableHead, { children: "Recurso" }), _jsx(TableHead, { children: "Fecha" }), _jsx(TableHead, { className: "text-right", children: "Acciones" })] }) }), _jsx(TableBody, { children: alerts.slice(0, 5).map((alert) => {
                                        var _a;
                                        return (_jsxs(TableRow, { children: [_jsx(TableCell, { children: renderAlertSeverity(alert.severity) }), _jsx(TableCell, { children: renderAlertStatus(alert.status) }), _jsx(TableCell, { children: alert.message }), _jsx(TableCell, { children: ((_a = alert.config) === null || _a === void 0 ? void 0 : _a.name) || 'N/A' }), _jsx(TableCell, { children: new Date(alert.timestamp).toLocaleString() }), _jsx(TableCell, { className: "text-right", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleOpenAlertDialog(alert), disabled: alert.status === AlertStatus.RESOLVED, children: _jsx(InfoIcon, { className: "h-4 w-4" }) }) })] }, alert.id));
                                    }) })] })) : (_jsxs(Alert, { children: [_jsx(AlertTitle, { children: "No hay alertas activas" }), _jsx(AlertDescription, { children: "Todo parece estar funcionando correctamente." })] })), alerts.length > 5 && (_jsx("div", { className: "flex justify-end mt-2", children: _jsx(Button, { variant: "link", onClick: () => setActiveTab('alerts'), children: "Ver todas las alertas" }) }))] })] }));
    };
    // Renderizar pestaña de alertas
    const renderAlertsTab = () => {
        if (loading) {
            return (_jsx("div", { className: "flex justify-center my-4", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
        }
        return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Alertas Activas" }), _jsxs(Button, { variant: "outline", onClick: handleRefresh, disabled: refreshing, children: [_jsx(RefreshIcon, { className: "mr-2 h-4 w-4" }), "Actualizar"] })] }), alerts.length > 0 ? (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Severidad" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { children: "Mensaje" }), _jsx(TableHead, { children: "Recurso" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Fecha" }), _jsx(TableHead, { className: "text-right", children: "Acciones" })] }) }), _jsx(TableBody, { children: alerts.map((alert) => {
                                var _a, _b;
                                return (_jsxs(TableRow, { children: [_jsx(TableCell, { children: renderAlertSeverity(alert.severity) }), _jsx(TableCell, { children: renderAlertStatus(alert.status) }), _jsx(TableCell, { children: alert.message }), _jsx(TableCell, { children: ((_a = alert.config) === null || _a === void 0 ? void 0 : _a.name) || 'N/A' }), _jsx(TableCell, { children: renderMonitoringType((_b = alert.config) === null || _b === void 0 ? void 0 : _b.monitoringType) }), _jsx(TableCell, { children: new Date(alert.timestamp).toLocaleString() }), _jsx(TableCell, { className: "text-right", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleOpenAlertDialog(alert), disabled: alert.status === AlertStatus.RESOLVED, children: _jsx(InfoIcon, { className: "h-4 w-4" }) }) })] }, alert.id));
                            }) })] })) : (_jsxs(Alert, { children: [_jsx(AlertTitle, { children: "No hay alertas activas" }), _jsx(AlertDescription, { children: "Todo parece estar funcionando correctamente." })] }))] }));
    };
    // Renderizar pestaña de configuraciones
    const renderConfigsTab = () => {
        if (loading) {
            return (_jsx("div", { className: "flex justify-center my-4", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
        }
        return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Configuraciones de Monitoreo" }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "outline", onClick: handleRefresh, disabled: refreshing, children: [_jsx(RefreshIcon, { className: "mr-2 h-4 w-4" }), "Actualizar"] }), isAdmin && (_jsxs(Button, { variant: "default", onClick: handleOpenCreateDialog, children: [_jsx(AddIcon, { className: "mr-2 h-4 w-4" }), "A\u00F1adir Configuraci\u00F3n"] }))] })] }), configs.length > 0 ? (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Recurso" }), _jsx(TableHead, { children: "Intervalo" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { className: "text-right", children: "Acciones" })] }) }), _jsx(TableBody, { children: configs.map((config) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: config.name }), _jsx(TableCell, { children: renderMonitoringType(config.monitoringType) }), _jsx(TableCell, { children: config.targetResource }), _jsxs(TableCell, { children: [config.checkInterval, " seg."] }), _jsx(TableCell, { children: _jsx(Badge, { variant: config.isActive ? 'default' : 'secondary', children: config.isActive ? 'Activo' : 'Inactivo' }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleExecuteCheck(config.id), disabled: !config.isActive || refreshing, title: "Ejecutar verificaci\u00F3n", children: _jsx(CheckIcon, { className: "h-4 w-4" }) }), isAdmin && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleOpenEditDialog(config), title: "Editar", children: _jsx(EditIcon, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleOpenDeleteDialog(config), title: "Eliminar", children: _jsx(DeleteIcon, { className: "h-4 w-4" }) })] }))] })] }, config.id))) })] })) : (_jsxs(Alert, { children: [_jsx(AlertTitle, { children: "No hay configuraciones de monitoreo" }), _jsx(AlertDescription, { children: isAdmin && (_jsx(Button, { variant: "link", onClick: handleOpenCreateDialog, className: "p-0", children: "Crear una nueva configuraci\u00F3n" })) })] }))] }));
    };
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Dashboard de Monitoreo" }), _jsxs(Button, { variant: "outline", onClick: handleRefresh, disabled: refreshing, children: [_jsx(RefreshIcon, { className: "mr-2 h-4 w-4" }), "Actualizar"] })] }), _jsx("div", { className: "border-b border-gray-200 mb-4", children: _jsxs("div", { className: "flex space-x-4", children: [_jsxs(Button, { variant: activeTab === 'summary' ? 'default' : 'ghost', onClick: () => handleTabChange('summary'), children: [_jsx(DashboardIcon, { className: "mr-2 h-4 w-4" }), "Resumen"] }), _jsxs(Button, { variant: activeTab === 'alerts' ? 'default' : 'ghost', onClick: () => handleTabChange('alerts'), children: [_jsx(NotificationsIcon, { className: "mr-2 h-4 w-4" }), "Alertas ", alerts.length > 0 && `(${alerts.length})`] }), _jsxs(Button, { variant: activeTab === 'configs' ? 'default' : 'ghost', onClick: () => handleTabChange('configs'), children: [_jsx(SettingsIcon, { className: "mr-2 h-4 w-4" }), "Configuraciones"] })] }) }), _jsxs("div", { children: [activeTab === 'summary' && renderSummaryTab(), activeTab === 'alerts' && renderAlertsTab(), activeTab === 'configs' && renderConfigsTab()] }), _jsx(Dialog, { open: openConfigDialog, onOpenChange: setOpenConfigDialog, children: _jsxs(DialogContent, { className: "sm:max-w-[600px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: selectedConfig ? 'Editar Configuración' : 'Nueva Configuración' }), _jsx(DialogDescription, { children: "Configure los detalles de la monitorizaci\u00F3n." })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "name", className: "text-right", children: "Nombre" }), _jsx(Input, { id: "name", name: "name", value: configFormData.name, onChange: handleFormChange, className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "monitoringType", className: "text-right", children: "Tipo de Monitoreo" }), _jsxs(Select, { name: "monitoringType", value: configFormData.monitoringType, onValueChange: (value) => handleFormChange({ target: { name: 'monitoringType', value } }), children: [_jsx(SelectTrigger, { className: "col-span-3", children: _jsx(SelectValue, { placeholder: "Seleccione tipo" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: MonitoringType.INFRASTRUCTURE, children: "Infraestructura" }), _jsx(SelectItem, { value: MonitoringType.APPLICATION, children: "Aplicaci\u00F3n" }), _jsx(SelectItem, { value: MonitoringType.USER_EXPERIENCE, children: "Experiencia de Usuario" })] })] })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "description", className: "text-right", children: "Descripci\u00F3n" }), _jsx(Textarea, { id: "description", name: "description", value: configFormData.description, onChange: handleFormChange, className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "targetResource", className: "text-right", children: "Recurso a Monitorear" }), _jsx(Input, { id: "targetResource", name: "targetResource", value: configFormData.targetResource, onChange: handleFormChange, className: "col-span-3", required: true, placeholder: configFormData.monitoringType === MonitoringType.INFRASTRUCTURE
                                                ? 'Ejemplo: server:cpu, database:connections'
                                                : configFormData.monitoringType === MonitoringType.APPLICATION
                                                    ? 'Ejemplo: api:https://api.example.com/status, service:auth'
                                                    : 'Ejemplo: pageload:home, errors:javascript' })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "checkInterval", className: "text-right", children: "Intervalo de Verificaci\u00F3n (seg)" }), _jsx(Input, { id: "checkInterval", name: "checkInterval", type: "number", value: configFormData.checkInterval, onChange: handleFormChange, className: "col-span-3", required: true, min: 30 })] }), _jsxs("div", { className: "col-span-full", children: [_jsx("h4", { className: "text-md font-medium mb-2", children: "Umbrales de Alerta" }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "warningThreshold", children: "Advertencia" }), _jsx(Input, { id: "warningThreshold", name: "alertThresholds.warning", type: "number", value: configFormData.alertThresholds.warning, onChange: handleFormChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "errorThreshold", children: "Error" }), _jsx(Input, { id: "errorThreshold", name: "alertThresholds.error", type: "number", value: configFormData.alertThresholds.error, onChange: handleFormChange, required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "criticalThreshold", children: "Cr\u00EDtico" }), _jsx(Input, { id: "criticalThreshold", name: "alertThresholds.critical", type: "number", value: configFormData.alertThresholds.critical, onChange: handleFormChange, required: true })] })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Switch, { id: "isActive", name: "isActive", checked: configFormData.isActive, onCheckedChange: (checked) => handleFormChange({ target: { name: 'isActive', checked, type: 'checkbox' } }) }), _jsx(Label, { htmlFor: "isActive", children: "Configuraci\u00F3n Activa" })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setOpenConfigDialog(false), children: "Cancelar" }), _jsx(Button, { onClick: handleSaveConfig, children: selectedConfig ? 'Actualizar' : 'Crear' })] })] }) }), _jsx(Dialog, { open: openDeleteDialog, onOpenChange: setOpenDeleteDialog, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Confirmar eliminaci\u00F3n" }), _jsxs(DialogDescription, { children: ["\u00BFEst\u00E1 seguro de que desea eliminar la configuraci\u00F3n \"", selectedConfig === null || selectedConfig === void 0 ? void 0 : selectedConfig.name, "\"? Esta acci\u00F3n eliminar\u00E1 tambi\u00E9n todos los resultados y alertas asociados."] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setOpenDeleteDialog(false), children: "Cancelar" }), _jsx(Button, { variant: "destructive", onClick: handleDeleteConfig, children: "Eliminar" })] })] }) }), _jsx(Dialog, { open: openAlertDialog, onOpenChange: setOpenAlertDialog, children: _jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Detalles de Alerta" }), _jsx(DialogDescription, { children: "Informaci\u00F3n detallada sobre la alerta seleccionada." })] }), selectedAlert && (_jsxs("div", { className: "py-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold", children: selectedAlert.message }), _jsx("p", { className: "text-sm text-gray-500", children: new Date(selectedAlert.timestamp).toLocaleString() })] }), _jsx("div", { children: renderAlertSeverity(selectedAlert.severity) })] }), _jsx("h5", { className: "text-md font-semibold mt-4 mb-1", children: "Recurso Afectado" }), _jsxs("p", { className: "text-sm", children: [((_a = selectedAlert.config) === null || _a === void 0 ? void 0 : _a.name) || 'N/A', " (", ((_b = selectedAlert.config) === null || _b === void 0 ? void 0 : _b.targetResource) || 'N/A', ")"] }), _jsx("h5", { className: "text-md font-semibold mt-4 mb-1", children: "Detalles" }), _jsx("div", { className: "bg-gray-100 p-3 rounded-md overflow-x-auto", children: _jsx("pre", { className: "text-sm whitespace-pre-wrap", children: JSON.stringify(selectedAlert.details, null, 2) }) }), selectedAlert.status === AlertStatus.ACKNOWLEDGED && (_jsxs("div", { className: "mt-4 text-sm", children: [_jsxs("p", { children: [_jsx("strong", { children: "Reconocida por:" }), " ", ((_c = selectedAlert.acknowledgedBy) === null || _c === void 0 ? void 0 : _c.name) || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha de reconocimiento:" }), " ", selectedAlert.acknowledgedAt ? new Date(selectedAlert.acknowledgedAt).toLocaleString() : 'N/A'] })] }))] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setOpenAlertDialog(false), children: "Cerrar" }), selectedAlert && selectedAlert.status === AlertStatus.ACTIVE && (_jsx(Button, { onClick: handleAcknowledgeAlert, variant: "secondary", children: "Reconocer" })), selectedAlert && (selectedAlert.status === AlertStatus.ACTIVE || selectedAlert.status === AlertStatus.ACKNOWLEDGED) && (_jsx(Button, { onClick: handleResolveAlert, children: "Resolver" }))] })] }) })] }));
};
export default MonitoringDashboard;
