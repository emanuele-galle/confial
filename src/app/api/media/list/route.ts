import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { minioClient, BUCKETS } from "@/lib/minio";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  folder: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = querySchema.safeParse(searchParams);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parametri non validi", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { page, limit, folder, tag, search } = parsed.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (folder) {
      where.folder = folder;
    }

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    if (search) {
      where.OR = [
        { filename: { contains: search, mode: "insensitive" } },
        { alt: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get media items with pagination
    const [items, total] = await prisma.$transaction([
      prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.media.count({ where }),
    ]);

    // Refresh presigned URLs (7 day expiry)
    const itemsWithFreshUrls = await Promise.all(
      items.map(async (item) => {
        const url = await minioClient.presignedGetObject(
          BUCKETS.MEDIA,
          item.filepath,
          7 * 24 * 60 * 60 // 7 days
        );

        return {
          ...item,
          url,
        };
      })
    );

    return NextResponse.json({
      items: itemsWithFreshUrls,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Media list error:", error);
    return NextResponse.json(
      { error: "Errore nel recupero dei media" },
      { status: 500 }
    );
  }
}
