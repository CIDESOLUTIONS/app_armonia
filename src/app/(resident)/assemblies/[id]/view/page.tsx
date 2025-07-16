"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  getAssemblyById,
  registerVote,
  getVotingResults,
} from "@/services/assemblyService";

interface Assembly {
  id: number;
  title: string;
  description?: string;
  scheduledDate: string;
  location: string;
  type: "ORDINARY" | "EXTRAORDINARY";
  agenda: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  complexId: number;
  createdBy: number;
}

interface VotingOption {
  id: number;
  text: string;
}

interface Voting {
  id: number;
  assemblyId: number;
  agendaPoint: number;
  title: string;
  description?: string;
  type: string;
  status: "PENDING" | "ACTIVE" | "CLOSED" | "CANCELLED";
  options: string[]; // Array of option texts
  startTime?: string;
  endTime?: string;
  totalVotes: number;
  totalCoefficientVoted: number;
  isApproved?: boolean;
  userHasVoted?: boolean; // Custom field to track if current user has voted
}

interface VotingResult {
  voting: Voting;
  results: { [key: string]: { count: number; coefficient: number } };
}

export default function ViewResidentAssemblyPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const assemblyId = params.id ? parseInt(params.id as string) : null;

  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [currentVoting, setCurrentVoting] = useState<Voting | null>(null);
  const [votingResults, setVotingResults] = useState<
    VotingResult["results"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [isVotingLoading, setIsVotingLoading] = useState(false);

  const fetchAssemblyData = useCallback(async () => {
    setLoading(true);
    try {
      if (!assemblyId) {
        router.push("/resident/assemblies");
        return;
      }
      const fetchedAssembly = await getAssemblyById(assemblyId);
      setAssembly(fetchedAssembly);

      // Fetch active voting for this assembly
      // In a real scenario, there might be an API to get active votings for an assembly
      // For now, we'll assume the first voting in 'votings' array is the active one if any
      // You might need to adjust this based on your backend API for active votings
      const activeVoting = (fetchedAssembly as any).votings?.find(
        (v: Voting) => v.status === "ACTIVE",
      );
      if (activeVoting) {
        setCurrentVoting(activeVoting);
        await fetchVotingResults(assemblyId, activeVoting.id);
      }
    } catch (error) {
      console.error("Error fetching assembly:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la asamblea.",
        variant: "destructive",
      });
      router.push("/resident/assemblies");
    } finally {
      setLoading(false);
    }
  }, [assemblyId, router, toast]);

  const fetchVotingResults = useCallback(
    async (asmId: number, vtgId: number) => {
      try {
        const results = await getVotingResults(asmId, vtgId);
        setVotingResults(results.results);
        // Check if user has voted
        // This would require an API endpoint to check user's vote for a specific voting
        // For now, simulate based on local state or add a new API call
        // const userVote = await checkUserVote(asmId, vtgId, user.id);
        // setCurrentVoting(prev => prev ? { ...prev, userHasVoted: !!userVote } : null);
      } catch (error) {
        console.error("Error fetching voting results:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los resultados de la votación.",
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  useEffect(() => {
    if (!authLoading && user && assemblyId) {
      fetchAssemblyData();
    }
  }, [authLoading, user, assemblyId, fetchAssemblyData]);

  const handleVote = async (optionValue: string) => {
    if (!assemblyId || !currentVoting || !user) return;
    setIsVotingLoading(true);
    try {
      await registerVote(assemblyId, currentVoting.id, optionValue);
      toast({
        title: "Éxito",
        description: "Voto registrado correctamente.",
      });
      // After voting, re-fetch results and mark user as voted
      await fetchVotingResults(assemblyId, currentVoting.id);
      setCurrentVoting((prev) =>
        prev ? { ...prev, userHasVoted: true } : null,
      );
    } catch (error: any) {
      console.error("Error registering vote:", error);
      toast({
        title: "Error",
        description: error.message || "Error al registrar el voto.",
        variant: "destructive",
      });
    } finally {
      setIsVotingLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled by AuthLayout
  }

  if (!assembly) {
    return null; // Should not happen due to redirects above
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Detalles de la Asamblea: {assembly.title}
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información de la Asamblea</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>
            <strong>Descripción:</strong>{" "}
            {assembly.description || "No hay descripción disponible."}
          </p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(assembly.scheduledDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Hora:</strong>{" "}
            {new Date(assembly.scheduledDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            <strong>Ubicación:</strong> {assembly.location}
          </p>
          <p>
            <strong>Tipo:</strong>{" "}
            {assembly.type === "ORDINARY" ? "Ordinaria" : "Extraordinaria"}
          </p>
          <p>
            <strong>Estado:</strong> <Badge>{assembly.status}</Badge>
          </p>
          <div>
            <h3 className="font-semibold mt-4 mb-2">Agenda:</h3>
            <div className="whitespace-pre-wrap border p-4 rounded-md bg-gray-50">
              {assembly.agenda}
            </div>
          </div>
        </CardContent>
      </Card>

      {currentVoting && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" /> Votación: {currentVoting.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentVoting.status === "ACTIVE" &&
            !currentVoting.userHasVoted ? (
              <div className="space-y-3">
                <p className="text-gray-700">
                  {currentVoting.description || "Selecciona tu opción:"}
                </p>
                {currentVoting.options.map((optionText, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleVote(optionText)}
                    disabled={isVotingLoading}
                  >
                    {optionText}
                  </Button>
                ))}
              </div>
            ) : currentVoting.userHasVoted ? (
              <p className="text-green-600 font-semibold">
                ¡Ya has votado en esta votación!
              </p>
            ) : (
              <p className="text-gray-500">
                La votación no está activa o ya ha finalizado.
              </p>
            )}

            {votingResults && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Resultados Parciales:</h4>
                {Object.entries(votingResults).map(([option, data]) => (
                  <p key={option} className="text-sm">
                    {option}: {data.count} votos ({data.coefficient.toFixed(2)}%
                    coeficiente)
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sección de Actas y Documentos (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" /> Actas y Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Las actas y documentos relacionados con esta asamblea se publicarán
            aquí.
          </p>
          <Button variant="outline" className="mt-4">
            Ver Documentos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}