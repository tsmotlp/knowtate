"use client"

import { Message, Paper } from "@prisma/client"
import { ChatClient } from "./chat/chat-client"

interface PaperChatProps {
  paperId: string
  messages: Message[]
}


export const PaperChat = ({
  paperId,
  messages
}: PaperChatProps) => {
  return (
    <div>
      
    </div>
  )
}