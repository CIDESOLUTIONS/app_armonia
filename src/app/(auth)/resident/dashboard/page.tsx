// src/app/resident/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ResidentDashboard() {
  const { isLoggedIn, token, schemaName } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn || !token || !schemaName) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      const response = await fetch(`/api/resident/data?schemaName=${schemaName}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, [isLoggedIn, token, schemaName, router]);

  return (
    <div>
      <h1>Consola de Residentes</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}