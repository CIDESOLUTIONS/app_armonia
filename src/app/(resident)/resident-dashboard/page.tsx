"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Loader2, DollarSign, Users, Home, Package, Bell } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { getResidentDashboardMetrics } from "@/services/residentService";

interface ResidentDashboardMetrics {
  totalProperties: number;
  totalResidents: number;
  totalPendingFees: number;
  totalPackages: number;
  totalNotifications: number;
}

export default function ResidentDashboardPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<ResidentDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const data = await getResidentDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching resident dashboard metrics:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las métricas del dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchMetrics();
    }
  }, [authLoading, user, toast]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled by AuthLayout
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Bienvenido, {user.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mis Propiedades
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalProperties || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Propiedades asociadas a tu cuenta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cuotas Pendientes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics?.totalPendingFees?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Monto total de cuotas pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Paquetes por Recoger
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalPackages || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Paquetes registrados a tu nombre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Notificaciones Nuevas
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalNotifications || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Notificaciones sin leer
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/resident/financial/family-budget">
              <Button variant="outline" className="w-full">
                <DollarSign className="mr-2 h-4 w-4" /> Presupuesto Familiar
              </Button>
            </Link>
            <Link href="/resident/visitors/pre-register">
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" /> Pre-registrar Visita
              </Button>
            </Link>
            <Link href="/resident/pqr/create">
              <Button variant="outline" className="w-full">
                <Bell className="mr-2 h-4 w-4" /> Crear PQR
              </Button>
            </Link>
            <Link href="/resident/reservations">
              <Button variant="outline" className="w-full">
                <Bell className="mr-2 h-4 w-4" /> Mis Reservas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anuncios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No hay anuncios recientes.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
