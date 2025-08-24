'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOperationalMetrics } from '@/services/appAdminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, DollarSign, Users, BarChart, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <p className={`text-xs ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {changeType === 'increase' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          {change}
        </p>
      )}
    </CardContent>
  </Card>
);

export default function OperationalDashboardPage() {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['operationalMetrics'],
    queryFn: getOperationalMetrics,
  });

  if (isLoading) {
    return <div>Cargando dashboard operativo...</div>;
  }

  if (error) {
    return <div>Error al cargar las métricas operativas.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Operativo de Armonía</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        <StatCard 
          title="Conjuntos Residenciales Totales" 
          value={metrics?.totalComplexes || 0} 
          icon={Building} 
        />
        <StatCard 
          title="Usuarios Activos Totales" 
          value={metrics?.totalUsers || 0} 
          icon={Users} 
        />
        <StatCard 
          title="Ingreso Mensual Recurrente (MRR)" 
          value={formatCurrency(metrics?.mrr || 0)} 
          icon={DollarSign} 
          change={metrics?.mrrChange ? `${metrics.mrrChange}% vs mes anterior` : ''}
          changeType={metrics?.mrrChange >= 0 ? 'increase' : 'decrease'}
        />
        <StatCard 
          title="Ingreso Anual Recurrente (ARR)" 
          value={formatCurrency(metrics?.arr || 0)} 
          icon={BarChart} 
        />
      </div>

      <h2 className="text-2xl font-bold mb-4">Desglose por Plan</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(metrics?.complexesByPlan || []).map(plan => (
            <StatCard 
                key={plan.name}
                title={`Conjuntos en Plan ${plan.name}`}
                value={plan.count}
                icon={Building}
            />
        ))}
      </div>
    </div>
  );
}
