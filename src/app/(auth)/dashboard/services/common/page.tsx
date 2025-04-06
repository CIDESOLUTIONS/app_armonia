"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Calendar, Clock, Users, DollarSign, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interfaces
interface Service {
  id: number;
  name: string;
  description: string;
  capacity: number;
  startTime: string;
  endTime: string;
  cost: number;
  status: "active" | "inactive" | "maintenance";
  rules: string;
}

interface Reservation {
  id: number;
  serviceId: number;
  serviceName: string;
  userId: number;
  userName: string;
  propertyUnit: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}

// Datos mock para pruebas
const mockServices: Service[] = [
  {
    id: 1,
    name: "Salón Comunal",
    description: "Espacio para eventos sociales y reuniones.",
    capacity: 50,
    startTime: "08:00",
    endTime: "22:00",
    status: "active",
    cost: 100000,
    rules: "No se permite uso después de las 10pm. Se debe dejar limpio."
  },
  {
    id: 2,
    name: "Piscina",
    description: "Área recreativa con piscina para adultos y niños.",
    capacity: 30,
    startTime: "09:00",
    endTime: "18:00",
    status: "active",
    cost: 0,
    rules: "Obligatorio ducharse antes de ingresar. Prohibido alimentos."
  },
  {
    id: 3,
    name: "Gimnasio",
    description: "Equipado con máquinas cardiovasculares y de fuerza.",
    capacity: 15,
    startTime: "05:00",
    endTime: "23:00",
    status: "active",
    cost: 0,
    rules: "Traer toalla personal. Limpiar equipos después de usar."
  }
];

const mockReservations: Reservation[] = [
  {
    id: 1,
    serviceId: 1,
    serviceName: "Salón Comunal",
    userId: 1,
    userName: "Juan Pérez",
    propertyUnit: "A-101",
    date: "2024-04-15",
    startTime: "14:00",
    endTime: "18:00",
    status: "approved"
  },
  {
    id: 2,
    serviceId: 2,
    serviceName: "Piscina",
    userId: 2,
    userName: "María Rodríguez",
    propertyUnit: "A-102",
    date: "2024-04-20",
    startTime: "10:00",
    endTime: "12:00",
    status: "pending"
  }
];

export default function CommonServicesPage() {
  const router = useRouter();
  const { user, isLoggedIn, token, complexId, schemaName } = useAuth();
  const { toast } = useToast();
  
  // Estado
  const [services, setServices] = useState<Service[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [activeTab, setActiveTab] = useState<string>("services");
  
  // Formularios
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({
    name: "", description: "", capacity: 10, startTime: "08:00", 
    endTime: "18:00", cost: 0, status: "active", rules: ""
  });
  
  const [reservationForm, setReservationForm] = useState<Partial<Reservation>>({
    serviceId: 0, date: new Date().toISOString().split('T')[0],
    startTime: "08:00", endTime: "10:00", status: "pending"
  });

  // Cargar datos
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    fetchServices();
    fetchReservations();
  }, [isLoggedIn, token, complexId, schemaName]);

  // Funciones para cargar datos
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/services?complexId=${complexId}&schemaName=${schemaName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      } else {
        console.warn("Error al cargar servicios, usando datos de prueba");
        setServices(mockServices);
        toast({
          title: "Modo demostración",
          description: "Mostrando datos de ejemplo para servicios comunes",
          variant: "warning"
        });
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Error al cargar servicios comunes");
      setServices(mockServices);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch(`/api/services/reservations?complexId=${complexId}&schemaName=${schemaName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations || []);
      } else {
        console.warn("Error al cargar reservaciones, usando datos de prueba");
        setReservations(mockReservations);
      }
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setReservations(mockReservations);
    }
  };

  // Handlers para servicios
  const handleOpenServiceDialog = (service?: Service) => {
    if (service) {
      setIsEditing(true);
      setSelectedService(service);
      setServiceForm({ ...service });
    } else {
      setIsEditing(false);
      setSelectedService(null);
      setServiceForm({
        name: "", description: "", capacity: 10, startTime: "08:00", 
        endTime: "18:00", cost: 0, status: "active", rules: ""
      });
    }
    setShowServiceDialog(true);
  };

  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: any = value;
    
    if (name === "capacity" || name === "cost") {
      processedValue = value === "" ? 0 : Number(value);
    }

    setServiceForm({ ...serviceForm, [name]: processedValue });
  };

  const handleServiceSelectChange = (name: string, value: string) => {
    setServiceForm({ ...serviceForm, [name]: value });
  };

  const handleSaveService = async () => {
    if (!serviceForm.name?.trim()) {
      setError("El nombre del servicio es obligatorio");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const url = isEditing ? `/api/services/${selectedService?.id}` : '/api/services';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...serviceForm,
          complexId,
          schemaName
        })
      });
      
      if (response.ok) {
        const savedService = await response.json();
        
        if (isEditing) {
          setServices(services.map(s => s.id === selectedService?.id ? savedService.service : s));
          toast({
            title: "Servicio actualizado",
            description: "El servicio se ha actualizado correctamente",
            variant: "default"
          });
        } else {
          setServices([...services, savedService.service]);
          toast({
            title: "Servicio creado",
            description: "El nuevo servicio ha sido creado correctamente",
            variant: "default"
          });
        }
      } else {
        // Modo simulación
        if (isEditing && selectedService) {
          setServices(services.map(s => s.id === selectedService.id ? { ...s, ...serviceForm } : s));
        } else {
          const newService: Service = {
            id: Math.max(0, ...services.map(s => s.id)) + 1,
            ...serviceForm as Service
          };
          setServices([...services, newService]);
        }
        
        toast({
          title: isEditing ? "Servicio actualizado (local)" : "Servicio creado (local)",
          description: "Cambios guardados en modo de demostración",
          variant: "warning"
        });
      }
      
      setShowServiceDialog(false);
    } catch (err) {
      console.error("Error saving service:", err);
      setError("Ocurrió un error al guardar el servicio");
      
      // Simulación en caso de error
      if (isEditing && selectedService) {
        setServices(services.map(s => s.id === selectedService.id ? { ...s, ...serviceForm } : s));
      } else {
        const newService: Service = {
          id: Math.max(0, ...services.map(s => s.id)) + 1,
          ...serviceForm as Service
        };
        setServices([...services, newService]);
      }
      
      toast({
        title: "Error de conexión",
        description: "Cambios guardados localmente",
        variant: "destructive"
      });
      
      setShowServiceDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("¿Está seguro de que desea eliminar este servicio?")) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/services/${id}?schemaName=${schemaName}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ complexId })
      });
      
      if (response.ok) {
        setServices(services.filter(s => s.id !== id));
        toast({
          title: "Servicio eliminado",
          description: "El servicio se ha eliminado correctamente",
          variant: "default"
        });
      } else {
        // Simulación
        setServices(services.filter(s => s.id !== id));
        toast({
          title: "Servicio eliminado (local)",
          description: "El servicio se ha eliminado en modo de demostración",
          variant: "warning"
        });
      }
    } catch (err) {
      console.error("Error deleting service:", err);
      setError("Ocurrió un error al eliminar el servicio");
      
      // Simulación en caso de error
      setServices(services.filter(s => s.id !== id));
      toast({
        title: "Error de conexión",
        description: "Servicio eliminado localmente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar estado de un servicio
  const renderServiceStatus = (status: string) => {
    let statusText = "", bgColor = "", textColor = "";
    
    switch(status) {
      case "active":
        statusText = "Activo"; bgColor = "bg-green-100"; textColor = "text-green-800";
        break;
      case "inactive":
        statusText = "Inactivo"; bgColor = "bg-gray-100"; textColor = "text-gray-800";
        break;
      case "maintenance":
        statusText = "En Mantenimiento"; bgColor = "bg-yellow-100"; textColor = "text-yellow-800";
        break;
      default:
        statusText = status; bgColor = "bg-blue-100"; textColor = "text-blue-800";
    }
    
    return <Badge className={`${bgColor} ${textColor}`}>{statusText}</Badge>;
  };
  
  // Renderizar estado de una reserva
  const renderReservationStatus = (status: string) => {
    let statusText = "", bgColor = "", textColor = "";
    
    switch(status) {
      case "pending":
        statusText = "Pendiente"; bgColor = "bg-blue-100"; textColor = "text-blue-800";
        break;
      case "approved":
        statusText = "Aprobada"; bgColor = "bg-green-100"; textColor = "text-green-800";
        break;
      case "rejected":
        statusText = "Rechazada"; bgColor = "bg-red-100"; textColor = "text-red-800";
        break;
      case "cancelled":
        statusText = "Cancelada"; bgColor = "bg-gray-100"; textColor = "text-gray-800";
        break;
      default:
        statusText = status; bgColor = "bg-blue-100"; textColor = "text-blue-800";
    }
    
    return <Badge className={`${bgColor} ${textColor}`}>{statusText}</Badge>;
  };

  // Renderizado condicional para carga
  if (isLoading && services.length === 0) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-lg">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Servicios Comunes</h1>
          <p className="text-gray-500">Gestión de servicios y reservas del conjunto</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="reservations">Reservaciones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="py-4">
          <div className="mb-4 flex justify-end">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => handleOpenServiceDialog()}
            >
              <Plus className="mr-2 h-4 w-4" /> Nuevo Servicio
            </Button>
          </div>
          
          {services.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No hay servicios</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No se encontraron servicios comunes registrados
              </p>
              <div className="mt-6">
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleOpenServiceDialog()}
                >
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Servicio
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      {renderServiceStatus(service.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{service.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Capacidad: {service.capacity} personas</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Horario: {service.startTime} - {service.endTime}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Costo: {service.cost > 0 ? `$${service.cost.toLocaleString()}` : 'Gratuito'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenServiceDialog(service)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reservations" className="py-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Reservaciones</h2>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                // Abrir diálogo de nueva reserva (implementar si se necesita)
                toast({
                  title: "Funcionalidad en desarrollo",
                  description: "La creación de reservas estará disponible próximamente",
                  variant: "default"
                });
              }}
            >
              <Calendar className="mr-2 h-4 w-4" /> Nueva Reserva
            </Button>
          </div>
          
          {reservations.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No hay reservaciones</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No se encontraron reservaciones registradas
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Residente</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.serviceName}</TableCell>
                      <TableCell>{reservation.userName}</TableCell>
                      <TableCell>{reservation.propertyUnit}</TableCell>
                      <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                      <TableCell>{reservation.startTime} - {reservation.endTime}</TableCell>
                      <TableCell>{renderReservationStatus(reservation.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Funcionalidad en desarrollo",
                              description: "La gestión de reservas estará disponible próximamente",
                              variant: "default"
                            });
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Diálogo para crear/editar servicio */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Servicio" : "Nuevo Servicio"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="name">Nombre del Servicio</Label>
              <Input
                id="name"
                name="name"
                value={serviceForm.name || ''}
                onChange={handleServiceInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={serviceForm.status || 'active'}
                onValueChange={(value) => handleServiceSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="maintenance">En Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="capacity">Capacidad (personas)</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={serviceForm.capacity || 0}
                onChange={handleServiceInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cost">Costo (0 para gratuito)</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={serviceForm.cost || 0}
                onChange={handleServiceInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="startTime">Hora de Inicio</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={serviceForm.startTime || ''}
                onChange={handleServiceInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="endTime">Hora de Fin</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={serviceForm.endTime || ''}
                onChange={handleServiceInputChange}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={serviceForm.description || ''}
                onChange={handleServiceInputChange}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="rules">Reglas y Recomendaciones</Label>
              <Textarea
                id="rules"
                name="rules"
                value={serviceForm.rules || ''}
                onChange={handleServiceInputChange}
                className="min-h-[120px]"
                placeholder="Ingrese las reglas y recomendaciones para el uso del servicio..."
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowServiceDialog(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700" 
              onClick={handleSaveService} 
              disabled={isLoading}
            >
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}