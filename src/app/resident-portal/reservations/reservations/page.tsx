"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Eye, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { getReservations } from "@/services/reservationService";

interface Reservation {
  id: number;
  commonAreaId: number;
  commonAreaName: string; // Para mostrar en la tabla
  userId: number;
  userName: string; // Para mostrar en la tabla
  propertyId: number;
  unitNumber: string; // Para mostrar en la tabla
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  attendees: number;
  requiresPayment: boolean;
  paymentAmount?: number;
  paymentStatus?: string;
  rejectionReason?: string;
  approvedById?: number;
  approvedAt?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ResidentReservationsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReservations(); // This will fetch only resident's reservations due to authMiddleware
      setReservations(data);
    } catch (error) {
      console.error("Error fetching resident reservations:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar tus reservas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchReservations();
    }
  }, [authLoading, user, fetchReservations]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled by AuthLayout
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Mis Reservas de Áreas Comunes
      </h1>

      <div className="flex justify-end mb-4">
        <Link href="/resident/reservations/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva Reserva
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Área Común</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.commonAreaName}</TableCell>
                  <TableCell>{reservation.title}</TableCell>
                  <TableCell>
                    {new Date(reservation.startDateTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(reservation.endDateTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        reservation.status === "APPROVED"
                          ? "default"
                          : reservation.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {reservation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/resident/reservations/${reservation.id}/view`}
                    >
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    {reservation.requiresPayment &&
                      reservation.paymentStatus !== "PAID" && (
                        <Link
                          href={`/resident/reservations/${reservation.id}/pay`}
                        >
                          <Button variant="ghost" size="sm" className="ml-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </Button>
                        </Link>
                      )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-5">
                  No tienes reservas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
