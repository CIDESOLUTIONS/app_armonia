// C:\Users\meciz\Documents\armonia\frontend\src\app\resident\assemblies\page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AgendaItem {
  numeral: number;
  topic: string;
  time: string;
}

interface Assembly {
  id: number;
  title: string;
  date: string;
  agenda: AgendaItem[];
}

interface Document {
  id: number;
  fileName: string;
  createdAt: string;
  isFinal: boolean;
}

export default function ResidentAssembliesPage() {
  const router = useRouter();
  const { isLoggedIn, token } = useAuth();
  const [language, setLanguage] = useState('Español');
  const [isClient, setIsClient] = useState(false);
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [documents, setDocuments] = useState<{ [key: number]: Document[] }>({});
  const [isSubmitting, setIsSubmitting] = useState<{ [key: number]: number | null }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (!isLoggedIn || !token) {
      router.push('/login');
    } else {
      fetchAssemblies();
    }
  }, [isLoggedIn, token, router]);

  const fetchAssemblies = async () => {
    try {
      const response = await fetch('/api/assemblies/list', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setAssemblies(data.assemblies || []);
        data.assemblies.forEach((assembly: Assembly) => fetchDocuments(assembly.id));
      } else {
        console.error('[Resident Assemblies] Error al cargar asambleas:', data.message);
      }
    } catch (err) {
      console.error('[Resident Assemblies] Error al cargar asambleas:', err);
    }
  };

  const fetchDocuments = async (assemblyId: number) => {
    try {
      const response = await fetch(`/api/assemblies/documents/list?assemblyId=${assemblyId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setDocuments(prev => ({ ...prev, [assemblyId]: data.documents || [] }));
      } else {
        console.error('[Resident Assemblies] Error al cargar documentos:', data.message);
      }
    } catch (err) {
      console.error('[Resident Assemblies] Error al cargar documentos:', err);
    }
  };

  const handleConfirmAttendance = async (assemblyId: number) => {
    setIsSubmitting(prev => ({ ...prev, [assemblyId]: 0 }));
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/assemblies/attendance/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ assemblyId }),
      });

      const data = await response.json();
      console.log('[Resident Assemblies] Respuesta de /api/assemblies/attendance/confirm:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error al confirmar asistencia');
      }

      setSuccess(language === 'Español' ? 'Asistencia confirmada con éxito.' : 'Attendance confirmed successfully.');
    } catch (err) {
      console.error('[Resident Assemblies] Error al confirmar asistencia:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(prev => ({ ...prev, [assemblyId]: null }));
    }
  };

  const handleVote = async (assemblyId: number, numeral: number, vote: 'YES' | 'NO') => {
    setIsSubmitting(prev => ({ ...prev, [assemblyId]: numeral }));
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/assemblies/voting/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ assemblyId, agendaNumeral: numeral, vote }),
      });

      const data = await response.json();
      console.log('[Resident Assemblies] Respuesta de /api/assemblies/voting/vote:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar voto');
      }

      setSuccess(language === 'Español' ? 'Voto registrado con éxito.' : 'Vote registered successfully.');
    } catch (err) {
      console.error('[Resident Assemblies] Error al registrar voto:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(prev => ({ ...prev, [assemblyId]: null }));
    }
  };

  const handleDownloadDocument = async (documentId: number) => {
    try {
      const response = await fetch(`/api/assemblies/documents/download?documentId=${documentId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al descargar documento');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documents[selectedAssembly || 0]?.find(d => d.id === documentId)?.fileName || 'document.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[Resident Assemblies] Error al descargar documento:', err);
      setError(err.message);
    }
  };

  if (!isClient || !isLoggedIn || !token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-indigo-600 text-white p-4">
        <h1 className="text-2xl font-bold">{language === 'Español' ? 'Asambleas' : 'Assemblies'}</h1>
      </header>
      <main className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-4">{language === 'Español' ? 'Asambleas Disponibles' : 'Available Assemblies'}</h2>
        <div className="space-y-4">
          {assemblies.map(assembly => (
            <div key={assembly.id} className="border p-4 rounded-md bg-white shadow-md">
              <p><strong>{assembly.title}</strong></p>
              <p>{new Date(assembly.date).toLocaleString()}</p>
              <Button
                onClick={() => handleConfirmAttendance(assembly.id)}
                disabled={isSubmitting[assembly.id] === 0}
                className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white mr-2"
              >
                {isSubmitting[assembly.id] === 0 ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {language === 'Español' ? 'Confirmar Asistencia' : 'Confirm Attendance'}
              </Button>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{language === 'Español' ? 'Votaciones' : 'Voting'}</h3>
                {assembly.agenda.map(item => (
                  <div key={item.numeral} className="mt-2">
                    <p>{item.numeral}. {item.topic}</p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleVote(assembly.id, item.numeral, 'YES')}
                        disabled={isSubmitting[assembly.id] === item.numeral}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        {isSubmitting[assembly.id] === item.numeral ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        {language === 'Español' ? 'Sí' : 'Yes'}
                      </Button>
                      <Button
                        onClick={() => handleVote(assembly.id, item.numeral, 'NO')}
                        disabled={isSubmitting[assembly.id] === item.numeral}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        {isSubmitting[assembly.id] === item.numeral ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        {language === 'Español' ? 'No' : 'No'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{language === 'Español' ? 'Documentos' : 'Documents'}</h3>
                {(documents[assembly.id] || []).map(doc => (
                  <div key={doc.id} className="mt-2">
                    <p>{doc.fileName} - {new Date(doc.createdAt).toLocaleString()}</p>
                    <Button
                      onClick={() => handleDownloadDocument(doc.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {language === 'Español' ? 'Descargar' : 'Download'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
        </div>
      </main>
    </div>
  );
}