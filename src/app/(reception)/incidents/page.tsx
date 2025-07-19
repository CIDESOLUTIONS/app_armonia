"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Search,
  Camera,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  X,
  FileText,
  MapPin,
  Calendar,
  Eye,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incidentSchema, IncidentFormValues, incidentUpdateSchema, IncidentUpdateFormValues } from "@/validators/incident-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getIncidents, createIncident, updateIncident, uploadIncidentAttachments } from "@/services/incidentService";

interface Incident {
  id: string;
  title: string;
  description: string;
  category: "security" | "maintenance" | "emergency" | "other";
  priority: "low" | "medium" | "high" | "critical";
  location: string;
  reportedAt: string;
  reportedBy: string;
  assignedTo?: string;
  resolvedAt?: string;
  status: "reported" | "in_progress" | "resolved" | "closed";
  updates: IncidentUpdate[];
  attachments: Attachment[];
}

interface IncidentUpdate {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  attachments: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export default function ReceptionIncidentsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "reported" | "in_progress" | "resolved" | "closed" | "all"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<
    "security" | "maintenance" | "emergency" | "other" | "all"
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "low" | "medium" | "high" | "critical" | "all"
  >("all");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );

  const newIncidentForm = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "security",
      priority: "medium",
      location: "",
      reportedBy: "",
      attachments: [],
    },
  });

  const {
    handleSubmit: handleNewIncidentSubmit,
    control: newIncidentFormControl,
    reset: resetNewIncidentForm,
    formState: { isSubmitting: isNewIncidentSubmitting },
  } = newIncidentForm;

  const updateIncidentForm = useForm<IncidentUpdateFormValues>({
    resolver: zodResolver(incidentUpdateSchema),
    defaultValues: {
      content: "",
      status: "reported",
      attachments: [],
    },
  });

  const {
    handleSubmit: handleUpdateIncidentSubmit,
    control: updateIncidentFormControl,
    reset: resetUpdateIncidentForm,
    formState: { isSubmitting: isUpdateIncidentSubmitting },
  } = updateIncidentForm;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedIncidents = await getIncidents();
      setIncidents(fetchedIncidents);
    } catch (err: any) {
      console.error("[ReceptionIncidents] Error:", err);
      setError(err.message || "Error al cargar datos de incidentes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  // Función para formatear fechas
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: es });
  };

  // Función para obtener el texto de la categoría
  const getCategoryText = (category: string) => {
    switch (category) {
      case "security":
        return "Seguridad";
      case "maintenance":
        return "Mantenimiento";
      case "emergency":
        return "Emergencia";
      case "other":
        return "Otro";
      default:
        return "Desconocido";
    }
  };

  // Función para obtener el color según la categoría
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "security":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      case "other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para obtener el texto de la prioridad
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "low":
        return "Baja";
      case "medium":
        return "Media";
      case "high":
        return "Alta";
      case "critical":
        return "Crítica";
      default:
        return "Desconocida";
    }
  };

  // Función para obtener el color según la prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "reported":
        return "Reportado";
      case "in_progress":
        return "En proceso";
      case "resolved":
        return "Resuelto";
      case "closed":
        return "Cerrado";
      default:
        return "Desconocido";
    }
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtrar incidentes según los filtros aplicados
  const getFilteredIncidents = () => {
    if (!incidents) return [];

    let filtered = incidents;

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (incident) => incident.status === statusFilter,
      );
    }

    // Filtrar por categoría
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (incident) => incident.category === categoryFilter,
      );
    }

    // Filtrar por prioridad
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (incident) => incident.priority === priorityFilter,
      );
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (incident) =>
          incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.reportedBy
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (incident.assignedTo &&
            incident.assignedTo
              .toLowerCase()
              .includes(searchTerm.toLowerCase())),
      );
    }

    return filtered;
  };

  const handleNewIncidentFormSubmitLogic = async (values: IncidentFormValues) => {
    try {
      let uploadedAttachmentUrls: string[] = [];
      if (values.attachments && values.attachments.length > 0) {
        const uploaded = await uploadIncidentAttachments(values.attachments);
        uploadedAttachmentUrls = uploaded.urls;
      }

      await createIncident({
        ...values,
        attachments: uploadedAttachmentUrls,
      });
      setError(null);
      setSuccessMessage("Incidente registrado exitosamente.");
      setIsRegisterDialogOpen(false);
      resetNewIncidentForm();
      fetchData();
    } catch (err: any) {
      console.error("Error creating incident:", err);
      setError(err.message || "Error al registrar el incidente.");
    }
  };

  const handleUpdateIncidentFormSubmitLogic = async (values: IncidentUpdateFormValues) => {
    if (!selectedIncident) return;

    try {
      let uploadedAttachmentUrls: string[] = [];
      if (values.attachments && values.attachments.length > 0) {
        const uploaded = await uploadIncidentAttachments(values.attachments);
        uploadedAttachmentUrls = uploaded.urls;
      }

      await updateIncident(selectedIncident.id, {
        content: values.content,
        status: values.status,
        attachments: uploadedAttachmentUrls,
      });
      setError(null);
      setSuccessMessage("Incidente actualizado exitosamente.");
      setIsUpdateDialogOpen(false);
      resetUpdateIncidentForm();
      fetchData();
    } catch (err: any) {
      console.error("Error updating incident:", err);
      setError(err.message || "Error al actualizar el incidente.");
    }
  };

  // Función para abrir el diálogo de actualización
  const handleOpenUpdateDialog = (incident: Incident) => {
    setSelectedIncident(incident);
    resetUpdateIncidentForm({
      content: "",
      status: incident.status,
      attachments: [],
    });
    setIsUpdateDialogOpen(true);
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const filteredIncidents = getFilteredIncidents();
  const reportedCount = incidents.filter(
    (inc) => inc.status === "reported",
  ).length;
  const inProgressCount = incidents.filter(
    (inc) => inc.status === "in_progress",
  ).length;
  const resolvedCount = incidents.filter(
    (inc) => inc.status === "resolved",
  ).length;
  const closedCount = incidents.filter((inc) => inc.status === "closed").length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Registro de Incidentes</h1>
          <p className="text-gray-500">
            Gestione y dé seguimiento a incidentes de seguridad y mantenimiento
          </p>
        </div>
        <Button
          className="mt-2 md:mt-0"
          onClick={() => setIsRegisterDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Nuevo Incidente
        </Button>
      </div>

      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Éxito</AlertTitle>
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-green-600"
            onClick={() => setSuccessMessage(null)}
          >
            Cerrar
          </Button>
        </Alert>
      )}

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Reportados</p>
              <h3 className="text-xl font-bold">{reportedCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">En proceso</p>
              <h3 className="text-xl font-bold">{inProgressCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Resueltos</p>
              <h3 className="text-xl font-bold">{resolvedCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <X className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cerrados</p>
              <h3 className="text-xl font-bold">{closedCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título, descripción, ubicación..."
              className="pl-10"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

            <div className="flex flex-wrap gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(
                    value as
                      | "reported"
                      | "in_progress"
                      | "resolved"
                      | "closed"
                      | "all",
                  )
                }
              >
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="reported">Reportados</SelectItem>
                  <SelectItem value="in_progress">En proceso</SelectItem>
                  <SelectItem value="resolved">Resueltos</SelectItem>
                  <SelectItem value="closed">Cerrados</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter}
                onValueChange={(value) =>
                  setCategoryFilter(
                    value as
                      | "security"
                      | "maintenance"
                      | "emergency"
                      | "other"
                      | "all",
                  )
                }
              >
                <SelectTrigger className="w-full md:w-36">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="security">Seguridad</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="emergency">Emergencia</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={(value) =>
                  setPriorityFilter(
                    value as "low" | "medium" | "high" | "critical" | "all",
                  )
                }
              >
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
        </CardContent>
      </Card>

      {/* Tabla de incidentes */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Reportado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">
                      {incident.title}
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(incident.category)}>
                        {getCategoryText(incident.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(incident.priority)}>
                        {getPriorityText(incident.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>{incident.location}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(incident.reportedAt)}</div>
                        <div className="text-gray-500">
                          {incident.reportedBy}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(incident.status)}>
                        {getStatusText(incident.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedIncident(incident)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Ver
                        </Button>
                        {incident.status !== "closed" && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleOpenUpdateDialog(incident)}
                          >
                            <PlusCircle className="mr-1 h-4 w-4" />
                            Actualizar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-gray-500"
                  >
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">
                      No se encontraron incidentes
                    </h3>
                    <p>
                      No hay incidentes que coincidan con los filtros
                      seleccionados
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detalle de incidente seleccionado */}
      {selectedIncident && (
        <Dialog
          open={!!selectedIncident}
          onOpenChange={(open) => !open && setSelectedIncident(null)}
        >
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <span className="mr-2">{selectedIncident.title}</span>
                <Badge className={getStatusColor(selectedIncident.status)}>
                  {getStatusText(selectedIncident.status)}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Detalles del incidente reportado el{" "}
                {formatDate(selectedIncident.reportedAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Información general */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Categoría
                  </h3>
                  <Badge
                    className={getCategoryColor(selectedIncident.category)}
                  >
                    {getCategoryText(selectedIncident.category)}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Prioridad
                  </h3>
                  <Badge
                    className={getPriorityColor(selectedIncident.priority)}
                  >
                    {getPriorityText(selectedIncident.priority)}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Ubicación
                  </h3>
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    {selectedIncident.location}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Reportado por
                  </h3>
                  <p className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-500" />
                    {selectedIncident.reportedBy}
                  </p>
                </div>

                {selectedIncident.assignedTo && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Asignado a
                    </h3>
                    <p className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-500" />
                      {selectedIncident.assignedTo}
                    </p>
                  </div>
                )}

                {selectedIncident.resolvedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Resuelto el
                    </h3>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {formatDate(selectedIncident.resolvedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Descripción
                </h3>
                <p className="bg-gray-50 p-3 rounded-md">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Archivos adjuntos */}
              {selectedIncident.attachments.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Archivos adjuntos
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="bg-gray-50 border rounded-md px-3 py-2 flex items-center text-sm"
                      >
                        <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                        <span className="truncate max-w-[150px]">
                          {attachment.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-6 w-6 p-0 text-gray-500"
                          onClick={() => window.open(attachment.url, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historial de actualizaciones */}
              {selectedIncident.updates.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Historial de actualizaciones
                  </h3>
                  <div className="space-y-4">
                    {selectedIncident.updates.map((update, index) => (
                      <div
                        key={update.id}
                        className="bg-gray-50 p-3 rounded-md"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{update.author}</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(update.timestamp)}
                          </span>
                        </div>
                        <p className="mb-2">{update.content}</p>

                        {update.attachments.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2">
                              {update.attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="bg-white border rounded-md px-2 py-1 flex items-center text-xs"
                                >
                                  <FileText className="h-3 w-3 mr-1 text-indigo-600" />
                                  <span className="truncate max-w-[100px]">
                                    {attachment.name}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-1 h-5 w-5 p-0 text-gray-500"
                                    onClick={() =>
                                      window.open(attachment.url, "_blank")
                                    }
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedIncident(null)}
              >
                Cerrar
              </Button>
              {selectedIncident.status !== "closed" && (
                <Button
                  onClick={() => {
                    setSelectedIncident(null);
                    handleOpenUpdateDialog(selectedIncident);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Actualizar
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo para registrar nuevo incidente */}
      <Dialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Incidente</DialogTitle>
            <DialogDescription>
              Complete la información para registrar un nuevo incidente
            </DialogDescription>
          </DialogHeader>

          <Form {...newIncidentForm}>
            <form onSubmit={handleNewIncidentSubmit(handleNewIncidentFormSubmitLogic)} className="space-y-4 py-4">
              <FormField
                control={newIncidentFormControl}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título breve y descriptivo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={newIncidentFormControl}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="security">Seguridad</SelectItem>
                          <SelectItem value="maintenance">Mantenimiento</SelectItem>
                          <SelectItem value="emergency">Emergencia</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newIncidentFormControl}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridad</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione prioridad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="medium">Media</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="critical">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={newIncidentFormControl}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Ubicación específica del incidente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newIncidentFormControl}
                name="reportedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reportado por</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de quien reporta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newIncidentFormControl}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descripción detallada del incidente" rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newIncidentFormControl}
                name="attachments"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Archivos adjuntos (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        multiple
                        onChange={(event) => {
                          onChange(Array.from(event.target.files || []));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {value && value.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {value.map((file, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 border rounded-md px-3 py-2 flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                              <span className="text-sm truncate max-w-[200px]">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-gray-500"
                              onClick={() => {
                                const newAttachments = value.filter((_: any, i: number) => i !== index);
                                onChange(newAttachments);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsRegisterDialogOpen(false)}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isNewIncidentSubmitting}>
                  {isNewIncidentSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  Registrar Incidente
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para actualizar incidente */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Actualizar Incidente</DialogTitle>
            <DialogDescription>
              Agregue una actualización al incidente seleccionado
            </DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <Form {...updateIncidentForm}>
              <form onSubmit={handleUpdateIncidentSubmit(handleUpdateIncidentFormSubmitLogic)} className="space-y-4 py-4">
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{selectedIncident.title}</h3>
                    <Badge
                      className={getCategoryColor(selectedIncident.category)}
                    >
                      {getCategoryText(selectedIncident.category)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    {selectedIncident.description.length > 100
                      ? `${selectedIncident.description.substring(0, 100)}...`
                      : selectedIncident.description}
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{selectedIncident.location}</span>
                    <span>{formatDate(selectedIncident.reportedAt)}</span>
                  </div>
                </div>

                <FormField
                  control={updateIncidentFormControl}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actualización</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describa la actualización o seguimiento del incidente" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateIncidentFormControl}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="reported">Reportado</SelectItem>
                          <SelectItem value="in_progress">En proceso</SelectItem>
                          <SelectItem value="resolved">Resuelto</SelectItem>
                          <SelectItem value="closed">Cerrado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateIncidentFormControl}
                  name="attachments"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Archivos adjuntos (Opcional)</FormLabel>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          multiple
                          onChange={(event) => {
                            onChange(Array.from(event.target.files || []));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      {value && value.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {value.map((file, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 border rounded-md px-3 py-2 flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                                <span className="text-sm truncate max-w-[200px]">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-500"
                                onClick={() => {
                                  const newAttachments = value.filter((_: any, i: number) => i !== index);
                                  onChange(newAttachments);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsUpdateDialogOpen(false)}
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isUpdateIncidentSubmitting}>
                    {isUpdateIncidentSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}{" "}
                    Guardar Actualización
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}