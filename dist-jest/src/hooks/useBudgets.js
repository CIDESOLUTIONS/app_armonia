var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// frontend/src/hooks/useBudgets.ts
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
export const useBudgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, _setError] = useState(null);
    const fetchBudgets = useCallback((filters) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (filters === null || filters === void 0 ? void 0 : filters.year)
                queryParams.append('year', filters.year.toString());
            if (filters === null || filters === void 0 ? void 0 : filters.status)
                queryParams.append('status', filters.status);
            const _response = yield fetch(`/api/financial/budgets?${queryParams}`);
            if (!response.ok)
                throw new Error('Error al obtener presupuestos');
            const _data = yield response.json();
            setBudgets(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            toast.error('Error al cargar presupuestos');
        }
        finally {
            setLoading(false);
        }
    }), []);
    const createBudget = useCallback((budgetData) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const _response = yield fetch('/api/financial/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetData),
            });
            if (!response.ok)
                throw new Error('Error al crear presupuesto');
            const newBudget = yield response.json();
            setBudgets(prev => [...prev, newBudget]);
            toast.success('Presupuesto creado exitosamente');
            return newBudget;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al crear presupuesto');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), []);
    const updateBudget = useCallback((id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const _response = yield fetch(`/api/financial/budgets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok)
                throw new Error('Error al actualizar presupuesto');
            const updatedBudget = yield response.json();
            setBudgets(prev => prev.map(budget => budget.id === id ? updatedBudget : budget));
            toast.success('Presupuesto actualizado exitosamente');
            return updatedBudget;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al actualizar presupuesto');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), []);
    const deleteBudget = useCallback((id) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const _response = yield fetch(`/api/financial/budgets/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Error al eliminar presupuesto');
            setBudgets(prev => prev.filter(budget => budget.id !== id));
            toast.success('Presupuesto eliminado exitosamente');
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al eliminar presupuesto');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), []);
    const getBudgetById = useCallback((id) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const _response = yield fetch(`/api/financial/budgets/${id}`);
            if (!response.ok)
                throw new Error('Error al obtener presupuesto');
            const budget = yield response.json();
            return budget;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al obtener presupuesto');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), []);
    return {
        budgets,
        loading,
        error,
        fetchBudgets,
        createBudget,
        updateBudget,
        deleteBudget,
        getBudgetById,
    };
};
// Ejemplo de uso en un componente:
/*
import { useBudgets } from '@/hooks/useBudgets';

export default function BudgetsPage() {
  const {
    budgets,
    loading,
    error,
    fetchBudgets
  } = useBudgets();

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {budgets.map(budget => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </div>
  );
}
*/ 
