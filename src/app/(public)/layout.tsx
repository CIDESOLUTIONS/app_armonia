import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Armonía | Gestión Integral de Conjuntos Residenciales",
  description:
    "Plataforma líder para la administración de conjuntos residenciales. Gestiona finanzas, asambleas, comunicación y seguridad en un solo lugar.",
  keywords: [
    "administración de conjuntos",
    "software para conjuntos",
    "gestión de propiedades",
    "asambleas virtuales",
    "app para residentes",
  ],
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-layout">
      <Header
        theme="Claro"
        setTheme={() => {}} // Placeholder for setTheme
        language="Español"
        setLanguage={() => {}} // Placeholder for setLanguage
        currency="Pesos"
        setCurrency={() => {}} // Placeholder for setCurrency
        isLoggedIn={false}
      />
      <div className="pt-16">{children}</div>
    </div>
  );
}
