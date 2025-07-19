import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { io } from "socket.io-client";
import {
  Loader2,
  Calendar,
  MapPin,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Clock,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  getAssemblyById,
  registerAttendance,
  createVote,
  submitVote,
  getVoteResults,
  generateMeetingMinutes,
} from "@/services/assemblyService";
import { useToast } from "@/components/ui/use-toast";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; // Ajusta esto a la URL de tu backend NestJS

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
  votings?: Voting[]; // Added votings array
}

interface Voting {
  id: number;
  assemblyId: number;
  question: string;
  options: string[];
  isWeighted: boolean;
  status: "PENDING" | "ACTIVE" | "CLOSED" | "CANCELLED";
  startTime?: string;
  endTime?: string;
  totalVotes: number;
  totalCoefficientVoted: number;
  userHasVoted?: boolean;
}

interface VoteResult {
  option: string;
  count: number;
  coefficient: number;
}

export default function ViewAssemblyPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const assemblyId = params.id ? parseInt(params.id as string) : null;

  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuorum, setCurrentQuorum] = useState(0);
  const [activeVote, setActiveVote] = useState<Voting | null>(null);
  const [voteResults, setVoteResults] = useState<VoteResult[] | null>(null);

  const fetchAssemblyData = useCallback(async () => {
    setLoading(true);
    try {
      if (!assemblyId) {
        router.push("/admin/assemblies");
        return;
      }
      const fetchedAssembly = await getAssemblyById(assemblyId);
      if (fetchedAssembly) {
        setAssembly(fetchedAssembly);
        const activeVoting = fetchedAssembly.votings?.find(
          (v: Voting) => v.status === "ACTIVE",
        );
        if (activeVoting) {
          setActiveVote(activeVoting);
          await fetchVotingResults(assemblyId, activeVoting.id);
        }
      } else {
        toast({
          title: "Error",
          description: "Asamblea no encontrada.",
          variant: "destructive",
        });
        router.push("/admin/assemblies");
      }
    } catch (error) {
      console.error("Error fetching assembly:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la asamblea.",
        variant: "destructive",
      });
      router.push("/admin/assemblies");
    } finally {
      setLoading(false);
    }
  }, [assemblyId, router, toast]);

  const fetchVotingResults = useCallback(
    async (asmId: number, vtgId: number) => {
      try {
        const results = await getVoteResults(asmId, vtgId);
        setVoteResults(results.results); // Assuming results has a 'results' property
      } catch (error) {
        console.error("Error fetching voting results:", error);
        toast({
          title: "Error",
          description: "No se pudieron obtener los resultados de la votación.",
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  useEffect(() => {
    if (!authLoading && user && assemblyId) {
      fetchAssemblyData();

      const socket = io(`${SOCKET_URL}/assembly`, {
        query: { assemblyId, schemaName: user.schemaName, userId: user.id },
      });

      socket.on("connect", () => {
        console.log("Conectado al socket de asamblea");
        socket.emit("joinAssembly", {
          assemblyId,
          schemaName: user.schemaName,
          userId: user.id,
        });
      });

      socket.on("quorumUpdate", (data: { currentQuorum: number }) => {
        setCurrentQuorum(data.currentQuorum);
      });

      socket.on("newVote", (vote: Voting) => {
        setActiveVote(vote);
        setVoteResults(null); // Resetear resultados al iniciar nueva votación
      });

      socket.on("voteResultsUpdate", (results: VoteResult[]) => {
        setVoteResults(results);
      });

      socket.on("disconnect", () => {
        console.log("Desconectado del socket de asamblea");
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [authLoading, user, assemblyId, fetchAssemblyData]);

  const handleRegisterAttendance = async () => {
    if (!user || !assemblyId) return;
    try {
      await registerAttendance(assemblyId, {
        assemblyId,
        userId: user.id,
        present: true,
      });
      toast({
        title: "Asistencia Registrada",
        description: "Tu asistencia ha sido registrada.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar la asistencia.",
        variant: "destructive",
      });
    }
  };

  const handleCreateVote = async () => {
    if (!assemblyId) return;
    try {
      const newVote = await createVote(assemblyId, {
        assemblyId,
        question: "¿Aprueba el presupuesto 2025?",
        options: ["Sí", "No", "Abstención"],
        isWeighted: true,
      });
      setActiveVote(newVote);
      toast({
        title: "Votación Iniciada",
        description: "Se ha iniciado una nueva votación.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar la votación.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitVote = async (optionIndex: number) => {
    if (!activeVote || !user) return;
    try {
      await submitVote(activeVote.id, {
        voteId: activeVote.id,
        optionIndex,
        userId: user.id,
      });
      toast({
        title: "Voto Registrado",
        description: "Tu voto ha sido registrado.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al registrar el voto.",
        variant: "destructive",
      });
    }
  };

  const handleGetVoteResults = async () => {
    if (!activeVote) return;
    try {
      const results = await getVoteResults(activeVote.id);
      setVoteResults(results);
      toast({
        title: "Resultados Obtenidos",
        description: "Resultados de la votación actualizados.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron obtener los resultados.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateMinutes = async () => {
    if (!assemblyId) return;
    try {
      const result = await generateMeetingMinutes(assemblyId);
      toast({
        title: "Acta Generada",
        description: "El borrador del acta ha sido generado.",
      });
      // Aquí podrías redirigir o mostrar un enlace al acta
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el acta.",
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

  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "COMPLEX_ADMIN" &&
      user.role !== "RESIDENT")
  ) {
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
          Detalles de la Asamblea
        </h1>
        <Link href={`/admin/assemblies/${assembly.id}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Editar Asamblea
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información de la Asamblea</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-gray-600" />
            <span>
              Fecha: {new Date(assembly.scheduledDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-600" />
            <span>
              Hora:{" "}
              {new Date(assembly.scheduledDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-gray-600" />
            <span>Ubicación: {assembly.location}</span>
          </div>
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-gray-600" />
            <span>
              Tipo:{" "}
              {assembly.type === "ORDINARY" ? "Ordinaria" : "Extraordinaria"}
            </span>
          </div>
          <div className="flex items-center">
            {assembly.status === "COMPLETED" ? (
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
            ) : assembly.status === "CANCELLED" ? (
              <XCircle className="mr-2 h-5 w-5 text-red-600" />
            ) : (
              <Clock className="mr-2 h-5 w-5 text-yellow-600" />
            )}
            <span>
              Estado: <Badge>{assembly.status}</Badge>
            </span>
          </div>
          <div>
            <h3 className="font-semibold mt-4 mb-2">Descripción:</h3>
            <p>{assembly.description || "No hay descripción disponible."}</p>
          </div>
          <div>
            <h3 className="font-semibold mt-4 mb-2">Agenda:</h3>
            <div className="whitespace-pre-wrap border p-4 rounded-md bg-gray-50">
              {assembly.agenda}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de Quórum y Asistencia */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" /> Quórum y Asistencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Quórum Actual: <span className="font-bold">{currentQuorum}%</span>
          </p>
          <Button
            onClick={handleRegisterAttendance}
            disabled={!user || assembly.status !== "IN_PROGRESS"}
          >
            Registrar mi Asistencia
          </Button>
        </CardContent>
      </Card>

      {/* Sección de Votaciones */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Vote className="mr-2 h-5 w-5" /> Votaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeVote ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {activeVote.question}
              </h3>
              <div className="space-y-2">
                {activeVote.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleSubmitVote(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {voteResults && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                  <h4 className="font-semibold mb-2">Resultados:</h4>
                  {voteResults.map((result: VoteResult, index: number) => (
                    <p key={index}>
                      {result.option}: {result.count} votos (
                      {result.coefficient.toFixed(2)}% coeficiente)
                    </p>
                  ))}
                </div>
              )}
              {user?.role === "COMPLEX_ADMIN" && (
                <Button onClick={handleGetVoteResults} className="mt-4">
                  Ver Resultados
                </Button>
              )}
            </div>
          ) : (
            <p className="text-gray-600 mb-4">
              No hay votaciones activas en este momento.
            </p>
          )}
          {user?.role === "COMPLEX_ADMIN" && (
            <Button
              onClick={handleCreateVote}
              disabled={assembly.status !== "IN_PROGRESS"}
            >
              Iniciar Nueva Votación
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Sección de Actas y Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" /> Actas y Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Aquí se mostrarán las actas de la asamblea y otros documentos
            relevantes.
          </p>
          {user?.role === "COMPLEX_ADMIN" && (
            <Button
              onClick={handleGenerateMinutes}
              disabled={assembly.status !== "COMPLETED"}
            >
              Generar Borrador de Acta
            </Button>
          )}
          <Button variant="outline" className="mt-4">
            Ver Actas Anteriores
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
