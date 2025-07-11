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
export function getReservations() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/services/reservations');
            return response;
        }
        catch (error) {
            console.error('Error fetching reservations:', error);
            throw error;
        }
    });
}
export function createReservation(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/services/reservations', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error creating reservation:', error);
            throw error;
        }
    });
}
export function updateReservationStatus(id, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/services/reservations', {
                method: 'PUT',
                body: JSON.stringify({ id, status }),
            });
            return response;
        }
        catch (error) {
            console.error('Error updating reservation status:', error);
            throw error;
        }
    });
}
export function deleteReservation(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchApi('/api/services/reservations', {
                method: 'DELETE',
                body: JSON.stringify({ id }),
            });
        }
        catch (error) {
            console.error('Error deleting reservation:', error);
            throw error;
        }
    });
}
