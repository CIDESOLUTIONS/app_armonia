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
  persist(
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
          const storedToken = get().token; // Obtener del estado persistido
          const storedUser = get().user; // Obtener del estado persistido

          if (storedToken && storedUser) {
            // Verificar sesión en el servidor
            const response = await fetch('/api/auth/check', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${storedToken}`,
              },
            });

            if (response.ok) {
              set({
                user: storedUser,
                isLoggedIn: true,
                token: storedToken,
                adminName: storedUser.name || null,
                complexId: storedUser.complexId || null,
                complexName: storedUser.complexName || `Conjunto ${storedUser.complexId}`,
                schemaName: storedUser.schemaName || null,
              });
            } else {
              set({ user: null, isLoggedIn: false, token: null, error: 'Sesión expirada' });
            }
          } else {
            set({ user: null, isLoggedIn: false, token: null });
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
          const token: string = data.token;

          set({
            user,
            token,
            isLoggedIn: true,
            adminName: user.name || null,
            complexId: user.complexId || null,
            complexName: user.complexName || `Conjunto ${user.complexId}`,
            schemaName: user.schemaName || null,
          });

          // Redirección (manejar fuera del store si es posible, o con un hook)
          // const router = useRouter(); // Esto no funciona aquí directamente
          // if (user.role === 'RECEPTION') {
          //   router.push('/reception-dashboard');
          // } else if (user.role === 'COMPLEX_ADMIN') {
          //   router.push('/admin/admin-dashboard');
          // } else if (user.role === 'RESIDENT') {
          //   router.push('/resident-dashboard');
          // } else {
          //   router.push('/admin/admin-dashboard');
          // }

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
          const currentToken = get().token;
          if (currentToken) {
            await fetch('/api/logout', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${currentToken}`,
              },
              credentials: 'include',
            });
          }
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
          // Redirección (manejar fuera del store)
          // const router = useRouter();
          // router.push('/login');
        }
      },

      forceLogin: (userData, authToken) => {
        set({
          user: userData,
          token: authToken,
          isLoggedIn: true,
          adminName: userData.name || null,
          complexId: userData.complexId || null,
          complexName: userData.complexName || `Conjunto ${userData.complexId}`,
          schemaName: userData.schemaName || null,
          loading: false,
          error: null,
        });
        // Redirección (manejar fuera del store)
        // const router = useRouter();
        // router.push('/dashboard');
      },

      changeUserRole: async (newRole) => {
        set({ loading: true, error: null });
        try {
          const currentUser = get().user;
          const currentToken = get().token;

          if (!currentUser || !currentToken) {
            throw new Error('No hay usuario o token para cambiar el rol.');
          }

          const response = await fetch('/api/auth/change-role', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentToken}`,
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

          // Redirección (manejar fuera del store)
        } catch (err: any) {
          set({ error: err.message });
          throw err;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage', // nombre único para el almacenamiento
      storage: createJSONStorage(() => localStorage), // usar localStorage
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            ['user', 'token', 'isLoggedIn', 'adminName', 'complexName', 'complexId', 'schemaName'].includes(key)
          )
        ), // Solo persistir estos campos
    }
  )
);
