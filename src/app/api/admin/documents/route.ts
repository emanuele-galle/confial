import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { minioClient, BUCKETS } from "@/lib/minio";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const category = searchParams.get("category");
  const search = searchParams.get("search") || "";
  const skip = (page - 1) * limit;

  // Build where clause with filters
  const where: any = {};

  // Category filter
  if (category) {
    where.category = category;
  }

  // Search filter (title, description, filename)
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { filename: { contains: search, mode: "insensitive" } },
    ];
  }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      skip,
      take: limit,
      orderBy: { uploadedAt: "desc" },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.document.count({ where }),
  ]);

  return NextResponse.json({
    data: documents,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string | null;

    if (!file || !title) {
      return NextResponse.json(
        { error: "File e titolo sono obbligatori" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Solo file PDF sono permessi" },
        { status: 400 }
      );
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File troppo grande (max 10MB)" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    const filepath = `documents/${uniqueFilename}`;

    // Upload to MinIO
    const buffer = Buffer.from(await file.arrayBuffer());
    await minioClient.putObject(
      BUCKETS.DOCUMENTS,
      filepath,
      buffer,
      file.size,
      {
        "Content-Type": file.type,
        "Original-Filename": file.name,
      }
    );

    // Create document record
    const document = await prisma.document.create({
      data: {
        title,
        description: description || null,
        category: category || null,
        filename: file.name,
        filepath,
        fileSize: file.size,
        mimeType: file.type,
        uploadedById: (session.user as any).id,
      },
      include: {
        uploadedBy: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "Errore durante l'upload del documento" },
      { status: 500 }
    );
  }
}
