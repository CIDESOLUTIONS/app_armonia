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
export class ExtraordinaryFeeService {
    // Crear una nueva cuota extraordinaria
    static createExtraordinaryFee(complexId, amount, description, dueDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Variable response eliminada por lint
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error creando cuota extraordinaria');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en ExtraordinaryFeeService.createExtraordinaryFee:', error);
                throw error;
            }
        });
    }
    // Obtener todas las cuotas extraordinarias de un conjunto
    static getExtraordinaryFees(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Variable response eliminada por lint
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error obteniendo cuotas extraordinarias');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en ExtraordinaryFeeService.getExtraordinaryFees:', error);
                throw error;
            }
        });
    }
    // Anular una cuota extraordinaria
    static cancelExtraordinaryFee(feeId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Variable response eliminada por lint
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error anulando cuota extraordinaria');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en ExtraordinaryFeeService.cancelExtraordinaryFee:', error);
                throw error;
            }
        });
    }
    // Obtener detalle de una cuota extraordinaria
    static getExtraordinaryFeeDetail(feeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Variable response eliminada por lint
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error obteniendo detalle de cuota extraordinaria');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en ExtraordinaryFeeService.getExtraordinaryFeeDetail:', error);
                throw error;
            }
        });
    }
}
