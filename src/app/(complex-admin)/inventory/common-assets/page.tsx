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
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  getCommonAssets,
  createCommonAsset,
  updateCommonAsset,
  deleteCommonAsset,
} from "@/services/commonAssetService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  commonAssetSchema,
  CommonAssetFormValues,
} from "@/validators/common-asset-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface CommonAsset {
  id: number;
  name: string;
  description?: string;
  location: string;
  assetType: string;
  purchaseDate?: string;
  value?: number;
  isActive: boolean;
}

export default function CommonAssetsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [commonAssets, setCommonAssets] = useState<CommonAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCommonAsset, setCurrentCommonAsset] =
    useState<CommonAsset | null>(null);

  const form = useForm<CommonAssetFormValues>({
    resolver: zodResolver(commonAssetSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      assetType: "",
      purchaseDate: "",
      value: 0,
      isActive: true,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchCommonAssets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCommonAssets();
      setCommonAssets(data);
    } catch (error: Error) {
      console.error("Error fetching common assets:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los bienes comunes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchCommonAssets();
    }
  }, [authLoading, user, fetchCommonAssets]);

  const handleAddCommonAsset = () => {
    setCurrentCommonAsset(null);
    reset({
      name: "",
      description: "",
      location: "",
      assetType: "",
      purchaseDate: "",
      value: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditCommonAsset = (asset: CommonAsset) => {
    setCurrentCommonAsset(asset);
    reset({
      name: asset.name,
      description: asset.description || "",
      location: asset.location,
      assetType: asset.assetType,
      purchaseDate: asset.purchaseDate || "",
      value: asset.value || 0,
      isActive: asset.isActive,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CommonAssetFormValues) => {
    try {
      if (currentCommonAsset) {
        await updateCommonAsset(currentCommonAsset.id, data);
        toast({
          title: "Éxito",
          description: "Bien común actualizado correctamente.",
        });
      } else {
        await createCommonAsset(data);
        toast({
          title: "Éxito",
          description: "Bien común creado correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchCommonAssets();
    } catch (error: Error) {
      console.error("Error saving common asset:", error);
      toast({
        title: "Error",
        description: "Error al guardar el bien común.",
        variant: "destructive",
      });
    }
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [commonAssetToDelete, setCommonAssetToDelete] = useState<number | null>(
    null,
  );

  const handleDeleteCommonAsset = (id: number) => {
    setCommonAssetToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCommonAsset = async () => {
    if (commonAssetToDelete === null) return;
    try {
      await deleteCommonAsset(commonAssetToDelete);
      toast({
        title: "Éxito",
        description: "Bien común eliminado correctamente.",
      });
      fetchCommonAssets();
    } catch (error: Error) {
      console.error("Error deleting common asset:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el bien común.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setCommonAssetToDelete(null);
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
        Gestión de Bienes Comunes
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddCommonAsset}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Bien Común
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Tipo de Activo</TableHead>
              <TableHead>Fecha de Compra</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commonAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.description}</TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>{asset.assetType}</TableCell>
                <TableCell>
                  {asset.purchaseDate
                    ? new Date(asset.purchaseDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>{asset.value}</TableCell>
                <TableCell>
                  {asset.isActive ? (
                    <Badge variant="default">Sí</Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCommonAsset(asset)}
                    className="mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCommonAsset(asset.id)}
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
              {currentCommonAsset
                ? "Editar Bien Común"
                : "Añadir Nuevo Bien Común"}
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
                      <Textarea className="col-span-3" {...field} />
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
                name="assetType"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Tipo de Activo</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">
                      Fecha de Compra
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="value"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Valor</FormLabel>
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
                  {currentCommonAsset ? "Guardar Cambios" : "Añadir Bien Común"}
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
              ¿Estás seguro de que quieres eliminar este bien común? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmDeleteCommonAsset}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
