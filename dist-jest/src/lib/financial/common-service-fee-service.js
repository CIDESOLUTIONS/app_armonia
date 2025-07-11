'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class CommonServiceFeeService {
    // Generar cuotas de servicios comunes para un mes específico
    static generateCommonServiceFees(complexId, year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Variable response eliminada por lint
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error generando cuotas de servicios comunes');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en CommonServiceFeeService.generateCommonServiceFees:', error);
                throw error;
            }
        });
    }
    // Obtener cuotas de servicios comunes por conjunto, año y mes
    static getCommonServiceFees(complexId, year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Variable response eliminada por lint
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error obteniendo cuotas de servicios comunes');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en CommonServiceFeeService.getCommonServiceFees:', error);
                throw error;
            }
        });
    }
    // Obtener historial de cuotas de servicios comunes por propiedad
    static getCommonServiceFeeHistory(propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Variable response eliminada por lint
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error obteniendo historial de cuotas');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en CommonServiceFeeService.getCommonServiceFeeHistory:', error);
                throw error;
            }
        });
    }
    // Anular una cuota de servicios comunes
    static cancelCommonServiceFee(feeId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Variable response eliminada por lint
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error anulando cuota de servicios comunes');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en CommonServiceFeeService.cancelCommonServiceFee:', error);
                throw error;
            }
        });
    }
    // Actualizar el monto de una cuota de servicios comunes
    static updateCommonServiceFeeAmount(feeId, newAmount, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Variable response eliminada por lint
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error actualizando monto de cuota');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en CommonServiceFeeService.updateCommonServiceFeeAmount:', error);
                throw error;
            }
        });
    }
    // Generar recibos para todas las cuotas pendientes
    static generateReceipts(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Variable response eliminada por lint
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error generando recibos');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en CommonServiceFeeService.generateReceipts:', error);
                throw error;
            }
        });
    }
}
