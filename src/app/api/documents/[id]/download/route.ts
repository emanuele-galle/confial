import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { minioClient, BUCKETS } from "@/lib/minio";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Get document info
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Documento non trovato" },
        { status: 404 }
      );
    }

    // Update download counter
    await prisma.document.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 },
        lastDownloadAt: new Date(),
      },
    });

    // Get file from MinIO
    const dataStream = await minioClient.getObject(
      BUCKETS.DOCUMENTS,
      document.filepath
    );

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of dataStream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Return file with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(document.filename)}"`,
        "Content-Length": document.fileSize.toString(),
      },
    });
  } catch (error) {
    console.error("Document download error:", error);
    return NextResponse.json(
      { error: "Errore durante il download del documento" },
      { status: 500 }
    );
  }
}
