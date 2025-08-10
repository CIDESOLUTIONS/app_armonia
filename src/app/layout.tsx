import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Armonía - Gestión de Conjuntos Residenciales",
  description: "Sistema de gestión para conjuntos residenciales",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}