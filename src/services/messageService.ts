import { fetchApi } from "@/lib/api";

interface MessageData {
  recipient: string;
  messageContent: string;
}

export async function sendMessage(data: MessageData): Promise<void> {
  try {
    await fetchApi("/communications/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}