import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  generateOrdinaryFees,
  createFee,
  FeeDto,
  CreateFeeDto,
  FeeFilterParamsDto,
  getFees,
  updateFee,
  deleteFee,
} from "@/services/financeService";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FineManagementSection() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [fines, setFines] = useState<FeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentFine, setCurrentFine] = useState<FeeDto | null>(null);

  const [newFineForm, setNewFineForm] = useState<CreateFeeDto>({
    title: "",
    description: "",
    amount: 0,
    dueDate: "",
    type: "FINE",
  });

  const [editFineForm, setEditFineForm] = useState<Partial<FeeDto>>({});

  const fetchFines = async () => {
    setLoading(true);
    try {
      const filters: FeeFilterParamsDto = {
        type: "FINE",
      };
      const response = await getFees(filters);
      setFines(response.data);
    } catch (error) {
      console.error("Error fetching fines:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las multas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const handleCreateFine = async () => {
    if (!user || !user.complexId) {
      toast({
        title: "Error",
        description: "Usuario no autenticado o complexId no disponible.",
      });
      return;
    }
    if (!newFineForm.title || !newFineForm.amount || !newFineForm.dueDate) {
      toast({
        title: "Error",
        description:
          "Por favor, complete todos los campos obligatorios para crear una multa.",
      });
      return;
    }
    try {
      const fineToCreate: CreateFeeDto = {
        ...newFineForm,
        propertyId: user.complexId, // Adjust if fines are per property/unit
      };
      await createFee(fineToCreate);
      toast({ title: "Éxito", description: "Multa creada correctamente." });
      setIsCreateDialogOpen(false);
      setNewFineForm({
        title: "",
        description: "",
        amount: 0,
        dueDate: "",
        type: "FINE",
      });
      fetchFines();
    } catch (error) {
      console.error("Error creating fine:", error);
      toast({
        title: "Error",
        description: "Error al crear multa.",
        variant: "destructive",
      });
    }
  };

  const handleEditFine = (fine: FeeDto) => {
    setCurrentFine(fine);
    setEditFineForm({
      title: fine.title,
      description: fine.description,
      amount: fine.amount,
      dueDate: fine.dueDate.split("T")[0],
      status: fine.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateFine = async () => {
    if (!currentFine) return;
    try {
      await updateFee(currentFine.id, editFineForm);
      toast({
        title: "Éxito",
        description: "Multa actualizada correctamente.",
      });
      setIsEditDialogOpen(false);
      fetchFines();
    } catch (error) {
      console.error("Error updating fine:", error);
      toast({
        title: "Error",
        description: "Error al actualizar multa.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFine = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta multa?")) return;
    try {
      await deleteFee(id);
      toast({ title: "Éxito", description: "Multa eliminada correctamente." });
      fetchFines();
    } catch (error) {
      console.error("Error deleting fine:", error);
      toast({
        title: "Error",
        description: "Error al eliminar multa.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Multas e Intereses</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="mb-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva Multa
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fines.length > 0 ? (
                fines.map((fine) => (
                  <TableRow key={fine.id}>
                    <TableCell>{fine.title}</TableCell>
                    <TableCell>{fine.amount}</TableCell>
                    <TableCell>
                      {new Date(fine.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{fine.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFine(fine)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFine(fine.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No hay multas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for creating a new fine */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Multa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="newFineTitle">Título</Label>
              <Input
                id="newFineTitle"
                value={newFineForm.title}
                onChange={(e) =>
                  setNewFineForm({ ...newFineForm, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="newFineDescription">Descripción</Label>
              <Input
                id="newFineDescription"
                value={newFineForm.description}
                onChange={(e) =>
                  setNewFineForm({
                    ...newFineForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="newFineAmount">Monto</Label>
              <Input
                id="newFineAmount"
                type="number"
                value={newFineForm.amount}
                onChange={(e) =>
                  setNewFineForm({
                    ...newFineForm,
                    amount: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="newFineDueDate">Fecha de Vencimiento</Label>
              <Input
                id="newFineDueDate"
                type="date"
                value={newFineForm.dueDate}
                onChange={(e) =>
                  setNewFineForm({ ...newFineForm, dueDate: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateFine}>Crear Multa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing an existing fine */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Multa</DialogTitle>
          </DialogHeader>
          {currentFine && (
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="editFineTitle">Título</Label>
                <Input
                  id="editFineTitle"
                  value={editFineForm.title}
                  onChange={(e) =>
                    setEditFineForm({ ...editFineForm, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editFineDescription">Descripción</Label>
                <Input
                  id="editFineDescription"
                  value={editFineForm.description}
                  onChange={(e) =>
                    setEditFineForm({
                      ...editFineForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editFineAmount">Monto</Label>
                <Input
                  id="editFineAmount"
                  type="number"
                  value={editFineForm.amount}
                  onChange={(e) =>
                    setEditFineForm({
                      ...editFineForm,
                      amount: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editFineDueDate">Fecha de Vencimiento</Label>
                <Input
                  id="editFineDueDate"
                  type="date"
                  value={editFineForm.dueDate}
                  onChange={(e) =>
                    setEditFineForm({
                      ...editFineForm,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editFineStatus">Estado</Label>
                <Select
                  value={editFineForm.status}
                  onValueChange={(value) =>
                    setEditFineForm({
                      ...editFineForm,
                      status: value as "PENDING" | "PAID" | "OVERDUE",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendiente</SelectItem>
                    <SelectItem value="PAID">Pagada</SelectItem>
                    <SelectItem value="OVERDUE">Vencida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateFine}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
