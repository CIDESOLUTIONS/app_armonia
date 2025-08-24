'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLogs, LogEvent, LogFilters } from '@/services/monitoringService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const LogLevelBadge = ({ level }: { level: string }) => {
  const variant = {
    ERROR: 'destructive',
    WARN: 'secondary',
    INFO: 'default',
    DEBUG: 'outline',
  }[level] || 'default';

  return <Badge variant={variant as any}>{level}</Badge>;
};

export default function MonitoringPage() {
  const [filters, setFilters] = useState<LogFilters>({ limit: 100 });

  const { data: logs, isLoading, error } = useQuery<LogEvent[]>({
    queryKey: ['logs', filters],
    queryFn: () => getLogs(filters),
  });

  const handleFilterChange = (filterName: keyof LogFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value === 'all' ? undefined : value }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Visor de Logs del Sistema</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Eventos Recientes</CardTitle>
          <div className="flex space-x-4 pt-2">
            <Select onValueChange={(value) => handleFilterChange('level', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Niveles</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
                <SelectItem value="WARN">Warning</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="DEBUG">Debug</SelectItem>
              </SelectContent>
            </Select>
            {/* Add more filters as needed, e.g., for source */}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Cargando logs...</p>}
          {error && <p className="text-destructive">Error al cargar los logs.</p>}
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Usuario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(logs || []).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                    <TableCell><LogLevelBadge level={log.level} /></TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell className="font-mono">{log.message}</TableCell>
                    <TableCell>{log.user?.email || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
