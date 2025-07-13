"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import {
  Loader2,
  Building2,
  Users,
  Car,
  PawPrint,
  Plus,
  Home,
  Settings,
} from "lucide-react";
import { getDashboardStats } from "@/services/dashboardService";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface DashboardStats {
  totalProperties: number;
  totalResidents: number;
  totalVehicles: number;
  totalPets: number;
}

export default function InventoryPage() {
  const t = useTranslations("admin.inventory");
  const { user, loading: authLoading, logout } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Assuming getDashboardStats is adapted for i18n or returns raw data
        const fetchedStats = await getDashboardStats();
        setStats(fetchedStats);
      } catch (error) {
        console.error("Error fetching inventory stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  if (authLoading || loadingStats) {
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
            {t("accessDenied.title")}
          </h1>
          <p className="text-gray-600">
            {t("accessDenied.message")}
          </p>
        </div>
      </div>
    );
  }

  const quickAccessCards = [
    {
      href: "/admin/inventory/properties",
      icon: Building2,
      title: t("cards.properties.title"),
      description: t("cards.properties.description"),
      color: "text-blue-600",
    },
    {
      href: "/admin/inventory/residents",
      icon: Users,
      title: t("cards.residents.title"),
      description: t("cards.residents.description"),
      color: "text-green-600",
    },
    {
      href: "/admin/inventory/vehicles",
      icon: Car,
      title: t("cards.vehicles.title"),
      description: t("cards.vehicles.description"),
      color: "text-purple-600",
    },
    {
      href: "/admin/inventory/pets",
      icon: PawPrint,
      title: t("cards.pets.title"),
      description: t("cards.pets.description"),
      color: "text-orange-600",
    },
    {
      href: "/admin/inventory/amenities",
      icon: Home,
      title: t("cards.amenities.title"),
      description: t("cards.amenities.description"),
      color: "text-red-600",
    },
    {
      href: "/admin/inventory/common-assets",
      icon: Building2,
      title: t("cards.commonAssets.title"),
      description: t("cards.commonAssets.description"),
      color: "text-teal-600",
    },
    {
      href: "/admin/inventory/complex-setup",
      icon: Settings,
      title: t("cards.complexSetup.title"),
      description: t("cards.complexSetup.description"),
      color: "text-gray-600",
    },
  ];

  const statCards = [
    {
      icon: Building2,
      title: t("stats.properties"),
      value: stats?.totalProperties ?? 0,
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: t("stats.residents"),
      value: stats?.totalResidents ?? 0,
      color: "text-green-600",
    },
    {
      icon: Car,
      title: t("stats.vehicles"),
      value: stats?.totalVehicles ?? 0,
      color: "text-purple-600",
    },
    {
      icon: PawPrint,
      title: t("stats.pets"),
      value: stats?.totalPets ?? 0,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        adminName={user?.name || t("header.defaultAdminName")}
        complexName={t("header.complexName")}
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
          } mt-16 p-6`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {t("title")}
              </h1>
              <p className="text-gray-600 mt-2">
                {t("description")}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {statCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <card.icon className={`h-8 w-8 ${card.color}`} />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickAccessCards.map((card, index) => (
                <Link
                  key={index}
                  href={card.href}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <card.icon className={`h-8 w-8 ${card.color}`} />
                    <Plus className="h-5 w-5 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {card.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
