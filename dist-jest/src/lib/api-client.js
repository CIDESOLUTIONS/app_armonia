// src/lib/api-client.ts
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
class ApiClient {
    constructor(config = {}) {
        // Métodos específicos para módulos
        this.auth = {
            login: (email, password, complexId) => this.post('/auth/login', { email, password, complexId }),
            logout: () => this.post('/auth/logout'),
            verifySession: () => this.get('/verify-session'),
        };
        this.pqr = {
            list: (params) => this.get('/pqr', params),
            create: (pqrData) => this.post('/pqr', pqrData),
            getById: (id) => this.get(`/pqr/${id}`),
            update: (id, updates) => this.put(`/pqr/${id}`, updates),
            delete: (id) => this.delete(`/pqr/${id}`),
        };
        this.residents = {
            list: (params) => this.get('/inventory/residents', params),
            create: (residentData) => this.post('/inventory/residents', residentData),
        };
        this.assemblies = {
            list: (params) => this.get('/assemblies', params),
            create: (assemblyData) => this.post('/assemblies', assemblyData),
        };
        this.payments = {
            list: (params) => this.get('/payments', params),
            create: (paymentData) => this.post('/payments', paymentData),
            getById: (id) => this.get(`/payments/${id}`),
        };
        this.packages = {
            list: (params) => this.get('/correspondence/packages', params),
            create: (packageData) => this.post('/correspondence/packages', packageData),
        };
        this.baseURL = config.baseURL || '/api';
        this.timeout = config.timeout || 30000;
    }
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        // Obtener token del localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    }
    request(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, options = {}) {
            const url = `${this.baseURL}${endpoint}`;
            const config = Object.assign(Object.assign({}, options), { headers: Object.assign(Object.assign({}, this.getAuthHeaders()), options.headers), signal: AbortSignal.timeout(this.timeout) });
            try {
                const response = yield fetch(url, config);
                if (!response.ok) {
                    const errorData = yield response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
                }
                const data = yield response.json();
                return {
                    data: data.data || data,
                    success: true,
                    message: data.message,
                    pagination: data.pagination,
                };
            }
            catch (error) {
                console.error(`API Error [${endpoint}]:`, error);
                if (error instanceof Error) {
                    if (error.name === 'AbortError') {
                        throw new Error('Request timeout');
                    }
                    throw error;
                }
                throw new Error('Unknown API error');
            }
        });
    }
    // Métodos HTTP
    get(endpoint, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
            return this.request(url, { method: 'GET' });
        });
    }
    post(endpoint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(endpoint, {
                method: 'POST',
                body: data ? JSON.stringify(data) : undefined,
            });
        });
    }
    put(endpoint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(endpoint, {
                method: 'PUT',
                body: data ? JSON.stringify(data) : undefined,
            });
        });
    }
    delete(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(endpoint, { method: 'DELETE' });
        });
    }
}
// Singleton instance
export const apiClient = new ApiClient();
export default apiClient;
