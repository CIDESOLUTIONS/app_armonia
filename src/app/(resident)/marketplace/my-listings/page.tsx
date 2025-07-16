"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, MessageSquare, Edit, Trash2 } from "lucide-react";
import { getListings, deleteListing } from "@/services/marketplaceService";

export default function MyListingsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Assuming getListings can filter by authorId or we need a new service function
      const userListings = await getListings({ authorId: user.id });
      setListings(userListings);
    } catch (error) {
      console.error("Error fetching my listings:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar tus anuncios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchMyListings();
    }
  }, [user, fetchMyListings]);

  const handleDeleteListing = async (listingId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este anuncio?")) {
      return;
    }
    try {
      await deleteListing(listingId);
      toast({
        title: "Éxito",
        description: "Anuncio eliminado correctamente.",
      });
      fetchMyListings(); // Refresh the list
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el anuncio.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        <p>Debes iniciar sesión para ver tus anuncios.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Mis Anuncios en el Marketplace
      </h1>

      {listings.length === 0 ? (
        <p className="text-center text-gray-500">
          No tienes anuncios publicados.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader>
                <CardTitle>{listing.title}</CardTitle>
                <CardDescription>{listing.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2">${listing.price}</p>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {listing.description}
                </p>
                {listing.images && listing.images.length > 0 && (
                  <div className="mt-4">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Link href={`/resident/marketplace/chat/${listing.id}`}>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" /> Chat
                  </Button>
                </Link>
                <div className="flex space-x-2">
                  <Link href={`/resident/marketplace/edit/${listing.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteListing(listing.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
