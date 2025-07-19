import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Placeholder for actual API calls to configure payment gateways
// In a real application, these would interact with your backend to save/retrieve API keys, webhook URLs, etc.
const savePaymentGatewayConfig = async (config: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saving payment gateway config:", config);
      resolve({ success: true });
    }, 1000);
  });
};

const getPaymentGatewayConfig = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Fetching payment gateway config");
      // Simulate fetching existing config
      resolve({
        stripePublicKey: "pk_test_YOUR_STRIPE_PUBLIC_KEY",
        stripeSecretKey: "sk_test_YOUR_STRIPE_SECRET_KEY",
        paypalClientId: "YOUR_PAYPAL_CLIENT_ID",
      });
    }, 1000);
  });
};

export function PaymentGatewayConfig() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    stripePublicKey: "",
    stripeSecretKey: "",
    paypalClientId: "",
  });

  // Load existing config on component mount
  React.useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const fetchedConfig = await getPaymentGatewayConfig();
        setConfig(fetchedConfig as any);
      } catch (error) {
        console.error("Error fetching config:", error);
        toast({
          title: "Error",
          description:
            "No se pudo cargar la configuración de la pasarela de pago.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await savePaymentGatewayConfig(config);
      toast({
        title: "Éxito",
        description: "Configuración guardada correctamente.",
      });
    } catch (error) {
      console.error("Error saving config:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integración con Pasarelas de Pago</CardTitle>
        <CardDescription>
          Configure las credenciales para sus pasarelas de pago.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
            <Input
              id="stripePublicKey"
              name="stripePublicKey"
              value={config.stripePublicKey}
              onChange={handleChange}
              placeholder="pk_test_..."
            />
          </div>
          <div>
            <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
            <Input
              id="stripeSecretKey"
              name="stripeSecretKey"
              type="password"
              value={config.stripeSecretKey}
              onChange={handleChange}
              placeholder="sk_test_..."
            />
          </div>
          <div>
            <Label htmlFor="paypalClientId">PayPal Client ID</Label>
            <Input
              id="paypalClientId"
              name="paypalClientId"
              value={config.paypalClientId}
              onChange={handleChange}
              placeholder="A-B12C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar Configuración
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
