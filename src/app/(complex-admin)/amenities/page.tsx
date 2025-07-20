"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function CommonAreasPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="ml-2">Cargando página de Áreas Comunes...</p>
    </div>
  );
}
