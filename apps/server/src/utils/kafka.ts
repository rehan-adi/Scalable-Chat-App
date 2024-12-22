import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9093"],
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
  console.log(`Message sent: ${message}`);
};

export const KafkaConsumer = async () => {
  const consumer = kafka.consumer({ groupId: "message-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      console.log(`Received message: ${message.value.toString()}`);
    },
  });
};
