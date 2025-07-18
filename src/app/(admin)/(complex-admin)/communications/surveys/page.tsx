"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, PlusCircle, Edit, Trash2, BarChart2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Survey {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "draft";
  startDate: string;
  endDate: string;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
  votes?: number; // For results
}

export default function SurveysPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [newSurveyForm, setNewSurveyForm] = useState<Partial<Survey>>({
    title: "",
    description: "",
    status: "draft",
    startDate: "",
    endDate: "",
    questions: [],
  });
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newOptionsText, setNewOptionsText] = useState("");

  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Call backend API to fetch surveys
      const fetchedSurveys: Survey[] = [
        {
          id: "1",
          title: "Encuesta de Satisfacción",
          description: "Queremos conocer tu opinión sobre los servicios.",
          status: "active",
          startDate: "2024-07-01T09:00:00",
          endDate: "2024-07-31T23:59:59",
          questions: [
            {
              id: "q1",
              text: "¿Qué tan satisfecho estás con la administración?",
              options: [
                { id: "o1", text: "Muy Satisfecho" },
                { id: "o2", text: "Satisfecho" },
                { id: "o3", text: "Neutral" },
                { id: "o4", text: "Insatisfecho" },
              ],
            },
          ],
        },
        {
          id: "2",
          title: "Votación para Nueva Amenidad",
          description: "Elige la próxima amenidad para el conjunto.",
          status: "completed",
          startDate: "2024-06-01T09:00:00",
          endDate: "2024-06-15T23:59:59",
          questions: [
            {
              id: "q2",
              text: "¿Qué amenidad prefieres?",
              options: [
                { id: "o5", text: "Gimnasio", votes: 15 },
                { id: "o6", text: "Salón Comunal", votes: 20 },
                { id: "o7", text: "Zona BBQ", votes: 10 },
              ],
            },
          ],
        },
      ];
      setSurveys(fetchedSurveys);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las encuestas/votaciones.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      fetchSurveys();
    }
  }, [user, fetchSurveys]);

  const handleFormChange = (field: string, value: any) => {
    setNewSurveyForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddQuestion = () => {
    if (newQuestionText.trim() && newOptionsText.trim()) {
      const options = newOptionsText.split(",").map((opt) => ({
        id: Math.random().toString(36).substr(2, 9),
        text: opt.trim(),
      }));
      setNewSurveyForm((prev) => ({
        ...prev,
        questions: [
          ...(prev.questions || []),
          {
            id: Math.random().toString(36).substr(2, 9),
            text: newQuestionText.trim(),
            options,
          },
        ],
      }));
      setNewQuestionText("");
      setNewOptionsText("");
    } else {
      toast({
        title: "Advertencia",
        description:
          "Por favor, ingresa texto para la pregunta y al menos una opción.",
        variant: "warning",
      });
    }
  };

  const handleSubmitSurvey = async () => {
    if (!newSurveyForm.title || newSurveyForm.questions.length === 0) {
      toast({
        title: "Advertencia",
        description: "El título y al menos una pregunta son requeridos.",
        variant: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      // TODO: Call backend API to create/update survey
      console.log("Saving survey:", newSurveyForm);
      toast({
        title: "Éxito",
        description: "Encuesta/Votación guardada correctamente.",
      });
      setIsFormDialogOpen(false);
      setNewSurveyForm({
        title: "",
        description: "",
        status: "draft",
        startDate: "",
        endDate: "",
        questions: [],
      });
      fetchSurveys();
    } catch (error) {
      console.error("Error saving survey:", error);
      toast({
        title: "Error",
        description: "Error al guardar la encuesta/votación.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSurvey = (survey: Survey) => {
    setCurrentSurvey(survey);
    setNewSurveyForm(survey);
    setIsFormDialogOpen(true);
  };

  const handleDeleteSurvey = async (id: string) => {
    if (
      !confirm("¿Estás seguro de que quieres eliminar esta encuesta/votación?")
    ) {
      return;
    }
    setLoading(true);
    try {
      // TODO: Call backend API to delete survey
      console.log("Deleting survey:", id);
      toast({
        title: "Éxito",
        description: "Encuesta/Votación eliminada correctamente.",
      });
      fetchSurveys();
    } catch (error) {
      console.error("Error deleting survey:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la encuesta/votación.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = (survey: Survey) => {
    setCurrentSurvey(survey);
    setIsResultsDialogOpen(true);
  };

  const formatDateDisplay = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
  };

  if (loading) {
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Encuestas y Votaciones
        </h1>
        <Button onClick={() => setIsFormDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva
        </Button>
      </div>

      {surveys.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <BarChart2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">
            No hay encuestas o votaciones disponibles
          </h3>
          <p>Crea tu primera encuesta o votación para empezar.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell className="font-medium">
                      {survey.title}
                    </TableCell>
                    <TableCell>{survey.status}</TableCell>
                    <TableCell>{formatDateDisplay(survey.startDate)}</TableCell>
                    <TableCell>{formatDateDisplay(survey.endDate)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleEditSurvey(survey)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleViewResults(survey)}
                      >
                        <BarChart2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSurvey(survey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialogo para Crear/Editar Encuesta/Votación */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentSurvey ? "Editar" : "Crear Nueva"} Encuesta/Votación
            </DialogTitle>
            <DialogDescription>
              Define los detalles y preguntas de tu encuesta o votación.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="surveyTitle">Título</Label>
              <Input
                id="surveyTitle"
                value={newSurveyForm.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                placeholder="Título de la encuesta o votación"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surveyDescription">Descripción</Label>
              <Textarea
                id="surveyDescription"
                value={newSurveyForm.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                placeholder="Descripción detallada"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={newSurveyForm.startDate}
                  onChange={(e) =>
                    handleFormChange("startDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={newSurveyForm.endDate}
                  onChange={(e) => handleFormChange("endDate", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={newSurveyForm.status}
                onValueChange={(value) => handleFormChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Preguntas</CardTitle>
              </CardHeader>
              <CardContent>
                {newSurveyForm.questions?.map((q, qIndex) => (
                  <div key={q.id} className="mb-4 p-3 border rounded-md">
                    <p className="font-medium">
                      {qIndex + 1}. {q.text}
                    </p>
                    <ul className="list-disc list-inside ml-4">
                      {q.options.map((opt) => (
                        <li key={opt.id}>{opt.text}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="newQuestion">Nueva Pregunta</Label>
                  <Input
                    id="newQuestion"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Ej: ¿Cuál es tu color favorito?"
                  />
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="newOptions">
                    Opciones (separadas por comas)
                  </Label>
                  <Input
                    id="newOptions"
                    value={newOptionsText}
                    onChange={(e) => setNewOptionsText(e.target.value)}
                    placeholder="Ej: Rojo, Azul, Verde"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddQuestion}
                  className="mt-4"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Pregunta
                </Button>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFormDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmitSurvey} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Encuesta/Votación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogo para Ver Resultados */}
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resultados: {currentSurvey?.title}</DialogTitle>
            <DialogDescription>
              Resultados de la encuesta o votación.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {currentSurvey?.questions.map((q) => (
              <Card key={q.id}>
                <CardHeader>
                  <CardTitle>{q.text}</CardTitle>
                </CardHeader>
                <CardContent>
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>{opt.text}</span>
                      <Badge>{opt.votes || 0} votos</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsResultsDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
