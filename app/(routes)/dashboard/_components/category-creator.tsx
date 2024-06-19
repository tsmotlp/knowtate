"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CategoryType, DashboardItem, DashboardItemType } from "@/types/types"
import { Category } from "@prisma/client"
import axios from "axios"
import { FolderPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { toast } from "sonner"

interface CategoryCreatorProps {
  type: CategoryType
  parentId: string
  setItems: Dispatch<SetStateAction<DashboardItem[]>>
}

export const CategoryCreator = ({
  type,
  parentId,
  setItems,
}: CategoryCreatorProps) => {
  const router = useRouter()
  const [categoryName, setCategoryName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value)
  }
  const handleCreateCategory = async (name: string) => {
    try {
      const response = await axios.post("/api/category", JSON.stringify({
        name: name,
        type: type,
        parentId: parentId
      }))
      if (response.status === 200) {
        const createdCategory: Category = response.data
        setItems((current) => [...current, {
          id: createdCategory.id,
          label: createdCategory.name,
          type: DashboardItemType.Category,
          archived: createdCategory.archived,
          favorited: createdCategory.favorited,
          url: null,
          authors: null,
          publication: null,
          publicationDate: null,
          paperTile: null,
          paperId: null,
          lastEdit: createdCategory.updatedAt,
        }])
        toast.success("Category created!");
        router.refresh()
      }
    } catch (error) {
      console.log("Failed to create category", error);
      toast.error("Failed to create category!");
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
          新建分类
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-center">
        <DialogHeader>
          <DialogTitle>创建新分类</DialogTitle>
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
              handleCreateCategory(categoryName)
              setIsCreateDialogOpen(false)
              router.refresh()
            }}
            variant="secondary"
            size="sm"
          >
            确定
          </Button>
          <Button
            // type="submit"
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