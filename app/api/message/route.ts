import { OpenAIChat } from "@/ai/openai";
import { NextRequest, NextResponse } from "next/server";
import { StreamingTextResponse } from "ai";
import { saveFileToVectorstore } from "@/ai/vectorstore";

export const POST = async (
  req: NextRequest,
) => {
  const body = await req.json();
  const { url, key, prompt, prevMessages } = body;

  await saveFileToVectorstore(url, key);

  const stream = await OpenAIChat(key, prompt, prevMessages)
  if (stream) {
    return new StreamingTextResponse(stream);
  } else {
    return new NextResponse("Openai chat error", { status: 500 });
  }

};
