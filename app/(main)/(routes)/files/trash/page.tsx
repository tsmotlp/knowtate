"use client"
import { useQuery } from "convex/react"
import { FilesBrowser } from "../_components/file-browser"
import { api } from "@/convex/_generated/api"
import { Loader } from "lucide-react"

const TrashPage = () => {
  const allTrashFiles = useQuery(api.files.getAllArchivedFiles)
  const isLoading = allTrashFiles === undefined
  console.log("allTrashFiles", allTrashFiles)
  return (
    <>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div>
          <FilesBrowser label="trash file" files={allTrashFiles} />
        </div>
      )}
    </>
  )
}

export default TrashPage