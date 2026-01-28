import "dotenv/config";
import { ensureBucketsExist } from "../lib/minio";

async function main() {
  console.log("Initializing MinIO buckets...");
  await ensureBucketsExist();
  console.log("✅ MinIO buckets ready!");
}

main();
