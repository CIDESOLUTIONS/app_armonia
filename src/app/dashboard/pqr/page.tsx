import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PQRService } from '@/lib/pqr/pqr-service';
import { PQRDetailDialog } from '@/components/pqr/pqr-detail-dialog';
import { CreatePQRForm } from '@/components/pqr/create-pqr-form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth'; // Asumiendo un hook de autenticación

export default function PQRManagementPage() {
  const { user } = useAuth(); // Hook para obtener información del usuario actual
  const [pqrs, setPQRs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {},
    byPriority: {}
  });
  const [selectedPQR, setSelectedPQR] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Filtros
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    search: ''
  });

  // Manejo de errores
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPQRs();
    }
  }, [user, filters]);

  const fetchPQRs = async () => {
    try {
      // Limpiar errores previos
      setError(null);

      // Verificar que el usuario esté autenticado
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const fetchedPQRs = await PQRService.getPQRs(user, {
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        type: filters.type || undefined,
        search: filters.search || undefined
      });
      
      setPQRs(fetchedPQRs);

      // Obtener estadísticas
      const pqrStats = await PQRService.getPQRStats(user.complexId);
      setStats(pqrStats);
    } catch (error) {
      console.error('Error fetcheando PQRs:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar las PQRs",
        variant: "destructive"
      });
    }
  };

  const handleCreatePQR = async (newPQR) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const createdPQR = await PQRService.createPQR({
        ...newPQR,
        userId: user.id,
        complexId: user.complexId
      }, user);

      // Actualizar lista de PQRs
      setPQRs([createdPQR, ...pqrs]);
      setIsCreateDialogOpen(false);

      toast({
        title: "PQR Creada",
        description: "Su solicitud ha sido registrada exitosamente",
        variant: "success"
      });
    } catch (error) {
      console.error('Error creando PQR:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la PQR",
        variant: "destructive"
      });
    }
  };

  const openPQRDetail = (pqr) => {
    setSelectedPQR(pqr);
    setIsDetailDialogOpen(true);
  };

  // Renderizado condicional basado en permisos
  const canCreatePQR = user && 
    ['RESIDENT', 'USER', 'COMPLEX_ADMIN'].includes(user.role);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Peticiones, Quejas y Reclamos (PQR)</h1>

      {/* Manejo de errores */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total PQRs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between">
                <span>{status}</span>
                <span>{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Por Prioridad</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(stats.byPriority).map(([priority, count]) => (
              <div key={priority} className="flex justify-between">
                <span>{priority}</span>
                <span>{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex space-x-4 mb-4">
        <Select 
          value={filters.status} 
          onValueChange={(value) => setFilters({...filters, status: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="OPEN">Abierto</SelectItem>
            <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
            <SelectItem value="RESOLVED">Resuelto</SelectItem>
            <SelectItem value="CLOSED">Cerrado</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.priority} 
          onValueChange={(value) => setFilters({...filters, priority: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            <SelectItem value="LOW">Baja</SelectItem>
            <SelectItem value="MEDIUM">Media</SelectItem>
            <SelectItem value="HIGH">Alta</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.type} 
          onValueChange={(value) => setFilters({...filters, type: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="PETITION">Petición</SelectItem>
            <SelectItem value="COMPLAINT">Queja</SelectItem>
            <SelectItem value="CLAIM">Reclamo</SelectItem>
          </SelectContent>
        </Select>

        <Input 
          placeholder="Buscar..." 
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />

        {canCreatePQR && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Crear Nueva PQR
          </Button>
        )}
      </div>

      {/* Listado de PQRs */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de PQRs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pqrs.map((pqr) => (
                  <tr key={pqr.id}>
                    <td>{new Date(pqr.createdAt).toLocaleDateString()}</td>
                    <td>{pqr.type}</td>
                    <td>{pqr.title}</td>
                    <td>{pqr.priority}</td>
                    <td>{pqr.status}</td>
                    <td>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openPQRDetail(pqr)}
                      >
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Detalle de PQR */}
      {selectedPQR && user && (
        <PQRDetailDialog 
          pqr={selectedPQR}
          isOpen={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          onUpdate={fetchPQRs}
          currentUser={user}
        />
      )}

      {/* Diálogo de Creación de PQR */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva PQR</DialogTitle>
          </DialogHeader>
          <CreatePQRForm 
            onSubmit={handleCreatePQR}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
