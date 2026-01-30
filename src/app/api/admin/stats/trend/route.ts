import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Enable caching with 5 minute revalidation
export const revalidate = 300;

type TimeRange = "7d" | "30d" | "90d";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    // Get time range from query params (default: 30d)
    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get("range") as TimeRange) || "30d";

    // Calculate date range
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    // Generate date series and aggregate data in single query
    interface TrendData {
      day: string;
      news_count: bigint;
      events_count: bigint;
      documents_count: bigint;
    }

    const trendData = await prisma.$queryRaw<TrendData[]>`
      WITH RECURSIVE date_series AS (
        SELECT
          DATE(${startDate}) as day
        UNION ALL
        SELECT
          DATE(day + INTERVAL '1 day')
        FROM date_series
        WHERE day < DATE(${endDate})
      )
      SELECT
        TO_CHAR(ds.day, 'YYYY-MM-DD') as day,
        COALESCE(
          (SELECT COUNT(*)::bigint FROM news WHERE DATE(created_at) = ds.day),
          0
        ) as news_count,
        COALESCE(
          (SELECT COUNT(*)::bigint FROM event WHERE DATE(created_at) = ds.day),
          0
        ) as events_count,
        COALESCE(
          (SELECT COUNT(*)::bigint FROM document WHERE DATE(uploaded_at) = ds.day),
          0
        ) as documents_count
      FROM date_series ds
      ORDER BY ds.day ASC
    `;

    // Format data for chart
    const formattedData = trendData.map((row) => {
      const date = new Date(row.day);
      return {
        date: date.toLocaleDateString("it-IT", {
          day: "numeric",
          month: "short",
        }),
        News: Number(row.news_count),
        Events: Number(row.events_count),
        Documents: Number(row.documents_count),
      };
    });

    return NextResponse.json({
      range,
      days,
      data: formattedData,
    });
  } catch (error) {
    console.error("Trend API error:", error);
    return NextResponse.json(
      { error: "Errore del server" },
      { status: 500 }
    );
  }
}
