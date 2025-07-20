"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, X } from "lucide-react";
import {
  getListingById,
  updateListing,
  uploadImage,
  getMarketplaceCategories,
} from "@/services/marketplaceService";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres."),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive("El precio debe ser un número positivo."),
  ),
  category: z.string({
    errorMap: () => ({ message: "La categoría es requerida." }),
  }),
  images: z.array(z.string()).optional(), // URLs de imágenes existentes
  newImages: z
    .array(z.instanceof(File))
    .max(5, "Solo se permiten hasta 5 imágenes nuevas.")
    .optional(), // Nuevas imágenes a subir
  status: z.enum(["ACTIVE", "SOLD", "PAUSED"]), // Estado del anuncio
});

export default function EditListingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const listingId = params.id ? parseInt(params.id as string) : null;

  const [loading, setLoading] = useState(true);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      images: [],
      newImages: [],
      status: "ACTIVE",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchListingData = useCallback(async () => {
    setLoading(true);
    try {
      if (!listingId) {
        router.push("/resident/marketplace/my-listings");
        return;
      }
      const fetchedListing = await getListingById(listingId);
      if (fetchedListing) {
        reset({
          title: fetchedListing.title,
          description: fetchedListing.description,
          price: fetchedListing.price,
          category: fetchedListing.category,
          images: fetchedListing.images,
          status: fetchedListing.status,
        });
        setImagePreviews(fetchedListing.images || []);
      } else {
        toast({
          title: "Error",
          description: "Anuncio no encontrado.",
          variant: "destructive",
        });
        router.push("/resident/marketplace/my-listings");
      }

      const fetchedCategories = await getMarketplaceCategories();
      setCategories(fetchedCategories);
    } catch (error: Error) {
      console.error("Error fetching listing data:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el anuncio: " + error.message,
        variant: "destructive",
      });
      router.push("/resident/marketplace/my-listings");
    } finally {
      setLoading(false);
    }
  }, [listingId, router, toast, reset]);

  useEffect(() => {
    fetchListingData();
  }, [fetchListingData]);

  const handleNewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const currentImages = form.getValues("images") || [];
      if (files.length + currentImages.length > 5) {
        toast({
          title: "Error",
          description: "Solo puedes subir un máximo de 5 imágenes en total.",
          variant: "destructive",
        });
        event.target.value = "";
        return;
      }

      form.setValue("newImages", files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...currentImages, ...previews]);
    }
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    const currentImages = form.getValues("images") || [];
    const updatedImages = currentImages.filter(
      (_, index) => index !== indexToRemove,
    );
    form.setValue("images", updatedImages);
    setImagePreviews(updatedImages);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    if (!listingId) return;

    try {
      const imageUrls: string[] = values.images || [];
      if (values.newImages && values.newImages.length > 0) {
        for (const imageFile of values.newImages) {
          const url = await uploadImage(imageFile);
          imageUrls.push(url.url);
        }
      }

      await updateListing(listingId, {
        title: values.title,
        description: values.description,
        price: values.price,
        category: values.category,
        images: imageUrls,
        status: values.status,
      });
      toast({
        title: "Éxito",
        description: "Anuncio actualizado correctamente.",
      });
      router.push("/resident/marketplace/my-listings");
    } catch (error: Error) {
      console.error("Error updating listing:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el anuncio: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Anuncio</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado del Anuncio</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Activo</SelectItem>
                      <SelectItem value="SOLD">Vendido</SelectItem>
                      <SelectItem value="PAUSED">Pausado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label>Imágenes</Label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={src}
                      alt={`Preview ${index}`}
                      width={100}
                      height={100}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 rounded-full h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveExistingImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <FormField
                control={control}
                name="newImages"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        id="newImages"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleNewImageChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}{" "}
              Guardar Cambios
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}