// src/components/pqr/CreatePQRForm.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createPQR } from "@/services/pqrService";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";



enum PQRPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

interface CreatePQRFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isInCard?: boolean;
}

export function CreatePQRForm({
  onSuccess,
  onCancel,
  isInCard = false,
}: CreatePQRFormProps) {
  // Estados para el formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: PQRPriority.MEDIUM,
    category: "",
    propertyUnit: "",
  });

  // Estados para la carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook de autenticación
  const { user } = useAuth();

  // Categorías disponibles
  const categories = [
    { id: "infrastructure", name: "Infraestructura" },
    { id: "security", name: "Seguridad" },
    { id: "noise", name: "Ruido" },
    { id: "payments", name: "Pagos" },
    { id: "services", name: "Servicios comunes" },
    { id: "other", name: "Otro" },
  ];

  // Manejar cambios en el formulario
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en selects
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validar el formulario
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("El título es obligatorio");
      return false;
    }

    if (!formData.description.trim()) {
      setError("La descripción es obligatoria");
      return false;
    }

    if (!formData.category) {
      setError("La categoría es obligatoria");
      return false;
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Crear PQR usando el servicio centralizado
      const response = await createPQR({
        subject: formData.title.trim(), // 'title' en el formulario, 'subject' en el servicio
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        propertyUnit: formData.propertyUnit.trim() || undefined,
        reportedById: user?.id, // 'submittedBy' en el formulario, 'reportedById' en el servicio
      });

      console.log("PQR creado exitosamente:", response.data);

      // Limpiar formulario
      setFormData({
        title: "",
        description: "",
        priority: PQRPriority.MEDIUM,
        category: "",
        propertyUnit: "",
      });

      // Notificar éxito
      onSuccess();
    } catch (err) {
      console.error("Error al crear PQR:", err);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo crear la solicitud. Intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Componente del formulario
  const FormContent = (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Resumen breve del asunto"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          

          <div>
            <Label htmlFor="priority">Prioridad</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Selecciona la prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PQRPriority.LOW}>Baja</SelectItem>
                <SelectItem value={PQRPriority.MEDIUM}>Media</SelectItem>
                <SelectItem value={PQRPriority.HIGH}>Alta</SelectItem>
                <SelectItem value={PQRPriority.URGENT}>Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="propertyUnit">Unidad (opcional)</Label>
          <Input
            id="propertyUnit"
            name="propertyUnit"
            value={formData.propertyUnit}
            onChange={handleChange}
            placeholder="Ej: A-101"
          />
        </div>

        <div>
          <Label htmlFor="description">Descripción detallada</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe con detalle tu solicitud, queja o reclamo..."
            rows={5}
            required
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar solicitud"}
        </Button>
      </div>
    </>
  );

  // Si está dentro de una tarjeta, devolver solo el contenido
  if (!isInCard) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {FormContent}
      </form>
    );
  }

  // Si no, devolver una tarjeta con el formulario
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva solicitud</CardTitle>
        <CardDescription>
          Reporta un problema o realiza una petición
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>{FormContent}</CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar solicitud"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
