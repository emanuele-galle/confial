import { Client } from "minio";

export const minioClient = new Client({
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const BUCKETS = {
  NEWS_IMAGES: "confial-news-images",
  DOCUMENTS: "confial-documents",
} as const;

export async function ensureBucketsExist() {
  for (const bucketName of Object.values(BUCKETS)) {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`✅ Bucket ${bucketName} created`);
    }
  }
}
