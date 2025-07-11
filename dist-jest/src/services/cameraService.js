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
export function getCameras() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/security/cameras');
            return response;
        }
        catch (error) {
            console.error('Error fetching cameras:', error);
            throw error;
        }
    });
}
export function createCamera(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/security/cameras', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error creating camera:', error);
            throw error;
        }
    });
}
export function updateCamera(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/security/cameras', {
                method: 'PUT',
                body: JSON.stringify(Object.assign({ id }, data)),
            });
            return response;
        }
        catch (error) {
            console.error('Error updating camera:', error);
            throw error;
        }
    });
}
export function deleteCamera(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchApi('/api/security/cameras', {
                method: 'DELETE',
                body: JSON.stringify({ id }),
            });
        }
        catch (error) {
            console.error('Error deleting camera:', error);
            throw error;
        }
    });
}
