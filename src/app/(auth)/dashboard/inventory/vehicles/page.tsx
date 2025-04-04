"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface Vehicle {
  id: number;
  propertyNumber: string;
  licensePlate: string;
  type: string;
}

const VehiclesPage = () => {
  const { token, complexId, schemaName } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Vehículos</h1>
      {/* Tabla o formulario para agregar vehículos */}
    </div>
  );
};

export default VehiclesPage;