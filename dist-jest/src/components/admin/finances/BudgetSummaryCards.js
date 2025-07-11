"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from '@/components/ui/card';
export default function BudgetSummaryCards({ totals, currencySymbol, language }) {
    return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Card, { className: "bg-green-50 dark:bg-green-900", children: _jsxs(CardContent, { className: "p-4", children: [_jsx("p", { className: "text-green-800 dark:text-green-200 text-sm", children: language === 'Español' ? 'Ingresos Totales' : 'Total Income' }), _jsxs("p", { className: "text-2xl font-bold text-green-700 dark:text-green-300", children: [currencySymbol, totals.income.toLocaleString()] })] }) }), _jsx(Card, { className: "bg-red-50 dark:bg-red-900", children: _jsxs(CardContent, { className: "p-4", children: [_jsx("p", { className: "text-red-800 dark:text-red-200 text-sm", children: language === 'Español' ? 'Gastos Totales' : 'Total Expenses' }), _jsxs("p", { className: "text-2xl font-bold text-red-700 dark:text-red-300", children: [currencySymbol, totals.expenses.toLocaleString()] })] }) }), _jsx(Card, { className: `${totals.balance >= 0
                    ? 'bg-blue-50 dark:bg-blue-900'
                    : 'bg-yellow-50 dark:bg-yellow-900'}`, children: _jsxs(CardContent, { className: "p-4", children: [_jsx("p", { className: `${totals.balance >= 0
                                ? 'text-blue-800 dark:text-blue-200'
                                : 'text-yellow-800 dark:text-yellow-200'} text-sm`, children: language === 'Español' ? 'Balance' : 'Balance' }), _jsxs("p", { className: `text-2xl font-bold ${totals.balance >= 0
                                ? 'text-blue-700 dark:text-blue-300'
                                : 'text-yellow-700 dark:text-yellow-300'}`, children: [currencySymbol, totals.balance.toLocaleString()] })] }) })] }));
}
