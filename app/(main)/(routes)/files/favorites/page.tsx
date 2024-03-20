"use client"
import { useQuery } from "convex/react"
import { FilesBrowser } from "../_components/file-browser"
import { api } from "@/convex/_generated/api"
import { Loader } from "lucide-react"

const FavoritesPage = () => {
  const favoriteFiles = useQuery(api.files.getAllFavoritedFiles)
  const isLoading = favoriteFiles === undefined
  return (
    <>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div>
          <FilesBrowser label="favorite file" files={favoriteFiles} />
        </div>
      )}
    </>
  )
}

export default FavoritesPage