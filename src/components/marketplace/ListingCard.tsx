import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { reportListing } from "@/services/marketplaceService";

interface ListingCardProps {
  listing: {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    author: {
      name: string;
    };
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const [reportReason, setReportReason] = useState("");
  const { toast } = useToast();

  const handleReport = async () => {
    try {
      await reportListing({ listingId: listing.id, reason: reportReason });
      toast({
        title: "Anuncio Reportado",
        description: "Gracias por tu reporte. Lo revisaremos pronto.",
      });
    } catch (error) {
      console.error("Error reporting listing:", error);
      toast({
        title: "Error",
        description: "No se pudo reportar el anuncio.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-48 bg-gray-200">
        {listing.images && listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100 rounded-t-lg">
            No Image
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold truncate">
          {listing.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {listing.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-lg font-bold text-indigo-600 mb-2">
          ${listing.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-700 line-clamp-3">
          {listing.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <span className="text-xs text-gray-500">
          Publicado por: {listing.author.name}
        </span>
        <Link href={`/resident/marketplace/${listing.id}`}>
          <Button variant="outline" size="sm">
            Ver Detalles
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
            >
              <Flag className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reportar Anuncio</AlertDialogTitle>
              <AlertDialogDescription>
                Por favor, describe por qué estás reportando este anuncio.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea
              placeholder="Razón del reporte..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReport}>
                Reportar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
