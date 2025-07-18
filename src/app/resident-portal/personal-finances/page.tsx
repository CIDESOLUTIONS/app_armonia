"use client";

"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  PlusCircle,
  MinusCircle,
  DollarSign,
  CalendarDays,
} from "lucide-react";
import { getPersonalTransactions, createPersonalTransaction, updatePersonalTransaction, deletePersonalTransaction, PersonalTransaction, CreatePersonalTransactionDto, PersonalTransactionType } from "@/services/personalFinanceService";

export default function PersonalFinancesPage() {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<PersonalTransaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<CreatePersonalTransactionDto>({
    type: PersonalTransactionType.EXPENSE,
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  });
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PersonalTransaction | null>(null);
  const [editTransactionForm, setEditTransactionForm] = useState<UpdatePersonalTransactionDto>({
    type: PersonalTransactionType.EXPENSE,
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const handleEditTransaction = (transaction: PersonalTransaction) => {
    setSelectedTransaction(transaction);
    setEditTransactionForm({
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date.split("T")[0],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTransaction = async () => {
    if (!selectedTransaction) return;
    try {
      await updatePersonalTransaction(selectedTransaction.id, editTransactionForm);
      toast({
        title: "Éxito",
        description: "Transacción actualizada correctamente.",
      });
      setIsEditDialogOpen(false);
      const updatedTransactions = await getPersonalTransactions();
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Error al actualizar la transacción.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta transacción?")) return;
    try {
      await deletePersonalTransaction(id);
      toast({
        title: "Éxito",
        description: "Transacción eliminada correctamente.",
      });
      const updatedTransactions = await getPersonalTransactions();
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la transacción.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      try {
        const data = await getPersonalTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching personal transactions:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las transacciones personales.",
          variant: "destructive",
        });
      }
    };
    fetchTransactions();
  }, [user, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: name === "amount" ? parseFloat(value) : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTransaction((prev) => ({ ...prev, [name]: value as PersonalTransactionType }));
  };

  const addTransaction = async () => {
    if (!newTransaction.description || newTransaction.amount <= 0) {
      toast({
        title: "Error",
        description:
          "Por favor, completa todos los campos y asegúrate de que el monto sea válido.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPersonalTransaction(newTransaction);
      toast({
        title: "Éxito",
        description: "Transacción añadida correctamente.",
      });
      setNewTransaction({
        type: PersonalTransactionType.EXPENSE,
        description: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
      });
      // Re-fetch transactions to update the list
      const updatedTransactions = await getPersonalTransactions();
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Error al añadir la transacción.",
        variant: "destructive",
      });
    }
  };

  const calculateSummary = () => {
    const totalIncome = transactions
      .filter((t) => t.type === PersonalTransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === PersonalTransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, balance };
  };

  const { totalIncome, totalExpenses, balance } = calculateSummary();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Gestión de Presupuesto Familiar
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gastos Totales
            </CardTitle>
            <MinusCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              -${totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ${balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Añadir Nueva Transacción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                name="type"
                value={newTransaction.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Ingreso</SelectItem>
                  <SelectItem value="expense">Gasto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="description">Descripción</Label>
              <Input
                type="text"
                id="description"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                placeholder="Descripción de la transacción"
              />
            </div>
            <div>
              <Label htmlFor="amount">Monto</Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                placeholder="Monto"
              />
            </div>
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
              />
            </div>
            <Button onClick={addTransaction} className="md:col-span-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Transacción
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center">
              No hay transacciones registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t.type === PersonalTransactionType.INCOME ? (
                          <span className="text-green-600">Ingreso</span>
                        ) : (
                          <span className="text-red-600">Gasto</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${t.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleEditTransaction(t)}>
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteTransaction(t.id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Transacción</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="editType">Tipo</Label>
                <Select
                  name="editType"
                  value={editTransactionForm.type}
                  onValueChange={(value) => setEditTransactionForm({ ...editTransactionForm, type: value as PersonalTransactionType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PersonalTransactionType.INCOME}>Ingreso</SelectItem>
                    <SelectItem value={PersonalTransactionType.EXPENSE}>Gasto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editDescription">Descripción</Label>
                <Input
                  type="text"
                  id="editDescription"
                  name="description"
                  value={editTransactionForm.description}
                  onChange={(e) => setEditTransactionForm({ ...editTransactionForm, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editAmount">Monto</Label>
                <Input
                  type="number"
                  id="editAmount"
                  name="amount"
                  value={editTransactionForm.amount}
                  onChange={(e) => setEditTransactionForm({ ...editTransactionForm, amount: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="editDate">Fecha</Label>
                <Input
                  type="date"
                  id="editDate"
                  name="date"
                  value={editTransactionForm.date}
                  onChange={(e) => setEditTransactionForm({ ...editTransactionForm, date: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateTransaction}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
