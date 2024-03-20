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

interface CategroyCreatorProps {
  handleCategoryCreate: (categoryName: string) => void
}

export const CategroyCreator = ({
  handleCategoryCreate
}: CategroyCreatorProps) => {
  const [categoryName, setCategoryName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value)
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
          variant="link"
          className="underline p-1 text-sky-400"
        >
          create a new category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new category</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            defaultValue="Artifical Intelligence"
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              handleCategoryCreate(categoryName)
              setIsDialogOpen(false)
              setCategoryName("")
            }}
          >Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
