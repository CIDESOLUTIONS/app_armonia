
"use client";

import React from 'react';
import { CommonArea } from '@/services/reservationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ResidentCommonAreasListProps {
  commonAreas: CommonArea[];
  onCreateReservation: (commonArea: CommonArea) => void;
}

export default function ResidentCommonAreasList({ commonAreas, onCreateReservation }: ResidentCommonAreasListProps) {
  if (commonAreas.length === 0) {
    return <p className="text-center text-gray-500">No hay áreas comunes disponibles para reservar.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {commonAreas.map((area) => (
        <Card key={area.id}>
          <CardHeader>
            <CardTitle>{area.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Tipo:</strong> {area.type}</p>
            {area.description && <p><strong>Descripción:</strong> {area.description}</p>}
            {area.capacity && <p><strong>Capacidad:</strong> {area.capacity}</p>}
            {area.requiresApproval && <p><strong>Requiere Aprobación:</strong> Sí</p>}
            {area.hourlyRate && <p><strong>Tarifa por Hora:</strong> ${area.hourlyRate}</p>}
            <Button className="mt-4 w-full" onClick={() => onCreateReservation(area)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Reservar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
