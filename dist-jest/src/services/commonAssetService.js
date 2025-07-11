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
export function getCommonAssets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/inventory/common-assets');
            return response;
        }
        catch (error) {
            console.error('Error fetching common assets:', error);
            throw error;
        }
    });
}
export function createCommonAsset(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/inventory/common-assets', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error creating common asset:', error);
            throw error;
        }
    });
}
export function updateCommonAsset(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/inventory/common-assets', {
                method: 'PUT',
                body: JSON.stringify(Object.assign({ id }, data)),
            });
            return response;
        }
        catch (error) {
            console.error('Error updating common asset:', error);
            throw error;
        }
    });
}
export function deleteCommonAsset(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchApi('/api/inventory/common-assets', {
                method: 'DELETE',
                body: JSON.stringify({ id }),
            });
        }
        catch (error) {
            console.error('Error deleting common asset:', error);
            throw error;
        }
    });
}
