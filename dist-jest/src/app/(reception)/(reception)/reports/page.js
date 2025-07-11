import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Download, Users, Package, AlertTriangle, BarChart3, TrendingUp } from 'lucide-react';
export default function ReportsPage() {
    const { user, loading } = useAuthStore();
    const router = useRouter();
    const [reportData, setReportData] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
    const [selectedReport, setSelectedReport] = useState('summary');
    const [isLoading, setIsLoading] = useState(true);
    // Datos de ejemplo para desarrollo
    const mockReportData = useMemo(() => ({
        visitors: {
            total: 1247,
            today: 23,
            thisWeek: 156,
            thisMonth: 487
        },
        packages: {
            received: 89,
            delivered: 76,
            pending: 13
        },
        incidents: {
            total: 34,
            resolved: 28,
            pending: 6,
            critical: 2
        }
    }), []);
    const fetchData = useCallback(() => {
        // Simular carga de datos
        setTimeout(() => {
            setReportData(mockReportData);
            setIsLoading(false);
        }, 1000);
    }, [mockReportData]);
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
    const generateReport = () => {
        // Simular generación de reporte
        alert(`Generando reporte: ${selectedReport} para el período: ${selectedPeriod}`);
    };
    if (loading || isLoading) {
        return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-8 w-64" }), _jsx(Skeleton, { className: "h-4 w-96" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [1, 2, 3].map((i) => (_jsx(Skeleton, { className: "h-32" }, i))) })] }));
    }
    if (!reportData) {
        return (_jsx("div", { className: "p-6", children: _jsxs(Alert, { children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Error al cargar datos" }), _jsx(AlertDescription, { children: "No se pudieron cargar los datos de los reportes. Intente nuevamente." })] }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "flex justify-between items-start", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Reportes y Estad\u00EDsticas" }), _jsx("p", { className: "text-gray-600 mt-2", children: "An\u00E1lisis y reportes de actividades de recepci\u00F3n" })] }) }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(FileText, { className: "h-5 w-5" }), "Generar Reporte"] }), _jsx(CardDescription, { children: "Seleccione el tipo de reporte y per\u00EDodo para generar" })] }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "reportType", children: "Tipo de Reporte" }), _jsxs(Select, { value: selectedReport, onValueChange: setSelectedReport, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar reporte" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "summary", children: "Resumen General" }), _jsx(SelectItem, { value: "visitors", children: "Reporte de Visitantes" }), _jsx(SelectItem, { value: "packages", children: "Reporte de Paqueter\u00EDa" }), _jsx(SelectItem, { value: "incidents", children: "Reporte de Incidentes" }), _jsx(SelectItem, { value: "security", children: "Reporte de Seguridad" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "period", children: "Per\u00EDodo" }), _jsxs(Select, { value: selectedPeriod, onValueChange: setSelectedPeriod, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar per\u00EDodo" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "today", children: "Hoy" }), _jsx(SelectItem, { value: "thisWeek", children: "Esta Semana" }), _jsx(SelectItem, { value: "thisMonth", children: "Este Mes" }), _jsx(SelectItem, { value: "lastMonth", children: "Mes Anterior" }), _jsx(SelectItem, { value: "custom", children: "Personalizado" })] })] })] }), _jsx("div", { className: "flex items-end", children: _jsxs(Button, { onClick: generateReport, className: "w-full", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Generar Reporte"] }) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Visitantes Hoy" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: reportData.visitors.today }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Total: ", reportData.visitors.total] })] }), _jsx(Users, { className: "h-8 w-8 text-blue-600" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Paquetes Pendientes" }), _jsx("p", { className: "text-2xl font-bold text-orange-600", children: reportData.packages.pending }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Entregados: ", reportData.packages.delivered] })] }), _jsx(Package, { className: "h-8 w-8 text-orange-600" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Incidentes Activos" }), _jsx("p", { className: "text-2xl font-bold text-red-600", children: reportData.incidents.pending }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Cr\u00EDticos: ", reportData.incidents.critical] })] }), _jsx(AlertTriangle, { className: "h-8 w-8 text-red-600" })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Visitantes Semana" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: reportData.visitors.thisWeek }), _jsxs("p", { className: "text-xs text-green-600 flex items-center", children: [_jsx(TrendingUp, { className: "h-3 w-3 mr-1" }), "+12% vs anterior"] })] }), _jsx(BarChart3, { className: "h-8 w-8 text-green-600" })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Actividad de Visitantes" }), _jsx(CardDescription, { children: "Resumen de visitantes por per\u00EDodo" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Hoy" }), _jsx("span", { className: "font-semibold", children: reportData.visitors.today })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Esta Semana" }), _jsx("span", { className: "font-semibold", children: reportData.visitors.thisWeek })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Este Mes" }), _jsx("span", { className: "font-semibold", children: reportData.visitors.thisMonth })] }), _jsxs("div", { className: "flex justify-between items-center border-t pt-3", children: [_jsx("span", { className: "text-sm font-medium", children: "Total Hist\u00F3rico" }), _jsx("span", { className: "font-bold text-lg", children: reportData.visitors.total })] })] }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Estado de Paqueter\u00EDa" }), _jsx(CardDescription, { children: "Gesti\u00F3n de paquetes y correspondencia" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Recibidos" }), _jsx("span", { className: "font-semibold text-blue-600", children: reportData.packages.received })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Entregados" }), _jsx("span", { className: "font-semibold text-green-600", children: reportData.packages.delivered })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Pendientes" }), _jsx("span", { className: "font-semibold text-orange-600", children: reportData.packages.pending })] }), _jsxs("div", { className: "flex justify-between items-center border-t pt-3", children: [_jsx("span", { className: "text-sm font-medium", children: "Eficiencia" }), _jsxs("span", { className: "font-bold text-lg text-green-600", children: [Math.round((reportData.packages.delivered / reportData.packages.received) * 100), "%"] })] })] }) })] })] })] }));
}
