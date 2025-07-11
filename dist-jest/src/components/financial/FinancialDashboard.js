// src/components/financial/FinancialDashboard.tsx
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
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, TrendingUp, TrendingDown, FileText, CreditCard, AlertTriangle } from 'lucide-react';
import { useFinancialBilling } from '@/hooks/useFinancialBilling';
import { useFreemiumPlan } from '@/hooks/useFreemiumPlan';
export function FinancialDashboard({ complexId }) {
    const { bills, stats, loading, error, generateBills, loadBills, loadStats, refreshData } = useFinancialBilling();
    const { hasFeatureAccess, isUpgradeRequired, getUpgradeMessage, currentPlan, isTrialActive } = useFreemiumPlan();
    const [selectedPeriod, setSelectedPeriod] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    useEffect(() => {
        if (hasFeatureAccess('dashboard_financiero')) {
            refreshData();
        }
    }, [hasFeatureAccess, refreshData]);
    const handleGenerateBills = () => __awaiter(this, void 0, void 0, function* () {
        if (isUpgradeRequired('facturación_automática')) {
            alert(getUpgradeMessage('facturación_automática'));
            return;
        }
        const [year, month] = selectedPeriod.split('-').map(Number);
        try {
            yield generateBills(year, month);
            alert('Facturas generadas exitosamente');
        }
        catch (error) {
            console.error('Error:', error);
            alert('Error generando facturas');
        }
    });
    // Verificar acceso a dashboard financiero
    if (isUpgradeRequired('dashboard_financiero')) {
        return (_jsxs(Card, { className: "w-full", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(DollarSign, { className: "h-5 w-5" }), "Dashboard Financiero"] }) }), _jsx(CardContent, { children: _jsxs(Alert, { children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsxs(AlertDescription, { children: [getUpgradeMessage('dashboard_financiero'), _jsxs("div", { className: "mt-2", children: [_jsxs(Badge, { variant: "outline", children: ["Plan Actual: ", currentPlan] }), isTrialActive && _jsx(Badge, { variant: "secondary", className: "ml-2", children: "Trial Activo" })] })] })] }) })] }));
    }
    if (loading) {
        return (_jsx("div", { className: "w-full space-y-4", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [...Array(4)].map((_, i) => (_jsx(Card, { className: "animate-pulse", children: _jsxs(CardContent, { className: "p-6", children: [_jsx("div", { className: "h-4 bg-gray-300 rounded w-3/4 mb-2" }), _jsx("div", { className: "h-8 bg-gray-300 rounded w-1/2" })] }) }, i))) }) }));
    }
    if (error) {
        return (_jsx(Card, { className: "w-full", children: _jsx(CardContent, { className: "p-6", children: _jsx(Alert, { variant: "destructive", children: _jsx(AlertDescription, { children: error }) }) }) }));
    }
    return (_jsxs("div", { className: "w-full space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Dashboard Financiero" }), _jsx("p", { className: "text-muted-foreground", children: "Gesti\u00F3n integral de facturaci\u00F3n y pagos" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "month", value: selectedPeriod, onChange: (e) => setSelectedPeriod(e.target.value), className: "px-3 py-2 border rounded-md" }), _jsxs(Button, { onClick: handleGenerateBills, disabled: loading, children: [_jsx(FileText, { className: "h-4 w-4 mr-2" }), "Generar Facturas"] }), _jsx(Button, { variant: "outline", onClick: refreshData, disabled: loading, children: "Actualizar" })] })] }), stats && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Facturado" }), _jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: ["$", stats.totalBilled.toLocaleString()] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [stats.billsCount, " facturas generadas"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Recaudado" }), _jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: ["$", stats.totalCollected.toLocaleString()] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [stats.collectionRate.toFixed(1), "% tasa de recaudo"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Pendiente" }), _jsx(TrendingDown, { className: "h-4 w-4 text-orange-600" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-orange-600", children: ["$", stats.pendingAmount.toLocaleString()] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [stats.overdueCount, " facturas vencidas"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Eficiencia" }), _jsx(TrendingUp, { className: "h-4 w-4 text-blue-600" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: [stats.collectionRate.toFixed(1), "%"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Tasa de recaudo general" })] })] })] })), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(FileText, { className: "h-5 w-5" }), "Facturas Recientes"] }), _jsx(CardDescription, { children: "\u00DAltimas facturas generadas y su estado de pago" })] }), _jsx(CardContent, { children: bills.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [_jsx(FileText, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "No hay facturas para mostrar" }), _jsx("p", { className: "text-sm", children: "Genera facturas para el per\u00EDodo seleccionado" })] })) : (_jsx("div", { className: "space-y-4", children: bills.slice(0, 10).map((bill) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(FileText, { className: "h-5 w-5 text-muted-foreground" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: bill.billNumber || `#${bill.id}` }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [bill.property.unitNumber, " \u2022 ", bill.billingPeriod] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-medium", children: ["$", bill.totalAmount.toLocaleString()] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs(Badge, { variant: bill.status === 'PAID'
                                                        ? 'default'
                                                        : bill.status === 'OVERDUE'
                                                            ? 'destructive'
                                                            : 'secondary', children: [bill.status === 'PAID' && 'Pagado', bill.status === 'PENDING' && 'Pendiente', bill.status === 'PARTIAL' && 'Parcial', bill.status === 'OVERDUE' && 'Vencido'] }) })] })] }, bill.id))) })) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(CreditCard, { className: "h-5 w-5" }), "Estado del Plan"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: ["Plan Actual: ", currentPlan] }), isTrialActive && (_jsx("p", { className: "text-sm text-orange-600", children: "Trial activo - Funcionalidades premium disponibles" }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Badge, { variant: "outline", children: currentPlan }), isTrialActive && _jsx(Badge, { variant: "secondary", children: "Trial" })] })] }) })] })] }));
}
export default FinancialDashboard;
