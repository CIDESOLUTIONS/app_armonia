"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Zap, AlertTriangle, Activity, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  getDashboardStats,
  IoTDashboardStats,
  IoTDeviceType,
  AlertSeverity,
  AlertStatus,
} from "@/services/iotService";
import Link from "next/link";

const DEVICE_TYPE_LABELS = {
  [IoTDeviceType.SMART_METER]: "Medidores Inteligentes",
  [IoTDeviceType.CAMERA]: "Cámaras",
  [IoTDeviceType.SENSOR]: "Sensores",
  [IoTDeviceType.ACCESS_CONTROL]: "Control de Acceso",
  [IoTDeviceType.THERMOSTAT]: "Termostatos",
  [IoTDeviceType.SMOKE_DETECTOR]: "Detectores de Humo",
  [IoTDeviceType.WATER_LEAK_SENSOR]: "Sensores de Fuga",
  [IoTDeviceType.MOTION_SENSOR]: "Sensores de Movimiento",
  [IoTDeviceType.OTHER]: "Otros",
};

const SEVERITY_COLORS = {
  [AlertSeverity.LOW]: "bg-blue-100 text-blue-800",
  [AlertSeverity.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [AlertSeverity.HIGH]: "bg-orange-100 text-orange-800",
  [AlertSeverity.CRITICAL]: "bg-red-100 text-red-800",
};

export default function IoTDashboardPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<IoTDashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading IoT dashboard stats:", error);
      toast({
        title: "Error",
        description: "Error al cargar las estadísticas del dashboard IoT.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardStats();
    setRefreshing(false);
    toast({
      title: "Actualizado",
      description: "Dashboard IoT actualizado correctamente.",
    });
  };

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "COMPLEX_ADMIN")) {
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

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error al cargar datos
          </h1>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar las estadísticas del dashboard IoT.
          </p>
          <Button onClick={loadDashboardStats}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard IoT
        </h1>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          variant="outline"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Activity className="h-4 w-4 mr-2" />
          )}
          Actualizar
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Dispositivos
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.onlineDevices} en línea
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertas Activas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.criticalAlerts} críticas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lecturas Hoy
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayReadings}</div>
            <p className="text-xs text-muted-foreground">
              Datos recibidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consumo Total
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalConsumption.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              kWh/m³ acumulado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Device Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Dispositivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">En línea</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {stats.onlineDevices}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Fuera de línea</span>
                <Badge variant="secondary">
                  {stats.offlineDevices}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">En mantenimiento</span>
                <Badge variant="outline">
                  {stats.maintenanceDevices}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Con errores</span>
                <Badge variant="destructive">
                  {stats.errorDevices}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Dispositivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.devicesByType).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {DEVICE_TYPE_LABELS[type as IoTDeviceType] || type}
                  </span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Alertas Recientes</CardTitle>
          <Link href="/iot/alerts">
            <Button variant="outline" size="sm">
              Ver todas
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentAlerts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay alertas recientes
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={SEVERITY_COLORS[alert.severity]}>
                        {alert.severity}
                      </Badge>
                      <span className="text-sm font-medium">{alert.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.deviceName} • {new Date(alert.createdAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={alert.status === AlertStatus.ACTIVE ? "destructive" : "secondary"}
                    >
                      {alert.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Link href="/iot/devices">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-1">Gestionar Dispositivos</h3>
              <p className="text-sm text-muted-foreground">
                Agregar, configurar y monitorear dispositivos IoT
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/iot/smart-meters">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-1">Medidores Inteligentes</h3>
              <p className="text-sm text-muted-foreground">
                Lecturas y facturación automatizada
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/iot/alerts">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-semibold mb-1">Centro de Alertas</h3>
              <p className="text-sm text-muted-foreground">
                Gestionar y resolver alertas del sistema
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
