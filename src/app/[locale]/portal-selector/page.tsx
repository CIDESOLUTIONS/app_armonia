"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building,
  UserPlus,
  Shield,
  ArrowLeft,
  User,
  Briefcase,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Header } from "@/components/layout/header";

// Helper para las clases de Tailwind
const colorClasses = {
  indigo: {
    header: "bg-indigo-600 text-indigo-100",
    button: "bg-indigo-600 hover:bg-indigo-700",
  },
  green: {
    header: "bg-green-600 text-green-100",
    button: "bg-green-600 hover:bg-green-700",
  },
  red: {
    header: "bg-red-600 text-red-100",
    button: "bg-red-600 hover:bg-red-700",
  },
  blue: {
    header: "bg-blue-600 text-blue-100",
    button: "bg-blue-600 hover:bg-blue-700",
  },
};

export default function PortalSelector() {
  const router = useRouter();
  const [language, setLanguage] = useState("Español");
  const [theme, setTheme] = useState("Claro");
  const [currency, setCurrency] = useState("Pesos");

  const texts = {
    es: {
      title: "Seleccionar Portal",
      subtitle: "Elija el tipo de acceso que necesita",
      adminPortal: "Portal Administración",
      adminDesc: "Gestión completa del conjunto residencial",
      adminButton: "Acceder como Administrador",
      residentPortal: "Portal Residentes",
      residentDesc: "Acceso para propietarios y residentes",
      residentButton: "Acceder como Residente",
      receptionPortal: "Portal Recepción",
      receptionDesc: "Acceso para personal de recepción y vigilancia",
      receptionButton: "Acceder como Recepción",
      portfolioPortal: "Portal Portafolio",
      portfolioDesc:
        "Gestión centralizada para administradores de múltiples conjuntos",
      portfolioButton: "Acceder como Gestor de Portafolio",
      registerQuestion: "¿Necesita registrar un nuevo conjunto?",
      registerButton: "Registrar Conjunto",
      backButton: "Volver a Inicio",
    },
    en: {
      title: "Select Portal",
      subtitle: "Choose the type of access you need",
      adminPortal: "Administration Portal",
      adminDesc: "Complete management of the residential complex",
      adminButton: "Access as Administrator",
      residentPortal: "Resident Portal",
      residentDesc: "Access for owners and residents",
      residentButton: "Access as Resident",
      receptionPortal: "Reception Portal",
      receptionDesc: "Access for reception and security staff",
      receptionButton: "Access as Reception",
      portfolioPortal: "Portfolio Portal",
      portfolioDesc: "Centralized management for multi-complex administrators",
      portfolioButton: "Access as Portfolio Manager",
      registerQuestion: "Need to register a new complex?",
      registerButton: "Register Complex",
      backButton: "Back to Home",
    },
  };

  const t = language === "Español" ? texts.es : texts.en;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("dark-mode", theme === "Oscuro");
    }
  }, [theme]);

  const navigateToLogin = (
    portalType: "admin" | "resident" | "reception" | "portfolio",
  ) => {
    router.push(`/es/login?portal=${portalType}`);
  };

  const portalCards = [
    {
      id: "admin",
      title: t.adminPortal,
      description: t.adminDesc,
      buttonText: t.adminButton,
      icon: <Building className="w-6 h-6 mr-2" />,
      color: "indigo" as keyof typeof colorClasses,
    },
    {
      id: "resident",
      title: t.residentPortal,
      description: t.residentDesc,
      buttonText: t.residentButton,
      icon: <User className="w-6 h-6 mr-2" />,
      color: "green" as keyof typeof colorClasses,
    },
    {
      id: "reception",
      title: t.receptionPortal,
      description: t.receptionDesc,
      buttonText: t.receptionButton,
      icon: <Shield className="w-6 h-6 mr-2" />,
      color: "red" as keyof typeof colorClasses,
    },
    {
      id: "portfolio",
      title: t.portfolioPortal,
      description: t.portfolioDesc,
      buttonText: t.portfolioButton,
      icon: <Briefcase className="w-6 h-6 mr-2" />,
      color: "blue" as keyof typeof colorClasses,
      fullWidth: true,
    },
  ];

  return (
    <div
      className={`flex flex-col min-h-screen ${theme === "Oscuro" ? "bg-gray-900 text-white" : "bg-gradient-to-b from-indigo-50 to-gray-100 text-gray-900"}`}
    >
      <Header
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
        hideNavLinks={true}
      />

      <div className="container max-w-5xl px-4 py-8 mx-auto mt-6 flex-grow">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className={`${theme === "Oscuro" ? "text-indigo-400 hover:bg-indigo-950" : "text-indigo-600 hover:bg-indigo-50"}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backButton}
          </Button>
        </div>

        <div className="mb-10 text-center">
          <h1
            className={`text-4xl font-bold ${theme === "Oscuro" ? "text-indigo-400" : "text-indigo-600"} mb-3`}
          >
            {t.title}
          </h1>
          <p
            className={`text-xl ${theme === "Oscuro" ? "text-gray-300" : "text-gray-600"}`}
          >
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portalCards.map((card) => (
            <Card
              key={card.id}
              className={`overflow-hidden transition-all hover:shadow-xl ${theme === "Oscuro" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} transform hover:-translate-y-1 duration-300 ${card.fullWidth ? "md:col-span-2" : ""}`}
            >
              <CardHeader
                className={`${colorClasses[card.color].header} text-white pb-6`}
              >
                <CardTitle className="flex items-center text-xl">
                  {card.icon}
                  {card.title}
                </CardTitle>
                <CardDescription className={colorClasses[card.color].header}>
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  className={`w-full ${colorClasses[card.color].button}`}
                  onClick={() => navigateToLogin(card.id as any)}
                  data-testid={`portal-${card.id}-button`}
                >
                  {card.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div
            className={`max-w-md mx-auto p-6 rounded-lg ${theme === "Oscuro" ? "bg-gray-800" : "bg-white"} shadow-lg`}
          >
            <p
              className={`mb-4 ${theme === "Oscuro" ? "text-gray-300" : "text-gray-600"} font-medium`}
            >
              {t.registerQuestion}
            </p>
            <Button
              variant="outline"
              className={`${theme === "Oscuro" ? "border-indigo-400 text-indigo-400 hover:bg-indigo-950" : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"} py-2 px-4 transform transition-transform hover:scale-105 duration-200`}
              onClick={() => router.push(ROUTES.REGISTER_COMPLEX)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {t.registerButton}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
