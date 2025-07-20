"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export default function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "RECEPTION" && user.role !== "ADMIN")) {
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
    <div>
      {/* Aquí puedes añadir un header/sidebar específico para recepción si es necesario */}
      {children}
    </div>
  );
}
