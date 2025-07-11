import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AssemblyAdvancedService from '@/lib/services/assembly-advanced-service';
import { WebSocketService } from '@/lib/communications/websocket-service';
import { AssemblyStatus } from '@prisma/client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

import { 
  PlusCircle as AddIcon,
  CheckCircle as CheckIcon,
  XCircle as CloseIcon,
  Edit as EditIcon,
  Users as GroupIcon,
  HowToVote as HowToVoteIcon,
  Info as InfoIcon,
  FileText as PdfIcon,
  Play as StartIcon,
  StopCircle as StopIcon,
  Loader2
} from 'lucide-react';

// Componente para mostrar el estado del quórum
const QuorumStatusComponent = ({
  current,
  required,
  status
}: {
  current: number;
  required: number;
  status: string;
}) => {
  const percentage = Math.min(100, Math.round((current / required) * 100));

  let progressColorClass = 'bg-red-500';
  if (percentage >= 100) {
    progressColorClass = 'bg-green-500';
  } else if (percentage >= 70) {
    progressColorClass = 'bg-yellow-500';
  }

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>Quórum actual: {current}%</span>
        <span>Requerido: {required}%</span>
      </div>
      <Progress value={percentage} className={`h-2 ${progressColorClass}`} />
      <div className="flex justify-between text-sm mt-1">
        <span className={`font-bold ${status === 'REACHED' ? 'text-green-600' : 'text-red-600'}`}>
          {status === 'REACHED' ? 'Quórum alcanzado' : 'Quórum no alcanzado'}
        </span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
};

// Componente para mostrar el estado de la asamblea
const AssemblyStatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return { label: 'Programada', variant: 'secondary' };
      case 'IN_PROGRESS':
        return { label: 'En progreso', variant: 'default' };
      case 'COMPLETED':
        return { label: 'Completada', variant: 'success' };
      case 'CANCELLED':
        return { label: 'Cancelada', variant: 'destructive' };
      case 'SUSPENDED':
        return { label: 'Suspendida', variant: 'warning' };
      default:
        return { label: status, variant: 'outline' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant as any}>
      {config.label}
    </Badge>
  );
};

// Componente principal para gestionar una asamblea en tiempo real
const AssemblyLiveView = () => {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuthStore(); // Assuming useAuthStore provides user info

  // Estados
  const [assembly, setAssembly] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [votings, setVotings] = useState<any[]>([]);
  const [activeVoting, setActiveVoting] = useState<any>(null);
  const [createVotingOpen, setCreateVotingOpen] = useState(false);
  const [viewResultsOpen, setViewResultsOpen] = useState(false);
  const [selectedVoting, setSelectedVoting] = useState<any>(null);
  const [wsConnected, setWsConnected] = useState(false);
  
  // Servicio
  const assemblyService = new AssemblyAdvancedService();
  const wsService = new WebSocketService();

  // Cargar datos de la asamblea
  const loadAssemblyData = useCallback(async () => {
    setLoading(true);
    try {
      const assemblyData = await assemblyService.getAssembly(parseInt(id as string));
      setAssembly(assemblyData);
      
      const attendeesData = await assemblyService.getAttendance(parseInt(id as string));
      setAttendees(attendeesData);
      
      const votingsData = await assemblyService.getVotings(parseInt(id as string));
      setVotings(votingsData);
      
      const active = votingsData.find((v: any) => v.status === 'ACTIVE');
      setActiveVoting(active || null);
    } catch (error) {
      console.error('Error al cargar datos de asamblea:', error);
    } finally {
      setLoading(false);
    }
  }, [id, assemblyService]);
  
  // Manejar eventos de WebSocket
  const handleWebSocketEvent = useCallback((event: any) => {
    const { type, data } = event;
    
    switch (type) {
      case 'QUORUM_REACHED':
        setAssembly((prev: any) => ({
          ...prev,
          currentCoefficient: data.currentCoefficient,
          quorumStatus: 'REACHED'
        }));
        break;
        
      case 'ASSEMBLY_STARTED':
        setAssembly((prev: any) => ({
          ...prev,
          status: 'IN_PROGRESS'
        }));
        break;
        
      case 'ASSEMBLY_ENDED':
        setAssembly((prev: any) => ({
          ...prev,
          status: 'COMPLETED',
          endTime: data.endTime
        }));
        break;
        
      case 'VOTING_STARTED': {
        setVotings((prev: any[]) => prev.map((v: any) => 
          v.id === data.votingId 
            ? { ...v, status: 'ACTIVE', startTime: data.startTime }
            : v
        ));
        
        const startedVoting = votings.find((v: any) => v.id === data.votingId);
        if (startedVoting) {
          setActiveVoting({ ...startedVoting, status: 'ACTIVE', startTime: data.startTime });
        }
        break;
      }
        
      case 'VOTE_CAST':
        if (activeVoting?.id === data.votingId) {
          setActiveVoting((prev: any) => ({
            ...prev,
            totalVotes: data.totalVotes
          }));
        }
        break;
        
      case 'VOTING_CLOSED':
        setVotings((prev: any[]) => prev.map((v: any) => 
          v.id === data.votingId 
            ? { 
                ...v, 
                status: 'CLOSED', 
                endTime: data.endTime,
                result: data.result,
                isApproved: data.isApproved
              }
            : v
        ));
        
        setActiveVoting(null);
        break;
        
      case 'MINUTES_SIGNED':
        loadAssemblyData();
        break;
        
      default:
        console.log('Evento WebSocket no manejado:', type, data);
    }
  }, [activeVoting, loadAssemblyData, votings]);

  // Conectar a WebSocket cuando se carga la asamblea
  useEffect(() => {
    if (assembly?.realtimeChannel) {
      const connectWs = async () => {
        try {
          await wsService.connect(assembly.realtimeChannel);
          setWsConnected(true);
          
          wsService.subscribe(assembly.realtimeChannel, handleWebSocketEvent);
        } catch (error) {
          console.error('Error al conectar WebSocket:', error);
        }
      };
      
      connectWs();
      
      return () => {
        wsService.disconnect(assembly.realtimeChannel);
      };
    }
  }, [assembly?.realtimeChannel, handleWebSocketEvent, wsService]);

  // Cargar datos iniciales
  useEffect(() => {
    if (id) {
      loadAssemblyData();
    }
  }, [id, loadAssemblyData]);
  
  // Iniciar asamblea
  const handleStartAssembly = async () => {
    try {
      await assemblyService.startAssembly(parseInt(id as string), user.id);
    } catch (error) {
      console.error('Error al iniciar asamblea:', error);
    }
  };
  
  // Finalizar asamblea
  const handleEndAssembly = async () => {
    try {
      await assemblyService.endAssembly(parseInt(id as string), user.id);
    } catch (error) {
      console.error('Error al finalizar asamblea:', error);
    }
  };
  
  // Crear votación
  const handleCreateVoting = async (votingData: any) => {
    try {
      await assemblyService.createVoting({
        ...votingData,
        assemblyId: parseInt(id as string)
      }, user.id);
      
      const votingsData = await assemblyService.getVotings(parseInt(id as string));
      setVotings(votingsData);
      
      setCreateVotingOpen(false);
    } catch (error) {
      console.error('Error al crear votación:', error);
    }
  };
  
  // Iniciar votación
  const handleStartVoting = async (votingId: number) => {
    try {
      await assemblyService.startVoting(votingId, user.id);
    } catch (error) {
      console.error('Error al iniciar votación:', error);
    }
  };
  
  // Cerrar votación
  const handleCloseVoting = async (votingId: number) => {
    try {
      await assemblyService.closeVoting(votingId, user.id);
    } catch (error) {
      console.error('Error al cerrar votación:', error);
    }
  };
  
  // Ver resultados de votación
  const handleViewResults = (voting: any) => {
    setSelectedVoting(voting);
    setViewResultsOpen(true);
  };
  
  // Renderizar contenido de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }
  
  // Renderizar error si no se encuentra la asamblea
  if (!assembly) {
    return (
      <div className="p-4">
        <h5 className="text-xl text-red-600">Asamblea no encontrada</h5>
      </div>
    );
  }
  
  return (
    <div className="p-2">
      {/* Encabezado */}
      <div className="bg-white shadow-md rounded-lg p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          <div className="md:col-span-8">
            <h4 className="text-2xl font-bold mb-1">
              {assembly.title}
            </h4>
            
            <div className="flex items-center mb-1">
              <AssemblyStatusBadge status={assembly.status} />
              <p className="ml-2 text-sm">
                {format(new Date(assembly.date), 'PPP', { locale: es })} • {format(new Date(assembly.date), 'HH:mm')}
              </p>
              {assembly.endTime && (
                <p className="ml-2 text-sm">
                  Finalizada: {format(new Date(assembly.endTime), 'HH:mm')}
                </p>
              )}
            </div>
            
            <p className="text-gray-600 mb-2">
              {assembly.description || 'Sin descripción'}
            </p>
            
            <p className="text-sm">
              <strong>Ubicación:</strong> {assembly.location}
            </p>
          </div>
          
          <div className="md:col-span-4 flex justify-end gap-2">
            {assembly.status === 'SCHEDULED' && assembly.quorumStatus === 'REACHED' && (
              <Button
                variant="default"
                onClick={handleStartAssembly}
              >
                <StartIcon className="mr-2 h-4 w-4" />
                Iniciar Asamblea
              </Button>
            )}
            
            {assembly.status === 'IN_PROGRESS' && (
              <Button
                variant="destructive"
                onClick={handleEndAssembly}
              >
                <StopIcon className="mr-2 h-4 w-4" />
                Finalizar Asamblea
              </Button>
            )}
            
            {assembly.status === 'COMPLETED' && assembly.minutes?.pdfUrl && (
              <Button
                variant="outline"
                asChild
              >
                <a href={assembly.minutes.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <PdfIcon className="mr-2 h-4 w-4" />
                  Ver Acta
                </a>
              </Button>
            )}
          </div>
        </div>
        
        {/* Estado de conexión WebSocket */}
        <div className="mt-2 flex items-center">
          <div
            className={`w-2.5 h-2.5 rounded-full mr-1 ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className={`text-xs ${wsConnected ? 'text-green-600' : 'text-red-600'}`}>
            {wsConnected ? 'Conectado en tiempo real' : 'Desconectado'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Panel izquierdo: Quórum y Asistentes */}
        <div className="md:col-span-4">
          <Card className="mb-3">
            <CardHeader>
              <CardTitle>Quórum</CardTitle>
            </CardHeader>
            <CardContent>
              <QuorumStatusComponent 
                current={assembly.currentCoefficient} 
                required={assembly.requiredCoefficient}
                status={assembly.quorumStatus}
              />
              
              <div className="flex justify-between mt-2 text-sm">
                <p>
                  <strong>Total asistentes:</strong> {attendees.length}
                </p>
                <p>
                  <strong>Coeficiente total:</strong> {assembly.currentCoefficient}%
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader 
              title="Asistentes" 
              className="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <CardTitle className="text-sm font-medium">Asistentes</CardTitle>
              <Button variant="ghost" size="icon">
                <GroupIcon className="h-4 w-4 text-gray-500" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unidad</TableHead>
                      <TableHead>Coeficiente</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No hay asistentes registrados
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendees.map((attendee) => (
                        <TableRow key={attendee.id}>
                          <TableCell>{attendee.propertyUnit}</TableCell>
                          <TableCell>{attendee.coefficient}%</TableCell>
                          <TableCell>
                            <Badge 
                              variant={attendee.attendanceType === 'PRESENT' ? 'default' : 
                                    attendee.attendanceType === 'PROXY' ? 'secondary' : 'outline'} 
                            >
                              {attendee.attendanceType === 'PRESENT' ? 'Presente' : 
                                    attendee.attendanceType === 'PROXY' ? 'Poder' : 'Virtual'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Panel derecho: Votaciones */}
        <div className="md:col-span-8">
          {/* Votación activa */}
          {activeVoting && (
            <Card className="mb-3 border-primary">
              <CardHeader 
                className="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <CardTitle className="text-lg flex items-center">
                  <HowToVoteIcon className="mr-2 h-5 w-5 text-primary" />
                  Votación en curso: {activeVoting.title}
                </CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCloseVoting(activeVoting.id)}
                >
                  Cerrar Votación
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  {activeVoting.description || 'Sin descripción'}
                </p>
                
                <div className="mt-2 mb-2 text-sm">
                  <p>
                    <strong>Tipo:</strong> {activeVoting.type === 'SIMPLE_MAJORITY' ? 'Mayoría simple' : 
                                          activeVoting.type === 'QUALIFIED_MAJORITY' ? 'Mayoría calificada' : 
                                          activeVoting.type === 'UNANIMOUS' ? 'Unanimidad' : 'Basado en coeficientes'}
                  </p>
                  <p>
                    <strong>Opciones:</strong> {activeVoting.options.join(', ')}
                  </p>
                  <p>
                    <strong>Votos emitidos:</strong> {activeVoting.totalVotes || 0}
                  </p>
                </div>
                
                <Progress value={50} className="h-2" /> {/* Placeholder for actual progress */}
              </CardContent>
            </Card>
          )}
          
          {/* Lista de votaciones */}
          <Card>
            <CardHeader 
              className="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <CardTitle className="text-sm font-medium">Votaciones</CardTitle>
              {assembly.status === 'IN_PROGRESS' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setCreateVotingOpen(true)}
                  disabled={!!activeVoting}
                >
                  <AddIcon className="mr-2 h-4 w-4" />
                  Nueva Votación
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {votings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No hay votaciones registradas
                        </TableCell>
                      </TableRow>
                    ) : (
                      votings.map((voting) => (
                        <TableRow key={voting.id}>
                          <TableCell>
                            <p className="font-medium">
                              {voting.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Punto {voting.agendaPoint}
                            </p>
                          </TableCell>
                          <TableCell>
                            {voting.type === 'SIMPLE_MAJORITY' ? 'Mayoría simple' : 
                             voting.type === 'QUALIFIED_MAJORITY' ? 'Mayoría calificada' : 
                             voting.type === 'UNANIMOUS' ? 'Unanimidad' : 'Coeficientes'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={voting.status === 'PENDING' ? 'secondary' :
                                voting.status === 'ACTIVE' ? 'default' :
                                voting.status === 'CLOSED' ? 'success' : 'destructive'}
                            >
                              {voting.status === 'PENDING' ? 'Pendiente' :
                                voting.status === 'ACTIVE' ? 'Activa' :
                                voting.status === 'CLOSED' ? 'Cerrada' : 'Cancelada'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {voting.status === 'CLOSED' ? (
                              <Badge 
                                variant={voting.isApproved ? 'default' : 'destructive'}
                              >
                                {voting.isApproved ? 'Aprobado' : 'Rechazado'} 
                              </Badge>
                            ) : (
                              '—'
                            )}
                          </TableCell>
                          <TableCell>
                            {voting.status === 'PENDING' && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleStartVoting(voting.id)}
                                disabled={!!activeVoting}
                              >
                                <StartIcon className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {voting.status === 'CLOSED' && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewResults(voting)}
                              >
                                <InfoIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Diálogos */}
      {createVotingOpen && (
        <Dialog open={createVotingOpen} onOpenChange={setCreateVotingOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Votación</DialogTitle>
              <DialogDescription>Configure los detalles de la nueva votación.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Título</Label>
                <Input id="title" name="title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Descripción</Label>
                <Textarea id="description" name="description" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => setCreateVotingOpen(false)}>Cancelar</Button>
              <Button type="submit" onClick={() => handleCreateVoting({ /* form data */ })}>Crear Votación</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {viewResultsOpen && selectedVoting && (
        <Dialog open={viewResultsOpen} onOpenChange={setViewResultsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Resultados de Votación: {selectedVoting.title}</DialogTitle>
              <DialogDescription>Detalles y resultados de la votación.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p><strong>Total Votos:</strong> {selectedVoting.totalVotes}</p>
              {/* Renderizar opciones y resultados aquí */}
            </div>
            <DialogFooter>
              <Button onClick={() => setViewResultsOpen(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AssemblyLiveView;