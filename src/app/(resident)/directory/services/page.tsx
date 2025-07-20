"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Search,
  Star,
  Phone,
  Mail,
  MapPin,
  PlusCircle,
} from "lucide-react";
import { getServiceProviders, ServiceProviderDto } from "@/services/serviceProviderService";

export default function HomeServicesDirectoryPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [serviceProviders, setServiceProviders] = useState<ServiceProviderDto[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProviderDto | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
  });

  const fetchServiceProviders = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedProviders = await getServiceProviders();
      setServiceProviders(fetchedProviders);
    } catch (error: Error) {
      console.error("Error fetching service providers:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores de servicios: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      fetchServiceProviders();
    }
  }, [user, fetchServiceProviders]);

  const handleViewDetails = (provider: ServiceProviderDto) => {
    setSelectedProvider(provider);
    setIsDetailsDialogOpen(true);
  };

  const handleReviewClick = (provider: ServiceProviderDto) => {
    setSelectedProvider(provider);
    setIsReviewDialogOpen(true);
  };

  const handleReviewFormChange = (field: string, value: any) => {
    setReviewForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitReview = async () => {
    if (!selectedProvider || !reviewForm.rating) {
      toast({
        title: "Advertencia",
        description: "Por favor, selecciona una calificación.",
        variant: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      // TODO: Call backend API to submit review
      console.log("Submitting review:", selectedProvider.id, reviewForm);
      toast({
        title: "Éxito",
        description: "Reseña enviada correctamente. (Funcionalidad simulada)",
      });
      setIsReviewDialogOpen(false);
      setReviewForm({ rating: 0, comment: "" });
      fetchServiceProviders(); // Refresh list to show updated ratings
    } catch (error: Error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Error al enviar la reseña: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = serviceProviders.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            Debes iniciar sesión para acceder al directorio de servicios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Directorio de Servicios para el Hogar
      </h1>

      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, categoría o descripción..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* TODO: Add category filter */}
        </CardContent>
      </Card>

      {filteredProviders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">
            No se encontraron proveedores de servicios
          </h3>
          <p>Intenta ajustar tu búsqueda o filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id}>
              <CardHeader>
                <CardTitle>{provider.name}</CardTitle>
                <CardDescription>{provider.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                  {provider.description}
                </p>
                <div className="flex items-center text-sm text-gray-700 mb-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                  <span>
                    {provider.rating?.toFixed(1) || "N/A"} ({provider.reviewCount || 0}{" "}
                    reseñas)
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Phone className="h-4 w-4 text-gray-500 mr-1" />
                  <span>{provider.contact}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(provider)}
                >
                  Ver Detalles
                </Button>
                <Button size="sm" onClick={() => handleReviewClick(provider)}>
                  <Star className="mr-2 h-4 w-4" /> Calificar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogo de Detalles del Proveedor */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProvider?.name}</DialogTitle>
            <DialogDescription>{selectedProvider?.category}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-700">{selectedProvider?.description}</p>
            <div className="flex items-center text-sm text-gray-700">
              <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
              <span>
                {selectedProvider?.rating?.toFixed(1) || "N/A"} (
                {selectedProvider?.reviewCount || 0} reseñas)
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Phone className="h-4 w-4 text-gray-500 mr-1" />
              <span>{selectedProvider?.contact}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Mail className="h-4 w-4 text-gray-500 mr-1" />
              <span>{selectedProvider?.contact}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span>{selectedProvider?.address}</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogo de Calificación y Reseña */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Calificar a {selectedProvider?.name}</DialogTitle>
            <DialogDescription>
              Comparte tu experiencia con este proveedor de servicios.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Calificación</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={reviewForm.rating}
                onChange={(e) =>
                  handleReviewFormChange("rating", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comentario (Opcional)</Label>
              <Textarea
                id="comment"
                value={reviewForm.comment}
                onChange={(e) =>
                  handleReviewFormChange("comment", e.target.value)
                }
                placeholder="Escribe tu comentario aquí..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmitReview} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Reseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}