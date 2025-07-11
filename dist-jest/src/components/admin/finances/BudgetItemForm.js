"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export default function BudgetItemForm({ onAdd, error, language }) {
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('INCOME');
    const handleAdd = () => {
        if (!category || !description || !amount)
            return;
        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)
            return;
        onAdd(category, description, parseFloat(amount), type);
        // Limpiar campos
        setCategory('');
        setDescription('');
        setAmount('');
    };
    return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: language === 'Español' ? 'Categoría' : 'Category' }), _jsx(Input, { value: category, onChange: (e) => setCategory(e.target.value), placeholder: language === 'Español' ? 'Ej: Mantenimiento' : 'Ex: Maintenance', className: "w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: language === 'Español' ? 'Descripción' : 'Description' }), _jsx(Input, { value: description, onChange: (e) => setDescription(e.target.value), placeholder: language === 'Español' ? 'Ej: Pintura fachada' : 'Ex: Facade painting', className: "w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: language === 'Español' ? 'Monto' : 'Amount' }), _jsx(Input, { type: "number", min: "0", step: "0.01", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: "w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: language === 'Español' ? 'Tipo' : 'Type' }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Select, { value: type, onValueChange: (value) => setType(value), children: [_jsx(SelectTrigger, { className: "w-full", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "INCOME", children: language === 'Español' ? 'Ingreso' : 'Income' }), _jsx(SelectItem, { value: "EXPENSE", children: language === 'Español' ? 'Gasto' : 'Expense' })] })] }), _jsx(Button, { onClick: handleAdd, className: "bg-indigo-600 hover:bg-indigo-700 flex-shrink-0", children: _jsx(Plus, { className: "w-4 h-4" }) })] })] }), error && (_jsx("div", { className: "col-span-4 text-red-500 text-sm", children: error }))] }));
}
