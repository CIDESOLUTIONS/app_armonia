"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, FileText, Download } from "lucide-react";

export default function ReceptionReportsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("daily-summary");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleGenerateReport = async () => {
    if (!reportType || !startDate || !endDate) {
      toast({
        title: "Advertencia",
        description: "Por favor, selecciona un tipo de reporte y un rango de fechas.",
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for report generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Éxito",
        description: `Reporte de ${reportType} generado y descargado correctamente. (Simulado)`, 
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Error al generar el reporte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "COMPLEX_ADMIN" && user.role !== "STAFF")) {
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
        Generación de Informes de Recepción
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="reportType">Tipo de Reporte</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de reporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily-summary">Resumen Diario</SelectItem>
              <SelectItem value="visitor-log">Registro de Visitantes</SelectItem>
              <SelectItem value="package-log">Registro de Paquetes</SelectItem>
              <SelectItem value="incident-log">Registro de Incidentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">Fecha de Inicio</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="endDate">Fecha de Fin</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleGenerateReport} disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Generar y Descargar Reporte
      </Button>
    </div>
  );
}