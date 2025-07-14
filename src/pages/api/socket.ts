import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

const SocketHandler = (
  req: NextApiRequest,
  res: NextApiResponse & { socket: any },
) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("joinChat", ({ listingId, userId }) => {
        const roomName = `listing-${listingId}`;
        socket.join(roomName);
        console.log(`User ${userId} joined room ${roomName}`);
      });

      socket.on("sendMessage", (message) => {
        const roomName = `listing-${message.listingId}`;
        io.to(roomName).emit("receiveMessage", message);
        console.log(`Message sent to room ${roomName}:`, message);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
  res.end();
};

export default SocketHandler;
