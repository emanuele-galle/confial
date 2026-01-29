import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { minioClient, BUCKETS } from "@/lib/minio";
import sharp from "sharp";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = request.nextUrl;

    const width = parseInt(searchParams.get("w") || "0");
    const height = parseInt(searchParams.get("h") || "0");
    const fit = (searchParams.get("fit") || "cover") as "cover" | "contain" | "fill";

    // Get media from database
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { error: "Media non trovato" },
        { status: 404 }
      );
    }

    // Fetch original from MinIO
    const stream = await minioClient.getObject(BUCKETS.MEDIA, media.filepath);
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    // Resize with Sharp
    let image = sharp(buffer);

    if (width || height) {
      const resizeOptions: any = {
        fit,
      };

      // Use focal point if set
      if (media.focalPointX !== null && media.focalPointY !== null) {
        resizeOptions.position = {
          x: media.focalPointX / 100, // Convert percentage to 0-1
          y: media.focalPointY / 100,
        };
      } else {
        resizeOptions.position = "centre";
      }

      image = image.resize(width || undefined, height || undefined, resizeOptions);
    }

    const processedBuffer = await image.toBuffer();

    // Determine content type
    const contentType = media.mimeType;

    // Convert Buffer to Uint8Array for Response
    return new Response(new Uint8Array(processedBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return NextResponse.json(
      { error: "Errore nella generazione della miniatura" },
      { status: 500 }
    );
  }
}
