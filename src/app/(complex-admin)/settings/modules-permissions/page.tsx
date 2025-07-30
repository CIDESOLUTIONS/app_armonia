"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  getModulePermissions,
  updateModulePermissions,
} from "@/services/modulePermissionService";

interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  permissions: { role: string; canView: boolean; canEdit: boolean }[];
}

export default function ModulesPermissionsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [modules, setModules] = useState<ModuleConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModulePermissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getModulePermissions();
      setModules(data);
    } catch (error) {
      console.error("Error fetching module permissions:", error);
      const description =
        error instanceof Error
          ? "No se pudo cargar la configuración de módulos y permisos: " +
            error.message
          : "No se pudo cargar la configuración de módulos y permisos.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchModulePermissions();
    }
  }, [authLoading, user, fetchModulePermissions]);

  const handleToggleModule = async (moduleId: string, enabled: boolean) => {
    setLoading(true);
    try {
      const updatedModules = modules.map((mod) =>
        mod.id === moduleId ? { ...mod, enabled } : mod,
      );
      await updateModulePermissions(updatedModules);
      setModules(updatedModules);
      toast({
        title: "Éxito",
        description: "Configuración de módulo actualizada correctamente.",
      });
    } catch (error) {
      console.error("Error toggling module:", error);
      const description =
        error instanceof Error
          ? "Error al actualizar el módulo: " + error.message
          : "Error al actualizar el módulo.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (
    moduleId: string,
    role: string,
    type: "canView" | "canEdit",
    value: boolean,
  ) => {
    setLoading(true);
    try {
      const updatedModules = modules.map((mod) =>
        mod.id === moduleId
          ? {
              ...mod,
              permissions: mod.permissions.map((p) =>
                p.role === role ? { ...p, [type]: value } : p,
              ),
            }
          : mod,
      );
      await updateModulePermissions(updatedModules);
      setModules(updatedModules);
      toast({
        title: "Éxito",
        description: "Permisos actualizados correctamente.",
      });
    } catch (error) {
      console.error("Error updating permissions:", error);
      const description =
        error instanceof Error
          ? "Error al actualizar permisos: " + error.message
          : "Error al actualizar permisos.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
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
        Configuración de Módulos y Permisos
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Módulos del Sistema</h2>
        <div className="space-y-6">
          {modules.map((module) => (
            <div key={module.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{module.name}</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`toggle-${module.id}`}>Activar</Label>
                  <Switch
                    id={`toggle-${module.id}`}
                    checked={module.enabled}
                    onCheckedChange={(checked) =>
                      handleToggleModule(module.id, checked)
                    }
                    disabled={loading}
                  />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>

              <h4 className="text-md font-semibold mb-2">Permisos por Rol:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {module.permissions.map((perm) => (
                  <div
                    key={perm.role}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                  >
                    <span className="font-medium">{perm.role}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`view-${module.id}-${perm.role}`}>
                          Ver
                        </Label>
                        <Switch
                          id={`view-${module.id}-${perm.role}`}
                          checked={perm.canView}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              module.id,
                              perm.role,
                              "canView",
                              checked,
                            )
                          }
                          disabled={loading}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`edit-${module.id}-${perm.role}`}>
                          Editar
                        </Label>
                        <Switch
                          id={`edit-${module.id}-${perm.role}`}
                          checked={perm.canEdit}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              module.id,
                              perm.role,
                              "canEdit",
                              checked,
                            )
                          }
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
