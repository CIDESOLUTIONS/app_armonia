"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, MinusCircle, DollarSign, CalendarDays } from "lucide-react";

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
}

export default function PersonalFinancesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense', // default to expense
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const addTransaction = () => {
    const amount = parseFloat(newTransaction.amount);
    if (!newTransaction.description || isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos y asegúrate de que el monto sea válido.",
        variant: "destructive",
      });
      return;
    }

    const transactionToAdd: Transaction = {
      id: Date.now(), // Simple unique ID
      type: newTransaction.type as 'income' | 'expense',
      description: newTransaction.description,
      amount: amount,
      date: newTransaction.date,
    };

    setTransactions(prev => [...prev, transactionToAdd]);
    setNewTransaction({
      type: 'expense',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
    toast({
      title: "Transacción Añadida",
      description: "La transacción ha sido registrada exitosamente.",
    });
  };

  const calculateSummary = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
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
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <MinusCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                onValueChange={(value) => handleSelectChange('type', value)}
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
            <p className="text-gray-500 text-center">No hay transacciones registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t.type === 'income' ? (
                          <span className="text-green-600">Ingreso</span>
                        ) : (
                          <span className="text-red-600">Gasto</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${t.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
