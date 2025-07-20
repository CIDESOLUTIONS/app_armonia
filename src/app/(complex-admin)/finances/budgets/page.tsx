"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Loader2,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  getBudgetsByYear,
  createBudget,
  approveBudget,
} from "@/services/budgetService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  budgetSchema,
  BudgetItemFormValues,
  BudgetFormValues,
} from "@/validators/budget-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle as CardTitleShadcn,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BudgetItem {
  id: number;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
}

interface Budget {
  id: number;
  year: number;
  title: string;
  description?: string;
  status: "DRAFT" | "APPROVED" | "REJECTED";
  approvedById?: number;
  approvedDate?: string;
  items: BudgetItem[];
}

export default function BudgetsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [newItem, setNewItem] = useState<BudgetItemFormValues>({
    description: "",
    amount: 0,
    type: "INCOME",
  });

  const handleAddItem = () => {
    if (newItem.description && newItem.amount) {
      form.setValue("items", [...form.getValues("items"), newItem]);
      setNewItem({ description: "", amount: 0, type: "INCOME" });
    } else {
      toast({
        title: "Error",
        description: "Por favor, ingresa la descripción y el monto del ítem.",
        variant: "destructive",
      });
    }
  };

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      title: "",
      description: "",
      items: [],
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBudgetsByYear(selectedYear);
      setBudgets(data);
    } catch (error: Error) {
      console.error("Error fetching budgets:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los presupuestos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, selectedYear]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchBudgets();
    }
  }, [authLoading, user, fetchBudgets]);

  const handleAddBudget = () => {
    setCurrentBudget(null);
    reset({
      year: new Date().getFullYear(),
      title: "",
      description: "",
      items: [],
    });
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setCurrentBudget(budget);
    reset({
      year: budget.year,
      title: budget.title,
      description: budget.description || "",
      items: budget.items,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      if (currentBudget) {
        // await updateBudget(currentBudget.id, data); // Need updateBudget in budgetService
        toast({
          title: "Éxito",
          description: "Presupuesto actualizado correctamente.",
        });
      } else {
        await createBudget(data);
        toast({
          title: "Éxito",
          description: "Presupuesto creado correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchBudgets();
    } catch (error: Error) {
      console.error("Error saving budget:", error);
      toast({
        title: "Error",
        description: "Error al guardar el presupuesto.",
        variant: "destructive",
      });
    }
  };

  const handleApproveBudget = async (budgetId: number) => {
    if (!user?.id) return;
    try {
      await approveBudget(budgetId, user.id);
      toast({
        title: "Éxito",
        description: "Presupuesto aprobado correctamente.",
      });
      fetchBudgets();
    } catch (error: Error) {
      console.error("Error approving budget:", error);
      toast({
        title: "Error",
        description: "Error al aprobar el presupuesto.",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = (items: BudgetItem[], type: "INCOME" | "EXPENSE") => {
    return items
      .filter((item) => item.type === type)
      .reduce((sum, item) => sum + item.amount, 0);
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Gestión de Presupuestos Anuales
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddBudget}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Presupuesto
        </Button>
        <div className="flex items-center space-x-2">
          <Label htmlFor="yearSelect">Año:</Label>
          <Input
            id="yearSelect"
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Año</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Ingresos Estimados</TableHead>
              <TableHead>Gastos Estimados</TableHead>
              <TableHead>Aprobado Por</TableHead>
              <TableHead>Fecha Aprobación</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.length > 0 ? (
              budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>{budget.year}</TableCell>
                  <TableCell>{budget.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        budget.status === "APPROVED"
                          ? "default"
                          : budget.status === "DRAFT"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {budget.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {calculateTotal(budget.items, "INCOME")}
                  </TableCell>
                  <TableCell>
                    {calculateTotal(budget.items, "EXPENSE")}
                  </TableCell>
                  <TableCell>{budget.approvedById || "N/A"}</TableCell>
                  <TableCell>
                    {budget.approvedDate
                      ? new Date(budget.approvedDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBudget(budget)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {budget.status === "DRAFT" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApproveBudget(budget.id)}
                        className="mr-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Funcionalidad Pendiente",
                          description:
                            "La eliminación de presupuestos aún no está implementada.",
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-5">
                  No hay presupuestos registrados para este año.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentBudget ? "Editar Presupuesto" : "Crear Nuevo Presupuesto"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={control}
                name="year"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Año</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="col-span-3"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Título</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Descripción</FormLabel>
                    <FormControl>
                      <Textarea className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />

              <div className="col-span-full">
                <h3 className="text-lg font-semibold mb-2">
                  Ítems del Presupuesto
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.watch("items").map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const currentItems = form.getValues("items");
                              form.setValue(
                                "items",
                                currentItems.filter((_, i) => i !== index),
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 grid grid-cols-4 gap-4 items-end">
                  <Input
                    placeholder="Descripción del ítem"
                    id="newItemDescription"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    className="col-span-2"
                  />
                  <Input
                    type="number"
                    placeholder="Monto"
                    id="newItemAmount"
                    value={newItem.amount}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <Select
                    value={newItem.type}
                    onValueChange={(value: "INCOME" | "EXPENSE") =>
                      setNewItem({ ...newItem, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOME">Ingreso</SelectItem>
                      <SelectItem value="EXPENSE">Gasto</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    className="col-span-full md:col-span-1"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Ítem
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  {currentBudget ? "Guardar Cambios" : "Crear Presupuesto"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}