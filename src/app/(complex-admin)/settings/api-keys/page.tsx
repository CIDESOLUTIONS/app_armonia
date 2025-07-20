"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export default function ApiKeysPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    // Mock data
    {
      id: "1",
      name: "Integración Pasarela Pagos",
      key: "sk_live_xxxxxxxxxxxx",
      createdAt: "2023-01-01",
      lastUsed: "2024-06-30",
      isActive: true,
    },
    {
      id: "2",
      name: "Servicio SMS Twilio",
      key: "ac_test_yyyyyyyyyyyy",
      createdAt: "2023-03-10",
      lastUsed: "2024-07-01",
      isActive: true,
    },
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingrese un nombre para la nueva clave API.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Placeholder for API call to generate new key
      // console.log("Generating new API key for:", newKeyName); // Removed console.log
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      const newKey: ApiKey = {
        id: String(apiKeys.length + 1),
        name: newKeyName,
        key: `sk_test_${Math.random().toString(36).substring(2, 15)}`,
        createdAt: new Date().toISOString().split("T")[0],
        isActive: true,
      };
      setApiKeys((prev) => [...prev, newKey]);
      setNewKeyName("");
      toast({
        title: "Éxito",
        description: "Clave API generada correctamente (simulado).",
      });
    } catch (error: Error) {
      console.error("Error generating API key:", error);
      toast({
        title: "Error",
        description: "Error al generar la clave API: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta clave API?")) {
      setLoading(true);
      try {
        // Placeholder for API call to delete key
        // console.log("Deleting API key with ID:", id); // Removed console.log
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        setApiKeys((prev) => prev.filter((key) => key.id !== id));
        toast({
          title: "Éxito",
          description: "Clave API eliminada correctamente (simulado).",
        });
      } catch (error: Error) {
        console.error("Error deleting API key:", error);
        toast({
          title: "Error",
          description: "Error al eliminar la clave API: " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copiado",
      description: "Clave API copiada al portapapeles.",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "COMPLEX_ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Configuración de Claves API
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Generar Nueva Clave API</h2>
        <form
          onSubmit={handleGenerateKey}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="newKeyName">Nombre de la Clave</Label>
            <Input
              id="newKeyName"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}{" "}
              Generar Clave
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Claves API Existentes</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Clave</TableHead>
                <TableHead>Creada</TableHead>
                <TableHead>Último Uso</TableHead>
                <TableHead>Activa</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.length > 0 ? (
                apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.name}</TableCell>
                    <TableCell className="flex items-center">
                      <span className="font-mono text-gray-700 mr-2">
                        {key.key.substring(0, 8)}...
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyKey(key.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>{key.createdAt}</TableCell>
                    <TableCell>{key.lastUsed || "Nunca"}</TableCell>
                    <TableCell>
                      {key.isActive ? (
                        <Badge variant="default">Sí</Badge>
                      ) : (
                        <Badge variant="destructive">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-5">
                    No hay claves API registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
