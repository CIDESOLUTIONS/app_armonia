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
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
export default function SecurityReportsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [reportType, setReportType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const handleGenerateReport = () => __awaiter(this, void 0, void 0, function* () {
        if (!reportType || !startDate || !endDate) {
            toast({
                title: 'Error',
                description: 'Por favor, seleccione un tipo de reporte y un rango de fechas.',
                variant: 'destructive',
            });
            return;
        }
        setLoading(true);
        try {
            // Placeholder for actual API call to generate report
            console.log(`Generating ${reportType} report from ${startDate} to ${endDate}`);
            yield new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            toast({
                title: 'Éxito',
                description: 'Reporte generado correctamente (simulado). Descargando...',
            });
            // Simulate file download
            const blob = new Blob([`Reporte de ${reportType} del ${startDate} al ${endDate}`], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_${reportType}_${startDate}_${endDate}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error('Error generating report:', error);
            toast({
                title: 'Error',
                description: 'Error al generar el reporte.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    if (authLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN' && user.role !== 'STAFF')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Reportes de Seguridad" }), _jsxs("div", { className: "bg-white shadow-md rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Generar Nuevo Reporte" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "reportType", children: "Tipo de Reporte" }), _jsxs(Select, { value: reportType, onValueChange: setReportType, children: [_jsx(SelectTrigger, { id: "reportType", children: _jsx(SelectValue, { placeholder: "Seleccionar tipo de reporte" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "access_logs", children: "Registros de Acceso" }), _jsx(SelectItem, { value: "incident_summary", children: "Resumen de Incidentes" }), _jsx(SelectItem, { value: "camera_status", children: "Estado de C\u00E1maras" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "startDate", children: "Fecha de Inicio" }), _jsx(Input, { id: "startDate", type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "endDate", children: "Fecha de Fin" }), _jsx(Input, { id: "endDate", type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value) })] }), _jsx("div", { className: "md:col-span-2 flex justify-end", children: _jsxs(Button, { onClick: handleGenerateReport, disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : _jsx(Download, { className: "mr-2 h-4 w-4" }), " Generar Reporte"] }) })] })] }), _jsxs("div", { className: "mt-8 bg-white shadow-md rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Historial de Reportes Generados (Pr\u00F3ximamente)" }), _jsx("p", { className: "text-gray-600", children: "Aqu\u00ED se mostrar\u00E1 un historial de los reportes de seguridad generados previamente." })] })] }));
}
