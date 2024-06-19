"use client";

import { ElementRef, useRef, useState } from "react";
import { ImageIcon, Smile, X } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { useCoverImage } from "@/hooks/use-cover-image";
import { Button } from "@/components/ui/button";

import { IconPicker } from "./icon-picker";
import { Note } from "@prisma/client";
import axios from "axios";

interface ToolbarProps {
  showCoverButton: boolean,
  note: Note;
  preview?: boolean;
};

export const Toolbar = ({
  showCoverButton,
  note,
  preview
}: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(note.title);

  const coverImage = useCoverImage();

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(note.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = async (value: string) => {
    setValue(value);
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
    } catch (error) {
      console.error("Failed to update note icon:", error);
    }
  };

  const onRemoveIcon = async () => {
    try {
      await axios.patch(`/api/note/${note.id}`, JSON.stringify({
        icon: ""
      }));
    } catch (error) {
      console.error("Failed to remove note icon:", error);
    }
  };

  return (
    <div className="pl-[54px] group relative">
      {!!note.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {note.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="default"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!note.icon && preview && (
        <p className="text-6xl pt-6">
          {note.icon}
        </p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!note.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="ghost"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {showCoverButton && !note.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="ghost"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value!}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {note.title}
        </div>
      )}
    </div>
  )
}