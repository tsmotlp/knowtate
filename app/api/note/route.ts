import { createNote } from "@/data/note";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, type, categoryId, paperId } = body
    if (!title) {
      return new NextResponse("title cannot be null", { status: 400 });
    }
    if (!type) {
      return new NextResponse("type cannot be null", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("categoryId cannot be null", { status: 400 });
    }
    const note = await createNote(title, type, categoryId, paperId)
    return NextResponse.json(note)
  } catch (error) {
    console.log("CREATE NOTE ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}