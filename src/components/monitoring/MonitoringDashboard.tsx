import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

import {
  RefreshCw as RefreshIcon,
  PlusCircle as AddIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  CheckCircle as CheckIcon,
  AlertTriangle as WarningIcon,
  XCircle as ErrorIcon,
  Info as InfoIcon,
  Bell as NotificationsIcon,
  Settings as SettingsIcon,
  Activity as TimelineIcon,
  LayoutDashboard as DashboardIcon,
  CheckCircle2 as CheckCircleIcon,
  Ban as CancelIcon,
  Loader2
} from 'lucide-react';

// Enums para tipos de monitoreo
enum MonitoringType {
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  APPLICATION = 'APPLICATION',
  USER_EXPERIENCE = 'USER_EXPERIENCE'
}

// Estados de monitoreo
enum MonitoringStatus {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

// Estados de alerta
enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED'
}

// Severidad de alertas
enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

/**
 * Componente principal para el Dashboard de Monitoreo
 */
const MonitoringDashboard = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(true);
  const [configs, setConfigs] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);
  const [openConfigDialog, setOpenConfigDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [configFormData, setConfigFormData] = useState({
    name: '',
    description: '',
    monitoringType: MonitoringType.APPLICATION,
    checkInterval: 300,
    targetResource: '',
    parameters: {},
    alertThresholds: {
      warning: 1000,
      error: 3000,
      critical: 5000
    },
    isActive: true
  });
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (session && session.user) {
      setIsAdmin((session.user as any).role === 'ADMIN');
    }
  }, [session]);

  // Cargar configuraciones de monitoreo
  const loadConfigs = useCallback(async () => {
    try {
      const response = await axios.get('/api/monitoring/configs');
      setConfigs(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al cargar configuraciones:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar configuraciones',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  // Cargar alertas activas
  const loadAlerts = useCallback(async () => {
    try {
      const response = await axios.get('/api/monitoring/alerts');
      setAlerts(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al cargar alertas:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar alertas',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  // Cargar estadísticas generales
  const loadStats = useCallback(async () => {
    try {
      const response = await axios.get('/api/monitoring/stats');
      setStats(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar estadísticas',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  // Cargar datos del dashboard
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadConfigs(),
        loadAlerts(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar datos del dashboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [loadConfigs, loadAlerts, loadStats]);

  // Cargar datos al iniciar
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Refrescar datos
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadDashboardData();
      toast({
        title: 'Éxito',
        description: 'Datos actualizados correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al actualizar datos',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Ejecutar verificación manual
  const handleExecuteCheck = async (configId: string) => {
    try {
      setRefreshing(true);
      await axios.post(`/api/monitoring/configs/${configId}/check`);
      await loadDashboardData();
      toast({
        title: 'Éxito',
        description: 'Verificación ejecutada correctamente',
      });
    } catch (error) {
      console.error('Error al ejecutar verificación:', error);
      toast({
        title: 'Error',
        description: 'Error al ejecutar verificación',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Manejar cambio de pestaña
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Manejar cambios en formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.startsWith('alertThresholds.')) {
      const threshold = name.split('.')[1];
      setConfigFormData(prev => ({
        ...prev,
        alertThresholds: {
          ...prev.alertThresholds,
          [threshold]: type === 'number' ? Number(value) : value
        }
      }));
    } else if (name.startsWith('parameters.')) {
      const param = name.split('.')[1];
      setConfigFormData(prev => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [param]: value
        }
      }));
    } else {
      setConfigFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Abrir diálogo para crear configuración
  const handleOpenCreateDialog = () => {
    setConfigFormData({
      name: '',
      description: '',
      monitoringType: MonitoringType.APPLICATION,
      checkInterval: 300,
      targetResource: '',
      parameters: {},
      alertThresholds: {
        warning: 1000,
        error: 3000,
        critical: 5000
      },
      isActive: true
    });
    setSelectedConfig(null);
    setOpenConfigDialog(true);
  };

  // Abrir diálogo para editar configuración
  const handleOpenEditDialog = (config: any) => {
    setConfigFormData({
      name: config.name,
      description: config.description || '',
      monitoringType: config.monitoringType,
      checkInterval: config.checkInterval,
      targetResource: config.targetResource,
      parameters: config.parameters || {},
      alertThresholds: config.alertThresholds,
      isActive: config.isActive
    });
    setSelectedConfig(config);
    setOpenConfigDialog(true);
  };

  // Abrir diálogo para eliminar configuración
  const handleOpenDeleteDialog = (config: any) => {
    setSelectedConfig(config);
    setOpenDeleteDialog(true);
  };

  // Abrir diálogo para gestionar alerta
  const handleOpenAlertDialog = (alert: any) => {
    setSelectedAlert(alert);
    setOpenAlertDialog(true);
  };

  // Crear o actualizar configuración
  const handleSaveConfig = async () => {
    try {
      if (selectedConfig) {
        // Actualizar configuración existente
        await axios.put(`/api/monitoring/configs/${selectedConfig.id}`, configFormData);
        toast({
          title: 'Éxito',
          description: 'Configuración actualizada correctamente',
        });
      } else {
        // Crear nueva configuración
        await axios.post('/api/monitoring/configs', configFormData);
        toast({
          title: 'Éxito',
          description: 'Configuración creada correctamente',
        });
      }
      
      setOpenConfigDialog(false);
      await loadConfigs();
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toast({
        title: 'Error',
        description: 'Error al guardar configuración',
        variant: 'destructive',
      });
    }
  };

  // Eliminar configuración
  const handleDeleteConfig = async () => {
    try {
      await axios.delete(`/api/monitoring/configs/${selectedConfig.id}`);
      setOpenDeleteDialog(false);
      await loadConfigs();
      toast({
        title: 'Éxito',
        description: 'Configuración eliminada correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar configuración:', error);
      toast({
        title: 'Error',
        description: 'Error al eliminar configuración',
        variant: 'destructive',
      });
    }
  };

  // Reconocer alerta
  const handleAcknowledgeAlert = async () => {
    try {
      await axios.post(`/api/monitoring/alerts/${selectedAlert.id}/acknowledge`);
      setOpenAlertDialog(false);
      await loadAlerts();
      toast({
        title: 'Éxito',
        description: 'Alerta reconocida correctamente',
      });
    } catch (error) {
      console.error('Error al reconocer alerta:', error);
      toast({
        title: 'Error',
        description: 'Error al reconocer alerta',
        variant: 'destructive',
      });
    }
  };

  // Resolver alerta
  const handleResolveAlert = async () => {
    try {
      await axios.post(`/api/monitoring/alerts/${selectedAlert.id}/resolve`);
      setOpenAlertDialog(false);
      await loadAlerts();
      toast({
        title: 'Éxito',
        description: 'Alerta resuelta correctamente',
      });
    } catch (error) {
      console.error('Error al resolver alerta:', error);
      toast({
        title: 'Error',
        description: 'Error al resolver alerta',
        variant: 'destructive',
      });
    }
  };

  // Renderizar icono según estado de monitoreo
  const renderStatusIcon = (status: MonitoringStatus) => {
    switch (status) {
      case MonitoringStatus.SUCCESS:
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case MonitoringStatus.WARNING:
        return <WarningIcon className="h-5 w-5 text-yellow-500" />;
      case MonitoringStatus.ERROR:
        return <ErrorIcon className="h-5 w-5 text-red-500" />;
      case MonitoringStatus.CRITICAL:
        return <CancelIcon className="h-5 w-5 text-red-700" />;
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  // Renderizar chip según severidad de alerta
  const renderAlertSeverity = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return <Badge variant="destructive">Crítica</Badge>;
      case AlertSeverity.ERROR:
        return <Badge variant="destructive">Error</Badge>;
      case AlertSeverity.WARNING:
        return <Badge variant="secondary">Advertencia</Badge>;
      case AlertSeverity.INFO:
        return <Badge variant="outline">Información</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  // Renderizar chip según estado de alerta
  const renderAlertStatus = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.ACTIVE:
        return <Badge variant="destructive">Activa</Badge>;
      case AlertStatus.ACKNOWLEDGED:
        return <Badge variant="secondary">Reconocida</Badge>;
      case AlertStatus.RESOLVED:
        return <Badge variant="default">Resuelta</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Renderizar tipo de monitoreo
  const renderMonitoringType = (type: MonitoringType) => {
    switch (type) {
      case MonitoringType.INFRASTRUCTURE:
        return 'Infraestructura';
      case MonitoringType.APPLICATION:
        return 'Aplicación';
      case MonitoringType.USER_EXPERIENCE:
        return 'Experiencia de Usuario';
      default:
        return type;
    }
  };

  // Renderizar pestaña de resumen
  const renderSummaryTab = () => {
    if (loading) {
      return (
        <div className="flex justify-center my-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return (
      <div>
        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Configuraciones Activas</p>
              <p className="text-2xl font-bold">
                {configs.filter(c => c.isActive).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Alertas Activas</p>
              <p className={`text-2xl font-bold ${alerts.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {alerts.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Disponibilidad Promedio</p>
              <p className="text-2xl font-bold">
                {stats?.overallAvailability ? `${stats.overallAvailability.toFixed(2)}%` : 'N/A'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Tiempo de Respuesta Promedio</p>
              <p className="text-2xl font-bold">
                {stats?.overallResponseTime ? `${stats.overallResponseTime.toFixed(0)}ms` : 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos de resumen - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidad por Día</CardTitle>
              <CardDescription>Gráfico de disponibilidad (placeholder)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 flex items-center justify-center rounded-md">
                <p className="text-gray-500">Gráfico de Línea aquí</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Estados</CardTitle>
              <CardDescription>Gráfico de distribución (placeholder)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 flex items-center justify-center rounded-md">
                <p className="text-gray-500">Gráfico de Pastel aquí</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas recientes */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Alertas Recientes</h3>
          {alerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.slice(0, 5).map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{renderAlertSeverity(alert.severity)}</TableCell>
                    <TableCell>{renderAlertStatus(alert.status)}</TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>{alert.config?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenAlertDialog(alert)}
                        disabled={alert.status === AlertStatus.RESOLVED}
                      >
                        <InfoIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Alert>
              <AlertTitle>No hay alertas activas</AlertTitle>
              <AlertDescription>Todo parece estar funcionando correctamente.</AlertDescription>
            </Alert>
          )}
          {alerts.length > 5 && (
            <div className="flex justify-end mt-2">
              <Button 
                variant="link" 
                onClick={() => setActiveTab('alerts')}
              >
                Ver todas las alertas
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar pestaña de alertas
  const renderAlertsTab = () => {
    if (loading) {
      return (
        <div className="flex justify-center my-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Alertas Activas</h3>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshIcon className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>

        {alerts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{renderAlertSeverity(alert.severity)}</TableCell>
                  <TableCell>{renderAlertStatus(alert.status)}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>{alert.config?.name || 'N/A'}</TableCell>
                  <TableCell>{renderMonitoringType(alert.config?.monitoringType)}</TableCell>
                  <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenAlertDialog(alert)}
                      disabled={alert.status === AlertStatus.RESOLVED}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Alert>
            <AlertTitle>No hay alertas activas</AlertTitle>
            <AlertDescription>Todo parece estar funcionando correctamente.</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  // Renderizar pestaña de configuraciones
  const renderConfigsTab = () => {
    if (loading) {
      return (
        <div className="flex justify-center my-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Configuraciones de Monitoreo</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshIcon className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
            {isAdmin && (
              <Button 
                variant="default" 
                onClick={handleOpenCreateDialog}
              >
                <AddIcon className="mr-2 h-4 w-4" />
                Añadir Configuración
              </Button>
            )}
          </div>
        </div>

        {configs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Intervalo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>{config.name}</TableCell>
                  <TableCell>{renderMonitoringType(config.monitoringType)}</TableCell>
                  <TableCell>{config.targetResource}</TableCell>
                  <TableCell>{config.checkInterval} seg.</TableCell>
                  <TableCell>
                    <Badge variant={config.isActive ? 'default' : 'secondary'}>
                      {config.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleExecuteCheck(config.id)}
                      disabled={!config.isActive || refreshing}
                      title="Ejecutar verificación"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenEditDialog(config)}
                          title="Editar"
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(config)}
                          title="Eliminar"
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Alert>
            <AlertTitle>No hay configuraciones de monitoreo</AlertTitle>
            <AlertDescription>
              {isAdmin && (
                <Button 
                  variant="link" 
                  onClick={handleOpenCreateDialog}
                  className="p-0"
                >
                  Crear una nueva configuración
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard de Monitoreo</h1>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshIcon className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      <div className="border-b border-gray-200 mb-4">
        <div className="flex space-x-4">
          <Button 
            variant={activeTab === 'summary' ? 'default' : 'ghost'}
            onClick={() => handleTabChange('summary')}
          >
            <DashboardIcon className="mr-2 h-4 w-4" />
            Resumen
          </Button>
          <Button 
            variant={activeTab === 'alerts' ? 'default' : 'ghost'}
            onClick={() => handleTabChange('alerts')}
          >
            <NotificationsIcon className="mr-2 h-4 w-4" />
            Alertas {alerts.length > 0 && `(${alerts.length})`}
          </Button>
          <Button 
            variant={activeTab === 'configs' ? 'default' : 'ghost'}
            onClick={() => handleTabChange('configs')}
          >
            <SettingsIcon className="mr-2 h-4 w-4" />
            Configuraciones
          </Button>
        </div>
      </div>

      <div>
        {activeTab === 'summary' && renderSummaryTab()}
        {activeTab === 'alerts' && renderAlertsTab()}
        {activeTab === 'configs' && renderConfigsTab()}
      </div>

      {/* Diálogo de configuración */}
      <Dialog 
        open={openConfigDialog} 
        onOpenChange={setOpenConfigDialog}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedConfig ? 'Editar Configuración' : 'Nueva Configuración'}
            </DialogTitle>
            <DialogDescription>Configure los detalles de la monitorización.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={configFormData.name}
                onChange={handleFormChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="monitoringType" className="text-right">Tipo de Monitoreo</Label>
              <Select
                name="monitoringType"
                value={configFormData.monitoringType}
                onValueChange={(value) => handleFormChange({ target: { name: 'monitoringType', value } } as React.ChangeEvent<HTMLSelectElement>)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MonitoringType.INFRASTRUCTURE}>Infraestructura</SelectItem>
                  <SelectItem value={MonitoringType.APPLICATION}>Aplicación</SelectItem>
                  <SelectItem value={MonitoringType.USER_EXPERIENCE}>Experiencia de Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={configFormData.description}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetResource" className="text-right">Recurso a Monitorear</Label>
              <Input
                id="targetResource"
                name="targetResource"
                value={configFormData.targetResource}
                onChange={handleFormChange}
                className="col-span-3"
                required
                placeholder={configFormData.monitoringType === MonitoringType.INFRASTRUCTURE 
                  ? 'Ejemplo: server:cpu, database:connections' 
                  : configFormData.monitoringType === MonitoringType.APPLICATION
                    ? 'Ejemplo: api:https://api.example.com/status, service:auth'
                    : 'Ejemplo: pageload:home, errors:javascript'}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="checkInterval" className="text-right">Intervalo de Verificación (seg)</Label>
              <Input
                id="checkInterval"
                name="checkInterval"
                type="number"
                value={configFormData.checkInterval}
                onChange={handleFormChange}
                className="col-span-3"
                required
                min={30}
              />
            </div>
            
            <div className="col-span-full">
              <h4 className="text-md font-medium mb-2">Umbrales de Alerta</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="warningThreshold">Advertencia</Label>
                  <Input
                    id="warningThreshold"
                    name="alertThresholds.warning"
                    type="number"
                    value={configFormData.alertThresholds.warning}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="errorThreshold">Error</Label>
                  <Input
                    id="errorThreshold"
                    name="alertThresholds.error"
                    type="number"
                    value={configFormData.alertThresholds.error}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="criticalThreshold">Crítico</Label>
                  <Input
                    id="criticalThreshold"
                    name="alertThresholds.critical"
                    type="number"
                    value={configFormData.alertThresholds.critical}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                name="isActive"
                checked={configFormData.isActive}
                onCheckedChange={(checked) => handleFormChange({ target: { name: 'isActive', checked, type: 'checkbox' } } as React.ChangeEvent<HTMLInputElement>)}
              />
              <Label htmlFor="isActive">Configuración Activa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfigDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveConfig}>
              {selectedConfig ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de eliminación */}
      <Dialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar la configuración "{selectedConfig?.name}"?
              Esta acción eliminará también todos los resultados y alertas asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteConfig}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de alerta */}
      <Dialog
        open={openAlertDialog}
        onOpenChange={setOpenAlertDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalles de Alerta</DialogTitle>
            <DialogDescription>Información detallada sobre la alerta seleccionada.</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="py-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-lg font-semibold">{selectedAlert.message}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedAlert.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  {renderAlertSeverity(selectedAlert.severity)}
                </div>
              </div>
              
              <h5 className="text-md font-semibold mt-4 mb-1">Recurso Afectado</h5>
              <p className="text-sm">
                {selectedAlert.config?.name || 'N/A'} ({selectedAlert.config?.targetResource || 'N/A'})
              </p>
              
              <h5 className="text-md font-semibold mt-4 mb-1">Detalles</h5>
              <div className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(selectedAlert.details, null, 2)}
                </pre>
              </div>
              
              {selectedAlert.status === AlertStatus.ACKNOWLEDGED && (
                <div className="mt-4 text-sm">
                  <p>
                    <strong>Reconocida por:</strong> {selectedAlert.acknowledgedBy?.name || 'N/A'}
                  </p>
                  <p>
                    <strong>Fecha de reconocimiento:</strong> {selectedAlert.acknowledgedAt ? new Date(selectedAlert.acknowledgedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAlertDialog(false)}>Cerrar</Button>
            {selectedAlert && selectedAlert.status === AlertStatus.ACTIVE && (
              <Button onClick={handleAcknowledgeAlert} variant="secondary">
                Reconocer
              </Button>
            )}
            {selectedAlert && (selectedAlert.status === AlertStatus.ACTIVE || selectedAlert.status === AlertStatus.ACKNOWLEDGED) && (
              <Button onClick={handleResolveAlert}>
                Resolver
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonitoringDashboard;