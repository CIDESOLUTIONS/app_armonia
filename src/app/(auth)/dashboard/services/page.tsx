"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ServiceList from "@/components/admin/services/ServiceList";
import ServiceForm from "@/components/admin/services/ServiceForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function ServicesPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push(ROUTES.LOGIN);
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          console.error("Error fetching services");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchServices();
    }
  }, [isLoggedIn, loading, router]);

  const handleAddService = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleFormSubmit = async (serviceData) => {
    setIsLoading(true);
    try {
      const url = editingService
        ? `/api/services/${editingService.id}`
        : "/api/services";
      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      if (response.ok) {
        const updatedService = await response.json();
        
        if (editingService) {
          setServices(services.map(service => 
            service.id === updatedService.id ? updatedService : service
          ));
        } else {
          setServices([...services, updatedService]);
        }
        
        setShowForm(false);
        setEditingService(null);
      } else {
        console.error("Error saving service");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este servicio?")) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/services/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setServices(services.filter((service) => service.id !== id));
        } else {
          console.error("Error deleting service");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingService(null);
  };

  // Mientras se verifican los datos de autenticación
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-indigo-600/30"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Servicios</h1>
        <Button 
          onClick={handleAddService} 
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" /> Nuevo Servicio
        </Button>
      </div>

      {showForm ? (
        <ServiceForm
          initialData={editingService}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          isEditing={!!editingService}
        />
      ) : (
        <ServiceList
          services={services}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
        />
      )}
    </div>
  );
}
