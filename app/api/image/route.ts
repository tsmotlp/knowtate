import { minioBucketSettings, minioClient } from "@/lib/minio";
import { IMAGES_BUCKET_NAME } from "@/constants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as any;
    if (!image) {
      return new NextResponse("No image uploaded", { status: 404 });
    }
    await minioBucketSettings(IMAGES_BUCKET_NAME)
    const imageName = image.name
    const imageData = await image.arrayBuffer();
    const buffer = Buffer.from(imageData);
    const imageKey = `image-${Date.now().toString()}-${imageName.replace(" ", "-")}`;
    await minioClient.putObject(IMAGES_BUCKET_NAME, imageKey, buffer)
    const minioEndpoint = `https://www.gptshub.site`
    const imageUrl = `${minioEndpoint}/${IMAGES_BUCKET_NAME}/${imageKey}`
    // remove old image
    const oldUrl = formData.get("oldUrl")
    if (oldUrl) {
      const resoveUrl = oldUrl as string
      const oldImageKey = resoveUrl.replace(`${minioEndpoint}/${IMAGES_BUCKET_NAME}/`, "")
      await minioClient.removeObject(IMAGES_BUCKET_NAME, oldImageKey)
    }
    return new NextResponse(imageUrl, { status: 200 });
  } catch (err) {
    console.log("UPLOAD IMAGE ERROR", err);
    return new NextResponse("Upload image error", { status: 500 });
  }
}

export async function DELETE(
  req: Request
) {
  try {
    const res = await req.json()
    if (res.oldUrl) {
      const minioEndpoint = `https://www.gptshub.site`
      const oldImageKey = res.oldUrl.replace(`${minioEndpoint}/${IMAGES_BUCKET_NAME}/`, "")
      await minioClient.removeObject(IMAGES_BUCKET_NAME, oldImageKey)
    }
    return new NextResponse("Image deleted", { status: 200 });
  } catch (err) {
    console.log("UPLOAD IMAGE ERROR", err);
    return new NextResponse("Upload image error", { status: 500 });
  }
}

