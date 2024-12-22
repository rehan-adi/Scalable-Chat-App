import prisma from "./prisma";
import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:29092"],
  retry: {
    initialRetryTime: 100,
    maxRetryTime: 30000,
    retries: 10,
    factor: 0.2,
  },
});

let producer: null | Producer = null;

export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export const KafkaProducer = async (message: string) => {
  const producer = await createProducer();

  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });
  console.log(`Message sent to kafka topic: ${message}`);
};

export const KafkaConsumer = async () => {
  const consumer = kafka.consumer({ groupId: "message-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      try {
        await prisma.message.create({
          data: {
            message: message.value?.toString(),
          },
        });
        console.log("Message added successfully to the database");
      } catch (error) {
        console.log("Failed to add message");
      }
    },
  });
};
