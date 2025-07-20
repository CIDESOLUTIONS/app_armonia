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
  Package as PackageIcon,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import {
  getPreRegisteredVisitors,
  scanQrCode,
  createPreRegisteredVisitor,
  uploadVisitorImage,
} from "@/services/visitorService";
import {
  registerPackage,
  getPackages,
  Package,
  uploadPackageImage,
} from "@/services/packageService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { visitorSchema, VisitorFormValues } from "@/validators/visitor-schema";
import { packageSchema, PackageFormValues } from "@/validators/package-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Visitor {
  id: string;
  name: string;
  documentType: "cc" | "ce" | "passport" | "other";
  documentNumber: string;
  destination: string; // e.g., "Apartamento 101", "Oficina 203"
  residentName?: string;
  entryTime: string;
  exitTime: string | null;
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
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [preRegisteredVisitors, setPreRegisteredVisitors] = useState<
    PreRegisteredVisitor[]
  >([]);
  const [packages, setPackages] = useState<Package[]>([]); // New state for packages
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "active" | "departed" | "all"
  >("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [qrScanResult, setQrScanResult] = useState<any>(null);
  const [isPackageRegisterDialogOpen, setIsPackageRegisterDialogOpen] =
    useState(false);
  const [packageStatusFilter, setPackageStatusFilter] = useState<
    "REGISTERED" | "DELIVERED" | "RETURNED" | "all"
  >("all");
  const [packageSearchTerm, setPackageSearchTerm] = useState("");

  const newVisitorForm = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      name: "",
      documentType: "cc",
      documentNumber: "",
      unitId: 0, // This will be set dynamically or selected
      entryTime: new Date().toISOString().slice(0, 16),
      exitTime: "",
      purpose: "",
      photoUrl: "",
    },
  });

  const {
    handleSubmit: handleNewVisitorSubmit,
    control: newVisitorFormControl,
    reset: resetNewVisitorForm,
    formState: { isSubmitting: isNewVisitorSubmitting },
  } = newVisitorForm;

  const newPackageForm = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      trackingNumber: "",
      recipientUnit: "",
      sender: "",
      description: "",
      photoUrl: "",
    },
  });

  const {
    handleSubmit: handleNewPackageSubmit,
    control: newPackageFormControl,
    reset: resetNewPackageForm,
    formState: { isSubmitting: isNewPackageSubmitting },
  } = newPackageForm;

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

      const fetchedPackages = await getPackages(); // Fetch packages
      setPackages(fetchedPackages);
    } catch (error: Error) {
      console.error("[ReceptionVisitors] Error:", error);
      setError(error.message || "Error al cargar datos de visitantes");
    } finally {
      setLoading(false);
    }
  }, [
    mockVisitors,
    setError,
    setVisitors,
    setPreRegisteredVisitors,
    getPackages,
  ]);

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

  // Filtrar paquetes según los filtros aplicados
  const getFilteredPackages = () => {
    if (!packages) return [];

    let filtered = packages;

    // Filtrar por estado
    if (packageStatusFilter !== "all") {
      filtered = filtered.filter((pkg) => pkg.status === packageStatusFilter);
    }

    // Filtrar por término de búsqueda
    if (packageSearchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.trackingNumber
            .toLowerCase()
            .includes(packageSearchTerm.toLowerCase()) ||
          pkg.recipientUnit
            .toLowerCase()
            .includes(packageSearchTerm.toLowerCase()) ||
          (pkg.sender &&
            pkg.sender
              .toLowerCase()
              .includes(packageSearchTerm.toLowerCase())) ||
          (pkg.description &&
            pkg.description
              .toLowerCase()
              .includes(packageSearchTerm.toLowerCase())),
      );
    }

    return filtered;
  };

  // Función para registrar un nuevo visitante
  const handleNewVisitorFormSubmitLogic = async (values: VisitorFormValues) => {
    if (!user?.complexId) {
      setError("Información del complejo incompleta.");
      return;
    }

    let photoUrl: string | undefined;
    if (values.photoUrl instanceof File) {
      try {
        const uploadedImage = await uploadVisitorImage(values.photoUrl);
        photoUrl = uploadedImage.url;
      } catch (error: Error) {
        console.error("Error uploading visitor image:", error);
        setError("Error al subir la foto del visitante: " + error.message);
        return;
      }
    }

    try {
      // Aquí se debería llamar a la API real para registrar el visitante
      // Por ahora, simulamos la creación y añadimos al estado local
      const newVisitor: Visitor = {
        id: `vis${Date.now()}`,
        name: values.name,
        documentType: values.documentType as Visitor["documentType"],
        documentNumber: values.documentNumber,
        destination: `Unidad ${values.unitId}`, // Asumiendo que unitId se mapea a destino
        entryTime: values.entryTime,
        exitTime: null,
        purpose: values.purpose,
        photoUrl: photoUrl,
        status: "active",
      };

      // En un entorno real, la API devolvería el objeto de visitante creado
      // await createPreRegisteredVisitor({ ...values, photoUrl }); // Si se usa la misma API

      setVisitors((prev) => [newVisitor, ...prev]);
      setSuccessMessage("Visitante registrado exitosamente.");
      setIsRegisterDialogOpen(false);
      resetNewVisitorForm();
    } catch (error: Error) {
      console.error("[ReceptionVisitors] Error:", error);
      setError(
        "Error al registrar el visitante. Por favor, inténtelo de nuevo: " +
          error.message,
      );
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
      // await updateVisitorStatus(visitorId, "departed");

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
    } catch (error: Error) {
      console.error("[ReceptionVisitors] Error:", error);
      setError(
        "Error al registrar la salida. Por favor, inténtelo de nuevo: " +
          error.message,
      );
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
    } catch (error: Error) {
      setError(error.message || "Error al escanear el código QR.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNewPackage = async (values: PackageFormValues) => {
    let photoUrl: string | undefined;
    if (values.photoUrl instanceof File) {
      try {
        const uploadedImage = await uploadPackageImage(values.photoUrl);
        photoUrl = uploadedImage.url;
      } catch (error: Error) {
        console.error("Error uploading package image:", error);
        setError("Error al subir la foto del paquete: " + error.message);
        return;
      }
    }

    try {
      await registerPackage({ ...values, photoUrl });
      setSuccessMessage("Paquete registrado exitosamente.");
      setIsPackageRegisterDialogOpen(false);
      resetNewPackageForm();
      fetchData(); // Refresh packages list
    } catch (error: Error) {
      setError(error.message || "Error al registrar el paquete.");
    }
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

  const filteredVisitors = getFilteredVisitors();
  const filteredPackages = getFilteredPackages();

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
          <div className="grid grid-cols-1 gap-4">
            {/* Registrar Paquete */}
            <Card className="border-dashed border-2 p-4">
              <CardTitle className="text-lg mb-4 flex items-center">
                <PackageIcon className="mr-2 h-5 w-5" /> Registrar Paquete
              </CardTitle>
              <Form {...newPackageForm}>
                <form
                  onSubmit={handleNewPackageSubmit(handleSubmitNewPackage)}
                  className="space-y-4"
                >
                  <FormField
                    control={newPackageFormControl}
                    name="trackingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Seguimiento</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: ABC123XYZ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={newPackageFormControl}
                    name="recipientUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidad Destinataria</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Apto 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={newPackageFormControl}
                    name="sender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remitente (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre del remitente"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={newPackageFormControl}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contenido del paquete"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={newPackageFormControl}
                    name="photoUrl"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Foto del Paquete (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              onChange(
                                event.target.files && event.target.files[0],
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        {value instanceof File && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(value)}
                              alt="Vista previa de la foto"
                              className="w-32 h-32 object-cover rounded-md"
                            />
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isNewPackageSubmitting}>
                    {isNewPackageSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Registrar Paquete
                  </Button>
                </form>
              </Form>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Filtros y búsqueda de Paquetes */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por número de seguimiento, unidad, remitente..."
              className="pl-10"
              value={packageSearchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPackageSearchTerm(e.target.value)
              }
            />
          </div>
          <Select
            value={packageStatusFilter}
            onValueChange={(value) =>
              setPackageStatusFilter(
                value as "REGISTERED" | "DELIVERED" | "RETURNED" | "all",
              )
            }
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="REGISTERED">Registrados</SelectItem>
              <SelectItem value="DELIVERED">Entregados</SelectItem>
              <SelectItem value="RETURNED">Devueltos</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tabla de Paquetes */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Seguimiento</TableHead>
                <TableHead>Unidad Destinataria</TableHead>
                <TableHead>Remitente</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead>Fecha Entrega</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">
                      {pkg.trackingNumber}
                    </TableCell>
                    <TableCell>{pkg.recipientUnit}</TableCell>
                    <TableCell>{pkg.sender || "N/A"}</TableCell>
                    <TableCell>{pkg.description || "N/A"}</TableCell>
                    <TableCell>{formatDate(pkg.registrationDate)}</TableCell>
                    <TableCell>
                      {pkg.deliveryDate ? formatDate(pkg.deliveryDate) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          pkg.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : pkg.status === "REGISTERED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {pkg.status === "REGISTERED"
                          ? "Registrado"
                          : pkg.status === "DELIVERED"
                            ? "Entregado"
                            : "Devuelto"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Removed deliver package button from here */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-gray-500"
                  >
                    <PackageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">
                      No se encontraron paquetes
                    </h3>
                    <p>
                      No hay paquetes que coincidan con los filtros
                      seleccionados
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filtros y búsqueda de Visitantes */}
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
              <SelectItem value="departed">Salió</SelectItem>
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
          <Form {...newVisitorForm}>
            <form
              onSubmit={handleNewVisitorSubmit(handleNewVisitorFormSubmitLogic)}
              className="space-y-4 py-4"
            >
              <FormField
                control={newVisitorFormControl}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre completo del visitante"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={newVisitorFormControl}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cc">
                            Cédula de Ciudadanía
                          </SelectItem>
                          <SelectItem value="ce">
                            Cédula de Extranjería
                          </SelectItem>
                          <SelectItem value="passport">Pasaporte</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newVisitorFormControl}
                  name="documentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Documento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Número de identificación"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={newVisitorFormControl}
                name="unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad Destino</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 101"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newVisitorFormControl}
                name="entryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Entrada</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newVisitorFormControl}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Propósito de la Visita (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Visita familiar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newVisitorFormControl}
                name="photoUrl"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Foto del Visitante (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          onChange(event.target.files && event.target.files[0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {value instanceof File && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(value)}
                          alt="Vista previa de la foto"
                          className="w-32 h-32 object-cover rounded-md"
                        />
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
                <Button type="submit" disabled={isNewVisitorSubmitting}>
                  {isNewVisitorSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  Registrar Ingreso
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
