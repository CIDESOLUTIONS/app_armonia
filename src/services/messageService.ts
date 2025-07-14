import { prisma } from "@/lib/prisma";

export async function getMessages(listingId: number, userId: number) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        listingId: listingId,
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("No se pudieron obtener los mensajes.");
  }
}

export async function sendMessage(data: {
  listingId: number;
  senderId: number;
  receiverId: number;
  content: string;
}) {
  try {
    const newMessage = await prisma.message.create({
      data,
    });
    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("No se pudo enviar el mensaje.");
  }
}