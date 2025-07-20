"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Edit, Trash2, CheckCircle, Eye } from "lucide-react";
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
import {
  getListings,
  updateListing,
  deleteListing,
  Listing,
} from "@/services/marketplaceService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MyListingsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<number | null>(null);

  const fetchMyListings = useCallback(async () => {
    setLoading(true);
    try {
      if (!user?.id) return; // Ensure user ID is available
      const data = await getListings({ authorId: user.id });
      setListings(data);
    } catch (error: Error) {
      console.error("Error fetching my listings:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar tus anuncios: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, user?.id]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchMyListings();
    }
  }, [authLoading, user, fetchMyListings]);

  const handleMarkAsSold = async (id: number) => {
    if (
      !confirm("¿Estás seguro de que quieres marcar este anuncio como vendido?")
    )
      return;
    try {
      await updateListing(id, { status: "SOLD" }); // Assuming a 'status' field and 'SOLD' value
      toast({
        title: "Éxito",
        description: "Anuncio marcado como vendido correctamente.",
      });
      fetchMyListings();
    } catch (error: Error) {
      console.error("Error marking listing as sold:", error);
      toast({
        title: "Error",
        description:
          "No se pudo marcar el anuncio como vendido: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteListing = (id: number) => {
    setListingToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteListing = async () => {
    if (listingToDelete === null) return;
    try {
      await deleteListing(listingToDelete);
      toast({
        title: "Éxito",
        description: "Anuncio eliminado correctamente.",
      });
      fetchMyListings();
    } catch (error: Error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el anuncio: " + error.message,
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setListingToDelete(null);
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Mis Anuncios Publicados
        </h1>
        <Link href="/resident/marketplace/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Publicar Nuevo Anuncio
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Publicación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.length > 0 ? (
              listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>{listing.title}</TableCell>
                  <TableCell>{listing.category}</TableCell>
                  <TableCell>${listing.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        listing.status === "ACTIVE"
                          ? "default"
                          : listing.status === "SOLD"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/resident/marketplace/${listing.id}`}>
                      <Button variant="ghost" size="sm" className="mr-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    {listing.status === "ACTIVE" && (
                      <Link href={`/resident/marketplace/edit/${listing.id}`}>
                        <Button variant="ghost" size="sm" className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {listing.status === "ACTIVE" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsSold(listing.id)}
                        className="mr-2"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteListing(listing.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-5">
                  No has publicado ningún anuncio.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este anuncio? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmDeleteListing}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
