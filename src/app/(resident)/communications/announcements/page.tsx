"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAnnouncements } from "@/services/announcementService";

interface Announcement {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  expiresAt?: string;
  isActive: boolean;
  targetRoles: string[];
}

export default function ResidentAnnouncementsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      // Filter announcements to show only those relevant to the resident's role or public ones
      const filteredData = data.filter(announcement => 
        announcement.targetRoles.includes("RESIDENT") || 
        announcement.targetRoles.includes("ALL") // Assuming "ALL" is a possible target role
      );
      setAnnouncements(filteredData);
    } catch (error: Error) {
      console.error("Error fetching announcements:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los comunicados: " + error.message,
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "RESIDENT") {
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
        Mis Comunicados
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Contenido</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead>Expira</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell className="font-medium">{announcement.title}</TableCell>
                  <TableCell>{announcement.content}</TableCell>
                  <TableCell>{new Date(announcement.publishedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{announcement.expiresAt ? new Date(announcement.expiresAt).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={announcement.isActive ? "default" : "destructive"}>
                      {announcement.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-5">
                  No hay comunicados disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
