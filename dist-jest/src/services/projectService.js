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
export function getProjects(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = new URLSearchParams();
            if (params === null || params === void 0 ? void 0 : params.status)
                query.append('status', params.status);
            if (params === null || params === void 0 ? void 0 : params.search)
                query.append('search', params.search);
            const response = yield fetchApi(`/api/projects?${query.toString()}`);
            return response;
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    });
}
export function createProject(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/projects', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    });
}
export function updateProject(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/projects', {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            return response;
        }
        catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    });
}
export function deleteProject(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fetchApi('/api/projects', {
                method: 'DELETE',
                body: JSON.stringify({ id }),
            });
        }
        catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    });
}
