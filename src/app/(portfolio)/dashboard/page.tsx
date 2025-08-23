"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getPortfolioMetrics, getComplexMetrics } from "@/services/portfolioService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Home, Users, AlertTriangle, FileText, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { ComplexMetricsTable } from "@/components/portfolio/ComplexMetricsTable";

const StatCard = ({ title, value, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default function PortfolioDashboardPage() {
  const { data: portfolioMetrics, isLoading: isLoadingPortfolio, error: errorPortfolio } = useQuery({
    queryKey: ["portfolioMetrics"],
    queryFn: getPortfolioMetrics,
  });

  const { data: complexMetrics, isLoading: isLoadingComplexes, error: errorComplexes } = useQuery({
    queryKey: ["complexMetrics"],
    queryFn: getComplexMetrics,
  });

  if (isLoadingPortfolio || isLoadingComplexes) {
    return <div>Cargando métricas del portafolio...</div>;
  }

  if (errorPortfolio || errorComplexes) {
    return <div>Error al cargar el dashboard.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard del Portafolio</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        <StatCard 
          title="Propiedades Totales" 
          value={portfolioMetrics?.totalProperties || 0} 
          icon={Home} 
        />
        <StatCard 
          title="Residentes Totales" 
          value={portfolioMetrics?.totalResidents || 0} 
          icon={Users} 
        />
        <StatCard 
          title="Ingresos Totales" 
          value={formatCurrency(portfolioMetrics?.totalIncome || 0)} 
          icon={DollarSign} 
        />
        <StatCard 
          title="Gastos Totales" 
          value={formatCurrency(portfolioMetrics?.totalExpenses || 0)} 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Cuotas Pendientes" 
          value={formatCurrency(portfolioMetrics?.totalPendingFees || 0)} 
          icon={DollarSign} 
        />
        <StatCard 
          title="PQRs Abiertos" 
          value={portfolioMetrics?.totalOpenPqrs || 0} 
          icon={AlertTriangle} 
        />
        <StatCard 
          title="Presupuestos Aprobados" 
          value={formatCurrency(portfolioMetrics?.totalBudgetsApproved || 0)} 
          icon={FileText} 
        />
      </div>

      <h2 className="text-2xl font-bold mb-4">Métricas por Conjunto Residencial</h2>
      <ComplexMetricsTable data={complexMetrics || []} />
    </div>
  );
}
