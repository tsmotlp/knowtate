import { createMessage, getMessages, getLimitedMessages, removeMessagesOfPaper } from "@/data/message";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { paperId, role, content } = body
    if (!paperId || paperId === "") {
      return new NextResponse("paperId must not be null", { status: 400 });
    }
    if (!role || role === "") {
      return new NextResponse("role must not be null", { status: 400 });
    }
    if (!content || content === "") {
      return new NextResponse("content must not be null", { status: 400 });
    }
    const message = await createMessage(paperId, role, content)
    return NextResponse.json(message)
  } catch (error) {
    console.log("CREATE MESSAGE ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const GET = async (req: Request,
  { params }: {
    params: {
      paperId: string,
      limit: number
    }
  }
) => {
  try {
    if (!params.limit) {
      const messages = await getMessages(params.paperId)
      return NextResponse.json(messages)
    } else {
      const messages = await getLimitedMessages(params.paperId, params.limit)
      return NextResponse.json(messages)
    }
  } catch (error) {
    console.log("GET MESSAGES ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: { paperId: string } }
) => {
  try {
    const removedMessages = await removeMessagesOfPaper(params.paperId)
    if (removedMessages) {
      return new NextResponse("Note removed", { status: 200 })
    }
  } catch (error) {
    console.log("DELETE NOTE ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}