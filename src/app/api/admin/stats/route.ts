import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    // Get date range for trends (30 days ago)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // News stats
    const [newsTotal, newsPublished, newsDrafts, newsLast30Days] = await Promise.all([
      prisma.news.count(),
      prisma.news.count({ where: { status: "PUBLISHED" } }),
      prisma.news.count({ where: { status: "DRAFT" } }),
      prisma.news.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ]);

    // Events stats
    const now = new Date();
    const [eventsTotal, eventsPublished, eventsUpcoming, eventsPast] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { status: "PUBLISHED" } }),
      prisma.event.count({ where: { eventDate: { gte: now }, status: "PUBLISHED" } }),
      prisma.event.count({ where: { eventDate: { lt: now } } }),
    ]);

    // Documents stats
    const [documentsTotal, documentsLast30Days] = await Promise.all([
      prisma.document.count(),
      prisma.document.count({ where: { uploadedAt: { gte: thirtyDaysAgo } } }),
    ]);

    // Documents by category
    const documentsByCategory = await prisma.document.groupBy({
      by: ['category'],
      _count: { id: true },
    });

    // News by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const newsByMonth = await prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*) as count
      FROM news
      WHERE created_at >= ${sixMonthsAgo}
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month DESC
    `;

    // Users stats
    const [usersTotal, usersAdmins] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "SUPER_ADMIN" } }),
    ]);

    return NextResponse.json({
      news: {
        total: newsTotal,
        published: newsPublished,
        drafts: newsDrafts,
        trendVsPrevMonth: newsLast30Days > 0 ? `+${newsLast30Days}` : "0",
        byMonth: newsByMonth.map(item => ({
          month: item.month,
          count: Number(item.count),
        })),
      },
      events: {
        total: eventsTotal,
        published: eventsPublished,
        upcoming: eventsUpcoming,
        past: eventsPast,
      },
      documents: {
        total: documentsTotal,
        trendVsPrevMonth: documentsLast30Days > 0 ? `+${documentsLast30Days}` : "0",
        byCategory: documentsByCategory.map(item => ({
          category: item.category || "Senza categoria",
          count: item._count.id,
        })),
      },
      users: {
        total: usersTotal,
        admins: usersAdmins,
      },
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}
