"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "@/services/vehicleService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema, VehicleFormValues } from "@/validators/vehicle-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface Vehicle {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  type: string;
  parkingSpot?: string;
  notes?: string;
  propertyId: number;
  residentId: number;
  isActive: boolean;
}

import { getProperties } from "@/services/propertyService";
import { getResidents } from "@/services/residentService";

interface PropertyOption {
  id: number;
  unitNumber: string;
}

interface ResidentOption {
  id: number;
  name: string;
}

export default function VehiclesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [residents, setResidents] = useState<ResidentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      licensePlate: "",
      brand: "",
      model: "",
      year: 2020,
      color: "",
      type: "CAR",
      parkingSpace: undefined,
      notes: undefined,
      propertyId: 0,
      residentId: 0,
      isActive: true,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchVehiclesAndRelatedData = useCallback(async () => {
    setLoading(true);
    try {
      const [vehiclesData, propertiesData, residentsData] = await Promise.all([
        getVehicles(),
        getProperties(),
        getResidents(),
      ]);
      setVehicles(vehiclesData);
      setProperties(propertiesData.map((p: any) => ({ id: p.id, unitNumber: p.unitNumber })));
      setResidents(residentsData.map((r: any) => ({ id: r.id, name: r.name })));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchVehiclesAndRelatedData();
    }
  }, [authLoading, user, fetchVehiclesAndRelatedData]);

  const handleAddVehicle = () => {
    setCurrentVehicle(null);
    reset({
      licensePlate: "",
      brand: "",
      model: "",
      year: 2020,
      color: "",
      type: "CAR",
      parkingSpace: undefined,
      notes: undefined,
      propertyId: 0,
      residentId: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    reset({
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      type: vehicle.type,
      parkingSpace: vehicle.parkingSpace,
      notes: vehicle.notes,
      propertyId: vehicle.propertyId,
      residentId: vehicle.residentId,
      isActive: vehicle.isActive,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      if (currentVehicle) {
        await updateVehicle(currentVehicle.id, data);
        toast({
          title: "Éxito",
          description: "Vehículo actualizado correctamente.",
        });
      } else {
        await createVehicle(data);
        toast({
          title: "Éxito",
          description: "Vehículo creado correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast({
        title: "Error",
        description: "Error al guardar el vehículo.",
        variant: "destructive",
      });
    }
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);

  const handleDeleteVehicle = (id: number) => {
    setVehicleToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteVehicle = async () => {
    if (vehicleToDelete === null) return;
    try {
      await deleteVehicle(vehicleToDelete);
      toast({
        title: "Éxito",
        description: "Vehículo eliminado correctamente.",
      });
      fetchVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el vehículo.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setVehicleToDelete(null);
    }
  };

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Gestión de Vehículos
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddVehicle}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Vehículo
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Parqueadero</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.licensePlate}</TableCell>
                <TableCell>{vehicle.brand}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.color}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{vehicle.parkingSpace}</TableCell>
                <TableCell>
                  {vehicle.isActive ? (
                    <Badge variant="default">Sí</Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditVehicle(vehicle)}
                    className="mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentVehicle ? "Editar Vehículo" : "Añadir Nuevo Vehículo"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Placa</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="brand"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Marca</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="model"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Modelo</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="color"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Color</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="year"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Año</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="col-span-3"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 p-2 border rounded-md">
                          <SelectValue placeholder="Seleccionar Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CAR">Coche</SelectItem>
                        <SelectItem value="MOTORCYCLE">Motocicleta</SelectItem>
                        <SelectItem value="BICYCLE">Bicicleta</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Notas</FormLabel>
                    <FormControl>
                      <Textarea className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Propiedad</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 p-2 border rounded-md">
                          <SelectValue placeholder="Seleccionar Propiedad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem
                            key={property.id}
                            value={String(property.id)}
                          >
                            {property.unitNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="residentId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Residente</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 p-2 border rounded-md">
                          <SelectValue placeholder="Seleccionar Residente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {residents.map((resident) => (
                          <SelectItem
                            key={resident.id}
                            value={String(resident.id)}
                          >
                            {resident.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="parkingSpace"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Parqueadero</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Activo</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  {currentVehicle ? "Guardar Cambios" : "Añadir Vehículo"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar este vehículo? Esta acción
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteVehicle}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
