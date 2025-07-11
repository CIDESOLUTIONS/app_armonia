'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getAmenities, createAmenity, updateAmenity, deleteAmenity } from '@/services/amenityService';

interface Amenity {
  id: number;
  name: string;
  description?: string;
  location: string;
  capacity: number;
  requiresApproval: boolean;
  hasFee: boolean;
  feeAmount?: number;
  isActive: boolean;
}

export default function AmenitiesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAmenity, setCurrentAmenity] = useState<Amenity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    capacity: 0,
    requiresApproval: false,
    hasFee: false,
    feeAmount: 0,
    isActive: true,
  });

  const fetchAmenities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAmenities();
      setAmenities(data);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las amenidades.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAmenities();
    }
  }, [authLoading, user, fetchAmenities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAddAmenity = () => {
    setCurrentAmenity(null);
    setFormData({
      name: '',
      description: '',
      location: '',
      capacity: 0,
      requiresApproval: false,
      hasFee: false,
      feeAmount: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditAmenity = (amenity: Amenity) => {
    setCurrentAmenity(amenity);
    setFormData({
      name: amenity.name,
      description: amenity.description || '',
      location: amenity.location,
      capacity: amenity.capacity,
      requiresApproval: amenity.requiresApproval,
      hasFee: amenity.hasFee,
      feeAmount: amenity.feeAmount || 0,
      isActive: amenity.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentAmenity) {
        await updateAmenity(currentAmenity.id, formData);
        toast({
          title: 'Éxito',
          description: 'Amenidad actualizada correctamente.',
        });
      } else {
        await createAmenity(formData);
        toast({
          title: 'Éxito',
          description: 'Amenidad creada correctamente.',
        });
      }
      setIsModalOpen(false);
      fetchAmenities();
    } catch (error) {
      console.error('Error saving amenity:', error);
      toast({
        title: 'Error',
        description: 'Error al guardar la amenidad.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAmenity = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta amenidad?')) {
      try {
        await deleteAmenity(id);
        toast({
          title: 'Éxito',
          description: 'Amenidad eliminada correctamente.',
        });
        fetchAmenities();
      } catch (error) {
        console.error('Error deleting amenity:', error);
        toast({
          title: 'Error',
          description: 'Error al eliminar la amenidad.',
          variant: 'destructive',
        });
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Amenidades</h1>
      
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddAmenity}>
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Amenidad
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Requiere Aprobación</TableHead>
              <TableHead>Tiene Costo</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Activa</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amenities.map((amenity) => (
              <TableRow key={amenity.id}>
                <TableCell>{amenity.name}</TableCell>
                <TableCell>{amenity.description}</TableCell>
                <TableCell>{amenity.location}</TableCell>
                <TableCell>{amenity.capacity}</TableCell>
                <TableCell>
                  {amenity.requiresApproval ? <Badge variant="default">Sí</Badge> : <Badge variant="destructive">No</Badge>}
                </TableCell>
                <TableCell>
                  {amenity.hasFee ? <Badge variant="default">Sí</Badge> : <Badge variant="destructive">No</Badge>}
                </TableCell>
                <TableCell>{amenity.feeAmount}</TableCell>
                <TableCell>
                  {amenity.isActive ? <Badge variant="default">Sí</Badge> : <Badge variant="destructive">No</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEditAmenity(amenity)} className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteAmenity(amenity.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentAmenity ? 'Editar Amenidad' : 'Añadir Nueva Amenidad'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descripción</Label>
              <Input id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Ubicación</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacidad</Label>
              <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="flex items-center space-x-2">
              <Input id="requiresApproval" name="requiresApproval" type="checkbox" checked={formData.requiresApproval} onChange={handleCheckboxChange} />
              <Label htmlFor="requiresApproval">Requiere Aprobación</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input id="hasFee" name="hasFee" type="checkbox" checked={formData.hasFee} onChange={handleCheckboxChange} />
              <Label htmlFor="hasFee">Tiene Costo</Label>
            </div>
            {formData.hasFee && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="feeAmount" className="text-right">Costo</Label>
                <Input id="feeAmount" name="feeAmount" type="number" value={formData.feeAmount} onChange={handleInputChange} className="col-span-3" />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Input id="isActive" name="isActive" type="checkbox" checked={formData.isActive} onChange={handleCheckboxChange} />
              <Label htmlFor="isActive">Activa</Label>
            </div>
            <DialogFooter>
              <Button type="submit">{currentAmenity ? 'Guardar Cambios' : 'Añadir Amenidad'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
