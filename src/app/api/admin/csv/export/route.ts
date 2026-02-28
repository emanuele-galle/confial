import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCSV } from "@/lib/csv";
import { sanitizeRow } from "@/lib/csv-sanitize";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const entityType = searchParams.get("entityType");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Validate entity type
    if (!entityType || !["news", "events", "documents"].includes(entityType)) {
      return NextResponse.json(
        { error: "entityType deve essere 'news', 'events' o 'documents'" },
        { status: 400 }
      );
    }

    // Build where clause for filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic Prisma where clause
  const where: any = {};
    if (status) {
      where.status = status;
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    // Fetch data based on entity type
    let headers: string[] = [];
    let rows: string[][] = [];

    if (entityType === "news") {
      const news = await prisma.news.findMany({
        where,
        include: {
          author: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      headers = [
        "id",
        "title",
        "excerpt",
        "content",
        "status",
        "authorName",
        "publishedAt",
        "createdAt",
      ];

      rows = news.map((item) => {
        const sanitized = sanitizeRow({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt || "",
          content: item.content,
          status: item.status,
          authorName: item.author.name,
          publishedAt: item.publishedAt?.toISOString() || "",
          createdAt: item.createdAt.toISOString(),
        });

        return headers.map((h) => sanitized[h] || "");
      });
    } else if (entityType === "events") {
      const events = await prisma.event.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      headers = [
        "id",
        "title",
        "description",
        "eventDate",
        "eventTime",
        "location",
        "status",
        "createdAt",
      ];

      rows = events.map((item) => {
        const sanitized = sanitizeRow({
          id: item.id,
          title: item.title,
          description: item.description,
          eventDate: item.eventDate.toISOString(),
          eventTime: item.eventTime || "",
          location: item.location || "",
          status: item.status,
          createdAt: item.createdAt.toISOString(),
        });

        return headers.map((h) => sanitized[h] || "");
      });
    } else if (entityType === "documents") {
      const documents = await prisma.document.findMany({
        where,
        orderBy: { uploadedAt: "desc" },
      });

      headers = [
        "id",
        "title",
        "description",
        "category",
        "filepath",
        "fileSize",
        "mimeType",
        "uploadedAt",
      ];

      rows = documents.map((item) => {
        const sanitized = sanitizeRow({
          id: item.id,
          title: item.title,
          description: item.description || "",
          category: item.category || "",
          filepath: item.filepath,
          fileSize: item.fileSize.toString(),
          mimeType: item.mimeType,
          uploadedAt: item.uploadedAt.toISOString(),
        });

        return headers.map((h) => sanitized[h] || "");
      });
    }

    // Generate CSV with metadata
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);
    const metadataComment = `# Exported: ${now}\n# Entity: ${entityType}\n# Count: ${rows.length}\n`;

    const csvContent = metadataComment + generateCSV(headers, rows);

    // Return as downloadable file
    const filename = `${entityType}-export-${new Date().toISOString().split("T")[0]}.csv`;

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}
