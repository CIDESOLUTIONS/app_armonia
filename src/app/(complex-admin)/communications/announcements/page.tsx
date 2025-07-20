"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/services/announcementService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  announcementSchema,
  AnnouncementFormValues,
} from "@/validators/announcement-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Announcement {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  expiresAt?: string;
  isActive: boolean;
  targetRoles: string[];
}

export default function AnnouncementsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] =
    useState<Announcement | null>(null);

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      publishedAt: new Date().toISOString().slice(0, 16),
      expiresAt: "",
      isActive: true,
      targetRoles: [],
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los anuncios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAnnouncements();
    }
  }, [authLoading, user, fetchAnnouncements]);

  const handleAddAnnouncement = () => {
    setCurrentAnnouncement(null);
    reset({
      title: "",
      content: "",
      publishedAt: new Date().toISOString().slice(0, 16),
      expiresAt: "",
      isActive: true,
      targetRoles: [],
    });
    setIsModalOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    reset({
      title: announcement.title,
      content: announcement.content,
      publishedAt: new Date(announcement.publishedAt)
        .toISOString()
        .slice(0, 16),
      expiresAt: announcement.expiresAt
        ? new Date(announcement.expiresAt).toISOString().slice(0, 16)
        : "",
      isActive: announcement.isActive,
      targetRoles: announcement.targetRoles,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: AnnouncementFormValues) => {
    try {
      if (currentAnnouncement) {
        await updateAnnouncement(currentAnnouncement.id, data);
        toast({
          title: "Éxito",
          description: "Anuncio actualizado correctamente.",
        });
      } else {
        await createAnnouncement(data);
        toast({
          title: "Éxito",
          description: "Anuncio creado correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast({
        title: "Error",
        description: "Error al guardar el anuncio.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncementToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAnnouncement = async () => {
    if (announcementToDelete === null) return;
    try {
      await deleteAnnouncement(announcementToDelete);
      toast({
        title: "Éxito",
        description: "Anuncio eliminado correctamente.",
      });
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el anuncio.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setAnnouncementToDelete(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "COMPLEX_ADMIN")) {
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Gestión de Anuncios
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddAnnouncement}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Anuncio
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead>Expira</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>Roles Objetivo</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell>{announcement.title}</TableCell>
                  <TableCell>
                    {new Date(announcement.publishedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {announcement.expiresAt
                      ? new Date(announcement.expiresAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {announcement.isActive ? (
                      <Badge variant="default">Sí</Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>{announcement.targetRoles.join(", ")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAnnouncement(announcement)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-5">
                  No hay anuncios registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentAnnouncement ? "Editar Anuncio" : "Crear Nuevo Anuncio"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Título</FormLabel>
                    <FormControl>
                      <Input
                        id="title"
                        {...field}
                        className="col-span-3"
                        required
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Contenido</FormLabel>
                    <FormControl>
                      <Textarea
                        id="content"
                        {...field}
                        className="col-span-3"
                        required
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">
                      Fecha Publicación
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="publishedAt"
                        type="datetime-local"
                        {...field}
                        className="col-span-3"
                        required
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">
                      Fecha Expiración
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="expiresAt"
                        type="datetime-local"
                        {...field}
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Activo</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-2 col-span-full">
                <Label>Roles Objetivo</Label>
                <div className="flex flex-wrap gap-2">
                  {["ADMIN", "COMPLEX_ADMIN", "RESIDENT", "STAFF"].map(
                    (role) => (
                      <FormField
                        key={role}
                        control={control}
                        name="targetRoles"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(role)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      role,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter((r) => r !== role),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel>{role}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ),
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  {currentAnnouncement ? "Guardar Cambios" : "Crear Anuncio"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este anuncio? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmDeleteAnnouncement}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
