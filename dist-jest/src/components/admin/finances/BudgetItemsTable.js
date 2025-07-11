"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
export default function BudgetItemsTable({ items, onRemove, currencySymbol, language, readOnly = false }) {
    if (items.length === 0) {
        return (_jsx("div", { className: "text-center py-8 text-gray-500", children: language === 'Español' ? 'No hay ítems en este presupuesto' : 'No items in this budget' }));
    }
    return (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: language === 'Español' ? 'Categoría' : 'Category' }), _jsx(TableHead, { children: language === 'Español' ? 'Descripción' : 'Description' }), _jsx(TableHead, { children: language === 'Español' ? 'Tipo' : 'Type' }), _jsx(TableHead, { className: "text-right", children: language === 'Español' ? 'Monto' : 'Amount' }), !readOnly && (_jsx(TableHead, { className: "text-right", children: language === 'Español' ? 'Acciones' : 'Actions' }))] }) }), _jsx(TableBody, { children: items.map((item, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: item.category }), _jsx(TableCell, { children: item.description }), _jsx(TableCell, { children: _jsx(Badge, { className: item.type === 'INCOME'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', children: item.type === 'INCOME'
                                    ? (language === 'Español' ? 'Ingreso' : 'Income')
                                    : (language === 'Español' ? 'Gasto' : 'Expense') }) }), _jsx(TableCell, { className: "text-right", children: _jsxs("span", { className: item.type === 'INCOME'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400', children: [currencySymbol, item.amount.toLocaleString()] }) }), !readOnly && (_jsx(TableCell, { className: "text-right", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => onRemove(index), className: "text-red-600 hover:text-red-800 hover:bg-red-50", children: _jsx(Trash2, { className: "h-4 w-4" }) }) }))] }, item.id || index))) })] }));
}
