
"use client";

import React from 'react';
import { Reservation } from '@/services/reservationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResidentReservationsListProps {
  reservations: Reservation[];
}

export default function ResidentReservationsList({ reservations }: ResidentReservationsListProps) {
  if (reservations.length === 0) {
    return <p className="text-center text-gray-500">No tienes reservas registradas.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reservations.map((reservation) => (
        <Card key={reservation.id}>
          <CardHeader>
            <CardTitle>{reservation.title}</CardTitle>
            <Badge variant={reservation.status === "APPROVED" ? "default" : reservation.status === "PENDING" ? "secondary" : "destructive"}>
              {reservation.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <p><strong>Área Común:</strong> {reservation.commonArea.name}</p>
            <p><strong>Inicio:</strong> {new Date(reservation.startDateTime).toLocaleString()}</p>
            <p><strong>Fin:</strong> {new Date(reservation.endDateTime).toLocaleString()}</p>
            {reservation.description && <p><strong>Descripción:</strong> {reservation.description}</p>}
            {reservation.attendees && <p><strong>Asistentes:</strong> {reservation.attendees}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
