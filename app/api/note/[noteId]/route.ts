import { archiveNote, favoriteNote, removeNote, renameNote, updateContent, updateIcon } from "@/data/note"
import { NextResponse } from "next/server"

export const PATCH = async (
  req: Request,
  { params }: { params: { noteId: string } }
) => {
  try {
    const body = await req.json()
    const { title, archived, favorited, content, icon } = body
    if (title) {
      const renamedNote = await renameNote(params.noteId, title)
      if (renamedNote) {
        return NextResponse.json(renamedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (icon) {
      const updatedNote = await updateIcon(params.noteId, icon)
      if (updatedNote) {
        return NextResponse.json(updatedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (favorited === true) {
      const favoritedNote = await favoriteNote(params.noteId, true)
      if (favoritedNote) {
        return NextResponse.json(favoritedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (favorited === false) {
      const unfavoritedNote = await favoriteNote(params.noteId, false)
      if (unfavoritedNote) {
        return NextResponse.json(unfavoritedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (archived === true) {
      const archivedNote = await archiveNote(params.noteId, true)
      if (archivedNote) {
        return NextResponse.json(archivedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (archived === false) {
      const restoredNote = await archiveNote(params.noteId, false)
      if (restoredNote) {
        return NextResponse.json(restoredNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else if (content !== null) {
      const updatedNote = await updateContent(params.noteId, content)
      if (updatedNote) {
        return NextResponse.json(updatedNote)
      }
      return new NextResponse("Failed to update note", { status: 500 })
    } else {
      return new NextResponse("Unexpected field", { status: 404 })
    }
  } catch (error) {
    console.log("UPDATE NOTE ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: { noteId: string } }
) => {
  try {
    const removedNote = await removeNote(params.noteId)
    if (removedNote) {
      return new NextResponse("Note removed", { status: 200 })
    }
  } catch (error) {
    console.log("DELETE NOTE ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}