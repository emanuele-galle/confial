import { NextRequest, NextResponse, after } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { minioClient, BUCKETS } from "@/lib/minio";
import { randomUUID } from "crypto";
import sharp from "sharp";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || null;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nessun file fornito" },
        { status: 400 }
      );
    }

    const uploadedMedia = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Tipo di file non supportato: ${file.name}. Usa JPEG, PNG, WebP o GIF`,
          },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `File troppo grande: ${file.name} (max 10MB)` },
          { status: 400 }
        );
      }

      // Convert to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Get image metadata
      const metadata = await sharp(buffer).metadata();

      // Generate unique filename
      const fileExtension = file.type.split("/")[1];
      const uniqueFilename = `${randomUUID()}.${fileExtension}`;
      const filepath = folder
        ? `${folder}/${uniqueFilename}`
        : uniqueFilename;

      // Upload to MinIO
      await minioClient.putObject(
        BUCKETS.MEDIA,
        filepath,
        buffer,
        buffer.length,
        {
          "Content-Type": file.type,
          "Original-Filename": file.name,
        }
      );

      // Get presigned URL
      const url = await minioClient.presignedGetObject(
        BUCKETS.MEDIA,
        filepath,
        7 * 24 * 60 * 60 // 7 days
      );

      // Create database record
      const media = await prisma.media.create({
        data: {
          filename: file.name,
          filepath,
          url,
          mimeType: file.type,
          size: file.size,
          width: metadata.width || null,
          height: metadata.height || null,
          folder,
          uploadedById: session.user.id!,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      uploadedMedia.push(media);

      // Schedule optimization in background (non-blocking)
      after(async () => {
        try {
          // Only optimize large images (>1MB)
          if (file.size > 1024 * 1024 && metadata.width && metadata.width > 1920) {
            const optimizedBuffer = await sharp(buffer)
              .resize(1920, null, { withoutEnlargement: true })
              .jpeg({ quality: 85 })
              .toBuffer();

            // Replace original with optimized version
            await minioClient.putObject(
              BUCKETS.MEDIA,
              filepath,
              optimizedBuffer,
              optimizedBuffer.length,
              { "Content-Type": "image/jpeg" }
            );

            console.log(
              `Optimized ${filepath}: ${buffer.length} -> ${optimizedBuffer.length} bytes`
            );
          }
        } catch (error) {
          console.error("Background optimization failed:", error);
          // Don't throw - response already sent
        }
      });
    }

    return NextResponse.json({
      success: true,
      media: uploadedMedia,
      count: uploadedMedia.length,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: "Errore durante l'upload dei media" },
      { status: 500 }
    );
  }
}
