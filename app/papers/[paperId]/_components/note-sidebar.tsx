"use client"

import { Button } from "@/components/ui/button"

interface NoteSidebarPorps {
  noteSidebarType: string
  handleClick: (key: string) => void
}

export const NoteSidebar = ({
  noteSidebarType = "markdown",
  handleClick
}: NoteSidebarPorps) => {
  return (
    <div className="h-full w-full flex flex-col items-center p-2 gap-y-2">
      <NoteSidebarItem
        title="笔记"
        active={noteSidebarType === "markdown"}
        handleClick={() => { handleClick("markdown") }}
      />
      <NoteSidebarItem
        title="白板"
        active={noteSidebarType === "whiteboard"}
        handleClick={() => { handleClick("whiteboard") }}
      />
      <NoteSidebarItem
        title="单词"
        active={noteSidebarType === "vocabs"}
        handleClick={() => { handleClick("vocabs") }}
      />
      <NoteSidebarItem
        title="术语"
        active={noteSidebarType === "terms"}
        handleClick={() => { handleClick("terms") }}
      />
      <NoteSidebarItem
        title="句式"
        active={noteSidebarType === "sentences"}
        handleClick={() => { handleClick("sentences") }}
      />
    </div>
  )
}

interface NoteSidebarItemProps {
  title: string,
  active: boolean,
  handleClick: () => void
}

const NoteSidebarItem = ({
  title,
  active,
  handleClick
}: NoteSidebarItemProps) => {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="sm"
      onClick={handleClick}
    >
      {title}
    </Button>
  )
}