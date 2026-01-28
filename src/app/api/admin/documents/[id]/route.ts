import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { minioClient, BUCKETS } from "@/lib/minio";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

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

    // Delete from MinIO
    try {
      await minioClient.removeObject(BUCKETS.DOCUMENTS, document.filepath);
    } catch (minioError) {
      console.error("MinIO deletion error:", minioError);
      // Continue with DB deletion even if MinIO fails
    }

    // Delete from database
    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Document deletion error:", error);
    return NextResponse.json(
      { error: "Errore durante l'eliminazione del documento" },
      { status: 500 }
    );
  }
}
