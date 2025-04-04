// src/components/inventory/ResidentsTable.tsx
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

interface Resident {
  id: number;
  name: string;
  email: string;
  dni: string;
  whatsapp?: string;
  status: string;
  isPrimary: boolean;
  propertyNumber: string;
}

interface ResidentsTableProps {
  residents: Resident[];
  onAdd?: () => void;
  onEdit?: (resident: Resident) => void;
  onDelete?: (id: number) => void;
}

export function ResidentsTable({ 
  residents, 
  onAdd, 
  onEdit, 
  onDelete 
}: ResidentsTableProps) {
  const [sortBy, setSortBy] = useState('propertyNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedResidents = [...residents].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    }
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Residentes</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Residente
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader 
                className="cursor-pointer"
                onClick={() => {
                  if (sortBy === 'propertyNumber') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }
                  setSortBy('propertyNumber');
                }}
              >
                Inmueble
              </TableHeader>
              <TableHeader>Nombre</TableHeader>
              <TableHeader>DNI</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>WhatsApp</TableHeader>
              <TableHeader>Estado</TableHeader>
              <TableHeader>Tipo</TableHeader>
              <TableHeader>Acciones</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedResidents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell>{resident.propertyNumber}</TableCell>
                <TableCell>{resident.name}</TableCell>
                <TableCell>{resident.dni}</TableCell>
                <TableCell>{resident.email}</TableCell>
                <TableCell>{resident.whatsapp}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    resident.status === 'ENABLED' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {resident.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    resident.isPrimary 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {resident.isPrimary ? 'Principal' : 'Secundario'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(resident)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => onDelete?.(resident.id)}
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