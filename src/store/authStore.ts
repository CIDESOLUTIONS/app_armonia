import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  complexId?: number;
  schemaName?: string;
  complexName?: string;
  isGlobalAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  adminName: string | null;
  complexName: string | null;
  complexId: number | null;
  schemaName: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forceLogin: (userData: User, authToken: string) => void; // Método para test-login
  changeUserRole: (newRole: string) => Promise<void>; // Nueva función para cambiar el rol
  initializeAuth: () => Promise<void>; // Para inicializar el estado al cargar la app
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    user: null,
    loading: true,
    error: null,
    isLoggedIn: false,
    adminName: null,
    complexName: null,
    complexId: null,
    schemaName: null,
    token: null,

    initializeAuth: async () => {
      set({ loading: true });
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          set({
            user: data.user,
            isLoggedIn: true,
            adminName: data.user.name || null,
            complexId: data.user.complexId || null,
            complexName: data.user.complexName || `Conjunto ${data.user.complexId}`,
            schemaName: data.user.schemaName || null,
          });
        } else {
          set({ user: null, isLoggedIn: false, token: null, error: 'Sesión expirada' });
        }
      } catch (err: any) {
        console.error('Error initializing auth:', err);
        set({ user: null, isLoggedIn: false, token: null, error: err.message });
      } finally {
        set({ loading: false });
      }
    },

    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al iniciar sesión');
        }

        const user: User = data.user;

        set({
          user,
          isLoggedIn: true,
          adminName: user.name || null,
          complexId: user.complexId || null,
          complexName: user.complexName || `Conjunto ${user.complexId}`,
          schemaName: user.schemaName || null,
        });

      } catch (err: any) {
        set({ error: err.message, isLoggedIn: false });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    logout: async () => {
      set({ loading: true });
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
      } catch (err) {
        console.warn('Error al llamar endpoint de logout:', err);
      } finally {
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
    },

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

    changeUserRole: async (newRole) => {
      set({ loading: true, error: null });
      try {
        const currentUser = get().user;

        if (!currentUser) {
          throw new Error('No hay usuario para cambiar el rol.');
        }

        const response = await fetch('/api/auth/change-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newRole, targetUserId: currentUser.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al cambiar el rol.');
        }

        const updatedUser = { ...currentUser, role: newRole };
        set({
          user: updatedUser,
          adminName: updatedUser.name || null,
          complexId: updatedUser.complexId || null,
          complexName: updatedUser.complexName || `Conjunto ${updatedUser.complexId}`,
          schemaName: updatedUser.schemaName || null,
        });
        console.log('Rol de usuario actualizado a:', newRole);

      } catch (err: any) {
        set({ error: err.message });
        throw err;
      } finally {
        set({ loading: false });
      }
    },
  })
);
