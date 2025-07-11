// src/lib/services/inventory-service.ts
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
import { get, post, put, del } from '@/lib/api/fetcher';
import { ServerLogger } from '../logging/server-logger';
/**
 * Servicio para gestionar inventario del conjunto residencial
 */
class InventoryService {
    /**
     * Constructor del servicio de inventario
     * @param schema Esquema del conjunto residencial
     */
    constructor(schema) {
        this.schema = schema;
    }
    /**
     * Obtiene un listado de propiedades con filtros opcionales
     * @param filters Parámetros de filtrado
     */
    getProperties() {
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
                const _url = `/api/inventory/properties${query ? `?${query}` : ''}`;
                return yield get(url, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al obtener propiedades:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene una propiedad específica por su ID
     * @param id ID de la propiedad
     */
    getProperty(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get(`/api/inventory/properties/${id}`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al obtener propiedad ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Crea una nueva propiedad
     * @param data Datos de la propiedad a crear
     */
    createProperty(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/inventory/properties', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al crear propiedad:', error);
                throw error;
            }
        });
    }
    /**
     * Actualiza una propiedad existente
     * @param id ID de la propiedad a actualizar
     * @param data Datos a actualizar
     */
    updateProperty(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield put(`/api/inventory/properties/${id}`, data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al actualizar propiedad ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Elimina una propiedad
     * @param id ID de la propiedad a eliminar
     */
    deleteProperty(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield del(`/api/inventory/properties/${id}`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al eliminar propiedad ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Agrega un propietario a una propiedad
     * @param data Datos del propietario
     */
    addOwner(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/inventory/owners', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al agregar propietario:', error);
                throw error;
            }
        });
    }
    /**
     * Agrega un residente a una propiedad
     * @param data Datos del residente
     */
    addResident(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/inventory/residents', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al agregar residente:', error);
                throw error;
            }
        });
    }
    /**
     * Elimina un residente
     * @param id ID del residente a eliminar
     */
    deleteResident(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield del(`/api/inventory/residents/${id}`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al eliminar residente ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Agrega un vehículo a una propiedad
     * @param data Datos del vehículo
     */
    addVehicle(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/inventory/vehicles', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al agregar vehículo:', error);
                throw error;
            }
        });
    }
    /**
     * Elimina un vehículo
     * @param id ID del vehículo a eliminar
     */
    deleteVehicle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield del(`/api/inventory/vehicles/${id}`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al eliminar vehículo ${id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Agrega una mascota a una propiedad
     * @param data Datos de la mascota
     */
    addPet(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/inventory/pets', data, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al agregar mascota:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene las mascotas de una propiedad
     * @param propertyId ID de la propiedad
     */
    getPropertyPets(propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get(`/api/inventory/properties/${propertyId}/pets`, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al obtener mascotas de propiedad ${propertyId}:`, error);
                throw error;
            }
        });
    }
    /**
     * Obtiene todas las áreas comunes
     */
    getCommonAreas() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get('/api/inventory/common-areas', { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al obtener áreas comunes:', error);
                throw error;
            }
        });
    }
    /**
     * Obtiene los datos de todos los estacionamientos
     */
    getParkingSpots() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get('/api/inventory/parking-spots', { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al obtener estacionamientos:', error);
                throw error;
            }
        });
    }
    /**
     * Asigna un estacionamiento a una propiedad
     * @param parkingId ID del estacionamiento
     * @param propertyId ID de la propiedad
     */
    assignParkingSpot(parkingId, propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield put(`/api/inventory/parking-spots/${parkingId}/assign`, { propertyId }, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al asignar estacionamiento ${parkingId} a propiedad ${propertyId}:`, error);
                throw error;
            }
        });
    }
    /**
     * Crea un usuario del sistema para un residente
     * @param residentId ID del residente
     * @param email Email del usuario
     * @param password Contraseña del usuario
     */
    createUserForResident(residentId, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield post('/api/inventory/residents/create-user', {
                    residentId,
                    email,
                    password
                }, { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error(`Error al crear usuario para residente ${residentId}:`, error);
                throw error;
            }
        });
    }
    /**
     * Obtiene estadísticas del inventario
     */
    getInventoryStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield get('/api/inventory/stats', { schema: this.schema });
            }
            catch (error) {
                ServerLogger.error('Error al obtener estadísticas de inventario:', error);
                throw error;
            }
        });
    }
    /**
     * Importa propiedades masivamente desde un archivo CSV
     * @param fileData Datos del archivo CSV
     */
    importProperties(fileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Para este caso particular no usamos JSON
                return yield fetch('/api/inventory/import-properties', {
                    method: 'POST',
                    body: fileData,
                    headers: {
                        'X-Tenant-Schema': this.schema || ''
                    }
                }).then(res => {
                    if (!res.ok)
                        throw new Error('Error al importar propiedades');
                    return res.json();
                });
            }
            catch (error) {
                ServerLogger.error('Error al importar propiedades:', error);
                throw error;
            }
        });
    }
}
export default InventoryService;
