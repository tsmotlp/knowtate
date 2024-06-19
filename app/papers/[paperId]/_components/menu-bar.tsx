"use client"

import { Button } from "@/components/ui/button"
import { BotMessageSquareIcon, InfoIcon, Library, NotebookTabsIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { ToolButton } from "./tool-button"

interface MenuBarProps {
  paperTitle: string
  pageType: string,
  handleClick: (type: string) => void
}

export const MenuBar = ({
  paperTitle,
  pageType,
  handleClick
}: MenuBarProps) => {
  const router = useRouter()
  return (
    <div className="h-full w-full flex items-center border-b pl-1 pr-4">
      <ToolButton
        label="回到首页"
        icon={Library}
        size="icon"
        iconClassName="h-5 w-5 text-muted-foreground"
        onClick={() => { router.push("/dashboard/library") }}
        color=""
      />
      <div className="w-full flex items-center justify-center">
        {paperTitle}
      </div>
      <div className="flex items-center gap-x-1">
        <Button
          variant={pageType === "info" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => {
            handleClick("info")
          }}
        >
          <InfoIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button
          variant={pageType === "notes" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => {
            handleClick("notes")
          }}
        >
          <NotebookTabsIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button
          variant={pageType === "chat" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => {
            handleClick("chat")
          }}
        >
          <BotMessageSquareIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  )
}