import cors from "cors";
import env from "dotenv";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { Publisher, Subscriber } from "./utils/redis";
import { KafkaProducer, KafkaConsumer } from "./utils/kafka";

env.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "OK" });
});

KafkaConsumer();

// Socket.IO events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("message", async (data) => {
    Publisher.publish("messages", JSON.stringify(data));
    await KafkaProducer(data);
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
