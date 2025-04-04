"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, BarChart2, Calendar, DollarSign, Building, Users, AlertCircle, Settings, Home, ChevronDown, ChevronUp, Shield, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface Resident {
  id: number;
  number: string;
  name: string;
  dni: string;
  email: string;
  attendance: 'Sí' | 'No' | 'Delegado';
  delegateName: string | null;
  confirmed: boolean;
  isMainResident: boolean; // Nuevo campo para identificar residentes principales
}

interface Assembly {
  id: number;
  title: string;
  type: string;
  date: string;
  description: string | null;
  agenda: { numeral: string; topic: string; time: string; completed: boolean; notes: string }[];
  status: string;
}

export default function AttendancePage() {
  const router = useRouter();
  const { schemaName, user, isLoggedIn, token } = useAuth();
  const [language, setLanguage] = useState('Español');
  const [theme, setTheme] = useState('Claro');
  const [currency, setCurrency] = useState('Dólares');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Asambleas');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [selectedAssembly, setSelectedAssembly] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [totalUnits, setTotalUnits] = useState<number>(0);

  useEffect(() => {
    setIsClient(true);
    if (!isLoggedIn || !token) {
      router.push('/(public)/login');
    } else {
      fetchAssemblies();
      fetchComplexData();
    }
  }, [isLoggedIn, token, router]);

  const fetchAssemblies = async () => {
    try {
      const response = await fetch(`/api/assemblies/list`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        const today = new Date().setHours(0, 0, 0, 0);
        const filteredAssemblies = data.assemblies.filter((a: Assembly) => {
          const assemblyDate = new Date(a.date).setHours(0, 0, 0, 0);
          return assemblyDate >= today && (a.status === 'PENDING' || a.status === 'IN_PROGRESS');
        });
        setAssemblies(filteredAssemblies);
        console.log('[Voting] Asambleas filtradas:', filteredAssemblies); // Debugging
      }
    } catch (err) {
      console.error('[Voting] Error al cargar asambleas:', err);
    }
  };

  const fetchResidents = async (assemblyId?: number) => {
    try {
      const url = assemblyId
        ? `/api/assemblies/attendance?assemblyId=${assemblyId}`
        : '/api/inventory/residents';
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setResidents(data.residents || []);
        console.log('[Attendance] Residentes cargados:', data.residents);
      } else {
        setError(data.message || 'Error al cargar residentes');
        console.error('[Attendance] Error en respuesta:', data.message, 'Status:', response.status);
      }
    } catch (err) {
      console.error('[Attendance] Error al conectar con el servidor:', err);
      setError('Error al conectar con el servidor');
    }
  };
  
  const fetchComplexData = async () => {
    try {
      const response = await fetch('/api/inventory/update', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.complex) {
        setTotalUnits(data.complex.totalUnits);
      }
    } catch (err) {
      console.error('[Attendance] Error al cargar datos del conjunto:', err);
    }
  };

  const sendEmailInvitations = async () => {
    if (!selectedAssembly) return;
    setIsSubmitting(true);
    try {
      const assembly = assemblies.find(a => a.id === selectedAssembly);
      const response = await fetch('/api/assemblies/send-invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          assemblyId: selectedAssembly,
          title: assembly?.title,
          date: assembly?.date,
          agenda: assembly?.agenda,
        }),
      });
      if (!response.ok) throw new Error('Error al enviar invitaciones');
      setSuccess(language === 'Español' ? 'Invitaciones enviadas con éxito.' : 'Invitations sent successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttendanceChange = (index: number, value: 'Sí' | 'No' | 'Delegado') => {
    const newResidents = [...residents];
    newResidents[index].attendance = value;
    if (value !== 'Delegado') newResidents[index].delegateName = null;
    setResidents(newResidents);
  };

  const handleDelegateNameChange = (index: number, value: string) => {
    const newResidents = [...residents];
    newResidents[index].delegateName = value;
    setResidents(newResidents);
  };

  const calculateQuorum = () => {
    const confirmedResidents = residents.filter(r => r.attendance === 'Sí' || r.attendance === 'Delegado').length;
    const quorumPercentage = totalUnits > 0 ? (confirmedResidents / totalUnits) * 100 : 0;
    return { count: confirmedResidents, percentage: quorumPercentage, achieved: quorumPercentage > 50 };
  };

  const handleSaveAttendance = async () => {
    if (!selectedAssembly) {
      setError(language === 'Español' ? 'Por favor, selecciona una asamblea.' : 'Please select an assembly.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/assemblies/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          assemblyId: selectedAssembly,
          residents: residents.map(r => ({
            id: r.id,
            attendance: r.attendance,
            delegateName: r.delegateName,
            confirmed: r.confirmed || r.attendance !== 'No',
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al guardar asistencia');

      setSuccess(language === 'Español' ? 'Asistencia guardada con éxito.' : 'Attendance saved successfully.');
      fetchResidents(selectedAssembly); // Refrescar lista
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartAssembly = async () => {
    if (!selectedAssembly || !calculateQuorum().achieved) return;
    try {
      const response = await fetch(`/api/assemblies/update?id=${selectedAssembly}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'IN_PROGRESS' }),
      });
      if (!response.ok) throw new Error('Error al iniciar asamblea');
      setSuccess(language === 'Español' ? 'Asamblea iniciada.' : 'Assembly started.');
      fetchAssemblies();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReschedule = async () => {
    if (!selectedAssembly) return;
    setIsSubmitting(true);
    try {
      const assembly = assemblies.find(a => a.id === selectedAssembly);
      const newDate = prompt(language === 'Español' ? 'Ingresa nueva fecha y hora (YYYY-MM-DDTHH:MM):' : 'Enter new date and time (YYYY-MM-DDTHH:MM):');
      if (!newDate) return;

      const response = await fetch(`/api/assemblies/update?id=${selectedAssembly}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: assembly?.title,
          type: assembly?.type,
          date: newDate,
          description: assembly?.description || undefined,
          agenda: assembly?.agenda,
          status: 'PENDING',
        }),
      });
      if (!response.ok) throw new Error('Error al reprogramar');
      setSuccess(language === 'Español' ? 'Asamblea reprogramada.' : 'Assembly rescheduled.');
      fetchAssemblies();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleSubMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
    if (isSidebarCollapsed) setIsSidebarCollapsed(false);
  };

  const sidebarItems = [
    { icon: <BarChart2 className="w-6 h-6" />, label: language === 'Español' ? 'Dashboard' : 'Dashboard', path: '/dashboard' },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: language === 'Español' ? 'Asambleas' : 'Assemblies',
      subItems: [
        { label: language === 'Español' ? 'Programación' : 'Scheduling', path: '/dashboard/assemblies/scheduling' },
        { label: language === 'Español' ? 'Control Asistencia' : 'Attendance Control', path: '/dashboard/assemblies/attendance' },
        { label: language === 'Español' ? 'Control Votación' : 'Voting Control', path: '/dashboard/assemblies/voting' },
        { label: language === 'Español' ? 'Actas y Documentos' : 'Minutes and Documents', path: '/dashboard/assemblies/documents' },
      ],
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: language === 'Español' ? 'Finanzas' : 'Finances',
      subItems: [
        { label: language === 'Español' ? 'Presupuesto' : 'Budget', path: '/dashboard/finances/budget' },
        { label: language === 'Español' ? 'Proyectos' : 'Projects', path: '/dashboard/finances/projects' },
        { label: language === 'Español' ? 'Cuotas Ordinarias' : 'Regular Fees', path: '/dashboard/finances/regular-fees' },
        { label: language === 'Español' ? 'Cuotas Extraordinarias' : 'Extraordinary Fees', path: '/dashboard/finances/extra-fees' },
        { label: language === 'Español' ? 'Servicios Comunes' : 'Common Services', path: '/dashboard/finances/common-services' },
        { label: language === 'Español' ? 'Certificaciones' : 'Certifications', path: '/dashboard/finances/certifications' },
      ],
    },
    {
      icon: <Building className="w-6 h-6" />,
      label: language === 'Español' ? 'Inventario' : 'Inventory',
      subItems: [
        { label: language === 'Español' ? 'Datos del Conjunto' : 'Complex Data', path: '/dashboard/inventory' },
        { label: language === 'Español' ? 'Inmuebles' : 'Properties', path: '/dashboard/inventory/properties' },
        { label: language === 'Español' ? 'Vehículos' : 'Vehicles', path: '/dashboard/inventory/vehicles' },
        { label: language === 'Español' ? 'Mascotas' : 'Pets', path: '/dashboard/inventory/pets' },
        { label: language === 'Español' ? 'Servicios Comunes' : 'Common Services', path: '/dashboard/inventory/services' },
      ],
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: language === 'Español' ? 'Residentes' : 'Residents',
      subItems: [
        { label: language === 'Español' ? 'Creación de Usuarios' : 'User Creation', path: '/dashboard/residents/users' },
      ],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      label: language === 'Español' ? 'Usuarios' : 'Users',
      subItems: [
        { label: language === 'Español' ? 'Recepcionistas' : 'Receptionists', path: '/dashboard/users/receptionists' },
        { label: language === 'Español' ? 'Vigilantes' : 'Guards', path: '/dashboard/users/guards' },
        { label: language === 'Español' ? 'Servicios Generales' : 'General Services', path: '/dashboard/users/general-services' },
      ],
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      label: language === 'Español' ? 'PQR' : 'PQR',
      subItems: [
        { label: language === 'Español' ? 'Gestión y Asignación' : 'Management and Assignment', path: '/dashboard/pqr/management' },
      ],
    },
    {
      icon: <Settings className="w-6 h-6" />,
      label: language === 'Español' ? 'Configuraciones' : 'Settings',
      subItems: [
        { label: language === 'Español' ? 'APIs de Pagos' : 'Payment APIs', path: '/dashboard/settings/payments' },
        { label: language === 'Español' ? 'WhatsApp' : 'WhatsApp', path: '/dashboard/settings/whatsapp' },
        { label: language === 'Español' ? 'Cámaras' : 'Cameras', path: '/dashboard/settings/cameras' },
      ],
    },
  ];

  if (!isClient || !isLoggedIn || !token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  const quorum = calculateQuorum();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'Claro' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      <Header theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} currency={currency} setCurrency={setCurrency} />
      <div className="h-16"></div>
      <div className="flex flex-1">
        <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-indigo-600 text-white p-4 transition-all duration-300 flex flex-col`}>
          <div className="flex items-center justify-end mb-6">
            <Button variant="ghost" className="text-white" onClick={toggleSidebar}>
              {isSidebarCollapsed ? '>' : '<'}
            </Button>
          </div>
          <nav className="space-y-2 flex-1">
            {sidebarItems.map((item, index) => (
              <div key={index} className="relative group">
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-indigo-700 p-2 rounded"
                  onClick={() => item.path ? router.push(item.path) : toggleSubMenu(item.label)}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span className={`${isSidebarCollapsed ? 'absolute left-16 bg-indigo-700 text-white px-2 py-1 rounded-md text-sm hidden group-hover:block' : 'block'}`}>
                      {item.label}
                    </span>
                  </div>
                  {item.subItems && !isSidebarCollapsed && (
                    <span>{expandedMenu === item.label ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
                  )}
                </div>
                {!isSidebarCollapsed && item.subItems && expandedMenu === item.label && (
                  <div className="ml-6 space-y-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-indigo-700 p-2 rounded text-sm"
                        onClick={() => subItem.path && router.push(subItem.path)}
                      >
                        <span>{subItem.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6 max-w-7xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {language === 'Español' ? 'Control de Asistencia' : 'Attendance Control'}
              </h1>
            </header>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {language === 'Español' ? 'Seleccionar Asamblea' : 'Select Assembly'}
                </label>
                <select
                  value={selectedAssembly || ''}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    setSelectedAssembly(id || null);
                    if (id) fetchResidents(id);
                    else setResidents([]);
                  }}
                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">{language === 'Español' ? 'Selecciona una asamblea' : 'Select an assembly'}</option>
                  {assemblies.map(assembly => (
                    <option key={assembly.id} value={assembly.id}>
                      {assembly.title} ({new Date(assembly.date).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {selectedAssembly && (
                <div className="space-y-4">
                  <Button onClick={sendEmailInvitations} disabled={isSubmitting}>
                    {language === 'Español' ? 'Enviar Invitaciones' : 'Send Invitations'}
                  </Button>
                  {residents.length === 0 ? (
                    <p className="text-gray-500">{language === 'Español' ? 'No hay residentes disponibles.' : 'No residents available.'}</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th className="px-6 py-3">{language === 'Español' ? '# Inmueble' : 'Property #'}</th>
                            <th className="px-6 py-3">{language === 'Español' ? 'Nombre' : 'Name'}</th>
                            <th className="px-6 py-3">{language === 'Español' ? 'DNI' : 'DNI'}</th>
                            <th className="px-6 py-3">{language === 'Español' ? 'Asistencia' : 'Attendance'}</th>
                            <th className="px-6 py-3">{language === 'Español' ? 'Delegado' : 'Delegate'}</th>
                            <th className="px-6 py-3">{language === 'Español' ? 'Confirmado' : 'Confirmed'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {residents.map((resident, index) => (
                            <tr key={resident.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                              <td className="px-6 py-4">{resident.number}</td>
                              <td className="px-6 py-4">{resident.name}</td>
                              <td className="px-6 py-4">{resident.dni}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={resident.attendance}
                                  onChange={(e) => handleAttendanceChange(index, e.target.value as 'Sí' | 'No' | 'Delegado')}
                                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm"
                                >
                                  <option value="No">{language === 'Español' ? 'No' : 'No'}</option>
                                  <option value="Sí">{language === 'Español' ? 'Sí' : 'Yes'}</option>
                                  <option value="Delegado">{language === 'Español' ? 'Delegado' : 'Delegate'}</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <Input
                                  value={resident.delegateName || ''}
                                  onChange={(e) => handleDelegateNameChange(index, e.target.value)}
                                  placeholder={language === 'Español' ? 'Nombre del delegado' : 'Delegate Name'}
                                  disabled={resident.attendance !== 'Delegado'}
                                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm"
                                />
                              </td>
                              <td className="px-6 py-4">{resident.confirmed ? <Check className="text-green-500" /> : <X className="text-red-500" />}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="mt-4">
                    <p className="text-gray-700 dark:text-white">
                      {language === 'Español' ? 'Quorum: ' : 'Quorum: '}
                      {`${quorum.count} de ${totalUnits} (${quorum.percentage.toFixed(2)}%) - ${quorum.achieved ? 'Sí hay quorum' : 'No hay quorum'}`}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <Button onClick={handleSaveAttendance} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {language === 'Español' ? 'Guardar' : 'Save'}
                      </Button>
                      {quorum.achieved && (
                        <Button onClick={handleStartAssembly} disabled={isSubmitting} className="bg-green-500 hover:bg-green-600">
                          {language === 'Español' ? 'Iniciar Asamblea' : 'Start Assembly'}
                        </Button>
                      )}
                      {!quorum.achieved && (
                        <Button onClick={handleReschedule} disabled={isSubmitting} className="bg-yellow-500 hover:bg-yellow-600">
                          {language === 'Español' ? 'Reprogramar' : 'Reschedule'}
                        </Button>
                      )}
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                  {success && <p className="text-green-500 text-sm mt-4">{success}</p>}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}