"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Loader2,
  Briefcase,
  Search,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  getServiceProviders,
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
  ServiceProviderDto,
} from "@/services/serviceProviderService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  serviceProviderSchema,
  ServiceProviderFormValues,
} from "@/validators/service-provider-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function ServiceProvidersPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<ServiceProviderDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProvider, setCurrentProvider] =
    useState<ServiceProviderDto | null>(null);

  const form = useForm<ServiceProviderFormValues>({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      contact: "",
      logoUrl: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchServiceProviders = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchTerm || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
      };
      const fetchedProviders = await getServiceProviders(filters);
      setProviders(fetchedProviders);
    } catch (err: Error) {
      console.error("Error fetching service providers:", err);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores de servicios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchServiceProviders();
    }
  }, [authLoading, user, fetchServiceProviders]);

  const handleAddProvider = () => {
    setCurrentProvider(null);
    reset({
      name: "",
      category: "",
      description: "",
      contact: "",
      logoUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleEditProvider = (provider: ServiceProviderDto) => {
    setCurrentProvider(provider);
    reset({
      name: provider.name,
      category: provider.category,
      description: provider.description || "",
      contact: provider.contact,
      logoUrl: provider.logoUrl || "",
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ServiceProviderFormValues) => {
    try {
      if (currentProvider) {
        await updateServiceProvider(currentProvider.id, data);
        toast({
          title: "Éxito",
          description: "Proveedor de servicios actualizado correctamente.",
        });
      } else {
        await createServiceProvider(data);
        toast({
          title: "Éxito",
          description: "Proveedor de servicios creado correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchServiceProviders();
    } catch (error: Error) {
      console.error("Error saving service provider:", error);
      toast({
        title: "Error",
        description: "Error al guardar el proveedor de servicios.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProvider = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este proveedor?"))
      return;
    try {
      await deleteServiceProvider(id);
      toast({
        title: "Éxito",
        description: "Proveedor de servicios eliminado correctamente.",
      });
      fetchServiceProviders();
    } catch (error: Error) {
      console.error("Error deleting service provider:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el proveedor de servicios.",
        variant: "destructive",
      });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Proveedores de Servicios
        </h1>
        <Button onClick={handleAddProvider}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Proveedor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, descripción o contacto..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="categoryFilter">Categoría</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Plomería">Plomería</SelectItem>
              <SelectItem value="Electricidad">Electricidad</SelectItem>
              <SelectItem value="Jardinería">Jardinería</SelectItem>
              <SelectItem value="Limpieza">Limpieza</SelectItem>
              <SelectItem value="Seguridad">Seguridad</SelectItem>
              <SelectItem value="Otros">Otros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {providers.length === 0 && !loading ? (
        <div className="text-center py-12 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">
            No se encontraron proveedores de servicios
          </h3>
          <p>Ajusta tus filtros o intenta con otra búsqueda.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.name}</TableCell>
                  <TableCell>{provider.category}</TableCell>
                  <TableCell>{provider.contact}</TableCell>
                  <TableCell>{provider.rating} / 5</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditProvider(provider)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProvider(provider.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentProvider ? "Editar Proveedor" : "Añadir Nuevo Proveedor"}
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
                      <Input id="name" {...field} className="col-span-3" />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Categoría</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Plomería">Plomería</SelectItem>
                        <SelectItem value="Electricidad">
                          Electricidad
                        </SelectItem>
                        <SelectItem value="Jardinería">Jardinería</SelectItem>
                        <SelectItem value="Limpieza">Limpieza</SelectItem>
                        <SelectItem value="Seguridad">Seguridad</SelectItem>
                        <SelectItem value="Otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input
                        id="description"
                        {...field}
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="contact"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Contacto</FormLabel>
                    <FormControl>
                      <Input id="contact" {...field} className="col-span-3" />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">URL Logo</FormLabel>
                    <FormControl>
                      <Input id="logoUrl" {...field} className="col-span-3" />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  {currentProvider ? "Guardar Cambios" : "Añadir Proveedor"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}