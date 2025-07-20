"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getConversations,
  getConversationMessages,
  sendMessage,
} from "@/services/conversationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema, MessageFormValues } from "@/validators/message-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Conversation {
  id: string;
  type: string;
  participants: { userId: number; name: string; image?: string }[];
  lastMessage?: { content: string; createdAt: string };
  unreadCount?: number;
  updatedAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
  read: boolean;
  attachments?: any[];
}

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
      }
    } catch (error: Error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las conversaciones: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, selectedConversation]);

  const fetchMessages = useCallback(async () => {
    if (!selectedConversation) return;
    setLoading(true);
    try {
      const data = await getConversationMessages(selectedConversation.id);
      setMessages(data);
    } catch (error: Error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedConversation, toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchConversations();
    }
  }, [authLoading, user, fetchConversations]);

  useEffect(() => {
    fetchMessages();
  }, [selectedConversation, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data: MessageFormValues) => {
    if (!selectedConversation || !user) return;

    try {
      const sentMessage = await sendMessage(selectedConversation.id, data);
      setMessages((prev) => [...prev, sentMessage]);
      reset();
    } catch (error: Error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Error al enviar el mensaje: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "COMPLEX_ADMIN" &&
      user.role !== "STAFF")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 flex h-[calc(100vh-100px)]">
      <div className="w-1/4 border-r pr-4">
        <h2 className="text-xl font-bold mb-4">Conversaciones</h2>
        {conversations.length === 0 ? (
          <p className="text-gray-500">No hay conversaciones.</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Card
                key={conv.id}
                className={`cursor-pointer ${selectedConversation?.id === conv.id ? "bg-blue-50" : ""}`}
                onClick={() => setSelectedConversation(conv)}
              >
                <CardContent className="p-4">
                  <p className="font-semibold">
                    {conv.participants
                      .filter((p) => p.userId !== user.id)
                      .map((p) => p.name)
                      .join(", ") || "Conversación Directa"}
                  </p>
                  {conv.lastMessage && (
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {conv.lastMessage.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="w-3/4 pl-4 flex flex-col">
        {selectedConversation ? (
          <>
            <h2 className="text-xl font-bold mb-4">
              Conversación con:{" "}
              {selectedConversation.participants
                .filter((p) => p.userId !== user.id)
                .map((p) => p.name)
                .join(", ")}
            </h2>
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
                    }`}
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
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex space-x-2 w-full"
                >
                  <FormField
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input
                            placeholder="Escribe tu mensaje..."
                            {...field}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") handleSubmit(onSubmit)();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting || !form.formState.isValid}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            <MessageSquare className="mr-2 h-6 w-6" /> Selecciona una
            conversación o inicia una nueva.
          </div>
        )}
      </div>
    </div>
  );
}