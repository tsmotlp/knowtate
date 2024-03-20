import { minioBucketSettings, minioClient } from "@/lib/minio";
import {
  BUCKET_REGION,
  PAPERS_BUCKET_NAME,
} from "@/constants";
import { NextResponse } from "next/server";

// 上传论文到minio
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const paper = formData.get("paper") as any;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;

    if (!paper) {
      return new NextResponse("No paper uploaded", { status: 404 });
    }

    if (!title) {
      return new NextResponse("Title is not specified", { status: 404 });
    }

    if (!category) {
      return new NextResponse("Category is not specified", { status: 404 });
    }

    await minioBucketSettings(PAPERS_BUCKET_NAME)

    const data = await paper.arrayBuffer();
    const buffer = Buffer.from(data);
    const paperKey = `paper-${category}-${Date.now().toString()}-${title.replace(" ", "-")}`;
    // 使用Promise封装putObject操作
    const putObjectPromise = new Promise((resolve, reject) => {
      minioClient.putObject(PAPERS_BUCKET_NAME, paperKey, buffer, (err, etag) => {
        if (err) {
          reject(err);
        } else {
          resolve(etag);
        }
      });
    });

    // 等待Promise解析
    await putObjectPromise;
    const minioEndpoint = `https://www.gptshub.site`
    const paperUrl = `${minioEndpoint}/${PAPERS_BUCKET_NAME}/${paperKey}`

    return new NextResponse(JSON.stringify({
      key: paperKey,
      url: paperUrl
    }), { status: 200 });

  } catch (err) {
    console.log("UPLOAD FILE ERROR", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}


export async function DELETE(
  req: Request
) {
  try {
    const res = await req.json()
    if (res.paperKey) {
      await minioClient.removeObject(PAPERS_BUCKET_NAME, res.paperKey)
    }
    return new NextResponse("Paper deleted", { status: 200 });
  } catch (err) {
    console.log("DELETE PAPER ERROR", err);
    return new NextResponse("Delete paper error", { status: 500 });
  }
}