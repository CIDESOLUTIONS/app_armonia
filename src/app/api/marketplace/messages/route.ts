
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { listingId, senderId, receiverId, content } = await req.json();

    if (!listingId || !senderId || !receiverId || !content) {
      return new NextResponse("Faltan campos requeridos", { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        listingId,
        senderId,
        receiverId,
        content,
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("[SEND_MESSAGE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
