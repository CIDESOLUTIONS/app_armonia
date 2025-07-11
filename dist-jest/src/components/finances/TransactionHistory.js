var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { ReceiptText as ReceiptIcon, Eye as ViewIcon, Download as DownloadIcon, CheckCircle as SuccessIcon, XCircle as ErrorIcon, Hourglass as PendingIcon, Ban as CancelIcon, Loader2 } from 'lucide-react';
// Servicios y utilidades
import { getTransactions, downloadReceipt } from '@/lib/api/payments';
import { formatCurrency, formatDate } from '@/lib/utils/format';
// Componente para mostrar el estado de la transacción
const TransactionStatusBadge = ({ status }) => {
    const statusConfig = {
        PENDING: { label: 'Pendiente', variant: 'secondary', icon: _jsx(PendingIcon, { className: "h-3 w-3 mr-1" }) },
        PROCESSING: { label: 'Procesando', variant: 'secondary', icon: _jsx(PendingIcon, { className: "h-3 w-3 mr-1" }) },
        COMPLETED: { label: 'Completado', variant: 'default', icon: _jsx(SuccessIcon, { className: "h-3 w-3 mr-1" }) },
        FAILED: { label: 'Fallido', variant: 'destructive', icon: _jsx(ErrorIcon, { className: "h-3 w-3 mr-1" }) },
        REFUNDED: { label: 'Reembolsado', variant: 'outline', icon: _jsx(ReceiptIcon, { className: "h-3 w-3 mr-1" }) },
        CANCELLED: { label: 'Cancelado', variant: 'outline', icon: _jsx(CancelIcon, { className: "h-3 w-3 mr-1" }) }
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (_jsxs(Badge, { variant: config.variant, className: "flex items-center w-fit", children: [config.icon, config.label] }));
};
// Componente principal de historial de transacciones
const TransactionHistory = () => {
    const router = useRouter();
    const { data: session } = useSession();
    // Estados
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: ''
    });
    // Cargar transacciones
    const loadTransactions = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            const result = yield getTransactions(Object.assign({ page: page, limit: rowsPerPage }, filters));
            setTransactions(result.data);
            setTotalCount(result.pagination.total);
        }
        catch (error) {
            console.error('Error al cargar transacciones:', error);
            toast({
                title: 'Error',
                description: 'Error al cargar el historial de transacciones',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    }), [page, rowsPerPage, filters]);
    // Cargar al montar y cuando cambien los filtros o paginación
    useEffect(() => {
        if (session) {
            loadTransactions();
        }
    }, [session, loadTransactions]);
    // Manejar cambio de página
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    // Manejar cambio de filas por página
    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(parseInt(value, 10));
        setPage(1); // Reset page to 1 when rows per page changes
    };
    // Manejar clic en ver detalles
    const handleViewDetails = (transactionId) => {
        router.push(`/payments/details/${transactionId}`);
    };
    // Manejar descarga de recibo
    const handleDownloadReceipt = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield downloadReceipt(transactionId);
            toast({
                title: 'Éxito',
                description: 'Recibo descargado correctamente',
            });
        }
        catch (error) {
            console.error('Error al descargar recibo:', error);
            toast({
                title: 'Error',
                description: 'Error al descargar el recibo',
                variant: 'destructive',
            });
        }
    });
    // Renderizar tabla de transacciones
    const renderTransactionsTable = () => {
        if (loading && transactions.length === 0) {
            return (_jsx("div", { className: "flex justify-center py-4", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
        }
        if (transactions.length === 0) {
            return (_jsx("div", { className: "text-center py-4 text-gray-500", children: _jsx("p", { children: "No se encontraron transacciones" }) }));
        }
        return (_jsxs(_Fragment, { children: [_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "ID" }), _jsx(TableHead, { children: "Fecha" }), _jsx(TableHead, { children: "Descripci\u00F3n" }), _jsx(TableHead, { children: "Monto" }), _jsx(TableHead, { children: "M\u00E9todo" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { className: "text-right", children: "Acciones" })] }) }), _jsx(TableBody, { children: transactions.map((transaction) => {
                                var _a;
                                return (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: transaction.id }), _jsx(TableCell, { children: formatDate(transaction.createdAt) }), _jsx(TableCell, { children: transaction.description }), _jsx(TableCell, { children: formatCurrency(transaction.amount) }), _jsx(TableCell, { children: ((_a = transaction.method) === null || _a === void 0 ? void 0 : _a.name) || '-' }), _jsx(TableCell, { children: _jsx(TransactionStatusBadge, { status: transaction.status }) }), _jsxs(TableCell, { className: "text-right", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleViewDetails(transaction.id), title: "Ver detalles", children: _jsx(ViewIcon, { className: "h-4 w-4" }) }), transaction.status === 'COMPLETED' && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDownloadReceipt(transaction.id), title: "Descargar recibo", children: _jsx(DownloadIcon, { className: "h-4 w-4" }) }))] })] }, transaction.id));
                            }) })] }), _jsxs("div", { className: "flex justify-end items-center space-x-2 p-4", children: [_jsxs(Select, { value: String(rowsPerPage), onValueChange: handleRowsPerPageChange, children: [_jsx(SelectTrigger, { className: "w-[180px]", children: _jsx(SelectValue, { placeholder: "Filas por p\u00E1gina" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "5", children: "5 por p\u00E1gina" }), _jsx(SelectItem, { value: "10", children: "10 por p\u00E1gina" }), _jsx(SelectItem, { value: "25", children: "25 por p\u00E1gina" }), _jsx(SelectItem, { value: "50", children: "50 por p\u00E1gina" })] })] }), _jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(PaginationPrevious, { href: "#", onClick: () => handlePageChange(page - 1), className: page === 1 ? "pointer-events-none opacity-50" : undefined }) }), Array.from({ length: Math.ceil(totalCount / rowsPerPage) }, (_, i) => i + 1).map(p => (_jsx(PaginationItem, { children: _jsx(PaginationLink, { href: "#", isActive: p === page, onClick: () => handlePageChange(p), children: p }) }, p))), _jsx(PaginationItem, { children: _jsx(PaginationNext, { href: "#", onClick: () => handlePageChange(page + 1), className: page === Math.ceil(totalCount / rowsPerPage) ? "pointer-events-none opacity-50" : undefined }) })] }) })] })] }));
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(ReceiptIcon, { className: "mr-2 h-5 w-5" }), "Historial de Transacciones"] }), _jsx(CardDescription, { children: "Consulte sus pagos realizados" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "mb-3" }), renderTransactionsTable()] })] }));
};
export default TransactionHistory;
