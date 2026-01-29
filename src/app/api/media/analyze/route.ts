import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeImageFocalPoint } from "@/lib/focal-point";
import { minioClient, BUCKETS } from "@/lib/minio";

export async function POST(req: NextRequest) {
  try {
    // Auth required
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const body = await req.json();
    const { mediaId } = body;

    if (!mediaId || typeof mediaId !== "string") {
      return NextResponse.json({ error: "mediaId richiesto" }, { status: 400 });
    }

    // Fetch media record
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return NextResponse.json({ error: "Media non trovato" }, { status: 404 });
    }

    // Download image from MinIO
    const stream = await minioClient.getObject(BUCKETS.MEDIA, media.filepath);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const imageBuffer = Buffer.concat(chunks);

    // Analyze focal point
    const focalPoint = await analyzeImageFocalPoint(imageBuffer);

    // Update media record
    const updatedMedia = await prisma.media.update({
      where: { id: mediaId },
      data: {
        focalPointX: focalPoint.x,
        focalPointY: focalPoint.y,
      },
    });

    return NextResponse.json({
      x: focalPoint.x,
      y: focalPoint.y,
      confidence: focalPoint.confidence,
    });
  } catch (error) {
    console.error("Media analyze error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Errore nell'analisi" },
      { status: 500 }
    );
  }
}
