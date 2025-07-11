import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Monitor, AlertTriangle, CheckCircle, RefreshCw, Maximize, Settings } from 'lucide-react';
export default function SurveillancePage() {
    const { user, loading } = useAuthStore();
    const router = useRouter();
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    // Datos de ejemplo para desarrollo
    const mockCameras = [
        {
            id: 'cam1',
            name: 'Entrada Principal',
            location: 'Portería',
            status: 'online',
            lastUpdate: '2025-07-05T01:30:00'
        },
        {
            id: 'cam2',
            name: 'Parqueadero Visitantes',
            location: 'Zona de parqueo',
            status: 'online',
            lastUpdate: '2025-07-05T01:29:45'
        },
        {
            id: 'cam3',
            name: 'Zona Común',
            location: 'Salón comunal',
            status: 'offline',
            lastUpdate: '2025-07-05T00:15:30'
        },
        {
            id: 'cam4',
            name: 'Piscina',
            location: 'Área recreativa',
            status: 'maintenance',
            lastUpdate: '2025-07-04T22:00:00'
        }
    ];
    const fetchData = useCallback(() => {
        // Simular carga de datos
        setTimeout(() => {
            setCameras(mockCameras);
            setIsLoading(false);
        }, 1000);
    }, [mockCameras]);
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?portal=reception');
            return;
        }
        if (user && user.role !== 'reception' && user.role !== 'admin') {
            router.push('/unauthorized');
            return;
        }
        fetchData();
    }, [user, loading, router, fetchData]);
    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return 'bg-green-100 text-green-800';
            case 'offline': return 'bg-red-100 text-red-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'online': return _jsx(CheckCircle, { className: "h-4 w-4" });
            case 'offline': return _jsx(AlertTriangle, { className: "h-4 w-4" });
            case 'maintenance': return _jsx(Settings, { className: "h-4 w-4" });
            default: return _jsx(Camera, { className: "h-4 w-4" });
        }
    };
    if (loading || isLoading) {
        return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-8 w-64" }), _jsx(Skeleton, { className: "h-4 w-96" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [1, 2, 3, 4].map((i) => (_jsx(Skeleton, { className: "h-64" }, i))) })] }));
    }
    const filteredCameras = selectedCamera === 'all'
        ? cameras
        : cameras.filter(camera => camera.status === selectedCamera);
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Sistema de Vigilancia" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Monitoreo en tiempo real de las c\u00E1maras de seguridad" })] }), _jsxs(Button, { onClick: () => window.location.reload(), children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Actualizar"] })] }), _jsx("div", { className: "flex gap-4", children: _jsxs(Select, { value: selectedCamera, onValueChange: setSelectedCamera, children: [_jsx(SelectTrigger, { className: "w-48", children: _jsx(SelectValue, { placeholder: "Filtrar por estado" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Todas las c\u00E1maras" }), _jsx(SelectItem, { value: "online", children: "En l\u00EDnea" }), _jsx(SelectItem, { value: "offline", children: "Fuera de l\u00EDnea" }), _jsx(SelectItem, { value: "maintenance", children: "En mantenimiento" })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total C\u00E1maras" }), _jsx("p", { className: "text-2xl font-bold", children: cameras.length })] }), _jsx(Camera, { className: "h-8 w-8 text-blue-600" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "En L\u00EDnea" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: cameras.filter(c => c.status === 'online').length })] }), _jsx(CheckCircle, { className: "h-8 w-8 text-green-600" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Fuera de L\u00EDnea" }), _jsx("p", { className: "text-2xl font-bold text-red-600", children: cameras.filter(c => c.status === 'offline').length })] }), _jsx(AlertTriangle, { className: "h-8 w-8 text-red-600" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Mantenimiento" }), _jsx("p", { className: "text-2xl font-bold text-yellow-600", children: cameras.filter(c => c.status === 'maintenance').length })] }), _jsx(Settings, { className: "h-8 w-8 text-yellow-600" })] }) }) })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredCameras.map((camera) => (_jsxs(Card, { className: "overflow-hidden", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-lg", children: camera.name }), _jsx(CardDescription, { children: camera.location })] }), _jsxs(Badge, { className: getStatusColor(camera.status), children: [getStatusIcon(camera.status), _jsx("span", { className: "ml-1 capitalize", children: camera.status })] })] }) }), _jsxs(CardContent, { className: "p-0", children: [_jsx("div", { className: "aspect-video bg-gray-900 flex items-center justify-center relative group", children: camera.status === 'online' ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "text-white text-center", children: [_jsx(Monitor, { className: "h-12 w-12 mx-auto mb-2 opacity-50" }), _jsx("p", { className: "text-sm opacity-75", children: "Feed en vivo" })] }), _jsx(Button, { size: "sm", className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx(Maximize, { className: "h-4 w-4" }) })] })) : (_jsxs("div", { className: "text-gray-400 text-center", children: [_jsx(AlertTriangle, { className: "h-12 w-12 mx-auto mb-2" }), _jsx("p", { className: "text-sm", children: "C\u00E1mara no disponible" })] })) }), _jsx("div", { className: "p-4", children: _jsxs("p", { className: "text-xs text-gray-500", children: ["\u00DAltima actualizaci\u00F3n: ", new Date(camera.lastUpdate).toLocaleString('es-ES')] }) })] })] }, camera.id))) }), filteredCameras.length === 0 && (_jsxs(Alert, { children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "No hay c\u00E1maras disponibles" }), _jsx(AlertDescription, { children: "No se encontraron c\u00E1maras que coincidan con el filtro seleccionado." })] }))] }));
}
