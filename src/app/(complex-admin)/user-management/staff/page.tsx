"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  getStaffUsers,
  createStaffUser,
  updateStaffUser,
  deleteStaffUser,
} from "@/services/staffService"; // Assuming this service will be created
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const staffUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  email: z.string().email("El email no es válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.").optional(), // Optional for edit
  role: z.enum(["RECEPTION", "STAFF", "SECURITY"], { errorMap: () => ({ message: "El rol es requerido." }) }),
  isActive: z.boolean().optional(),
});

type StaffUserFormValues = z.infer<typeof staffUserSchema>;

interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: "RECEPTION" | "STAFF" | "SECURITY";
  isActive: boolean;
}

export default function StaffManagementPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaffUser, setCurrentStaffUser] = useState<StaffUser | null>(null);

  const form = useForm<StaffUserFormValues>({
    resolver: zodResolver(staffUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "RECEPTION",
      isActive: true,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchStaffUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStaffUsers();
      setStaffUsers(data);
    } catch (error: Error) {
      console.error("Error fetching staff users:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios de personal: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchStaffUsers();
    }
  }, [authLoading, user, fetchStaffUsers]);

  const handleAddStaffUser = () => {
    setCurrentStaffUser(null);
    reset({
      name: "",
      email: "",
      password: "",
      role: "RECEPTION",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditStaffUser = (staffUser: StaffUser) => {
    setCurrentStaffUser(staffUser);
    reset({
      name: staffUser.name,
      email: staffUser.email,
      role: staffUser.role,
      isActive: staffUser.isActive,
      password: "", // Password is not pre-filled for security
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: StaffUserFormValues) => {
    try {
      if (currentStaffUser) {
        await updateStaffUser(currentStaffUser.id, data);
        toast({
          title: "Éxito",
          description: "Usuario de personal actualizado correctamente.",
        });
      } else {
        await createStaffUser(data);
        toast({
          title: "Éxito",
          description: "Usuario de personal creado correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchStaffUsers();
    } catch (error: Error) {
      console.error("Error saving staff user:", error);
      toast({
        title: "Error",
        description: "Error al guardar el usuario de personal: " + error.message,
        variant: "destructive",
      });
    }
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [staffUserToDelete, setStaffUserToDelete] = useState<number | null>(null);

  const handleDeleteStaffUser = (id: number) => {
    setStaffUserToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteStaffUser = async () => {
    if (staffUserToDelete === null) return;
    try {
      await deleteStaffUser(staffUserToDelete);
      toast({
        title: "Éxito",
        description: "Usuario de personal eliminado correctamente.",
      });
      fetchStaffUsers();
    } catch (error: Error) {
      console.error("Error deleting staff user:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el usuario de personal: " + error.message,
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setStaffUserToDelete(null);
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
        Gestión de Personal Operativo
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddStaffUser}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Personal
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffUsers.map((staffUser) => (
              <TableRow key={staffUser.id}>
                <TableCell>{staffUser.name}</TableCell>
                <TableCell>{staffUser.email}</TableCell>
                <TableCell>
                  <Badge>{staffUser.role}</Badge>
                </TableCell>
                <TableCell>
                  {staffUser.isActive ? (
                    <Badge variant="default">Sí</Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStaffUser(staffUser)}
                    className="mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStaffUser(staffUser.id)}
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
              {currentStaffUser ? "Editar Usuario" : "Añadir Nuevo Usuario"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!currentStaffUser && (
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar Rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RECEPTION">Recepción</SelectItem>
                        <SelectItem value="SECURITY">Seguridad</SelectItem>
                        <SelectItem value="STAFF">Staff General</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                  {currentStaffUser ? "Guardar Cambios" : "Añadir Usuario"}
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
              ¿Estás seguro de que quieres eliminar este usuario de personal? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmDeleteStaffUser}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
