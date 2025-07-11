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
export function getVehicles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/inventory/vehicles');
            return response;
        }
        catch (error) {
            console.error('Error fetching vehicles:', error);
            throw error;
        }
    });
}
export function createVehicle(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/inventory/vehicles', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error creating vehicle:', error);
            throw error;
        }
    });
}
export function updateVehicle(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/inventory/vehicles', {
                method: 'PUT',
                body: JSON.stringify(Object.assign({ id }, data)),
            });
            return response;
        }
        catch (error) {
            console.error('Error updating vehicle:', error);
            throw error;
        }
    });
}
export function deleteVehicle(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchApi(`/api/inventory/vehicles/${id}`, {
                method: 'DELETE',
            });
        }
        catch (error) {
            console.error('Error deleting vehicle:', error);
            throw error;
        }
    });
}
