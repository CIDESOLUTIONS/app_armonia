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
import { Flag, MessageSquare, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { reportListing } from "@/services/marketplaceService";
import { createConversation } from "@/services/conversationService";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reportListingSchema,
  ReportListingFormValues,
} from "@/validators/report-listing-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ListingCardProps {
  listing: {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    author: {
      id: number;
      name: string;
    };
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const router = useRouter();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const form = useForm<ReportListingFormValues>({
    resolver: zodResolver(reportListingSchema),
    defaultValues: {
      reason: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const handleReport = async (data: ReportListingFormValues) => {
    try {
      await reportListing({ listingId: listing.id, reason: data.reason });
      toast({
        title: "Anuncio Reportado",
        description: "Gracias por tu reporte. Lo revisaremos pronto.",
      });
      setIsReportModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error reporting listing:", error);
      const description =
        error instanceof Error
          ? "No se pudo reportar el anuncio: " + error.message
          : "No se pudo reportar el anuncio.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    }
  };

  const handleContactSeller = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para contactar al vendedor.",
        variant: "destructive",
      });
      return;
    }

    if (user.id === listing.author.id) {
      toast({
        title: "Información",
        description: "No puedes contactarte a ti mismo.",
        variant: "info",
      });
      return;
    }

    try {
      const conversation = await createConversation({
        participantIds: [user.id, listing.author.id],
        type: "direct",
      });
      router.push(`/resident/marketplace/chat/${conversation.id}`);
    } catch (error) {
      console.error("Error creating/fetching conversation:", error);
      const description =
        error instanceof Error
          ? "No se pudo iniciar la conversación con el vendedor: " +
            error.message
          : "No se pudo iniciar la conversación con el vendedor.";
      toast({
        title: "Error",
        description,
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
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleContactSeller}>
            <MessageSquare className="h-4 w-4 mr-1" /> Contactar
          </Button>
          <Link href={`/resident/marketplace/${listing.id}`}>
            <Button variant="outline" size="sm">
              Ver Detalles
            </Button>
          </Link>
          <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
              >
                <Flag className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reportar Anuncio</DialogTitle>
                <DialogDescription>
                  Por favor, describe por qué estás reportando este anuncio.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(handleReport)}
                  className="space-y-4"
                >
                  <FormField
                    control={control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Razón del reporte..."
                            {...field}
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsReportModalOpen(false)}
                      type="button"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}{" "}
                      Reportar
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
