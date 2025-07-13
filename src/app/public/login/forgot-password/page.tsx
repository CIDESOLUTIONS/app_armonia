// C:\Users\meciz\Documents\armonia\frontend\src\app\forgot-password\page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { requestPasswordReset } from "@/services/authService";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message);
      toast({
        title: "Éxito",
        description: response.message,
      });
    } catch (error: any) {
      console.error("Error requesting password reset:", error);
      setMessage(error.message || "Error al solicitar restablecimiento de contraseña.");
      toast({
        title: "Error",
        description: error.message || "Error al solicitar restablecimiento de contraseña.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-gray-50`}
    >
      {/* Header */}
      <Header
        theme="Claro"
        setTheme={() => {}}
        language="Español"
        setLanguage={() => {}}
        currency="COP"
        setCurrency={() => {}}
      />

      {/* Spacer para el header fijo */}
      <div className="h-16"></div>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recuperar Contraseña
          </h2>
          <p className="text-gray-600 mb-6">
            Ingrese su correo electrónico para recibir un enlace de restablecimiento de contraseña.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-left block mb-1">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}{" "}
              Enviar Enlace de Restablecimiento
            </Button>
          </form>
          {message && (
            <p className="mt-4 text-sm text-green-600">
              {message}
            </p>
          )}
          <button
            onClick={() => router.push("/login")}
            className="mt-4 text-indigo-600 hover:underline"
          >
            Volver al Login
          </button>
        </div>
      </main>
    </div>
  );
}
