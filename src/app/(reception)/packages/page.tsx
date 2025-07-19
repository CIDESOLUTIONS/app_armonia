"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent } from "@/components/ui/card";
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
  Package as PackageIcon,
  Truck,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { packageSchema, PackageFormValues } from "@/validators/package-schema";
import { registerPackage, deliverPackage, getPackages, Package } from "@/services/visitorService"; // Reusing visitorService for package functions

export default function PackagesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isDeliverDialogOpen, setIsDeliverDialogOpen] = useState(false);
  const [deliverTrackingNumber, setDeliverTrackingNumber] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "REGISTERED" | "DELIVERED" | "RETURNED" | "all"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const newPackageForm = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      trackingNumber: "",
      recipientUnit: "",
      sender: "",
      description: "",
    },
  });

  const {
    handleSubmit: handleNewPackageSubmit,
    control: newPackageFormControl,
    reset: resetNewPackageForm,
    formState: { isSubmitting: isNewPackageSubmitting },
  } = newPackageForm;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPackages = await getPackages();
      setPackages(fetchedPackages);
    } catch (err: any) {
      console.error("[PackagesPage] Error:", err);
      setError(err.message || "Error al cargar datos de paquetes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  const handleSubmitNewPackage = async (values: PackageFormValues) => {
    try {
      await registerPackage(values);
      setSuccessMessage("Paquete registrado exitosamente.");
      setIsRegisterDialogOpen(false);
      resetNewPackageForm();
      fetchData();
    } catch (err: any) {
      setError(err.message || "Error al registrar el paquete.");
    }
  };

  const handleDeliverPackage = async () => {
    if (!deliverTrackingNumber) {
      setError("El número de seguimiento es requerido para la entrega.");
      return;
    }
    try {
      await deliverPackage(parseInt(deliverTrackingNumber));
      setSuccessMessage("Paquete entregado exitosamente.");
      setIsDeliverDialogOpen(false);
      setDeliverTrackingNumber("");
      fetchData();
    } catch (err: any) {
      setError(err.message || "Error al entregar el paquete.");
    }
  };

  const getFilteredPackages = () => {
    if (!packages) return [];

    let filtered = packages;

    if (statusFilter !== "all") {
      filtered = filtered.filter((pkg) => pkg.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.recipientUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pkg.sender && pkg.sender.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    return filtered;
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

  const filteredPackages = getFilteredPackages();

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Paquetería</h1>
          <p className="text-gray-500">
            Registre la entrada y salida de paquetes.
          </p>
        </div>
        <div className="flex space-x-2 mt-2 md:mt-0">
          <Button onClick={() => setIsRegisterDialogOpen(true)}>
            <PackageIcon className="mr-2 h-4 w-4" />
            Registrar Paquete
          </Button>
          <Button onClick={() => setIsDeliverDialogOpen(true)} variant="outline">
            <Truck className="mr-2 h-4 w-4" />
            Entregar Paquete
          </Button>
        </div>
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

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por número de seguimiento, unidad, remitente..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as "REGISTERED" | "DELIVERED" | "RETURNED" | "all")
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
                    <TableCell>{format(new Date(pkg.registrationDate), "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell>{pkg.deliveryDate ? format(new Date(pkg.deliveryDate), "dd/MM/yyyy HH:mm") : "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          pkg.status === "DELIVERED"
                            ? "default"
                            : pkg.status === "REGISTERED"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {pkg.status === "REGISTERED" ? "Registrado" : pkg.status === "DELIVERED" ? "Entregado" : "Devuelto"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {pkg.status === "REGISTERED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeliverPackage(pkg.id)}
                        >
                          <Truck className="mr-1 h-4 w-4" />
                          Marcar Entregado
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-5">
                    No se encontraron paquetes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogo para registrar nuevo paquete */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Paquete</DialogTitle>
            <DialogDescription>
              Complete la información del paquete para registrar su ingreso.
            </DialogDescription>
          </DialogHeader>
          <Form {...newPackageForm}>
            <form onSubmit={handleNewPackageSubmit(handleSubmitNewPackage)} className="space-y-4 py-4">
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
                      <Input placeholder="Nombre del remitente" {...field} />
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
                      <Input placeholder="Contenido del paquete" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isNewPackageSubmitting}>
                {isNewPackageSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}{" "}
                Registrar Paquete
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialogo para entregar paquete */}
      <Dialog open={isDeliverDialogOpen} onOpenChange={setIsDeliverDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Entregar Paquete</DialogTitle>
            <DialogDescription>
              Introduce el número de seguimiento del paquete a entregar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deliverTrackingNumber">
                Número de Seguimiento
              </Label>
              <Input
                id="deliverTrackingNumber"
                placeholder="Número de seguimiento del paquete a entregar"
                value={deliverTrackingNumber}
                onChange={(e) => setDeliverTrackingNumber(e.target.value)}
              />
            </div>
            <Button onClick={handleDeliverPackage} disabled={isNewPackageSubmitting || !deliverTrackingNumber}>
              {isNewPackageSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}{" "}
              Marcar como Entregado
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}