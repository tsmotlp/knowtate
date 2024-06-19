"use client"

import { useState } from "react"
import { PaperNote } from "./paper-note"
import { NoteSidebar } from "./note-sidebar"
import { Note } from "@prisma/client"

interface PaperNotesProps {
  notes: Note[]
}

export const PaperNotes = ({
  notes
}: PaperNotesProps) => {
  const [noteType, setNoteType] = useState("markdown")
  const handleClick = (key: string) => {
    setNoteType(key)
  }
  return (
    <div className="h-full w-full flex">
      <div className="flex flex-grow">
        {noteType === "markdown" && (
          <PaperNote note={notes[0]} />
        )}
        {noteType === "whiteboard" && (
          <PaperNote note={notes[1]} />
        )}
      </div>
      <div className="w-16 border-l">
        <NoteSidebar noteSidebarType={noteType} handleClick={handleClick} />
      </div>
    </div>
  )
}