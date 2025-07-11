var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AssemblyAdvancedService from '@/lib/services/assembly-advanced-service';
import { WebSocketService } from '@/lib/communications/websocket-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle as AddIcon, Users as GroupIcon, HowToVote as HowToVoteIcon, Info as InfoIcon, FileText as PdfIcon, Play as StartIcon, StopCircle as StopIcon, Loader2 } from 'lucide-react';
// Componente para mostrar el estado del quórum
const QuorumStatusComponent = ({ current, required, status }) => {
    const percentage = Math.min(100, Math.round((current / required) * 100));
    let progressColorClass = 'bg-red-500';
    if (percentage >= 100) {
        progressColorClass = 'bg-green-500';
    }
    else if (percentage >= 70) {
        progressColorClass = 'bg-yellow-500';
    }
    return (_jsxs("div", { className: "w-full mb-4", children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsxs("span", { children: ["Qu\u00F3rum actual: ", current, "%"] }), _jsxs("span", { children: ["Requerido: ", required, "%"] })] }), _jsx(Progress, { value: percentage, className: `h-2 ${progressColorClass}` }), _jsxs("div", { className: "flex justify-between text-sm mt-1", children: [_jsx("span", { className: `font-bold ${status === 'REACHED' ? 'text-green-600' : 'text-red-600'}`, children: status === 'REACHED' ? 'Quórum alcanzado' : 'Quórum no alcanzado' }), _jsxs("span", { children: [percentage, "%"] })] })] }));
};
// Componente para mostrar el estado de la asamblea
const AssemblyStatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'SCHEDULED':
                return { label: 'Programada', variant: 'secondary' };
            case 'IN_PROGRESS':
                return { label: 'En progreso', variant: 'default' };
            case 'COMPLETED':
                return { label: 'Completada', variant: 'success' };
            case 'CANCELLED':
                return { label: 'Cancelada', variant: 'destructive' };
            case 'SUSPENDED':
                return { label: 'Suspendida', variant: 'warning' };
            default:
                return { label: status, variant: 'outline' };
        }
    };
    const config = getStatusConfig(status);
    return (_jsx(Badge, { variant: config.variant, children: config.label }));
};
// Componente principal para gestionar una asamblea en tiempo real
const AssemblyLiveView = () => {
    var _a;
    const router = useRouter();
    const { id } = useParams();
    const { user } = useAuthStore(); // Assuming useAuthStore provides user info
    // Estados
    const [assembly, setAssembly] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendees, setAttendees] = useState([]);
    const [votings, setVotings] = useState([]);
    const [activeVoting, setActiveVoting] = useState(null);
    const [createVotingOpen, setCreateVotingOpen] = useState(false);
    const [viewResultsOpen, setViewResultsOpen] = useState(false);
    const [selectedVoting, setSelectedVoting] = useState(null);
    const [wsConnected, setWsConnected] = useState(false);
    // Servicio
    const assemblyService = new AssemblyAdvancedService();
    const wsService = new WebSocketService();
    // Cargar datos de la asamblea
    const loadAssemblyData = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const assemblyData = yield assemblyService.getAssembly(parseInt(id));
            setAssembly(assemblyData);
            const attendeesData = yield assemblyService.getAttendance(parseInt(id));
            setAttendees(attendeesData);
            const votingsData = yield assemblyService.getVotings(parseInt(id));
            setVotings(votingsData);
            const active = votingsData.find((v) => v.status === 'ACTIVE');
            setActiveVoting(active || null);
        }
        catch (error) {
            console.error('Error al cargar datos de asamblea:', error);
        }
        finally {
            setLoading(false);
        }
    }), [id, assemblyService]);
    // Manejar eventos de WebSocket
    const handleWebSocketEvent = useCallback((event) => {
        const { type, data } = event;
        switch (type) {
            case 'QUORUM_REACHED':
                setAssembly((prev) => (Object.assign(Object.assign({}, prev), { currentCoefficient: data.currentCoefficient, quorumStatus: 'REACHED' })));
                break;
            case 'ASSEMBLY_STARTED':
                setAssembly((prev) => (Object.assign(Object.assign({}, prev), { status: 'IN_PROGRESS' })));
                break;
            case 'ASSEMBLY_ENDED':
                setAssembly((prev) => (Object.assign(Object.assign({}, prev), { status: 'COMPLETED', endTime: data.endTime })));
                break;
            case 'VOTING_STARTED': {
                setVotings((prev) => prev.map((v) => v.id === data.votingId
                    ? Object.assign(Object.assign({}, v), { status: 'ACTIVE', startTime: data.startTime }) : v));
                const startedVoting = votings.find((v) => v.id === data.votingId);
                if (startedVoting) {
                    setActiveVoting(Object.assign(Object.assign({}, startedVoting), { status: 'ACTIVE', startTime: data.startTime }));
                }
                break;
            }
            case 'VOTE_CAST':
                if ((activeVoting === null || activeVoting === void 0 ? void 0 : activeVoting.id) === data.votingId) {
                    setActiveVoting((prev) => (Object.assign(Object.assign({}, prev), { totalVotes: data.totalVotes })));
                }
                break;
            case 'VOTING_CLOSED':
                setVotings((prev) => prev.map((v) => v.id === data.votingId
                    ? Object.assign(Object.assign({}, v), { status: 'CLOSED', endTime: data.endTime, result: data.result, isApproved: data.isApproved }) : v));
                setActiveVoting(null);
                break;
            case 'MINUTES_SIGNED':
                loadAssemblyData();
                break;
            default:
                console.log('Evento WebSocket no manejado:', type, data);
        }
    }, [activeVoting, loadAssemblyData, votings]);
    // Conectar a WebSocket cuando se carga la asamblea
    useEffect(() => {
        if (assembly === null || assembly === void 0 ? void 0 : assembly.realtimeChannel) {
            const connectWs = () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield wsService.connect(assembly.realtimeChannel);
                    setWsConnected(true);
                    wsService.subscribe(assembly.realtimeChannel, handleWebSocketEvent);
                }
                catch (error) {
                    console.error('Error al conectar WebSocket:', error);
                }
            });
            connectWs();
            return () => {
                wsService.disconnect(assembly.realtimeChannel);
            };
        }
    }, [assembly === null || assembly === void 0 ? void 0 : assembly.realtimeChannel, handleWebSocketEvent, wsService]);
    // Cargar datos iniciales
    useEffect(() => {
        if (id) {
            loadAssemblyData();
        }
    }, [id, loadAssemblyData]);
    // Iniciar asamblea
    const handleStartAssembly = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield assemblyService.startAssembly(parseInt(id), user.id);
        }
        catch (error) {
            console.error('Error al iniciar asamblea:', error);
        }
    });
    // Finalizar asamblea
    const handleEndAssembly = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield assemblyService.endAssembly(parseInt(id), user.id);
        }
        catch (error) {
            console.error('Error al finalizar asamblea:', error);
        }
    });
    // Crear votación
    const handleCreateVoting = (votingData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield assemblyService.createVoting(Object.assign(Object.assign({}, votingData), { assemblyId: parseInt(id) }), user.id);
            const votingsData = yield assemblyService.getVotings(parseInt(id));
            setVotings(votingsData);
            setCreateVotingOpen(false);
        }
        catch (error) {
            console.error('Error al crear votación:', error);
        }
    });
    // Iniciar votación
    const handleStartVoting = (votingId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield assemblyService.startVoting(votingId, user.id);
        }
        catch (error) {
            console.error('Error al iniciar votación:', error);
        }
    });
    // Cerrar votación
    const handleCloseVoting = (votingId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield assemblyService.closeVoting(votingId, user.id);
        }
        catch (error) {
            console.error('Error al cerrar votación:', error);
        }
    });
    // Ver resultados de votación
    const handleViewResults = (voting) => {
        setSelectedVoting(voting);
        setViewResultsOpen(true);
    };
    // Renderizar contenido de carga
    if (loading) {
        return (_jsxs("div", { className: "flex items-center justify-center p-4", children: [_jsx(Loader2, { className: "w-6 h-6 animate-spin text-indigo-600" }), _jsx("span", { className: "ml-2", children: "Cargando..." })] }));
    }
    // Renderizar error si no se encuentra la asamblea
    if (!assembly) {
        return (_jsx("div", { className: "p-4", children: _jsx("h5", { className: "text-xl text-red-600", children: "Asamblea no encontrada" }) }));
    }
    return (_jsxs("div", { className: "p-2", children: [_jsxs("div", { className: "bg-white shadow-md rounded-lg p-3 mb-3", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-2 items-center", children: [_jsxs("div", { className: "md:col-span-8", children: [_jsx("h4", { className: "text-2xl font-bold mb-1", children: assembly.title }), _jsxs("div", { className: "flex items-center mb-1", children: [_jsx(AssemblyStatusBadge, { status: assembly.status }), _jsxs("p", { className: "ml-2 text-sm", children: [format(new Date(assembly.date), 'PPP', { locale: es }), " \u2022 ", format(new Date(assembly.date), 'HH:mm')] }), assembly.endTime && (_jsxs("p", { className: "ml-2 text-sm", children: ["Finalizada: ", format(new Date(assembly.endTime), 'HH:mm')] }))] }), _jsx("p", { className: "text-gray-600 mb-2", children: assembly.description || 'Sin descripción' }), _jsxs("p", { className: "text-sm", children: [_jsx("strong", { children: "Ubicaci\u00F3n:" }), " ", assembly.location] })] }), _jsxs("div", { className: "md:col-span-4 flex justify-end gap-2", children: [assembly.status === 'SCHEDULED' && assembly.quorumStatus === 'REACHED' && (_jsxs(Button, { variant: "default", onClick: handleStartAssembly, children: [_jsx(StartIcon, { className: "mr-2 h-4 w-4" }), "Iniciar Asamblea"] })), assembly.status === 'IN_PROGRESS' && (_jsxs(Button, { variant: "destructive", onClick: handleEndAssembly, children: [_jsx(StopIcon, { className: "mr-2 h-4 w-4" }), "Finalizar Asamblea"] })), assembly.status === 'COMPLETED' && ((_a = assembly.minutes) === null || _a === void 0 ? void 0 : _a.pdfUrl) && (_jsx(Button, { variant: "outline", asChild: true, children: _jsxs("a", { href: assembly.minutes.pdfUrl, target: "_blank", rel: "noopener noreferrer", children: [_jsx(PdfIcon, { className: "mr-2 h-4 w-4" }), "Ver Acta"] }) }))] })] }), _jsxs("div", { className: "mt-2 flex items-center", children: [_jsx("div", { className: `w-2.5 h-2.5 rounded-full mr-1 ${wsConnected ? 'bg-green-500' : 'bg-red-500'}` }), _jsx("span", { className: `text-xs ${wsConnected ? 'text-green-600' : 'text-red-600'}`, children: wsConnected ? 'Conectado en tiempo real' : 'Desconectado' })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-3", children: [_jsxs("div", { className: "md:col-span-4", children: [_jsxs(Card, { className: "mb-3", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Qu\u00F3rum" }) }), _jsxs(CardContent, { children: [_jsx(QuorumStatusComponent, { current: assembly.currentCoefficient, required: assembly.requiredCoefficient, status: assembly.quorumStatus }), _jsxs("div", { className: "flex justify-between mt-2 text-sm", children: [_jsxs("p", { children: [_jsx("strong", { children: "Total asistentes:" }), " ", attendees.length] }), _jsxs("p", { children: [_jsx("strong", { children: "Coeficiente total:" }), " ", assembly.currentCoefficient, "%"] })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { title: "Asistentes", className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Asistentes" }), _jsx(Button, { variant: "ghost", size: "icon", children: _jsx(GroupIcon, { className: "h-4 w-4 text-gray-500" }) })] }), _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "max-h-[400px] overflow-y-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Unidad" }), _jsx(TableHead, { children: "Coeficiente" }), _jsx(TableHead, { children: "Tipo" })] }) }), _jsx(TableBody, { children: attendees.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 3, className: "text-center", children: "No hay asistentes registrados" }) })) : (attendees.map((attendee) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: attendee.propertyUnit }), _jsxs(TableCell, { children: [attendee.coefficient, "%"] }), _jsx(TableCell, { children: _jsx(Badge, { variant: attendee.attendanceType === 'PRESENT' ? 'default' :
                                                                            attendee.attendanceType === 'PROXY' ? 'secondary' : 'outline', children: attendee.attendanceType === 'PRESENT' ? 'Presente' :
                                                                            attendee.attendanceType === 'PROXY' ? 'Poder' : 'Virtual' }) })] }, attendee.id)))) })] }) }) })] })] }), _jsxs("div", { className: "md:col-span-8", children: [activeVoting && (_jsxs(Card, { className: "mb-3 border-primary", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsxs(CardTitle, { className: "text-lg flex items-center", children: [_jsx(HowToVoteIcon, { className: "mr-2 h-5 w-5 text-primary" }), "Votaci\u00F3n en curso: ", activeVoting.title] }), _jsx(Button, { variant: "destructive", size: "sm", onClick: () => handleCloseVoting(activeVoting.id), children: "Cerrar Votaci\u00F3n" })] }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-sm mb-2", children: activeVoting.description || 'Sin descripción' }), _jsxs("div", { className: "mt-2 mb-2 text-sm", children: [_jsxs("p", { children: [_jsx("strong", { children: "Tipo:" }), " ", activeVoting.type === 'SIMPLE_MAJORITY' ? 'Mayoría simple' :
                                                                activeVoting.type === 'QUALIFIED_MAJORITY' ? 'Mayoría calificada' :
                                                                    activeVoting.type === 'UNANIMOUS' ? 'Unanimidad' : 'Basado en coeficientes'] }), _jsxs("p", { children: [_jsx("strong", { children: "Opciones:" }), " ", activeVoting.options.join(', ')] }), _jsxs("p", { children: [_jsx("strong", { children: "Votos emitidos:" }), " ", activeVoting.totalVotes || 0] })] }), _jsx(Progress, { value: 50, className: "h-2" }), " "] })] })), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Votaciones" }), assembly.status === 'IN_PROGRESS' && (_jsxs(Button, { variant: "default", size: "sm", onClick: () => setCreateVotingOpen(true), disabled: !!activeVoting, children: [_jsx(AddIcon, { className: "mr-2 h-4 w-4" }), "Nueva Votaci\u00F3n"] }))] }), _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "T\u00EDtulo" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Estado" }), _jsx(TableHead, { children: "Resultado" }), _jsx(TableHead, { children: "Acciones" })] }) }), _jsx(TableBody, { children: votings.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, className: "text-center", children: "No hay votaciones registradas" }) })) : (votings.map((voting) => (_jsxs(TableRow, { children: [_jsxs(TableCell, { children: [_jsx("p", { className: "font-medium", children: voting.title }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Punto ", voting.agendaPoint] })] }), _jsx(TableCell, { children: voting.type === 'SIMPLE_MAJORITY' ? 'Mayoría simple' :
                                                                        voting.type === 'QUALIFIED_MAJORITY' ? 'Mayoría calificada' :
                                                                            voting.type === 'UNANIMOUS' ? 'Unanimidad' : 'Coeficientes' }), _jsx(TableCell, { children: _jsx(Badge, { variant: voting.status === 'PENDING' ? 'secondary' :
                                                                            voting.status === 'ACTIVE' ? 'default' :
                                                                                voting.status === 'CLOSED' ? 'success' : 'destructive', children: voting.status === 'PENDING' ? 'Pendiente' :
                                                                            voting.status === 'ACTIVE' ? 'Activa' :
                                                                                voting.status === 'CLOSED' ? 'Cerrada' : 'Cancelada' }) }), _jsx(TableCell, { children: voting.status === 'CLOSED' ? (_jsx(Badge, { variant: voting.isApproved ? 'default' : 'destructive', children: voting.isApproved ? 'Aprobado' : 'Rechazado' })) : ('—') }), _jsxs(TableCell, { children: [voting.status === 'PENDING' && (_jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleStartVoting(voting.id), disabled: !!activeVoting, children: _jsx(StartIcon, { className: "h-4 w-4" }) })), voting.status === 'CLOSED' && (_jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleViewResults(voting), children: _jsx(InfoIcon, { className: "h-4 w-4" }) }))] })] }, voting.id)))) })] }) }) })] })] })] }), createVotingOpen && (_jsx(Dialog, { open: createVotingOpen, onOpenChange: setCreateVotingOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Crear Nueva Votaci\u00F3n" }), _jsx(DialogDescription, { children: "Configure los detalles de la nueva votaci\u00F3n." })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "title", className: "text-right", children: "T\u00EDtulo" }), _jsx(Input, { id: "title", name: "title", className: "col-span-3" })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "description", className: "text-right", children: "Descripci\u00F3n" }), _jsx(Textarea, { id: "description", name: "description", className: "col-span-3" })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", onClick: () => setCreateVotingOpen(false), children: "Cancelar" }), _jsx(Button, { type: "submit", onClick: () => handleCreateVoting({ /* form data */}), children: "Crear Votaci\u00F3n" })] })] }) })), viewResultsOpen && selectedVoting && (_jsx(Dialog, { open: viewResultsOpen, onOpenChange: setViewResultsOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { children: ["Resultados de Votaci\u00F3n: ", selectedVoting.title] }), _jsx(DialogDescription, { children: "Detalles y resultados de la votaci\u00F3n." })] }), _jsx("div", { className: "py-4", children: _jsxs("p", { children: [_jsx("strong", { children: "Total Votos:" }), " ", selectedVoting.totalVotes] }) }), _jsx(DialogFooter, { children: _jsx(Button, { onClick: () => setViewResultsOpen(false), children: "Cerrar" }) })] }) }))] }));
};
export default AssemblyLiveView;
