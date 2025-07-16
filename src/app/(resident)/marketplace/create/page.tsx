"use client";

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Placeholder for image upload service
const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Uploading file:", file.name);
      resolve(`https://example.com/images/${file.name}`);
    }, 1000);
  });
};

const categories = [
  "Electrónica",
  "Servicios",
  "Hogar",
  "Vehículos",
  "Inmuebles",
  "Otros",
];

const formSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres."),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive("El precio debe ser un número positivo."),
  ),
  category: z.enum(categories as [string, ...string[]], {
    errorMap: () => ({ message: "La categoría es requerida." }),
  }),
  images: z.array(z.any()).optional(), // Will be refined to z.instanceof(File) later
});

export default function CreateListingPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      form.setValue("images", files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para publicar un anuncio.",
      });
      return;
    }

    setLoading(true);
    try {
      const imageUrls: string[] = [];
      if (values.images && values.images.length > 0) {
        for (const imageFile of values.images) {
          const url = await uploadImage(imageFile);
          imageUrls.push(url);
        }
      }

      await createListing({
        ...values,
        images: imageUrls,
        authorId: user.id,
        complexId: user.complexId, // Asegúrate de que el complexId se obtenga del usuario autenticado
      });
      toast({
        title: "Éxito",
        description: "Anuncio publicado correctamente.",
      });
      router.push("/resident/marketplace");
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Publicar Nuevo Anuncio
      </h1>
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
                  <Textarea
                    placeholder="Describe tu producto o servicio"
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
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imágenes</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </FormControl>
                <FormMessage />
                <div className="mt-2 flex flex-wrap gap-2">
                  {imagePreviews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Preview ${index}`}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publicar Anuncio
          </Button>
        </form>
      </Form>
    </div>
  );
}
