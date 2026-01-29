import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Enable Next.js static caching with 5 minute revalidation
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    // Get date ranges for trends
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Single aggregation query for all counts and trends (replaces 13+ separate queries)
    interface AllStats {
      news_total: bigint;
      news_published: bigint;
      news_drafts: bigint;
      news_last_7_days: bigint;
      news_previous_7_days: bigint;
      news_last_30_days: bigint;
      events_total: bigint;
      events_published: bigint;
      events_upcoming: bigint;
      events_past: bigint;
      events_last_7_days: bigint;
      events_previous_7_days: bigint;
      documents_total: bigint;
      documents_last_7_days: bigint;
      documents_previous_7_days: bigint;
      documents_last_30_days: bigint;
      downloads_total: bigint;
      downloads_last_7_days: bigint;
      downloads_previous_7_days: bigint;
      users_total: bigint;
      users_admins: bigint;
    }

    const [stats] = await prisma.$queryRaw<AllStats[]>`
      SELECT
        -- News stats
        (SELECT COUNT(*) FROM news) as news_total,
        (SELECT COUNT(*) FROM news WHERE status = 'PUBLISHED') as news_published,
        (SELECT COUNT(*) FROM news WHERE status = 'DRAFT') as news_drafts,
        (SELECT COUNT(*) FROM news WHERE created_at >= ${sevenDaysAgo}) as news_last_7_days,
        (SELECT COUNT(*) FROM news WHERE created_at >= ${fourteenDaysAgo} AND created_at < ${sevenDaysAgo}) as news_previous_7_days,
        (SELECT COUNT(*) FROM news WHERE created_at >= ${thirtyDaysAgo}) as news_last_30_days,

        -- Events stats
        (SELECT COUNT(*) FROM event) as events_total,
        (SELECT COUNT(*) FROM event WHERE status = 'PUBLISHED') as events_published,
        (SELECT COUNT(*) FROM event WHERE event_date >= ${now} AND status = 'PUBLISHED') as events_upcoming,
        (SELECT COUNT(*) FROM event WHERE event_date < ${now}) as events_past,
        (SELECT COUNT(*) FROM event WHERE created_at >= ${sevenDaysAgo}) as events_last_7_days,
        (SELECT COUNT(*) FROM event WHERE created_at >= ${fourteenDaysAgo} AND created_at < ${sevenDaysAgo}) as events_previous_7_days,

        -- Documents stats
        (SELECT COUNT(*) FROM document) as documents_total,
        (SELECT COUNT(*) FROM document WHERE uploaded_at >= ${sevenDaysAgo}) as documents_last_7_days,
        (SELECT COUNT(*) FROM document WHERE uploaded_at >= ${fourteenDaysAgo} AND uploaded_at < ${sevenDaysAgo}) as documents_previous_7_days,
        (SELECT COUNT(*) FROM document WHERE uploaded_at >= ${thirtyDaysAgo}) as documents_last_30_days,

        -- Downloads stats
        (SELECT COALESCE(SUM(download_count), 0) FROM document) as downloads_total,
        (SELECT COUNT(*) FROM "AuditLog" WHERE action = 'DOCUMENT_DOWNLOAD' AND created_at >= ${sevenDaysAgo}) as downloads_last_7_days,
        (SELECT COUNT(*) FROM "AuditLog" WHERE action = 'DOCUMENT_DOWNLOAD' AND created_at >= ${fourteenDaysAgo} AND created_at < ${sevenDaysAgo}) as downloads_previous_7_days,

        -- Users stats
        (SELECT COUNT(*) FROM "User") as users_total,
        (SELECT COUNT(*) FROM "User" WHERE role = 'SUPER_ADMIN') as users_admins
    `;

    // Get sparkline data (last 7 days) with a single query using date buckets
    interface SparklineData {
      news_day_0: bigint;
      news_day_1: bigint;
      news_day_2: bigint;
      news_day_3: bigint;
      news_day_4: bigint;
      news_day_5: bigint;
      news_day_6: bigint;
      docs_day_0: bigint;
      docs_day_1: bigint;
      docs_day_2: bigint;
      docs_day_3: bigint;
      docs_day_4: bigint;
      docs_day_5: bigint;
      docs_day_6: bigint;
      downloads_day_0: bigint;
      downloads_day_1: bigint;
      downloads_day_2: bigint;
      downloads_day_3: bigint;
      downloads_day_4: bigint;
      downloads_day_5: bigint;
      downloads_day_6: bigint;
    }

    const [sparklines] = await prisma.$queryRaw<SparklineData[]>`
      WITH date_series AS (
        SELECT generate_series(
          date_trunc('day', ${sevenDaysAgo}::timestamp),
          date_trunc('day', ${now}::timestamp) - interval '1 day',
          interval '1 day'
        )::date as day,
        ROW_NUMBER() OVER (ORDER BY generate_series) - 1 as day_index
      )
      SELECT
        -- News sparkline (by created_at)
        (SELECT COUNT(*) FROM news WHERE DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 0)) as news_day_0,
        (SELECT COUNT(*) FROM news WHERE DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 1)) as news_day_1,
        (SELECT COUNT(*) FROM news WHERE DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 2)) as news_day_2,
        (SELECT COUNT(*) FROM news WHERE DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 3)) as news_day_3,
        (SELECT COUNT(*) FROM news WHERE DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 4)) as news_day_4,
        (SELECT COUNT(*) FROM news WHERE DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 5)) as news_day_5,
        (SELECT COUNT(*) FROM news WHERE DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 6)) as news_day_6,

        -- Documents sparkline (by uploaded_at)
        (SELECT COUNT(*) FROM document WHERE DATE(uploaded_at) = (SELECT day FROM date_series WHERE day_index = 0)) as docs_day_0,
        (SELECT COUNT(*) FROM document WHERE DATE(uploaded_at) = (SELECT day FROM date_series WHERE day_index = 1)) as docs_day_1,
        (SELECT COUNT(*) FROM document WHERE DATE(uploaded_at) = (SELECT day FROM date_series WHERE day_index = 2)) as docs_day_2,
        (SELECT COUNT(*) FROM document WHERE DATE(uploaded_at) = (SELECT day FROM date_series WHERE day_index = 3)) as docs_day_3,
        (SELECT COUNT(*) FROM document WHERE DATE(uploaded_at) = (SELECT day FROM date_series WHERE day_index = 4)) as docs_day_4,
        (SELECT COUNT(*) FROM document WHERE DATE(uploaded_at) = (SELECT day FROM date_series WHERE day_index = 5)) as docs_day_5,
        (SELECT COUNT(*) FROM document WHERE DATE(uploaded_at) = (SELECT day FROM date_series WHERE day_index = 6)) as docs_day_6,

        -- Downloads sparkline (by audit log)
        (SELECT COUNT(*) FROM "AuditLog" WHERE action = 'DOCUMENT_DOWNLOAD' AND DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 0)) as downloads_day_0,
        (SELECT COUNT(*) FROM "AuditLog" WHERE action = 'DOCUMENT_DOWNLOAD' AND DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 1)) as downloads_day_1,
        (SELECT COUNT(*) FROM "AuditLog" WHERE action = 'DOCUMENT_DOWNLOAD' AND DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 2)) as downloads_day_2,
        (SELECT COUNT(*) FROM "AuditLog" WHERE action = 'DOCUMENT_DOWNLOAD' AND DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 3)) as downloads_day_3,
        (SELECT COUNT(*) FROM "AuditLog" WHERE action = 'DOCUMENT_DOWNLOAD' AND DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 4)) as downloads_day_4,
        (SELECT COUNT(*) FROM "AuditLog" WHERE action = 'DOCUMENT_DOWNLOAD' AND DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 5)) as downloads_day_5,
        (SELECT COUNT(*) FROM "AuditLog" WHERE action = 'DOCUMENT_DOWNLOAD' AND DATE(created_at) = (SELECT day FROM date_series WHERE day_index = 6)) as downloads_day_6
    `;

    // Calculate percentage changes
    const calculateChange = (current: bigint, previous: bigint) => {
      const curr = Number(current);
      const prev = Number(previous);
      if (prev === 0) {
        return { value: curr > 0 ? 100 : 0, isPositive: curr > 0 };
      }
      const change = ((curr - prev) / prev) * 100;
      return { value: Math.abs(Math.round(change)), isPositive: change >= 0 };
    };

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
      // Dashboard stat cards data
      newsCount: Number(stats.news_total),
      newsSparkline: [
        Number(sparklines.news_day_0),
        Number(sparklines.news_day_1),
        Number(sparklines.news_day_2),
        Number(sparklines.news_day_3),
        Number(sparklines.news_day_4),
        Number(sparklines.news_day_5),
        Number(sparklines.news_day_6),
      ],
      newsChange: calculateChange(stats.news_last_7_days, stats.news_previous_7_days),

      publishedNewsCount: Number(stats.news_published),
      publishedNewsSparkline: [
        Number(sparklines.news_day_0),
        Number(sparklines.news_day_1),
        Number(sparklines.news_day_2),
        Number(sparklines.news_day_3),
        Number(sparklines.news_day_4),
        Number(sparklines.news_day_5),
        Number(sparklines.news_day_6),
      ], // Same as news for now (would need separate query for published filter)
      publishedNewsChange: calculateChange(stats.news_last_7_days, stats.news_previous_7_days),

      documentsCount: Number(stats.documents_total),
      documentsSparkline: [
        Number(sparklines.docs_day_0),
        Number(sparklines.docs_day_1),
        Number(sparklines.docs_day_2),
        Number(sparklines.docs_day_3),
        Number(sparklines.docs_day_4),
        Number(sparklines.docs_day_5),
        Number(sparklines.docs_day_6),
      ],
      documentsChange: calculateChange(stats.documents_last_7_days, stats.documents_previous_7_days),

      downloadsCount: Number(stats.downloads_total),
      downloadsSparkline: [
        Number(sparklines.downloads_day_0),
        Number(sparklines.downloads_day_1),
        Number(sparklines.downloads_day_2),
        Number(sparklines.downloads_day_3),
        Number(sparklines.downloads_day_4),
        Number(sparklines.downloads_day_5),
        Number(sparklines.downloads_day_6),
      ],
      downloadsChange: calculateChange(stats.downloads_last_7_days, stats.downloads_previous_7_days),

      // Legacy format for compatibility with other dashboard sections
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
