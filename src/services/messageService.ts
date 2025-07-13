import { fetchApi } from "@/lib/api";

interface SendMessageData {
  recipient: string;
  messageContent: string;
}

export async function sendMessage(data: SendMessageData): Promise<any> {
  try {
    const response = await fetchApi("/api/communications/send-message", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
