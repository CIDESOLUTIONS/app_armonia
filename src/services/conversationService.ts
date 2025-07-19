import { fetchApi } from "@/lib/api";

interface Conversation {
  id: string;
  type: string;
  participants: { userId: number; name: string; image?: string }[];
  lastMessage?: { content: string; createdAt: string };
  unreadCount?: number;
  updatedAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
  read: boolean;
  attachments?: any[];
}

interface CreateMessageData {
  content: string;
  attachments?: any[];
}

export async function getConversations(): Promise<Conversation[]> {
  try {
    const response = await fetchApi("/communications/conversations");
    return response;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
}

export async function getConversationMessages(
  conversationId: string,
): Promise<Message[]> {
  try {
    const response = await fetchApi(
      `/communications/conversations/${conversationId}/messages`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    throw error;
  }
}

export async function sendMessage(
  conversationId: string,
  data: CreateMessageData,
): Promise<Message> {
  try {
    const response = await fetchApi(
      `/communications/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function markMessageAsRead(
  conversationId: string,
  messageId: string,
): Promise<void> {
  try {
    await fetchApi(
      `/communications/conversations/${conversationId}/messages/${messageId}/read`,
      {
        method: "POST",
      },
    );
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
}
