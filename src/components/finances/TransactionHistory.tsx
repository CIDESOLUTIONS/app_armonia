import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';

import {
  ReceiptText as ReceiptIcon,
  Eye as ViewIcon,
  Download as DownloadIcon,
  CheckCircle as SuccessIcon,
  XCircle as ErrorIcon,
  Hourglass as PendingIcon,
  Ban as CancelIcon,
  Loader2
} from 'lucide-react';

// Servicios y utilidades
import { getTransactions, downloadReceipt } from '@/lib/api/payments';
import { formatCurrency, formatDate } from '@/lib/utils/format';

// Componente para mostrar el estado de la transacción
const TransactionStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: { label: 'Pendiente', variant: 'secondary', icon: <PendingIcon className="h-3 w-3 mr-1" /> },
    PROCESSING: { label: 'Procesando', variant: 'secondary', icon: <PendingIcon className="h-3 w-3 mr-1" /> },
    COMPLETED: { label: 'Completado', variant: 'default', icon: <SuccessIcon className="h-3 w-3 mr-1" /> },
    FAILED: { label: 'Fallido', variant: 'destructive', icon: <ErrorIcon className="h-3 w-3 mr-1" /> },
    REFUNDED: { label: 'Reembolsado', variant: 'outline', icon: <ReceiptIcon className="h-3 w-3 mr-1" /> },
    CANCELLED: { label: 'Cancelado', variant: 'outline', icon: <CancelIcon className="h-3 w-3 mr-1" /> }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  
  return (
    <Badge variant={config.variant as any} className="flex items-center w-fit">
      {config.icon}
      {config.label}
    </Badge>
  );
};

// Componente principal de historial de transacciones
const TransactionHistory = () => {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Estados
  const [transactions, setTransactions] = useState<any[]>([]);
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
  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getTransactions({
        page: page,
        limit: rowsPerPage,
        ...filters
      });
      
      setTransactions(result.data);
      setTotalCount(result.pagination.total);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar el historial de transacciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters]);
  
  // Cargar al montar y cuando cambien los filtros o paginación
  useEffect(() => {
    if (session) {
      loadTransactions();
    }
  }, [session, loadTransactions]);
  
  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  // Manejar cambio de filas por página
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value, 10));
    setPage(1); // Reset page to 1 when rows per page changes
  };
  
  // Manejar clic en ver detalles
  const handleViewDetails = (transactionId: string) => {
    router.push(`/payments/details/${transactionId}`);
  };
  
  // Manejar descarga de recibo
  const handleDownloadReceipt = async (transactionId: string) => {
    try {
      await downloadReceipt(transactionId);
      toast({
        title: 'Éxito',
        description: 'Recibo descargado correctamente',
      });
    } catch (error) {
      console.error('Error al descargar recibo:', error);
      toast({
        title: 'Error',
        description: 'Error al descargar el recibo',
        variant: 'destructive',
      });
    }
  };
  
  // Renderizar tabla de transacciones
  const renderTransactionsTable = () => {
    if (loading && transactions.length === 0) {
      return (
        <div className="flex justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    
    if (transactions.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          <p>No se encontraron transacciones</p>
        </div>
      );
    }
    
    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>{transaction.method?.name || '-'}</TableCell>
                <TableCell>
                  <TransactionStatusBadge status={transaction.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(transaction.id)}
                    title="Ver detalles"
                  >
                    <ViewIcon className="h-4 w-4" />
                  </Button>
                  {transaction.status === 'COMPLETED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadReceipt(transaction.id)}
                      title="Descargar recibo"
                    >
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="flex justify-end items-center space-x-2 p-4">
          <Select value={String(rowsPerPage)} onValueChange={handleRowsPerPageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filas por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 por página</SelectItem>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="25">25 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
            </SelectContent>
          </Select>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={() => handlePageChange(page - 1)} 
                  className={page === 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
              {Array.from({ length: Math.ceil(totalCount / rowsPerPage) }, (_, i) => i + 1).map(p => (
                <PaginationItem key={p}>
                  <PaginationLink 
                    href="#" 
                    isActive={p === page} 
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={() => handlePageChange(page + 1)} 
                  className={page === Math.ceil(totalCount / rowsPerPage) ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ReceiptIcon className="mr-2 h-5 w-5" />
          Historial de Transacciones
        </CardTitle>
        <CardDescription>Consulte sus pagos realizados</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtros - Se pueden expandir según necesidades */}
        <div className="mb-3">
          {/* Aquí irían los filtros */}
        </div>
        
        {/* Tabla de transacciones */}
        {renderTransactionsTable()}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;