"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import {
  Loader2,
  DollarSign,
  Users,
  Home,
  Package,
  Bell,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { getResidentDashboardMetrics } from "@/services/residentService";
import { getProjects } from "@/services/projectService";
import { Badge } from "@/components/ui/badge";

interface ResidentDashboardMetrics {
  totalProperties: number;
  totalResidents: number;
  totalPendingFees: number;
  totalPackages: number;
  totalNotifications: number;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  budget: number;
  collectedFunds: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  tasks: { id: number; isCompleted: boolean }[];
}

export default function ResidentDashboardPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<ResidentDashboardMetrics | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetricsAndProjects = async () => {
      setLoading(true);
      try {
        const [metricsData, projectsData] = await Promise.all([
          getResidentDashboardMetrics(),
          getProjects(), // Fetch all projects for now, filter by complexId if needed
        ]);
        setMetrics(metricsData);
        // Filter projects by complexId if user has one
        const relevantProjects = user?.complexId
          ? projectsData.filter(
              (project: any) => project.complexId === user.complexId,
            )
          : [];
        setProjects(relevantProjects);
      } catch (error: Error) {
        console.error("Error fetching resident dashboard data:", error);
        toast({
          title: "Error",
          description:
            "No se pudieron cargar los datos del dashboard: " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchMetricsAndProjects();
    }
  }, [authLoading, user, toast]);

  const calculateProgress = (project: Project) => {
    if (!project.tasks || project.tasks.length === 0) {
      return 0;
    }
    const completedTasks = project.tasks.filter(
      (task) => task.isCompleted,
    ).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

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
            <CardTitle>Proyectos en Curso</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <ul className="space-y-4">
                {projects.map((project) => (
                  <li key={project.id} className="border-b pb-2">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <p className="text-sm text-gray-600">
                      Estado: <Badge>{project.status}</Badge>
                    </p>
                    <p className="text-sm text-gray-600">
                      Progreso: {calculateProgress(project)}%
                    </p>
                    <Link
                      href={`/complex-admin/projects/${project.id}/overview`}
                    >
                      <Button variant="link" className="p-0 h-auto">
                        Ver Detalles <FileText className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay proyectos en curso.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
