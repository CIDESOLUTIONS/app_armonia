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
export function getResidents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/inventory/residents');
            return response;
        }
        catch (error) {
            console.error('Error fetching residents:', error);
            throw error;
        }
    });
}
export function createResident(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/inventory/residents', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error creating resident:', error);
            throw error;
        }
    });
}
export function updateResident(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/inventory/residents', {
                method: 'PUT',
                body: JSON.stringify(Object.assign({ id }, data)),
            });
            return response;
        }
        catch (error) {
            console.error('Error updating resident:', error);
            throw error;
        }
    });
}
export function deleteResident(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchApi(`/api/inventory/residents/${id}`, {
                method: 'DELETE',
            });
        }
        catch (error) {
            console.error('Error deleting resident:', error);
            throw error;
        }
    });
}
