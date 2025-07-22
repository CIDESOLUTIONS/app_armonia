// src/components/layout/Sidebar.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePassiveEvent } from "@/hooks/use-passive-event";
import { useAuthStore } from "@/store/authStore";
import {
  BarChart2,
  Calendar,
  DollarSign,
  Building,
  Users,
  AlertCircle,
  Settings,
  ChevronDown,
  Shield,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Briefcase,
  Palette,
} from "lucide-react";

interface SidebarProps {
  language: string;
  theme: string;
  currency: string;
  adminName?: string | null;
  complexName?: string | null;
  logout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  addToast?: (message: string, type: string) => void;
}

export default function Sidebar({
  language,
  theme,
  currency,
  adminName,
  complexName,
  logout,
  isCollapsed,
  setIsCollapsed,
  addToast,
}: SidebarProps) {
  const _router = useRouter();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const { user } = useAuthStore();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (label: string, path?: string) => {
    console.log(`[Sidebar] Click en ${label}, path: ${path}`);
    if (path) {
      _router.push(path);
    } else {
      setExpandedMenu(expandedMenu === label ? null : label);
      if (isCollapsed) {
        setIsCollapsed(false); // Expande para mostrar submenús
      }
    }
  };

  const sidebarItems = [
    {
      icon: <BarChart2 className="w-6 h-6" />,
      label: language === "Español" ? "Dashboard" : "Dashboard",
      path: "/admin/complex-admin/admin-dashboard",
      roles: ["COMPLEX_ADMIN"],
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: language === "Español" ? "Portafolio" : "Portfolio",
      path: "/app-admin-portal/portfolio",
      roles: ["ADMIN"],
    },
    {
      icon: <Building className="w-6 h-6" />,
      label: language === "Español" ? "Inventario" : "Inventory",
      roles: ["COMPLEX_ADMIN"],
      subitems: [
        {
          label: language === "Español" ? "Datos del Conjunto" : "Complex Data",
          path: "/admin/complex-admin/inventory",
        },
        {
          label: language === "Español" ? "Inmuebles" : "Properties",
          path: "/admin/complex-admin/inventory/properties",
        },
        {
          label: language === "Español" ? "Vehículos" : "Vehicles",
          path: "/admin/complex-admin/inventory/vehicles",
        },
        {
          label: language === "Español" ? "Mascotas" : "Pets",
          path: "/admin/complex-admin/inventory/pets",
        },
        {
          label:
            language === "Español" ? "Servicios Comunes" : "Common Services",
          path: "/admin/complex-admin/inventory/services",
        },
      ],
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: language === "Español" ? "Asambleas" : "Assemblies",
      roles: ["COMPLEX_ADMIN"],
      subitems: [
        {
          label: language === "Español" ? "Programación" : "Scheduling",
          path: "/admin/complex-admin/assemblies/scheduling",
        },
        {
          label:
            language === "Español"
              ? "Control Asistencia"
              : "Attendance Control",
          path: "/admin/complex-admin/assemblies/attendance",
        },
        {
          label: language === "Español" ? "Control Votación" : "Voting Control",
          path: "/admin/complex-admin/assemblies/voting",
        },
        {
          label:
            language === "Español"
              ? "Actas y Documentos"
              : "Minutes and Documents",
          path: "/admin/complex-admin/assemblies/documents",
        },
      ],
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: language === "Español" ? "Finanzas" : "Finances",
      roles: ["COMPLEX_ADMIN"],
      subitems: [
        {
          label: language === "Español" ? "Presupuesto" : "Budget",
          path: "/admin/complex-admin/finances/budget",
        },
        {
          label: language === "Español" ? "Proyectos" : "Projects",
          path: "/admin/complex-admin/finances/projects",
        },
        {
          label: language === "Español" ? "Cuotas Ordinarias" : "Regular Fees",
          path: "/admin/complex-admin/finances/regular-fees",
        },
        {
          label:
            language === "Español"
              ? "Cuotas Extraordinarias"
              : "Extraordinary Fees",
          path: "/admin/complex-admin/finances/extra-fees",
        },
        {
          label: language === "Español" ? "Certificados" : "Certificates",
          path: "/admin/complex-admin/finances/certificates",
        },
      ],
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      label: language === "Español" ? "Servicios" : "Services",
      roles: ["COMPLEX_ADMIN"],
      subitems: [
        {
          label:
            language === "Español" ? "Servicios Comunes" : "Common Services",
          path: "/admin/complex-admin/services/common",
        },
        {
          label: language === "Español" ? "Reservas" : "Reservations",
          path: "/admin/complex-admin/services/reservations",
        },
      ],
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: language === "Español" ? "Usuarios" : "Users",
      roles: ["COMPLEX_ADMIN"],
      subitems: [
        {
          label:
            language === "Español" ? "Registro de Usuarios" : "User Registry",
          path: "/admin/complex-admin/users/registry",
        },
        {
          label: language === "Español" ? "Recepcionistas" : "Reception Staff",
          path: "/admin/complex-admin/users/reception",
        },
        {
          label: language === "Español" ? "Vigilantes" : "Security Staff",
          path: "/admin/complex-admin/users/security",
        },
        {
          label:
            language === "Español"
              ? "Servicios Generales"
              : "Maintenance Staff",
          path: "/admin/complex-admin/users/staff",
        },
      ],
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      label: language === "Español" ? "PQR" : "PQR",
      roles: ["COMPLEX_ADMIN"],
      subitems: [
        {
          label:
            language === "Español"
              ? "Gestión y Asignación"
              : "Management and Assignment",
          path: "/admin/complex-admin/pqr/management",
        },
        {
          label: language === "Español" ? "Seguimiento" : "Tracking",
          path: "/admin/complex-admin/pqr",
        },
      ],
    },
    {
      icon: <Settings className="w-6 h-6" />,
      label: language === "Español" ? "Configuraciones" : "Settings",
      roles: ["COMPLEX_ADMIN", "ADMIN"],
      subitems: [
        {
          label: language === "Español" ? "General" : "General",
          path: "/admin/complex-admin/configuration",
        },
        {
          label: language === "Español" ? "APIs de Pagos" : "Payment APIs",
          path: "/admin/complex-admin/configuration/payment-gateway",
        },
        {
          label: language === "Español" ? "WhatsApp" : "WhatsApp",
          path: "/admin/complex-admin/configuration/whatsapp",
        },
        {
          label: language === "Español" ? "Cámaras" : "Cameras",
          path: "/admin-portal/configuration/cameras",
        },
        {
          label: language === "Español" ? "Marca" : "Branding",
          path: "/admin/settings/branding",
          roles: ["ADMIN"], // Only platform admin can access branding
        },
      ],
    },
  ];

  const filteredSidebarItems = sidebarItems.filter((item) => {
    if (!item.roles || !user?.role) return false; // Si no hay roles definidos o el usuario no tiene rol, no mostrar
    return item.roles.includes(user.role);
  });

  usePassiveEvent(
    typeof window !== "undefined" ? window : null,
    "touchstart",
    (e) => {
      if (isCollapsed && (e.target as HTMLElement).closest(".sidebar")) {
        e.preventDefault();
      }
    },
  );

  return (
    <aside
      className={`sidebar bg-indigo-600 text-white transition-all duration-300 h-screen ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && <span className="text-xl font-bold">Armonía</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-indigo-700"
        >
          {isCollapsed ? (
            <ChevronRight className="w-6 h-6" />
          ) : (
            <ChevronLeft className="w-6 h-6" />
          )}
        </Button>
      </div>
      <nav className="mt-4">
        {filteredSidebarItems.map((item, index) => (
          <div key={index}>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start p-4 hover:bg-indigo-700"
              onClick={() => handleItemClick(item.label, item.path)}
            >
              {item.icon}
              {!isCollapsed && <span className="ml-4">{item.label}</span>}
              {!isCollapsed && item.subitems && (
                <ChevronDown
                  className={`ml-auto w-4 h-4 transform ${
                    expandedMenu === item.label ? "rotate-180" : ""
                  }`}
                />
              )}
            </Button>
            {!isCollapsed && item.subitems && expandedMenu === item.label && (
              <div className="ml-8">
                {item.subitems.map((subitem, subIndex) => (
                  <Button
                    key={subIndex}
                    variant="ghost"
                    className="w-full flex items-center justify-start p-2 hover:bg-indigo-600"
                    onClick={() => handleItemClick(subitem.label, subitem.path)}
                  >
                    <span>{subitem.label}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}