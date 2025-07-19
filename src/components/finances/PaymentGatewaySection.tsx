import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/common/dto/payment-gateways.dto";

export function PaymentGatewaySection() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [gateways, setGateways] = useState<PaymentGatewayConfigDto[]>([]);
  const [selectedGateway, setSelectedGateway] =
    useState<PaymentGatewayConfigDto | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newGatewayForm, setNewGatewayForm] = useState<CreatePaymentGatewayDto>(
    {
      name: "",
      type: PaymentGatewayType.STRIPE,
      apiKey: "",
      secretKey: "",
      isActive: true,
      supportedCurrencies: [],
    },
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
        title: "Error",
        description:
          "Por favor, complete todos los campos obligatorios para crear una pasarela.",
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
      setNewGatewayForm({
        name: "",
        type: PaymentGatewayType.STRIPE,
        apiKey: "",
        secretKey: "",
        isActive: true,
        supportedCurrencies: [],
      });
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

  const handleEditGateway = (gateway: PaymentGatewayConfigDto) => {
    setSelectedGateway(gateway);
    setEditGatewayForm({
      name: gateway.name,
      type: gateway.type,
      apiKey: gateway.apiKey,
      secretKey: gateway.secretKey,
      isActive: gateway.isActive,
      supportedCurrencies: gateway.supportedCurrencies,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateGateway = async () => {
    if (!selectedGateway) return;
    try {
      await updatePaymentGatewayConfig(selectedGateway.id, editGatewayForm);
      toast({
        title: "Éxito",
        description: "Configuración de pasarela actualizada correctamente.",
      });
      setIsEditDialogOpen(false);
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

  const handleDeleteGateway = async (id: number) => {
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
        <CardHeader>
          <CardTitle>Configuración de Pasarelas de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="mb-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva Pasarela
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gatewaySelect">
                Seleccionar Pasarela Existente
              </Label>
              <Select
                onValueChange={(value) =>
                  setSelectedGateway(
                    gateways.find((g) => g.id.toString() === value) || null,
                  )
                }
              >
                <SelectTrigger id="gatewaySelect">
                  <SelectValue placeholder="Seleccione una pasarela" />
                </SelectTrigger>
                <SelectContent>
                  {gateways.map((gateway) => (
                    <SelectItem key={gateway.id} value={gateway.id.toString()}>
                      {gateway.name} ({gateway.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedGateway && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">
                Detalles de {selectedGateway.name}
              </h3>
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
                <Label htmlFor="editType">Tipo</Label>
                <Select
                  value={editGatewayForm.type || ""}
                  onValueChange={(value) =>
                    setEditGatewayForm({
                      ...editGatewayForm,
                      type: value as PaymentGatewayType,
                    })
                  }
                >
                  <SelectTrigger id="editType">
                    <SelectValue placeholder="Seleccionar Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentGatewayType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editApiKey">API Key</Label>
                <Input
                  id="editApiKey"
                  type="text"
                  value={editGatewayForm.apiKey || ""}
                  onChange={(e) =>
                    setEditGatewayForm({
                      ...editGatewayForm,
                      apiKey: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editSecretKey">Secret Key</Label>
                <Input
                  id="editSecretKey"
                  type="text"
                  value={editGatewayForm.secretKey || ""}
                  onChange={(e) =>
                    setEditGatewayForm({
                      ...editGatewayForm,
                      secretKey: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editIsActive">Activa</Label>
                <Select
                  value={editGatewayForm.isActive?.toString() || "false"}
                  onValueChange={(value) =>
                    setEditGatewayForm({
                      ...editGatewayForm,
                      isActive: value === "true",
                    })
                  }
                >
                  <SelectTrigger id="editIsActive">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sí</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editSupportedCurrencies">
                  Monedas Soportadas
                </Label>
                <Input
                  id="editSupportedCurrencies"
                  type="text"
                  value={editGatewayForm.supportedCurrencies?.join(", ") || ""}
                  onChange={(e) =>
                    setEditGatewayForm({
                      ...editGatewayForm,
                      supportedCurrencies: e.target.value
                        .split(",")
                        .map((s) => s.trim().toUpperCase()),
                    })
                  }
                  placeholder="Ej: USD, COP"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleUpdateGateway}>Guardar Cambios</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteGateway(selectedGateway.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar Pasarela
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for creating a new gateway */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Pasarela de Pago</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="newName">Nombre</Label>
              <Input
                id="newName"
                value={newGatewayForm.name}
                onChange={(e) =>
                  setNewGatewayForm({ ...newGatewayForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="newType">Tipo</Label>
              <Select
                value={newGatewayForm.type}
                onValueChange={(value) =>
                  setNewGatewayForm({
                    ...newGatewayForm,
                    type: value as PaymentGatewayType,
                  })
                }
              >
                <SelectTrigger id="newType">
                  <SelectValue placeholder="Seleccionar Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentGatewayType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="newApiKey">API Key</Label>
              <Input
                id="newApiKey"
                value={newGatewayForm.apiKey}
                onChange={(e) =>
                  setNewGatewayForm({
                    ...newGatewayForm,
                    apiKey: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="newSecretKey">Secret Key</Label>
              <Input
                id="newSecretKey"
                value={newGatewayForm.secretKey}
                onChange={(e) =>
                  setNewGatewayForm({
                    ...newGatewayForm,
                    secretKey: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="newIsActive">Activa</Label>
              <Select
                value={newGatewayForm.isActive?.toString()}
                onValueChange={(value) =>
                  setNewGatewayForm({
                    ...newGatewayForm,
                    isActive: value === "true",
                  })
                }
              >
                <SelectTrigger id="newIsActive">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="newSupportedCurrencies">Monedas Soportadas</Label>
              <Input
                id="newSupportedCurrencies"
                value={newGatewayForm.supportedCurrencies?.join(", ")}
                onChange={(e) =>
                  setNewGatewayForm({
                    ...newGatewayForm,
                    supportedCurrencies: e.target.value
                      .split(",")
                      .map((s) => s.trim().toUpperCase()),
                  })
                }
                placeholder="Ej: USD, COP"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateGateway}>Crear Pasarela</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
