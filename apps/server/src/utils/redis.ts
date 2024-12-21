import { Redis } from "ioredis";

export const Publisher = new Redis({
  host: process.env.HOST,
  username: process.env.USERNAME,
  port: Number(process.env.PORT),
  password: process.env.PASSWORD,
});

export const Subscriber = new Redis({
  host: process.env.HOST,
  username: process.env.USERNAME,
  port: Number(process.env.PORT),
  password: process.env.PASSWORD,
});

Publisher.on("error", (err) => {
  console.error("Error with Redis Publisher:", err);
});

Subscriber.on("error", (err) => {
  console.error("Error with Redis Subscriber:", err);
});
