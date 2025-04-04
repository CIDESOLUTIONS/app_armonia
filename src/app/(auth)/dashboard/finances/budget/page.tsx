"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2, FileText, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface BudgetItem {
  id?: number;
  category: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
}

interface Budget {
  id?: number;
  year: number;
  status: 'DRAFT' | 'APPROVED' | 'REJECTED';
  items: BudgetItem[];
  notes: string;
}

export default function BudgetPage() {
  const router = useRouter();
  const { isLoggedIn, token, schemaName, complexId, adminName, complexName, logout } = useAuth();
  const [language, setLanguage] = useState('Español');
  const [theme, setTheme] = useState('Claro');
  const [currency, setCurrency] = useState('Dólares');
  const [isLoading, setIsLoading] = useState(true);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [notes, setNotes] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!isLoggedIn || !token || !complexId || !schemaName) {
      console.log('[Budget] No autenticado o datos incompletos, redirigiendo a /login');
      router.replace('/login');
      return;
    }

    fetchBudgets();
  }, [isLoggedIn, token, router, schemaName, complexId]);

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/financial/budgets?schemaName=${schemaName}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (response.ok) {
        setBudgets(data.budgets || []);
        // Si hay presupuestos, seleccionar el más reciente
        if (data.budgets && data.budgets.length > 0) {
          const mostRecent = [...data.budgets].sort((a, b) => b.year - a.year)[0];
          setSelectedBudget(mostRecent);
          setNotes(mostRecent.notes || '');
          setSelectedYear(mostRecent.year);
        }
      } else {
        setError(data.message || 'Error al cargar presupuestos');
      }
    } catch (err) {
      console.error('[Budget] Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!newCategory || !newDescription || !newAmount) {
      setError(language === 'Español' ? 'Todos los campos son requeridos' : 'All fields are required');
      return;
    }

    if (isNaN(parseFloat(newAmount)) || parseFloat(newAmount) <= 0) {
      setError(language === 'Español' ? 'El monto debe ser un número positivo' : 'Amount must be a positive number');
      return;
    }

    if (!selectedBudget) {
      // Crear un nuevo presupuesto si no hay uno seleccionado
      const newBudget: Budget = {
        year: selectedYear,
        status: 'DRAFT',
        items: [{
          category: newCategory,
          description: newDescription,
          amount: parseFloat(newAmount),
          type: newType
        }],
        notes: notes
      };
      setSelectedBudget(newBudget);
    } else {
      // Agregar un nuevo item al presupuesto existente
      const updatedBudget = { ...selectedBudget };
      updatedBudget.items = [
        ...updatedBudget.items,
        {
          category: newCategory,
          description: newDescription,
          amount: parseFloat(newAmount),
          type: newType
        }
      ];
      setSelectedBudget(updatedBudget);
    }

    // Limpiar los campos
    setNewCategory('');
    setNewDescription('');
    setNewAmount('');
    setError(null);
  };

  const handleRemoveItem = (index: number) => {
    if (!selectedBudget) return;
    
    const updatedBudget = { ...selectedBudget };
    updatedBudget.items = updatedBudget.items.filter((_, i) => i !== index);
    setSelectedBudget(updatedBudget);
  };

  const handleSaveBudget = async () => {
    if (!selectedBudget) return;
    
    if (selectedBudget.items.length === 0) {
      setError(language === 'Español' ? 'El presupuesto debe tener al menos un ítem' : 'Budget must have at least one item');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const method = selectedBudget.id ? 'PUT' : 'POST';
      const url = selectedBudget.id 
        ? `/api/financial/budgets/${selectedBudget.id}?schemaName=${schemaName}` 
        : `/api/financial/budgets?schemaName=${schemaName}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...selectedBudget,
          complexId
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess(language === 'Español' ? 'Presupuesto guardado con éxito' : 'Budget saved successfully');
        fetchBudgets(); // Recargar presupuestos
        setIsEditing(false);
      } else {
        setError(data.message || 'Error al guardar el presupuesto');
      }
    } catch (err) {
      console.error('[Budget] Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveBudget = async () => {
    if (!selectedBudget || !selectedBudget.id) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/financial/budgets/${selectedBudget.id}/approve?schemaName=${schemaName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(language === 'Español' ? 'Presupuesto aprobado' : 'Budget approved');
        fetchBudgets();
      } else {
        setError(data.message || 'Error al aprobar el presupuesto');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectBudget = async () => {
    if (!selectedBudget || !selectedBudget.id) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/financial/budgets/${selectedBudget.id}/reject?schemaName=${schemaName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(language === 'Español' ? 'Presupuesto rechazado' : 'Budget rejected');
        fetchBudgets();
      } else {
        setError(data.message || 'Error al rechazar el presupuesto');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedBudget || !selectedBudget.id) return;
    
    try {
      const response = await fetch(`/api/financial/budgets/${selectedBudget.id}/report?schemaName=${schemaName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `presupuesto_${selectedBudget.year}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        setError(data.message || 'Error al generar el reporte');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  const handleCreateNewBudget = () => {
    setSelectedBudget({
      year: new Date().getFullYear(),
      status: 'DRAFT',
      items: [],
      notes: ''
    });
    setNotes('');
    setIsEditing(true);
  };

  const calculateTotals = () => {
    if (!selectedBudget) return { income: 0, expenses: 0, balance: 0 };
    
    const income = selectedBudget.items
      .filter(item => item.type === 'INCOME')
      .reduce((sum, item) => sum + item.amount, 0);
      
    const expenses = selectedBudget.items
      .filter(item => item.type === 'EXPENSE')
      .reduce((sum, item) => sum + item.amount, 0);
      
    return {
      income,
      expenses,
      balance: income - expenses
    };
  };

  const totals = calculateTotals();
  const currencySymbol = currency === 'Dólares' ? '$' : (currency === 'Euros' ? '€' : '$');

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        language={language}
        theme={theme}
        currency={currency}
        adminName={adminName}
        complexName={complexName}
        logout={logout}
      />
      <div className="flex-1 flex flex-col">
        <Header
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
          currency={currency}
          setCurrency={setCurrency}
        />
        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {language === 'Español' ? 'Presupuesto' : 'Budget'}
                </h1>
                <div className="flex space-x-2">
                  <Button onClick={handleCreateNewBudget} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    {language === 'Español' ? 'Nuevo Presupuesto' : 'New Budget'}
                  </Button>
                  {selectedBudget && selectedBudget.id && (
                    <Button onClick={handleGenerateReport} className="bg-green-600 hover:bg-green-700 text-white">
                      <FileText className="w-4 h-4 mr-2" />
                      {language === 'Español' ? 'Generar Reporte' : 'Generate Report'}
                    </Button>
                  )}
                </div>
              </header>

              {/* Selector de presupuesto */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'Español' ? 'Seleccionar Presupuesto' : 'Select Budget'}
                  </label>
                  <select
                    value={selectedBudget?.id || ''}
                    onChange={(e) => {
                      const budgetId = e.target.value;
                      if (budgetId) {
                        const budget = budgets.find(b => b.id === parseInt(budgetId));
                        if (budget) {
                          setSelectedBudget(budget);
                          setNotes(budget.notes || '');
                          setSelectedYear(budget.year);
                          setIsEditing(false);
                        }
                      } else {
                        handleCreateNewBudget();
                      }
                    }}
                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">{language === 'Español' ? '-- Nuevo Presupuesto --' : '-- New Budget --'}</option>
                    {budgets.map(budget => (
                      <option key={budget.id} value={budget.id}>
                        {`${budget.year} - ${
                          budget.status === 'DRAFT' 
                            ? language === 'Español' ? 'Borrador' : 'Draft'
                            : budget.status === 'APPROVED'
                              ? language === 'Español' ? 'Aprobado' : 'Approved'
                              : language === 'Español' ? 'Rechazado' : 'Rejected'
                        }`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}