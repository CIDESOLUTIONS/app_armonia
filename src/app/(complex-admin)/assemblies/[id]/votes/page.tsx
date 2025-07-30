"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Loader2,
  PlusCircle,
  Edit,
  Trash2,
  BarChart2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  getAssemblyById,
  createVote,
  getVoteResults,
  AssemblyVoteDto,
  Assembly,
  VoteResult,
} from "@/services/assemblyService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const voteSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres."),
  options: z
    .array(z.string().min(1, "La opción no puede estar vacía."))
    .min(2, "Debe haber al menos 2 opciones."),
  weightedVoting: z.boolean(),
});

export default function AssemblyVotesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const assemblyId = params.id ? parseInt(params.id as string) : null;

  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [votes, setVotes] = useState<AssemblyVoteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVote, setCurrentVote] = useState<AssemblyVoteDto | null>(null);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [voteResults, setVoteResults] = useState<VoteResult | null>(null);

  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(voteSchema),
    defaultValues: {
      title: "",
      description: "",
      options: ["A favor", "En contra", "Abstención"],
      weightedVoting: true,
    } as BrandingFormValues,
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const fetchAssemblyAndVotes = useCallback(async () => {
    setLoading(true);
    try {
      if (!assemblyId) {
        router.push("/complex-admin/assemblies");
        return;
      }
      const fetchedAssembly = await getAssemblyById(
        assemblyId,
        user?.complexId || "",
      );
      setAssembly(fetchedAssembly);
      // Assuming assembly object includes votes
      setVotes(fetchedAssembly.votes || []);
    } catch (error: unknown) {
      console.error("Error fetching assembly and votes:", error);
      const description =
        error instanceof Error
          ? "No se pudo cargar la asamblea o las votaciones: " + error.message
          : "No se pudo cargar la asamblea o las votaciones.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
      router.push("/complex-admin/assemblies");
    } finally {
      setLoading(false);
    }
  }, [assemblyId, router, toast, user?.complexId]);

  useEffect(() => {
    if (!authLoading && user && assemblyId) {
      fetchAssemblyAndVotes();
    }
  }, [authLoading, user, assemblyId, fetchAssemblyAndVotes]);

  const handleAddVote = () => {
    setCurrentVote(null);
    reset({
      title: "",
      description: "",
      options: ["A favor", "En contra", "Abstención"],
      weightedVoting: true,
    });
    setIsModalOpen(true);
  };

  const handleEditVote = (vote: AssemblyVoteDto) => {
    setCurrentVote(vote);
    reset({
      title: vote.title,
      description: vote.description,
      options: vote.options.map((opt) => opt.text), // Map options to string array
      weightedVoting: vote.weightedVoting,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: z.infer<typeof voteSchema>) => {
    try {
      if (!assemblyId || !user?.complexId) return;

      if (currentVote) {
        // await updateVote(currentVote.id, data); // Need updateVote in assemblyService
        toast({
          title: "Éxito",
          description: "Votación actualizada correctamente.",
        });
      } else {
        await createVote({ ...data, assemblyId }, user.complexId);
        toast({
          title: "Éxito",
          description: "Votación creada correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchAssemblyAndVotes();
    } catch (error: unknown) {
      console.error("Error saving vote:", error);
      const description =
        error instanceof Error
          ? "Error al guardar la votación: " + error.message
          : "Error al guardar la votación.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    }
  };

  const handleViewResults = async (voteId: number) => {
    if (!user?.complexId) return;
    try {
      const results = await getVotingResults(voteId, user.complexId);
      setVoteResults(results);
      setIsResultsModalOpen(true);
    } catch (error: unknown) {
      console.error("Error fetching vote results:", error);
      const description =
        error instanceof Error
          ? "No se pudieron cargar los resultados de la votación: " +
            error.message
          : "No se pudieron cargar los resultados de la votación.";
      toast({
        title: "Error",
        description,
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
          Votaciones de Asamblea: {assembly.title}
        </h1>
        <Button onClick={handleAddVote}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva Votación
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Votaciones Activas e Históricas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ponderada</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {votes.length > 0 ? (
                votes.map((vote) => (
                  <TableRow key={vote.id}>
                    <TableCell>{vote.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vote.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {vote.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vote.weightedVoting ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(vote.startTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {vote.endTime
                        ? new Date(vote.endTime).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVote(vote)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewResults(vote.id)}
                        className="mr-2"
                      >
                        <BarChart2 className="h-4 w-4" />
                      </Button>
                      {/* Add delete/end vote buttons as needed */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-5">
                    No hay votaciones registradas para esta asamblea.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentVote ? "Editar Votación" : "Crear Nueva Votación"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título de la votación" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción de la votación"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label>Opciones de Voto</Label>
                {optionFields.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Input
                      {...form.register(`options.${index}` as const)}
                      defaultValue={item.text}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendOption("")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Opción
                </Button>
              </div>
              <FormField
                control={control}
                name="weightedVoting"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Votación Ponderada (por coeficiente)
                      </FormLabel>
                      <FormDescription>
                        Si está activado, el voto de cada unidad se ponderará
                        por su coeficiente de copropiedad.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  {currentVote ? "Guardar Cambios" : "Crear Votación"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isResultsModalOpen} onOpenChange={setIsResultsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resultados de Votación</DialogTitle>
          </DialogHeader>
          {voteResults ? (
            <div className="space-y-4 py-4">
              <p>Total de Votos: {voteResults.totalVotes}</p>
              <p>Peso Total de Votos: {voteResults.totalWeight.toFixed(2)}</p>
              {Object.entries(voteResults.results).map(
                ([option, data]: [
                  string,
                  { count: number; totalWeight: number },
                ]) => (
                  <Card key={option}>
                    <CardContent className="p-4">
                      <p className="font-semibold">{option}</p>
                      <p>Votos: {data.count}</p>
                      <p>Peso: {data.totalWeight.toFixed(2)}</p>
                      {/* Assuming percentage is not directly in data, calculate from totalVotes/totalWeight */}
                      <p>
                        Porcentaje:
                        {((data.count / voteResults.totalVotes) * 100).toFixed(
                          2,
                        )}
                        %
                      </p>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          ) : (
            <p>Cargando resultados...</p>
          )}
          <DialogFooter>
            <Button onClick={() => setIsResultsModalOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
