"use client"
import { useQuery } from "convex/react"
import { FilesBrowser } from "./_components/file-browser"
import { api } from "@/convex/_generated/api"
import { Loader } from "lucide-react"

const FilesPage = () => {
  const allFiles = useQuery(api.files.getAllFiles)
  const categories = useQuery(api.categories.getCategories)
  const isCategoryLoading = categories === undefined
  const isFileLoading = allFiles === undefined
  return (
    <>
      {isCategoryLoading || isFileLoading ? (
        <div className="flex h-full w-full animate-spin">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className="flex">
          <FilesBrowser label="file" isPapers isNotes categories={categories} files={allFiles} />
        </div>
      )}
    </>
  )
}

export default FilesPage