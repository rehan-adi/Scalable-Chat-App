import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

app.get("/", (req, res) => {
  res.send("Socket.IO server is running");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("message", (data) => {
    console.log("Received message:", data);
    io.emit("message", data);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running at:`);
  console.log(`- HTTP URL: http://localhost:${PORT}`);
  console.log(`- Socket.IO URL: ws://localhost:${PORT}`);
});
