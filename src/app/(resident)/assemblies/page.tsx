"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, BarChart2 } from "lucide-react";

export default function ResidentAssembliesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Asambleas y Votaciones
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/resident/assemblies/list">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500">
                  <List className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Ver Asambleas</CardTitle>
                  <p className="text-sm text-gray-600">
                    Accede al listado de asambleas pasadas y futuras.
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
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Resultados de Votaciones
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Próximamente: Consulta los resultados de votaciones
                  anteriores.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
