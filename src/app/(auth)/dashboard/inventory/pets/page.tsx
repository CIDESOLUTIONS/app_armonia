"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface Pet {
  id: number;
  propertyNumber: string;
  name: string;
  type: string;
}

const PetsPage = () => {
  const { token, complexId, schemaName } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Mascotas</h1>
      {/* Tabla o formulario para agregar mascotas */}
    </div>
  );
};

export default PetsPage;