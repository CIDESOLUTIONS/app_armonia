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
// Servicio para la gestión de PQRs (Peticiones, Quejas y Reclamos)
export class PQRService {
    // Obtener listado de PQRs
    static getPQRs(user, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Construir query params para filtros
                const queryParams = new URLSearchParams();
                if (filters) {
                    Object.entries(filters).forEach(([key, value]) => {
                        if (value !== undefined && value !== '') {
                            queryParams.append(key, value);
                        }
                    });
                }
                const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
                // Determinar endpoint basado en el rol
                let endpoint = '/api/pqr';
                if (user.role === 'RESIDENT') {
                    endpoint = `/api/pqr/user/${user.id}`;
                }
                else if (['COMPLEX_ADMIN', 'ADMIN'].includes(user.role)) {
                    if (user.complexId) {
                        endpoint = `/api/pqr/complex/${user.complexId}`;
                    }
                }
                // Restaurada la variable response
                const response = yield fetch(`${endpoint}${queryString}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error obteniendo PQRs');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en PQRService.getPQRs:', error);
                throw error;
            }
        });
    }
    // Obtener estadísticas de PQRs
    static getPQRStats(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Restaurada la variable response
                const response = yield fetch(`/api/pqr/stats/${complexId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error obteniendo estadísticas de PQRs');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en PQRService.getPQRStats:', error);
                // Retornar estadísticas vacías para evitar errores en la UI
                return {
                    total: 0,
                    byStatus: {},
                    byPriority: {}
                };
            }
        });
    }
    // Crear una nueva PQR
    static createPQR(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Restaurada la variable response
                const response = yield fetch('/api/pqr', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.assign(Object.assign({}, data), { userId: user.id, complexId: user.complexId })),
                });
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error creando PQR');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en PQRService.createPQR:', error);
                throw error;
            }
        });
    }
    // Actualizar el estado de una PQR
    static updatePQRStatus(id, status, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Restaurada la variable response
                const response = yield fetch(`/api/pqr/${id}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status,
                        userId: user.id
                    }),
                });
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error actualizando estado de PQR');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en PQRService.updatePQRStatus:', error);
                throw error;
            }
        });
    }
    // Añadir un comentario a una PQR
    static addComment(pqrId, comment, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Restaurada la variable response
                const response = yield fetch(`/api/pqr/${pqrId}/comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        comment,
                        userId: user.id
                    }),
                });
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error añadiendo comentario');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en PQRService.addComment:', error);
                throw error;
            }
        });
    }
    // Obtener detalle de una PQR
    static getPQRDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Restaurada la variable response
                const response = yield fetch(`/api/pqr/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error obteniendo detalle de PQR');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en PQRService.getPQRDetail:', error);
                throw error;
            }
        });
    }
    // Asignar responsable a una PQR
    static assignResponsible(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Restaurada la variable response
                const response = yield fetch(`/api/pqr/${id}/assign`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId
                    }),
                });
                if (!response.ok) {
                    const error = yield response.json();
                    throw new Error(error.message || 'Error asignando responsable');
                }
                return yield response.json();
            }
            catch (error) {
                console.error('Error en PQRService.assignResponsible:', error);
                throw error;
            }
        });
    }
}
