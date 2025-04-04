'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  complexId: number;
  schemaName: string;  // Aseguramos que schemaName esté incluido
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  adminName: string | null;
  complexName: string | null;
  complexId: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [complexName, setComplexName] = useState<string | null>(null);
  const [complexId, setComplexId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('[AuthContext] Verificando autenticación...');
        
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }
        
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('[AuthContext] Token encontrado:', !!token);
        console.log('[AuthContext] User data encontrado:', !!userData);
        
        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            // Asegurar que el schemaName esté presente
            if (!parsedUser.schemaName) {
              parsedUser.schemaName = `tenant_cj${String(parsedUser.complexId).padStart(4, '0')}`;
            }
            setUser(parsedUser);
            setIsLoggedIn(true);
            setAdminName(parsedUser.name);
            setComplexId(parsedUser.complexId);
            setComplexName(`Conjunto ${parsedUser.complexId}`);
            console.log('[AuthContext] Usuario autenticado:', parsedUser);
          } catch (parseError) {
            console.error('[AuthContext] Error parsing user data:', parseError);
            handleLogout();
          }
        } else {
          console.log('[AuthContext] No hay datos de autenticación');
          handleLogout();
        }
      } catch (err) {
        console.error('[AuthContext] Error checking auth:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setIsLoggedIn(false);
    setUser(null);
    setAdminName(null);
    setComplexName(null);
    setComplexId(null);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('[AuthContext] Iniciando login para:', email);

      const response = await fetch('/api/login', {
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

      // Asegurar que el usuario tenga schemaName
      const userData = {
        ...data.user,
        schemaName: `tenant_cj${String(data.user.complexId).padStart(4, '0')}`
      };

      console.log('[AuthContext] Login exitoso, guardando datos:', userData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsLoggedIn(true);
      setAdminName(userData.name);
      setComplexId(userData.complexId);
      setComplexName(`Conjunto ${userData.complexId}`);
      
      console.log('[AuthContext] Redirigiendo a dashboard...');
      
      // Pequeño retraso para asegurar que los estados se actualicen
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/dashboard');
    } catch (err) {
      console.error('[AuthContext] Error en login:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setIsLoggedIn(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('[AuthContext] Cerrando sesión...');
      
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('[AuthContext] Error en logout');
      }
    } catch (err) {
      console.error('[AuthContext] Error en logout:', err);
    } finally {
      handleLogout();
      router.push('/login');
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    isLoggedIn,
    adminName,
    complexName,
    complexId,
    login,
    logout,
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,  
        error,
        isLoggedIn,
        adminName,
        complexName,
        complexId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}