"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getListingById,
  reportListing,
  Listing,
} from "@/services/marketplaceService";
import {
  Loader2,
  MessageSquare,
  DollarSign,
  Tag,
  Calendar,
  User,
  Flag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/authStore";

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = params.id ? parseInt(params.id as string) : null;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuthStore();

  useEffect(() => {
    if (listingId) {
      const fetchListing = async () => {
        try {
          const data = await getListingById(listingId);
          setListing(data);
        } catch (error: Error) {
          console.error("Error fetching listing details:", error);
          toast({
            title: "Error",
            description:
              "No se pudo cargar los detalles del anuncio: " + error.message,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchListing();
    }
  }, [listingId, toast]);

  const handleReportListing = async () => {
    if (!user || !listing) return;

    if (confirm("¿Estás seguro de que quieres reportar este anuncio?")) {
      try {
        await reportListing({
          listingId: listing.id,
          reporterId: user.id,
          reason: "Contenido inapropiado o fraudulento", // Hardcoded reason for now
        });
        toast({
          title: "Anuncio Reportado",
          description: "Gracias por tu reporte. Lo revisaremos pronto.",
        });
      } catch (error: Error) {
        console.error("Error reporting listing:", error);
        toast({
          title: "Error",
          description: "No se pudo reportar el anuncio: " + error.message,
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Anuncio no encontrado
        </h1>
        <p className="text-gray-600">
          El anuncio que buscas no existe o ha sido eliminado.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{listing.title}</CardTitle>
          <p className="text-gray-600 flex items-center mt-2">
            <User className="h-4 w-4 mr-1" /> Publicado por:{" "}
            {listing.author.name}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {listing.images && listing.images.length > 0 && (
                <div className="relative w-full h-80 mb-4 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="flex space-x-2 overflow-x-auto">
                {listing.images &&
                  listing.images.map((img: string, index: number) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 rounded-md overflow-hidden cursor-pointer"
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-indigo-600 mb-4 flex items-center">
                <DollarSign className="h-8 w-8 mr-2" /> $
                {listing.price.toFixed(2)}
              </p>
              <p className="text-gray-700 mb-4">{listing.description}</p>
              <div className="flex items-center text-gray-600 mb-2">
                <Tag className="h-5 w-5 mr-2" />
                Categoría: {listing.category}
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="h-5 w-5 mr-2" />
                Publicado: {new Date(listing.createdAt).toLocaleDateString()}
              </div>
              <Link href={`/resident/marketplace/chat/${listing.id}`}>
                <Button className="w-full mb-2">
                  <MessageSquare className="mr-2 h-4 w-4" /> Contactar Vendedor
                </Button>
              </Link>
              {user && listing.author.id !== user.id && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleReportListing}
                >
                  <Flag className="mr-2 h-4 w-4" /> Reportar Anuncio
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
