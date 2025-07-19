"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { AdminDashboardContent } from "@/components/admin/dashboard/AdminDashboardContent";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "COMPLEX_ADMIN")) {
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
    <div className="p-6">
      <AdminDashboardContent />
    </div>
  );
}
