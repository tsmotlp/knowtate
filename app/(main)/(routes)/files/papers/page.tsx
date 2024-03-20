"use client"
import { useQuery } from "convex/react"
import { FilesBrowser } from "../_components/file-browser"
import { api } from "@/convex/_generated/api"
import { Loader } from "lucide-react"

const PapersPage = () => {
  const allPapers = useQuery(api.files.getAllPapers)
  const categories = useQuery(api.categories.getCategories)
  const isCategoryLoading = categories === undefined
  const isPaperLoading = allPapers === undefined
  return (
    <>
      {isCategoryLoading || isPaperLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div>
          <FilesBrowser label="paper" isPapers categories={categories} files={allPapers} />
        </div>
      )}
    </>
  )
}

export default PapersPage