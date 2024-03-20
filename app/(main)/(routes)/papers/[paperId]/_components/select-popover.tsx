"use client"

import { HighlighterIcon, LanguagesIcon, CopyIcon } from "lucide-react"
import { toast } from "sonner"
import { ToolButton } from "./tool-button"

interface SelectHoverProps {
  selectedText: string
  top: number
  left: number
  handleHighlight: () => void
}

export const SelectHover = ({
  selectedText,
  top,
  left,
  handleHighlight,
}: SelectHoverProps) => {
  const handleCopySelectedText = () => {
    navigator.clipboard.writeText(selectedText)
    toast("", {
      description: "text copied!",
      duration: 3000
    })
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: top,
        left: left,
        zIndex: 1,
        background: '#FFFF00',
        border: '1px solid rgba(0, 0, 0, 0.3)',
        borderRadius: '2px',
        padding: '2px 4px',
        transform: 'translate(0, 8px)',
      }}

      className="bg-gray-200 rounded-lg"
    >
      <ToolButton
        label="Highlight"
        icon={HighlighterIcon}
        color="text-yellow-500"
        onClick={handleHighlight}
      />
      <ToolButton
        label="Translate"
        icon={LanguagesIcon}
        color="text-sky-500"
        onClick={() => { }}
      />
      <ToolButton
        label="Copy"
        icon={CopyIcon}
        color="text-black"
        onClick={handleCopySelectedText}
      />
    </div>
  )
}