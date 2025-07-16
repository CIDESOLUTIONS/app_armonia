import { fetchApi } from "@/lib/api";

interface MessageData {
  listingId: number;
  senderId: number;
  receiverId: number;
  content: string;
}

interface Message {
  id: number;
  listingId: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

export async function sendMessage(data: MessageData): Promise<void> {
  try {
    await fetchApi("/marketplace/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function getMessages(
  listingId: number,
  userId: number,
): Promise<Message[]> {
  try {
    const response = await fetchApi(
      `/marketplace/messages/${listingId}/${userId}`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}
