"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Video, Camera, Monitor, AlertTriangle } from "lucide-react";

interface CameraFeed {
  id: string;
  name: string;
  url: string;
  status: "online" | "offline" | "recording";
}

export default function SurveillancePage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [cameraFeeds, setCameraFeeds] = useState<CameraFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeed, setSelectedFeed] = useState<CameraFeed | null>(null);

  const fetchCameraFeeds = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call to fetch camera feeds
      const mockFeeds: CameraFeed[] = [
        {
          id: "cam1",
          name: "Cámara Principal Entrada",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1", // Rick Astley for demo
          status: "online",
        },
        {
          id: "cam2",
          name: "Cámara Parqueadero",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
          status: "recording",
        },
        {
          id: "cam3",
          name: "Cámara Piscina",
          url: "", // Simulate offline
          status: "offline",
        },
      ];
      setCameraFeeds(mockFeeds);
    } catch (error) {
      console.error("Error fetching camera feeds:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las cámaras de vigilancia.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchCameraFeeds();
    }
  }, [authLoading, user, fetchCameraFeeds]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "COMPLEX_ADMIN" && user.role !== "STAFF")) {
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
        Centro de Vigilancia
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameraFeeds.length > 0 ? (
          cameraFeeds.map((feed) => (
            <Card key={feed.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {feed.status === "online" ? (
                    <Video className="mr-2 h-5 w-5 text-green-500" />
                  ) : feed.status === "recording" ? (
                    <Camera className="mr-2 h-5 w-5 text-red-500" />
                  ) : (
                    <Monitor className="mr-2 h-5 w-5 text-gray-500" />
                  )}
                  {feed.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {feed.url ? (
                  <div className="aspect-video w-full bg-gray-200 rounded-md overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={feed.url}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={feed.name}
                    ></iframe>
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                    <AlertTriangle className="h-8 w-8 mr-2" />
                    Cámara {feed.status === "offline" ? "desconectada" : "sin señal"}
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-2">
                  Estado: {feed.status}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Monitor className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">
              No hay cámaras de vigilancia configuradas
            </h3>
            <p>Contacta al administrador para configurar las cámaras.</p>
          </div>
        )}
      </div>
    </div>
  );
}
