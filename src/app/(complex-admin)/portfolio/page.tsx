"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Loader2,
  Building2,
  Users,
  DollarSign,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPortfolioMetrics,
  getComplexMetrics,
  PortfolioMetric,
  ComplexMetric,
} from "@/services/portfolioService";
import { useToast } from "@/components/ui/use-toast";

export default function PortfolioDashboardPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [portfolioMetrics, setPortfolioMetrics] =
    useState<PortfolioMetric | null>(null);
  const [complexMetrics, setComplexMetrics] = useState<ComplexMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== "APP_ADMIN") {
        setLoading(false);
        return;
      }
      try {
        const [fetchedPortfolioMetrics, fetchedComplexMetrics] =
          await Promise.all([getPortfolioMetrics(), getComplexMetrics()]);
        setPortfolioMetrics(fetchedPortfolioMetrics);
        setComplexMetrics(fetchedComplexMetrics);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del portafolio.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "APP_ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Dashboard de Portafolio
      </h1>

      {portfolioMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inmuebles
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolioMetrics.totalProperties}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Residentes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolioMetrics.totalResidents}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${portfolioMetrics.totalIncome.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                PQRs Abiertas
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolioMetrics.totalOpenPqrs}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Métricas por Complejo
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complexMetrics.length > 0 ? (
          complexMetrics.map((complex) => (
            <Card key={complex.id}>
              <CardHeader>
                <CardTitle>{complex.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Residentes:</strong> {complex.residents}
                </p>
                <p>
                  <strong>Cuotas Pendientes:</strong> $
                  {complex.pendingFees.toFixed(2)}
                </p>
                <p>
                  <strong>Ingresos:</strong> ${complex.income.toFixed(2)}
                </p>
                <p>
                  <strong>PQRs Abiertas:</strong> {complex.openPqrs}
                </p>
                <p>
                  <strong>Presupuesto Aprobado:</strong> $
                  {complex.budgetApproved.toFixed(2)}
                </p>
                <p>
                  <strong>Gastos:</strong> ${complex.expenses.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No hay complejos registrados.
          </p>
        )}
      </div>
    </div>
  );
}
