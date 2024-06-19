import { createCategory, getAllCategories } from "@/data/category";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { name, type, parentId } = body
    if (!name || name === "") {
      return new NextResponse("name must not be null", { status: 400 });
    }
    if (!parentId || parentId === "") {
      return new NextResponse("parentId must not be null", { status: 400 });
    }
    if (!type || type === "") {
      return new NextResponse("category type must not be null", { status: 400 });
    }
    const category = await createCategory(name, type, parentId)
    return NextResponse.json(category)
  } catch (error) {
    console.log("CREATE CATEGORY ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const GET = async () => {
  try {
    const categories = await getAllCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.log("GET CATEGORIES ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}