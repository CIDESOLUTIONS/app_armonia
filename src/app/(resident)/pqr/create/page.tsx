"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Upload, FileText } from "lucide-react";
import { createPQR, uploadPQRAttachment } from "@/services/pqrService";
import { useAuthStore } from "@/store/authStore";

const formSchema = z.object({
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres."),
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres."),
  category: z.string().min(1, "La categoría es requerida."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  attachments: z.array(z.any()).optional(), // Para los archivos adjuntos
});

export default function CreatePQRPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      description: "",
      category: "",
      priority: "MEDIUM",
      attachments: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Usuario no autenticado.",
      });
      return;
    }

    setLoading(true);
    let uploadedAttachmentUrls: string[] = [];

    try {
      if (values.attachments && values.attachments.length > 0) {
        for (const attachmentFile of values.attachments) {
          const uploaded = await uploadPQRAttachment(attachmentFile);
          uploadedAttachmentUrls.push(uploaded.url);
        }
      }

      await createPQR({
        subject: values.subject,
        description: values.description,
        category: values.category,
        priority: values.priority,
        reportedById: user.id,
        attachments: uploadedAttachmentUrls,
      });
      toast({
        title: "Éxito",
        description: "PQR creada correctamente.",
      });
      router.push("/resident/pqr");
    } catch (error) {
      console.error("Error creating PQR:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la PQR.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      form.setValue("attachments", files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setAttachmentPreviews(previews);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Crear Nueva PQR
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asunto</FormLabel>
                <FormControl>
                  <Input placeholder="Asunto de la PQR" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe tu petición, queja o reclamo"
                    {...field}
                    rows={5}
                  />
                </FormControl>
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMINISTRATIVE">Administrativa</SelectItem>
                    <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                    <SelectItem value="SECURITY">Seguridad</SelectItem>
                    <SelectItem value="COEXISTENCE">Convivencia</SelectItem>
                    <SelectItem value="OTHER">Otra</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una prioridad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LOW">Baja</SelectItem>
                    <SelectItem value="MEDIUM">Media</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Adjuntos (Opcional)</FormLabel>
            <FormControl>
              <Input type="file" multiple onChange={handleAttachmentChange} />
            </FormControl>
            <FormMessage />
            <div className="flex space-x-2 mt-2">
              {attachmentPreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Adjunto ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
              ))}
            </div>
          </FormItem>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear PQR
          </Button>
        </form>
      </Form>
    </div>
  );
}