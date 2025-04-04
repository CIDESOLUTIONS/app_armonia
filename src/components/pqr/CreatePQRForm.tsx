// src/components/pqr/CreatePQRForm.tsx
"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useServices, PQRType, PQRPriority, CreatePQRDto } from "@/lib/services";
import { useForm } from "react-hook-form";

interface CreatePQRFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreatePQRForm({ onSuccess, onCancel }: CreatePQRFormProps) {
  const { pqr } = useServices();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Definir formulario
  const form = useForm<CreatePQRDto>({
    defaultValues: {
      title: "",
      description: "",
      type: PQRType.PETITION,
      priority: PQRPriority.MEDIUM,
      category: "",
      subcategory: "",
    },
  });
  
  // Categorías de PQR
  const categories = [
    { value: "infrastructure", label: "Infraestructura" },
    { value: "security", label: "Seguridad" },
    { value: "payments", label: "Pagos" },
    { value: "noise", label: "Ruido" },
    { value: "common_areas", label: "Áreas comunes" },
    { value: "other", label: "Otro" },
  ];
  
  // Subcategorías por categoría
  const subcategories: Record<string, { value: string; label: string }[]> = {
    infrastructure: [
      { value: "damages", label: "Daños" },
      { value: "maintenance", label: "Mantenimiento" },
      { value: "improvements", label: "Mejoras" },
    ],
    security: [
      { value: "access", label: "Acceso" },
      { value: "cameras", label: "Cámaras" },
      { value: "incident", label: "Incidentes" },
    ],
    payments: [
      { value: "fees", label: "Cuotas" },
      { value: "receipts", label: "Recibos" },
      { value: "discounts", label: "Descuentos" },
    ],
    noise: [
      { value: "neighbors", label: "Vecinos" },
      { value: "events", label: "Eventos" },
      { value: "construction", label: "Construcción" },
    ],
    common_areas: [
      { value: "pool", label: "Piscina" },
      { value: "gym", label: "Gimnasio" },
      { value: "garden", label: "Jardines" },
      { value: "halls", label: "Salones" },
    ],
    other: [
      { value: "general", label: "General" },
    ],
  };
  
  // Manejar cambio de categoría
  const handleCategoryChange = (value: string) => {
    form.setValue("category", value);
    form.setValue("subcategory", "");
  };
  
  // Manejar envío del formulario
  const onSubmit = async (data: CreatePQRDto) => {
    try {
      setIsSubmitting(true);
      
      // Llamar al servicio para crear el PQR
      const result = await pqr.createPQR(data);
      
      toast({
        title: "Solicitud creada",
        description: "Tu solicitud ha sido enviada exitosamente",
        variant: "default",
      });
      
      // Limpiar formulario y notificar éxito
      form.reset();
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error al crear PQR:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Obtener la categoría seleccionada
  const selectedCategory = form.watch("category");
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nueva Solicitud</CardTitle>
        <CardDescription>
          Completa el formulario para enviar una petición, queja o reclamo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Este campo es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Escribe un título para tu solicitud" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              rules={{ required: "Este campo es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de solicitud" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PQRType.PETITION}>Petición</SelectItem>
                      <SelectItem value={PQRType.COMPLAINT}>Queja</SelectItem>
                      <SelectItem value={PQRType.CLAIM}>Reclamo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecciona el tipo que mejor describe tu solicitud
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              rules={{ required: "Este campo es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridad</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la prioridad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PQRPriority.LOW}>Baja</SelectItem>
                      <SelectItem value={PQRPriority.MEDIUM}>Media</SelectItem>
                      <SelectItem value={PQRPriority.HIGH}>Alta</SelectItem>
                      <SelectItem value={PQRPriority.URGENT}>Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={handleCategoryChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedCategory && (
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategoría</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una subcategoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subcategories[selectedCategory]?.map((subcategory) => (
                          <SelectItem key={subcategory.value} value={subcategory.value}>
                            {subcategory.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Este campo es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe detalladamente tu solicitud..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}