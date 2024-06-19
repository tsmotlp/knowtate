import OpenAI from "openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { DATA_DIR, HISTORY_MESSAGE_N, VECTOR_SEARCH_K } from "@/constants";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ChatMessageProps } from "@/app/papers/[paperId]/_components/chat/chat-message";
import axios from "axios";


export async function BaiduChat(paperId: string, prompt: string, prevMessages: ChatMessageProps[] | undefined) {
  try {
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


    const response = await axios.post(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${process.env.BAIDU_ACCESS_TOKEN}`, {
      messages: [
        // {
        //   role: "system",
        //   content:
        //     "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
        // },
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
      stream: true
    })
    console.log("response", response.data)

    const stream = OpenAIStream(response.data);
    return stream
  } catch (error) {
    console.log("[OPENAI_CHAT_COMPLETION_ERROR]", error)
  }
}