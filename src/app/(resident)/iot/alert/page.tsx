"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { 
  Loader2, 
  Search, 
  Filter, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
  IoTAlert,
  AlertType,
  AlertSeverity,
  AlertStatus,
  AlertFilters,
} from "@/services/iotService";

const ALERT_TYPE_LABELS = {
  [AlertType.CONSUMPTION_SPIKE]: "Pico de Consumo",
  [AlertType.DEVICE_OFFLINE]: "Dispositivo Desconectado",
  [AlertType.THRESHOLD_EXCEEDED]: "Umbral Excedido",
  [AlertType.MAINTENANCE_DUE]: "Mantenimiento Requerido",
  [AlertType.SECURITY_BREACH]: "Brecha de Seguridad",
  [AlertType.SYSTEM_ERROR]: "Error del Sistema",
  [AlertType.OTHER]: "Otro",
};

const SEVERITY_COLORS = {
  [AlertSeverity.LOW]: "bg-blue-100 text-blue-800",
  [AlertSeverity.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [AlertSeverity.HIGH]: "bg-orange-100 text-orange-800",
  [AlertSeverity.CRITICAL]: "bg-red-100 text-red-800",
};

const SEVERITY_LABELS = {
  [AlertSeverity.LOW]: "Baja",
  [AlertSeverity.MEDIUM]: "Media",
  [AlertSeverity.HIGH]: "Alta",
  [AlertSeverity.CRITICAL]: "Crítica",
};

const STATUS_COLORS = {
  [AlertStatus.ACTIVE]: "bg-red-100 text-red-800",
  [AlertStatus.ACKNOWLEDGED]: "bg-yellow-100 text-yellow-800",
  [AlertStatus.RESOLVED]: "bg-green-100 text-green-800",
  [AlertStatus.DISMISSED]: "bg-gray-100 text-gray-800",
};

const STATUS_LABELS = {
  [AlertStatus.ACTIVE]: "Activa",
  [AlertStatus.ACKNOWLEDGED]: "Reconocida",
  [AlertStatus.RESOLVED]: "Resuelta",
  [AlertStatus.DISMISSED]: "Descartada",
};

export default function IoTAlertsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<IoTAlert[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<AlertFilters>({
    page: 1,
    limit: 10,
  });
  const [selectedAlert, setSelectedAlert] = useState<IoTAlert | null>(null);
  const [showAcknowledgeDialog, setShowAcknowledgeDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [acknowledgeNotes, setAcknowledgeNotes] = useState("");
  const [resolutionText, setResolutionText] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const response = await getAlerts(filters);
      setAlerts(response.alerts);
      setTotal(response.total);
    } catch (error) {
      console.error("Error loading alerts:", error);
      toast({
        title: "Error",
        description: "Error al cargar las alertas IoT.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledgeAlert = async () => {
    if (!selectedAlert) return;
    
    try {
      setSubmitting(true);
      await acknowledgeAlert(selectedAlert.id!, acknowledgeNotes);
      toast({
        title: "Éxito",
        description: "Alerta reconocida correctamente.",
      });
      setShowAcknowledgeDialog(false);
      setSelectedAlert(null);
      setAcknowledgeNotes("");
      await loadAlerts();
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      toast({
        title: "Error",
        description: "Error al reconocer la alerta.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveAlert = async () => {
    if (!selectedAlert || !resolutionText.trim()) return;
    
    try {
      setSubmitting(true);
      await resolveAlert(selectedAlert.id!, resolutionText, resolutionNotes);
      toast({
        title: "Éxito",
        description: "Alerta resuelta correctamente.",
      });
      setShowResolveDialog(false);
      setSelectedAlert(null);
      setResolutionText("");
      setResolutionNotes("");
      await loadAlerts();
    } catch (error) {
      console.error("Error resolving alert:", error);
      toast({
        title: "Error",
        description: "Error al resolver la alerta.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = (search: string) => {
    setFilters({ ...filters, search, page: 1 });
  };

  const handleFilterChange = (key: keyof AlertFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const openAcknowledgeDialog = (alert: IoTAlert) => {
    setSelectedAlert(alert);
    setShowAcknowledgeDialog(true);
  };

  const openResolveDialog = (alert: IoTAlert) => {
    setSelectedAlert(alert);
    setShowResolveDialog(true);
  };

  const getAlertIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case AlertSeverity.HIGH:
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case AlertSeverity.MEDIUM:
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Eye className="h-5 w-5 text-blue-600" />;
    }
  };

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user, filters]);

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
          Centro de Alertas IoT
        </h1>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar alertas..."
                value={filters.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.type || ""}
              onValueChange={(value) => handleFilterChange("type", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de alerta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los tipos</SelectItem>
                {Object.entries(ALERT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.severity || ""}
              onValueChange={(value) => handleFilterChange("severity", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las severidades</SelectItem>
                {Object.entries(SEVERITY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status || ""}
              onValueChange={(value) => handleFilterChange("status", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Alertas ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No se encontraron alertas IoT.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getAlertIcon(alert.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge className={SEVERITY_COLORS[alert.severity]}>
                            {SEVERITY_LABELS[alert.severity]}
                          </Badge>
                          <Badge className={STATUS_COLORS[alert.status!]}>
                            {STATUS_LABELS[alert.status!]}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {ALERT_TYPE_LABELS[alert.type] || alert.type}
                          </span>
                          <span>•</span>
                          <span>{alert.deviceName || alert.deviceId}</span>
                          <span>•</span>
                          <span>{new Date(alert.createdAt).toLocaleString('es-ES')}</span>
                        </div>
                        {(alert.acknowledgedAt || alert.resolvedAt) && (
                          <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                            {alert.acknowledgedAt && (
                              <div className="text-yellow-700">
                                Reconocida: {new Date(alert.acknowledgedAt).toLocaleString('es-ES')}
                              </div>
                            )}
                            {alert.resolvedAt && (
                              <div className="text-green-700">
                                Resuelta: {new Date(alert.resolvedAt).toLocaleString('es-ES')}
                                {alert.resolution && (
                                  <div className="mt-1 font-medium">
                                    Solución: {alert.resolution}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.status === AlertStatus.ACTIVE && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAcknowledgeDialog(alert)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Reconocer
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => openResolveDialog(alert)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Resolver
                          </Button>
                        </>
                      )}
                      {alert.status === AlertStatus.ACKNOWLEDGED && (
                        <Button
                          size="sm"
                          onClick={() => openResolveDialog(alert)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Resolver
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acknowledge Alert Dialog */}
      <Dialog open={showAcknowledgeDialog} onOpenChange={setShowAcknowledgeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reconocer Alerta</DialogTitle>
            <DialogDescription>
              Marca esta alerta como reconocida. Se notificará que has visto la alerta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedAlert && (
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium">{selectedAlert.title}</h4>
                <p className="text-sm text-gray-600">{selectedAlert.message}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="acknowledge-notes">Notas (opcional)</Label>
              <Textarea
                id="acknowledge-notes"
                value={acknowledgeNotes}
                onChange={(e) => setAcknowledgeNotes(e.target.value)}
                placeholder="Agregar notas sobre el reconocimiento..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAcknowledgeDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAcknowledgeAlert}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Reconocer Alerta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Alert Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolver Alerta</DialogTitle>
            <DialogDescription>
              Proporciona los detalles de cómo se resolvió esta alerta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedAlert && (
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium">{selectedAlert.title}</h4>
                <p className="text-sm text-gray-600">{selectedAlert.message}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="resolution">Solución aplicada *</Label>
              <Textarea
                id="resolution"
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Describe cómo se resolvió la alerta..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resolution-notes">Notas adicionales (opcional)</Label>
              <Textarea
                id="resolution-notes"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Notas adicionales sobre la resolución..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResolveDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleResolveAlert}
              disabled={submitting || !resolutionText.trim()}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Resolver Alerta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}