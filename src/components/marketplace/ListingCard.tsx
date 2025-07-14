import React from "react";
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
        <Link href={`/resident/resident/marketplace/${listing.id}`}>
          <Button variant="outline" size="sm">
            Ver Detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
