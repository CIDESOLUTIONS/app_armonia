'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ServerLogger } from '@/lib/logging/server-logger';

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

interface AuthContextType {
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
  const [schemaName, setSchemaName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('[AuthContext] Verificando autenticación...');
        
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }
        
        const storedToken = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('[AuthContext] Token encontrado:', !!storedToken);
        console.log('[AuthContext] User data encontrado:', !!userData);
        
        if (storedToken && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            
            // Verificar que el usuario tenga todos los campos necesarios
            if (!parsedUser.id || !parsedUser.email || !parsedUser.role) {
              console.error('[AuthContext] Datos de usuario incompletos');
              handleLogout();
              return;
            }
            
            setUser(parsedUser);
            setToken(storedToken);
            setIsLoggedIn(true);
            setAdminName(parsedUser.name || null);
            
            if (parsedUser.isGlobalAdmin) {
              console.log('[AuthContext] Administrador global autenticado');
              setComplexId(null);
              setComplexName(null);
              setSchemaName(null);
            } else {
              setComplexId(parsedUser.complexId || null);
              setComplexName(parsedUser.complexName || `Conjunto ${parsedUser.complexId}`);
              setSchemaName(parsedUser.schemaName || null);
            }
            
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
    setToken(null);
    setAdminName(null);
    setComplexName(null);
    setComplexId(null);
    setSchemaName(null);
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

      // Guardar los datos del usuario exactamente como vienen de la API
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setToken(data.token);
      setIsLoggedIn(true);
      setAdminName(data.user.name || null);
      
      if (data.user.isGlobalAdmin) {
        console.log('[AuthContext] Administrador global autenticado');
        setComplexId(null);
        setComplexName(null);
        setSchemaName(null);
      } else {
        setComplexId(data.user.complexId || null);
        setComplexName(data.user.complexName || `Conjunto ${data.user.complexId}`);
        setSchemaName(data.user.schemaName || null);
      }
      
      console.log('[AuthContext] Login exitoso, guardando datos:', data.user);
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
    schemaName,
    token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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