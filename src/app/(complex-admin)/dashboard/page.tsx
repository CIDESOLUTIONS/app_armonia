import React from "react";
import { DashboardOverview } from "@/components/admin/dashboard/DashboardOverview";

export default function ComplexAdminDashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Dashboard del Administrador del Conjunto
      </h1>
      <DashboardOverview />
    </div>
  );
}
