// src/lib/services/finance-service.ts
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
import { get, post, put } from '@/lib/api/fetcher';
import { ServerLogger } from '../logging/server-logger';
// Tipos para el módulo Financiero
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["OVERDUE"] = "OVERDUE";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["PARTIAL"] = "PARTIAL";
})(PaymentStatus || (PaymentStatus = {}));
export var FeeType;
(function (FeeType) {
    FeeType["ORDINARY"] = "ORDINARY";
    FeeType["EXTRAORDINARY"] = "EXTRAORDINARY";
    FeeType["PENALTY"] = "PENALTY";
    FeeType["OTHER"] = "OTHER";
})(FeeType || (FeeType = {}));
/**
 * Servicio para gestionar finanzas del conjunto residencial
 */
class FinanceService {
    /**
     * Constructor del servicio financiero
     * @param schema Esquema del conjunto residencial
     */
    constructor(schema) {
        this.schema = schema;
    }
    /**
     * Obtiene un listado de cuotas con filtros opcionales
     * @param filters Parámetros de filtrado
     */
    getFees() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            try {
                // Construir query string con los filtros
                const queryParams = new URLSearchParams();
                // Agregar cada filtro a los params
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, String(value));
                    }
                });
                const query = queryParams.toString();
                const _url = `/api/finances/fees${query ? `?${query}` : ''}`;
                return yield get(url, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al obtener cuotas:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene una cuota específica por su ID
     * @param id ID de la cuota
     */
    getFee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get(`/api/finances/fees/${id}`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al obtener cuota ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Crea una nueva cuota
     * @param data Datos de la cuota a crear
     */
    createFee(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/finances/fees', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al crear cuota:', error);
                throw error;
            }
        });
    }
    /**
     * Actualiza una cuota existente
     * @param id ID de la cuota a actualizar
     * @param data Datos a actualizar
     */
    updateFee(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield put(`/api/finances/fees/${id}`, data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al actualizar cuota ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Registra un pago para una cuota
     * @param data Datos del pago
     */
    createPayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/finances/payments', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al registrar pago:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene todos los pagos asociados a una propiedad
     * @param propertyId ID de la propiedad
     */
    getPropertyPayments(propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get(`/api/finances/properties/${propertyId}/payments`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al obtener pagos de propiedad ${propertyId}:`, error);
                throw error;
            }
        });
    }
    /**
     * Obtiene el balance de una propiedad
     * @param propertyId ID de la propiedad
     */
    getPropertyBalance(propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get(`/api/finances/properties/${propertyId}/balance`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al obtener balance de propiedad ${propertyId}:`, error);
                throw error;
            }
        });
    }
    /**
     * Genera cuotas ordinarias para todas las propiedades
     * @param amount Monto de la cuota
     * @param dueDate Fecha de vencimiento
     * @param title Título de la cuota
     * @param description Descripción de la cuota
     */
    generateOrdinaryFees(amount, dueDate, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/finances/generate-fees', {
                    amount,
                    dueDate,
                    title,
                    description,
                    type: FeeType.ORDINARY
                }, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al generar cuotas ordinarias:', error);
                throw error;
            }
        });
    }
    /**
     * Crea un nuevo presupuesto
     * @param data Datos del presupuesto
     */
    createBudget(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/finances/budgets', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al crear presupuesto:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene presupuestos por año
     * @param year Año para filtrar presupuestos
     */
    getBudgetsByYear(year) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get(`/api/finances/budgets?year=${year}`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al obtener presupuestos para el año ${year}:`, error);
                throw error;
            }
        });
    }
    /**
     * Aprueba un presupuesto
     * @param id ID del presupuesto
     */
    approveBudget(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield put(`/api/finances/budgets/${id}/approve`, {}, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al aprobar presupuesto ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Obtiene estadísticas financieras
     */
    getFinancialStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get('/api/finances/stats', { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al obtener estadísticas financieras:', error);
                throw error;
            }
        });
    }
    /**
     * Genera un reporte financiero
     * @param startDate Fecha de inicio
     * @param endDate Fecha de fin
     * @param type Tipo de reporte
     */
    generateFinancialReport(startDate, endDate, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/finances/reports', {
                    startDate,
                    endDate,
                    type
                }, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al generar reporte financiero:', error);
                throw error;
            }
        });
    }
}
export default FinanceService;
