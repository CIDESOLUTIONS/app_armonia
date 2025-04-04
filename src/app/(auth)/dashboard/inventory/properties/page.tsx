"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface PropertyDetails {
  id: number;
  unitNumber: string;
  description: string;
  parking: number;
  storage: number;
  communicationProviders: string[];
}

const PropertiesPage = () => {
  const { token, complexId, schemaName } = useAuth();
  const [properties, setProperties] = useState<PropertyDetails[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await fetch(`/api/inventory/properties?complexId=${complexId}&schemaName=${schemaName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProperties(data.properties.map((p: any) => ({
        id: p.id,
        number: p.number,
        description: "",
        parking: 0,
        storage: 0,
        communicationProviders: [],
      })));
    };
    fetchProperties();
  }, [token, complexId, schemaName]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Detalles de Inmuebles</h1>
      {properties.map((property) => (
        <div key={property.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2>{property.number}</h2>
          <input
            value={property.description}
            onChange={(e) => {
              const newProperties = [...properties];
              newProperties[properties.indexOf(property)].description = e.target.value;
              setProperties(newProperties);
            }}
            placeholder="Descripción"
            className="border p-2 rounded w-full"
          />
          {/* Campos para parqueaderos, depósitos, proveedores */}
        </div>
      ))}
    </div>
  );
};

export default PropertiesPage;