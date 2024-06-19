"use client";

import { BeatLoader } from "react-spinners";
import { Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export interface ChatMessageProps {
  role: string;
  content?: string;
  isLoading?: boolean;
}

export const ChatMessage = ({ role, content, isLoading }: ChatMessageProps) => {
  const onCopy = () => {
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content);
    toast("", {
      description: "Message copied to clipboard.",
      duration: 3000,
    });
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-x-3 py-4 w-full",
        role === "user" && "justify-end",
      )}
    >
      {role !== "user" && (
        <Avatar className="h-10 w-10">
          <AvatarImage src="/bot.svg" />
        </Avatar>
      )}
      <div className="rounded-md px-4 py-2 max-w-xl text-sm bg-primary/10 markdown-container">
        {isLoading ? (
          <BeatLoader color="black" size={5} />
        ) : (
          <ReactMarkdown
            components={{
              pre: ({ node, ...props }) => (
                <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                  <pre {...props} />
                </div>
              ),
              code: ({ node, ...props }) => (
                <code className="bg-black/10 rounded-lg p-1" {...props} />
              ),
            }}
            className="text-sm overflow-hidden leading-7"
          >
            {content || ""}
          </ReactMarkdown>
        )}
      </div>
      {role === "user" && (
        <Avatar className="h-10 w-10">
          <AvatarImage src="/user.svg" />
        </Avatar>
      )}
      {role !== "user" && !isLoading && (
        <Button
          onClick={onCopy}
          className="opacity-0 group-hover:opacity-100 transition"
          size="icon"
          variant="ghost"
        >
          <Copy className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
