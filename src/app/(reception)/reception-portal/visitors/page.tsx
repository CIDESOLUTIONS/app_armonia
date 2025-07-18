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
import {
  UserPlus,
  LogOut,
  Search,
  Camera,
  IdCard,
  User,
  AlertCircle,
  CheckCircle,
  X,
  QrCode,
  Scan,
  Package,
  Truck,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import {
  getPreRegisteredVisitors,
  scanQrCode,
  registerPackage,
  deliverPackage,
} from "@/services/visitorService";

interface Visitor {
  id: string;
  name: string;
  documentType: "cc" | "ce" | "passport" | "other";
  documentNumber: string;
  destination: string; // e.g., "Apartamento 101", "Oficina 203"
  residentName?: string;
  entryTime: string;
  exitTime?: string;
  plate?: string;
  photoUrl?: string;
  status: "active" | "departed";
}

interface PreRegisteredVisitor {
  id: number;
  name: string;
  documentType?: string;
  documentNumber?: string;
  expectedDate: string;
  validFrom: string;
  validUntil: string;
  purpose?: string;
  accessCode: string;
  qrCodeUrl?: string;
  resident: {
    name: string;
    unit: string;
  };
}

export default function ReceptionVisitorsPage() {
  const { isLoggedIn, schemaName, _token } = useAuthStore();
  const _router = useRouter();
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [preRegisteredVisitors, setPreRegisteredVisitors] = useState<
    PreRegisteredVisitor[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "active" | "departed" | "all"
  >("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [newVisitorForm, setNewVisitorForm] = useState({
    name: "",
    documentType: "cc",
    documentNumber: "",
    destination: "",
    residentName: "",
    plate: "",
    photo: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [qrScanResult, setQrScanResult] = useState<any>(null);
  const [isPackageRegisterDialogOpen, setIsPackageRegisterDialogOpen] =
    useState(false);
  const [newPackageForm, setNewPackageForm] = useState({
    trackingNumber: "",
    recipientUnit: "",
    sender: "",
    description: "",
  });
  const [isPackageDeliverDialogOpen, setIsPackageDeliverDialogOpen] =
    useState(false);
  const [deliverPackageTrackingNumber, setDeliverPackageTrackingNumber] =
    useState("");

  // Datos de ejemplo para desarrollo y pruebas
  const mockVisitors: Visitor[] = useMemo(
    () => [
      {
        id: "vis1",
        name: "Carlos Ramírez",
        documentType: "cc",
        documentNumber: "123456789",
        destination: "Apartamento 502",
        residentName: "Ana López",
        entryTime: "2025-05-29T10:15:00",
        plate: "XYZ-123",
        photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        status: "active",
      },
      {
        id: "vis2",
        name: "María Fernández",
        documentType: "ce",
        documentNumber: "987654321",
        destination: "Oficina 301 (Administración)",
        entryTime: "2025-05-29T09:30:00",
        exitTime: "2025-05-29T11:00:00",
        status: "departed",
      },
      {
        id: "vis3",
        name: "Pedro Gómez",
        documentType: "cc",
        documentNumber: "112233445",
        destination: "Apartamento 101",
        residentName: "Luis Martínez",
        entryTime: "2025-05-29T11:45:00",
        status: "active",
      },
    ],
    [],
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // En un entorno real, esto sería una llamada a la API
      // const response = await fetch('/api/visitors');
      // const result = await response.json();
      // if (!response.ok) throw new Error(result.message || 'Error al cargar datos');
      // setVisitors(result.visitors);

      // Simulamos un retraso en la carga de datos
      setTimeout(() => {
        setVisitors(mockVisitors);
      }, 1000);

      const preRegistered = await getPreRegisteredVisitors();
      setPreRegisteredVisitors(preRegistered);
    } catch (err: any) {
      console.error("[ReceptionVisitors] Error:", err);
      setError(err.message || "Error al cargar datos de visitantes");
    } finally {
      setLoading(false);
    }
  }, [mockVisitors, setError, setVisitors, setPreRegisteredVisitors]);

  useEffect(() => {
    if (!isLoggedIn || !_token || !schemaName) {
      _router.push("/login");
      return;
    }

    fetchData();
  }, [isLoggedIn, _token, schemaName, _router, fetchData]);

  // Función para formatear fechas
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: es });
  };

  // Función para obtener el texto del tipo de documento
  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case "cc":
        return "Cédula de Ciudadanía";
      case "ce":
        return "Cédula de Extranjería";
      case "passport":
        return "Pasaporte";
      case "other":
        return "Otro";
      default:
        return "Desconocido";
    }
  };

  // Filtrar visitantes según los filtros aplicados
  const getFilteredVisitors = () => {
    if (!visitors) return [];

    let filtered = visitors;

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((visitor) => visitor.status === statusFilter);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (visitor) =>
          visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.documentNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          visitor.destination
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (visitor.residentName &&
            visitor.residentName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (visitor.plate &&
            visitor.plate.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    return filtered;
  };

  // Función para manejar cambios en el formulario de registro
  const handleNewVisitorFormChange = (field: string, value: unknown) => {
    setNewVisitorForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para manejar la captura de foto (simulada)
  const handleTakePhoto = () => {
    // En un entorno real, esto activaría la cámara
    alert("Funcionalidad de cámara no implementada en esta demo");
  };

  // Función para manejar la subida de foto
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleNewVisitorFormChange("photo", e.target.files[0]);
    }
  };

  // Función para registrar un nuevo visitante
  const handleSubmitNewVisitor = async () => {
    if (
      !newVisitorForm.name ||
      !newVisitorForm.documentNumber ||
      !newVisitorForm.destination
    ) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    setIsSubmitting(true);

    try {
      // En un entorno real, esto sería una llamada a la API
      // const formData = new FormData();
      // formData.append('name', newVisitorForm.name);
      // formData.append('documentType', newVisitorForm.documentType);
      // formData.append('documentNumber', newVisitorForm.documentNumber);
      // formData.append('destination', newVisitorForm.destination);
      // if (newVisitorForm.residentName) formData.append('residentName', newVisitorForm.residentName);
      // if (newVisitorForm.plate) formData.append('plate', newVisitorForm.plate);
      // if (newVisitorForm.photo) formData.append('photo', newVisitorForm.photo);

      // // Variable response eliminada por lint

      // if (!response.ok) {
      //   throw new Error('Error al registrar visitante');
      // }

      // Simulamos un retraso en el envío
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulamos una respuesta exitosa
      const newVisitor: Visitor = {
        id: `vis${Date.now()}`,
        name: newVisitorForm.name,
        documentType: newVisitorForm.documentType as Visitor["documentType"],
        documentNumber: newVisitorForm.documentNumber,
        destination: newVisitorForm.destination,
        residentName: newVisitorForm.residentName,
        entryTime: new Date().toISOString(),
        plate: newVisitorForm.plate,
        photoUrl: newVisitorForm.photo
          ? URL.createObjectURL(newVisitorForm.photo)
          : undefined,
        status: "active",
      };

      setVisitors((prev) => [newVisitor, ...prev]);
      setSuccessMessage("Visitante registrado exitosamente.");
      setIsRegisterDialogOpen(false);

      // Resetear formulario
      setNewVisitorForm({
        name: "",
        documentType: "cc",
        documentNumber: "",
        destination: "",
        residentName: "",
        plate: "",
        photo: null,
      });
    } catch (err) {
      console.error("[ReceptionVisitors] Error:", err);
      setError(
        "Error al registrar el visitante. Por favor, inténtelo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para registrar la salida de un visitante
  const handleRegisterExit = async (visitorId: string) => {
    if (
      !confirm(
        "¿Está seguro de que desea registrar la salida de este visitante?",
      )
    ) {
      return;
    }

    try {
      // En un entorno real, esto sería una llamada a la API
      // // Variable response eliminada por lint

      // if (!response.ok) {
      //   throw new Error('Error al registrar salida');
      // }

      // Simulamos un retraso
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Actualizamos el estado local
      setVisitors((prev) =>
        prev.map((vis) =>
          vis.id === visitorId
            ? { ...vis, status: "departed", exitTime: new Date().toISOString() }
            : vis,
        ),
      );

      setSuccessMessage("Salida registrada exitosamente.");
    } catch (err) {
      console.error("[ReceptionVisitors] Error:", err);
      setError("Error al registrar la salida. Por favor, inténtelo de nuevo.");
    }
  };

  const handleScanQrCode = async () => {
    if (!qrCodeInput) {
      setError("Por favor, introduce un código QR.");
      return;
    }
    setLoading(true);
    try {
      const result = await scanQrCode(qrCodeInput);
      if (result.success) {
        setQrScanResult(result.visitor);
        setSuccessMessage("QR Code escaneado con éxito.");
      } else {
        setError(result.message || "QR Code inválido.");
      }
    } catch (err: any) {
      setError(err.message || "Error al escanear el código QR.");
    } finally {
      setLoading(false);
    }
  };

  const handlePackageFormChange = (field: string, value: unknown) => {
    setNewPackageForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitNewPackage = async () => {
    if (!newPackageForm.trackingNumber || !newPackageForm.recipientUnit) {
      setError(
        "Número de seguimiento y unidad de destinatario son requeridos.",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await registerPackage(newPackageForm);
      setSuccessMessage("Paquete registrado exitosamente.");
      setIsPackageRegisterDialogOpen(false);
      setNewPackageForm({
        trackingNumber: "",
        recipientUnit: "",
        sender: "",
        description: "",
      });
    } catch (err: any) {
      setError(err.message || "Error al registrar el paquete.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeliverPackage = async () => {
    if (!deliverPackageTrackingNumber) {
      setError("El número de seguimiento es requerido para la entrega.");
      return;
    }
    setIsSubmitting(true);
    try {
      await deliverPackage(deliverPackageTrackingNumber);
      setSuccessMessage("Paquete entregado exitosamente.");
      setIsPackageDeliverDialogOpen(false);
      setDeliverPackageTrackingNumber("");
    } catch (err: any) {
      setError(err.message || "Error al entregar el paquete.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizado de estado de carga
  if (loading) {
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

  // Renderizado de estado de error
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const filteredVisitors = getFilteredVisitors();

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Registro de Visitantes</h1>
          <p className="text-gray-500">
            Gestione el ingreso y salida de visitantes
          </p>
        </div>
        <Button
          className="mt-2 md:mt-0"
          onClick={() => setIsRegisterDialogOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Registrar Nuevo Visitante
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

      {/* Sección de Visitantes Pre-registrados */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Visitantes Pre-registrados</CardTitle>
          <CardDescription>
            Visitantes que han sido pre-autorizados por los residentes.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 border-b flex items-center space-x-2">
            <Input
              placeholder="Escanear o introducir código QR"
              value={qrCodeInput}
              onChange={(e) => setQrCodeInput(e.target.value)}
            />
            <Button
              onClick={handleScanQrCode}
              disabled={!qrCodeInput || loading}
            >
              <Scan className="mr-2 h-4 w-4" /> Escanear QR
            </Button>
          </div>
          {qrScanResult && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800">
              <p className="font-bold">Resultado del Escaneo:</p>
              <p>Nombre: {qrScanResult.name}</p>
              <p>Documento: {qrScanResult.documentNumber}</p>
              <p>Destino: {qrScanResult.destination}</p>
              {qrScanResult.status && <p>Estado: {qrScanResult.status}</p>}
            </div>
          )}
          {preRegisteredVisitors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Residente</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Fecha Esperada</TableHead>
                  <TableHead>Válido Hasta</TableHead>
                  <TableHead>Propósito</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preRegisteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">
                      {visitor.name}
                    </TableCell>
                    <TableCell>{visitor.documentNumber}</TableCell>
                    <TableCell>{visitor.resident.name}</TableCell>
                    <TableCell>{visitor.resident.unit}</TableCell>
                    <TableCell>{formatDate(visitor.expectedDate)}</TableCell>
                    <TableCell>{formatDate(visitor.validUntil)}</TableCell>
                    <TableCell>{visitor.purpose || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <QrCode className="mr-2 h-4 w-4" />
                        Escanear QR
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <IdCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">
                No hay visitantes pre-registrados
              </h3>
              <p>
                Los residentes pueden pre-registrar visitantes desde su portal.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección de Gestión de Paquetería */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gestión de Paquetería</CardTitle>
          <CardDescription>
            Registre la entrada y salida de paquetes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registrar Paquete */}
            <Card className="border-dashed border-2 p-4">
              <CardTitle className="text-lg mb-4 flex items-center">
                <Package className="mr-2 h-5 w-5" /> Registrar Paquete
              </CardTitle>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">Número de Seguimiento</Label>
                  <Input
                    id="trackingNumber"
                    placeholder="Ej: ABC123XYZ"
                    value={newPackageForm.trackingNumber}
                    onChange={(e) =>
                      handlePackageFormChange("trackingNumber", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientUnit">Unidad Destinataria</Label>
                  <Input
                    id="recipientUnit"
                    placeholder="Ej: Apto 101"
                    value={newPackageForm.recipientUnit}
                    onChange={(e) =>
                      handlePackageFormChange("recipientUnit", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender">Remitente (Opcional)</Label>
                  <Input
                    id="sender"
                    placeholder="Nombre del remitente"
                    value={newPackageForm.sender}
                    onChange={(e) =>
                      handlePackageFormChange("sender", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción (Opcional)</Label>
                  <Input
                    id="description"
                    placeholder="Contenido del paquete"
                    value={newPackageForm.description}
                    onChange={(e) =>
                      handlePackageFormChange("description", e.target.value)
                    }
                  />
                </div>
                <Button
                  onClick={handleSubmitNewPackage}
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Registrar Paquete
                </Button>
              </div>
            </Card>

            {/* Entregar Paquete */}
            <Card className="border-dashed border-2 p-4">
              <CardTitle className="text-lg mb-4 flex items-center">
                <Truck className="mr-2 h-5 w-5" /> Entregar Paquete
              </CardTitle>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deliverTrackingNumber">
                    Número de Seguimiento
                  </Label>
                  <Input
                    id="deliverTrackingNumber"
                    placeholder="Número de seguimiento del paquete a entregar"
                    value={deliverPackageTrackingNumber}
                    onChange={(e) =>
                      setDeliverPackageTrackingNumber(e.target.value)
                    }
                  />
                </div>
                <Button onClick={handleDeliverPackage} disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Marcar como Entregado
                </Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, documento, destino, residente o placa..."
              className="pl-10"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as Visitor["status"] | "all")
            }
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="departed">Salieron</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tabla de visitantes */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Residente</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Hora Entrada</TableHead>
                <TableHead>Hora Salida</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisitors.length > 0 ? (
                filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>
                      {visitor.photoUrl ? (
                        <Image
                          src={visitor.photoUrl}
                          alt={visitor.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {visitor.name}
                    </TableCell>
                    <TableCell>
                      <span className="block text-sm">
                        {getDocumentTypeText(visitor.documentType)}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {visitor.documentNumber}
                      </span>
                    </TableCell>
                    <TableCell>{visitor.destination}</TableCell>
                    <TableCell>{visitor.residentName || "N/A"}</TableCell>
                    <TableCell>{visitor.plate || "N/A"}</TableCell>
                    <TableCell>{formatDate(visitor.entryTime)}</TableCell>
                    <TableCell>{formatDate(visitor.exitTime)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          visitor.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {visitor.status === "active" ? "Activo" : "Salió"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {visitor.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegisterExit(visitor.id)}
                        >
                          <LogOut className="mr-1 h-4 w-4" />
                          Registrar Salida
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-12 text-gray-500"
                  >
                    <IdCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">
                      No se encontraron visitantes
                    </h3>
                    <p>
                      No hay visitantes que coincidan con los filtros
                      seleccionados
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo para registrar nuevo visitante */}
      <Dialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Visitante</DialogTitle>
            <DialogDescription>
              Complete la información del visitante para registrar su ingreso
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                placeholder="Nombre completo del visitante"
                value={newVisitorForm.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleNewVisitorFormChange("name", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select
                  value={newVisitorForm.documentType}
                  onValueChange={(value) =>
                    handleNewVisitorFormChange("documentType", value)
                  }
                >
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                    <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                    <SelectItem value="passport">Pasaporte</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentNumber">Número de Documento</Label>
                <Input
                  id="documentNumber"
                  placeholder="Número de identificación"
                  value={newVisitorForm.documentNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleNewVisitorFormChange("documentNumber", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  placeholder="Ej: Apto 101, Oficina 203"
                  value={newVisitorForm.destination}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleNewVisitorFormChange("destination", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="residentName">
                  Residente que autoriza (Opcional)
                </Label>
                <Input
                  id="residentName"
                  placeholder="Nombre del residente"
                  value={newVisitorForm.residentName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleNewVisitorFormChange("residentName", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plate">Placa del Vehículo (Opcional)</Label>
              <Input
                id="plate"
                placeholder="Placa del vehículo si aplica"
                value={newVisitorForm.plate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleNewVisitorFormChange("plate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Foto del Visitante (Opcional)</Label>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={handleTakePhoto}>
                  <Camera className="mr-2 h-4 w-4" />
                  Tomar Foto
                </Button>
                <div className="text-sm text-gray-500">o</div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="photo-upload">
                  <Button
                    variant="outline"
                    type="button"
                    className="cursor-pointer"
                  >
                    Subir Foto
                  </Button>
                </label>
              </div>
              {newVisitorForm.photo && (
                <div className="mt-2 flex items-center bg-gray-50 p-2 rounded-md">
                  <Image
                    src={URL.createObjectURL(newVisitorForm.photo)}
                    alt="Preview"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-md object-cover mr-3"
                  />
                  <span className="text-sm truncate flex-grow">
                    {newVisitorForm.photo.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-500"
                    onClick={() => handleNewVisitorFormChange("photo", null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRegisterDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitNewVisitor}
              disabled={
                isSubmitting ||
                !newVisitorForm.name ||
                !newVisitorForm.documentNumber ||
                !newVisitorForm.destination
              }
            >
              {isSubmitting ? "Registrando..." : "Registrar Ingreso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para registrar nuevo paquete */}
      <Dialog
        open={isPackageRegisterDialogOpen}
        onOpenChange={setIsPackageRegisterDialogOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Paquete</DialogTitle>
            <DialogDescription>
              Complete la información del paquete para registrar su ingreso.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="packageTrackingNumber">
                Número de Seguimiento
              </Label>
              <Input
                id="packageTrackingNumber"
                placeholder="Ej: ABC123XYZ"
                value={newPackageForm.trackingNumber}
                onChange={(e) =>
                  setNewPackageForm({
                    ...newPackageForm,
                    trackingNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packageRecipientUnit">Unidad Destinataria</Label>
              <Input
                id="packageRecipientUnit"
                placeholder="Ej: Apto 101"
                value={newPackageForm.recipientUnit}
                onChange={(e) =>
                  setNewPackageForm({
                    ...newPackageForm,
                    recipientUnit: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packageSender">Remitente (Opcional)</Label>
              <Input
                id="packageSender"
                placeholder="Nombre del remitente"
                value={newPackageForm.sender}
                onChange={(e) =>
                  setNewPackageForm({
                    ...newPackageForm,
                    sender: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packageDescription">Descripción (Opcional)</Label>
              <Input
                id="packageDescription"
                placeholder="Contenido del paquete"
                value={newPackageForm.description}
                onChange={(e) =>
                  setNewPackageForm({
                    ...newPackageForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPackageRegisterDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitNewPackage}
              disabled={
                isSubmitting ||
                !newPackageForm.trackingNumber ||
                !newPackageForm.recipientUnit
              }
            >
              {isSubmitting ? "Registrando..." : "Registrar Paquete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para entregar paquete */}
      <Dialog
        open={isPackageDeliverDialogOpen}
        onOpenChange={setIsPackageDeliverDialogOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Entregar Paquete</DialogTitle>
            <DialogDescription>
              Introduce el número de seguimiento del paquete a entregar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deliverPackageTrackingNumber">
                Número de Seguimiento
              </Label>
              <Input
                id="deliverPackageTrackingNumber"
                placeholder="Número de seguimiento"
                value={deliverPackageTrackingNumber}
                onChange={(e) =>
                  setDeliverPackageTrackingNumber(e.target.value)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPackageDeliverDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeliverPackage}
              disabled={isSubmitting || !deliverPackageTrackingNumber}
            >
              {isSubmitting ? "Entregando..." : "Marcar como Entregado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
