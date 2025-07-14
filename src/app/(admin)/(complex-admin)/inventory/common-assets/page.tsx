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
import { Label } from "@/components/ui/label";
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
  getCommonAssets,
  createCommonAsset,
  updateCommonAsset,
  deleteCommonAsset,
} from "@/services/commonAssetService";

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
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    assetType: "",
    purchaseDate: "",
    value: 0,
    isActive: true,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [commonAssetToDelete, setCommonAssetToDelete] = useState<number | null>(
    null,
  );

  const fetchCommonAssets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCommonAssets();
      setCommonAssets(data);
    } catch (error) {
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAddCommonAsset = () => {
    setCurrentCommonAsset(null);
    setFormData({
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
    setFormData({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCommonAsset) {
        await updateCommonAsset(currentCommonAsset.id, formData);
        toast({
          title: "Éxito",
          description: "Bien común actualizado correctamente.",
        });
      } else {
        await createCommonAsset(formData);
        toast({
          title: "Éxito",
          description: "Bien común creado correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchCommonAssets();
    } catch (error) {
      console.error("Error saving common asset:", error);
      toast({
        title: "Error",
        description: "Error al guardar el bien común.",
        variant: "destructive",
      });
    }
  };

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
    } catch (error) {
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
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assetType">Tipo de Activo</Label>
              <Input
                id="assetType"
                name="assetType"
                value={formData.assetType}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchaseDate">Fecha de Compra</Label>
              <Input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
              />
              <Label htmlFor="isActive">Activa</Label>
            </div>
            <DialogFooter>
              <Button type="submit">
                {currentCommonAsset ? "Guardar Cambios" : "Añadir Bien Común"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar este bien común? Esta acción
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCommonAsset}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
