"use client"

import { IconPicker } from "@/components/editors/icon-picker";
import { Button } from "@/components/ui/button"
import { Note, Paper } from "@prisma/client";
import axios from "axios";
import { Download, FileSymlinkIcon, Library, Save, Smile } from "lucide-react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ToolButton } from "./tool-button";
import { BsFiletypePdf } from "react-icons/bs";

interface NoteNavbarProps {
  paper?: Paper,
  note: Note,
  handleSave: () => void
  handleDownload: (title: string) => void
  showDashboardIcon: boolean
}

export const NoteNavbar = ({
  paper,
  note,
  handleSave,
  handleDownload,
  showDashboardIcon,
}: NoteNavbarProps) => {
  const router = useRouter()
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [icon, setIcon] = useState(note.icon);

  const enableInput = () => {
    setIsEditing(true);
    setTimeout(() => {
      setTitle(note.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = async (value: string) => {
    setTitle(value);
    try {
      await axios.patch(`/api/note/${note.id}`, JSON.stringify({
        title: value || "Untitled"
      }));
    } catch (error) {
      console.error("Failed to update note title:", error);
    }
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = async (icon: string) => {
    try {
      await axios.patch(`/api/note/${note.id}`, JSON.stringify({
        icon: icon
      }));
      setIcon(icon)
    } catch (error) {
      console.error("Failed to update note icon:", error);
    }
  }

  return (
    <div className="h-full flex items-center justify-between px-2 border-b">
      <div className="w-full flex flex-grow items-center gap-x-1">
        {showDashboardIcon && (
          <ToolButton
            label="回到首页"
            icon={Library}
            size="compact"
            iconClassName='h-4 w-4 text-muted-foreground'
            onClick={() => router.push("/dashboard/library")}
            color=""
          />
        )}
        {!!icon && (
          <IconPicker onChange={onIconSelect}>
            <p className="hover:opacity-75 transition">
              {icon}
            </p>
          </IconPicker>
        )}
        {!icon && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="ghost"
              size="compact"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </IconPicker>
        )}
        {isEditing ? (
          <TextareaAutosize
            ref={inputRef}
            onBlur={disableInput}
            onKeyDown={onKeyDown}
            value={title!}
            onChange={(e) => onInput(e.target.value)}
            className="truncate bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
          />
        ) : (
          <div
            onClick={enableInput}
            className="truncate font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
          >
            {title}
          </div>
        )}
      </div>
      <div className="h-full w-full flex items-center justify-end text-muted-foreground">
        <ToolButton
          label="保存"
          icon={Save}
          size="compact"
          iconClassName='h-4 w-4 text-muted-foreground'
          onClick={handleSave}
          color=""
        />
        <ToolButton
          label="下载"
          icon={Download}
          size="compact"
          iconClassName='h-4 w-4 text-muted-foreground'
          onClick={() => { handleDownload(title!) }}
          color=""
        />
        {paper && paper.id && (
          <Link href={`/papers/${paper.id}`}>
            <div className="w-80 flex items-center gap-x-1 text-muted-foreground underline ml-2 text-xs border p-1 rounded-md bg-primary/10 truncate">
              <BsFiletypePdf className="h-4 w-4 text-red-400" />
              <span className="truncate">{paper.title}</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}