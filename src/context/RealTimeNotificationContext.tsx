"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import io, { Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: string; // e.g., 'success', 'info', 'warning', 'error'
  link?: string;
  createdAt: string;
}

interface RealTimeNotificationContextType {
  socket: Socket | null;
  notifications: NotificationPayload[];
  markNotificationAsRead: (id: string) => void;
}

const RealTimeNotificationContext = createContext<
  RealTimeNotificationContextType | undefined
>(undefined);

export const RealTimeNotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

  useEffect(() => {
    if (user) {
      const newSocket = io(`${SOCKET_URL}/notifications`, {
        query: { userId: user.id },
      });

      newSocket.on("connect", () => {
        console.log("Connected to notification socket");
      });

      newSocket.on(
        "receiveNotification",
        (notification: NotificationPayload) => {
          console.log("Received real-time notification:", notification);
          setNotifications((prev) => [notification, ...prev]);
          toast({
            title: notification.title,
            description: notification.message,
            variant: notification.type === "error" ? "destructive" : "default",
          });
        },
      );

      newSocket.on("disconnect", () => {
        console.log("Disconnected from notification socket");
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [user, toast]);

  const markNotificationAsRead = (id: string) => {
    // Implement logic to mark as read, potentially calling a backend API
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
    // TODO: Call backend API to persist read status
  };

  return (
    <RealTimeNotificationContext.Provider
      value={{ socket, notifications, markNotificationAsRead }}
    >
      {children}
    </RealTimeNotificationContext.Provider>
  );
};

export const useRealTimeNotifications = () => {
  const context = useContext(RealTimeNotificationContext);
  if (context === undefined) {
    throw new Error(
      "useRealTimeNotifications must be used within a RealTimeNotificationProvider",
    );
  }
  return context;
};
