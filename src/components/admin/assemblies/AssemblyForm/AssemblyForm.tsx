import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssemblyFormData {
  tipo: "ordinaria" | "extraordinaria";
  titulo: string;
  fecha: string;
  hora: string;
  descripcion: string;
  quorumRequerido: number;
  documentos?: File[];
}

interface AssemblyFormProps {
  initialData?: Partial<AssemblyFormData>;
  onSubmit: (data: AssemblyFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AssemblyForm: React.FC<AssemblyFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<AssemblyFormData>({
    tipo: "ordinaria",
    titulo: "",
    fecha: "",
    hora: "",
    descripcion: "",
    quorumRequerido: 50,
    ...initialData,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;

    if (name === "quorumRequerido") {
      processedValue = value === "" ? 0 : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="tipo">Tipo de Asamblea</Label>
          <Select
            name="tipo"
            value={formData.tipo}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                tipo: value as "ordinaria" | "extraordinaria",
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ordinaria">Ordinaria</SelectItem>
              <SelectItem value="extraordinaria">Extraordinaria</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Input
          name="titulo"
          label="Título"
          value={formData.titulo}
          onChange={handleChange}
          required
        />

        <Input
          name="fecha"
          type="date"
          label="Fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
        />

        <Input
          name="hora"
          type="time"
          label="Hora"
          value={formData.hora}
          onChange={handleChange}
          required
        />

        <div className="md:col-span-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            name="descripcion"
            rows={4}
            value={formData.descripcion}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <Input
          name="quorumRequerido"
          type="number"
          label="Quórum Requerido (%)"
          value={formData.quorumRequerido.toString()}
          onChange={handleChange}
          min="1"
          max="100"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          Guardar Asamblea
        </Button>
      </div>
    </form>
  );
};

export default AssemblyForm;
