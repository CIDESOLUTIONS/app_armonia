// C:\Users\meciz\Documents\armonia\frontend\src\components\ui\loading\index.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

// Componente de Skeleton para carga de datos
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-gray-200 dark:bg-gray-700 rounded", className)} />
);

// Componente de Loading Button
const LoadingButton = ({
  loading,
  children,
  className = '',
  ...props
}: {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 font-medium rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
        loading ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-indigo-600 dark:text-indigo-400" />
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Componente de Loading Overlay
const LoadingOverlay = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-4">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
        <span className="text-gray-900 dark:text-gray-100">Cargando...</span>
      </div>
    </div>
  );
};

// Componente de Loading Card
const LoadingCard = () => (
  <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow bg-white dark:bg-gray-800 space-y-3">
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

// Componente de Loading Table
const LoadingTable = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
    <div className="bg-gray-50 dark:bg-gray-700 p-4">
      <div className="grid grid-cols-4 gap-4">
        {Array(cols)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-4" />
          ))}
      </div>
    </div>
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array(rows)
        .fill(0)
        .map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {Array(cols)
                .fill(0)
                .map((_, colIndex) => (
                  <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4" />
                ))}
            </div>
          </div>
        ))}
    </div>
  </div>
);

// Hook personalizado para manejar estados de carga
const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [error, setError] = React.useState<Error | null>(null);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setLoadingError = (error: Error) => {
    setError(error);
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
  };
};

// Proveedor de contexto para estados de carga globales
const LoadingContext = React.createContext<{
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}>({
  globalLoading: false,
  setGlobalLoading: () => {},
});

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalLoading, setGlobalLoading] = React.useState(false);

  return (
    <LoadingContext.Provider value={{ globalLoading, setGlobalLoading }}>
      {children}
      <LoadingOverlay show={globalLoading} />
    </LoadingContext.Provider>
  );
};

// Exportar todos los componentes y utilidades
export { Skeleton, LoadingButton, LoadingOverlay, LoadingCard, LoadingTable, useLoadingState, LoadingProvider, LoadingContext };