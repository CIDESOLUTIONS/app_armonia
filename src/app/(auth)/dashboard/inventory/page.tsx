// src/app/(auth)/dashboard/inventory/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Users, 
  Car, 
  Dog,
  Plus 
} from 'lucide-react';
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { ComplexDataForm } from '@/components/inventory/ComplexDataForm';
import { ResidentForm } from '@/components/inventory/ResidentForm';
import { PropertiesTable } from '@/components/tables/PropertiesTable';
import { ResidentsTable } from '@/components/tables/ResidentsTable';
import { VehiclesTable } from '@/components/tables/VehiclesTable';
import { PetsTable } from '@/components/tables/PetsTable';

interface Complex {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminDNI: string;
  adminAddress: string;
  totalProperties: number;
  totalResidents: number;
}

interface Property {
  id: number;
  unitNumber: string;
  type: string;
  status: string;
  ownerName: string;
  ownerDNI: string;
  ownerEmail: string;
}

interface Resident {
  id: number;
  name: string;
  email: string;
  dni: string;
  birthDate: string;
  whatsapp: string;
  residentType: 'permanente' | 'temporal';
  startDate: string;
  endDate?: string;
  status: string;
  propertyNumber: string;
}

export default function InventoryPage() {
  const { user } = useAuth();
  const [complex, setComplex] = useState<Complex | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showComplexForm, setShowComplexForm] = useState(false);
  const [showResidentForm, setShowResidentForm] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user?.complexId || !user?.schemaName) {
      console.error('Faltan datos del usuario:', { user });
      setError('Error: Información del conjunto no disponible');
      setLoading(false);
      return;
    }
  
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      console.log('Fetching data with:', {
        complexId: user.complexId,
        schemaName: user.schemaName
      });
      
      // Fetch complex data
      const complexResponse = await fetch(
        `/api/inventory/update?complexId=${user.complexId}&schemaName=${user.schemaName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (!complexResponse.ok) {
        const errorData = await complexResponse.json();
        throw new Error(errorData.message || 'Error al obtener datos del conjunto');
      }
  
      const { complex } = await complexResponse.json();
      setComplex(complex);
  
      // Cargar propiedades y residentes solo si hay un conjunto válido
      if (complex) {
        const [propertiesRes, residentsRes] = await Promise.all([
          fetch(`/api/inventory/properties?complexId=${user.complexId}&schemaName=${user.schemaName}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(`/api/inventory/residents?complexId=${user.complexId}&schemaName=${user.schemaName}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ]);
  
        const propertiesData = await propertiesRes.json();
        const residentsData = await residentsRes.json();
  
        setProperties(propertiesData.properties || []);
        setResidents(residentsData.residents || []);
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };
  
  const handleComplexUpdate = async (updatedData: ComplexFormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');
  
      console.log('Enviando actualización:', {
        complexId: user?.complexId,
        ...updatedData
      });
  
      const response = await fetch('/api/inventory/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          complexId: user?.complexId,
          ...updatedData
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar datos del conjunto');
      }
  
      const { complex: updatedComplex } = await response.json();
      setComplex(updatedComplex);
      setShowComplexForm(false);
      
      // Recargar datos
      await fetchData();
  
    } catch (error) {
      console.error('Error updating complex:', error);
      throw error; // Propagar el error para que el formulario pueda manejarlo
    }
  };

  const handleResidentSave = async (residentData: Resident) => {
    try {
      const response = await fetch('/api/inventory/residents/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...residentData,
          complexId: user?.complexId,
          schemaName: user?.schemaName
        })
      });

      if (!response.ok) {
        throw new Error('Error al guardar residente');
      }

      setShowResidentForm(false);
      fetchData(); // Recargar datos
    } catch (error) {
      console.error('Error saving resident:', error);
      setError('Error al guardar residente');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventario del Conjunto</h1>
        <Button
          onClick={() => setShowComplexForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Editar Datos del Conjunto
        </Button>
      </div>

      {/* Datos del Conjunto */}
      <div className="mb-8">
        {showComplexForm ? (
          <ComplexDataForm
            initialData={complex}
            onSave={handleComplexUpdate}
            onCancel={() => setShowComplexForm(false)}
          />
        ) : (
          complex && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
              <div>
                <p><strong>Nombre:</strong> {complex.name}</p>
                <p><strong>Dirección:</strong> {complex.address}</p>
                <p><strong>Ciudad:</strong> {complex.city}</p>
                <p><strong>Estado:</strong> {complex.state}</p>
                <p><strong>País:</strong> {complex.country}</p>
              </div>
              <div>
                <p><strong>Administrador:</strong> {complex.adminName}</p>
                <p><strong>DNI:</strong> {complex.adminDNI}</p>
                <p><strong>Email:</strong> {complex.adminEmail}</p>
                <p><strong>Teléfono:</strong> {complex.adminPhone}</p>
                <p><strong>Dirección:</strong> {complex.adminAddress}</p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Tabs de Gestión */}
      <TabGroup>
        <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
            ${selected
              ? 'bg-white shadow'
              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            }`
          }>
            <div className="flex items-center justify-center">
              <Building2 className="mr-2" />
              Inmuebles
            </div>
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
            ${selected
              ? 'bg-white shadow'
              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            }`
          }>
            <div className="flex items-center justify-center">
              <Users className="mr-2" />
              Residentes
            </div>
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
            ${selected
              ? 'bg-white shadow'
              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            }`
          }>
            <div className="flex items-center justify-center">
              <Car className="mr-2" />
              Vehículos
            </div>
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
            ${selected
              ? 'bg-white shadow'
              : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            }`
          }>
            <div className="flex items-center justify-center">
              <Dog className="mr-2" />
              Mascotas
            </div>
          </Tab>
        </TabList>

        <TabPanels className="mt-2">
          {/* Panel de Inmuebles */}
          <TabPanel className="rounded-xl bg-white p-3">
            <div className="mb-4 flex justify-end">
              <Button
                onClick={() => {/* Agregar lógica */}}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Inmueble
              </Button>
            </div>
            <PropertiesTable properties={properties} />
          </TabPanel>

          {/* Panel de Residentes */}
          <TabPanel className="rounded-xl bg-white p-3">
            <div className="mb-4 flex justify-end">
              <Button
                onClick={() => setShowResidentForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Residente
              </Button>
            </div>
            <ResidentsTable
              residents={residents}
              onEdit={(resident) => {
                setSelectedResident(resident);
                setShowResidentForm(true);
              }}
            />
            {showResidentForm && (
              <ResidentForm
                resident={selectedResident}
                onSave={handleResidentSave}
                onCancel={() => {
                  setShowResidentForm(false);
                  setSelectedResident(null);
                }}
                properties={properties}
              />
            )}
          </TabPanel>

          {/* Panel de Vehículos */}
          <TabPanel className="rounded-xl bg-white p-3">
            <VehiclesTable />
          </TabPanel>

          {/* Panel de Mascotas */}
          <TabPanel className="rounded-xl bg-white p-3">
            <PetsTable />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}