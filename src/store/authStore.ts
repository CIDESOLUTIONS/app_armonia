import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useRouter } from "next/navigation";

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
  login: (email: string, password: string, complexId: number, schemaName: string) => Promise<void>;
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
        // Por ahora, solo verificamos si hay un token en el almacenamiento
        const storedToken = get().token;
        if (storedToken) {
          // En un entorno real, aquí se debería validar el token con el backend
          set({ isLoggedIn: true, loading: false });
        } else {
          set({ isLoggedIn: false, loading: false });
        }
      },

      login: async (email, password, complexId, schemaName) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, complexId, schemaName }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Error al iniciar sesión");
          }

          const { access_token, user: userData } = data;

          set({
            user: userData,
            isLoggedIn: true,
            adminName: userData.name || null,
            complexId: userData.complexId || null,
            complexName: userData.complexName || `Conjunto ${userData.complexId}`,
            schemaName: userData.schemaName || null,
            token: access_token,
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
          // No hay un endpoint de logout en NestJS que invalide el token JWT en el servidor
          // Simplemente eliminamos el token del lado del cliente
          // await fetch("http://localhost:3000/auth/logout", { method: "POST" });
        } catch (err) {
          console.warn("Error al llamar endpoint de logout:", err);
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
          token: authToken,
        });
      },

      changeUserRole: async (newRole) => {
        set({ loading: true, error: null });
        try {
          const currentUser = get().user;
          const currentToken = get().token;

          if (!currentUser || !currentToken) {
            throw new Error("No hay usuario o token para cambiar el rol.");
          }

          const response = await fetch("http://localhost:3000/auth/change-role", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${currentToken}`,
            },
            body: JSON.stringify({ newRole, targetUserId: currentUser.id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al cambiar el rol.");
          }

          const updatedUser = { ...currentUser, role: newRole };
          set({
            user: updatedUser,
            adminName: updatedUser.name || null,
            complexId: updatedUser.complexId || null,
            complexName:
              updatedUser.complexName || `Conjunto ${updatedUser.complexId}`,
            schemaName: updatedUser.schemaName || null,
          });
          console.log("Rol de usuario actualizado a:", newRole);
        } catch (err: any) {
          set({ error: err.message });
          throw err;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        adminName: state.adminName,
        complexName: state.complexName,
        complexId: state.complexId,
        schemaName: state.schemaName,
        token: state.token,
      }),
    },
);