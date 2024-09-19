import { archivePaper, favoritePaper, getPaperById, movePaper, removePaper, renamePaper, updateAnnotionOfPaper } from "@/data/paper"
import { NextResponse } from "next/server"
import path from "path"
import fs from 'fs';
import { removeNotesOfPaper } from "@/data/note";
import { removeMessagesOfPaper } from "@/data/message";

export const PATCH = async (
  req: Request,
  { params }: { params: { paperId: string } }
) => {
  try {
    const body = await req.json()
    const { title, archived, favorited, annotations, parentId } = body
    if (title) {
      const renamedPaper = await renamePaper(params.paperId, title)
      if (renamedPaper) {
        return NextResponse.json(renamedPaper)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else if (parentId) {
      const movedPaper = await movePaper(params.paperId, parentId)
      if (movedPaper) {
        return NextResponse.json(movedPaper)
      }
      return new NextResponse("Failed to move paper", { status: 500 })
    } else if (archived === true) {
      const archivedPaper = await archivePaper(params.paperId, true)
      if (archivedPaper) {
        return NextResponse.json(archivedPaper)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else if (archived === false) {
      const restoredPaper = await archivePaper(params.paperId, false)
      if (restoredPaper) {
        return NextResponse.json(restoredPaper)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else if (favorited === true) {
      const favoritedPaper = await favoritePaper(params.paperId, true)
      if (favoritedPaper) {
        return NextResponse.json(favoritedPaper)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else if (favorited === false) {
      const unfavoritedPaper = await favoritePaper(params.paperId, false)
      if (unfavoritedPaper) {
        return NextResponse.json(unfavoritedPaper)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else if (annotations === "" || annotations) {
      const updateAnnotations = await updateAnnotionOfPaper(params.paperId, annotations)
      if (updateAnnotations) {
        return NextResponse.json(updateAnnotations)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else {
      return new NextResponse("Unexpected field", { status: 404 })
    }
  } catch (error) {
    console.log("UPDATE PAPER ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: { paperId: string } }
) => {
  try {
    const removedPaper = await removePaper(params.paperId)
    if (removedPaper) {
      // 删除对应的notes
      await removeNotesOfPaper(removedPaper.id)
      // 删除对应的messages
      await removeMessagesOfPaper(removedPaper.id)
      // 删除对应的向量数据库文件（TODO）
      // 删除对应的pdf文件
      const filePath = path.join(process.cwd(), "public", removedPaper.url)
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath)
          console.log("PDF FILE REMOVED", filePath)
        } catch (error) {
          console.log("REMOVE PAPER PDF FILE ERROR", error)
        }
      }
      return new NextResponse("Paper removed", { status: 200 })
    }
  } catch (error) {
    console.log("DELETE PAPER ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export const GET = async (
  req: Request,
  { params }: { params: { paperId: string } }
) => {
  try {
    const paper = await getPaperById(params.paperId)
    if (paper) {
      return NextResponse.json(paper)
    }
    return new NextResponse("Paper not found", { status: 404 })
  } catch (error) {
    console.log("GET PAPER ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
