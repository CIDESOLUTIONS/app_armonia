// src/app/(auth)/dashboard/pqr/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  AlertCircle,
  MessageSquare,
  Search,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PQRList } from '@/components/pqr/PQRList';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PQRDetailDialog } from '@/components/pqr/PQRDetailDialog';
import { CreatePQRForm } from '@/components/pqr/CreatePQRForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Tipos de PQR
enum PQRStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

enum PQRPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

enum PQRType {
  PETITION = 'PETITION',
  COMPLAINT = 'COMPLAINT',
  CLAIM = 'CLAIM'
}

// Interfaz para PQR
interface PQR {
  id: number;
  title: string;
  description: string;
  type: PQRType;
  status: PQRStatus;
  priority: PQRPriority;
  createdAt: string;
  updatedAt: string;
  residentId: number;
  residentName: string;
  propertyUnit: string;
  assignedToId?: number;
  assignedToName?: string;
  response?: string;
  category?: string;
  subcategory?: string;
}

export default function PQRPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pqrs, setPqrs] = useState<PQR[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPQR, setSelectedPQR] = useState<number | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Cargar datos simulados
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simulación de carga de datos
        setTimeout(() => {
          // Datos simulados de PQRs
          const mockPQRs: PQR[] = [
            {
              id: 1,
              title: 'Gotera en el techo del parqueadero',
              description: 'Hay una gotera grande en el parqueadero comunal que está afectando mi vehículo.',
              type: PQRType.COMPLAINT,
              status: PQRStatus.RESOLVED,
              priority: PQRPriority.HIGH,
              createdAt: '2024-03-10T14:30:00Z',
              updatedAt: '2024-03-15T09:20:00Z',
              residentId: 101,
              residentName: 'Ana María Gómez',
              propertyUnit: 'A-303',
              assignedToId: 5,
              assignedToName: 'Carlos Martínez',
              response: 'Se realizó la reparación del techo y se selló la filtración. Quedamos pendientes de cualquier novedad adicional.',
              category: 'infrastructure',
              subcategory: 'damages'
            },
            {
              id: 2,
              title: 'Solicitud de revisión de cuota extraordinaria',
              description: 'Solicito revisión de la cuota extraordinaria asignada a mi inmueble, ya que considero que hay un error en el cálculo según el coeficiente.',
              type: PQRType.PETITION,
              status: PQRStatus.PENDING,
              priority: PQRPriority.MEDIUM,
              createdAt: '2024-03-20T10:15:00Z',
              updatedAt: '2024-03-20T10:15:00Z',
              residentId: 102,
              residentName: 'Roberto Sánchez',
              propertyUnit: 'B-201',
              category: 'payments',
              subcategory: 'fees'
            },
            {
              id: 3,
              title: 'Reclamo por daño en ventana durante mantenimiento',
              description: 'Durante el mantenimiento de fachada, los operarios dañaron una ventana de mi apartamento. Solicito reparación urgente.',
              type: PQRType.CLAIM,
              status: PQRStatus.IN_PROGRESS,
              priority: PQRPriority.HIGH,
              createdAt: '2024-03-18T16:45:00Z',
              updatedAt: '2024-03-19T11:30:00Z',
              residentId: 103,
              residentName: 'María José López',
              propertyUnit: 'A-502',
              assignedToId: 6,
              assignedToName: 'Pedro Ramírez',
              category: 'infrastructure',
              subcategory: 'damages'
            },
            {
              id: 4,
              title: 'Ruido excesivo del apartamento vecino',
              description: 'El apartamento B-402 realiza fiestas con música a alto volumen después de las 10 pm regularmente.',
              type: PQRType.COMPLAINT,
              status: PQRStatus.PENDING,
              priority: PQRPriority.MEDIUM,
              createdAt: '2024-03-22T19:00:00Z',
              updatedAt: '2024-03-22T19:00:00Z',
              residentId: 104,
              residentName: 'Juan Carlos Pérez',
              propertyUnit: 'B-401',
              category: 'noise',
              subcategory: 'neighbors'
            },
            {
              id: 5,
              title: 'Solicitud de permiso para renovación',
              description: 'Solicito autorización para realizar una renovación en mi cocina que incluirá cambio de pisos y muebles.',
              type: PQRType.PETITION,
              status: PQRStatus.RESOLVED,
              priority: PQRPriority.LOW,
              createdAt: '2024-03-15T09:20:00Z',
              updatedAt: '2024-03-18T14:35:00Z',
              residentId: 105,
              residentName: 'Patricia Torres',
              propertyUnit: 'C-602',
              assignedToId: 5,
              assignedToName: 'Carlos Martínez',
              response: 'Solicitud aprobada. Por favor coordinar con administración el horario de trabajo y el ingreso de materiales y personal.',
              category: 'infrastructure',
              subcategory: 'improvements'
            }
          ];
          
          setPqrs(mockPQRs);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error al cargar PQRs:', error);
        setError('Error al cargar las peticiones, quejas y reclamos');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Funciones de filtrado
  const getFilteredPQRs = () => {
    let filtered = [...pqrs];
    
    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(pqr => 
        pqr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pqr.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pqr.propertyUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pqr.residentName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtro por prioridad
    if (filterPriority !== 'all') {
      filtered = filtered.filter(pqr => pqr.priority === filterPriority);
    }
    
    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(pqr => pqr.type === filterType);
    }
    
    // Filtro por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(pqr => pqr.status === filterStatus);
    }
    
    // Filtro por pestaña
    if (activeTab === 'pending') {
      filtered = filtered.filter(pqr => pqr.status === PQRStatus.PENDING);
    } else if (activeTab === 'inProgress') {
      filtered = filtered.filter(pqr => pqr.status === PQRStatus.IN_PROGRESS);
    } else if (activeTab === 'resolved') {
      filtered = filtered.filter(pqr => 
        pqr.status === PQRStatus.RESOLVED || 
        pqr.status === PQRStatus.CLOSED
      );
    }
    
    return filtered;
  };
  
  // Funciones auxiliares
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getStatusBadge = (status: PQRStatus) => {
    switch (status) {
      case PQRStatus.PENDING:
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case PQRStatus.IN_PROGRESS:
        return <Badge className="bg-blue-500">En Proceso</Badge>;
      case PQRStatus.RESOLVED:
        return <Badge className="bg-green-500">Resuelto</Badge>;
      case PQRStatus.CLOSED:
        return <Badge className="bg-gray-500">Cerrado</Badge>;
      case PQRStatus.CANCELLED:
        return <Badge className="bg-red-500">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: PQRPriority) => {
    switch (priority) {
      case PQRPriority.LOW:
        return <Badge className="bg-green-500">Baja</Badge>;
      case PQRPriority.MEDIUM:
        return <Badge className="bg-blue-500">Media</Badge>;
      case PQRPriority.HIGH:
        return <Badge className="bg-orange-500">Alta</Badge>;
      case PQRPriority.URGENT:
        return <Badge className="bg-red-500">Urgente</Badge>;
      default:
        return <Badge className="bg-gray-500">{priority}</Badge>;
    }
  };
  
  const getTypeBadge = (type: PQRType) => {
    switch (type) {
      case PQRType.PETITION:
        return <Badge className="bg-blue-500">Petición</Badge>;
      case PQRType.COMPLAINT:
        return <Badge className="bg-purple-500">Queja</Badge>;
      case PQRType.CLAIM:
        return <Badge className="bg-orange-500">Reclamo</Badge>;
      default:
        return <Badge className="bg-gray-500">{type}</Badge>;
    }
  };
  
  // Manejador para abrir detalles de PQR
  const handleViewPQR = (id: number) => {
    setSelectedPQR(id);
    setShowDetailDialog(true);
  };
  
  // Simulación de actualización de estado
  const handleStatusChange = (id: number, newStatus: PQRStatus, response?: string) => {
    setPqrs(pqrs.map(pqr => 
      pqr.id === id 
        ? { 
            ...pqr, 
            status: newStatus, 
            response: response || pqr.response,
            updatedAt: new Date().toISOString()
          } 
        : pqr
    ));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
        <span className="ml-3 text-lg">Cargando solicitudes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md m-6">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sistema PQR</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestión de Peticiones, Quejas y Reclamos</p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Solicitud
        </Button>
      </div>
      
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar solicitudes..."
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={filterPriority}
          onValueChange={setFilterPriority}
        >
          <SelectTrigger>
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las prioridades</SelectItem>
            <SelectItem value={PQRPriority.LOW}>Baja</SelectItem>
            <SelectItem value={PQRPriority.MEDIUM}>Media</SelectItem>
            <SelectItem value={PQRPriority.HIGH}>Alta</SelectItem>
            <SelectItem value={PQRPriority.URGENT}>Urgente</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterType}
          onValueChange={setFilterType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value={PQRType.PETITION}>Petición</SelectItem>
            <SelectItem value={PQRType.COMPLAINT}>Queja</SelectItem>
            <SelectItem value={PQRType.CLAIM}>Reclamo</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterStatus}
          onValueChange={setFilterStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value={PQRStatus.PENDING}>Pendiente</SelectItem>
            <SelectItem value={PQRStatus.IN_PROGRESS}>En Proceso</SelectItem>
            <SelectItem value={PQRStatus.RESOLVED}>Resuelto</SelectItem>
            <SelectItem value={PQRStatus.CLOSED}>Cerrado</SelectItem>
            <SelectItem value={PQRStatus.CANCELLED}>Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>Todas</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Pendientes</span>
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            <span>En Proceso</span>
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Resueltas</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Contenido de las pestañas */}
        <TabsContent value="all" className="space-y-4">
          {renderPQRList(getFilteredPQRs())}
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          {renderPQRList(getFilteredPQRs())}
        </TabsContent>
        <TabsContent value="inProgress" className="space-y-4">
          {renderPQRList(getFilteredPQRs())}
        </TabsContent>
        <TabsContent value="resolved" className="space-y-4">
          {renderPQRList(getFilteredPQRs())}
        </TabsContent>
      </Tabs>
      
      {/* Diálogo de detalle */}
      {showDetailDialog && selectedPQR && (
        <PQRDetailDialog
          isOpen={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
          pqrId={selectedPQR}
          onStatusChange={() => {
            // Esta función se llamaría con los datos reales desde el componente
            // Aquí solo estamos cerrando el diálogo de ejemplo
            setShowDetailDialog(false);
          }}
        />
      )}
      
      {/* Diálogo para crear nueva solicitud */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Solicitud</DialogTitle>
          </DialogHeader>
          <CreatePQRForm
            onSuccess={() => {
              setShowCreateDialog(false);
              // Aquí iría la lógica para recargar los datos
            }}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
  
  // Función para renderizar la lista de PQRs
  function renderPQRList(pqrs: PQR[]) {
    if (pqrs.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No hay solicitudes</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No se encontraron solicitudes con los criterios actuales.
          </p>
        </div>
      );
    }
    
    return pqrs.map(pqr => (
      <Card key={pqr.id} className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{pqr.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              {getTypeBadge(pqr.type)}
              {getPriorityBadge(pqr.priority)}
              {getStatusBadge(pqr.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-2">{pqr.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <span className="font-medium mr-2">Residente:</span>
              <span>{pqr.residentName} ({pqr.propertyUnit})</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-2">Fecha:</span>
              <span>{formatDate(pqr.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-2">Asignado:</span>
              <span>{pqr.assignedToName || 'Sin asignar'}</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => handleViewPQR(pqr.id)}
            >
              Ver Detalles
            </Button>
          </div>
        </CardContent>
      </Card>
    ));
  }
}