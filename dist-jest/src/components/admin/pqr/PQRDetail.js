"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clock, User, Home, CheckCircle, XCircle, SendHorizontal, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
export default function PQRDetail({ pqr, comments, onBack, onUpdateStatus, onAssign, onAddComment, users, language }) {
    const [newComment, setNewComment] = useState('');
    const [isInternalComment, setIsInternalComment] = useState(false);
    const [selectedUser, setSelectedUser] = useState(pqr.assignedTo || '');
    // Helper functions to render badges with appropriate colors
    const renderStatusBadge = (status) => {
        let bgColor = '';
        let textColor = '';
        let label = '';
        switch (status) {
            case 'NEW':
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                label = language === 'Español' ? 'Nuevo' : 'New';
                break;
            case 'IN_PROGRESS':
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-800';
                label = language === 'Español' ? 'En Progreso' : 'In Progress';
                break;
            case 'RESOLVED':
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                label = language === 'Español' ? 'Resuelto' : 'Resolved';
                break;
            case 'CLOSED':
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
                label = language === 'Español' ? 'Cerrado' : 'Closed';
                break;
            case 'CANCELLED':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                label = language === 'Español' ? 'Cancelado' : 'Cancelled';
                break;
            default:
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
                label = status;
        }
        return _jsx(Badge, { className: `${bgColor} ${textColor}`, children: label });
    };
    const renderPriorityBadge = (priority) => {
        let bgColor = '';
        let textColor = '';
        let label = '';
        switch (priority) {
            case 'LOW':
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                label = language === 'Español' ? 'Baja' : 'Low';
                break;
            case 'MEDIUM':
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                label = language === 'Español' ? 'Media' : 'Medium';
                break;
            case 'HIGH':
                bgColor = 'bg-orange-100';
                textColor = 'text-orange-800';
                label = language === 'Español' ? 'Alta' : 'High';
                break;
            case 'URGENT':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                label = language === 'Español' ? 'Urgente' : 'Urgent';
                break;
            default:
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
                label = priority;
        }
        return _jsx(Badge, { className: `${bgColor} ${textColor}`, children: label });
    };
    const renderTypeBadge = (type) => {
        let bgColor = '';
        let textColor = '';
        let label = '';
        switch (type) {
            case 'PETITION':
                bgColor = 'bg-indigo-100';
                textColor = 'text-indigo-800';
                label = language === 'Español' ? 'Petición' : 'Petition';
                break;
            case 'COMPLAINT':
                bgColor = 'bg-purple-100';
                textColor = 'text-purple-800';
                label = language === 'Español' ? 'Queja' : 'Complaint';
                break;
            case 'CLAIM':
                bgColor = 'bg-pink-100';
                textColor = 'text-pink-800';
                label = language === 'Español' ? 'Reclamo' : 'Claim';
                break;
            default:
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
                label = type;
        }
        return _jsx(Badge, { className: `${bgColor} ${textColor}`, children: label });
    };
    // Handler for changing PQR status
    const handleStatusChange = (status) => {
        onUpdateStatus(pqr.id, status);
    };
    // Handler for changing assignment
    const handleAssignmentChange = (userId) => {
        setSelectedUser(userId);
        onAssign(pqr.id, userId);
    };
    // Handler for adding a comment
    const handleAddComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment, isInternalComment);
            setNewComment('');
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Button, { variant: "outline", onClick: onBack, className: "mb-4", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), language === 'Español' ? 'Volver' : 'Back'] }), _jsx("div", { className: "space-x-2", children: pqr.status !== 'CLOSED' && pqr.status !== 'CANCELLED' && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", className: "border-yellow-500 text-yellow-600 hover:bg-yellow-50", onClick: () => handleStatusChange(pqr.status === 'NEW' ? 'IN_PROGRESS' : 'NEW'), children: pqr.status === 'NEW'
                                        ? language === 'Español' ? 'Iniciar' : 'Start'
                                        : language === 'Español' ? 'Marcar como nuevo' : 'Mark as new' }), _jsxs(Button, { variant: "outline", className: "border-green-500 text-green-600 hover:bg-green-50", onClick: () => handleStatusChange('RESOLVED'), children: [_jsx(CheckCircle, { className: "mr-2 h-4 w-4" }), language === 'Español' ? 'Resolver' : 'Resolve'] }), _jsx(Button, { variant: "outline", className: "border-gray-500 text-gray-600 hover:bg-gray-50", onClick: () => handleStatusChange('CLOSED'), children: language === 'Español' ? 'Cerrar' : 'Close' }), _jsxs(Button, { variant: "outline", className: "border-red-500 text-red-600 hover:bg-red-50", onClick: () => handleStatusChange('CANCELLED'), children: [_jsx(XCircle, { className: "mr-2 h-4 w-4" }), language === 'Español' ? 'Cancelar' : 'Cancel'] })] })) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex space-x-2 mb-2", children: [renderTypeBadge(pqr.type), renderStatusBadge(pqr.status), renderPriorityBadge(pqr.priority)] }), _jsx(CardTitle, { className: "text-2xl", children: pqr.title })] }), _jsxs("div", { className: "text-right text-sm text-gray-500", children: [_jsxs("div", { className: "flex items-center justify-end mb-1", children: [_jsx(Clock, { className: "mr-1 h-4 w-4" }), _jsx("span", { children: new Date(pqr.createdAt).toLocaleString() })] }), pqr.propertyUnit && (_jsxs("div", { className: "flex items-center justify-end mb-1", children: [_jsx(Home, { className: "mr-1 h-4 w-4" }), _jsx("span", { children: pqr.propertyUnit })] })), pqr.residentName && (_jsxs("div", { className: "flex items-center justify-end", children: [_jsx(User, { className: "mr-1 h-4 w-4" }), _jsx("span", { children: pqr.residentName })] }))] })] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md", children: _jsx("p", { className: "whitespace-pre-line", children: pqr.description }) }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: language === 'Español' ? 'Asignación' : 'Assignment' }), _jsxs("div", { className: "flex items-center", children: [_jsxs(Select, { value: selectedUser, onValueChange: handleAssignmentChange, children: [_jsx(SelectTrigger, { className: "w-full max-w-xs", children: _jsx(SelectValue, { placeholder: language === 'Español' ? 'Seleccionar responsable' : 'Select assignee' }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: language === 'Español' ? '-- Sin asignar --' : '-- Unassigned --' }), users.map(user => (_jsx(SelectItem, { value: user.name, children: user.name }, user.id)))] })] }), _jsx("span", { className: "ml-2", children: pqr.assignedTo ? (_jsx("span", { className: "text-green-600", children: language === 'Español'
                                                        ? `Asignado a ${pqr.assignedTo}`
                                                        : `Assigned to ${pqr.assignedTo}` })) : (_jsx("span", { className: "text-gray-500 italic", children: language === 'Español'
                                                        ? 'Esta solicitud no está asignada'
                                                        : 'This request is not assigned' })) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: language === 'Español' ? 'Comentarios' : 'Comments' }), _jsx("div", { className: "space-y-4 mb-6", children: comments.length === 0 ? (_jsx("p", { className: "text-gray-500 italic", children: language === 'Español'
                                                ? 'No hay comentarios aún'
                                                : 'No comments yet' })) : (comments.map(comment => (_jsxs("div", { className: `p-4 rounded-lg ${comment.isInternal
                                                ? 'bg-yellow-50 border border-yellow-200'
                                                : 'bg-blue-50 border border-blue-200'}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("span", { className: "font-medium", children: comment.createdBy }), _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-3 w-3 mr-1 text-gray-500" }), _jsx("span", { className: "text-xs text-gray-500", children: new Date(comment.createdAt).toLocaleString() }), comment.isInternal && (_jsx(Badge, { className: "ml-2 bg-yellow-100 text-yellow-800", children: language === 'Español' ? 'Interno' : 'Internal' }))] })] }), _jsx("p", { className: "whitespace-pre-line", children: comment.content })] }, comment.id)))) }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "newComment", children: language === 'Español' ? 'Agregar comentario' : 'Add comment' }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Switch, { id: "internalComment", checked: isInternalComment, onCheckedChange: setIsInternalComment }), _jsx(Label, { htmlFor: "internalComment", className: "cursor-pointer", children: language === 'Español' ? 'Comentario interno' : 'Internal comment' }), isInternalComment && (_jsx(AlertTriangle, { className: "h-4 w-4 text-yellow-500" }))] })] }), _jsx(Textarea, { id: "newComment", value: newComment, onChange: (e) => setNewComment(e.target.value), placeholder: language === 'Español'
                                                    ? 'Escribe tu comentario aquí...'
                                                    : 'Write your comment here...', className: "min-h-[100px]" }), _jsx("div", { className: "flex justify-end", children: _jsxs(Button, { onClick: handleAddComment, className: "bg-indigo-600 hover:bg-indigo-700", disabled: !newComment.trim(), children: [_jsx(SendHorizontal, { className: "mr-2 h-4 w-4" }), language === 'Español' ? 'Enviar' : 'Send'] }) })] })] })] })] })] }));
}
