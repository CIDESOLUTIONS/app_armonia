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
export function getAnnouncements() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/communications/announcements');
            return response;
        }
        catch (error) {
            console.error('Error fetching announcements:', error);
            throw error;
        }
    });
}
export function createAnnouncement(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/communications/announcements', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error creating announcement:', error);
            throw error;
        }
    });
}
export function updateAnnouncement(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/communications/announcements', {
                method: 'PUT',
                body: JSON.stringify(Object.assign({ id }, data)),
            });
            return response;
        }
        catch (error) {
            console.error('Error updating announcement:', error);
            throw error;
        }
    });
}
export function deleteAnnouncement(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchApi(`/api/communications/announcements/${id}`, {
                method: 'DELETE',
            });
        }
        catch (error) {
            console.error('Error deleting announcement:', error);
            throw error;
        }
    });
}
