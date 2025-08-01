import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer);

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

  const port = 3000;
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
