// src/components/ui/pagination/pagination.tsx
"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
export function Pagination({ currentPage, totalPages, onPageChange, maxButtons = 5 }) {
    // No mostrar paginación si solo hay una página
    if (totalPages <= 1) {
        return null;
    }
    // Calcular el rango de páginas a mostrar
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);
    // Ajustar si estamos muy cerca del final
    if (endPage - startPage + 1 < maxButtons && startPage > 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    // Crear array de páginas a mostrar
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    return (_jsxs("div", { className: "flex justify-center items-center gap-1", children: [startPage > 1 && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", size: "icon", onClick: () => onPageChange(1), disabled: currentPage === 1, className: "h-8 w-8", title: "Primera p\u00E1gina", children: _jsx(ChevronsLeft, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "outline", size: "icon", onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, className: "h-8 w-8", title: "P\u00E1gina anterior", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) })] })), pages.map(page => (_jsx(Button, { variant: page === currentPage ? "default" : "outline", size: "sm", onClick: () => onPageChange(page), className: `h-8 w-8 ${page === currentPage ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white" : ""}`, children: page }, page))), endPage < totalPages && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", size: "icon", onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, className: "h-8 w-8", title: "P\u00E1gina siguiente", children: _jsx(ChevronRight, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "outline", size: "icon", onClick: () => onPageChange(totalPages), disabled: currentPage === totalPages, className: "h-8 w-8", title: "\u00DAltima p\u00E1gina", children: _jsx(ChevronsRight, { className: "h-4 w-4" }) })] }))] }));
}
