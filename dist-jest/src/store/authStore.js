var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { create } from 'zustand';
export const useAuthStore = create()((set, get) => ({
    user: null,
    loading: true,
    error: null,
    isLoggedIn: false,
    adminName: null,
    complexName: null,
    complexId: null,
    schemaName: null,
    token: null,
    initializeAuth: () => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true });
        try {
            const response = yield fetch('/api/auth/check', {
                method: 'GET',
            });
            if (response.ok) {
                const data = yield response.json();
                set({
                    user: data.user,
                    isLoggedIn: true,
                    adminName: data.user.name || null,
                    complexId: data.user.complexId || null,
                    complexName: data.user.complexName || `Conjunto ${data.user.complexId}`,
                    schemaName: data.user.schemaName || null,
                });
            }
            else {
                set({ user: null, isLoggedIn: false, token: null, error: 'Sesión expirada' });
            }
        }
        catch (err) {
            console.error('Error initializing auth:', err);
            set({ user: null, isLoggedIn: false, token: null, error: err.message });
        }
        finally {
            set({ loading: false });
        }
    }),
    login: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true, error: null });
        try {
            const response = yield fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }
            const user = data.user;
            set({
                user,
                isLoggedIn: true,
                adminName: user.name || null,
                complexId: user.complexId || null,
                complexName: user.complexName || `Conjunto ${user.complexId}`,
                schemaName: user.schemaName || null,
            });
        }
        catch (err) {
            set({ error: err.message, isLoggedIn: false });
            throw err;
        }
        finally {
            set({ loading: false });
        }
    }),
    logout: () => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true });
        try {
            yield fetch('/api/auth/logout', {
                method: 'POST',
            });
        }
        catch (err) {
            console.warn('Error al llamar endpoint de logout:', err);
        }
        finally {
            set({
                user: null,
                loading: false,
                error: null,
                isLoggedIn: false,
                adminName: null,
                complexName: null,
                complexId: null,
                schemaName: null,
                token: null,
            });
        }
    }),
    forceLogin: (userData, authToken) => {
        set({
            user: userData,
            isLoggedIn: true,
            adminName: userData.name || null,
            complexId: userData.complexId || null,
            complexName: userData.complexName || `Conjunto ${userData.complexId}`,
            schemaName: userData.schemaName || null,
            loading: false,
            error: null,
        });
    },
    changeUserRole: (newRole) => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true, error: null });
        try {
            const currentUser = get().user;
            if (!currentUser) {
                throw new Error('No hay usuario para cambiar el rol.');
            }
            const response = yield fetch('/api/auth/change-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newRole, targetUserId: currentUser.id }),
            });
            if (!response.ok) {
                const errorData = yield response.json();
                throw new Error(errorData.message || 'Error al cambiar el rol.');
            }
            const updatedUser = Object.assign(Object.assign({}, currentUser), { role: newRole });
            set({
                user: updatedUser,
                adminName: updatedUser.name || null,
                complexId: updatedUser.complexId || null,
                complexName: updatedUser.complexName || `Conjunto ${updatedUser.complexId}`,
                schemaName: updatedUser.schemaName || null,
            });
            console.log('Rol de usuario actualizado a:', newRole);
        }
        catch (err) {
            set({ error: err.message });
            throw err;
        }
        finally {
            set({ loading: false });
        }
    }),
}));
