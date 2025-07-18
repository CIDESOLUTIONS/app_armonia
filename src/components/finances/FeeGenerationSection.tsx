import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { generateOrdinaryFees, createFee, FeeDto, CreateFeeDto, FeeFilterParamsDto, getFees, updateFee, deleteFee } from "@/services/financeService";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function FeeGenerationSection() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fees, setFees] = useState<FeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState<FeeDto | null>(null);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const filters: FeeFilterParamsDto = {
        // Add any necessary filters here, e.g., by complexId if applicable
      };
      const response = await getFees(filters);
      setFees(response.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las cuotas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleGenerateFees = async () => {
    if (!amount || !dueDate || !title) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos para generar cuotas.",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateOrdinaryFees(amount, dueDate, title, description);
      toast({
        title: "Éxito",
        description: "Cuotas generadas correctamente.",
      });
      setAmount(0);
      setDueDate("");
      setTitle("");
      setDescription("");
      fetchFees(); // Refresh the list
    } catch (error) {
      console.error("Error generating fees:", error);
      toast({
        title: "Error",
        description: "Error al generar cuotas.",
        variant: "destructive",
      });
    }
  };

  const handleCreateFee = async () => {
    if (!user || !user.complexId) {
      toast({ title: "Error", description: "Usuario no autenticado o complexId no disponible." });
      return;
    }
    if (!newFeeForm.title || !newFeeForm.amount || !newFeeForm.dueDate || !newFeeForm.type) {
      toast({ title: "Error", description: "Por favor, complete todos los campos obligatorios para crear una cuota." });
      return;
    }
    try {
      const feeToCreate: CreateFeeDto = {
        ...newFeeForm,
        propertyId: user.complexId, // Assuming propertyId is complexId for now, adjust if needed
      };
      await createFee(feeToCreate);
      toast({ title: "Éxito", description: "Cuota creada correctamente." });
      setIsCreateDialogOpen(false);
      setNewFeeForm({ title: "", description: "", amount: 0, dueDate: "", type: "ORDINARY" });
      fetchFees();
    } catch (error) {
      console.error("Error creating fee:", error);
      toast({ title: "Error", description: "Error al crear cuota.", variant: "destructive" });
    }
  };

  const handleEditFee = (fee: FeeDto) => {
    setCurrentFee(fee);
    setEditFeeForm({ title: fee.title, description: fee.description, amount: fee.amount, dueDate: fee.dueDate.split('T')[0], type: fee.type, status: fee.status });
    setIsEditDialogOpen(true);
  };

  const handleUpdateFee = async () => {
    if (!currentFee) return;
    try {
      await updateFee(currentFee.id, editFeeForm);
      toast({ title: "Éxito", description: "Cuota actualizada correctamente." });
      setIsEditDialogOpen(false);
      fetchFees();
    } catch (error) {
      console.error("Error updating fee:", error);
      toast({ title: "Error", description: "Error al actualizar cuota.", variant: "destructive" });
    }
  };

  const handleDeleteFee = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta cuota?")) return;
    try {
      await deleteFee(id);
      toast({ title: "Éxito", description: "Cuota eliminada correctamente." });
      fetchFees();
    } catch (error) {
      console.error("Error deleting fee:", error);
      toast({ title: "Error", description: "Error al eliminar cuota.", variant: "destructive" });
    }
  };

  const [newFeeForm, setNewFeeForm] = useState<CreateFeeDto>({
    title: "",
    description: "",
    amount: 0,
    dueDate: "",
    type: "ORDINARY",
  });

  const [editFeeForm, setEditFeeForm] = useState<Partial<FeeDto>>({});

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
          <CardTitle>Generación de Cuotas Ordinarias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título de la Cuota</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Cuota de Administración Julio"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción (Opcional)</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción detallada de la cuota"
              />
            </div>
            <div>
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleGenerateFees} className="mt-4">
            Generar Cuotas
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Cuotas Individuales</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="mb-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Cuota Individual
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.length > 0 ? (
                fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{fee.title}</TableCell>
                    <TableCell>{fee.amount}</TableCell>
                    <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{fee.type}</TableCell>
                    <TableCell>{fee.status}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEditFee(fee)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteFee(fee.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No hay cuotas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for creating a new fee */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Cuota Individual</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="newTitle">Título</Label>
              <Input id="newTitle" value={newFeeForm.title} onChange={(e) => setNewFeeForm({ ...newFeeForm, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="newDescription">Descripción</Label>
              <Input id="newDescription" value={newFeeForm.description} onChange={(e) => setNewFeeForm({ ...newFeeForm, description: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="newAmount">Monto</Label>
              <Input id="newAmount" type="number" value={newFeeForm.amount} onChange={(e) => setNewFeeForm({ ...newFeeForm, amount: parseFloat(e.target.value) })} />
            </div>
            <div>
              <Label htmlFor="newDueDate">Fecha de Vencimiento</Label>
              <Input id="newDueDate" type="date" value={newFeeForm.dueDate} onChange={(e) => setNewFeeForm({ ...newFeeForm, dueDate: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="newType">Tipo</Label>
              <Select value={newFeeForm.type} onValueChange={(value) => setNewFeeForm({ ...newFeeForm, type: value as "ORDINARY" | "EXTRAORDINARY" | "FINE" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORDINARY">Ordinaria</SelectItem>
                  <SelectItem value="EXTRAORDINARY">Extraordinaria</SelectItem>
                  <SelectItem value="FINE">Multa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateFee}>Crear Cuota</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing an existing fee */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cuota</DialogTitle>
          </DialogHeader>
          {currentFee && (
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="editTitle">Título</Label>
                <Input id="editTitle" value={editFeeForm.title} onChange={(e) => setEditFeeForm({ ...editFeeForm, title: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="editDescription">Descripción</Label>
                <Input id="editDescription" value={editFeeForm.description} onChange={(e) => setEditFeeForm({ ...editFeeForm, description: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="editAmount">Monto</Label>
                <Input id="editAmount" type="number" value={editFeeForm.amount} onChange={(e) => setEditFeeForm({ ...editFeeForm, amount: parseFloat(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="editDueDate">Fecha de Vencimiento</Label>
                <Input id="editDueDate" type="date" value={editFeeForm.dueDate} onChange={(e) => setEditFeeForm({ ...editFeeForm, dueDate: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="editType">Tipo</Label>
                <Select value={editFeeForm.type} onValueChange={(value) => setEditFeeForm({ ...editFeeForm, type: value as "ORDINARY" | "EXTRAORDINARY" | "FINE" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ORDINARY">Ordinaria</SelectItem>
                    <SelectItem value="EXTRAORDINARY">Extraordinaria</SelectItem>
                    <SelectItem value="FINE">Multa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editStatus">Estado</Label>
                <Select value={editFeeForm.status} onValueChange={(value) => setEditFeeForm({ ...editFeeForm, status: value as "PENDING" | "PAID" | "OVERDUE" })}>
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateFee}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}