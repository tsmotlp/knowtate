import OpenAI from "openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { DATA_DIR, HISTORY_MESSAGE_N, VECTOR_SEARCH_K } from "@/constants";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ChatMessageProps } from "@/app/papers/[paperId]/_components/chat/chat-message";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.nextapi.fun/v1"
});

export async function OpenAIChat(paperId: string, prompt: string, prevMessages: ChatMessageProps[] | undefined) {
  try {
    // let proxy_url = ""
    // if (process.env.PROXY_URL) {
    //   proxy_url = process.env.PROXY_URL
    // }
    // const proxyAgent = new HttpsProxyAgent(proxy_url);

    // // 1. vectorize use message
    // const embeddings = new OpenAIEmbeddings({
    //   openAIApiKey: process.env.OPENAI_API_KEY,
    //   configuration: {
    //     httpAgent: proxyAgent,
    //   },
    // });

    // const vectors_path = `${DATA_DIR}/faiss/${paperId}`;

    // const vectorstore = await FaissStore.load(vectors_path, embeddings);

    // const results = await vectorstore.similaritySearch(prompt, VECTOR_SEARCH_K);

    const formattedPrevMessages = prevMessages ? prevMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })) : [];


    const response = await openai.chat.completions.create(
      {
        model: "gpt-3.5-turbo",
        temperature: 0,
        stream: true,
        messages: [
          {
            role: "system",
            content:
              "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
          },
          {
            role: "user",
            content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
                
          \n----------------\n
          
          PREVIOUS CONVERSATION:
          ${formattedPrevMessages.map((message) => {
              if (message.role === "user") return `User: ${message.content}\n`;
              return `Assistant: ${message.content}\n`;
            })}
          
          \n----------------\n
          

          
          USER INPUT: ${prompt}`,
          },
        ],
      },
      // {
      //   httpAgent: proxyAgent,
      //   timeout: 30000,
      // },
    );

    const stream = OpenAIStream(response);
    return stream
  } catch (error) {
    console.log("[OPENAI_CHAT_COMPLETION_ERROR]", error)
  }
}