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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
  getResidents,
  createResident,
  updateResident,
  deleteResident,
} from "@/services/residentService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  residentSchema,
  ResidentFormValues,
} from "@/validators/resident-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface Resident {
  id: number;
  name: string;
  email: string;
  phone: string;
  propertyId: number;
  unitNumber: string; // Para mostrar en la tabla
  role: string;
  isActive: boolean;
}

export default function ResidentsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResident, setCurrentResident] = useState<Resident | null>(null);

  const form = useForm<ResidentFormValues>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      propertyId: 0,
      role: "RESIDENT", // Default role
      isActive: true,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchResidents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResidents();
      setResidents(data);
    } catch (error) {
      console.error("Error fetching residents:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los residentes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchResidents();
    }
  }, [authLoading, user, fetchResidents]);

  const handleAddResident = () => {
    setCurrentResident(null);
    reset({
      name: "",
      email: "",
      phone: "",
      propertyId: 0,
      role: "RESIDENT",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditResident = (resident: Resident) => {
    setCurrentResident(resident);
    reset({
      name: resident.name,
      email: resident.email,
      phone: resident.phone,
      propertyId: resident.propertyId,
      role: resident.role as "RESIDENT" | "OWNER" | "TENANT", // Cast to valid enum type
      isActive: resident.isActive,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ResidentFormValues) => {
    try {
      if (currentResident) {
        await updateResident(currentResident.id, data);
        toast({
          title: "Éxito",
          description: "Residente actualizado correctamente.",
        });
      } else {
        await createResident(data);
        toast({
          title: "Éxito",
          description: "Residente creado correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchResidents();
    } catch (error) {
      console.error("Error saving resident:", error);
      toast({
        title: "Error",
        description: "Error al guardar el residente.",
        variant: "destructive",
      });
    }
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState<number | null>(null);

  const handleDeleteResident = (id: number) => {
    setResidentToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteResident = async () => {
    if (residentToDelete === null) return;
    try {
      await deleteResident(residentToDelete);
      toast({
        title: "Éxito",
        description: "Residente eliminado correctamente.",
      });
      fetchResidents();
    } catch (error) {
      console.error("Error deleting resident:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el residente.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setResidentToDelete(null);
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
        Gestión de Residentes
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddResident}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Residente
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Propiedad</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {residents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell>{resident.name}</TableCell>
                <TableCell>{resident.email}</TableCell>
                <TableCell>{resident.phone}</TableCell>
                <TableCell>{resident.unitNumber}</TableCell>
                <TableCell>{resident.role}</TableCell>
                <TableCell>
                  {resident.isActive ? (
                    <Badge variant="default">Sí</Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditResident(resident)}
                    className="mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteResident(resident.id)}
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
              {currentResident ? "Editar Residente" : "Añadir Nuevo Residente"}
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
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Email</FormLabel>
                    <FormControl>
                      <Input type="email" className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Teléfono</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
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
                    <FormLabel className="text-right">ID Propiedad</FormLabel>
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
                name="role"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Rol</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 p-2 border rounded-md">
                          <SelectValue placeholder="Seleccionar Rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RESIDENT">Residente</SelectItem>
                        <SelectItem value="OWNER">Propietario</SelectItem>
                        <SelectItem value="TENANT">Inquilino</SelectItem>
                      </SelectContent>
                    </Select>
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
                  {currentResident ? "Guardar Cambios" : "Añadir Residente"}
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
              ¿Estás seguro de que quieres eliminar este residente? Esta acción
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteResident}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
