"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Check, X } from 'lucide-react';
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
  isMainResident: boolean;
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
  const [residents, setResidents] = useState<Resident[]>([]);
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [selectedAssembly, setSelectedAssembly] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push('/(public)/login');
    } else {
      fetchAssemblies();
      fetchComplexData();
    }
  }, [isLoggedIn, token, router]);

  const fetchAssemblies = async () => {
    setLoading(true);
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
      }
    } catch (err) {
      console.error('[Voting] Error al cargar asambleas:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async (assemblyId?: number) => {
    setLoading(true);
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
      } else {
        setError(data.message || 'Error al cargar residentes');
      }
    } catch (err) {
      console.error('[Attendance] Error al conectar con el servidor:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
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
      if (!newDate) {
        setIsSubmitting(false);
        return;
      }

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

  const quorum = calculateQuorum();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
        <span className="ml-3 text-lg">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
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
    </div>
  );
}