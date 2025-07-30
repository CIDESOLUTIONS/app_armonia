"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Loader2,
  UserPlus,
  BarChart2,
  FileText,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  getAssemblyById,
  registerAttendance,
  getAssemblyQuorumStatus,
  createVote,
  submitVote,
  getVoteResults,
  generateMeetingMinutes,
  Assembly,
  CreateVoteDto,
  VoteResult,
} from "@/services/assemblyService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface VoteOption {
  id: number;
  value: string;
}

interface Vote {
  id: number;
  question: string;
  options: VoteOption[];
  isWeighted: boolean;
  isActive: boolean;
}

export default function AssemblyDetailPage() {
  const params = useParams();
  const assemblyId = params.id ? parseInt(params.id as string) : null;
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [loading, setLoading] = useState(true);
  const [quorumStatus, setQuorumStatus] = useState<{
    currentAttendance: number;
    quorumMet: boolean;
  } | null>(null);
  const [isCreateVoteDialogOpen, setIsCreateVoteDialogOpen] = useState(false);
  const [newVoteForm, setNewVoteForm] = useState<CreateVoteDto>({
    assemblyId: assemblyId || 0,
    question: "",
    options: ["", ""],
    isWeighted: false,
  });
  const [votes, setVotes] = useState<Vote[]>([]); // Correctly typed
  const [voteResults, setVoteResults] = useState<{
    [voteId: number]: VoteResult;
  }>({});

  const fetchAssemblyData = async () => {
    if (!assemblyId) return;
    setLoading(true);
    try {
      const fetchedAssembly = await getAssemblyById(
        assemblyId,
        user?.complexId || "",
      );
      setAssembly(fetchedAssembly);
      const fetchedQuorum = await getAssemblyQuorumStatus(
        assemblyId,
        user?.complexId || "",
      );
      setQuorumStatus(fetchedQuorum);
      // Fetch votes for this assembly
      // Assuming an endpoint to get votes by assemblyId exists or can be added
      // For now, mock votes or fetch all and filter
      // const fetchedVotes = await getVotesByAssemblyId(assemblyId);
      // setVotes(fetchedVotes);
    } catch (error) {
      console.error("Error fetching assembly data:", error);
      const description =
        error instanceof Error
          ? "No se pudo cargar la información de la asamblea: " + error.message
          : "No se pudo cargar la información de la asamblea.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssemblyData();
  }, [assemblyId, user?.complexId]);

  const handleRegisterAttendance = async (
    userId: number,
    _present: boolean,
  ) => {
    if (!assemblyId || !user?.complexId) return;
    try {
      await registerAttendance(assemblyId, userId, true, user.complexId); // Assuming unitId 1 for now
      toast({
        title: "Éxito",
        description: `Asistencia registrada para la unidad ${userId}.`,
      });
      fetchAssemblyData(); // Refresh data
    } catch (error) {
      console.error("Error registering attendance:", error);
      const description =
        error instanceof Error
          ? "Error al registrar asistencia: " + error.message
          : "Error al registrar asistencia.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    }
  };

  const handleCreateVote = async () => {
    if (!assemblyId || !user?.complexId) return;
    try {
      const createdVote = await createVote(
        { ...newVoteForm, assemblyId },
        user.complexId,
      );
      setVotes((prev) => [...prev, createdVote]);
      toast({
        title: "Éxito",
        description: "Votación creada correctamente.",
      });
      setIsCreateVoteDialogOpen(false);
      setNewVoteForm({
        assemblyId,
        question: "",
        options: ["", ""],
        isWeighted: false,
      });
    } catch (error) {
      console.error("Error creating vote:", error);
      const description =
        error instanceof Error
          ? "Error al crear votación: " + error.message
          : "Error al crear votación.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    }
  };

  const handleGetVoteResults = async (voteId: number) => {
    if (!user?.complexId) return;
    try {
      const results = await getVoteResults(voteId, user.complexId);
      setVoteResults((prev) => ({ ...prev, [voteId]: results }));
      toast({
        title: "Éxito",
        description: "Resultados de votación cargados.",
      });
    } catch (error) {
      console.error("Error fetching vote results:", error);
      const description =
        error instanceof Error
          ? "Error al cargar resultados de votación: " + error.message
          : "Error al cargar resultados de votación.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    }
  };

  const handleSubmitVote = async (
    voteId: number,
    option: string,
    weight: number,
  ) => {
    if (!user?.id || !user?.complexId) return;
    try {
      await submitVote(voteId, user.id, option, 1, weight, user.complexId); // Assuming unitId 1 for now
      toast({
        title: "Éxito",
        description: "Voto registrado correctamente.",
      });
      handleGetVoteResults(voteId); // Refresh results after voting
    } catch (error) {
      console.error("Error submitting vote:", error);
      const description =
        error instanceof Error
          ? "Error al registrar el voto: " + error.message
          : "Error al registrar el voto.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    }
  };

  const handleGenerateMinutes = async () => {
    if (!assemblyId || !user?.complexId) return;
    try {
      const pdfBlob = await generateMeetingMinutes(assemblyId, user.complexId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Acta_Asamblea_${assembly?.title.replace(/\s/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Éxito",
        description: "Acta generada y descargada correctamente.",
      });
    } catch (error) {
      console.error("Error generating meeting minutes:", error);
      const description =
        error instanceof Error
          ? "Error al generar el acta de la asamblea: " + error.message
          : "Error al generar el acta de la asamblea.";
      toast({
        title: "Error",
        description,
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
        <h1 className="text-2xl font-bold text-gray-900">
          Asamblea no encontrada
        </h1>
        <p className="text-gray-600">
          La asamblea que buscas no existe o ha sido eliminada.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Detalles de Asamblea: {assembly.title}
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
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
            <strong>Tipo:</strong> {assembly.type}
          </p>
          <p>
            <strong>Estado:</strong> {assembly.status}
          </p>
          <p>
            <strong>Agenda:</strong> {assembly.agenda}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estado del Quórum</CardTitle>
        </CardHeader>
        <CardContent>
          {quorumStatus ? (
            <p>
              Asistencia Actual: {quorumStatus.currentAttendance} - Quórum:{" "}
              {quorumStatus.quorumMet ? "Alcanzado" : "No Alcanzado"}
            </p>
          ) : (
            <p>Cargando estado del quórum...</p>
          )}
          <Button
            onClick={() => handleRegisterAttendance(user?.id || 0, true)}
            className="mt-4"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Registrar mi Asistencia
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Votaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setIsCreateVoteDialogOpen(true)}
            className="mb-4"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva Votación
          </Button>
          {votes.length > 0 ? (
            votes.map((vote) => (
              <div key={vote.id} className="border p-4 rounded-md mb-4">
                <h3 className="text-lg font-semibold">{vote.question}</h3>
                <p>Ponderada: {vote.isWeighted ? "Sí" : "No"}</p>
                <p>Activa: {vote.isActive ? "Sí" : "No"}</p>
                <div className="mt-2">
                  {vote.options.map((option: VoteOption) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="mr-2 mb-2"
                      onClick={
                        () => handleSubmitVote(vote.id, option.value, 1) // Assuming weight 1 for now
                      }
                    >
                      {" "}
                      {option.value}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() => handleGetVoteResults(vote.id)}
                  className="mt-2"
                >
                  <BarChart2 className="mr-2 h-4 w-4" /> Ver Resultados
                </Button>
                {voteResults[vote.id] && (
                  <div className="mt-4 p-2 border-t">
                    <h4 className="font-semibold">Resultados:</h4>
                    {voteResults[vote.id].results.map((result, index) => (
                      <p key={index}>
                        {result.value}: {result.totalWeight} votos
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No hay votaciones registradas para esta asamblea.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acta de Asamblea</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateMinutes}>
            <FileText className="mr-2 h-4 w-4" /> Generar Acta (PDF)
          </Button>
        </CardContent>
      </Card>

      {/* Dialog for creating a new vote */}
      <Dialog
        open={isCreateVoteDialogOpen}
        onOpenChange={setIsCreateVoteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Votación</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="voteQuestion">Pregunta</Label>
              <Input
                id="voteQuestion"
                value={newVoteForm.question}
                onChange={(e) =>
                  setNewVoteForm({ ...newVoteForm, question: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Opciones</Label>
              {newVoteForm.options.map((option, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newVoteForm.options];
                      newOptions[index] = e.target.value;
                      setNewVoteForm({ ...newVoteForm, options: newOptions });
                    }}
                  />
                  {newVoteForm.options.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = newVoteForm.options.filter(
                          (_, i) => i !== index,
                        );
                        setNewVoteForm({ ...newVoteForm, options: newOptions });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setNewVoteForm({
                    ...newVoteForm,
                    options: [...newVoteForm.options, ""],
                  })
                }
              >
                Añadir Opción
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isWeighted"
                checked={newVoteForm.isWeighted}
                onCheckedChange={(checked) =>
                  setNewVoteForm({
                    ...newVoteForm,
                    isWeighted: checked as boolean,
                  })
                }
              />
              <Label htmlFor="isWeighted">Votación Ponderada</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateVoteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateVote}>Crear Votación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
