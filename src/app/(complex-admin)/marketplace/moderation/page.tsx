"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getReportedListings,
  resolveReport,
} from "@/services/moderationService";
import Image from "next/image";
import { ReportedListing } from "@/interfaces/marketplace/reported-listing.interface";

export default function MarketplaceModerationPage() {
  const { toast } = useToast();
  const [reportedListings, setReportedListings] = useState<ReportedListing[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportedListings = async () => {
      try {
        const data = await getReportedListings();
        setReportedListings(data);
      } catch (error: Error) {
        console.error("Error fetching reported listings:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los anuncios reportados.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReportedListings();
  }, [toast]);

  const handleResolveReport = async (
    reportId: number,
    action: "APPROVE" | "REJECT",
  ) => {
    setLoading(true);
    try {
      await resolveReport(reportId, action);
      toast({
        title: "Éxito",
        description: `Reporte ${action === "APPROVE" ? "aprobado" : "rechazado"} correctamente.`,
      });
      // Actualizar la lista de reportes
      setReportedListings((prev) =>
        prev.filter((report) => report.id !== reportId),
      );
    } catch (error: Error) {
      console.error("Error resolving report:", error);
      toast({
        title: "Error",
        description: "No se pudo resolver el reporte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Moderación de Marketplace
      </h1>

      {reportedListings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">
            No hay anuncios reportados pendientes
          </h3>
          <p>Todo el contenido del marketplace está limpio.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anuncio</TableHead>
              <TableHead>Reportado Por</TableHead>
              <TableHead>Razón</TableHead>
              <TableHead>Fecha del Reporte</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportedListings.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {report.listing.images &&
                      report.listing.images.length > 0 && (
                        <Image
                          src={report.listing.images[0]}
                          alt={report.listing.title}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      )}
                    <div>
                      <p className="font-medium">{report.listing.title}</p>
                      <p className="text-sm text-gray-500">
                        ${report.listing.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{report.reporter.name}</TableCell>
                <TableCell>{report.reason}</TableCell>
                <TableCell>
                  {new Date(report.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleResolveReport(report.id, "APPROVE")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprobar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleResolveReport(report.id, "REJECT")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rechazar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
