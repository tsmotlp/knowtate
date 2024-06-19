"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CategoryType, DashboardItem, DashboardItemType } from "@/types/types"
import { Note } from "@prisma/client"
import axios from "axios"
import { FolderPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { toast } from "sonner"

interface NoteCreatorProps {
  type: DashboardItemType
  categoryId: string
  paperId?: string,
  setItems: Dispatch<SetStateAction<DashboardItem[]>>
}

export const NoteCreator = ({
  type,
  categoryId,
  paperId,
  setItems,
}: NoteCreatorProps) => {
  const router = useRouter()
  const [noteName, setNoteName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteName(e.target.value)
  }
  const handleCreateNote = async (title: string) => {
    try {
      const response = await axios.post("/api/note", JSON.stringify({
        title: title ? title : "Untitled",
        type: type,
        categoryId: categoryId,
        paperId: paperId,
      }))
      if (response.status === 200) {
        const createdNote: Note = response.data
        setItems((current) => [...current, {
          id: createdNote.id,
          label: createdNote.title,
          type: createdNote.type as DashboardItemType,
          archived: createdNote.archived,
          favorited: createdNote.favorited,
          url: null,
          authors: null,
          publication: null,
          publicationDate: null,
          paperTile: null,
          paperId: createdNote.paperId,
          lastEdit: createdNote.updatedAt,
        }])
        toast.success("Note created!");
        router.refresh()
      }
    } catch (error) {
      console.log("Failed to create note", error);
      toast.error("Failed to create note!");
    }
  };

  return (
    <Dialog
      open={isCreateDialogOpen}
      onOpenChange={(isOpen) => {
        setIsCreateDialogOpen(isOpen)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
        >
          <FolderPlus className="h-4 w-4 mr-1" />
          {type === DashboardItemType.Markdown ? "新建笔记" : "新建白板"}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center">
        <DialogHeader>
          <DialogTitle>
            {type === DashboardItemType.Markdown ? "创建笔记" : "创建白板"}
          </DialogTitle>
        </DialogHeader>
        <div className="w-full flex items-center gap-4">
          <Input
            placeholder="名称"
            onChange={handleInputChange}
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              handleCreateNote(noteName)
              setNoteName("")
              setIsCreateDialogOpen(false)
              router.refresh()
            }}
            variant="secondary"
            size="sm"
          >
            确定
          </Button>
          <Button
            onClick={() => {
              setIsCreateDialogOpen(false)
            }}
            variant="secondary"
            size="sm"
          >
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}