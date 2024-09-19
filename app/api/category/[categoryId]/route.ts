import { archiveCategory, favoriteCategory, moveCategory, removeCategory, renameCategory } from "@/data/category"
import { NextResponse } from "next/server"

export const PATCH = async (
  req: Request,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const body = await req.json()
    const { title, favorited, archived, parentId } = body
    if (title) {
      const renamedCategory = await renameCategory(params.categoryId, title);
      if (renamedCategory) {
        return new NextResponse(JSON.stringify(renamedCategory), { status: 200 });
      }
      return new NextResponse("Failed to update category", { status: 500 });
    } else if (parentId) {
      const movedCategory = await moveCategory(params.categoryId, parentId);
      if (movedCategory) {
        return new NextResponse(JSON.stringify(movedCategory), { status: 200 });
      }
      return new NextResponse("Failed to move category", { status: 500 });
    } else if (archived === true) {
      const archivedCategory = await archiveCategory(params.categoryId, true)
      if (archivedCategory) {
        return new NextResponse(JSON.stringify(archivedCategory), { status: 200 })
      }
      return new NextResponse("Failed to update category", { status: 500 })
    } else if (archived === false) {
      const restoredCategory = await archiveCategory(params.categoryId, false)
      if (restoredCategory) {
        return new NextResponse(JSON.stringify(restoredCategory), { status: 200 })
      }
      return new NextResponse("Failed to update category", { status: 500 })
    } else if (favorited === true) {
      const favoritedCategory = await favoriteCategory(params.categoryId, true)
      if (favoritedCategory) {
        return new NextResponse(JSON.stringify(favoritedCategory), { status: 200 })
      }
      return new NextResponse("Failed to update category", { status: 500 })
    } else if (favorited === false) {
      const unfavoritedCategory = await favoriteCategory(params.categoryId, false)
      if (unfavoritedCategory) {
        return new NextResponse(JSON.stringify(unfavoritedCategory), { status: 200 })
      }
      return new NextResponse("Failed to update category", { status: 500 })
    } else {
      return new NextResponse("Unexpected field", { status: 404 })
    }
  } catch (error) {
    console.log("UPDATE CATEGORY ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const removedCategory = await removeCategory(params.categoryId)
    if (removedCategory) {
      return new NextResponse("Category removed", { status: 200 })
    }
  } catch (error) {
    console.log("DELETE CATEGORY ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}