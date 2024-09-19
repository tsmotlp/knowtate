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
  Move,
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
import { useEffect, useState } from "react";
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
import { CategoryType, DashboardItem, DashboardItemType } from "@/types/types";
import { Category } from "@prisma/client";

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
  // 新增的状态变量
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "library",
      name: "我的文库",
      type: CategoryType.Papers,
      favorited: false,
      archived: false,
      parentId: "text",
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
  ]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

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

  const handleRename = async (title: string) => {
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

  const handleRemove = async () => {
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

  // 新增的函数：获取分类列表
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await axios.get("/api/category"); // 假设有这个 API 端点
      if (response.status === 200) {
        // setCategories(response.data);
        setCategories((current) => [
          ...current,
          ...response.data.filter((c: Category) => c.id !== item.id),
        ]);
      } else {
        toast("Failed to fetch categories");
      }
    } catch (error) {
      toast("Failed to fetch categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // 新增的函数：处理移动操作
  const handleMoveItem = async () => {
    if (!selectedCategoryId) {
      toast("Please select a category to move.");
      return;
    }
    try {
      const type = item.type.toLowerCase(); // 假设 API 路径是根据 item.type 小写
      const response = await axios.patch(`/api/${type}/${item.id}`, {
        parentId: selectedCategoryId
      });
      if (response.status === 200) {
        toast("Item moved successfully!");
        setIsMoveDialogOpen(false);
        location.reload() // 刷新页面以获取最新数据
      } else {
        toast("Failed to move item.");
      }
    } catch (error) {
      toast("Failed to move item.");
    }
  };

  // 当移动对话框打开时，获取分类列表
  useEffect(() => {
    if (isMoveDialogOpen) {
      fetchCategories();
    } else {
      setCategories([
        {
          id: "library",
          name: "我的文库",
          type: CategoryType.Papers,
          favorited: false,
          archived: false,
          parentId: "text",
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        },
      ])
    }
  }, [isMoveDialogOpen]);

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
                handleRemove()
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
              {/* 新增的移动按钮 */}
              <DropdownMenuItem
                onClick={() => setIsMoveDialogOpen(true)}
                className="flex gap-2 items-center cursor-pointer text-muted-foreground"
              >
                <Move className="w-4 h-4" /> 移动
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
                handleRename(newName)
                setIsRenameDialogOpen(false)
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
      {/* 移动对话框 */}
      <Dialog
        open={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
      >
        <DialogContent className="flex flex-col justify-center">
          <DialogHeader>
            <DialogTitle>移动到分类</DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col gap-4">
            {isLoadingCategories ? (
              <div className="text-center">加载中...</div>
            ) : (
              <select
                className="border p-2 rounded"
                value={selectedCategoryId ?? ""}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="" disabled>
                  选择一个分类
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleMoveItem}
              disabled={!selectedCategoryId || isLoadingCategories}
              variant="secondary"
              size="sm"
            >
              确定
            </Button>
            <Button
              type="button"
              onClick={() => setIsMoveDialogOpen(false)}
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