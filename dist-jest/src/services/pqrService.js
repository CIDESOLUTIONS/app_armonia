var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchApi } from '@/lib/api';
export function getPQRs(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = new URLSearchParams();
            if (params === null || params === void 0 ? void 0 : params.status)
                query.append('status', params.status);
            if (params === null || params === void 0 ? void 0 : params.priority)
                query.append('priority', params.priority);
            if (params === null || params === void 0 ? void 0 : params.search)
                query.append('search', params.search);
            const response = yield fetchApi(`/api/pqr?${query.toString()}`);
            return response;
        }
        catch (error) {
            console.error('Error fetching PQRs:', error);
            throw error;
        }
    });
}
export function getPQRById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi(`/api/pqr?id=${id}`);
            return response[0]; // Assuming the API returns an array with one PQR
        }
        catch (error) {
            console.error(`Error fetching PQR with ID ${id}:`, error);
            throw error;
        }
    });
}
export function createPQR(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/pqr', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error creating PQR:', error);
            throw error;
        }
    });
}
export function updatePQR(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/pqr', {
                method: 'PUT',
                body: JSON.stringify(Object.assign({ id }, data)),
            });
            return response;
        }
        catch (error) {
            console.error('Error updating PQR:', error);
            throw error;
        }
    });
}
export function deletePQR(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchApi('/api/pqr', {
                method: 'DELETE',
                body: JSON.stringify({ id }),
            });
        }
        catch (error) {
            console.error('Error deleting PQR:', error);
            throw error;
        }
    });
}
export function addPQRComment(pqrId, comment) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/pqr/comment', {
                method: 'POST',
                body: JSON.stringify({ pqrId, comment }),
            });
            return response;
        }
        catch (error) {
            console.error('Error adding PQR comment:', error);
            throw error;
        }
    });
}
export function assignPQR(pqrId, assignedToId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/pqr/assign', {
                method: 'PUT',
                body: JSON.stringify({ pqrId, assignedToId }),
            });
            return response;
        }
        catch (error) {
            console.error('Error assigning PQR:', error);
            throw error;
        }
    });
}
