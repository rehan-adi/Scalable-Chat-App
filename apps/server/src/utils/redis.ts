import { Redis } from "ioredis";

export const Publisher = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const Subscriber = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
});

Publisher.on("error", (err) => {
  console.error("Error with Redis Publisher:", err);
});

Subscriber.on("error", (err) => {
  console.error("Error with Redis Subscriber:", err);
});
