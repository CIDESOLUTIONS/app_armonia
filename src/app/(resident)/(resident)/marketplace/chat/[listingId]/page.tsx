
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { getListingById } from "@/services/marketplaceService";
import { getMessages, sendMessage } from "@/services/messageService";
import io from "socket.io-client";

let socket: any;

export default function ChatPage() {
  const { listingId } = useParams();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [listing, setListing] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

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

    // Configurar Socket.IO
    socket = io(); // Conecta al servidor de Socket.IO

    socket.on("connect", () => {
      console.log("Conectado a Socket.IO");
      socket.emit("joinChat", { listingId: Number(listingId), userId: user.id });
    });

    socket.on("receiveMessage", (message: any) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("disconnect", () => {
      console.log("Desconectado de Socket.IO");
    });

    return () => {
      socket.disconnect();
    };
  }, [listingId, user, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !user || !listing) return;

    try {
      const messageData = {
        listingId: Number(listingId),
        senderId: user.id,
        receiverId: user.id === listing.authorId ? listing.buyerId : listing.authorId, // Lógica para determinar el receptor
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
      <h1 className="text-2xl font-bold mb-4">Chat sobre: {listing.title}</h1>
      <div className="flex-grow overflow-y-auto border rounded-lg p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === user?.id
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-800"}
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
