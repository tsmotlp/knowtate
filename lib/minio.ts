import { BUCKET_REGION } from "@/constants";
import { Client } from "minio";

declare global {
  var minio: Client | undefined;
}

export const minioClient =
  globalThis.minio ||
  new Client({
    endPoint: process.env.MINIO_ENDPOINT ? process.env.MINIO_ENDPOINT : "127.0.0.1",
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY ? process.env.MINIO_ACCESS_KEY : "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY ? process.env.MINIO_SECRET_KEY : "minioadmin",
  });
if (process.env.NODE_ENV !== "production") globalThis.minio = minioClient;


export const minioBucketSettings = async (bucketName: string) => {
  const bucketExists = await minioClient.bucketExists(bucketName);
  if (!bucketExists) {
    await minioClient.makeBucket(bucketName, BUCKET_REGION)
    const policy = {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "AWS": [
              "*"
            ]
          },
          "Action": [
            "s3:GetBucketLocation",
            "s3:ListBucket",
            "s3:ListBucketMultipartUploads"
          ],
          "Resource": [
            `arn:aws:s3:::${bucketName}`
          ],
          "Sid": "",
          "AllowedHeaders": ["*"],
          "AllowedMethods": ["GET"],
          "AllowedOrigins": ["http://localhost:3000"],
          "ExposeHeaders": []
        },
        {
          "Effect": "Allow",
          "Principal": {
            "AWS": [
              "*"
            ]
          },
          "Action": [
            "s3:ListMultipartUploadParts",
            "s3:PutObject",
            "s3:AbortMultipartUpload",
            "s3:DeleteObject",
            "s3:GetObject"
          ],
          "Resource": [
            `arn:aws:s3:::${bucketName}/*`
          ],
          "Sid": "",
          "AllowedHeaders": ["*"],
          "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
          "AllowedOrigins": ["http://localhost:3000", "http://127.0.0.1:3000"],
          "ExposeHeaders": []
        }
      ]
    }
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy))
  }
}