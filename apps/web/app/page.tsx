"use client";

import { Send } from "lucide-react";
import { socket } from "../utils/socket";
import { useEffect, useState } from "react";

export default function Chat() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    socket.connect();
    setConnected(true);

    socket.on("message", (message: string) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    socket.emit("message", inputMessage);

    // setMessages((prev) => [...prev, inputMessage]);
    setInputMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      {/* Chat Container */}
      <div className="flex flex-col w-full max-w-2xl h-full bg-black rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">Chat Room</h1>
          <div
            className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-white">
          {messages.map((message, index) => (
            <div key={index} className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-700 text-white">
                <p>{message}</p>
                <p className="text-xs opacity-50 mt-1">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-3 rounded-lg bg-white text-black focus:outline-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
