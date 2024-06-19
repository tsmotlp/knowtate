"use client"

import { MenuBar } from "./menu-bar"
import { PDFViewer } from "./pdf-viewer"
import { useState } from "react"
import { PaperNotes } from "./paper-notes"
import { PaperInfo } from "./paper-info"
import { Message, Note, Paper } from "@prisma/client"
import { ChatClient } from "./chat/chat-client"

interface PaperReaderProps {
  paper: Paper & {
    notes: Note[]
    messages: Message[]
  }
}

export const PaperReader = ({
  paper
}: PaperReaderProps) => {
  const [papeType, setPageType] = useState("notes")
  const handleClick = (type: string) => {
    setPageType(type)
  }

  return (
    <div className="h-full w-full flex flex-col">
      {!paper || !paper.url || paper.url === "" ? (
        <>
          <div className="h-12">
            <MenuBar paperTitle={"没有文献"} pageType={papeType} handleClick={handleClick} />
          </div>
          <div className="flex-grow flex items-center justify-center text-lg text-red-500">
            出错了~
          </div>
        </>
      ) : (
        <>
          <div className="h-12">
            <MenuBar paperTitle={paper.title} pageType={papeType} handleClick={handleClick} />
          </div>
          <div className="flex-grow flex">
            <div className="flex h-full w-full">
              <div className="flex-grow">
                <PDFViewer paper={paper} />
              </div>
              <div className="w-2/5 overflow-auto border-l">
                {papeType === "info" && (
                  <PaperInfo />
                )}
                {papeType === "notes" && (
                  <PaperNotes notes={paper.notes} />
                )}
                {papeType === "chat" && (
                  <ChatClient paperId={paper.id} paperUrl={paper.url} messages={paper.messages} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}