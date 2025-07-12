"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import { AdminDashboardContent } from "@/components/admin/dashboard/AdminDashboardContent";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        adminName={user.name || "Administrador"}
        complexName="Conjunto Residencial Armonía" 
        onLogout={logout}
      />

      <div className="flex">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <div className="p-6">
            <AdminDashboardContent />
          </div>
        </main>
      </div>
    </div>
  );
}
