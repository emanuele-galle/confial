import { Client } from "minio";

const minioUrl = new URL(process.env.MINIO_ENDPOINT || "http://127.0.0.1:9000");

export const minioClient = new Client({
  endPoint: minioUrl.hostname,
  port: Number(minioUrl.port) || 9000,
  useSSL: minioUrl.protocol === "https:",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const BUCKETS = {
  NEWS_IMAGES: "confial-news-images",
  DOCUMENTS: "confial-documents",
  EVENTS_IMAGES: "confial-events-images",
  MEDIA: "confial-media",
} as const;

async function ensureBucketsExist() {
  for (const bucketName of Object.values(BUCKETS)) {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`✅ Bucket ${bucketName} created`);
    }
  }
}
