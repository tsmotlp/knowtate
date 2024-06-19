"use client";

import { ElementRef, useEffect, useRef } from "react";

import { ChatMessage, ChatMessageProps } from "./chat-message";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
}

export const ChatMessages = ({
  messages = [],
  isLoading,
}: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<"div">>(null);
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 h-[calc(100vh-10rem)] overflow-y-auto pr-4 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          content={message.content}
          role={message.role}
        />
      ))}
      {isLoading && (
        <ChatMessage role="assistant" isLoading />
      )}
      <div ref={scrollRef} />
    </div>
  );
};
