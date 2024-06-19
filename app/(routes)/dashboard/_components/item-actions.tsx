"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileIcon,
  FilePen,
  Heart,
  MoreVertical,
  Trash2Icon,
  TrashIcon,
  Undo2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DashboardItem, DashboardItemType } from "@/types/types";
import { useRouter } from "next/navigation";

interface ItemActionsProps {
  item: DashboardItem
}

export const ItemActions = ({
  item,
}: ItemActionsProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(item.favorited)
  const [isArchived, setIsArchived] = useState(item.archived)
  const [newName, setnewName] = useState("")
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setnewName(e.target.value)
  }

  const handleToggleFavorite = async () => {
    let type = "paper"
    if (item.type === DashboardItemType.Category) type = "category"
    if (item.type === DashboardItemType.Markdown || item.type === DashboardItemType.Whiteboard) type = "note"
    const response = await axios.patch(`/api/${type}/${item.id}`, JSON.stringify({
      favorited: !isFavorited
    }))
    if (!response || response.status !== 200) {
      toast(!isFavorited ? "Failed to favorite file!" : "Failed to unfavorite file!")
    } else {
      setIsFavorited((curState) => !curState)
      location.reload()
      toast(!isFavorited ? "File favorited!" : "File unfavorited!")
    }
  }

  const handleRenamePaper = async (title: string) => {
    let type = "paper"
    if (item.type === DashboardItemType.Category) type = "category"
    if (item.type === DashboardItemType.Markdown || item.type === DashboardItemType.Whiteboard) type = "note"
    const response = await axios.patch(`/api/${type}/${item.id}`, JSON.stringify({
      title
    }))
    if (!response || response.status !== 200) {
      toast("Failed to rename paper!")
    } else {
      location.reload()
      toast("Paper renamed!")
    }
  }

  const handleToggleArchive = async () => {
    let type = "paper"
    if (item.type === DashboardItemType.Category) type = "category"
    if (item.type === DashboardItemType.Markdown || item.type === DashboardItemType.Whiteboard) type = "note"
    const response = await axios.patch(`/api/${type}/${item.id}`, JSON.stringify({
      archived: !isArchived
    }))
    if (!response || response.status !== 200) {
      toast(!isArchived ? "Failed to move file to trash!" : "Failed to restore file from trash!")
    } else {
      setIsArchived((curState) => !curState)
      location.reload()
      toast(!isArchived ? "File moved to trash!" : "File restored from trash!")
    }
  }

  const handleRemovePaper = async () => {
    let type = "paper"
    if (item.type === DashboardItemType.Category) type = "category"
    if (item.type === DashboardItemType.Markdown || item.type === DashboardItemType.Whiteboard) type = "note"
    const response = await axios.delete(`/api/${type}/${item.id}`);
    if (!response || response.status !== 200) {
      return toast("Failed to delete paper", {
        description: "Please try again later",
      });
    }
    location.reload()
    toast("Paper removed!")
  }

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要永久删除吗</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleRemovePaper()
                setIsConfirmOpen(false)
              }}
            >
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="h-5 w-5 p-1 hover:bg-primary/10" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {isArchived ? (
            <>
              <DropdownMenuItem
                onClick={handleToggleArchive}
                className="flex gap-2 items-center cursor-pointer text-muted-foreground"
              >
                <Undo2 className="w-4 h-4" /> 恢复
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setIsConfirmOpen(true)
                }}
                className="flex gap-2 items-center cursor-pointer text-muted-foreground"
              >
                <TrashIcon className="w-4 h-4" /> 移除
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                className="flex gap-2 items-center cursor-pointer text-muted-foreground"
                onClick={() => setIsRenameDialogOpen(true)}
              >
                <FilePen className="w-4 h-4" /> 重命名
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleToggleFavorite}
                className="flex gap-2 items-center cursor-pointer text-muted-foreground"
              >
                {isFavorited ? (
                  <>
                    <Heart className="text-red-500 h-4 w-4 fill-red-500" /> 取消收藏
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4" /> 收藏
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {item.type === DashboardItemType.Paper && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      window.open(item.url!, "_blank");
                    }}
                    className="flex gap-2 items-center cursor-pointer text-muted-foreground"
                  >
                    <Download className="w-4 h-4" /> 下载
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={handleToggleArchive}
                className="flex gap-2 items-center cursor-pointer text-muted-foreground"
              >
                <Trash2Icon className="w-4 h-4" /> 删除
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={isRenameDialogOpen}
        onOpenChange={(isOpen) => {
          setIsRenameDialogOpen(isOpen)
        }}
      >
        <DialogContent className="flex flex-col justify-center">
          <DialogHeader>
            <DialogTitle>重命名</DialogTitle>
          </DialogHeader>
          <div className="w-full flex items-center gap-4">
            <Input
              placeholder="新名称"
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                handleRenamePaper(newName)
                setIsRenameDialogOpen(false)
                location.reload()
              }}
              variant="secondary"
              size="sm"
            >
              确定
            </Button>
            <Button
              // type="submit"
              onClick={() => {
                setIsRenameDialogOpen(false)
              }}
              variant="secondary"
              size="sm"
            >
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}