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
import { useAuthStore } from '@/store/authStore';
import { Loader2, CreditCard, History, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getResidentFinancialSummary, getResidentPayments, getResidentPendingFees } from '@/services/residentFinancialService';
export default function ResidentFinancialPage() {
    const { user, loading: authLoading } = useAuthStore();
    const [summary, setSummary] = useState(null);
    const [payments, setPayments] = useState([]);
    const [pendingFees, setPendingFees] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!authLoading && user) {
            fetchFinancialData();
        }
    }, [authLoading, user]);
    const fetchFinancialData = () => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const fetchedSummary = yield getResidentFinancialSummary();
            const fetchedPayments = yield getResidentPayments();
            const fetchedPendingFees = yield getResidentPendingFees();
            setSummary(fetchedSummary);
            setPayments(fetchedPayments);
            setPendingFees(fetchedPendingFees);
        }
        catch (error) {
            console.error('Error fetching resident financial data:', error);
            // Handle error, e.g., show a toast
        }
        finally {
            setLoading(false);
        }
    });
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };
    if (authLoading || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user) {
        return null; // Redirect handled by AuthLayout
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Mi Gesti\u00F3n Financiera" }), summary && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Saldo Actual" }), _jsx(CreditCard, { className: "h-4 w-4 text-muted-foreground" })] }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold", children: formatCurrency(summary.currentAccountBalance) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Pagado este A\u00F1o" }), _jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })] }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold", children: formatCurrency(summary.totalPaidThisYear) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Cuotas Pendientes" }), _jsx(History, { className: "h-4 w-4 text-muted-foreground" })] }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold", children: formatCurrency(summary.totalPendingFees) }) })] })] })), _jsxs(Card, { className: "mb-8", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(DollarSign, { className: "h-5 w-5 mr-2" }), " Cuotas Pendientes"] }) }), _jsx(CardContent, { children: pendingFees.length > 0 ? (_jsx("div", { className: "space-y-3", children: pendingFees.map((fee) => (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg bg-red-50", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium", children: [fee.billNumber, " - ", fee.billingPeriod] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Vence: ", new Date(fee.dueDate).toLocaleDateString()] })] }), _jsx(Badge, { variant: "destructive", children: formatCurrency(fee.totalAmount) })] }, fee.id))) })) : (_jsx("p", { className: "text-gray-500 text-center", children: "No tienes cuotas pendientes." })) })] }), _jsxs(Card, { className: "mb-8", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(History, { className: "h-5 w-5 mr-2" }), " Historial de Pagos"] }) }), _jsx(CardContent, { children: payments.length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Concepto" }), _jsx(TableHead, { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Monto" }), _jsx(TableHead, { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Fecha" }), _jsx(TableHead, { className: "px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Estado" })] }) }), _jsx(TableBody, { children: payments.map((payment) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: payment.billNumber }), _jsx(TableCell, { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: formatCurrency(payment.amount) }), _jsx(TableCell, { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: new Date(payment.paidAt).toLocaleDateString() }), _jsx(TableCell, { className: "px-5 py-5 border-b border-gray-200 bg-white text-sm", children: _jsx(Badge, { variant: payment.status === 'PAID' ? 'default' : 'secondary', children: payment.status }) })] }, payment.id))) })] }) })) : (_jsx("p", { className: "text-gray-500 text-center", children: "No hay historial de pagos." })) })] })] }));
}
