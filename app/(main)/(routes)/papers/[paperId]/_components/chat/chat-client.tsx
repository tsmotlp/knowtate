"use client";
import { useCompletion } from "ai/react";
import { FormEvent, useEffect, useState } from "react";
import { ChatForm } from "./chat-form";
import { ChatMessages } from "./chat-messages";
import { useRouter } from "next/navigation";
import { ChatMessageProps } from "./chat-message";
import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { HISTORY_MESSAGE_N } from "@/constants";

interface ChatClientProps {
  paper: Doc<"files">
}

export const ChatClient = ({ paper }: ChatClientProps) => {
  const router = useRouter();
  const createMessage = useMutation(api.message.createMessage)
  const historyMessages = useQuery(api.message.getLimitedMessages, { limit: HISTORY_MESSAGE_N })
  const prevMessages: ChatMessageProps[] | undefined = historyMessages?.map((message) => (
    {
      role: message.role,
      content: message.content
    }
  ))

  console.log("Prevmessages", prevMessages)

  const [messages, setMessages] = useState<ChatMessageProps[]>([]);

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/message`,
      body: {
        url: paper.url,
        key: paper.key,
        prompt: prompt,
        prevMessages: prevMessages,
      },
      onFinish(_prompt, completion) {
        createMessage({
          role: "assistant",
          content: completion,
        })
          .then((messageId) => {
            const assistantMessage: ChatMessageProps = {
              role: "assistant",
              content: completion,
            }
            setMessages((current) => [...current, assistantMessage]);
            setInput("");

            router.refresh();
          })
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    createMessage({
      role: "assistant",
      content: input,
    })
      .then((messageId) => {
        const userMessage: ChatMessageProps = {
          role: "user",
          content: input,
        }
        setMessages((current) => [...current, userMessage]);
        handleSubmit(e);
      })
  };

  // useEffect(() => {
  //   setMessages(prevMessages && prevMessages.length > 0 ? prevMessages : [])
  // }, [prevMessages])

  return (
    <div className="flex flex-col justify-between p-4 space-y-2 h-full w-full">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-[calc(100vh-15rem)] flex flex-col items-center justify-center space-y-4">
            <Image
              src="/note.svg"
              height="300"
              width="300"
              alt="Empty"
              className="dark:hidden"
            />
            <Image
              src="/note-dark.svg"
              height="300"
              width="300"
              alt="Empty"
              className="hidden dark:block"
            />
            <h2 className="text-lg font-medium text-center">
              There is no chat message associated to the paper
            </h2>
          </div>
        ) : (
          <ChatMessages isLoading={isLoading} messages={messages} />
        )}
      </div>
      <div className="mt-auto">
        <ChatForm
          isLoading={isLoading}
          input={input}
          handleInputChange={handleInputChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};
