import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  MessageSquare,
  Calendar,
  Bell,
  Loader2,
} from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

export function DashboardOverview() {
  const {
    portfolioStatus,
    pendingPQRs,
    todayReservations,
    latestAnnouncements,
    loading,
    error,
  } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Cargando datos del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center h-64 flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Estado de Cartera
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{portfolioStatus}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">PQR Pendientes</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingPQRs}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Reservas del Día
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayReservations}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Últimos Comunicados
          </CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ul className="text-sm">
            {latestAnnouncements.length > 0 ? (
              latestAnnouncements.map((announcement, index) => (
                <li key={index}>{announcement}</li>
              ))
            ) : (
              <li>No hay comunicados recientes.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
