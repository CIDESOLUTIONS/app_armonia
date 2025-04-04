// src/components/inventory/PropertyForm.tsx
"use client";

interface Property {
  id?: number;
  unitNumber: string;
  type: 'casa' | 'apartamento';
  status: 'ocupado' | 'disponible';
  ownerName: string;
  ownerDNI: string;
}

export function PropertyForm({
  property,
  onSave
}: {
  property?: Property;
  onSave: (data: Property) => void;
}) {
  const [formData, setFormData] = useState<ComplexData>({
    name: initialData.name || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    country: initialData.country || '',
    adminName: initialData.adminName || '',
    adminEmail: initialData.adminEmail || '',
    adminPhone: initialData.adminPhone || '',
    adminDNI: initialData.adminDNI || '',
    adminAddress: initialData.adminAddress || '',
    totalUnits: initialData.totalUnits || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Conjunto Residencial</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Datos del Conjunto</h3>
              <Input
                placeholder="Nombre del Conjunto"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <Input
                placeholder="Dirección"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              <Input
                placeholder="Ciudad"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
              <Input
                placeholder="Estado/Departamento"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
              />
              <Input
                placeholder="País"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              />
            </div>
            <div>
              <h3 className="font-medium mb-2">Datos del Administrador</h3>
              <Input
                placeholder="Nombre Completo"
                value={formData.adminName}
                onChange={(e) => setFormData({...formData, adminName: e.target.value})}
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.adminEmail}
                onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
              />
              <Input
                placeholder="Teléfono"
                value={formData.adminPhone}
                onChange={(e) => setFormData({...formData, adminPhone: e.target.value})}
              />
              <Input
                placeholder="DNI"
                value={formData.adminDNI}
                onChange={(e) => setFormData({...formData, adminDNI: e.target.value})}
              />
              <Input
                placeholder="Dirección"
                value={formData.adminAddress}
                onChange={(e) => setFormData({...formData, adminAddress: e.target.value})}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Guardar Cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}