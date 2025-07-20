import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function FinancialReportsGenerator() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleGenerateReport = async () => {
    if (!reportType) {
      toast({
        title: "Error",
        description: "Por favor, seleccione un tipo de informe.",
        variant: "destructive",
      });
      return;
    }
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Por favor, seleccione un rango de fechas.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call backend API to generate report
      const response = await fetch(
        `/api/finances/reports/${reportType}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al generar el informe.");
      }

      const data = await response.json();
      // Assuming the API returns a downloadable URL
      window.open(data.downloadUrl, "_blank");

      toast({
        title: "Informe Generado",
        description: `El informe de ${reportType} para el rango seleccionado ha sido generado y descargado.`,
      });
    } catch (error: Error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Error al generar el informe: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generador de Informes Financieros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="reportType">Tipo de Informe</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="reportType">
                <SelectValue placeholder="Seleccione un tipo de informe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estado_cartera">
                  Estado de Cartera
                </SelectItem>
                <SelectItem value="paz_salvos">Paz y Salvos</SelectItem>
                <SelectItem value="informe_pagos">Informe de Pagos</SelectItem>
                <SelectItem value="presupuesto_anual">
                  Presupuesto Anual
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="dateRange">Rango de Fechas</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Fecha Inicio</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Fecha Fin</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <Button onClick={handleGenerateReport} className="mt-4">
          <Download className="mr-2 h-4 w-4" /> Generar y Descargar Informe
        </Button>
      </CardContent>
    </Card>
  );
}