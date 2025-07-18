"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Car,
  AlertCircle,
  Camera,
  ClipboardList,
  MessageSquare,
  Package,
  Phone,
  Activity,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
// Importar servicios para obtener datos (aún no implementados, se asume su existencia)
// import { getReceptionDashboardStats, getRecentReceptionActivity } from '@/services/receptionDashboardService';

interface ReceptionDashboardStats {
  currentVisitors: number;
  commonAreasInUse: number;
  pendingAlerts: number;
  camerasOnline: number;
  previousShiftIncidents: number;
  pendingPQRs: number;
  pendingPackages: number;
}

interface RecentReceptionActivity {
  id: string;
  type: "visitor" | "package" | "incident" | "pqr";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "error" | "info";
}

export function ReceptionDashboardContent() {
  const [stats, setStats] = useState<ReceptionDashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<
    RecentReceptionActivity[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const fetchData = async () => {
      setLoading(true);
      // Aquí se llamarían a los servicios reales
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular retardo de red
      setStats({
        currentVisitors: 15,
        commonAreasInUse: 3,
        pendingAlerts: 2,
        camerasOnline: 8,
        previousShiftIncidents: 5,
        pendingPQRs: 7,
        pendingPackages: 12,
      });
      setRecentActivity([
        {
          id: "1",
          type: "visitor",
          title: "Nuevo visitante registrado",
          description: "Acceso de Juan Pérez a apto 301",
          timestamp: new Date().toISOString(),
          status: "info",
        },
        {
          id: "2",
          type: "package",
          title: "Paquete recibido",
          description: "Paquete para apto 502 de Amazon",
          timestamp: new Date().toISOString(),
          status: "success",
        },
        {
          id: "3",
          type: "incident",
          title: "Incidente de seguridad",
          description: "Alarma activada en zona común",
          timestamp: new Date().toISOString(),
          status: "error",
        },
        {
          id: "4",
          type: "pqr",
          title: "Nueva PQR",
          description: "Reporte de ruido en apto 203",
          timestamp: new Date().toISOString(),
          status: "warning",
        },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "visitor":
        return <Users className="h-4 w-4" />;
      case "package":
        return <Package className="h-4 w-4" />;
      case "incident":
        return <AlertCircle className="h-4 w-4" />;
      case "pqr":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null; // O mostrar un mensaje de error

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Recepción
          </h1>
          <p className="text-gray-600 mt-1">
            Panel de control y métricas clave para el personal de recepción y
            vigilancia
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
          <Button size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Actualizar Datos
          </Button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Visitantes Actuales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Visitantes Actuales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentVisitors}</div>
            <p className="text-xs text-muted-foreground">En el conjunto</p>
          </CardContent>
        </Card>

        {/* Servicios Comunes en Uso */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Áreas Comunes en Uso
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.commonAreasInUse}</div>
            <p className="text-xs text-muted-foreground">
              Salones, piscina, etc.
            </p>
          </CardContent>
        </Card>

        {/* Alertas Pendientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertas Pendientes
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.pendingAlerts}
            </div>
            <p className="text-xs text-muted-foreground">
              Incidencias de seguridad o sistema
            </p>
          </CardContent>
        </Card>

        {/* Cámaras Online */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cámaras Online
            </CardTitle>
            <Camera className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.camerasOnline}
            </div>
            <p className="text-xs text-muted-foreground">
              Sistemas de vigilancia activos
            </p>
          </CardContent>
        </Card>

        {/* Novedades Turno Anterior */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Novedades Turno Anterior
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.previousShiftIncidents}
            </div>
            <p className="text-xs text-muted-foreground">
              Registradas en minuta digital
            </p>
          </CardContent>
        </Card>

        {/* PQRs Asignados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              PQRs Asignados
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPQRs}</div>
            <p className="text-xs text-muted-foreground">
              Pendientes de gestión
            </p>
          </CardContent>
        </Card>

        {/* Paquetes Pendientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Paquetes Pendientes
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPackages}</div>
            <p className="text-xs text-muted-foreground">
              Por entregar a residentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div
                    className={`p-2 rounded-full ${getStatusColor(activity.status)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/reception-portal/activity">
                <Button variant="outline" size="sm" className="w-full">
                  Ver toda la actividad
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/reception-portal/visitors/register">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Users className="h-4 w-4 mr-2" />
                Registrar Visitante
              </Button>
            </Link>
            <Link href="/reception-portal/packages/register">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Package className="h-4 w-4 mr-2" />
                Registrar Paquete
              </Button>
            </Link>
            <Link href="/reception-portal/incidents/create">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Reportar Incidente
              </Button>
            </Link>
            <Link href="/reception-portal/intercom">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Phone className="h-4 w-4 mr-2" />
                Citofonía Virtual
              </Button>
            </Link>
            <Link href="/reception-portal/minuta">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Minuta Digital
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
