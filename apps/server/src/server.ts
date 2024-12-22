import env from "dotenv";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { KafkaProducer } from "./utils/kafka";
import { Publisher, Subscriber } from "./utils/redis";

env.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

app.get("/", (req, res) => {
  res.send("Socket server is running");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("message", async (data) => {
    Publisher.publish("messages", JSON.stringify(data));
    await KafkaProducer(data);
    console.log("Received message:", data);
  });
});

Subscriber.subscribe("messages", (err, count) => {
  if (err) {
    console.error("Error subscribing to Redis:", err);
  } else {
    console.log(`Subscribed to ${count} channel(s)`);
  }
});

Subscriber.on("message", (channel, message) => {
  if (channel === "messages") {
    console.log("Message received from Redis:", message);
    io.emit("message", JSON.parse(message));
  }
});

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
  console.log(`Server running at:`);
  console.log(`- HTTP URL: http://localhost:${PORT}`);
  console.log(`- Socket.IO URL: ws://localhost:${PORT}`);
});
