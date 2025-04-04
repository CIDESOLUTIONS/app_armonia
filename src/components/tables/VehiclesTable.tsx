// src/components/inventory/VehiclesTable.tsx
import { useState } from 'react';
import { 
  Table, 
  TableHead, 
  TableRow, 
  TableHeader, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash } from 'lucide-react';

interface Vehicle {
  id: number;
  type: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  propertyNumber: string;
  residentName: string;
}

interface VehiclesTableProps {
  vehicles: Vehicle[];
  onAdd?: () => void;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: number) => void;
}

export function VehiclesTable({ 
  vehicles = [], 
  onAdd, 
  onEdit, 
  onDelete 
}: VehiclesTableProps) {
  const [sortBy, setSortBy] = useState('plate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    }
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vehículos</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Vehículo
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Inmueble</TableHeader>
              <TableHeader>Residente</TableHeader>
              <TableHeader 
                className="cursor-pointer"
                onClick={() => {
                  if (sortBy === 'plate') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }
                  setSortBy('plate');
                }}
              >
                Placa
              </TableHeader>
              <TableHeader>Tipo</TableHeader>
              <TableHeader>Marca</TableHeader>
              <TableHeader>Modelo</TableHeader>
              <TableHeader>Color</TableHeader>
              <TableHeader>Acciones</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.propertyNumber}</TableCell>
                <TableCell>{vehicle.residentName}</TableCell>
                <TableCell>{vehicle.plate}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.brand}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.color}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(vehicle)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => onDelete?.(vehicle.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}