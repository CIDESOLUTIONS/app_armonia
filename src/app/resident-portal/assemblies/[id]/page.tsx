"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2, CheckCircle, XCircle, UserPlus, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getAssemblyById, registerAttendance, getAssemblyQuorumStatus, submitVote, Assembly, Vote, VoteResult } from "@/services/assemblyService";

export default function ResidentAssemblyDetailPage() {
  const params = useParams();
  const assemblyId = params.id ? parseInt(params.id as string) : null;
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [loading, setLoading] = useState(true);
  const [quorumStatus, setQuorumStatus] = useState<{ currentAttendance: number; quorumMet: boolean } | null>(null);
  const [voteResults, setVoteResults] = useState<{ [voteId: number]: VoteResult }>({});

  const fetchAssemblyData = async () => {
    if (!assemblyId) return;
    setLoading(true);
    try {
      const fetchedAssembly = await getAssemblyById(assemblyId);
      setAssembly(fetchedAssembly);
      const fetchedQuorum = await getAssemblyQuorumStatus(assemblyId);
      setQuorumStatus(fetchedQuorum);
    } catch (error) {
      console.error("Error fetching assembly data:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información de la asamblea.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssemblyData();
  }, [assemblyId]);

  const handleRegisterAttendance = async (present: boolean) => {
    if (!assemblyId || !user?.id) return;
    try {
      await registerAttendance(assemblyId, user.id, present);
      toast({
        title: "Éxito",
        description: "Asistencia registrada correctamente.",
      });
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

  const handleSubmitVote = async (voteId: number, optionId: number, weight: number) => {
    if (!user?.id) return;
    try {
      await submitVote({ voteId, optionId, userId: user.id, weight });
      toast({
        title: "Éxito",
        description: "Voto registrado correctamente.",
      });
      // Optionally refresh vote results or disable voting for this user
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast({
        title: "Error",
        description: "Error al registrar el voto.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!assembly) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Asamblea no encontrada</h1>
        <p className="text-gray-600">La asamblea que buscas no existe o ha sido eliminada.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Detalles de Asamblea: {assembly.title}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <p><strong>Descripción:</strong> {assembly.description}</p>
          <p><strong>Fecha:</strong> {new Date(assembly.scheduledDate).toLocaleString()}</p>
          <p><strong>Ubicación:</strong> {assembly.location}</p>
          <p><strong>Tipo:</strong> {assembly.type}</p>
          <p><strong>Estado:</strong> {assembly.status}</p>
          <p><strong>Agenda:</strong> {assembly.agenda}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estado del Quórum</CardTitle>
        </CardHeader>
        <CardContent>
          {quorumStatus ? (
            <p>Asistencia Actual: {quorumStatus.currentAttendance} - Quórum: {quorumStatus.quorumMet ? "Alcanzado" : "No Alcanzado"}</p>
          ) : (
            <p>Cargando estado del quórum...</p>
          )}
          <Button onClick={() => handleRegisterAttendance(true)} className="mt-4">
            <UserPlus className="mr-2 h-4 w-4" /> Registrar mi Asistencia
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Votaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {assembly.votes && assembly.votes.length > 0 ? (
            assembly.votes.map((vote) => (
              <div key={vote.id} className="border p-4 rounded-md mb-4">
                <h3 className="text-lg font-semibold">{vote.question}</h3>
                <p>Ponderada: {vote.isWeighted ? "Sí" : "No"}</p>
                <p>Activa: {vote.isActive ? "Sí" : "No"}</p>
                <div className="mt-2">
                  {vote.options.map((option) => (
                    <Button key={option.id} variant="outline" className="mr-2 mb-2" onClick={() => handleSubmitVote(vote.id, option.id, 1)}> {/* Simplified weight for now */}
                      {option.value}
                    </Button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No hay votaciones registradas para esta asamblea.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}