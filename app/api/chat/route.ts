import { OpenAIChat } from "@/ai/openai";
import { saveFileToVectorstore } from "@/ai/vectorstore";
import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()
    const { paperId, paperUrl, prompt, prevMessages } = body
    // await saveFileToVectorstore(paperId, paperUrl)
    const stream = await OpenAIChat(paperId, prompt, prevMessages)
    // const stream = await BaiduChat(paperId, prompt, prevMessages)
    if (stream) {
      return new StreamingTextResponse(stream);
    } else {
      return new NextResponse("Openai chat error", { status: 500 });
    }
  } catch (error) {
    console.log("CHAT WITH AI ERROR", error)
    return new NextResponse("Chat with ai error", { status: 500 })
  }
}