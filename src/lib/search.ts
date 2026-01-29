import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type EntityType = "news" | "events" | "documents";

export interface SearchResult {
  id: string;
  type: EntityType;
  title: string;
  headline: string; // ts_headline highlighted snippet
  url: string;
  status?: string;
  date: Date;
  rank: number;
}

export interface SearchFilters {
  types?: EntityType[];
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  authorId?: string;
  category?: string; // for documents
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  took: number; // ms
}

export async function searchAll(
  query: string,
  filters: SearchFilters = {},
  limit: number = 20,
  offset: number = 0
): Promise<SearchResponse> {
  const startTime = Date.now();

  if (!query.trim()) {
    return { results: [], total: 0, query, took: 0 };
  }

  // Sanitize query for tsquery (escape special chars, add :* for prefix matching)
  const sanitizedQuery = query
    .trim()
    .replace(/[&|!():*]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(term => `${term}:*`)
    .join(" & ");

  const types = filters.types || ["news", "events", "documents"];
  const results: SearchResult[] = [];

  // Build UNION ALL query for cross-entity search
  const queries: string[] = [];
  const params: any[] = [sanitizedQuery];
  let paramIndex = 2;

  if (types.includes("news")) {
    let newsWhere = "WHERE n.search_vector @@ to_tsquery('italian', $1)";
    if (filters.status) {
      newsWhere += ` AND n.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }
    if (filters.dateFrom) {
      newsWhere += ` AND n.created_at >= $${paramIndex}`;
      params.push(filters.dateFrom);
      paramIndex++;
    }
    if (filters.dateTo) {
      newsWhere += ` AND n.created_at <= $${paramIndex}`;
      params.push(filters.dateTo);
      paramIndex++;
    }
    if (filters.authorId) {
      newsWhere += ` AND n.author_id = $${paramIndex}`;
      params.push(filters.authorId);
      paramIndex++;
    }

    queries.push(`
      SELECT
        n.id,
        'news' as type,
        n.title,
        ts_headline('italian', n.title || ' ' || COALESCE(n.excerpt, ''), to_tsquery('italian', $1), 'MaxWords=30, MinWords=15, StartSel=<mark>, StopSel=</mark>') as headline,
        '/admin/news/' || n.id || '/edit' as url,
        n.status::text,
        n.created_at as date,
        ts_rank(n.search_vector, to_tsquery('italian', $1)) as rank
      FROM news n
      ${newsWhere}
    `);
  }

  if (types.includes("events")) {
    let eventsWhere = "WHERE e.search_vector @@ to_tsquery('italian', $1)";
    if (filters.status) {
      eventsWhere += ` AND e.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }
    if (filters.dateFrom) {
      eventsWhere += ` AND e.event_date >= $${paramIndex}`;
      params.push(filters.dateFrom);
      paramIndex++;
    }
    if (filters.dateTo) {
      eventsWhere += ` AND e.event_date <= $${paramIndex}`;
      params.push(filters.dateTo);
      paramIndex++;
    }

    queries.push(`
      SELECT
        e.id,
        'events' as type,
        e.title,
        ts_headline('italian', e.title || ' ' || COALESCE(e.description, ''), to_tsquery('italian', $1), 'MaxWords=30, MinWords=15, StartSel=<mark>, StopSel=</mark>') as headline,
        '/admin/events/' || e.id || '/edit' as url,
        e.status::text,
        e.event_date as date,
        ts_rank(e.search_vector, to_tsquery('italian', $1)) as rank
      FROM events e
      ${eventsWhere}
    `);
  }

  if (types.includes("documents")) {
    let docsWhere = "WHERE d.search_vector @@ to_tsquery('italian', $1)";
    if (filters.category) {
      docsWhere += ` AND d.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }
    if (filters.dateFrom) {
      docsWhere += ` AND d.uploaded_at >= $${paramIndex}`;
      params.push(filters.dateFrom);
      paramIndex++;
    }
    if (filters.dateTo) {
      docsWhere += ` AND d.uploaded_at <= $${paramIndex}`;
      params.push(filters.dateTo);
      paramIndex++;
    }

    queries.push(`
      SELECT
        d.id,
        'documents' as type,
        d.title,
        ts_headline('italian', d.title || ' ' || COALESCE(d.description, ''), to_tsquery('italian', $1), 'MaxWords=30, MinWords=15, StartSel=<mark>, StopSel=</mark>') as headline,
        '/admin/documents' as url,
        NULL as status,
        d.uploaded_at as date,
        ts_rank(d.search_vector, to_tsquery('italian', $1)) as rank
      FROM documents d
      ${docsWhere}
    `);
  }

  if (queries.length === 0) {
    return { results: [], total: 0, query, took: Date.now() - startTime };
  }

  const unionQuery = queries.join(" UNION ALL ");
  const finalQuery = `
    WITH search_results AS (${unionQuery})
    SELECT * FROM search_results
    ORDER BY rank DESC, date DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countQuery = `
    WITH search_results AS (${unionQuery})
    SELECT COUNT(*) as total FROM search_results
  `;

  const [searchResults, countResult] = await Promise.all([
    prisma.$queryRawUnsafe<SearchResult[]>(finalQuery, ...params),
    prisma.$queryRawUnsafe<{total: bigint}[]>(countQuery, ...params),
  ]);

  return {
    results: searchResults.map(r => ({
      ...r,
      date: new Date(r.date),
      rank: Number(r.rank),
    })),
    total: Number(countResult[0]?.total || 0),
    query,
    took: Date.now() - startTime,
  };
}
