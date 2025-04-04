// src/components/inventory/ComplexDataForm.tsx
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/components/ui/use-toast';



interface ComplexFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminDNI: string;
  adminAddress: string;
}

interface ComplexDataFormProps {
  initialData: Partial<ComplexFormData>;
  onSave: (data: ComplexFormData) => Promise<void>;
  onCancel: () => void;
}

export function MyComponent() {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "Éxito",
      description: "Operación completada",
      variant: "success"
    });
  };
};

export function ComplexDataForm({
  initialData,
  onSave,
  onCancel
}: ComplexDataFormProps) {
  const [formData, setFormData] = useState<ComplexFormData>({
    name: initialData.name || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    country: initialData.country || '',
    adminName: initialData.adminName || '',
    adminEmail: initialData.adminEmail || '',
    adminPhone: initialData.adminPhone || '',
    adminDNI: initialData.adminDNI || '',
    adminAddress: initialData.adminAddress || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      toast({
        title: "Éxito",
        description: "Datos del conjunto actualizados correctamente",
      });
    } catch (error) {
      console.error('Error en formulario:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Conjunto Residencial</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Conjunto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">Estado/Departamento</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="adminName">Nombre del Administrador</Label>
                <Input
                  id="adminName"
                  value={formData.adminName}
                  onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="adminDNI">DNI del Administrador</Label>
                <Input
                  id="adminDNI"
                  value={formData.adminDNI}
                  onChange={(e) => setFormData({...formData, adminDNI: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="adminEmail">Email del Administrador</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="adminPhone">Teléfono del Administrador</Label>
                <Input
                  id="adminPhone"
                  value={formData.adminPhone}
                  onChange={(e) => setFormData({...formData, adminPhone: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="adminAddress">Dirección del Administrador</Label>
                <Input
                  id="adminAddress"
                  value={formData.adminAddress}
                  onChange={(e) => setFormData({...formData, adminAddress: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}