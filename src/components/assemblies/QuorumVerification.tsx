// src/components/assemblies/QuorumVerification.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface QuorumVerificationProps {
  assemblyId: number;
  token: string;
  language: string;
  totalUnits: number;
  quorumPercentage: number;
}

interface AttendanceStats {
  confirmedAttendees: number;
  totalEligible: number;
  quorumReached: boolean;
  quorumPercentage: number;
  currentPercentage: number;
}

export default function QuorumVerification({
  assemblyId,
  token,
  language,
  totalUnits,
  quorumPercentage
}: QuorumVerificationProps) {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchQuorumStats = useCallback(async () => {
    try {
      // En un entorno real, esto sería una llamada a la API
      // const response = await fetch(`/api/assemblies/${assemblyId}/quorum`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // if (!response.ok) {
      //   throw new Error(language === 'Español' ? 'Error al cargar datos de quórum' : 'Error loading quorum data');
      // }
      // const data = await response.json();
      // setStats(data);
      // setLastUpdate(new Date());
      // setError(null);

      // Mock data for demonstration
      const mockStats: AttendanceStats = {
        confirmedAttendees: Math.floor(Math.random() * totalUnits),
        totalEligible: totalUnits,
        quorumReached: Math.random() > 0.5,
        quorumPercentage: quorumPercentage,
        currentPercentage: (Math.random() * 100),
      };
      setStats(mockStats);
      setLastUpdate(new Date());
      _setError(null);

    } catch (err: any) {
      console.error('[QuorumVerification] Error:', err);
      _setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [totalUnits, quorumPercentage, _setError, setStats, setLoading]);

  // Efecto inicial para cargar datos
  useEffect(() => {
    fetchQuorumStats();
    
    // Configurar actualización en tiempo real cada 30 segundos
    const intervalId = setInterval(() => {
      fetchQuorumStats();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [assemblyId, token, fetchQuorumStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
        <span>{language === 'Español' ? 'Verificando quórum...' : 'Verifying quorum...'}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <div className="flex">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">
          {language === 'Español' ? 'Verificación de Quórum' : 'Quorum Verification'}
        </h3>
        <Badge variant={stats.quorumReached ? "success" : "outline"}>
          {stats.quorumReached 
            ? (language === 'Español' ? 'Quórum Alcanzado' : 'Quorum Reached') 
            : (language === 'Español' ? 'Quórum Pendiente' : 'Quorum Pending')}
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{language === 'Español' ? 'Progreso actual' : 'Current progress'}</span>
          <span className="font-medium">{Math.round(stats.currentPercentage)}%</span>
        </div>
        <Progress value={stats.currentPercentage} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-gray-500" />
          <span>
            {language === 'Español' ? 'Asistentes confirmados:' : 'Confirmed attendees:'} 
            <span className="font-medium ml-1">{stats.confirmedAttendees}</span>
          </span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
          <span>
            {language === 'Español' ? 'Quórum requerido:' : 'Required quorum:'} 
            <span className="font-medium ml-1">{stats.quorumPercentage}%</span>
          </span>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-right">
        {language === 'Español' 
          ? `Última actualización: ${lastUpdate.toLocaleTimeString()}` 
          : `Last update: ${lastUpdate.toLocaleTimeString()}`}
      </div>
    </div>
  );
}
