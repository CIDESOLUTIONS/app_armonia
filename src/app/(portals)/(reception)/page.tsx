'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import AdminHeader from '@/components/admin/layout/AdminHeader'; // Reutilizar el header de admin por ahora
import AdminSidebar from '@/components/admin/layout/AdminSidebar'; // Reutilizar el sidebar de admin por ahora
import { ReceptionDashboardContent } from '@/components/reception/dashboard/ReceptionDashboardContent';
import { Loader2 } from 'lucide-react';

export default function ReceptionDashboard() {
  const { user, loading, logout } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Asumiendo que el rol para recepción es 'STAFF' o similar
  if (!user || (user.role !== 'STAFF' && user.role !== 'RECEPTION')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header específico del dashboard */}
      <AdminHeader 
        adminName={user?.name || "Recepción"}
        complexName="Conjunto Residencial Armonía"
        onLogout={logout}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar 
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <div className="p-6">
            <ReceptionDashboardContent />
          </div>
        </main>
      </div>
    </div>
  );
}
