"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatRequestOptions } from "ai";
import { SendHorizonal } from "lucide-react";
import { ChangeEvent, FormEvent } from "react";

interface ChatFormProps {
  input: string;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined,
  ) => void;
  isLoading: boolean;
}

export const ChatForm = ({
  input,
  handleInputChange,
  onSubmit,
  isLoading,
}: ChatFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-primary/10 flex items-center gap-x-2"
    >
      <Input
        disabled={isLoading}
        value={input}
        onChange={handleInputChange}
        placeholder="Ask me everything about the paper"
        className="rounded-lg mt-6"
      />
      <Button disabled={isLoading} variant="ghost" className="mt-6">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.93852 4.119C8.8953 1.38319 14.807 1.59434 17.6846 3.07384C19.7439 4.1326 25.8551 8.01077 21.4258 16.2401C21.3145 16.4469 21.26 16.6942 21.2829 16.9344L21.6523 20.814C21.7234 21.5603 21.1052 22.1552 20.4573 21.9638L16.7068 20.8561C16.5579 20.8121 16.4055 20.8086 16.2551 20.8448C11.462 21.9986 1.56242 22.4722 1.02432 13.042C0.897617 10.8215 1.27268 8.99705 1.99357 7.5161" stroke="black" strokeOpacity="0.3" strokeLinecap="round" />
          <path d="M13.055 9C13.711 9.61644 15.3679 10.997 16.9519 11.7966C17.0174 11.8297 17.0154 11.9753 16.9494 12.0063C15.945 12.4779 14.0706 13.9264 13.055 15M16.5556 11.9667C14.1345 12.0608 9 12 7 11" stroke="black" strokeLinecap="round" />
        </svg>

        {/* <SendHorizonal className="text-sky-500 mt-6" /> */}
      </Button>
    </form>
  );
};
