"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Loader2, BarChart2, Calendar, DollarSign, Building, Users, AlertCircle, Settings, Home, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface Assembly {
  id: number;
  title: string;
  date: string;
  agenda: { numeral: string; topic: string; time: string; completed: boolean; notes: string }[];
}

interface Document {
  id: number;
  fileName: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const { isLoggedIn, token } = useAuth();
  const [language, setLanguage] = useState('Español');
  const [theme, setTheme] = useState('Claro');
  const [currency, setCurrency] = useState('Dólares');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Asambleas');
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [selectedAssembly, setSelectedAssembly] = useState<number | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (!isLoggedIn || !token) {
      router.push('/login');
    } else {
      fetchAssemblies();
    }
  }, [isLoggedIn, token, router]);

  const fetchAssemblies = async () => {
    try {
      const response = await fetch(`/api/assemblies/list`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        const completedAssemblies = data.assemblies.filter((a: Assembly) => a.status === 'COMPLETED' || a.status === 'PENDING'); // Incluir PENDING
        setAssemblies(completedAssemblies);
        console.log('[Documents] Asambleas completadas:', completedAssemblies);
      }
    } catch (err) {
      console.error('[Documents] Error al cargar asambleas:', err);
    }
  };
  
  const fetchDocuments = async (assemblyId: number) => {
    try {
      const response = await fetch(`/api/assemblies/documents/list?assemblyId=${assemblyId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setDocuments(data.documents || []);
    } catch (err) {
      console.error('[Documents] Error al cargar documentos:', err);
    }
  };

  const handleCreateDocument = async () => {
    if (!selectedAssembly) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assemblies/documents/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ assemblyId: selectedAssembly }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSuccess(language === 'Español' ? 'Acta generada.' : 'Minutes generated.');
      fetchDocuments(selectedAssembly);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadDocument = async (documentId: number) => {
    try {
      const response = await fetch(`/api/assemblies/documents/download?documentId=${documentId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al descargar');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documents.find(d => d.id === documentId)?.fileName || 'acta.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
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
                {language === 'Español' ? 'Actas y Documentos' : 'Minutes and Documents'}
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
                    const id = parseInt(e.target.value) || null;
                    setSelectedAssembly(id);
                    if (id) fetchDocuments(id);
                    else setDocuments([]);
                  }}
                  className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">{language === 'Español' ? 'Seleccione una asamblea' : 'Select an assembly'}</option>
                  {assemblies.map(assembly => (
                    <option key={assembly.id} value={assembly.id}>
                      {assembly.title} ({new Date(assembly.date).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {selectedAssembly && (
                <div className="space-y-4">
                  <Button onClick={handleCreateDocument} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {language === 'Español' ? 'Generar Acta' : 'Generate Minutes'}
                  </Button>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th className="px-6 py-3">{language === 'Español' ? 'Nombre del Archivo' : 'File Name'}</th>
                          <th className="px-6 py-3">{language === 'Español' ? 'Creado' : 'Created'}</th>
                          <th className="px-6 py-3">{language === 'Español' ? 'Acción' : 'Action'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map(doc => (
                          <tr key={doc.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">{doc.fileName}</td>
                            <td className="px-6 py-4">{new Date(doc.createdAt).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <Button onClick={() => handleDownloadDocument(doc.id)} className="bg-blue-500 hover:bg-blue-600 text-white">
                                {language === 'Español' ? 'Descargar' : 'Download'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {success && <p className="text-green-500 text-sm">{success}</p>}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}