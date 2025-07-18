import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CommonArea, CommonAreaType, CreateCommonAreaDto, UpdateCommonAreaDto, getCommonAreas, createCommonArea, updateCommonArea, deleteCommonArea } from "@/services/reservationService";

export default function CommonAreasPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCommonArea, setCurrentCommonArea] = useState<CommonArea | null>(null);

  const [formState, setFormState] = useState<CreateCommonAreaDto | UpdateCommonAreaDto>({
    name: "",
    description: "",
    type: CommonAreaType.OTHER,
    capacity: 0,
    requiresApproval: false,
    hourlyRate: 0,
    availableDays: [],
    openingTime: "",
    closingTime: "",
  });

  const fetchCommonAreas = async () => {
    setLoading(true);
    try {
      const data = await getCommonAreas();
      setCommonAreas(data);
    } catch (error) {
      console.error("Error fetching common areas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las áreas comunes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommonAreas();
  }, []);

  const handleAddCommonArea = () => {
    setCurrentCommonArea(null);
    setFormState({
      name: "",
      description: "",
      type: CommonAreaType.OTHER,
      capacity: 0,
      requiresApproval: false,
      hourlyRate: 0,
      availableDays: [],
      openingTime: "",
      closingTime: "",
    });
    setIsModalOpen(true);
  };

  const handleEditCommonArea = (area: CommonArea) => {
    setCurrentCommonArea(area);
    setFormState({
      name: area.name,
      description: area.description || "",
      type: area.type,
      capacity: area.capacity || 0,
      requiresApproval: area.requiresApproval || false,
      hourlyRate: area.hourlyRate || 0,
      availableDays: area.availableDays || [],
      openingTime: area.openingTime || "",
      closingTime: area.closingTime || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (currentCommonArea) {
        await updateCommonArea(currentCommonArea.id, formState);
        toast({
          title: "Éxito",
          description: "Área común actualizada correctamente.",
        });
      } else {
        await createCommonArea(formState as CreateCommonAreaDto);
        toast({
          title: "Éxito",
          description: "Área común creada correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchCommonAreas();
    } catch (error) {
      console.error("Error saving common area:", error);
      toast({
        title: "Error",
        description: "Error al guardar el área común.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCommonArea = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta área común?")) return;
    try {
      await deleteCommonArea(id);
      toast({
        title: "Éxito",
        description: "Área común eliminada correctamente.",
      });
      fetchCommonAreas();
    } catch (error) {
      console.error("Error deleting common area:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el área común.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Áreas Comunes</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddCommonArea}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Área Común
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Capacidad</TableHead>
            <TableHead>Requiere Aprobación</TableHead>
            <TableHead>Tarifa por Hora</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commonAreas.length > 0 ? (
            commonAreas.map((area) => (
              <TableRow key={area.id}>
                <TableCell>{area.name}</TableCell>
                <TableCell>{area.type}</TableCell>
                <TableCell>{area.capacity || "N/A"}</TableCell>
                <TableCell>{area.requiresApproval ? "Sí" : "No"}</TableCell>
                <TableCell>{area.hourlyRate ? `$${area.hourlyRate.toFixed(2)}` : "N/A"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleEditCommonArea(area)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCommonArea(area.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No hay áreas comunes registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCommonArea ? "Editar Área Común" : "Añadir Nueva Área Común"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={formState.type} onValueChange={(value) => setFormState({ ...formState, type: value as CommonAreaType })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CommonAreaType).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Capacidad</Label>
              <Input id="capacity" type="number" value={formState.capacity} onChange={(e) => setFormState({ ...formState, capacity: parseInt(e.target.value) })} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="requiresApproval" checked={formState.requiresApproval} onCheckedChange={(checked) => setFormState({ ...formState, requiresApproval: checked as boolean })} />
              <Label htmlFor="requiresApproval">Requiere Aprobación</Label>
            </div>
            <div>
              <Label htmlFor="hourlyRate">Tarifa por Hora</Label>
              <Input id="hourlyRate" type="number" value={formState.hourlyRate} onChange={(e) => setFormState({ ...formState, hourlyRate: parseFloat(e.target.value) })} />
            </div>
            <div>
              <Label htmlFor="availableDays">Días Disponibles (separados por coma)</Label>
              <Input id="availableDays" value={formState.availableDays?.join(", ")} onChange={(e) => setFormState({ ...formState, availableDays: e.target.value.split(",").map(day => day.trim()) })} />
            </div>
            <div>
              <Label htmlFor="openingTime">Hora de Apertura</Label>
              <Input id="openingTime" type="time" value={formState.openingTime} onChange={(e) => setFormState({ ...formState, openingTime: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="closingTime">Hora de Cierre</Label>
              <Input id="closingTime" type="time" value={formState.closingTime} onChange={(e) => setFormState({ ...formState, closingTime: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}