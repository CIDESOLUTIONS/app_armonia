"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { 
  Loader2, 
  Zap, 
  DollarSign, 
  BarChart3, 
  Search, 
  Plus,
  TrendingUp,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  recordSmartMeterReading,
  getSmartMeterReadings,
  triggerAutomatedBilling,
  getDevices,
  SmartMeterReading,
  AutomatedBilling,
  SmartMeterUnit,
  IoTDeviceType,
  ReadingFilters,
} from "@/services/iotService";

const UNIT_LABELS = {
  [SmartMeterUnit.KWH]: "kWh (Electricidad)",
  [SmartMeterUnit.M3]: "m³ (Gas/Agua)",
  [SmartMeterUnit.LITERS]: "Litros",
  [SmartMeterUnit.GALLONS]: "Galones",
  [SmartMeterUnit.OTHER]: "Otro",
};

export default function SmartMetersPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [smartMeters, setSmartMeters] = useState<any[]>([]);
  const [readings, setReadings] = useState<SmartMeterReading[]>([]);
  const [total, setTotal] = useState(0);
  const [showReadingDialog, setShowReadingDialog] = useState(false);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [readingForm, setReadingForm] = useState<Partial<SmartMeterReading>>({
    deviceId: "",
    meterId: "",
    propertyId: "",
    reading: 0,
    unit: SmartMeterUnit.KWH,
    timestamp: new Date().toISOString().slice(0, 16),
  });
  const [billingForm, setBillingForm] = useState<Partial<AutomatedBilling>>({
    billingPeriodStart: "",
    billingPeriodEnd: "",
    dryRun: true,
  });
  const [filters, setFilters] = useState<ReadingFilters>({
    page: 1,
    limit: 10,
    sortOrder: 'desc',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadSmartMeters = async () => {
    try {
      const response = await getDevices({
        type: IoTDeviceType.SMART_METER,
        limit: 100,
      });
      setSmartMeters(response.devices);
    } catch (error) {
      console.error("Error loading smart meters:", error);
    }
  };

  const loadReadings = async () => {
    try {
      setLoading(true);
      const response = await getSmartMeterReadings(filters);
      setReadings(response.readings);
      setTotal(response.total);
    } catch (error) {
      console.error("Error loading readings:", error);
      toast({
        title: "Error",
        description: "Error al cargar las lecturas de medidores.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordReading = async () => {
    if (!readingForm.deviceId || !readingForm.reading || !readingForm.unit) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const readingData: SmartMeterReading = {
        deviceId: readingForm.deviceId!,
        meterId: readingForm.deviceId!, // Using deviceId as meterId
        propertyId: readingForm.propertyId || "",
        reading: readingForm.reading!,
        unit: readingForm.unit!,
        timestamp: readingForm.timestamp || new Date().toISOString(),
        residentialComplexId: "", // Will be set by backend
        isAutomatic: false,
        source: "manual",
      };

      await recordSmartMeterReading(readingData);
      toast({
        title: "Lectura Registrada",
        description: "Lectura del medidor inteligente registrada correctamente.",
      });
      setShowReadingDialog(false);
      setReadingForm({
        deviceId: "",
        meterId: "",
        propertyId: "",
        reading: 0,
        unit: SmartMeterUnit.KWH,
        timestamp: new Date().toISOString().slice(0, 16),
      });
      await loadReadings();
    } catch (error) {
      console.error("Error recording reading:", error);
      toast({
        title: "Error",
        description: "Error al registrar la lectura del medidor.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTriggerBilling = async () => {
    if (!billingForm.billingPeriodStart || !billingForm.billingPeriodEnd) {
      toast({
        title: "Error",
        description: "Por favor selecciona las fechas del período de facturación.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const billingData: AutomatedBilling = {
        residentialComplexId: "", // Will be set by backend
        billingPeriodStart: billingForm.billingPeriodStart!,
        billingPeriodEnd: billingForm.billingPeriodEnd!,
        dryRun: billingForm.dryRun || false,
        notes: billingForm.notes,
        propertyIds: billingForm.propertyIds,
        meterTypes: billingForm.meterTypes,
      };

      const result = await triggerAutomatedBilling(billingData);
      toast({
        title: "Facturación Procesada",
        description: billingForm.dryRun 
          ? "Simulación de facturación completada."
          : "Facturación automatizada iniciada correctamente.",
      });
      setShowBillingDialog(false);
      setBillingForm({
        billingPeriodStart: "",
        billingPeriodEnd: "",
        dryRun: true,
      });
      console.log("Billing result:", result);
    } catch (error) {
      console.error("Error triggering billing:", error);
      toast({
        title: "Error",
        description: "Error al procesar la facturación automatizada.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterChange = (key: keyof ReadingFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const formatConsumption = (consumption?: number) => {
    if (consumption === undefined || consumption === null) return "N/A";
    return consumption.toFixed(2);
  };

  useEffect(() => {
    if (user) {
      loadSmartMeters();
      loadReadings();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadReadings();
    }
  }, [filters]);

  if (authLoading) {
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Medidores Inteligentes
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowReadingDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Registrar Lectura
          </Button>
          <Button onClick={() => setShowBillingDialog(true)}>
            <DollarSign className="h-4 w-4 mr-2" />
            Facturación Automatizada
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medidores Activos
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smartMeters.length}</div>
            <p className="text-xs text-muted-foreground">
              Dispositivos configurados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lecturas Totales
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">
              Registros históricos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consumo Total
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {readings.reduce((sum, reading) => sum + (reading.consumption || 0), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              kWh/m³ acumulado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lecturas Hoy
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {readings.filter(reading => {
                const today = new Date().toDateString();
                const readingDate = new Date(reading.timestamp).toDateString();
                return today === readingDate;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Registros de hoy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              value={filters.meterId || ""}
              onValueChange={(value) => handleFilterChange("meterId", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por medidor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los medidores</SelectItem>
                {smartMeters.map((meter) => (
                  <SelectItem key={meter.id} value={meter.id}>
                    {meter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.unit || ""}
              onValueChange={(value) => handleFilterChange("unit", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de medición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las unidades</SelectItem>
                {Object.entries(UNIT_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              placeholder="Fecha inicio"
            />
            <Input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              placeholder="Fecha fin"
            />
          </div>
        </CardContent>
      </Card>

      {/* Readings Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lecturas de Medidores ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : readings.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No se encontraron lecturas de medidores.
              </p>
              <Button onClick={() => setShowReadingDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Registrar primera lectura
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medidor</TableHead>
                  <TableHead>Lectura</TableHead>
                  <TableHead>Consumo</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Origen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {readings.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {smartMeters.find(m => m.id === reading.deviceId)?.name || reading.deviceId}
                        </div>
                        {reading.propertyId && (
                          <div className="text-sm text-muted-foreground">
                            Propiedad: {reading.propertyId}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono">
                        {reading.reading.toFixed(2)}
                      </div>
                      {reading.previousReading && (
                        <div className="text-sm text-muted-foreground">
                          Anterior: {reading.previousReading.toFixed(2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-blue-600">
                        {formatConsumption(reading.consumption)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {UNIT_LABELS[reading.unit as SmartMeterUnit] || reading.unit}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(reading.timestamp).toLocaleString('es-ES')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={reading.isAutomatic ? "default" : "secondary"}
                      >
                        {reading.isAutomatic ? "Automático" : "Manual"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Record Reading Dialog */}
      <Dialog open={showReadingDialog} onOpenChange={setShowReadingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Lectura de Medidor</DialogTitle>
            <DialogDescription>
              Ingresa los datos de la lectura manual del medidor inteligente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deviceId">Medidor *</Label>
              <Select
                value={readingForm.deviceId || ""}
                onValueChange={(value) => setReadingForm({ ...readingForm, deviceId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar medidor" />
                </SelectTrigger>
                <SelectContent>
                  {smartMeters.map((meter) => (
                    <SelectItem key={meter.id} value={meter.id}>
                      {meter.name} - {meter.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reading">Lectura *</Label>
                <Input
                  id="reading"
                  type="number"
                  step="0.01"
                  value={readingForm.reading || ""}
                  onChange={(e) => setReadingForm({ ...readingForm, reading: parseFloat(e.target.value) || 0 })}
                  placeholder="Ej: 1234.56"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unidad *</Label>
                <Select
                  value={readingForm.unit || ""}
                  onValueChange={(value) => setReadingForm({ ...readingForm, unit: value as SmartMeterUnit })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(UNIT_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyId">Propiedad (opcional)</Label>
                <Input
                  id="propertyId"
                  value={readingForm.propertyId || ""}
                  onChange={(e) => setReadingForm({ ...readingForm, propertyId: e.target.value })}
                  placeholder="ID de la propiedad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timestamp">Fecha y Hora</Label>
                <Input
                  id="timestamp"
                  type="datetime-local"
                  value={readingForm.timestamp?.slice(0, 16) || ""}
                  onChange={(e) => setReadingForm({ ...readingForm, timestamp: e.target.value + ":00.000Z" })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReadingDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRecordReading}
              disabled={submitting || !readingForm.deviceId || !readingForm.reading}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Registrar Lectura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Automated Billing Dialog */}
      <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Facturación Automatizada</DialogTitle>
            <DialogDescription>
              Configura el período de facturación para generar facturas automáticamente basadas en las lecturas de medidores.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingPeriodStart">Fecha Inicio *</Label>
                <Input
                  id="billingPeriodStart"
                  type="date"
                  value={billingForm.billingPeriodStart || ""}
                  onChange={(e) => setBillingForm({ ...billingForm, billingPeriodStart: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingPeriodEnd">Fecha Fin *</Label>
                <Input
                  id="billingPeriodEnd"
                  type="date"
                  value={billingForm.billingPeriodEnd || ""}
                  onChange={(e) => setBillingForm({ ...billingForm, billingPeriodEnd: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Input
                id="notes"
                value={billingForm.notes || ""}
                onChange={(e) => setBillingForm({ ...billingForm, notes: e.target.value })}
                placeholder="Notas sobre la facturación..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="dryRun"
                checked={billingForm.dryRun || false}
                onChange={(e) => setBillingForm({ ...billingForm, dryRun: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="dryRun" className="text-sm">
                Modo simulación (no generar facturas reales)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBillingDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleTriggerBilling}
              disabled={submitting || !billingForm.billingPeriodStart || !billingForm.billingPeriodEnd}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <DollarSign className="h-4 w-4 mr-2" />
              )}
              {billingForm.dryRun ? "Simular Facturación" : "Generar Facturas"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}