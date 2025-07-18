"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipientType: "ALL", // ALL, RESIDENT, PROPERTY, USER
    recipientId: "", // ID of specific recipient if type is not ALL
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las notificaciones.",
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
    setSending(true);
    try {
      await sendNotification(formData);
      toast({
        title: "Éxito",
        description: "Notificación enviada correctamente.",
      });
      setFormData({
        title: "",
        message: "",
        recipientType: "ALL",
        recipientId: "",
      });
      fetchNotifications(); // Refresh list
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Error al enviar la notificación.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
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
    } catch (error) {
      console.error("Error marking as read:", error);
      toast({
        title: "Error",
        description: "Error al marcar como leída.",
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
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast({
        title: "Error",
        description: "Error al marcar todas como leídas.",
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
          <h2 className="text-xl font-semibold mb-4">Enviar Nueva Notificación</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título de la Notificación</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recipientType">Tipo de Destinatario</Label>
              <Select
                name="recipientType"
                value={formData.recipientType}
                onValueChange={(value) =>
                  handleSelectChange("recipientType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los Residentes</SelectItem>
                  <SelectItem value="RESIDENT">Residente Específico</SelectItem>
                  <SelectItem value="PROPERTY">Propiedad Específica</SelectItem>
                  <SelectItem value="USER">Usuario Específico (por ID)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(formData.recipientType === "RESIDENT" ||
              formData.recipientType === "PROPERTY" ||
              formData.recipientType === "USER") && (
              <div className="grid gap-2">
                <Label htmlFor="recipientId">ID del Destinatario</Label>
                <Input
                  id="recipientId"
                  name="recipientId"
                  value={formData.recipientId}
                  onChange={handleInputChange}
                  placeholder="Ingrese el ID"
                />
              </div>
            )}

            <Button type="submit" disabled={sending}>
              {sending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}{" "}
              Enviar Notificación
            </Button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Historial de Notificaciones</h2>
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
                    <TableCell className="line-clamp-2">{notification.message}</TableCell>
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
