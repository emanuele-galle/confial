import { NextRequest, NextResponse, after } from "next/server";
import { auth } from "@/lib/auth";
import { minioClient, BUCKETS } from "@/lib/minio";
import { randomUUID } from "crypto";
import sharp from "sharp";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { error: "Nessun file fornito" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo di file non supportato. Usa JPEG, PNG, WebP o GIF" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File troppo grande (max 5MB)" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload original immediately (no processing)
    const fileExtension = file.type.split("/")[1];
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    const filepath = `${folder}/${uniqueFilename}`;

    await minioClient.putObject(
      BUCKETS.NEWS_IMAGES,
      filepath,
      buffer,
      buffer.length,
      {
        "Content-Type": file.type,
        "Original-Filename": file.name,
      }
    );

    const url = await minioClient.presignedGetObject(
      BUCKETS.NEWS_IMAGES,
      filepath,
      7 * 24 * 60 * 60
    );

    // Schedule optimization in background (non-blocking)
    after(async () => {
      try {
        // Only optimize large images (>1MB)
        if (file.size > 1024 * 1024) {
          const image = sharp(buffer);
          const metadata = await image.metadata();

          let optimizedBuffer: Buffer;
          if (metadata.width && metadata.width > 1920) {
            optimizedBuffer = await image
              .resize(1920, null, { withoutEnlargement: true })
              .jpeg({ quality: 85 })
              .toBuffer();
          } else {
            optimizedBuffer = await image
              .jpeg({ quality: 85 })
              .toBuffer();
          }

          // Replace original with optimized version
          await minioClient.putObject(
            BUCKETS.NEWS_IMAGES,
            filepath,
            optimizedBuffer,
            optimizedBuffer.length,
            { "Content-Type": "image/jpeg" }
          );

          console.log(`Optimized ${filepath}: ${buffer.length} -> ${optimizedBuffer.length} bytes`);
        }
      } catch (error) {
        console.error("Background optimization failed:", error);
        // Don't throw - response already sent
      }
    });

    return NextResponse.json({
      url,
      filepath,
      size: buffer.length,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Errore durante l'upload dell'immagine" },
      { status: 500 }
    );
  }
}
