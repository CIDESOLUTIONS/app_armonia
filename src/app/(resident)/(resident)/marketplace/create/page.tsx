
"use client";

import React, { useState } from "react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { createListing } from "@/services/marketplaceService";
import { useAuthStore } from "@/store/authStore";

const formSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres."),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive("El precio debe ser un número positivo."),
  ),
  category: z.string().min(1, "La categoría es requerida."),
  images: z.array(z.string()).optional(), // Simplificado por ahora
});

export default function CreateListingPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      images: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) {
      toast({ title: "Error", description: "Debes iniciar sesión para publicar un anuncio." });
      return;
    }

    setLoading(true);
    try {
      await createListing({
        ...values,
        authorId: user.id,
        // complexId: user.complexId, // Asegúrate de que el complexId se obtenga del usuario autenticado
      });
      toast({
        title: "Éxito",
        description: "Anuncio publicado correctamente.",
      });
      router.push("/resident/resident/marketplace");
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: "No se pudo publicar el anuncio.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Publicar Nuevo Anuncio</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título del anuncio" {...field} />
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
                  <Textarea placeholder="Describe tu producto o servicio" {...field} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
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
                <FormControl>
                  <Input placeholder="Ej: Electrónica, Servicios, Hogar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campo para imágenes - simplificado por ahora */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publicar Anuncio
          </Button>
        </form>
      </Form>
    </div>
  );
}
