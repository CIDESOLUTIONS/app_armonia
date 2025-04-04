// src/components/inventory/ResidentForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Property {
  id: number;
  unitNumber: string;
}

interface Resident {
  id?: number;
  name: string;
  dni: string;
  birthDate: string;
  email: string;
  whatsapp: string;
  residentType: 'permanente' | 'temporal';
  startDate: string;
  endDate?: string;
  propertyId: number;
  status: 'activo' | 'inactivo';
}

interface ResidentFormProps {
  resident?: Resident;
  properties: Property[];
  onSave: (data: Resident) => void;
  onCancel: () => void;
}

export function ResidentForm({
  resident,
  properties,
  onSave,
  onCancel
}: ResidentFormProps) {
  const [formData, setFormData] = useState<Resident>({
    name: resident?.name || '',
    dni: resident?.dni || '',
    birthDate: resident?.birthDate || '',
    email: resident?.email || '',
    whatsapp: resident?.whatsapp || '',
    residentType: resident?.residentType || 'permanente',
    startDate: resident?.startDate || new Date().toISOString().split('T')[0],
    endDate: resident?.endDate,
    propertyId: resident?.propertyId || 0,
    status: resident?.status || 'activo'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Resident, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Resident, string>> = {};

    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!formData.dni) newErrors.dni = 'El DNI es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!formData.propertyId) newErrors.propertyId = 'Debe seleccionar una propiedad';
    
    // Validar formato de email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar fechas
    if (formData.residentType === 'temporal' && !formData.endDate) {
      newErrors.endDate = 'Fecha fin requerida para residentes temporales';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {resident ? 'Editar Residente' : 'Nuevo Residente'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                />
              </div>

              <div>
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  error={errors.dni}
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                />
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="propertyId">Inmueble</Label>
                <Select
                  id="propertyId"
                  value={formData.propertyId.toString()}
                  onChange={(e) => setFormData({ ...formData, propertyId: parseInt(e.target.value) })}
                  error={errors.propertyId}
                >
                  <option value="">Seleccione un inmueble</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.unitNumber}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="residentType">Tipo de Residente</Label>
                <Select
                  id="residentType"
                  value={formData.residentType}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    residentType: e.target.value as 'permanente' | 'temporal'
                  })}
                >
                  <option value="permanente">Permanente</option>
                  <option value="temporal">Temporal</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="startDate">Fecha Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              {formData.residentType === 'temporal' && (
                <div>
                  <Label htmlFor="endDate">Fecha Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    error={errors.endDate}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {resident ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}