// src/components/inventory/PetsTable.tsx
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
import { Plus, Edit, Trash, Eye } from 'lucide-react';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  propertyNumber: string;
  residentName: string;
  vaccinations: {
    name: string;
    date: string;
    nextDate: string;
  }[];
}

interface PetsTableProps {
  pets: Pet[];
  onAdd?: () => void;
  onEdit?: (pet: Pet) => void;
  onDelete?: (id: number) => void;
  onViewVaccinations?: (pet: Pet) => void;
}

export function PetsTable({ 
  pets = [], 
  onAdd, 
  onEdit, 
  onDelete,
  onViewVaccinations 
}: PetsTableProps) {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedPets = [...pets].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    }
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mascotas</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Mascota
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
                  if (sortBy === 'name') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }
                  setSortBy('name');
                }}
              >
                Nombre
              </TableHeader>
              <TableHeader>Tipo</TableHeader>
              <TableHeader>Raza</TableHeader>
              <TableHeader>Edad</TableHeader>
              <TableHeader>Vacunas</TableHeader>
              <TableHeader>Acciones</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPets.map((pet) => (
              <TableRow key={pet.id}>
                <TableCell>{pet.propertyNumber}</TableCell>
                <TableCell>{pet.residentName}</TableCell>
                <TableCell>{pet.name}</TableCell>
                <TableCell>{pet.type}</TableCell>
                <TableCell>{pet.breed}</TableCell>
                <TableCell>{pet.age} años</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewVaccinations?.(pet)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(pet)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => onDelete?.(pet.id)}
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