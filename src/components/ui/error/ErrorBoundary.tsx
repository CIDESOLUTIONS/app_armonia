// src/components/ui/error/ErrorBoundary.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServerLogger } from '@/lib/logging/server-logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente para capturar errores en la UI y mostrar una interfaz amigable
 */
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Función para manejar errores no capturados
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      ServerLogger.error('Error no capturado en UI:', event.error);
      setError(event.error);
      setHasError(true);
    };
    
    // Función para manejar rechazos de promesas no capturados
    const handleRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      ServerLogger.error('Promesa rechazada no capturada:', event.reason);
      setError(new Error(String(event.reason)));
      setHasError(true);
    };
    
    // Registrar manejadores de eventos
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    // Limpiar al desmontar
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);
  
  // Función para reintentar
  const handleRetry = () => {
    setHasError(false);
    setError(null);
  };
  
  // Si hay un error, mostrar el componente de fallback o el predeterminado
  if (hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Ha ocurrido un error
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
          Lo sentimos, se ha producido un error inesperado. Por favor, intenta refrescar la página.
        </p>
        {error && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-6 w-full max-w-md overflow-auto">
            <p className="text-sm font-mono text-red-600 dark:text-red-400">
              {error.message || 'Error desconocido'}
            </p>
          </div>
        )}
        <div className="flex gap-4">
          <Button
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Refrescar página
          </Button>
        </div>
      </div>
    );
  }
  
  // Si no hay error, renderizar children normalmente
  return <>{children}</>;
}

/**
 * Componente para mostrar errores específicos en un área de la UI
 */
export function ErrorMessage({ 
  message, 
  retry 
}: { 
  message: string; 
  retry?: () => void;
}) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
          {retry && (
            <button 
              onClick={retry}
              className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}