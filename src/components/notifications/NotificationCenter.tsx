"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/authStore";

interface NotificationCenterProps {
  complexId?: number;
}

export function NotificationCenter({
  complexId: _complexId,
}: NotificationCenterProps) {
  const { user: _user } = useAuthStore();
  const { loadTemplates, loadHistory } = useNotifications();

  const [_quickForm, _setQuickForm] = useState({
    title: "",
    message: "",
    target: "all",
    priority: "normal",
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

  /*
  TODO: Implement the form UI to use this function.
  This function is ready but commented out to prevent linting errors
  as the UI elements that trigger it are not yet implemented.
  
  const handleQuickSend = async () => {
    if (!_quickForm.title || !_quickForm.message) {
      return;
    }

    const target: NotificationTarget =
      _quickForm.target === "all"
        ? { all: true }
        : { role: _quickForm.target as any };

    const success = await sendNotification(
      {
        title: _quickForm.title,
        body: _quickForm.message,
        icon: "/icons/notification.png",
      },
      target,
      {
        priority: _quickForm.priority as "normal" | "high",
        requireInteraction: _quickForm.priority === "high",
      },
    );

    if (success) {
      setSendSuccess("Notificación rápida enviada con éxito.");
      _setQuickForm({
        title: "",
        message: "",
        target: "all",
        priority: "normal",
      });
    }
  };
  */

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
