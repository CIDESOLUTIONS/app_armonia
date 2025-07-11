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
export function getReservationRules() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/services/rules');
            return response;
        }
        catch (error) {
            console.error('Error fetching reservation rules:', error);
            throw error;
        }
    });
}
export function createReservationRule(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/services/rules', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error creating reservation rule:', error);
            throw error;
        }
    });
}
export function updateReservationRule(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/services/rules', {
                method: 'PUT',
                body: JSON.stringify(Object.assign({ id }, data)),
            });
            return response;
        }
        catch (error) {
            console.error('Error updating reservation rule:', error);
            throw error;
        }
    });
}
export function deleteReservationRule(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchApi('/api/services/rules', {
                method: 'DELETE',
                body: JSON.stringify({ id }),
            });
        }
        catch (error) {
            console.error('Error deleting reservation rule:', error);
            throw error;
        }
    });
}
