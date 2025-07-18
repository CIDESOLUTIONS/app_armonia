import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentGatewayConfig {
  id: string;
  name: string;
  apiKey: string;
  secretKey: string;
  isActive: boolean;
  supportedCurrencies: string[];
}

export function PaymentGatewaySection() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayConfig | null>(null);

  // Mock data for demonstration
  const mockGateways: PaymentGatewayConfig[] = [
    {
      id: "1",
      name: "Stripe",
      apiKey: "pk_test_********************",
      secretKey: "sk_test_********************",
      isActive: true,
      supportedCurrencies: ["USD", "COP"],
    },
    {
      id: "2",
      name: "PayU Latam",
      apiKey: "pk_payu_********************",
      secretKey: "sk_payu_********************",
      isActive: false,
      supportedCurrencies: ["COP", "USD"],
    },
  ];

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      setGateways(mockGateways);
      setLoading(false);
    }, 500);
  }, []);

  const handleSaveConfig = () => {
    if (!selectedGateway) {
      toast({ title: "Error", description: "Seleccione una pasarela para configurar.", variant: "destructive" });
      return;
    }
    // In a real application, you would send this data to your backend
    console.log("Saving config for:", selectedGateway);
    toast({ title: "Éxito", description: `Configuración de ${selectedGateway.name} guardada.` });
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gatewaySelect">Seleccionar Pasarela</Label>
              <Select onValueChange={(value) => setSelectedGateway(gateways.find(g => g.id === value) || null)}>
                <SelectTrigger id="gatewaySelect">
                  <SelectValue placeholder="Seleccione una pasarela" />
                </SelectTrigger>
                <SelectContent>
                  {gateways.map((gateway) => (
                    <SelectItem key={gateway.id} value={gateway.id}>
                      {gateway.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedGateway && (
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="text"
                  value={selectedGateway.apiKey}
                  onChange={(e) => setSelectedGateway({ ...selectedGateway, apiKey: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input
                  id="secretKey"
                  type="text"
                  value={selectedGateway.secretKey}
                  onChange={(e) => setSelectedGateway({ ...selectedGateway, secretKey: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="isActive">Activa</Label>
                <Select value={selectedGateway.isActive ? "true" : "false"} onValueChange={(value) => setSelectedGateway({ ...selectedGateway, isActive: value === "true" })}>
                  <SelectTrigger id="isActive">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sí</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Monedas Soportadas</Label>
                <Input
                  type="text"
                  value={selectedGateway.supportedCurrencies.join(", ")}
                  onChange={(e) => setSelectedGateway({ ...selectedGateway, supportedCurrencies: e.target.value.split(",").map(s => s.trim().toUpperCase()) })}
                  placeholder="Ej: USD, COP"
                />
              </div>
              <Button onClick={handleSaveConfig}>Guardar Configuración</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}