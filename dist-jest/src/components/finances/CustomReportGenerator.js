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
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, FileSpreadsheet, Calendar } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
export default function CustomReportGenerator({ token, language, onReportGenerated }) {
    // useState activeTab eliminado por lint
    const [loading, setLoading] = useState(false);
    const [error, _setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // Estados para reportes financieros
    const [reportType, setReportType] = useState('income-expense');
    const [startDate, setStartDate] = useState(undefined);
    const [endDate, setEndDate] = useState(undefined);
    const [format, setFormat] = useState('pdf');
    // Estados para reportes de pagos
    const [paymentStatus, setPaymentStatus] = useState('all');
    const [propertyFilter, setPropertyFilter] = useState('');
    // Estados para opciones de reporte
    const [includeCharts, setIncludeCharts] = useState(true);
    const [includeSummary, setIncludeSummary] = useState(true);
    const [includeDetails, setIncludeDetails] = useState(true);
    const handleGenerateReport = () => __awaiter(this, void 0, void 0, function* () {
        if (!startDate || !endDate) {
            setError(language === 'Español' ? 'Por favor seleccione fechas de inicio y fin' : 'Please select start and end dates');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const endpoint = activeTab === 'financial'
                ? '/api/finances/reports/financial'
                : '/api/finances/reports/payments';
            // Variable response eliminada por lint
            const _data = yield response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al generar reporte');
            }
            setSuccess(language === 'Español' ? 'Reporte generado exitosamente' : 'Report generated successfully');
            onReportGenerated(data.reportUrl, activeTab === 'financial' ? reportType : 'payments');
        }
        catch (err) {
            console.error('[CustomReportGenerator] Error:', err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    });
    const getReportTypeLabel = (type) => {
        if (language === 'Español') {
            switch (type) {
                case 'income-expense': return 'Ingresos y Gastos';
                case 'balance': return 'Balance General';
                case 'budget-comparison': return 'Comparativo Presupuestal';
                case 'cash-flow': return 'Flujo de Caja';
                case 'debtors': return 'Cartera de Deudores';
                default: return type;
            }
        }
        else {
            switch (type) {
                case 'income-expense': return 'Income and Expenses';
                case 'balance': return 'Balance Sheet';
                case 'budget-comparison': return 'Budget Comparison';
                case 'cash-flow': return 'Cash Flow';
                case 'debtors': return 'Debtors Portfolio';
                default: return type;
            }
        }
    };
    return (_jsxs(Card, { className: "w-full", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(BarChart, { className: "h-5 w-5" }), language === 'Español' ? 'Generador de Reportes Personalizados' : 'Custom Report Generator'] }) }), _jsxs(CardContent, { children: [_jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid grid-cols-2 mb-4", children: [_jsx(TabsTrigger, { value: "financial", children: language === 'Español' ? 'Reportes Financieros' : 'Financial Reports' }), _jsx(TabsTrigger, { value: "payments", children: language === 'Español' ? 'Reportes de Pagos' : 'Payment Reports' })] }), _jsx(TabsContent, { value: "financial", className: "space-y-4", children: _jsx("div", { className: "grid grid-cols-1 gap-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "reportType", children: language === 'Español' ? 'Tipo de Reporte' : 'Report Type' }), _jsxs(Select, { value: reportType, onValueChange: setReportType, children: [_jsx(SelectTrigger, { id: "reportType", children: _jsx(SelectValue, { placeholder: language === 'Español' ? 'Seleccionar tipo' : 'Select type' }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "income-expense", children: getReportTypeLabel('income-expense') }), _jsx(SelectItem, { value: "balance", children: getReportTypeLabel('balance') }), _jsx(SelectItem, { value: "budget-comparison", children: getReportTypeLabel('budget-comparison') }), _jsx(SelectItem, { value: "cash-flow", children: getReportTypeLabel('cash-flow') }), _jsx(SelectItem, { value: "debtors", children: getReportTypeLabel('debtors') })] })] })] }) }) }), _jsx(TabsContent, { value: "payments", className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "paymentStatus", children: language === 'Español' ? 'Estado de Pagos' : 'Payment Status' }), _jsxs(Select, { value: paymentStatus, onValueChange: setPaymentStatus, children: [_jsx(SelectTrigger, { id: "paymentStatus", children: _jsx(SelectValue, { placeholder: language === 'Español' ? 'Seleccionar estado' : 'Select status' }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: language === 'Español' ? 'Todos' : 'All' }), _jsx(SelectItem, { value: "completed", children: language === 'Español' ? 'Completados' : 'Completed' }), _jsx(SelectItem, { value: "pending", children: language === 'Español' ? 'Pendientes' : 'Pending' }), _jsx(SelectItem, { value: "overdue", children: language === 'Español' ? 'Vencidos' : 'Overdue' })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "propertyFilter", children: language === 'Español' ? 'Filtrar por Unidad (opcional)' : 'Filter by Unit (optional)' }), _jsxs(Select, { value: propertyFilter, onValueChange: setPropertyFilter, children: [_jsx(SelectTrigger, { id: "propertyFilter", children: _jsx(SelectValue, { placeholder: language === 'Español' ? 'Todas las unidades' : 'All units' }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: language === 'Español' ? 'Todas las unidades' : 'All units' }), _jsx(SelectItem, { value: "A", children: language === 'Español' ? 'Torre A' : 'Tower A' }), _jsx(SelectItem, { value: "B", children: language === 'Español' ? 'Torre B' : 'Tower B' }), _jsx(SelectItem, { value: "C", children: language === 'Español' ? 'Torre C' : 'Tower C' })] })] })] })] }) }), _jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs(Label, { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-4 w-4" }), language === 'Español' ? 'Fecha de Inicio' : 'Start Date'] }), _jsx(DatePicker, { date: startDate, setDate: setStartDate, locale: language === 'Español' ? 'es' : 'en', placeholder: language === 'Español' ? 'Seleccionar fecha' : 'Select date' })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs(Label, { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-4 w-4" }), language === 'Español' ? 'Fecha de Fin' : 'End Date'] }), _jsx(DatePicker, { date: endDate, setDate: setEndDate, locale: language === 'Español' ? 'es' : 'en', placeholder: language === 'Español' ? 'Seleccionar fecha' : 'Select date' })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "format", children: language === 'Español' ? 'Formato de Salida' : 'Output Format' }), _jsxs(Select, { value: format, onValueChange: setFormat, children: [_jsx(SelectTrigger, { id: "format", children: _jsx(SelectValue, { placeholder: language === 'Español' ? 'Seleccionar formato' : 'Select format' }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "pdf", children: "PDF" }), _jsx(SelectItem, { value: "excel", children: "Excel" }), _jsx(SelectItem, { value: "csv", children: "CSV" })] })] })] }), _jsxs("div", { className: "space-y-3 pt-2", children: [_jsx(Label, { children: language === 'Español' ? 'Opciones de Reporte' : 'Report Options' }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "includeCharts", checked: includeCharts, onCheckedChange: (checked) => setIncludeCharts(checked === true) }), _jsx(Label, { htmlFor: "includeCharts", className: "text-sm font-normal", children: language === 'Español' ? 'Incluir gráficos' : 'Include charts' })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "includeSummary", checked: includeSummary, onCheckedChange: (checked) => setIncludeSummary(checked === true) }), _jsx(Label, { htmlFor: "includeSummary", className: "text-sm font-normal", children: language === 'Español' ? 'Incluir resumen ejecutivo' : 'Include executive summary' })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "includeDetails", checked: includeDetails, onCheckedChange: (checked) => setIncludeDetails(checked === true) }), _jsx(Label, { htmlFor: "includeDetails", className: "text-sm font-normal", children: language === 'Español' ? 'Incluir detalles completos' : 'Include full details' })] })] }), _jsx(Button, { onClick: handleGenerateReport, disabled: loading, className: "w-full mt-4", children: loading ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" }), language === 'Español' ? 'Generando...' : 'Generating...'] })) : (_jsxs("div", { className: "flex items-center", children: [_jsx(FileSpreadsheet, { className: "h-4 w-4 mr-2" }), language === 'Español' ? 'Generar Reporte' : 'Generate Report'] })) })] })] }), error && (_jsx("div", { className: "mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md", children: error })), success && (_jsx("div", { className: "mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md", children: success }))] })] }));
}
