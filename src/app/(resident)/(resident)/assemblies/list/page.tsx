'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { getAssemblies } from '@/services/assemblyService';

interface Assembly {
  id: number;
  title: string;
  description?: string;
  scheduledDate: string;
  location: string;
  type: 'ORDINARY' | 'EXTRAORDINARY';
  agenda: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  complexId: number;
  createdBy: number;
}

export default function ResidentAssembliesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAssemblies();
    }
  }, [authLoading, user]);

  const fetchAssemblies = async () => {
    setLoading(true);
    try {
      const response = await getAssemblies(); // Fetch all assemblies for the complex
      setAssemblies(response.data);
    } catch (error) {
      console.error('Error fetching assemblies:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las asambleas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled by AuthLayout
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Asambleas del Conjunto</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assemblies.length > 0 ? (
              assemblies.map((assembly) => (
                <TableRow key={assembly.id}>
                  <TableCell>{assembly.title}</TableCell>
                  <TableCell>{new Date(assembly.scheduledDate).toLocaleDateString()}</TableCell>
                  <TableCell>{assembly.location}</TableCell>
                  <TableCell>{assembly.type === 'ORDINARY' ? 'Ordinaria' : 'Extraordinaria'}</TableCell>
                  <TableCell>
                    <Badge variant={assembly.status === 'PLANNED' ? 'secondary' : assembly.status === 'COMPLETED' ? 'default' : 'outline'}>
                      {assembly.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/resident/assemblies/${assembly.id}/view`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" /> Ver Detalles
                      </Button>
                    </Link>
                    {/* Add buttons for voting if assembly is in progress */}
                    {assembly.status === 'IN_PROGRESS' && (
                      <Button variant="ghost" size="sm" className="ml-2">
                        <CheckCircle className="h-4 w-4 text-green-600" /> Votar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-5">
                  No hay asambleas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}