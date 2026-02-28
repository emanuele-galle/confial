import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const searchTerm = query.trim();

  try {
    const [news, documents, events, users] = await Promise.all([
      prisma.news.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { excerpt: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: { id: true, title: true, excerpt: true, status: true, createdAt: true, author: { select: { name: true } } },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.document.findMany({
        where: { OR: [{ title: { contains: searchTerm, mode: "insensitive" } }] },
        select: { id: true, title: true, description: true, category: true, uploadedAt: true, uploadedBy: { select: { name: true } } },
        take: 5,
        orderBy: { uploadedAt: "desc" },
      }),
      prisma.event.findMany({
        where: { OR: [{ title: { contains: searchTerm, mode: "insensitive" } }] },
        select: { id: true, title: true, description: true, eventDate: true, location: true },
        take: 5,
        orderBy: { eventDate: "desc" },
      }),
      prisma.user.findMany({
        where: { OR: [{ name: { contains: searchTerm, mode: "insensitive" } }, { email: { contains: searchTerm, mode: "insensitive" } }] },
        select: { id: true, name: true, email: true, role: true },
        take: 5,
      }),
    ]);

    const results = [
      ...news.map((i) => ({ id: i.id, type: "news", title: i.title, excerpt: i.excerpt, url: `/admin/news/${i.id}/edit`, meta: `${i.status} • ${i.author.name}` })),
      ...documents.map((i) => ({ id: i.id, type: "document", title: i.title, excerpt: i.description, url: `/admin/documents/${i.id}/edit`, meta: i.category || "Doc" })),
      ...events.map((i) => ({ id: i.id, type: "event", title: i.title, excerpt: i.description, url: `/admin/events/${i.id}/edit`, meta: i.location || "Evento" })),
      ...users.map((i) => ({ id: i.id, type: "user", title: i.name || i.email, excerpt: i.email, url: `/admin/users/${i.id}/edit`, meta: i.role })),
    ];

    return NextResponse.json({ results: results.slice(0, 10) });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Errore ricerca" }, { status: 500 });
  }
}
