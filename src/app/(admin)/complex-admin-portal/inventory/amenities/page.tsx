"use client";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  getAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} from "@/services/amenityService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { amenitySchema, AmenityFormValues } from "@/validators/amenity-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface Amenity {
  id: number;
  name: string;
  description?: string;
  location: string;
  capacity: number;
  requiresApproval: boolean;
  hasFee: boolean;
  feeAmount?: number;
  isActive: boolean;
}

export default function AmenitiesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAmenity, setCurrentAmenity] = useState<Amenity | null>(null);

  const form = useForm<AmenityFormValues>({
    resolver: zodResolver(amenitySchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      capacity: 0,
      requiresApproval: false,
      hasFee: false,
      feeAmount: 0,
      isActive: true,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting },
  } = form;
  const hasFee = watch("hasFee");

  const fetchAmenities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAmenities();
      setAmenities(data);
    } catch (error) {
      console.error("Error fetching amenities:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las amenidades.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAmenities();
    }
  }, [authLoading, user, fetchAmenities]);

  const handleAddAmenity = () => {
    setCurrentAmenity(null);
    reset({
      name: "",
      description: "",
      location: "",
      capacity: 0,
      requiresApproval: false,
      hasFee: false,
      feeAmount: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditAmenity = (amenity: Amenity) => {
    setCurrentAmenity(amenity);
    reset({
      name: amenity.name,
      description: amenity.description || "",
      location: amenity.location,
      capacity: amenity.capacity,
      requiresApproval: amenity.requiresApproval,
      hasFee: amenity.hasFee,
      feeAmount: amenity.feeAmount || 0,
      isActive: amenity.isActive,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: AmenityFormValues) => {
    try {
      if (currentAmenity) {
        await updateAmenity(currentAmenity.id, data);
        toast({
          title: "Éxito",
          description: "Amenidad actualizada correctamente.",
        });
      } else {
        await createAmenity(data);
        toast({
          title: "Éxito",
          description: "Amenidad creada correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchAmenities();
    } catch (error) {
      console.error("Error saving amenity:", error);
      toast({
        title: "Error",
        description: "Error al guardar la amenidad.",
        variant: "destructive",
      });
    }
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState<number | null>(null);

  const handleDeleteAmenity = (id: number) => {
    setAmenityToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAmenity = async () => {
    if (amenityToDelete === null) return;
    try {
      await deleteAmenity(amenityToDelete);
      toast({
        title: "Éxito",
        description: "Amenidad eliminada correctamente.",
      });
      fetchAmenities();
    } catch (error) {
      console.error("Error deleting amenity:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la amenidad.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setAmenityToDelete(null);
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
        Gestión de Amenidades
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddAmenity}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Amenidad
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Requiere Aprobación</TableHead>
              <TableHead>Tiene Costo</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Activa</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amenities.map((amenity) => (
              <TableRow key={amenity.id}>
                <TableCell>{amenity.name}</TableCell>
                <TableCell>{amenity.description}</TableCell>
                <TableCell>{amenity.location}</TableCell>
                <TableCell>{amenity.capacity}</TableCell>
                <TableCell>
                  {amenity.requiresApproval ? (
                    <Badge variant="default">Sí</Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {amenity.hasFee ? (
                    <Badge variant="default">Sí</Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )}
                </TableCell>
                <TableCell>{amenity.feeAmount}</TableCell>
                <TableCell>
                  {amenity.isActive ? (
                    <Badge variant="default">Sí</Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAmenity(amenity)}
                    className="mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAmenity(amenity.id)}
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
              {currentAmenity ? "Editar Amenidad" : "Añadir Nueva Amenidad"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Nombre</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Descripción</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="location"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Ubicación</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="capacity"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Capacidad</FormLabel>
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
                name="requiresApproval"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Requiere Aprobación</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="hasFee"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Tiene Costo</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {hasFee && (
                <FormField
                  control={control}
                  name="feeAmount"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Costo</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="col-span-3"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage className="col-span-full text-right" />
                    </FormItem>
                  )}
                />
              )}
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
                      <FormLabel>Activa</FormLabel>
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
                  {currentAmenity ? "Guardar Cambios" : "Añadir Amenidad"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta amenidad? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button onClick={confirmDeleteAmenity}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
