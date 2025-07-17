import { fetchApi } from "@/lib/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

interface SendNotificationData {
  title: string;
  message: string;
  recipientType: "ALL" | "RESIDENT" | "PROPERTY" | "USER";
  recipientId?: string;
}

export async function sendNotification(data: SendNotificationData): Promise<Notification> {
  try {
    const response = await fetchApi("/communications/notifications/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

export async function getUserNotifications(): Promise<Notification[]> {
  try {
    const response = await fetchApi("/communications/notifications");
    return response;
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    throw error;
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    await fetchApi(`/communications/notifications/mark-read/${id}`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await fetchApi("/communications/notifications/mark-all-read", {
      method: "POST",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}