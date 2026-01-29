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
    const now = new Date();

    // Single aggregation query for all counts (replaces 13 separate queries)
    interface AllStats {
      news_total: bigint;
      news_published: bigint;
      news_drafts: bigint;
      news_last_30_days: bigint;
      events_total: bigint;
      events_published: bigint;
      events_upcoming: bigint;
      events_past: bigint;
      documents_total: bigint;
      documents_last_30_days: bigint;
      users_total: bigint;
      users_admins: bigint;
    }

    const [stats] = await prisma.$queryRaw<AllStats[]>`
      SELECT
        -- News stats
        (SELECT COUNT(*) FROM news) as news_total,
        (SELECT COUNT(*) FROM news WHERE status = 'PUBLISHED') as news_published,
        (SELECT COUNT(*) FROM news WHERE status = 'DRAFT') as news_drafts,
        (SELECT COUNT(*) FROM news WHERE created_at >= ${thirtyDaysAgo}) as news_last_30_days,

        -- Events stats
        (SELECT COUNT(*) FROM event) as events_total,
        (SELECT COUNT(*) FROM event WHERE status = 'PUBLISHED') as events_published,
        (SELECT COUNT(*) FROM event WHERE event_date >= ${now} AND status = 'PUBLISHED') as events_upcoming,
        (SELECT COUNT(*) FROM event WHERE event_date < ${now}) as events_past,

        -- Documents stats
        (SELECT COUNT(*) FROM document) as documents_total,
        (SELECT COUNT(*) FROM document WHERE uploaded_at >= ${thirtyDaysAgo}) as documents_last_30_days,

        -- Users stats
        (SELECT COUNT(*) FROM "User") as users_total,
        (SELECT COUNT(*) FROM "User" WHERE role = 'SUPER_ADMIN') as users_admins
    `;

    // Documents by category (with pagination limit)
    const documentsByCategory = await prisma.document.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    });

    // News by month (last 6 months with limit)
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
      LIMIT 12
    `;

    return NextResponse.json({
      news: {
        total: Number(stats.news_total),
        published: Number(stats.news_published),
        drafts: Number(stats.news_drafts),
        trendVsPrevMonth: stats.news_last_30_days > 0 ? `+${Number(stats.news_last_30_days)}` : "0",
        byMonth: newsByMonth.map(item => ({
          month: item.month,
          count: Number(item.count),
        })),
      },
      events: {
        total: Number(stats.events_total),
        published: Number(stats.events_published),
        upcoming: Number(stats.events_upcoming),
        past: Number(stats.events_past),
      },
      documents: {
        total: Number(stats.documents_total),
        trendVsPrevMonth: stats.documents_last_30_days > 0 ? `+${Number(stats.documents_last_30_days)}` : "0",
        byCategory: documentsByCategory.map(item => ({
          category: item.category || "Senza categoria",
          count: item._count.id,
        })),
      },
      users: {
        total: Number(stats.users_total),
        admins: Number(stats.users_admins),
      },
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}
