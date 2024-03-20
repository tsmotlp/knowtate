"use client"

import { Doc } from "@/convex/_generated/dataModel"
import { CalendarDaysIcon } from "lucide-react"
import Link from "next/link"
import { BsFiletypePdf, BsMarkdown } from "react-icons/bs"
import { CiPen } from "react-icons/ci";
import { SiNotion } from "react-icons/si"
import { format } from "date-fns";
import { FileActions } from "./file-actions"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface FileCardProps {
  file: Doc<"files">
}

export const FileCard = ({
  file
}: FileCardProps) => {
  return (
    <div
      key={file._id}
      className="flex flex-col gap-y-8 pt-6 pb-2 px-6 rounded-lg border hover:cursor-pointer shadow transition hover:shadow-xl dark:bg-secondary dark:hover:bg-primary/10"
    >
      <Link
        href={file.type === "pdf" ? `/papers/${file._id}` : `/notes/${file._id}`}
        legacyBehavior={true}
      >
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-x-2">
            {file.type === "pdf" && (
              <BsFiletypePdf className="h-8 w-8" />
            )}
            {file.type === "notion" && (
              <SiNotion className="h-8 w-8" />
            )}
            {file.type === "markdown" && (
              <BsMarkdown className="h-8 w-8" />
            )}
            {file.type === "excalidraw" && (
              <CiPen className="h-10 w-10" />
            )}
            <div className="flex-1 truncate">
              <h3 className="truncate text-lg font-medium">
                {file.title}
              </h3>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex h-full w-full items-center justify-between">
        <div className="flex items-center gap-1">
          <CalendarDaysIcon className="h-4 w-4" />
          <span className="text-xs text-muted-foreground">{format(new Date(file._creationTime), "yyyy/MM/dd")}</span>
        </div>
        <FileActions file={file} />
      </div>
    </div>
  )
}