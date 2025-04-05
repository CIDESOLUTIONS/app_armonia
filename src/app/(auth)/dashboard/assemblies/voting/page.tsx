"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, X, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface ResidentVote {
  residentId: number;
  number: string;
  name: string;
  dni: string;
  vote: string | null;
}

interface Question {
  id: number;
  text: string;
  yesVotes: number;
  noVotes: number;
  nrVotes: number;
  isOpen: boolean;
  votingEndTime: number | null;
  showResidents: boolean;
  votes: ResidentVote[];
}

interface AgendaItem {
  id: number;
  numeral: string;
  topic: string;
  time: string;
  completed: boolean;
  notes: string;
}

interface Assembly {
  id: number;
  title: string;
  date: string;
  agenda: AgendaItem[];
  status: string;
}

export default function VotingPage() {
  const router = useRouter();
  const { isLoggedIn, token } = useAuth();
  const [language, setLanguage] = useState('Español');
  const [residents, setResidents] = useState<ResidentVote[]>([]);
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [selectedAssembly, setSelectedAssembly] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push('/login');
    } else {
      fetchAssemblies();
    }
  }, [isLoggedIn, token, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuestions(prev => prev.map(q => {
        if (q.isOpen && q.votingEndTime && Date.now() > q.votingEndTime) {
          saveQuestionVotes(q.id, q.votes);
          return { ...q, isOpen: false };
        }
        return q;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [questions]);

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

  const fetchResidents = async (assemblyId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/assemblies/attendance?assemblyId=${assemblyId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        const confirmedResidents = data.residents.filter((r: any) => r.attendance === 'Sí' || r.attendance === 'Delegado');
        setResidents(confirmedResidents.map((r: any) => ({
          residentId: r.id,
          number: r.number,
          name: r.name,
          dni: r.dni,
          vote: null,
        })));
      }
    } catch (err) {
      console.error('[Voting] Error al cargar residentes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgenda = async (assemblyId: number) => {
    try {
      const response = await fetch(`/api/assemblies/agenda?assemblyId=${assemblyId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        const assembly = assemblies.find(a => a.id === assemblyId);
        if (assembly) assembly.agenda = data.agenda;
        setAssemblies([...assemblies]);
      }
    } catch (err) {
      console.error('[Voting] Error al cargar agenda:', err);
    }
  };

  const fetchQuestions = async (assemblyId: number) => {
    try {
      const response = await fetch(`/api/assemblies/voting?assemblyId=${assemblyId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setQuestions((data.questions || []).map((q: any) => ({
          id: q.id,
          text: q.text,
          yesVotes: q.yesVotes || 0,
          noVotes: q.noVotes || 0,
          nrVotes: q.nrVotes || residents.length,
          isOpen: q.isOpen || false,
          votingEndTime: q.votingEndTime ? new Date(q.votingEndTime).getTime() : null,
          showResidents: false,
          votes: residents.map(r => ({
            residentId: r.residentId,
            number: r.number,
            name: r.name,
            dni: r.dni,
            vote: q.votes?.find((v: any) => v.residentId === r.residentId)?.vote || null,
          })),
        })));
      }
    } catch (err) {
      console.error('[Voting] Error al cargar preguntas:', err);
    }
  };

  const handleUpdateAgendaNotes = async (agendaId: number, notes: string) => {
    try {
      const response = await fetch(`/api/assemblies/agenda?id=${agendaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ notes, completed: true }),
      });
      if (!response.ok) throw new Error('Error al actualizar agenda');
      const assembly = assemblies.find(a => a.id === selectedAssembly);
      if (assembly) {
        const item = assembly.agenda.find(i => i.id === agendaId);
        if (item) {
          item.notes = notes;
          item.completed = true;
        }
        setAssemblies([...assemblies]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim() || !selectedAssembly) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assemblies/voting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ assemblyId: selectedAssembly, text: newQuestion }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setQuestions([...questions, {
        id: data.questionId,
        text: newQuestion,
        yesVotes: 0,
        noVotes: 0,
        nrVotes: residents.length,
        isOpen: false,
        votingEndTime: null,
        showResidents: false,
        votes: residents.map(r => ({ ...r, vote: null })),
      }]);
      setNewQuestion('');
      setSuccess(language === 'Español' ? 'Pregunta agregada.' : 'Question added.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnableVoting = (index: number) => {
    setQuestions(questions.map((q, i) =>
      i === index ? { ...q, isOpen: true, votingEndTime: Date.now() + 3 * 60 * 1000, showResidents: true } : q
    ));
  };

  const saveQuestionVotes = async (questionId: number, votes: ResidentVote[]) => {
    try {
      const response = await fetch(`/api/assemblies/voting/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ questionId, votes }),
      });
      if (!response.ok) throw new Error('Error al guardar votos');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVoteChange = (questionIndex: number, residentId: number, vote: 'Sí' | 'No' | null) => {
    if (!questions[questionIndex].isOpen) return;
    setQuestions(prev => {
      const newQuestions = [...prev];
      const q = newQuestions[questionIndex];
      const residentVote = q.votes.find(v => v.residentId === residentId);
      if (residentVote) {
        residentVote.vote = vote;
        q.yesVotes = q.votes.filter(v => v.vote === 'Sí').length;
        q.noVotes = q.votes.filter(v => v.vote === 'No').length;
        q.nrVotes = q.votes.filter(v => v.vote === null).length;
      }
      return newQuestions;
    });
  };

  const selectedAssemblyData = assemblies.find(a => a.id === selectedAssembly);

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
            {language === 'Español' ? 'Control de Votación' : 'Voting Control'}
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
                if (id) {
                  fetchResidents(id);
                  fetchAgenda(id);
                  fetchQuestions(id);
                } else {
                  setResidents([]);
                  setQuestions([]);
                }
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

          {selectedAssembly && selectedAssemblyData && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">{language === 'Español' ? 'Agenda' : 'Agenda'}</h2>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3">#</th>
                      <th className="px-6 py-3">{language === 'Español' ? 'Tema' : 'Topic'}</th>
                      <th className="px-6 py-3">{language === 'Español' ? 'Hora' : 'Time'}</th>
                      <th className="px-6 py-3">{language === 'Español' ? 'Observaciones' : 'Notes'}</th>
                      <th className="px-6 py-3">{language === 'Español' ? 'Estado' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAssemblyData.agenda.map(item => (
                      <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">{item.numeral}</td>
                        <td className="px-6 py-4">{item.topic}</td>
                        <td className="px-6 py-4">{item.time}</td>
                        <td className="px-6 py-4">
                          <Textarea
                            value={item.notes}
                            onChange={(e) => handleUpdateAgendaNotes(item.id, e.target.value)}
                            disabled={isSubmitting || item.completed}
                            className="w-full"
                          />
                        </td>
                        <td className="px-6 py-4">{item.completed ? 'Completado' : 'Pendiente'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{language === 'Español' ? 'Preguntas' : 'Questions'}</h2>
                <div className="flex space-x-2 mb-4">
                  <Input
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder={language === 'Español' ? 'Nueva pregunta' : 'New question'}
                    className="flex-1"
                  />
                  <Button onClick={handleAddQuestion} disabled={isSubmitting || questions.length >= 10}>
                    {language === 'Español' ? 'Agregar' : 'Add'}
                  </Button>
                </div>
                {questions.map((q, index) => (
                  <div key={q.id} className="border p-4 rounded-md bg-gray-50 dark:bg-gray-700 mb-4">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th className="px-6 py-3">#</th>
                          <th className="px-6 py-3">{language === 'Español' ? 'Pregunta' : 'Question'}</th>
                          <th className="px-6 py-3">{language === 'Español' ? 'Sí' : 'Yes'}</th>
                          <th className="px-6 py-3">{language === 'Español' ? 'No' : 'No'}</th>
                          <th className="px-6 py-3">{language === 'Español' ? 'NR' : 'NR'}</th>
                          <th className="px-6 py-3">{language === 'Español' ? 'Resultado' : 'Result'}</th>
                          <th className="px-6 py-3">{language === 'Español' ? 'Acciones' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4">{q.text}</td>
                          <td className="px-6 py-4">{q.yesVotes}</td>
                          <td className="px-6 py-4">{q.noVotes}</td>
                          <td className="px-6 py-4">{q.nrVotes}</td>
                          <td className="px-6 py-4">
                            {q.yesVotes > (residents.length / 2) ? (
                              <span className="text-green-500 flex items-center"><Check className="w-4 h-4 mr-1" /> Aprobado</span>
                            ) : (
                              <span className="text-red-500 flex items-center"><X className="w-4 h-4 mr-1" /> No Aprobado</span>
                            )}
                          </td>
                          <td className="px-6 py-4 flex space-x-2">
                            <Button
                              onClick={() => handleEnableVoting(index)}
                              disabled={isSubmitting || q.isOpen || q.votingEndTime}
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2"
                            >
                              {q.isOpen ? `${Math.max(0, Math.floor((q.votingEndTime! - Date.now()) / 1000))}s` : 'Habilitar'}
                            </Button>
                            <Button
                              onClick={() => setQuestions(questions.map((q, i) => i === index ? { ...q, showResidents: !q.showResidents } : q))}
                              className="bg-gray-500 hover:bg-gray-600 text-white p-2"
                            >
                              <ChevronRight className={`w-4 h-4 ${q.showResidents ? 'rotate-90' : ''}`} />
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {q.showResidents && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold">{language === 'Español' ? `Votos para "${q.text}"` : `Votes for "${q.text}"`}</h3>
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-2">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              <th className="px-6 py-3">{language === 'Español' ? '# Inmueble' : 'Property #'}</th>
                              <th className="px-6 py-3">{language === 'Español' ? 'Nombre' : 'Name'}</th>
                              <th className="px-6 py-3">{language === 'Español' ? 'DNI' : 'DNI'}</th>
                              <th className="px-6 py-3">{language === 'Español' ? 'Voto' : 'Vote'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {q.votes.map((r) => (
                              <tr key={r.residentId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{r.number}</td>
                                <td className="px-6 py-4">{r.name}</td>
                                <td className="px-6 py-4">{r.dni}</td>
                                <td className="px-6 py-4 flex space-x-2">
                                  <Button
                                    onClick={() => handleVoteChange(index, r.residentId, 'Sí')}
                                    disabled={!q.isOpen}
                                    className={`p-2 ${r.vote === 'Sí' ? 'bg-blue-500' : 'bg-gray-300'} hover:bg-blue-600 text-white`}
                                  >
                                    Sí
                                  </Button>
                                  <Button
                                    onClick={() => handleVoteChange(index, r.residentId, 'No')}
                                    disabled={!q.isOpen}
                                    className={`p-2 ${r.vote === 'No' ? 'bg-red-500' : 'bg-gray-300'} hover:bg-red-600 text-white`}
                                  >
                                    No
                                  </Button>
                                  <Button
                                    onClick={() => handleVoteChange(index, r.residentId, null)}
                                    disabled={!q.isOpen}
                                    className={`p-2 ${r.vote === null ? 'bg-gray-500' : 'bg-gray-300'} hover:bg-gray-600 text-white`}
                                  >
                                    Nulo
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
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