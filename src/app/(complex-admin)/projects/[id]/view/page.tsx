"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Edit, FileText, DollarSign, Calendar, MapPin, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { getProjectById } from "@/services/projectService"; // Assuming projectService exists

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
}

export default function ViewProjectPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id ? parseInt(params.id as string) : null;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      if (!projectId) {
        router.push("/admin/projects/list");
        return;
      }
      const fetchedProject = await getProjectById(projectId);
      if (fetchedProject) {
        setProject(fetchedProject);
      } else {
        toast({
          title: "Error",
          description: "Proyecto no encontrado.",
          variant: "destructive",
        });
        router.push("/admin/projects/list");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el proyecto.",
        variant: "destructive",
      });
      router.push("/admin/projects/list");
    } finally {
      setLoading(false);
    }
  }, [projectId, router, toast]);

  useEffect(() => {
    if (!authLoading && user && projectId) {
      fetchProject();
    }
  }, [authLoading, user, projectId, fetchProject]);

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

  if (!project) {
    return null; // Should not happen due to redirects above
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Detalles del Proyecto: {project.title}
        </h1>
        <Link href={`/admin/projects/${project.id}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Editar Proyecto
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información del Proyecto</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>
            <strong>Descripción:</strong>{" "}
            {project.description || "No hay descripción disponible."}
          </p>
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-gray-600" />
            <span>
              Fecha Inicio: {new Date(project.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-gray-600" />
            <span>
              Fecha Fin: {new Date(project.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-gray-600" />
            <span>
              Estado: <Badge>{project.status}</Badge>
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-gray-600" />
            <span>Presupuesto: {project.budget}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-gray-600" />
            <span>Fondos Recaudados: {project.collectedFunds}</span>
          </div>
        </CardContent>
      </Card>

      {/* Sección de Avance y Hitos (Placeholder) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" /> Avance y Hitos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Aquí se mostrará el avance del proyecto y los hitos.
          </p>
          <Button variant="outline" className="mt-4">
            Ver Detalles de Avance
          </Button>
        </CardContent>
      </Card>

      {/* Sección de Cuotas Extras (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" /> Cuotas Extras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Aquí se gestionarán las cuotas extras para este proyecto.
          </p>
          <Button variant="outline" className="mt-4">
            Gestionar Cuotas Extras
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
