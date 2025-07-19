"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Video, CameraOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SurveillancePage() {
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [cameras, setCameras] = useState<any[]>([]); // Placeholder for camera data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching camera data
    const fetchCameraData = async () => {
      setLoading(true);
      try {
        // In a real application, this would fetch camera configurations from the backend
        // For now, mock data
        const mockCameras = [
          { id: "cam1", name: "Cámara Principal Entrada", streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" }, // Example YouTube embed
          { id: "cam2", name: "Cámara Parqueadero", streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" },
          { id: "cam3", name: "Cámara Zona Social", streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" },
        ];
        setCameras(mockCameras);
      } catch (err: any) {
        setError(err.message || "Error al cargar las cámaras.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchCameraData();
    }
  }, [authLoading, user]);

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
        Monitoreo de Video en Tiempo Real
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {cameras.length === 0 && !loading && !error ? (
        <div className="text-center py-12 text-gray-500">
          <CameraOff className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">
            No hay cámaras configuradas
          </h3>
          <p>Contacta al administrador para configurar las cámaras de vigilancia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameras.map((camera) => (
            <Card key={camera.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="mr-2 h-5 w-5" /> {camera.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Placeholder for video stream */}
                <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
                  {/* In a real scenario, use a video player library or WebRTC */}
                  <iframe
                    width="100%"
                    height="100%"
                    src={camera.streamUrl}
                    title={camera.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <Button className="mt-4 w-full" variant="outline">
                  Ver Controles de Cámara
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}