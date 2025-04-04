"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  capacity: number;
  startTime: string;
  endTime: string;
  cost: number;
  status: "active" | "inactive";
  schedule: string; // Ejemplo: "Lunes a Viernes"
  rules: string; // Reglamento
}

const ServicesPage = () => {
  const { token, complexId, schemaName, userRole } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`/api/inventory/services?complexId=${complexId}&schemaName=${schemaName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setServices(data.services);
        } else {
          setError(data.message || "Error al cargar servicios");
        }
      } catch (err) {
        setError("Error al conectar con el servidor");
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [token, complexId, schemaName]);

  const handleSaveServices = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inventory/services", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ services, complexId, schemaName }),
      });
      if (response.ok) {
        setSuccess("Servicios guardados con éxito");
      } else {
        throw new Error("Error al guardar servicios");
      }
    } catch (err) {
      setError("Error al guardar servicios");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Servicios Comunes</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3">Aforo</th>
              <th className="px-6 py-3">Horario</th>
              <th className="px-6 py-3">Costo</th>
              <th className="px-6 py-3">Reglamento</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service.id} className="bg-white border-b">
                <td className="px-6 py-4"><Input value={service.name} onChange={(e) => { const newServices = [...services]; newServices[index].name = e.target.value; setServices(newServices); }} /></td>
                <td className="px-6 py-4"><Input value={service.description} onChange={(e) => { const newServices = [...services]; newServices[index].description = e.target.value; setServices(newServices); }} /></td>
                <td className="px-6 py-4"><Input type="number" value={service.capacity} onChange={(e) => { const newServices = [...services]; newServices[index].capacity = parseInt(e.target.value) || 0; setServices(newServices); }} /></td>
                <td className="px-6 py-4"><Input value={service.schedule} onChange={(e) => { const newServices = [...services]; newServices[index].schedule = e.target.value; setServices(newServices); }} placeholder="Ej. Lunes a Viernes" /></td>
                <td className="px-6 py-4"><Input type="number" value={service.cost} onChange={(e) => { const newServices = [...services]; newServices[index].cost = parseFloat(e.target.value) || 0; setServices(newServices); }} /></td>
                <td className="px-6 py-4"><Input value={service.rules} onChange={(e) => { const newServices = [...services]; newServices[index].rules = e.target.value; setServices(newServices); }} placeholder="Reglamento" /></td>
                <td className="px-6 py-4">
                  {(userRole === "admin" || userRole === "superuser") && (
                    <Button onClick={() => setServices(services.filter((_, i) => i !== index))} className="bg-red-600 hover:bg-red-700 text-white p-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(userRole === "admin" || userRole === "superuser") && (
          <div className="mt-4 flex space-x-4">
            <Button onClick={() => setServices([...services, { id: Date.now(), name: "", description: "", capacity: 0, startTime: "08:00", endTime: "20:00", cost: 0, status: "active", schedule: "", rules: "" }])} className="bg-blue-500 hover:bg-blue-600 text-white">
              Agregar Servicio
            </Button>
            <Button onClick={handleSaveServices} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Guardar
            </Button>
          </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
};

export default ServicesPage;