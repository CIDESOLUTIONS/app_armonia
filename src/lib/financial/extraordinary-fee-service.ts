'use client';

export class ExtraordinaryFeeService {
  // Crear una nueva cuota extraordinaria
  static async createExtraordinaryFee(
    complexId: number,
    amount: number,
    description: string,
    dueDate: Date
  ) {
    try {
      const response = await fetch('/api/financial/extraordinary-fees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          complexId,
          amount,
          description,
          dueDate: dueDate.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error creando cuota extraordinaria');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en ExtraordinaryFeeService.createExtraordinaryFee:', error);
      throw error;
    }
  }

  // Obtener todas las cuotas extraordinarias de un conjunto
  static async getExtraordinaryFees(complexId: number) {
    try {
      const response = await fetch(`/api/financial/extraordinary-fees/${complexId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error obteniendo cuotas extraordinarias');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en ExtraordinaryFeeService.getExtraordinaryFees:', error);
      throw error;
    }
  }

  // Anular una cuota extraordinaria
  static async cancelExtraordinaryFee(feeId: number, reason: string) {
    try {
      const response = await fetch(`/api/financial/extraordinary-fees/${feeId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          reason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error anulando cuota extraordinaria');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en ExtraordinaryFeeService.cancelExtraordinaryFee:', error);
      throw error;
    }
  }

  // Obtener detalle de una cuota extraordinaria
  static async getExtraordinaryFeeDetail(feeId: number) {
    try {
      const response = await fetch(`/api/financial/extraordinary-fees/detail/${feeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error obteniendo detalle de cuota extraordinaria');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en ExtraordinaryFeeService.getExtraordinaryFeeDetail:', error);
      throw error;
    }
  }
}