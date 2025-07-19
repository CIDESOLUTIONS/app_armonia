"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, History } from "lucide-react";

export default function ResidentVisitorsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Gestión de Visitantes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/resident/visitors/pre-register">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Pre-registrar Visitante
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Genera códigos QR para un acceso rápido.
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Card className="opacity-50 cursor-not-allowed h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gray-400">
                <History className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Historial de Visitantes
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Próximamente: Revisa tus visitantes anteriores.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
