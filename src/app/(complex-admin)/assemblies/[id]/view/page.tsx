"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2, CheckCircle, XCircle, UserPlus, Users, BarChart2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  getAssemblyById,
  updateAssembly,
  registerAttendance,
  getAssemblyQuorumStatus,
  generateMeetingMinutes,
} from "@/services/assemblyService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";

interface Assembly {
  id: number;
  title: string;
  description: string;
  scheduledDate: string;
  location: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  realtimeChannel: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  attendees?: any[]; // Simplified for now
  votes?: any[]; // Simplified for now
}

interface QuorumStatus {
  currentAttendance: number;
  quorumMet: boolean;
  totalUnits: number;
  presentUnits: number;
  totalCoefficients: number;
  presentCoefficients: number;
  quorumPercentage: number;
  requiredQuorum: number;
  timestamp: string;
}

export default function ViewAssemblyPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const assemblyId = params.id ? parseInt(params.id as string) : null;

  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [loading, setLoading] = useState(true);
  const [quorumStatus, setQuorumStatus] = useState<QuorumStatus | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [unitIdToRegister, setUnitIdToRegister] = useState<number | null>(null);

  const fetchAssemblyData = useCallback(async () => {
    setLoading(true);
    try {
      if (!assemblyId) {
        router.push("/complex-admin/assemblies");
        return;
      }
      const fetchedAssembly = await getAssemblyById(assemblyId);
      setAssembly(fetchedAssembly);

      const fetchedQuorumStatus = await getAssemblyQuorumStatus(assemblyId);
      setQuorumStatus(fetchedQuorumStatus);
    } catch (error) {
      console.error("Error fetching assembly data:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la asamblea.",
        variant: "destructive",
      });
      router.push("/complex-admin/assemblies");
    } finally {
      setLoading(false);
    }
  }, [assemblyId, router, toast]);

  useEffect(() => {
    if (!authLoading && user && assemblyId) {
      fetchAssemblyData();
    }
  }, [authLoading, user, assemblyId, fetchAssemblyData]);

  const handleRegisterAttendance = async () => {
    if (!assemblyId || !unitIdToRegister || !user?.id) return;

    try {
      await registerAttendance(assemblyId, unitIdToRegister, true); // Assuming 'true' for present
      toast({
        title: "Éxito",
        description: `Asistencia registrada para la unidad ${unitIdToRegister}.`,
      });
      setIsAttendanceModalOpen(false);
      setUnitIdToRegister(null);
      fetchAssemblyData(); // Refresh data
    } catch (error) {
      console.error("Error registering attendance:", error);
      toast({
        title: "Error",
        description: "Error al registrar asistencia.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateMinutes = async () => {
    if (!assemblyId) return;
    try {
      const pdfBlob = await generateMeetingMinutes(assemblyId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `acta_asamblea_${assemblyId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Éxito",
        description: "Acta generada y descargada correctamente.",
      });
    } catch (error) {
      console.error("Error generating minutes:", error);
      toast({
        title: "Error",
        description: "Error al generar el acta.",
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

  if (!assembly) {
    return null; // Should not happen due to redirects above
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Detalles de Asamblea: {assembly.title}
        </h1>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAttendanceModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Registrar Asistencia
          </Button>
          <Button onClick={handleGenerateMinutes}>
            <FileText className="mr-2 h-4 w-4" /> Generar Acta
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>
            <strong>Descripción:</strong> {assembly.description}
          </p>
          <p>
            <strong>Fecha Programada:</strong>{" "}
            {new Date(assembly.scheduledDate).toLocaleString()}
          </p>
          <p>
            <strong>Ubicación:</strong> {assembly.location}
          </p>
          <p>
            <strong>Estado:</strong> <Badge>{assembly.status}</Badge>
          </p>
        </CardContent>
      </Card>

      {quorumStatus && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" /> Estado del Quórum
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p>
              <strong>Unidades Presentes:</strong> {quorumStatus.presentUnits} de{" "}
              {quorumStatus.totalUnits}
            </p>
            <p>
              <strong>Coeficiente Presente:</strong>{" "}
              {quorumStatus.presentCoefficients.toFixed(2)} de{" "}
              {quorumStatus.totalCoefficients.toFixed(2)}
            </p>
            <p>
              <strong>Porcentaje de Quórum:</strong>{" "}
              {quorumStatus.quorumPercentage.toFixed(2)}% (Requerido:{" "}
              {quorumStatus.requiredQuorum}%)
            </p>
            <p>
              <strong>Quórum Alcanzado:</strong>{" "}
              {quorumStatus.quorumMet ? (
                <Badge variant="default">Sí</Badge>
              ) : (
                <Badge variant="destructive">No</Badge>
              )}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sección de Votaciones */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2 h-5 w-5" /> Votaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Gestiona las votaciones de esta asamblea.
          </p>
          <Link href={`/complex-admin/assemblies/${assembly.id}/votes`}>
            <Button variant="outline">
              Gestionar Votaciones
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Dialog open={isAttendanceModalOpen} onOpenChange={setIsAttendanceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Asistencia</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitId" className="text-right">Unidad ID</Label>
              <Input
                id="unitId"
                type="number"
                value={unitIdToRegister || ""}
                onChange={(e) => setUnitIdToRegister(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttendanceModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRegisterAttendance} disabled={!unitIdToRegister}>
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
