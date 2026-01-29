import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { minioClient, BUCKETS } from "@/lib/minio";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { z } from "zod";

const cropSchema = z.object({
  mediaId: z.string().cuid(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().min(1).max(100),
  height: z.number().min(1).max(100),
  aspectRatio: z.number().positive().optional(),
});

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = cropSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { mediaId, x, y, width, height } = parsed.data;

    // Get original media
    const original = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!original) {
      return NextResponse.json(
        { error: "Media originale non trovato" },
        { status: 404 }
      );
    }

    // Fetch original from MinIO
    const stream = await minioClient.getObject(BUCKETS.MEDIA, original.filepath);
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    // Get image dimensions
    const metadata = await sharp(buffer).metadata();

    if (!metadata.width || !metadata.height) {
      return NextResponse.json(
        { error: "Impossibile determinare le dimensioni dell'immagine" },
        { status: 400 }
      );
    }

    // Convert percentages to pixels
    const left = Math.round((x / 100) * metadata.width);
    const top = Math.round((y / 100) * metadata.height);
    const cropWidth = Math.round((width / 100) * metadata.width);
    const cropHeight = Math.round((height / 100) * metadata.height);

    // Crop image
    const croppedBuffer = await sharp(buffer)
      .extract({
        left,
        top,
        width: cropWidth,
        height: cropHeight,
      })
      .toBuffer();

    // Generate new filename
    const originalName = original.filename.replace(/\.[^/.]+$/, ""); // Remove extension
    const extension = original.filename.split(".").pop();
    const uniqueId = randomUUID().split("-")[0]; // Use first segment for brevity
    const newFilename = `${originalName}-cropped-${uniqueId}.${extension}`;
    const newFilepath = original.folder
      ? `${original.folder}/${newFilename}`
      : newFilename;

    // Upload cropped image to MinIO
    await minioClient.putObject(
      BUCKETS.MEDIA,
      newFilepath,
      croppedBuffer,
      croppedBuffer.length,
      {
        "Content-Type": original.mimeType,
      }
    );

    // Get presigned URL
    const url = await minioClient.presignedGetObject(
      BUCKETS.MEDIA,
      newFilepath,
      7 * 24 * 60 * 60 // 7 days
    );

    // Get new dimensions
    const croppedMetadata = await sharp(croppedBuffer).metadata();

    // Create new media record
    const croppedMedia = await prisma.media.create({
      data: {
        filename: newFilename,
        filepath: newFilepath,
        url,
        mimeType: original.mimeType,
        size: croppedBuffer.length,
        width: croppedMetadata.width || null,
        height: croppedMetadata.height || null,
        folder: original.folder,
        tags: [...original.tags, "cropped"],
        alt: original.alt ? `${original.alt} (ritagliata)` : null,
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

    return NextResponse.json({
      success: true,
      media: croppedMedia,
      originalId: mediaId,
    });
  } catch (error) {
    console.error("Media crop error:", error);
    return NextResponse.json(
      { error: "Errore durante il ritaglio dell'immagine" },
      { status: 500 }
    );
  }
}
