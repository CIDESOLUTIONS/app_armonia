'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2, PlusCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { getPQRs } from '@/services/pqrService';

interface PQR {
  id: number;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
  reportedById: number;
  reportedByName: string;
  assignedToId?: number;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ResidentPQRPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [pqrs, setPqrs] = useState<PQR[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPQRs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPQRs({ reportedById: user?.id }); // Fetch PQRs reported by current user
      setPqrs(data);
    } catch (error) {
      console.error('Error fetching resident PQRs:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar tus PQRs.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast, user?.id]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchPQRs();
    }
  }, [authLoading, user, fetchPQRs]);

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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Peticiones, Quejas y Reclamos</h1>
      
      <div className="flex justify-end mb-4">
        <Link href="/resident/pqr/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva PQR
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asunto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pqrs.length > 0 ? (
              pqrs.map((pqr) => (
                <TableRow key={pqr.id}>
                  <TableCell>{pqr.subject}</TableCell>
                  <TableCell>
                    <Badge variant={pqr.status === 'OPEN' ? 'destructive' : pqr.status === 'IN_PROGRESS' ? 'secondary' : 'default'}>
                      {pqr.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={pqr.priority === 'HIGH' ? 'destructive' : pqr.priority === 'MEDIUM' ? 'secondary' : 'default'}>
                      {pqr.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(pqr.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/resident/pqr/${pqr.id}/view`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-5">
                  No has reportado ninguna PQR.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}