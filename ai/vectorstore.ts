import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HttpsProxyAgent } from "https-proxy-agent";
import { DATA_DIR } from "@/constants";
import * as fs from 'fs';
import path from "path";

export const saveFileToVectorstore = async (paperId: string, paperUrl: string) => {
  try {
    const save_path = `${DATA_DIR}/faiss/${paperId}`;
    if (fs.existsSync(save_path)) {
      return
    }
    const paperPath = path.join(process.cwd(), "public", paperUrl)
    const loader = new PDFLoader(paperPath);
    const documents = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });

    const chunks = await splitter.splitDocuments(documents);

    const proxyAgent = new HttpsProxyAgent(process.env.PROXY_URL!);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAP_API_KEY,
      configuration: {
        httpAgent: proxyAgent,
      },
    });

    const vectors = await FaissStore.fromDocuments(chunks, embeddings);

    await vectors.save(save_path);
  } catch (error) {
    throw new Error(`Embedding file to faiss got error: ${error}`);
  }
};
