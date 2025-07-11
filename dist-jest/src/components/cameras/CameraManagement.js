// src/components/cameras/CameraManagement.tsx
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
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Camera, Search, Plus, Square, ZoomIn, ZoomOut, Move, Wifi, WifiOff, AlertTriangle, CheckCircle, Loader2, Eye, MapPin } from 'lucide-react';
import { useCameras } from '@/hooks/useCameras';
import { useAuthStore } from '@/store/authStore';
export function CameraManagement({ complexId }) {
    const { user } = useAuthStore();
    const { cameras, stats, loading, error, discoverCameras, registerCamera, updateCamera, deleteCamera, loadCameras, getStreamUrl, captureSnapshot, movePTZ, stopPTZ, gotoPreset, getPTZCapabilities, connectCamera, checkCameraStatus } = useCameras();
    // Estados locales
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [discoveredCameras, setDiscoveredCameras] = useState([]);
    const [isDiscovering, setIsDiscovering] = useState(false);
    const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
    const [streamUrl, setStreamUrl] = useState(null);
    const [ptzCapabilities, setPtzCapabilities] = useState(null);
    // Formulario de registro
    const [registerForm, setRegisterForm] = useState({
        name: '',
        ipAddress: '',
        port: 554,
        username: '',
        password: '',
        manufacturer: '',
        model: '',
        ptzEnabled: false,
        recordingEnabled: true
    });
    useEffect(() => {
        loadCameras();
    }, [loadCameras]);
    const handleDiscovery = () => __awaiter(this, void 0, void 0, function* () {
        setIsDiscovering(true);
        try {
            const discovered = yield discoverCameras(30000);
            setDiscoveredCameras(discovered);
            if (discovered.length > 0) {
                setActiveTab('discovery');
            }
        }
        catch (error) {
            console.error('Error en discovery:', error);
        }
        finally {
            setIsDiscovering(false);
        }
    });
    const handleRegisterCamera = () => __awaiter(this, void 0, void 0, function* () {
        const success = yield registerCamera(registerForm);
        if (success) {
            setRegisterDialogOpen(false);
            setRegisterForm({
                name: '',
                ipAddress: '',
                port: 554,
                username: '',
                password: '',
                manufacturer: '',
                model: '',
                ptzEnabled: false,
                recordingEnabled: true
            });
        }
    });
    const handleConnectCamera = (camera) => __awaiter(this, void 0, void 0, function* () {
        const connected = yield connectCamera(camera.id);
        if (connected) {
            setSelectedCamera(camera);
            setActiveTab('control');
            // Obtener URL de stream
            const url = yield getStreamUrl(camera.id);
            setStreamUrl(url);
            // Obtener capacidades PTZ si está habilitado
            if (camera.ptzEnabled) {
                const capabilities = yield getPTZCapabilities(camera.id);
                setPtzCapabilities(capabilities);
            }
        }
    });
    const handlePTZMove = (direction) => __awaiter(this, void 0, void 0, function* () {
        if (!selectedCamera)
            return;
        const moves = {
            up: { x: 0, y: 0.1 },
            down: { x: 0, y: -0.1 },
            left: { x: -0.1, y: 0 },
            right: { x: 0.1, y: 0 },
            zoomIn: { x: 0, y: 0, z: 0.1 },
            zoomOut: { x: 0, y: 0, z: -0.1 }
        };
        const { x, y, z } = moves[direction];
        yield movePTZ(selectedCamera.id, x, y, z);
    });
    const handleSnapshot = (camera) => __awaiter(this, void 0, void 0, function* () {
        const imageUrl = yield captureSnapshot(camera.id);
        if (imageUrl) {
            // Abrir imagen en nueva ventana
            window.open(imageUrl, '_blank');
        }
    });
    const getStatusIcon = (status) => {
        switch (status) {
            case 'ONLINE': return _jsx(CheckCircle, { className: "h-4 w-4 text-green-600" });
            case 'OFFLINE': return _jsx(WifiOff, { className: "h-4 w-4 text-red-600" });
            case 'ERROR': return _jsx(AlertTriangle, { className: "h-4 w-4 text-orange-600" });
            default: return _jsx(Wifi, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const getStatusBadge = (status) => {
        const variants = {
            'ONLINE': 'default',
            'OFFLINE': 'destructive',
            'ERROR': 'secondary',
            'UNKNOWN': 'outline'
        };
        return (_jsx(Badge, { variant: variants[status], children: status }));
    };
    // Verificar permisos
    if (!user || !['ADMIN', 'COMPLEX_ADMIN', 'RECEPTION'].includes(user.role)) {
        return (_jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: _jsxs(Alert, { children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "No tienes permisos para acceder al sistema de c\u00E1maras." })] }) }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [_jsx(Camera, { className: "h-6 w-6" }), "Sistema de C\u00E1maras IP"] }), _jsx("p", { className: "text-muted-foreground", children: "Gesti\u00F3n y monitoreo de c\u00E1maras de seguridad" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { onClick: handleDiscovery, disabled: isDiscovering, children: [isDiscovering ? (_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" })) : (_jsx(Search, { className: "h-4 w-4 mr-2" })), "Descubrir C\u00E1maras"] }), _jsxs(Dialog, { open: registerDialogOpen, onOpenChange: setRegisterDialogOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Agregar C\u00E1mara"] }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Registrar Nueva C\u00E1mara" }), _jsx(DialogDescription, { children: "Configura una nueva c\u00E1mara IP en el sistema" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Nombre" }), _jsx(Input, { id: "name", value: registerForm.name, onChange: (e) => setRegisterForm(Object.assign(Object.assign({}, registerForm), { name: e.target.value })), placeholder: "Ej: C\u00E1mara Entrada Principal" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "ipAddress", children: "Direcci\u00F3n IP" }), _jsx(Input, { id: "ipAddress", value: registerForm.ipAddress, onChange: (e) => setRegisterForm(Object.assign(Object.assign({}, registerForm), { ipAddress: e.target.value })), placeholder: "192.168.1.100" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "port", children: "Puerto" }), _jsx(Input, { id: "port", type: "number", value: registerForm.port, onChange: (e) => setRegisterForm(Object.assign(Object.assign({}, registerForm), { port: Number(e.target.value) })) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "username", children: "Usuario" }), _jsx(Input, { id: "username", value: registerForm.username, onChange: (e) => setRegisterForm(Object.assign(Object.assign({}, registerForm), { username: e.target.value })) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "password", children: "Contrase\u00F1a" }), _jsx(Input, { id: "password", type: "password", value: registerForm.password, onChange: (e) => setRegisterForm(Object.assign(Object.assign({}, registerForm), { password: e.target.value })) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "manufacturer", children: "Fabricante" }), _jsxs(Select, { value: registerForm.manufacturer, onValueChange: (value) => setRegisterForm(Object.assign(Object.assign({}, registerForm), { manufacturer: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Hikvision", children: "Hikvision" }), _jsx(SelectItem, { value: "Dahua", children: "Dahua" }), _jsx(SelectItem, { value: "Axis", children: "Axis" }), _jsx(SelectItem, { value: "Bosch", children: "Bosch" }), _jsx(SelectItem, { value: "Samsung", children: "Samsung" }), _jsx(SelectItem, { value: "Otros", children: "Otros" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "model", children: "Modelo" }), _jsx(Input, { id: "model", value: registerForm.model, onChange: (e) => setRegisterForm(Object.assign(Object.assign({}, registerForm), { model: e.target.value })) })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: registerForm.ptzEnabled, onChange: (e) => setRegisterForm(Object.assign(Object.assign({}, registerForm), { ptzEnabled: e.target.checked })) }), _jsx("span", { children: "PTZ Habilitado" })] }), _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: registerForm.recordingEnabled, onChange: (e) => setRegisterForm(Object.assign(Object.assign({}, registerForm), { recordingEnabled: e.target.checked })) }), _jsx("span", { children: "Grabaci\u00F3n Habilitada" })] })] }), _jsxs(Button, { onClick: handleRegisterCamera, disabled: loading || !registerForm.name || !registerForm.ipAddress, className: "w-full", children: [loading ? (_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" })) : (_jsx(Plus, { className: "h-4 w-4 mr-2" })), "Registrar C\u00E1mara"] })] })] })] })] })] }), error && (_jsxs(Alert, { variant: "destructive", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: error })] })), stats && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: [_jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Total" }), _jsx("p", { className: "text-2xl font-bold", children: stats.total })] }), _jsx(Camera, { className: "h-8 w-8 text-gray-600" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "En L\u00EDnea" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: stats.online })] }), _jsx(CheckCircle, { className: "h-8 w-8 text-green-600" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Fuera de L\u00EDnea" }), _jsx("p", { className: "text-2xl font-bold text-red-600", children: stats.offline })] }), _jsx(WifiOff, { className: "h-8 w-8 text-red-600" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Error" }), _jsx("p", { className: "text-2xl font-bold text-orange-600", children: stats.error })] }), _jsx(AlertTriangle, { className: "h-8 w-8 text-orange-600" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Desconocido" }), _jsx("p", { className: "text-2xl font-bold text-gray-600", children: stats.unknown })] }), _jsx(Wifi, { className: "h-8 w-8 text-gray-600" })] }) }) })] })), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [_jsx(TabsTrigger, { value: "overview", children: "Vista General" }), _jsx(TabsTrigger, { value: "discovery", children: "Discovery" }), _jsx(TabsTrigger, { value: "control", children: "Control" }), _jsx(TabsTrigger, { value: "settings", children: "Configuraci\u00F3n" })] }), _jsx(TabsContent, { value: "overview", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "C\u00E1maras Registradas" }), _jsx(CardDescription, { children: "Lista de todas las c\u00E1maras configuradas en el sistema" })] }), _jsx(CardContent, { children: cameras.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [_jsx(Camera, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "No hay c\u00E1maras registradas" }), _jsx("p", { className: "text-sm", children: "Usa \"Descubrir C\u00E1maras\" o \"Agregar C\u00E1mara\" para comenzar" })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: cameras.map((camera) => (_jsx(Card, { className: "relative", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium", children: camera.name }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [camera.ipAddress, ":", camera.port] })] }), getStatusIcon(camera.status)] }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm", children: "Estado:" }), getStatusBadge(camera.status)] }), camera.manufacturer && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm", children: "Fabricante:" }), _jsx("span", { className: "text-sm", children: camera.manufacturer })] })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm", children: "PTZ:" }), _jsx(Badge, { variant: camera.ptzEnabled ? 'default' : 'outline', children: camera.ptzEnabled ? 'Sí' : 'No' })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { size: "sm", onClick: () => handleConnectCamera(camera), disabled: camera.status === 'OFFLINE', children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "Ver"] }), _jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleSnapshot(camera), children: [_jsx(Camera, { className: "h-4 w-4 mr-1" }), "Foto"] })] })] }) }, camera.id))) })) })] }) }), _jsx(TabsContent, { value: "discovery", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "C\u00E1maras Descubiertas" }), _jsx(CardDescription, { children: "C\u00E1maras encontradas autom\u00E1ticamente en la red" })] }), _jsx(CardContent, { children: discoveredCameras.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [_jsx(Search, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "No se han descubierto c\u00E1maras" }), _jsx("p", { className: "text-sm", children: "Haz clic en \"Descubrir C\u00E1maras\" para buscar dispositivos en la red" })] })) : (_jsx("div", { className: "space-y-4", children: discoveredCameras.map((camera, index) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Camera, { className: "h-8 w-8 text-blue-600" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium", children: camera.name }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [camera.ipAddress, ":", camera.port] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [camera.manufacturer, " ", camera.model] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", children: camera.capabilities.hasPTZ ? 'PTZ' : 'Fija' }), _jsxs(Button, { size: "sm", onClick: () => {
                                                                setRegisterForm({
                                                                    name: camera.name,
                                                                    ipAddress: camera.ipAddress,
                                                                    port: camera.port,
                                                                    manufacturer: camera.manufacturer,
                                                                    model: camera.model,
                                                                    ptzEnabled: camera.capabilities.hasPTZ,
                                                                    recordingEnabled: camera.capabilities.hasRecording,
                                                                    username: '',
                                                                    password: ''
                                                                });
                                                                setRegisterDialogOpen(true);
                                                            }, children: [_jsx(Plus, { className: "h-4 w-4 mr-1" }), "Registrar"] })] })] }, index))) })) })] }) }), _jsx(TabsContent, { value: "control", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Vista en Vivo" }), selectedCamera && (_jsxs(CardDescription, { children: [selectedCamera.name, " (", selectedCamera.ipAddress, ")"] }))] }), _jsx(CardContent, { children: selectedCamera ? (_jsx("div", { className: "space-y-4", children: streamUrl ? (_jsx("div", { className: "aspect-video bg-black rounded-lg flex items-center justify-center", children: _jsxs("p", { className: "text-white text-sm", children: ["Stream URL: ", streamUrl] }) })) : (_jsx("div", { className: "aspect-video bg-gray-100 rounded-lg flex items-center justify-center", children: _jsxs("div", { className: "text-center text-muted-foreground", children: [_jsx(Camera, { className: "h-12 w-12 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "Conectando al stream..." })] }) })) })) : (_jsx("div", { className: "aspect-video bg-gray-50 rounded-lg flex items-center justify-center", children: _jsxs("div", { className: "text-center text-muted-foreground", children: [_jsx(Eye, { className: "h-12 w-12 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "Selecciona una c\u00E1mara para ver el stream" })] }) })) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Control PTZ" }), _jsx(CardDescription, { children: "Controla el movimiento de c\u00E1maras PTZ" })] }), _jsx(CardContent, { children: (selectedCamera === null || selectedCamera === void 0 ? void 0 : selectedCamera.ptzEnabled) ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-3 gap-2 max-w-48 mx-auto", children: [_jsx("div", {}), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePTZMove('up'), children: "\u2191" }), _jsx("div", {}), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePTZMove('left'), children: "\u2190" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => stopPTZ(selectedCamera.id), children: _jsx(Square, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePTZMove('right'), children: "\u2192" }), _jsx("div", {}), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handlePTZMove('down'), children: "\u2193" }), _jsx("div", {})] }), _jsxs("div", { className: "flex justify-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handlePTZMove('zoomOut'), children: [_jsx(ZoomOut, { className: "h-4 w-4 mr-1" }), "Zoom -"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handlePTZMove('zoomIn'), children: [_jsx(ZoomIn, { className: "h-4 w-4 mr-1" }), "Zoom +"] })] }), (ptzCapabilities === null || ptzCapabilities === void 0 ? void 0 : ptzCapabilities.presets) && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Posiciones Predefinidas" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: ptzCapabilities.presets.map((preset) => (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => gotoPreset(selectedCamera.id, preset.token), children: [_jsx(MapPin, { className: "h-4 w-4 mr-1" }), preset.name] }, preset.token))) })] }))] })) : (_jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [_jsx(Move, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "Esta c\u00E1mara no soporta PTZ" }), _jsx("p", { className: "text-sm", children: "Selecciona una c\u00E1mara con capacidades PTZ" })] })) })] })] }) }), _jsx(TabsContent, { value: "settings", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Configuraci\u00F3n del Sistema" }), _jsx(CardDescription, { children: "Ajustes generales para el sistema de c\u00E1maras" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-3", children: "Monitoreo Autom\u00E1tico" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", defaultChecked: true }), _jsx("span", { children: "Verificar estado de c\u00E1maras autom\u00E1ticamente" })] }), _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", defaultChecked: true }), _jsx("span", { children: "Enviar notificaciones cuando una c\u00E1mara se desconecte" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-3", children: "Calidad de Video" }), _jsxs(Select, { defaultValue: "medium", children: [_jsx(SelectTrigger, { className: "w-48", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "low", children: "Baja (720p)" }), _jsx(SelectItem, { value: "medium", children: "Media (1080p)" }), _jsx(SelectItem, { value: "high", children: "Alta (4K)" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium mb-3", children: "Grabaci\u00F3n" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, {}), _jsx("span", { children: "Habilitar grabaci\u00F3n autom\u00E1tica" })] }), _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, {}), _jsx("span", { children: "Grabar solo cuando se detecte movimiento" })] })] })] })] }) })] }) })] })] }));
}
export default CameraManagement;
