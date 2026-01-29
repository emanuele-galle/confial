import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { minioClient, BUCKETS } from "@/lib/minio";
import { z } from "zod";

const updateSchema = z.object({
  folder: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  alt: z.string().nullable().optional(),
  focalPointX: z.number().min(0).max(100).nullable().optional(),
  focalPointY: z.number().min(0).max(100).nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Check if media exists
    const existing = await prisma.media.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Media non trovato" },
        { status: 404 }
      );
    }

    // Update media metadata
    const updated = await prisma.media.update({
      where: { id },
      data: parsed.data,
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

    // Refresh presigned URL
    const url = await minioClient.presignedGetObject(
      BUCKETS.MEDIA,
      updated.filepath,
      7 * 24 * 60 * 60
    );

    return NextResponse.json({
      ...updated,
      url,
    });
  } catch (error) {
    console.error("Media update error:", error);
    return NextResponse.json(
      { error: "Errore durante l'aggiornamento del media" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Get media to find filepath
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { error: "Media non trovato" },
        { status: 404 }
      );
    }

    // Delete from MinIO
    try {
      await minioClient.removeObject(BUCKETS.MEDIA, media.filepath);
    } catch (error) {
      console.error("MinIO deletion error:", error);
      // Continue even if MinIO deletion fails
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Media eliminato con successo",
    });
  } catch (error) {
    console.error("Media deletion error:", error);
    return NextResponse.json(
      { error: "Errore durante l'eliminazione del media" },
      { status: 500 }
    );
  }
}
