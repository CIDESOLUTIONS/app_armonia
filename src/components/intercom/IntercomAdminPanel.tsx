import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AdminPanelSettings, Save, RefreshCw, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { intercomService } from '../../lib/services/intercom-service';

// Esquema de validación
const schema = yup.object({
  whatsappEnabled: yup.boolean(),
  whatsappProvider: yup.string().when('whatsappEnabled', {
    is: true,
    then: yup.string().required('El proveedor de WhatsApp es obligatorio')
  }),
  telegramEnabled: yup.boolean(),
  telegramBotToken: yup.string().when('telegramEnabled', {
    is: true,
    then: yup.string().required('El token del bot de Telegram es obligatorio')
  }),
  defaultResponseTimeout: yup.number().required('El tiempo de espera es obligatorio').min(10, 'Mínimo 10 segundos'),
  maxRetries: yup.number().required('El número de reintentos es obligatorio').min(0, 'No puede ser negativo'),
  retryDelay: yup.number().required('El tiempo entre reintentos es obligatorio').min(5, 'Mínimo 5 segundos')
}).required();


  // Estados
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Configuración del formulario
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      whatsappEnabled: true,
      whatsappProvider: '',
      whatsappConfig: {},
      telegramEnabled: true,
      telegramBotToken: '',
      telegramConfig: {},
      defaultResponseTimeout: 60,
      maxRetries: 2,
      retryDelay: 30,
      messageTemplates: {}
    }
  });

  // Observar cambios en campos relevantes
  const watchWhatsappEnabled = watch('whatsappEnabled');
  const watchTelegramEnabled = watch('telegramEnabled');
  const watchWhatsappProvider = watch('whatsappProvider');

  // Cargar datos iniciales
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // En un caso real, estos datos vendrían de la API
        const settings = await intercomService.getSettings();
        
        if (settings) {
          setValue('whatsappEnabled', settings.whatsappEnabled);
          setValue('whatsappProvider', settings.whatsappProvider || '');
          setValue('whatsappConfig', settings.whatsappConfig || {});
          setValue('telegramEnabled', settings.telegramEnabled);
          setValue('telegramBotToken', settings.telegramBotToken || '');
          setValue('telegramConfig', settings.telegramConfig || {});
          setValue('defaultResponseTimeout', settings.defaultResponseTimeout);
          setValue('maxRetries', settings.maxRetries);
          setValue('retryDelay', settings.retryDelay);
          setValue('messageTemplates', settings.messageTemplates || {});
        }
      } catch (error) {
        console.error('Error al cargar configuración:', error);
        setNotification({
          open: true,
          message: 'Error al cargar la configuración',
          severity: 'error'
        });
      } finally {
        setLoadingData(false);
      }
    };

    fetchSettings();
  }, [setValue]);

  // Manejar envío del formulario
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Configurar datos específicos del proveedor de WhatsApp
      if (data.whatsappEnabled) {
        if (data.whatsappProvider === 'twilio') {
          data.whatsappConfig = {
            accountSid: data.twilioAccountSid,
            authToken: data.twilioAuthToken,
            fromNumber: data.twilioFromNumber
          };
        } else if (data.whatsappProvider === 'messagebird') {
          data.whatsappConfig = {
            apiKey: data.messagebirdApiKey,
            channelId: data.messagebirdChannelId
          };
        }
      }

      // Configurar datos específicos de Telegram
      if (data.telegramEnabled) {
        data.telegramConfig = {
          webhookUrl: data.telegramWebhookUrl
        };
      }

      // Limpiar campos temporales
      delete data.twilioAccountSid;
      delete data.twilioAuthToken;
      delete data.twilioFromNumber;
      delete data.messagebirdApiKey;
      delete data.messagebirdChannelId;
      delete data.telegramWebhookUrl;

      // Guardar configuración
      await intercomService.updateSettings(data);

      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Configuración guardada correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      setNotification({
        open: true,
        message: 'Error al guardar la configuración',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle>
            <AdminPanelSettings className="mr-2 h-6 w-6 inline-block" />
            Panel de Administración de Citofonía Virtual
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Grid container spacing={3}>
            {/* Configuración de WhatsApp */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuración de WhatsApp</h3>
            
            <div className="flex items-center space-x-2">
              <Controller
                name="whatsappEnabled"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor="whatsappEnabled">Habilitar integración con WhatsApp</Label>
            </div>

            {watchWhatsappEnabled && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="whatsappProvider">Proveedor de WhatsApp</Label>
                    <Controller
                      name="whatsappProvider"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un proveedor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Seleccione un proveedor</SelectItem>
                            <SelectItem value="twilio">Twilio</SelectItem>
                            <SelectItem value="messagebird">MessageBird</SelectItem>
                            <SelectItem value="gupshup">Gupshup</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.whatsappProvider && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.whatsappProvider.message}
                      </p>
                    )}
                  </div>
                </div>

                {watchWhatsappProvider === 'twilio' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <Label htmlFor="twilioAccountSid">Account SID</Label>
                      <Controller
                        name="twilioAccountSid"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="twilioAccountSid"
                            placeholder="Account SID"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="twilioAuthToken">Auth Token</Label>
                      <Controller
                        name="twilioAuthToken"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="twilioAuthToken"
                            type="password"
                            placeholder="Auth Token"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="twilioFromNumber">Número de WhatsApp</Label>
                      <Controller
                        name="twilioFromNumber"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="twilioFromNumber"
                            placeholder="+573001234567"
                          />
                        )}
                      />
                    </div>
                  </div>
                )}

                {watchWhatsappProvider === 'messagebird' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="messagebirdApiKey">API Key</Label>
                      <Controller
                        name="messagebirdApiKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="messagebirdApiKey"
                            placeholder="API Key"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="messagebirdChannelId">Channel ID</Label>
                      <Controller
                        name="messagebirdChannelId"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="messagebirdChannelId"
                            placeholder="Channel ID"
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Configuración de Telegram */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuración de Telegram</h3>
            
            <div className="flex items-center space-x-2">
              <Controller
                name="telegramEnabled"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor="telegramEnabled">Habilitar integración con Telegram</Label>
            </div>

            {watchTelegramEnabled && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telegramBotToken">Token del Bot</Label>
                    <Controller
                      name="telegramBotToken"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="telegramBotToken"
                          placeholder="Token del Bot"
                        />
                      )}
                    />
                    {errors.telegramBotToken && (
                      <p className="text-red-500 text-sm mt-1">{errors.telegramBotToken.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="telegramWebhookUrl">URL del Webhook</Label>
                    <Controller
                      name="telegramWebhookUrl"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="telegramWebhookUrl"
                          placeholder="https://tu-dominio.com/api/webhooks/telegram"
                        />
                      )}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Para crear un bot de Telegram, contacta a @BotFather en Telegram y sigue las instrucciones
                </p>
              </div>
            )}

            {/* Configuración general */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuración General</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="defaultResponseTimeout">Tiempo de espera para respuesta (segundos)</Label>
                <Controller
                  name="defaultResponseTimeout"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="defaultResponseTimeout"
                      type="number"
                    />
                  )}
                />
                {errors.defaultResponseTimeout && (
                  <p className="text-red-500 text-sm mt-1">{errors.defaultResponseTimeout.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="maxRetries">Máximo de reintentos</Label>
                <Controller
                  name="maxRetries"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="maxRetries"
                      type="number"
                    />
                  )}
                />
                {errors.maxRetries && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxRetries.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="retryDelay">Tiempo entre reintentos (segundos)</Label>
                <Controller
                  name="retryDelay"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="retryDelay"
                      type="number"
                    />
                  )}
                />
                {errors.retryDelay && (
                  <p className="text-red-500 text-sm mt-1">{errors.retryDelay.message}</p>
                )}
              </div>
            </div>
          </div>

            {/* Plantillas de mensajes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Plantillas de Mensajes</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="whatsappTemplate">Plantilla para WhatsApp</Label>
                <Controller
                  name="messageTemplates.WHATSAPP.visitor_notification"
                  control={control}
                  defaultValue="¡Hola! Tienes un visitante: {{visitor.name}} para {{unit.number}}. Motivo: {{purpose}}"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="whatsappTemplate"
                      rows={3}
                    />
                  )}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Variables disponibles: {{visitor.name}}, {{visitor.type}}, {{unit.number}}, {{purpose}}
                </p>
              </div>
              
              <div>
                <Label htmlFor="telegramTemplate">Plantilla para Telegram</Label>
                <Controller
                  name="messageTemplates.TELEGRAM.visitor_notification"
                  control={control}
                  defaultValue="🔔 <b>Nuevo visitante</b>

Nombre: {{visitor.name}}
Tipo: {{visitor.type}}
Unidad: {{unit.number}}
Motivo: {{purpose}}"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="telegramTemplate"
                      rows={3}
                    />
                  )}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Variables disponibles: {{visitor.name}}, {{visitor.type}}, {{unit.number}}, {{purpose}}. Soporta formato HTML.
                </p>
              </div>
            </div>
          </div>

            {/* Botones de acción */}
            {/* Botones de acción */}
            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Recargar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar Configuración
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};


