"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Doc } from "@/convex/_generated/dataModel"
import { CirclePlus } from "lucide-react"

interface NoteCreatorProps {
  showTitle?: boolean,
  handleNoteCreate: (title: string, type: Doc<"files">["type"]) => void
}

export const NoteCreator = ({
  showTitle = true,
  handleNoteCreate
}: NoteCreatorProps) => {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<Doc<"files">["type"]>("notion")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={showTitle ? "default" : "ghost"}
        >
          <CirclePlus className="h-4 w-4" />
          {showTitle && <p className="ml-1">Create Note</p>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>Create a new note</DialogTitle>
        </DialogHeader>
        <div className="w-full flex items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full flex items-center gap-4">
          <Label htmlFor="type-select" className="text-right">Type</Label>
          <Select
            value={type}
            onValueChange={(selectedType) => {
              setType(selectedType as any);
            }}
          >
            <SelectTrigger id="type-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={"notion"} value={"notion"}>notion</SelectItem>
              <SelectItem key={"markdown"} value={"markdown"}>markdown</SelectItem>
              <SelectItem key={"excalidraw"} value={"excalidraw"}>excalidraw</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              handleNoteCreate(title, type)
              setIsDialogOpen(false)
            }}
            variant="default"
            className="w-full"
          >Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
