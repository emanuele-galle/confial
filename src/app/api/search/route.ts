import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { searchAll, EntityType, SearchFilters } from "@/lib/search";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  const offset = (page - 1) * limit;

  // Parse filters
  const filters: SearchFilters = {};

  const types = searchParams.get("types");
  if (types) {
    filters.types = types.split(",").filter(t =>
      ["news", "events", "documents"].includes(t)
    ) as EntityType[];
  }

  const status = searchParams.get("status");
  if (status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    filters.status = status;
  }

  const dateFrom = searchParams.get("dateFrom");
  if (dateFrom) filters.dateFrom = new Date(dateFrom);

  const dateTo = searchParams.get("dateTo");
  if (dateTo) filters.dateTo = new Date(dateTo);

  const authorId = searchParams.get("authorId");
  if (authorId) filters.authorId = authorId;

  const category = searchParams.get("category");
  if (category) filters.category = category;

  try {
    const result = await searchAll(query, filters, limit, offset);

    // Return with cache headers (120s revalidation per SRCH-12)
    return NextResponse.json({
      ...result,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    }, {
      headers: {
        "Cache-Control": "private, max-age=120, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Errore durante la ricerca" },
      { status: 500 }
    );
  }
}
