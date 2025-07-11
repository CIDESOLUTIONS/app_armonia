'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuthStore } from '@/store/authStore';
export function NotificationCenter({ complexId }) {
    const { user } = useAuthStore();
    const { loading, error, templates, history, sendNotification, sendTemplateNotification, loadTemplates, loadHistory, sendPaymentReminder, sendAssemblyInvitation, sendIncidentUpdate, sendPQRResponse, sendGeneralAnnouncement } = useNotifications();
    const [activeTab, setActiveTab] = useState('quick');
    const [quickForm, setQuickForm] = useState({
        title: '',
        message: '',
        target: 'all',
        priority: 'normal'
    });
    const [templateForm, setTemplateForm] = useState({
        type: '',
        data: {},
        target: 'all'
    });
    const [sendSuccess, setSendSuccess] = useState(null);
    useEffect(() => {
        loadTemplates();
        loadHistory();
    }, [loadTemplates, loadHistory]);
    useEffect(() => {
        if (sendSuccess) {
            const timer = setTimeout(() => setSendSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [sendSuccess]);
    const handleQuickSend = () => __awaiter(this, void 0, void 0, function* () {
        if (!quickForm.title || !quickForm.message) {
            return;
        }
        const target = quickForm.target === 'all'
            ? { all: true }
            : { role: quickForm.target };
        const success = yield sendNotification({
            title: quickForm.title,
            body: quickForm.message,
            icon: '/icons/notification.png'
        }, target, {
            priority: quickForm.priority,
            requireInteraction: quickForm.priority === 'high'
        });
        if (success) {
            setSendSuccess('Notificación rápida enviada con éxito.');
            setQuickForm({ title: '', message: '', target: 'all', priority: 'normal' });
        }
    });
    return (_jsxs(Card, { className: "w-full", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Bell, { className: "mr-2" }), "Centro de Notificaciones"] }), _jsx(CardDescription, { children: "Env\u00EDa y gestiona notificaciones para los residentes y el personal." })] }), _jsx(CardContent, { children: _jsx("p", { children: "Contenido del centro de notificaciones" }) })] }));
}
