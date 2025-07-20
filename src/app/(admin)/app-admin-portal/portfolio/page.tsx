"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Building } from "lucide-react";
import {
  getPortfolioMetrics,
  getComplexMetrics,
} from "@/services/portfolioService";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PortfolioMetrics {
  totalIncome: number;
  totalProperties: number;
  totalResidents: number;
  totalPendingFees: number;
}

interface ComplexMetric {
  id: number;
  name: string;
  residents: number;
  pendingFees: number;
  income: number;
}

export default function PortfolioDashboardPage() {
  const { toast } = useToast();
  const [portfolioMetrics, setPortfolioMetrics] =
    useState<PortfolioMetrics | null>(null);
  const [complexMetrics, setComplexMetrics] = useState<ComplexMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metrics = await getPortfolioMetrics();
        setPortfolioMetrics(metrics);
        const complexes = await getComplexMetrics();
        setComplexMetrics(complexes);
      } catch (error: Error) {
        console.error("Error fetching portfolio data:", error);
        toast({
          title: "Error",
          description:
            "No se pudieron cargar los datos del portafolio: " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Armonía Portafolio
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales Portafolio
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${portfolioMetrics?.totalIncome?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Monto total de ingresos en el portafolio
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conjuntos
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioMetrics?.totalProperties || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Número total de conjuntos administrados
            </p>
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
              {portfolioMetrics?.totalResidents || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Número total de residentes en el portafolio
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cuotas Pendientes Portafolio
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${portfolioMetrics?.totalPendingFees?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Monto total de cuotas pendientes en el portafolio
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-2xl font-bold tracking-tight mt-8 mb-4">
        Métricas por Conjunto
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {complexMetrics.map((complex) => (
          <Card key={complex.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" /> {complex.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Residentes: {complex.residents}</p>
              <p>
                Cuotas Pendientes: ${complex.pendingFees?.toFixed(2) || "0.00"}
              </p>
              <p>Ingresos: ${complex.income?.toFixed(2) || "0.00"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
