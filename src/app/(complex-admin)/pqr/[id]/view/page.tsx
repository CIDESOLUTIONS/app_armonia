"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Edit, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getPQRById, addPQRComment } from "@/services/pqrService";

interface PQR {
  id: number;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED" | "REJECTED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: string;
  reportedById: number;
  reportedByName: string;
  assignedToId?: number;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  comments: PQRComment[];
  attachments?: PQRAttachment[];
}

interface PQRComment {
  id: number;
  pqrId: number;
  authorId: number;
  authorName: string;
  comment: string;
  createdAt: string;
}

interface PQRAttachment {
  id: number;
  pqrId: number;
  url: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
}

export default function ViewResidentPQRPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const pqrId = params.id ? parseInt(params.id as string) : null;

  const [pqr, setPqr] = useState<PQR | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  const fetchPQR = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPQRById(pqrId as number);
      setPqr(data);
    } catch (error) {
      console.error("Error fetching PQR:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la PQR.",
        variant: "destructive",
      });
      router.push("/resident/pqr");
    } finally {
      setLoading(false);
    }
  }, [pqrId, router, toast]);

  useEffect(() => {
    if (!authLoading && user && pqrId) {
      fetchPQR();
    }
  }, [authLoading, user, pqrId, fetchPQR]);

  const handleAddComment = async () => {
    if (!pqrId || !newComment.trim()) return;
    try {
      await addPQRComment(pqrId, newComment);
      setNewComment("");
      toast({
        title: "Éxito",
        description: "Comentario añadido correctamente.",
      });
      fetchPQR();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Error al añadir comentario.",
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
  };

  if (!user) {
    return null; // Redirect handled by AuthLayout
  }

  if (!pqr) {
    return null; // Should not happen due to redirects above
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Detalles de PQR: {pqr.subject}
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p>
            <strong>Descripción:</strong> {pqr.description}
          </p>
          <p>
            <strong>Reportado por:</strong> {pqr.reportedByName}
          </p>
          <p>
            <strong>Categoría:</strong> {pqr.category}
          </p>
          <p>
            <strong>Prioridad:</strong>
            <Badge
              variant={
                pqr.priority === "HIGH"
                  ? "destructive"
                  : pqr.priority === "MEDIUM"
                    ? "secondary"
                    : "default"
              }
            >
              {pqr.priority}
            </Badge>
          </p>
          <p>
            <strong>Estado:</strong>
            <Badge
              variant={
                pqr.status === "OPEN"
                  ? "destructive"
                  : pqr.status === "IN_PROGRESS"
                    ? "secondary"
                    : "default"
              }
            >
              {pqr.status}
            </Badge>
          </p>
          <p>
            <strong>Asignado a:</strong> {pqr.assignedToName || "N/A"}
          </p>
          <p>
            <strong>Fecha de Creación:</strong>{" "}
            {new Date(pqr.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Última Actualización:</strong>{" "}
            {new Date(pqr.updatedAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {pqr.attachments && pqr.attachments.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Paperclip className="mr-2 h-5 w-5" /> Adjuntos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pqr.attachments.map((attachment) => (
                <div key={attachment.id} className="border rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium truncate">
                      {attachment.name}
                    </span>
                  </div>
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer" download>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comentarios */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" /> Comentarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            {pqr.comments.length > 0 ? (
              pqr.comments.map((comment) => (
                <div key={comment.id} className="border-b pb-2">
                  <p className="text-sm font-semibold">
                    {comment.authorName}{" "}
                    <span className="text-gray-500 text-xs">
                      ({new Date(comment.createdAt).toLocaleString()})
                    </span>
                  </p>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay comentarios aún.</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Añadir un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              Añadir Comentario
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}