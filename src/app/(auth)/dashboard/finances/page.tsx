"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default function FinancesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al usuario a la página de gestión financiera
    router.push(`${ROUTES.FINANCES}/financial`);
  }, [router]);

  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <div className="animate-pulse text-center">
        <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-indigo-600/30"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirigiendo...</p>
      </div>
    </div>
  );
}