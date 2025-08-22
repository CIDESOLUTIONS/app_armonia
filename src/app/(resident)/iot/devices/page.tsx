"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { 
  Loader2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Wifi,
  WifiOff,
  Settings,
  Calendar,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  IoTDevice,
  CreateIoTDevice,
  UpdateIoTDevice,
  IoTDeviceType,
  IoTDeviceStatus,
  DeviceFilters,
} from "@/services/iotService";

const DEVICE_TYPE_LABELS = {
  [IoTDeviceType.SMART_METER]: "Medidor Inteligente",
  [IoTDeviceType.CAMERA]: "Cámara",
  [IoTDeviceType.SENSOR]: "Sensor",
  [IoTDeviceType.ACCESS_CONTROL]: "Control de Acceso",
  [IoTDeviceType.THERMOSTAT]: "Termostato",
  [IoTDeviceType.SMOKE_DETECTOR]: "Detector de Humo",
  [IoTDeviceType.WATER_LEAK_SENSOR]: "Sensor de Fuga",
  [IoTDeviceType.MOTION_SENSOR]: "Sensor de Movimiento",
  [IoTDeviceType.OTHER]: "Otro",
};

const STATUS_COLORS = {
  [IoTDeviceStatus.ONLINE]: "bg-green-100 text-green-800",
  [IoTDeviceStatus.OFFLINE]: "bg-gray-100 text-gray-800",
  [IoTDeviceStatus.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
  [IoTDeviceStatus.ERROR]: "bg-red-100 text-red-800",
  [IoTDeviceStatus.UNKNOWN]: "bg-purple-100 text-purple-800",
};

const STATUS_LABELS = {
  [IoTDeviceStatus.ONLINE]: "En línea",
  [IoTDeviceStatus.OFFLINE]: "Fuera de línea",
  [IoTDeviceStatus.MAINTENANCE]: "Mantenimiento",
  [IoTDeviceStatus.ERROR]: "Error",
  [IoTDeviceStatus.UNKNOWN]: "Desconocido",
};

export default function IoTDevicesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<DeviceFilters>({
    page: 1,
    limit: 10,
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [formData, setFormData] = useState<CreateIoTDevice>({
    name: "",
    type: IoTDeviceType.SENSOR,
    location: "",
    description: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
    firmwareVersion: "",
  });
  const [editFormData, setEditFormData] = useState<UpdateIoTDevice>({});
  const [submitting, setSubmitting] = useState(false);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const response = await getDevices(filters);
      setDevices(response.devices);
      setTotal(response.total);
    } catch (error) {
      console.error("Error loading devices:", error);
      toast({
        title: "Error",
        description: "Error al cargar los dispositivos IoT.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDevice = async () => {
    try {
      setSubmitting(true);
      await createDevice(formData);
      toast({
        title: "Éxito",
        description: "Dispositivo IoT creado correctamente.",
      });
      setShowCreateDialog(false);
      setFormData({
        name: "",
        type: IoTDeviceType.SENSOR,
        location: "",
        description: "",
        serialNumber: "",
        manufacturer: "",
        model: "",
        firmwareVersion: "",
      });
      await loadDevices();
    } catch (error) {
      console.error("Error creating device:", error);
      toast({
        title: "Error",
        description: "Error al crear el dispositivo IoT.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateDevice = async () => {
    if (!selectedDevice) return;
    
    try {
      setSubmitting(true);
      await updateDevice(selectedDevice.id, editFormData);
      toast({
        title: "Éxito",
        description: "Dispositivo IoT actualizado correctamente.",
      });
      setShowEditDialog(false);
      setSelectedDevice(null);
      setEditFormData({});
      await loadDevices();
    } catch (error) {
      console.error("Error updating device:", error);
      toast({
        title: "Error",
        description: "Error al actualizar el dispositivo IoT.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDevice = async (device: IoTDevice) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el dispositivo "${device.name}"?`)) {
      return;
    }
    
    try {
      await deleteDevice(device.id);
      toast({
        title: "Éxito",
        description: "Dispositivo IoT eliminado correctamente.",
      });
      await loadDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el dispositivo IoT.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (search: string) => {
    setFilters({ ...filters, search, page: 1 });
  };

  const handleFilterChange = (key: keyof DeviceFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const openEditDialog = (device: IoTDevice) => {
    setSelectedDevice(device);
    setEditFormData({
      name: device.name,
      status: device.status,
      location: device.location,
      description: device.description,
      firmwareVersion: device.firmwareVersion,
      metadata: device.metadata,
      nextMaintenanceAt: device.nextMaintenanceAt,
      propertyId: device.propertyId,
    });
    setShowEditDialog(true);
  };

  useEffect(() => {
    if (user) {
      loadDevices();
    }
  }, [user, filters]);

  if (authLoading) {
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
          Gestión de Dispositivos IoT
        </h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Dispositivo
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar dispositivos..."
                value={filters.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.type || ""}
              onValueChange={(value) => handleFilterChange("type", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los tipos</SelectItem>
                {Object.entries(DEVICE_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status || ""}
              onValueChange={(value) => handleFilterChange("status", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Ubicación..."
              value={filters.location || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Devices Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Dispositivos ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No se encontraron dispositivos IoT.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar primer dispositivo
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Última conexión</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{device.name}</div>
                        {device.serialNumber && (
                          <div className="text-sm text-muted-foreground">
                            S/N: {device.serialNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {DEVICE_TYPE_LABELS[device.type] || device.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {device.status === IoTDeviceStatus.ONLINE ? (
                          <Wifi className="h-4 w-4 text-green-600" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-gray-400" />
                        )}
                        <Badge className={STATUS_COLORS[device.status]}>
                          {STATUS_LABELS[device.status]}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {device.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {device.lastSeen ? (
                        <div className="text-sm">
                          {new Date(device.lastSeen).toLocaleString('es-ES')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Nunca
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(device)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteDevice(device)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Device Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Dispositivo IoT</DialogTitle>
            <DialogDescription>
              Configura un nuevo dispositivo IoT para el sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Medidor Apartamento 101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as IoTDeviceType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DEVICE_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ej: Edificio A - Piso 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Número de Serie</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="Ej: SN123456789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Fabricante</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="Ej: Siemens"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Ej: SM-2000"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del dispositivo..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateDevice}
              disabled={submitting || !formData.name || !formData.location}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Crear Dispositivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Device Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Dispositivo IoT</DialogTitle>
            <DialogDescription>
              Actualiza la configuración del dispositivo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={editFormData.name || ""}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Estado</Label>
              <Select
                value={editFormData.status || ""}
                onValueChange={(value) => setEditFormData({ ...editFormData, status: value as IoTDeviceStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Ubicación</Label>
              <Input
                id="edit-location"
                value={editFormData.location || ""}
                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-firmware">Versión de Firmware</Label>
              <Input
                id="edit-firmware"
                value={editFormData.firmwareVersion || ""}
                onChange={(e) => setEditFormData({ ...editFormData, firmwareVersion: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description || ""}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateDevice}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Actualizar Dispositivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
