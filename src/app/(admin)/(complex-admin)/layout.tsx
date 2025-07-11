// src/app/(admin)/layout.tsx
import { Metadata } from 'next';
import AuthLayout from '@/app/auth/layout';

export const metadata: Metadata = {
  title: 'Administración - Armonía',
  description: 'Portal de administración para complejos residenciales'
};

import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
}
