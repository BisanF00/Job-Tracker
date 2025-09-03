import { useState } from "react";
import { chat } from "../Component/AI/Api";

export default function useChat() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "You are a career advisor chatbot. Answer only career or job-related questions. Be motivational and practical.",
    },
  ]);

  async function sendMessage(text) {
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);

    try {
      const reply = await chat(newMessages);

      console.log("Result from chat():", reply);

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: reply },
      ]);
    } catch (error) {
      console.log(error);
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: "Error: could not get a response." },
      ]);
    }
  }

  return { messages, sendMessage };
}
