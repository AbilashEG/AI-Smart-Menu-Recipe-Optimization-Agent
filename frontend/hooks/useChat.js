"use client";
import { useState } from "react";
import { askQuestion } from "@/utils/api";

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const sendMessage = async (question) => {
    if (!question.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const data = await askQuestion(question);
      setMessages((prev) => [...prev, { role: "ai", content: data.analysis }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    isChatOpen,
    inputValue,
    openChat,
    closeChat,
    setInputValue,
    sendMessage,
  };
}
