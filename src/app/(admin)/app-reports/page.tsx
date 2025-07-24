
"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { generateConsolidatedFinancialReportPdf } from "@/services/reportService";
import { getResidentialComplexes } from "@/services/residentialComplexService";
import { MultiSelect } from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ComplexOption {
  value: string;
  label: string;
}

export default function ConsolidatedFinancialReportsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [complexOptions, setComplexOptions] = useState<ComplexOption[]>([]);
  const [selectedComplexes, setSelectedComplexes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchComplexes = async () => {
      try {
        const complexes = await getResidentialComplexes();
        setComplexOptions(
          complexes.map((c) => ({
            value: c.schemaName,
            label: c.name,
          })),
        );
      } catch (error: any) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los complejos: " + error.message,
          variant: "destructive",
        });
      }
    };
    fetchComplexes();
  }, [toast]);

  const handleGenerateReport = async () => {
    if (selectedComplexes.length === 0) {
      toast({
        title: "Advertencia",
        description: "Por favor, selecciona al menos un complejo.",
        variant: "warning",
      });
      return;
    }
    if (!startDate || !endDate) {
      toast({
        title: "Advertencia",
        description: "Por favor, selecciona un rango de fechas.",
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const pdfBlob = await generateConsolidatedFinancialReportPdf(
        selectedComplexes,
        startDate,
        endDate,
      );
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
      window.open(url, "_blank");
      toast({ title: "Éxito", description: "Reporte generado correctamente." });
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Error al generar el reporte: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
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
        Reportes Financieros Consolidados
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div>
          <Label htmlFor="complex-select">Seleccionar Complejos</Label>
          <MultiSelect
            options={complexOptions}
            selected={selectedComplexes}
            onSelectChange={setSelectedComplexes}
            placeholder="Selecciona uno o más complejos"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <FileText className="mr-2 h-4 w-4" />
          )}
          Generar Reporte PDF
        </Button>
      </div>
    </div>
  );
}
