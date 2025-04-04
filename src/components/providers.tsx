// src/components/providers.tsx
'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/use-toast';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}