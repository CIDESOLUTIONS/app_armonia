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

interface CreateConversationData {
  participantIds: number[];
  type: "direct" | "group";
  name?: string; // For group chats
}

export async function getConversations(): Promise<Conversation[]> {
  try {
    const response = await fetchApi("/communications/conversations");
    return response.data; // Assuming the API returns { data: Conversation[] }
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
    return response.data; // Assuming the API returns { data: Message[] }
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
    return response.data; // Assuming the API returns { data: Message }
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

export async function createConversation(
  data: CreateConversationData,
): Promise<Conversation> {
  try {
    const response = await fetchApi("/communications/conversations", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: Conversation }
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
}

// Funciones movidas de messageService.ts
interface MarketplaceMessageData {
  listingId: number;
  senderId: number;
  receiverId: number;
  content: string;
}

interface MarketplaceMessage {
  id: number;
  listingId: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

export async function sendMarketplaceMessage(
  data: MarketplaceMessageData,
): Promise<void> {
  try {
    await fetchApi("/marketplace/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error sending marketplace message:", error);
    throw error;
  }
}

export async function getMarketplaceMessages(
  listingId: number,
  userId: number,
): Promise<MarketplaceMessage[]> {
  try {
    const response = await fetchApi(
      `/marketplace/messages/${listingId}/${userId}`,
    );
    return response.data; // Assuming the API returns { data: MarketplaceMessage[] }
  } catch (error) {
    console.error("Error fetching marketplace messages:", error);
    throw error;
  }
}
