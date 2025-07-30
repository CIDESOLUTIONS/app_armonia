"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Flag } from "lucide-react";
import { getListingById, reportListing } from "@/services/marketplaceService";
import {
  getMarketplaceMessages,
  sendMarketplaceMessage,
  createConversation,
  Conversation,
  Message as ConversationMessage,
} from "@/services/conversationService"; // Usar funciones de conversationService
import io from "socket.io-client";
import { usePathname } from "next/navigation";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

let socket: any;

interface Listing {
  id: number;
  title: string;
  author: { id: number; name: string };
  buyerId?: number; // Assuming buyerId might exist on a listing
  // ... otras propiedades del listado
}

export default function ChatPage() {
  const { listingId } = useParams();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const fetchListingAndMessages = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedListing = await getListingById(Number(listingId));
      setListing(fetchedListing);

      if (!user || !fetchedListing.author.id) {
        toast({
          title: "Error",
          description: "Información de usuario o listado incompleta.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Crear o obtener la conversación
      const participantIds = [user.id, fetchedListing.author.id];
      const existingConversation = await createConversation({
        participantIds,
        type: "direct",
      });
      setConversation(existingConversation);

      const fetchedMessages = await getMarketplaceMessages(
        Number(listingId),
        user.id,
      );
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching data:", error);
      const description =
        error instanceof Error
          ? "No se pudo cargar el chat: " + error.message
          : "No se pudo cargar el chat.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [listingId, user, toast]);

  useEffect(() => {
    if (!user) return;

    fetchListingAndMessages();

    // Configurar Socket.IO
    socket = io(`${SOCKET_URL}/marketplace-chat`, {
      query: { userId: user.id, listingId: Number(listingId) },
    });

    socket.on("connect", () => {
      console.log("Conectado a Socket.IO");
      socket.emit("joinListingChat", {
        listingId: Number(listingId),
        userId: user.id,
      });
    });

    socket.on("receiveMarketplaceMessage", (message: ConversationMessage) => {
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
      socket.disconnect();
    };
  }, [listingId, user, toast, pathname, fetchListingAndMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !user || !listing || !conversation) return;

    try {
      const messageData = {
        listingId: Number(listingId),
        senderId: user.id,
        receiverId:
          listing.author.id === user.id ? listing.buyerId : listing.author.id, // Lógica para determinar el receptor
        content: newMessage,
      };
      await sendMarketplaceMessage(messageData);
      socket.emit("sendMarketplaceMessage", messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      const description =
        error instanceof Error
          ? "No se pudo enviar el mensaje: " + error.message
          : "No se pudo enviar el mensaje.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    }
  };

  const handleReportListing = async () => {
    if (!user || !listing) return;

    if (confirm("¿Estás seguro de que quieres reportar este anuncio?")) {
      try {
        await reportListing({
          listingId: Number(listingId),
          reporterId: user.id,
          reason: "Contenido inapropiado o fraudulento", // Hardcoded reason for now
        });
        toast({
          title: "Anuncio Reportado",
          description: "Gracias por tu reporte. Lo revisaremos pronto.",
        });
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
        {user && listing.author.id !== user.id && (
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
    </div>
  );
}
