import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
  History as HistoryIcon,
  Filter as FilterIcon,
  CheckCircle,
  XCircle,
  Hourglass,
  User,
  Loader2
} from 'lucide-react';
import { intercomService } from '../../lib/services/intercom-service';
import { VisitStatus, NotificationStatus } from '@prisma/client';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';

// Interfaces
interface Visit {
  id: string;
  visitor: {
    id: string;
    name: string;
    identification?: string;
    type: {
      name: string;
    };
  };
  purpose: string;
  status: VisitStatus;
  entryTime?: Date;
  exitTime?: Date;
  createdAt: Date;
  notifications: Array<{
    id: string;
    status: NotificationStatus;
    channel: string;
  }>;
}

interface FilterOptions {
  status?: VisitStatus;
  startDate?: Date | null;
  endDate?: Date | null;
}

// Componente principal
const VisitHistory: React.FC = () => {
  // Estados
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [filters, setFilters] = useState<FilterOptions>({
    status: undefined,
    startDate: null,
    endDate: null
  });

  // Función para obtener visitas
  const fetchVisits = useCallback(async () => {
    setLoading(true);
    try {
      // En un caso real, esto vendría de la API con el ID de la unidad del usuario actual
      const unitId = 1; // Ejemplo
      
      const options = {
        status: filters.status,
        startDate: filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : undefined,
        endDate: filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : undefined,
        page: page,
        pageSize: rowsPerPage
      };
      
      const result = await intercomService.getVisitHistory(unitId, options);
      
      setVisits(result.data);
      setTotalRows(result.pagination.total);
    } catch (error) {
      console.error('Error al cargar visitas:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page, rowsPerPage]);

  // Cargar datos
  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  // Manejar cambio de página
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (value: string) => {
    setRowsPerPage(parseInt(value, 10));
    setPage(1);
  };

  // Manejar cambio de filtros
  const handleFilterChange = (field: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      status: undefined,
      startDate: null,
      endDate: null
    });
    setPage(1);
  };

  // Renderizar badge de estado
  const renderStatusBadge = (status: VisitStatus) => {
    const statusConfig: Record<VisitStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      [VisitStatus.PENDING]: { 
        label: 'Pendiente', 
        variant: 'secondary',
        icon: <Hourglass className="h-3 w-3 mr-1" />
      },
      [VisitStatus.NOTIFIED]: { 
        label: 'Notificado', 
        variant: 'outline',
        icon: <Hourglass className="h-3 w-3 mr-1" />
      },
      [VisitStatus.APPROVED]: { 
        label: 'Aprobado', 
        variant: 'default',
        icon: <CheckCircle className="h-3 w-3 mr-1" />
      },
      [VisitStatus.REJECTED]: { 
        label: 'Rechazado', 
        variant: 'destructive',
        icon: <XCircle className="h-3 w-3 mr-1" />
      },
      [VisitStatus.IN_PROGRESS]: { 
        label: 'En progreso', 
        variant: 'default',
        icon: <Hourglass className="h-3 w-3 mr-1" />
      },
      [VisitStatus.COMPLETED]: { 
        label: 'Completado', 
        variant: 'default',
        icon: <CheckCircle className="h-3 w-3 mr-1" />
      },
      [VisitStatus.CANCELLED]: { 
        label: 'Cancelado', 
        variant: 'destructive',
        icon: <XCircle className="h-3 w-3 mr-1" />
      }
    };

    const config = statusConfig[status];
    
    return (
      <Badge variant={config.variant} className="flex items-center w-fit">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HistoryIcon className="mr-2 h-5 w-5" />
          Historial de Visitas
        </CardTitle>
        <CardDescription>Consulte el registro de ingresos y salidas de visitantes.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Select
            value={filters.status || ''}
            onValueChange={(value) => handleFilterChange('status', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {Object.values(VisitStatus).map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, "PPP", { locale: es }) : <span>Fecha inicio</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarIcon
                mode="single"
                selected={filters.startDate || undefined}
                onSelect={(date) => handleFilterChange('startDate', date)}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, "PPP", { locale: es }) : <span>Fecha fin</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarIcon
                mode="single"
                selected={filters.endDate || undefined}
                onSelect={(date) => handleFilterChange('endDate', date)}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
          
          <Button onClick={handleResetFilters} variant="outline">
            <FilterIcon className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>

        {/* Tabla de visitas */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitante</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Propósito</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Entrada/Salida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-2">Cargando visitas...</p>
                  </TableCell>
                </TableRow>
              ) : visits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No se encontraron visitas con los filtros seleccionados
                  </TableCell>
                </TableRow>
              ) : (
                visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      <p className="font-medium">{visit.visitor.name}</p>
                      {visit.visitor.identification && (
                        <p className="text-xs text-gray-500">
                          ID: {visit.visitor.identification}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>{visit.visitor.type.name}</TableCell>
                    <TableCell>{visit.purpose}</TableCell>
                    <TableCell>
                      {format(new Date(visit.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(visit.status)}
                    </TableCell>
                    <TableCell>
                      {visit.entryTime && (
                        <div className="text-sm">
                          <p>Entrada: {format(new Date(visit.entryTime), 'HH:mm')}</p>
                          {visit.exitTime && (
                            <p>Salida: {format(new Date(visit.exitTime), 'HH:mm')}</p>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-end items-center space-x-2 mt-4">
          <Select value={String(rowsPerPage)} onValueChange={handleChangeRowsPerPage}>
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
                <Button 
                  variant="ghost" 
                  onClick={() => handleChangePage(page - 1)} 
                  disabled={page === 1}
                >
                  Anterior
                </Button>
              </PaginationItem>
              {Array.from({ length: Math.ceil(totalRows / rowsPerPage) }, (_, i) => i + 1).map(p => (
                <PaginationItem key={p}>
                  <Button 
                    variant={p === page ? "default" : "ghost"} 
                    onClick={() => handleChangePage(p)}
                  >
                    {p}
                  </Button>
                </PaginationItem>
              ))}
              <PaginationItem>
                <Button 
                  variant="ghost" 
                  onClick={() => handleChangePage(page + 1)} 
                  disabled={page === Math.ceil(totalRows / rowsPerPage)}
                >
                  Siguiente
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitHistory;