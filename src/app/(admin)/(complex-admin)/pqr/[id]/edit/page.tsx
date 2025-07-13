import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getPQRById, updatePQR } from "@/services/pqrService";

interface PQR {
  id: number;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED" | "REJECTED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: string;
  reportedById: number;
  reportedByName: string;
  assignedToId?: number;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditPQRPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const pqrId = params.id ? parseInt(params.id as string) : null;

  const [formData, setFormData] = useState<Partial<PQR>>({
    subject: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    status: "OPEN",
  });
  const [loading, setLoading] = useState(true);

  const fetchPQR = useCallback(async () => {
    setLoading(true);
    try {
      const pqr = await getPQRById(pqrId as number);
      if (pqr) {
        setFormData({
          subject: pqr.subject,
          description: pqr.description,
          category: pqr.category,
          priority: pqr.priority,
          status: pqr.status,
        });
      } else {
        toast({
          title: "Error",
          description: "PQR no encontrada.",
          variant: "destructive",
        });
        router.push("/admin/pqr/list");
      }
    } catch (error) {
      console.error("Error fetching PQR:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la PQR.",
        variant: "destructive",
      });
      router.push("/admin/pqr/list");
    } finally {
      setLoading(false);
    }
  }, [pqrId, router, toast]);

  useEffect(() => {
    if (!authLoading && user && pqrId) {
      fetchPQR();
    }
  }, [authLoading, user, pqrId, fetchPQR]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!pqrId) return;

    try {
      await updatePQR(pqrId, formData);
      toast({
        title: "Éxito",
        description: "PQR actualizada correctamente.",
      });
      router.push("/admin/pqr/list");
    } catch (error) {
      console.error("Error updating PQR:", error);
      toast({
        title: "Error",
        description: "Error al actualizar la PQR.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "COMPLEX_ADMIN" && user.role !== "STAFF")) {
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar PQR</h1>

      {pqrId && (
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="subject">Asunto</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoría</Label>
            <Input
              id="category"
              name="category"
              value={formData.category || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">Prioridad</Label>
            <Select
              name="priority"
              value={formData.priority || ""}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Baja</SelectItem>
                <SelectItem value="MEDIUM">Media</SelectItem>
                <SelectItem value="HIGH">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 col-span-full">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={5}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              name="status"
              value={formData.status || ""}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Abierta</SelectItem>
                <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                <SelectItem value="CLOSED">Cerrada</SelectItem>
                <SelectItem value="REJECTED">Rechazada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-full flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}{" "}
              Guardar Cambios
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
