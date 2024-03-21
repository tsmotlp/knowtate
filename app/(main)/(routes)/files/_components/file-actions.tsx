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
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
// import { Paper } from "@prisma/client";
import axios from "axios";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

interface FileActionsProps {
  file: Doc<"files">
}

export const FileActions = ({
  file,
}: FileActionsProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(file.favorited)
  const [isArchived, setIsArchived] = useState(file.isArchived)
  const toggleFavorite = useMutation(api.files.updateFile)
  const archiveFile = useMutation(api.files.archiveFile)
  const restoreFile = useMutation(api.files.restoreFile)
  const removeFile = useMutation(api.files.removeFile)

  const handleToggleFavorite = async () => {
    const promise = toggleFavorite({ fileId: file._id, favorited: !isFavorited })
    toast.promise(promise, {
      loading: !isFavorited ? "Favoriting file..." : "Unfavoriting file...",
      success: !isFavorited ? "File favorited!" : "File unfavorited!",
      error: !isFavorited ? "Failed to favorite file!" : "Failed to unfavorite file!"
    })
    setIsFavorited((curState) => !curState)
  }


  const handleToggleArchive = async () => {
    const promise = archiveFile({ fileId: file._id })
    toast.promise(promise, {
      loading: "Moving file to trash...",
      success: "File moved to trash!",
      error: "Failed to move file to trash!"
    })
  }


  const handleRestoreFile = async () => {
    const promise = restoreFile({ fileId: file._id })
    toast.promise(promise, {
      loading: "Restoring file from trash...",
      success: "File restored from trash!",
      error: "Failed to restore file from trash!"
    })
    setIsArchived(false)
  }

  const handleRemoveFile = async () => {
    const response = await axios.delete("/api/paper", {
      data: {
        paperKey: file.key
      }
    });
    if (!response || response.status !== 200) {
      return toast("Failed to delete paper", {
        description: "Please try again later",
      });
    }
    const promise = removeFile({ fileId: file._id })
    toast.promise(promise, {
      loading: "Removing file...",
      success: "File removed!",
      error: "Failed to remove file!"
    })
  }

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            {/* <AlertDialogDescription>
            </AlertDialogDescription> */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleRemoveFile()
                setIsConfirmOpen(false)
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {isArchived ? (
            <>
              <DropdownMenuItem
                onClick={handleRestoreFile}
                className="flex gap-1 items-center cursor-pointer"
              >
                <Undo2 className="w-4 h-4" /> Restore
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setIsConfirmOpen(true)
                }}
                className="flex gap-1 items-center cursor-pointer"
              >
                <TrashIcon className="w-4 h-4" /> Remove
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {file.type === "pdf" && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      window.open(file.url, "_blank");
                    }}
                    className="flex gap-1 items-center cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={handleToggleFavorite}
                className="flex gap-1 items-center cursor-pointer"
              >
                {isFavorited ? (
                  <>
                    <Heart className="text-red-500 h-4 w-4 fill-red-500" /> Unfavorite
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4" /> Favorite
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleToggleArchive}
                className="flex gap-1 items-center cursor-pointer"
              >
                <Trash2Icon className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}