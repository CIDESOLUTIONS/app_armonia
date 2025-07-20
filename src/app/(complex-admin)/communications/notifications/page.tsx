"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  sendNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notificationService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  notificationSchema,
  NotificationFormValues,
} from "@/validators/notification-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
      recipientType: "ALL",
      recipientId: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting },
  } = form;

  const recipientType = watch("recipientType");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (error: Error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las notificaciones: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchNotifications();
    }
  }, [authLoading, user, fetchNotifications]);

  const onSubmit = async (data: NotificationFormValues) => {
    try {
      await sendNotification(data);
      toast({
        title: "Éxito",
        description: "Notificación enviada correctamente.",
      });
      reset({
        title: "",
        message: "",
        recipientType: "ALL",
        recipientId: "",
      });
      fetchNotifications(); // Refresh list
    } catch (error: Error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Error al enviar la notificación: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      toast({
        title: "Éxito",
        description: "Notificación marcada como leída.",
      });
      fetchNotifications();
    } catch (error: Error) {
      console.error("Error marking as read:", error);
      toast({
        title: "Error",
        description: "Error al marcar como leída: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      toast({
        title: "Éxito",
        description: "Todas las notificaciones marcadas como leídas.",
      });
      fetchNotifications();
    } catch (error: Error) {
      console.error("Error marking all as read:", error);
      toast({
        title: "Error",
        description: "Error al marcar todas como leídas: " + error.message,
        variant: "destructive",
      });
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
        Gestión de Notificaciones
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Enviar Nueva Notificación
          </h2>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de la Notificación</FormLabel>
                    <FormControl>
                      <Input id="title" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje</FormLabel>
                    <FormControl>
                      <Textarea id="message" {...field} required rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="recipientType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Destinatario</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">
                          Todos los Residentes
                        </SelectItem>
                        <SelectItem value="RESIDENT">
                          Residente Específico
                        </SelectItem>
                        <SelectItem value="PROPERTY">
                          Propiedad Específica
                        </SelectItem>
                        <SelectItem value="USER">
                          Usuario Específico (por ID)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(recipientType === "RESIDENT" ||
                recipientType === "PROPERTY" ||
                recipientType === "USER") && (
                <FormField
                  control={control}
                  name="recipientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID del Destinatario</FormLabel>
                      <FormControl>
                        <Input
                          id="recipientId"
                          {...field}
                          placeholder="Ingrese el ID"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}{" "}
                Enviar Notificación
              </Button>
            </form>
          </Form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Historial de Notificaciones
          </h2>
          <div className="flex justify-end mb-4">
            <Button onClick={handleMarkAllAsRead} size="sm">
              Marcar todas como leídas
            </Button>
          </div>
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">No hay notificaciones.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Leída</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>{notification.title}</TableCell>
                    <TableCell className="line-clamp-2">
                      {notification.message}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{notification.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {notification.read ? (
                        <Badge variant="default">Sí</Badge>
                      ) : (
                        <Badge variant="destructive">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Marcar como leída
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}