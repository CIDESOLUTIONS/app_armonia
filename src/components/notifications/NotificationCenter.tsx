
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bell, 
  Send, 
  Users, 
  User,
  MessageSquare,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { useNotifications, NotificationTarget } from '@/hooks/useNotifications';
import { useAuthStore } from '@/store/authStore';

interface NotificationCenterProps {
  complexId?: number;
}

export function NotificationCenter({ complexId }: NotificationCenterProps) {
  const { user } = useAuthStore();
  const {
    loading,
    error,
    templates,
    history,
    sendNotification,
    sendTemplateNotification,
    loadTemplates,
    loadHistory,
    sendPaymentReminder,
    sendAssemblyInvitation,
    sendIncidentUpdate,
    sendPQRResponse,
    sendGeneralAnnouncement
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('quick');
  const [quickForm, setQuickForm] = useState({
    title: '',
    message: '',
    target: 'all',
    priority: 'normal'
  });
  const [templateForm, setTemplateForm] = useState({
    type: '',
    data: {} as Record<string, any>,
    target: 'all'
  });
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

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

  const handleQuickSend = async () => {
    if (!quickForm.title || !quickForm.message) {
      return;
    }

    const target: NotificationTarget = quickForm.target === 'all' 
      ? { all: true }
      : { role: quickForm.target as any };

    const success = await sendNotification(
      {
        title: quickForm.title,
        body: quickForm.message,
        icon: '/icons/notification.png'
      },
      target,
      {
        priority: quickForm.priority as 'normal' | 'high',
        requireInteraction: quickForm.priority === 'high'
      }
    );

    if (success) {
      setSendSuccess('Notificación rápida enviada con éxito.');
      setQuickForm({ title: '', message: '', target: 'all', priority: 'normal' });
    }
  };
  
  return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle className="flex items-center">
                <Bell className="mr-2" />
                Centro de Notificaciones
            </CardTitle>
            <CardDescription>
                Envía y gestiona notificaciones para los residentes y el personal.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p>Contenido del centro de notificaciones</p>
        </CardContent>
    </Card>
  );
}
