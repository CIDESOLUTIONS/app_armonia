import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getPaymentGatewaysConfig,
  createPaymentGatewayConfig,
  updatePaymentGatewayConfig,
  deletePaymentGatewayConfig,
} from "@/services/financeService";
import {
  PaymentGatewayConfigDto,
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
  PaymentGatewayType,
} from "@/common/dto/payment-gateways.dto";

const initialCreateFormState: CreatePaymentGatewayDto = {
  name: "",
  type: PaymentGatewayType.STRIPE,
  apiKey: "",
  secretKey: "",
  isActive: true,
  testMode: true,
  webhookUrl: "",
  merchantId: "",
  environment: "test",
  supportedCurrencies: [],
  supportedMethods: [],
};

export function PaymentGatewaySection() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [gateways, setGateways] = useState<PaymentGatewayConfigDto[]>([]);
  const [selectedGateway, setSelectedGateway] =
    useState<PaymentGatewayConfigDto | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newGatewayForm, setNewGatewayForm] = useState<CreatePaymentGatewayDto>(
    initialCreateFormState,
  );

  const [editGatewayForm, setEditGatewayForm] =
    useState<UpdatePaymentGatewayDto>({});

  const fetchGateways = async () => {
    setLoading(true);
    try {
      const response = await getPaymentGatewaysConfig();
      setGateways(response);
    } catch (error) {
      console.error("Error fetching payment gateways:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar las configuraciones de pasarelas de pago.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  const handleCreateGateway = async () => {
    if (
      !newGatewayForm.name ||
      !newGatewayForm.type ||
      !newGatewayForm.apiKey ||
      !newGatewayForm.secretKey
    ) {
      toast({
        title: "Error de Validación",
        description:
          "Por favor, complete todos los campos obligatorios (Nombre, Tipo, API Key, Secret Key).",
        variant: "destructive",
      });
      return;
    }
    try {
      await createPaymentGatewayConfig(newGatewayForm);
      toast({
        title: "Éxito",
        description: "Configuración de pasarela creada correctamente.",
      });
      setIsCreateDialogOpen(false);
      setNewGatewayForm(initialCreateFormState);
      fetchGateways();
    } catch (error) {
      console.error("Error creating payment gateway:", error);
      toast({
        title: "Error",
        description: "Error al crear la configuración de pasarela.",
        variant: "destructive",
      });
    }
  };

  const handleSelectGateway = (gatewayId: string) => {
    const gateway = gateways.find((g) => g.id.toString() === gatewayId) || null;
    setSelectedGateway(gateway);
    if (gateway) {
      setEditGatewayForm({
        name: gateway.name,
        type: gateway.type,
        apiKey: "", // Do not show existing keys
        secretKey: "",
        isActive: gateway.isActive,
        testMode: gateway.testMode,
        webhookUrl: gateway.webhookUrl,
        merchantId: gateway.merchantId,
        environment: gateway.environment,
        supportedCurrencies: gateway.supportedCurrencies,
        supportedMethods: gateway.supportedMethods,
      });
    }
  };

  const handleUpdateGateway = async () => {
    if (!selectedGateway) return;
    try {
      // Filter out empty keys so they are not sent to the backend
      const { apiKey, secretKey, ...rest } = editGatewayForm;
      const payload: UpdatePaymentGatewayDto = { ...rest };
      if (apiKey) payload.apiKey = apiKey;
      if (secretKey) payload.secretKey = secretKey;

      await updatePaymentGatewayConfig(selectedGateway.id, payload);
      toast({
        title: "Éxito",
        description: "Configuración de pasarela actualizada correctamente.",
      });
      fetchGateways();
    } catch (error) {
      console.error("Error updating payment gateway:", error);
      toast({
        title: "Error",
        description: "Error al actualizar la configuración de pasarela.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGateway = async (id: string) => {
    if (
      !confirm(
        "¿Estás seguro de que quieres eliminar esta configuración de pasarela?",
      )
    )
      return;
    try {
      await deletePaymentGatewayConfig(id);
      toast({
        title: "Éxito",
        description: "Configuración de pasarela eliminada correctamente.",
      });
      setSelectedGateway(null);
      fetchGateways();
    } catch (error) {
      console.error("Error deleting payment gateway:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la configuración de pasarela.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configuración de Pasarelas de Pago</CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gatewaySelect">Pasarela a Configurar</Label>
              <Select onValueChange={handleSelectGateway}>
                <SelectTrigger id="gatewaySelect">
                  <SelectValue placeholder="Seleccione una pasarela" />
                </SelectTrigger>
                <SelectContent>
                  {gateways.map((gateway) => (
                    <SelectItem key={gateway.id} value={gateway.id.toString()}>
                      {gateway.name} ({gateway.type}) - {gateway.isActive ? "Activa" : "Inactiva"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedGateway && (
            <div className="mt-6 space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">
                Editando: {selectedGateway.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editName">Nombre</Label>
                  <Input
                    id="editName"
                    type="text"
                    value={editGatewayForm.name || ""}
                    onChange={(e) =>
                      setEditGatewayForm({
                        ...editGatewayForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editApiKey">Nueva API Key (opcional)</Label>
                  <Input
                    id="editApiKey"
                    type="password"
                    placeholder="Dejar en blanco para no cambiar"
                    onChange={(e) =>
                      setEditGatewayForm({
                        ...editGatewayForm,
                        apiKey: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editSecretKey">Nuevo Secret Key (opcional)</Label>
                  <Input
                    id="editSecretKey"
                    type="password"
                    placeholder="Dejar en blanco para no cambiar"
                    onChange={(e) =>
                      setEditGatewayForm({
                        ...editGatewayForm,
                        secretKey: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editWebhookUrl">Webhook URL</Label>
                  <Input
                    id="editWebhookUrl"
                    type="text"
                    value={editGatewayForm.webhookUrl || ""}
                    onChange={(e) =>
                      setEditGatewayForm({
                        ...editGatewayForm,
                        webhookUrl: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editIsActive"
                    checked={editGatewayForm.isActive}
                    onCheckedChange={(checked) =>
                      setEditGatewayForm({ ...editGatewayForm, isActive: checked })
                    }
                  />
                  <Label htmlFor="editIsActive">Activa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editTestMode"
                    checked={editGatewayForm.testMode}
                    onCheckedChange={(checked) =>
                      setEditGatewayForm({ ...editGatewayForm, testMode: checked })
                    }
                  />
                  <Label htmlFor="editTestMode">Modo de Prueba</Label>
                </div>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleUpdateGateway}>Guardar Cambios</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteGateway(selectedGateway.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Pasarela de Pago</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newName" className="text-right">Nombre</Label>
              <Input id="newName" value={newGatewayForm.name} onChange={(e) => setNewGatewayForm({ ...newGatewayForm, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newType" className="text-right">Tipo</Label>
              <Select value={newGatewayForm.type} onValueChange={(value) => setNewGatewayForm({ ...newGatewayForm, type: value as PaymentGatewayType })}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Seleccionar Tipo" /></SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentGatewayType).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newApiKey" className="text-right">API Key</Label>
              <Input id="newApiKey" type="password" value={newGatewayForm.apiKey} onChange={(e) => setNewGatewayForm({ ...newGatewayForm, apiKey: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newSecretKey" className="text-right">Secret Key</Label>
              <Input id="newSecretKey" type="password" value={newGatewayForm.secretKey} onChange={(e) => setNewGatewayForm({ ...newGatewayForm, secretKey: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newWebhookUrl" className="text-right">Webhook URL</Label>
              <Input id="newWebhookUrl" value={newGatewayForm.webhookUrl} onChange={(e) => setNewGatewayForm({ ...newGatewayForm, webhookUrl: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newIsActive" className="text-right">Estado</Label>
              <div className="col-span-3 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <Switch id="newIsActive" checked={newGatewayForm.isActive} onCheckedChange={(checked) => setNewGatewayForm({ ...newGatewayForm, isActive: checked })} />
                    <Label htmlFor="newIsActive">Activa</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="newTestMode" checked={newGatewayForm.testMode} onCheckedChange={(checked) => setNewGatewayForm({ ...newGatewayForm, testMode: checked })} />
                    <Label htmlFor="newTestMode">Modo Prueba</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateGateway}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
