// src/lib/services/assembly-service.ts
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
// Tipos para el módulo de Asambleas
export var AssemblyStatus;
(function (AssemblyStatus) {
    AssemblyStatus["SCHEDULED"] = "SCHEDULED";
    AssemblyStatus["IN_PROGRESS"] = "IN_PROGRESS";
    AssemblyStatus["COMPLETED"] = "COMPLETED";
    AssemblyStatus["CANCELLED"] = "CANCELLED";
})(AssemblyStatus || (AssemblyStatus = {}));
export var AssemblyType;
(function (AssemblyType) {
    AssemblyType["ORDINARY"] = "ORDINARY";
    AssemblyType["EXTRAORDINARY"] = "EXTRAORDINARY";
    AssemblyType["COMMITTEE"] = "COMMITTEE";
})(AssemblyType || (AssemblyType = {}));
export var VotingStatus;
(function (VotingStatus) {
    VotingStatus["PENDING"] = "PENDING";
    VotingStatus["ACTIVE"] = "ACTIVE";
    VotingStatus["CLOSED"] = "CLOSED";
    VotingStatus["CANCELLED"] = "CANCELLED";
})(VotingStatus || (VotingStatus = {}));
export var VotingType;
(function (VotingType) {
    VotingType["SIMPLE_MAJORITY"] = "SIMPLE_MAJORITY";
    VotingType["QUALIFIED_MAJORITY"] = "QUALIFIED_MAJORITY";
    VotingType["UNANIMOUS"] = "UNANIMOUS";
})(VotingType || (VotingType = {}));
/**
 * Servicio para gestionar asambleas del conjunto residencial
 */
class AssemblyService {
    /**
     * Constructor del servicio de asambleas
     * @param schema Esquema del conjunto residencial
     */
    constructor(schema) {
        this.schema = schema;
    }
    /**
     * Obtiene un listado de asambleas con filtros opcionales
     * @param filters Parámetros de filtrado
     */
    getAssemblies() {
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
                const _url = `/api/assemblies${query ? `?${query}` : ''}`;
                return yield get(url, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al obtener asambleas:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene una asamblea específica por su ID
     * @param id ID de la asamblea
     */
    getAssembly(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get(`/api/assemblies/${id}`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al obtener asamblea ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Crea una nueva asamblea
     * @param data Datos de la asamblea a crear
     */
    createAssembly(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/assemblies', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al crear asamblea:', error);
                throw error;
            }
        });
    }
    /**
     * Actualiza una asamblea existente
     * @param id ID de la asamblea a actualizar
     * @param data Datos a actualizar
     */
    updateAssembly(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield put(`/api/assemblies/${id}`, data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al actualizar asamblea ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Cambia el estado de una asamblea
     * @param id ID de la asamblea
     * @param status Nuevo estado
     */
    changeAssemblyStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield put(`/api/assemblies/${id}/status`, { status }, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al cambiar estado de asamblea ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Obtiene la asistencia a una asamblea
     * @param id ID de la asamblea
     */
    getAttendance(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get(`/api/assemblies/${id}/attendance`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al obtener asistencia para asamblea ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Registra asistencia a una asamblea
     * @param data Datos de asistencia
     */
    registerAttendance(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/assemblies/attendance', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al registrar asistencia:', error);
                throw error;
            }
        });
    }
    /**
     * Crea una nueva votación para una asamblea
     * @param data Datos de la votación
     */
    createVoting(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/assemblies/votings', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al crear votación:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene las votaciones de una asamblea
     * @param assemblyId ID de la asamblea
     */
    getVotings(assemblyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get(`/api/assemblies/${assemblyId}/votings`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al obtener votaciones para asamblea ${assemblyId}:`, error);
                throw error;
            }
        });
    }
    /**
     * Inicia una votación
     * @param id ID de la votación
     */
    startVoting(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield put(`/api/assemblies/votings/${id}/start`, {}, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al iniciar votación ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Cierra una votación
     * @param id ID de la votación
     */
    closeVoting(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield put(`/api/assemblies/votings/${id}/close`, {}, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al cerrar votación ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Emite un voto en una votación
     * @param data Datos del voto
     */
    castVote(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/assemblies/votes', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al emitir voto:', error);
                throw error;
            }
        });
    }
    /**
     * Genera el acta de una asamblea
     * @param id ID de la asamblea
     */
    generateMinutes(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post(`/api/assemblies/${id}/minutes`, {}, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al generar acta para asamblea ${id}:`, error);
                throw error;
            }
        });
    }
}
export default AssemblyService;
