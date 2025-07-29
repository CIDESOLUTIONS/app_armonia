"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, QrCode, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { scanQrCode } from "@/services/visitorService"; // Assuming this service exists
import { BrowserQRCodeReader } from "@zxing/browser";

export default function ScanQrPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserQRCodeReader | null>(null);

  const startScanning = async () => {
    if (!videoRef.current) return;

    codeReader.current = new BrowserQRCodeReader();
    try {
      const videoInputDevices =
        await BrowserQRCodeReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        toast({
          title: "Error",
          description: "No se encontraron cámaras disponibles.",
          variant: "destructive",
        });
        return;
      }

      const selectedDeviceId = videoInputDevices[0].deviceId; // Use the first camera found

      codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            setScanResult(result.getText());
            handleScan(result.getText());
            codeReader.current?.reset(); // Stop scanning after a successful scan
          }
          if (err && !(err instanceof zxing.NotFoundException)) {
            console.error(err);
            // toast({ title: "Error de escaneo", description: err.message, variant: "destructive" });
          }
        },
      );
    } catch (error: any) {
      console.error("Error starting scanner:", error);
      toast({
        title: "Error",
        description: "Error al iniciar el escáner: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleScan = async (qrCode: string) => {
    setLoading(true);
    try {
      const visitorData = await scanQrCode(qrCode);
      setScanResult(visitorData);
      toast({ title: "Éxito", description: "Visitante registrado con éxito." });
    } catch (error: any) {
      console.error("Error scanning QR code:", error);
      toast({
        title: "Error",
        description: error.message || "Error al escanear el código QR.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startScanning();
    return () => {
      codeReader.current?.reset();
    };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "RECEPTION" && user.role !== "SECURITY")) {
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
        Escanear Código QR de Visitante
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-4">
          Apunte la cámara al código QR del visitante.
        </p>
        <div className="w-full max-w-md mx-auto bg-gray-200 rounded-lg overflow-hidden">
          <video ref={videoRef} className="w-full" />
        </div>
        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Escaneando...
          </div>
        )}
        {scanResult && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md flex items-center justify-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            QR Escaneado con éxito. Visitante: {scanResult.name || scanResult}
          </div>
        )}
        {!scanResult && !loading && (
          <Button onClick={startScanning} className="mt-4">
            <QrCode className="mr-2 h-4 w-4" /> Iniciar Escáner
          </Button>
        )}
      </div>
    </div>
  );
}
