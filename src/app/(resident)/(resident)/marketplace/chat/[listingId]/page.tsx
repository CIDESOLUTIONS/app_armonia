"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Flag } from "lucide-react";
import { getListingById, reportListing } from "@/services/marketplaceService";
import { getMessages, sendMessage } from "@/services/messageService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Flag } from "lucide-react";
import { getListingById, reportListing } from "@/services/marketplaceService";
import { getMessages, sendMessage } from "@/services/messageService";
import { useSocket } from "@/hooks/useSocket";
import { usePathname } from "next/navigation";
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

export default function ChatPage() {
  const { listingId } = useParams();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [listing, setListing] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const socket = useSocket();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    if (!user || !socket) return;

    const fetchListingAndMessages = async () => {
      try {
        const fetchedListing = await getListingById(Number(listingId));
        setListing(fetchedListing);

        const fetchedMessages = await getMessages(Number(listingId), user.id);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({ title: "Error", description: "No se pudo cargar el chat." });
      } finally {
        setLoading(false);
      }
    };

    fetchListingAndMessages();

    socket.on("connect", () => {
      console.log("Conectado a Socket.IO");
      socket.emit("joinChat", {
        listingId: Number(listingId),
        userId: user.id,
      });
    });

    socket.on("receiveMessage", (message: any) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      // Show toast notification if not on the current chat page
      if (
        message.senderId !== user?.id &&
        pathname !== `/resident/marketplace/chat/${message.listingId}`
      ) {
        toast({
          title: `Nuevo mensaje de ${message.senderName || ""}`,
          description: message.content,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Desconectado de Socket.IO");
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
      socket.off("disconnect");
    };
  }, [listingId, user, toast, pathname, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !user || !listing) return;

    try {
      const messageData = {
        listingId: Number(listingId),
        senderId: user.id,
        receiverId:
          user.id === listing.authorId ? listing.buyerId : listing.authorId, // Lógica para determinar el receptor
        content: newMessage,
      };
      await sendMessage(messageData);
      socket.emit("sendMessage", messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({ title: "Error", description: "No se pudo enviar el mensaje." });
    }
  };

  const handleReportListing = () => {
    if (!user || !listing) return;
    setIsReportModalOpen(true);
  };

  const confirmReport = async () => {
    if (!reportReason.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa una razón para el reporte.",
        variant: "destructive",
      });
      return;
    }
    try {
      await reportListing({
        listingId: Number(listingId),
        reporterId: user.id,
        reason: reportReason,
      });
      toast({
        title: "Anuncio Reportado",
        description: "Gracias por tu reporte. Lo revisaremos pronto.",
      });
      setIsReportModalOpen(false);
      setReportReason("");
    } catch (error) {
      console.error("Error reporting listing:", error);
      toast({
        title: "Error",
        description: "No se pudo reportar el anuncio.",
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

  if (!listing) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Anuncio no encontrado</h1>
        <p>El anuncio que buscas no existe o no está disponible.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 flex flex-col h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chat sobre: {listing.title}</h1>
        {user && listing.authorId !== user.id && (
          <Button variant="outline" onClick={handleReportListing}>
            <Flag className="mr-2 h-4 w-4" /> Reportar Anuncio
          </Button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto border rounded-lg p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.senderId === user?.id
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }
              `}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex space-x-2">
        <Input
          placeholder="Escribe tu mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <Button onClick={handleSendMessage} disabled={newMessage.trim() === ""}>
          <Send className="h-5 w-5" />
        </Button>
      </div>

      <AlertDialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reportar Anuncio</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, describe la razón por la cual deseas reportar este
              anuncio. Tu reporte nos ayuda a mantener la comunidad segura.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Razón del reporte..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            rows={5}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReport}>
              Enviar Reporte
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
