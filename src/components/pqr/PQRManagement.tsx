import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  PQR,
  PQRComment,
  getPQRs,
  getPQRById,
  createPQR,
  updatePQR,
  deletePQR,
  addPQRComment,
  assignPQR,
} from "@/services/pqrService";

export default function PQRManagement() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [pqrs, setPqrs] = useState<PQR[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedPQR, setSelectedPQR] = useState<PQR | null>(null);
  const [newComment, setNewComment] = useState("");
  const [assignedToUser, setAssignedToUser] = useState<string>("");

  const [newPQRForm, setNewPQRForm] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "MEDIUM",
  });

  const [editPQRForm, setEditPQRForm] = useState<Partial<PQR>>({});

  const fetchPQRs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPQRs();
      setPqrs(data);
    } catch (error) {
      console.error("Error fetching PQRs:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las PQRs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPQRs();
  }, [fetchPQRs]);

  const handleCreatePQR = async () => {
    if (!user?.id) {
      toast({ title: "Error", description: "Usuario no autenticado." });
      return;
    }
    try {
      await createPQR({
        ...newPQRForm,
        reportedById: user.id,
      });
      toast({ title: "Éxito", description: "PQR creada correctamente." });
      setIsCreateDialogOpen(false);
      setNewPQRForm({
        subject: "",
        description: "",
        category: "",
        priority: "MEDIUM",
      });
      fetchPQRs();
    } catch (error) {
      console.error("Error creating PQR:", error);
      toast({
        title: "Error",
        description: "Error al crear PQR.",
        variant: "destructive",
      });
    }
  };

  const handleViewPQR = async (id: number) => {
    try {
      const pqr = await getPQRById(id);
      setSelectedPQR(pqr);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error("Error fetching PQR details:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el detalle de la PQR.",
        variant: "destructive",
      });
    }
  };

  const handleEditPQR = (pqr: PQR) => {
    setSelectedPQR(pqr);
    setEditPQRForm({
      subject: pqr.subject,
      description: pqr.description,
      category: pqr.category,
      priority: pqr.priority,
      status: pqr.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePQR = async () => {
    if (!selectedPQR) return;
    try {
      await updatePQR(selectedPQR.id, editPQRForm);
      toast({ title: "Éxito", description: "PQR actualizada correctamente." });
      setIsEditDialogOpen(false);
      fetchPQRs();
    } catch (error) {
      console.error("Error updating PQR:", error);
      toast({
        title: "Error",
        description: "Error al actualizar PQR.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePQR = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta PQR?")) return;
    try {
      await deletePQR(id);
      toast({ title: "Éxito", description: "PQR eliminada correctamente." });
      fetchPQRs();
    } catch (error) {
      console.error("Error deleting PQR:", error);
      toast({
        title: "Error",
        description: "Error al eliminar PQR.",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    if (!selectedPQR || !newComment.trim()) return;
    try {
      await addPQRComment(selectedPQR.id, newComment);
      setNewComment("");
      toast({
        title: "Éxito",
        description: "Comentario añadido correctamente.",
      });
      // Re-fetch PQR to show new comment
      handleViewPQR(selectedPQR.id);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Error al añadir comentario.",
        variant: "destructive",
      });
    }
  };

  const handleAssignPQR = async () => {
    if (!selectedPQR || !assignedToUser) return;
    try {
      await assignPQR(selectedPQR.id, parseInt(assignedToUser)); // Assuming assignedToUser is an ID
      toast({ title: "Éxito", description: "PQR asignada correctamente." });
      setIsAssignDialogOpen(false);
      setAssignedToUser("");
      fetchPQRs();
    } catch (error) {
      console.error("Error assigning PQR:", error);
      toast({
        title: "Error",
        description: "Error al asignar PQR.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: PQR["status"]) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "CLOSED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: PQR["priority"]) => {
    switch (priority) {
      case "LOW":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de PQR</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva PQR
        </Button>
      </div>

      {pqrs.length === 0 ? (
        <p className="text-center text-gray-500">No hay PQRs registradas.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asunto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Reportado Por</TableHead>
              <TableHead>Asignado A</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pqrs.map((pqr) => (
              <TableRow key={pqr.id}>
                <TableCell>{pqr.subject}</TableCell>
                <TableCell>{pqr.category}</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(pqr.priority)}>
                    {pqr.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(pqr.status)}>
                    {pqr.status}
                  </Badge>
                </TableCell>
                <TableCell>{pqr.reportedByName}</TableCell>
                <TableCell>{pqr.assignedToName || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewPQR(pqr.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditPQR(pqr)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAssignDialogOpen(true)}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePQR(pqr.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create PQR Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva PQR</DialogTitle>
            <DialogDescription>
              Complete los detalles de la nueva PQR.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="subject">Asunto</Label>
              <Input
                id="subject"
                value={newPQRForm.subject}
                onChange={(e) =>
                  setNewPQRForm({ ...newPQRForm, subject: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newPQRForm.description}
                onChange={(e) =>
                  setNewPQRForm({ ...newPQRForm, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                value={newPQRForm.category}
                onChange={(e) =>
                  setNewPQRForm({ ...newPQRForm, category: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={newPQRForm.priority}
                onValueChange={(value) =>
                  setNewPQRForm({
                    ...newPQRForm,
                    priority: value as PQR["priority"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baja</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreatePQR}>Crear PQR</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View PQR Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de PQR: {selectedPQR?.subject}</DialogTitle>
            <DialogDescription>
              Información completa de la PQR.
            </DialogDescription>
          </DialogHeader>
          {selectedPQR && (
            <div className="space-y-4 py-4">
              <p>
                <strong>Descripción:</strong> {selectedPQR.description}
              </p>
              <p>
                <strong>Categoría:</strong> {selectedPQR.category}
              </p>
              <p>
                <strong>Prioridad:</strong>{" "}
                <Badge className={getPriorityColor(selectedPQR.priority)}>
                  {selectedPQR.priority}
                </Badge>
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <Badge className={getStatusColor(selectedPQR.status)}>
                  {selectedPQR.status}
                </Badge>
              </p>
              <p>
                <strong>Reportado por:</strong> {selectedPQR.reportedByName}
              </p>
              <p>
                <strong>Asignado a:</strong>{" "}
                {selectedPQR.assignedToName || "N/A"}
              </p>
              <p>
                <strong>Fecha de Creación:</strong>{" "}
                {new Date(selectedPQR.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Última Actualización:</strong>{" "}
                {new Date(selectedPQR.updatedAt).toLocaleString()}
              </p>

              <h3 className="text-lg font-semibold mt-4">Comentarios</h3>
              <div className="space-y-2">
                {selectedPQR.comments.length > 0 ? (
                  selectedPQR.comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-2">
                      <p className="text-sm font-semibold">
                        {comment.authorName}{" "}
                        <span className="text-gray-500 text-xs">
                          ({new Date(comment.createdAt).toLocaleString()})
                        </span>
                      </p>
                      <p className="text-gray-700">{comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No hay comentarios aún.</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Textarea
                  placeholder="Añadir un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Añadir Comentario
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit PQR Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar PQR: {selectedPQR?.subject}</DialogTitle>
            <DialogDescription>
              Modifique los detalles de la PQR.
            </DialogDescription>
          </DialogHeader>
          {selectedPQR && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="editSubject">Asunto</Label>
                <Input
                  id="editSubject"
                  value={editPQRForm.subject}
                  onChange={(e) =>
                    setEditPQRForm({ ...editPQRForm, subject: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editDescription">Descripción</Label>
                <Textarea
                  id="editDescription"
                  value={editPQRForm.description}
                  onChange={(e) =>
                    setEditPQRForm({
                      ...editPQRForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editCategory">Categoría</Label>
                <Input
                  id="editCategory"
                  value={editPQRForm.category}
                  onChange={(e) =>
                    setEditPQRForm({ ...editPQRForm, category: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editPriority">Prioridad</Label>
                <Select
                  value={editPQRForm.priority}
                  onValueChange={(value) =>
                    setEditPQRForm({
                      ...editPQRForm,
                      priority: value as PQR["priority"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baja</SelectItem>
                    <SelectItem value="MEDIUM">Media</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editStatus">Estado</Label>
                <Select
                  value={editPQRForm.status}
                  onValueChange={(value) =>
                    setEditPQRForm({
                      ...editPQRForm,
                      status: value as PQR["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Abierta</SelectItem>
                    <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                    <SelectItem value="CLOSED">Cerrada</SelectItem>
                    <SelectItem value="REJECTED">Rechazada</SelectItem>
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
            <Button onClick={handleUpdatePQR}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign PQR Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar PQR: {selectedPQR?.subject}</DialogTitle>
            <DialogDescription>Asigne esta PQR a un usuario.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="assignedToUser">ID de Usuario a Asignar</Label>
              <Input
                id="assignedToUser"
                value={assignedToUser}
                onChange={(e) => setAssignedToUser(e.target.value)}
                placeholder="Ej: 123"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAssignPQR}>Asignar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
