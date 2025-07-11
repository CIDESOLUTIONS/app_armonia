var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// frontend/src/hooks/useFees.ts
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
export const useFees = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, _setError] = useState(null);
    const fetchFees = useCallback((filters) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (filters === null || filters === void 0 ? void 0 : filters.type)
                queryParams.append('type', filters.type);
            if (filters === null || filters === void 0 ? void 0 : filters.status)
                queryParams.append('status', filters.status);
            if (filters === null || filters === void 0 ? void 0 : filters.startDate)
                queryParams.append('startDate', filters.startDate);
            if (filters === null || filters === void 0 ? void 0 : filters.endDate)
                queryParams.append('endDate', filters.endDate);
            const _response = yield fetch(`/api/financial/fees?${queryParams}`);
            if (!response.ok)
                throw new Error('Error al obtener cuotas');
            const _data = yield response.json();
            setFees(data);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al cargar cuotas');
        }
        finally {
            setLoading(false);
        }
    }), []);
    const createBulkFees = useCallback((data) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const _response = yield fetch('/api/financial/fees/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok)
                throw new Error('Error al generar cuotas');
            toast.success('Cuotas generadas exitosamente');
            yield fetchFees(); // Recargar lista de cuotas
            return true;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al generar cuotas');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), [fetchFees]);
    const getFeeById = useCallback((id) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const _response = yield fetch(`/api/financial/fees/${id}`);
            if (!response.ok)
                throw new Error('Error al obtener cuota');
            const fee = yield response.json();
            return fee;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al obtener cuota');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), []);
    const updateFee = useCallback((id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const _response = yield fetch(`/api/financial/fees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok)
                throw new Error('Error al actualizar cuota');
            const updatedFee = yield response.json();
            setFees(prev => prev.map(fee => fee.id === id ? updatedFee : fee));
            toast.success('Cuota actualizada exitosamente');
            return updatedFee;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al actualizar cuota');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), []);
    const registerPayment = useCallback((feeId, paymentData) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const _response = yield fetch(`/api/financial/fees/${feeId}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });
            if (!response.ok)
                throw new Error('Error al registrar pago');
            const _result = yield response.json();
            // Actualizar la lista de cuotas con el nuevo pago
            yield fetchFees();
            toast.success('Pago registrado exitosamente');
            return result;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            toast.error('Error al registrar pago');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), [fetchFees]);
    // Funciones auxiliares para cálculos comunes
    const calculateTotalPending = useCallback(() => {
        return fees
            .filter(fee => fee.status === 'PENDING')
            .reduce((sum, fee) => sum + fee.amount, 0);
    }, [fees]);
    const calculateMonthlyFees = useCallback((month) => {
        return fees
            .filter(fee => {
            const feeMonth = new Date(fee.dueDate).toISOString().slice(0, 7);
            return feeMonth === month;
        })
            .reduce((sum, fee) => sum + fee.amount, 0);
    }, [fees]);
    return {
        fees,
        loading,
        error,
        fetchFees,
        createBulkFees,
        getFeeById,
        updateFee,
        registerPayment,
        calculateTotalPending,
        calculateMonthlyFees,
    };
};
// Ejemplo de uso en un componente:
/*
import { useFees } from '@/hooks/useFees';

export default function FeesPage() {
  const {
    fees,
    loading,
    error,
    fetchFees,
    registerPayment
  } = useFees();

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const handlePayment = async (feeId: string) => {
    try {
      await registerPayment(feeId, {
        amount: 200000,
        paymentMethod: 'BANK_TRANSFER',
        reference: 'TRANS123'
      });
    } catch (error) {
      console.error('Error al procesar pago:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {fees.map(fee => (
        <FeeCard
          key={fee.id}
          fee={fee}
          onPayment={() => handlePayment(fee.id)}
        />
      ))}
    </div>
  );
}
*/ 
