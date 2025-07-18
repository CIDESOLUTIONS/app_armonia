"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { resetPassword } from "@/services/authService";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage("Token de restablecimiento de contraseña no encontrado.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("Token de restablecimiento de contraseña no válido.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response.message);
      toast({
        title: "Éxito",
        description: response.message,
      });
      router.push("/login");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setMessage(error.message || "Error al restablecer la contraseña.");
      toast({
        title: "Error",
        description: error.message || "Error al restablecer la contraseña.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50`}>
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
            Restablecer Contraseña
          </h2>
          {!token ? (
            <p className="text-red-600 mb-6">{message}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="newPassword" className="text-left block mb-1">
                  Nueva Contraseña
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-left block mb-1"
                >
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}{" "}
                Restablecer Contraseña
              </Button>
            </form>
          )}
          {message && token && (
            <p className="mt-4 text-sm text-green-600">{message}</p>
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
