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

import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  getCameras,
  createCamera,
  updateCamera,
  deleteCamera,
} from "@/services/cameraService";

interface Camera {
  id: number;
  name: string;
  ipAddress: string;
  port: number;
  username?: string;
  password?: string;
  location: string;
  isActive: boolean;
}

export default function CamerasPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<Camera | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    ipAddress: "",
    port: 80,
    username: "",
    password: "",
    location: "",
    isActive: true,
  });

  const fetchCameras = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCameras();
      setCameras(data);
    } catch (error: Error) {
      console.error("Error fetching cameras:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las cámaras: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchCameras();
    }
  }, [authLoading, user, fetchCameras]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddCamera = () => {
    setCurrentCamera(null);
    setFormData({
      name: "",
      ipAddress: "",
      port: 80,
      username: "",
      password: "",
      location: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditCamera = (camera: Camera) => {
    setCurrentCamera(camera);
    setFormData({
      name: camera.name,
      ipAddress: camera.ipAddress,
      port: camera.port,
      username: camera.username || "",
      password: camera.password || "",
      location: camera.location,
      isActive: camera.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCamera) {
        await updateCamera(currentCamera.id, formData);
        toast({
          title: "Éxito",
          description: "Cámara actualizada correctamente.",
        });
      } else {
        await createCamera(formData);
        toast({
          title: "Éxito",
          description: "Cámara creada correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchCameras();
    } catch (error: Error) {
      console.error("Error saving camera:", error);
      toast({
        title: "Error",
        description: "Error al guardar la cámara: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCamera = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta cámara?")) {
      try {
        await deleteCamera(id);
        toast({
          title: "Éxito",
          description: "Cámara eliminada correctamente.",
        });
        fetchCameras();
      } catch (error: Error) {
        console.error("Error deleting camera:", error);
        toast({
          title: "Error",
          description: "Error al eliminar la cámara: " + error.message,
          variant: "destructive",
        });
      }
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
        Gestión de Cámaras IP
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddCamera}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Cámara
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección IP</TableHead>
              <TableHead>Puerto</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Activa</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cameras.length > 0 ? (
              cameras.map((camera) => (
                <TableRow key={camera.id}>
                  <TableCell>{camera.name}</TableCell>
                  <TableCell>{camera.ipAddress}</TableCell>
                  <TableCell>{camera.port}</TableCell>
                  <TableCell>{camera.location}</TableCell>
                  <TableCell>
                    {camera.isActive ? (
                      <Badge variant="default">Sí</Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCamera(camera)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCamera(camera.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-5">
                  No hay cámaras registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentCamera ? "Editar Cámara" : "Añadir Nueva Cámara"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
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
              <Label htmlFor="ipAddress" className="text-right">
                Dirección IP
              </Label>
              <Input
                id="ipAddress"
                name="ipAddress"
                value={formData.ipAddress}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="port" className="text-right">
                Puerto
              </Label>
              <Input
                id="port"
                name="port"
                type="number"
                value={formData.port}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Usuario
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Ubicación
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
              <Label htmlFor="isActive">Activa</Label>
            </div>
            <DialogFooter>
              <Button type="submit">
                {currentCamera ? "Guardar Cambios" : "Añadir Cámara"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}