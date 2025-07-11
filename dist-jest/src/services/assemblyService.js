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
export function getAssemblies(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = new URLSearchParams();
            if (params === null || params === void 0 ? void 0 : params.page)
                query.append('page', params.page.toString());
            if (params === null || params === void 0 ? void 0 : params.limit)
                query.append('limit', params.limit.toString());
            if (params === null || params === void 0 ? void 0 : params.status)
                query.append('status', params.status);
            const response = yield fetchApi(`/api/assemblies?${query.toString()}`);
            return response;
        }
        catch (error) {
            console.error('Error fetching assemblies:', error);
            throw error;
        }
    });
}
export function createAssembly(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/assemblies', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error creating assembly:', error);
            throw error;
        }
    });
}
export function updateAssembly(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/assemblies', {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error updating assembly:', error);
            throw error;
        }
    });
}
export function deleteAssembly(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchApi(`/api/assemblies/${id}`, {
                method: 'DELETE',
            });
        }
        catch (error) {
            console.error('Error deleting assembly:', error);
            throw error;
        }
    });
}
