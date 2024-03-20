"use client"
import { useQuery } from "convex/react"
import { FilesBrowser } from "../_components/file-browser"
import { api } from "@/convex/_generated/api"
import { Loader } from "lucide-react"

const NotesPage = () => {
  const allNotes = useQuery(api.files.getAllNotes)
  const isLoading = allNotes === undefined
  return (
    <>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div>
          <FilesBrowser label="note" isNotes={true} files={allNotes} />
        </div>
      )}
    </>
  )
}

export default NotesPage