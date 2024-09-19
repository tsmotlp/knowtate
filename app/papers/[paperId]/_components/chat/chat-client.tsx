"use client";
import { FormEvent, useState } from "react";
import { ChatForm } from "./chat-form";
import { ChatMessages } from "./chat-messages";
import { useRouter } from "next/navigation";
import { ChatMessageProps } from "./chat-message";
import Image from "next/image";
import { HISTORY_MESSAGE_N } from "@/constants";
import { Message } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";

interface ChatClientProps {
  paperId: string
  paperUrl: string,
  messages: Message[]
}

export const ChatClient = ({
  paperId,
  paperUrl,
  messages
}: ChatClientProps) => {
  const router = useRouter();
  const [historyMessages, setHistoryMessages] = useState<ChatMessageProps[]>(messages)
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 使用 isLoading 状态
  const handleStream = async () => {
    let fullMessage = ''; // 用来累积完整的消息
    try {
      setIsLoading(true)
      const data = {
        paperId: paperId,
        paperUrl: paperUrl,
        prompt: input,
        prevMessages: historyMessages.slice(-1 * HISTORY_MESSAGE_N),
      }
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder("utf-8");

      const userMessage: ChatMessageProps = {
        role: "user",
        content: input
      }
      setHistoryMessages((current) => [...current, userMessage])
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true }); // 确保文本流不会被截断
        // 解析并处理数据
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.trim() === '') continue;
          // 根据实际数据格式选择解析方式
          const match = line.match(/^0:"(.*)"$/);

          if (match) {
            const content = match[1];
            fullMessage += content;

            setHistoryMessages((current) => {
              const lastMessage = current[current.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                return current.slice(0, -1).concat({ ...lastMessage, content: fullMessage });
              }
              return current.concat({ role: 'assistant', content: fullMessage });
            });
          } else {
            console.warn('Unrecognized line format:', line);
          }
        }
      }
      await axios.post("/api/message", {
        paperId: paperId,
        role: "assistant",
        content: fullMessage,
      })
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
      router.refresh()
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios.post("/api/message", JSON.stringify({
      paperId: paperId,
      role: "user",
      content: input,
    }))
    await handleStream(); // 等待处理新消息
    setInput(''); // 清空输入框
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    // 函数实现
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col justify-between p-4 space-y-2 h-full w-full">
      <div className="flex-1 overflow-y-auto">
        <ChatMessages isLoading={isLoading} messages={messages} />
      </div>
      <div className="mt-auto">
        <ChatForm
          isLoading={isLoading}
          input={input}
          handleInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
