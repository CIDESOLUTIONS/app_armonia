// src/components/pqr/PQRDetailDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { 
  useServices, 
  PQRStatus, 
  PQRPriority, 
  PQRType, 
  PQR 
} from "@/lib/services";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  Tag, 
  User, 
  MessageCircle,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";

interface PQRDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pqrId: number | null;
  onStatusChange?: () => void;
}

export function PQRDetailDialog({ 
  isOpen, 
  onClose, 
  pqrId, 
  onStatusChange 
}: PQRDetailDialogProps) {
  const { pqr } = useServices();
  const { user } = useAuth();
  const [pqrDetail, setPqrDetail] = useState<PQR | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<PQRStatus | "">("");
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Cargar datos de la PQR
  useEffect(() => {
    const fetchPQRDetail = async () => {
      if (!pqrId || !isOpen) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await pqr.getPQR(pqrId);
        setPqrDetail(data);
        setNewStatus("");
        setResponse("");
      } catch (err) {
        console.error("Error al obtener detalles de PQR:", err);
        setError("No se pudieron cargar los detalles. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPQRDetail();
  }, [pqrId, isOpen, pqr]);
  
  // Función para obtener el color de la badge según el estado
  const getStatusColor = (status: PQRStatus) => {
    switch (status) {
      case PQRStatus.PENDING:
        return "bg-yellow-500";
      case PQRStatus.IN_PROGRESS:
        return "bg-blue-500";
      case PQRStatus.RESOLVED:
        return "bg-green-500";
      case PQRStatus.CLOSED:
        return "bg-gray-500";
      case PQRStatus.CANCELLED:
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };
  
  // Función para obtener el texto del estado
  const getStatusText = (status: PQRStatus) => {
    switch (status) {
      case PQRStatus.PENDING:
        return "Pendiente";
      case PQRStatus.IN_PROGRESS:
        return "En proceso";
      case PQRStatus.RESOLVED:
        return "Resuelto";
      case PQRStatus.CLOSED:
        return "Cerrado";
      case PQRStatus.CANCELLED:
        return "Cancelado";
      default:
        return status;
    }
  };
  
  // Función para obtener el texto de la prioridad
  const getPriorityText = (priority: PQRPriority) => {
    switch (priority) {
      case PQRPriority.LOW:
        return "Baja";
      case PQRPriority.MEDIUM:
        return "Media";
      case PQRPriority.HIGH:
        return "Alta";
      case PQRPriority.URGENT:
        return "Urgente";
      default:
        return priority;
    }
  };
  
  // Función para obtener el color de la prioridad
  const getPriorityColor = (priority: PQRPriority) => {
    switch (priority) {
      case PQRPriority.LOW:
        return "bg-blue-400";
      case PQRPriority.MEDIUM:
        return "bg-yellow-400";
      case PQRPriority.HIGH:
        return "bg-orange-500";
      case PQRPriority.URGENT:
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };
  
  // Función para obtener el texto del tipo
  const getTypeText = (type: PQRType) => {
    switch (type) {
      case PQRType.PETITION:
        return "Petición";
      case PQRType.COMPLAINT:
        return "Queja";
      case PQRType.CLAIM:
        return "Reclamo";
      default:
        return type;
    }
  };
  
  // Función para cambiar el estado de la PQR
  const handleStatusChange = async () => {
    if (!pqrDetail || !newStatus || !pqrId) return;
    
    try {
      setSubmitting(true);
      
      await pqr.changeStatus(pqrId, newStatus as PQRStatus, response);
      
      toast({
        title: "Estado actualizado",
        description: "El estado de la solicitud ha sido actualizado exitosamente",
        variant: "default",
      });
      
      // Actualizar el detalle en la UI
      setPqrDetail({
        ...pqrDetail,
        status: newStatus as PQRStatus,
        response: response || pqrDetail.response,
      });
      
      // Limpiar los campos
      setNewStatus("");
      setResponse("");
      
      // Notificar cambio para actualizar la lista
      if (onStatusChange) onStatusChange();
      
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Verificar si el usuario puede cambiar el estado (solo administradores)
  const canChangeStatus = user && (user.role === "ADMIN" || user.role === "COMPLEX_ADMIN");
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
            <p className="text-red-500">{error}</p>
            <Button onClick={onClose} className="mt-4">
              Cerrar
            </Button>
          </div>
        ) : pqrDetail ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{pqrDetail.title}</DialogTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className={getStatusColor(pqrDetail.status)}>
                  {getStatusText(pqrDetail.status)}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(pqrDetail.priority)}>
                  {getPriorityText(pqrDetail.priority)}
                </Badge>
                <Badge variant="outline">
                  {getTypeText(pqrDetail.type)}
                </Badge>
                {pqrDetail.category && (
                  <Badge variant="outline">
                    {pqrDetail.category}
                  </Badge>
                )}
              </div>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              {/* Detalles principales */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Creado el {format(new Date(pqrDetail.createdAt), "PPP", { locale: es })}
                    {pqrDetail.updatedAt !== pqrDetail.createdAt && 
                      ` • Actualizado ${format(new Date(pqrDetail.updatedAt), "PPP", { locale: es })}`
                    }
                  </span>
                </div>
                
                {pqrDetail.assignedToId && (
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="mr-2 h-4 w-4" />
                    <span>Asignado a: {pqrDetail.assignedToId}</span>
                  </div>
                )}
                
                {(pqrDetail.category || pqrDetail.subcategory) && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Tag className="mr-2 h-4 w-4" />
                    <span>
                      {pqrDetail.category}
                      {pqrDetail.subcategory && ` › ${pqrDetail.subcategory}`}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Descripción */}
              <div>
                <h3 className="text-sm font-medium">Descripción</h3>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
                  <p className="text-sm whitespace-pre-line">{pqrDetail.description}</p>
                </div>
              </div>
              
              {/* Respuesta (si existe) */}
              {pqrDetail.response && (
                <div>
                  <h3 className="text-sm font-medium flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Respuesta
                  </h3>
                  <div className="mt-1 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-200 dark:border-indigo-800">
                    <p className="text-sm whitespace-pre-line">{pqrDetail.response}</p>
                  </div>
                </div>
              )}
              
              {/* Formulario de cambio de estado (solo para administradores) */}
              {canChangeStatus && pqrDetail.status !== PQRStatus.CLOSED && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                  <h3 className="text-sm font-medium mb-2">Actualizar estado</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="status">Nuevo estado</Label>
                      <Select
                        value={newStatus}
                        onValueChange={setNewStatus}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={PQRStatus.PENDING}>Pendiente</SelectItem>
                          <SelectItem value={PQRStatus.IN_PROGRESS}>En proceso</SelectItem>
                          <SelectItem value={PQRStatus.RESOLVED}>Resuelto</SelectItem>
                          <SelectItem value={PQRStatus.CLOSED}>Cerrado</SelectItem>
                          <SelectItem value={PQRStatus.CANCELLED}>Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="response">Respuesta o comentarios</Label>
                      <Textarea
                        id="response"
                        placeholder="Escribe una respuesta o comentarios sobre el cambio de estado..."
                        className="min-h-[100px]"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
              
              {canChangeStatus && newStatus && (
                <Button 
                  onClick={handleStatusChange} 
                  disabled={submitting || !newStatus}
                  className="flex items-center gap-1"
                >
                  {submitting ? (
                    <>Actualizando...</>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Actualizar estado
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center">
            <p>No se encontró la solicitud.</p>
            <Button onClick={onClose} className="mt-4">
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}