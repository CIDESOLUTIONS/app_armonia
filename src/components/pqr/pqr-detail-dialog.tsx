import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PQRService } from '@/lib/pqr/pqr-service';
import { ActivityHistory } from '@/components/common/activity-history';
import { toast } from '@/components/ui/use-toast';

interface PQRDetailDialogProps {
  pqr: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  currentUser: {
    id: number;
    role: string;
  };
}

export function PQRDetailDialog({ 
  pqr, 
  isOpen, 
  onOpenChange, 
  onUpdate,
  currentUser
}: PQRDetailDialogProps) {
  const [status, setStatus] = useState(pqr.status);
  const [response, setResponse] = useState('');
  const [activityHistory, setActivityHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  // Verificar permisos de actualización
  const canUpdatePQR = currentUser.role === 'COMPLEX_ADMIN' || 
                       currentUser.role === 'APP_ADMIN' || 
                       pqr.userId === currentUser.id;

  useEffect(() => {
    const fetchActivityHistory = async () => {
      try {
        const history = await PQRService.getPQRActivityHistory(pqr.id);
        setActivityHistory(history);
      } catch (error) {
        console.error('Error cargando historial de actividad:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar el historial de actividad",
          variant: "destructive"
        });
      }
    };

    if (isOpen && activeTab === 'activity') {
      fetchActivityHistory();
    }
  }, [isOpen, activeTab, pqr.id]);

  const handleUpdatePQR = async () => {
    try {
      if (!canUpdatePQR) {
        toast({
          title: "Acceso Denegado",
          description: "No tiene permisos para actualizar esta PQR",
          variant: "destructive"
        });
        return;
      }

      await PQRService.updatePQR(
        pqr.id, 
        { status, response }, 
        currentUser.id
      );
      
      toast({
        title: "PQR Actualizada",
        description: "La solicitud ha sido actualizada exitosamente",
        variant: "success"
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error actualizando PQR:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la PQR",
        variant: "destructive"
      });
    }
  };

  if (!pqr) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Detalle de PQR</DialogTitle>
          <DialogDescription>
            Información detallada y gestión de la Petición, Queja o Reclamo
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="activity">Historial de Actividad</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Tipo:</label>
                <span className="col-span-3">{pqr.type}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Título:</label>
                <span className="col-span-3">{pqr.title}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Descripción:</label>
                <span className="col-span-3">{pqr.description}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Prioridad:</label>
                <span className="col-span-3">{pqr.priority}</span>
              </div>
              
              {canUpdatePQR && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Estado:</label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Abierto</SelectItem>
                        <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                        <SelectItem value="RESOLVED">Resuelto</SelectItem>
                        <SelectItem value="CLOSED">Cerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Respuesta:</label>
                    <Textarea 
                      className="col-span-3"
                      placeholder="Escriba su respuesta aquí"
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <ActivityHistory activities={activityHistory} />
          </TabsContent>
        </Tabs>
        
        {canUpdatePQR && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdatePQR}>
              Guardar Cambios
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
