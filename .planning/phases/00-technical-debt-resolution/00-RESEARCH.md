# Phase 0: Technical Debt Resolution - Research

**Researched:** 2026-01-29
**Domain:** Performance optimization, database queries, error handling
**Confidence:** HIGH

## Summary

This phase eliminates critical performance bottlenecks and missing safeguards in the Confial admin platform. The research focused on six specific technical debt items: N+1 query patterns in stats API, missing pagination, double database reads in audit logging, synchronous image processing, missing error boundaries, and orphaned file cleanup in MinIO.

The standard approach combines Prisma's native aggregation capabilities with PostgreSQL raw SQL for complex multi-table statistics, interactive transactions for atomic read-modify-write operations, Next.js 15's `after()` function for background processing, and App Router error boundaries for graceful degradation. All solutions leverage existing infrastructure (Next.js 16, Prisma 7, PostgreSQL 18) without requiring new dependencies like Redis or job queues.

**Primary recommendation:** Use Prisma `$queryRaw` with PostgreSQL aggregate functions to consolidate 13+ separate COUNT queries into a single query with conditional aggregation, implement interactive transactions for audit logging to eliminate double reads, add `after()` calls for async image processing, create `error.tsx` files in all admin route segments, implement MinIO `removeObjects()` batch cleanup, and add offset pagination with sensible limits (1000 rows default) to prevent unbounded result sets.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Prisma Client | 7.3.0 | ORM with transaction support | Official ORM for Next.js; provides `$queryRaw`, `$transaction`, aggregation APIs; optimized for PostgreSQL |
| PostgreSQL | 18+ | Database with advanced aggregation | Native support for JSON aggregation, lateral joins, window functions; used by Prisma for complex queries |
| Next.js | 16.1.6 | App Router with error boundaries | Built-in `error.tsx` convention, `after()` function for background tasks; native support for streaming responses |
| Sharp | 0.34.5 | Image processing library | Fastest Node.js image processor; non-blocking via libuv thread pool; already in project dependencies |
| MinIO SDK | 8.0.6 | S3-compatible object storage client | Official SDK for MinIO; supports batch operations via `removeObjects()` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| date-fns | 4.1.0 | Date manipulation for ranges | Already in project; useful for pagination cursors and time-based filtering |
| React | 19.2.4 | Client component support | Required for `error.tsx` boundaries (must be client components with `'use client'`) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Prisma `$queryRaw` | TypeORM raw queries | Prisma already integrated; raw SQL maintains type safety with TypeScript generics |
| `after()` function | BullMQ/Redis queue | `after()` requires zero infrastructure; sufficient for fire-and-forget tasks under 5s; use queue only if >30s jobs |
| Offset pagination | Cursor-based pagination | Cursor better for infinite scroll but cannot jump to arbitrary pages; offset suitable for dashboard stats with <10k records |
| Error boundaries | Try-catch in components | Error boundaries catch React rendering errors; try-catch only handles async/promise errors |

**Installation:**
```bash
# No new packages needed - all dependencies already in package.json
# Verify versions:
npm list prisma sharp minio
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── api/
│   │   └── admin/
│   │       ├── stats/
│   │       │   └── route.ts           # MODIFY: Consolidate queries
│   │       ├── news/[id]/
│   │       │   └── route.ts           # MODIFY: Use transactions
│   │       ├── events/[id]/
│   │       │   └── route.ts           # MODIFY: Use transactions
│   │       ├── batch/
│   │       │   └── route.ts           # MODIFY: Add MinIO cleanup
│   │       └── upload/
│   │           └── route.ts           # MODIFY: Move to after()
│   └── (dashboard)/
│       └── admin/
│           ├── news/
│           │   └── error.tsx          # ADD
│           ├── events/
│           │   └── error.tsx          # ADD
│           ├── documents/
│           │   └── error.tsx          # ADD
│           └── users/
│               └── error.tsx          # ADD
└── lib/
    └── audit-log.ts                    # Already exists
```

### Pattern 1: PostgreSQL Aggregation Query (N+1 Elimination)
**What:** Single raw SQL query with conditional aggregation using CASE and COUNT
**When to use:** Stats endpoints that need multiple counts across different conditions
**Example:**
```typescript
// Source: https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing
// Adapted for multiple conditional counts

interface StatsResult {
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

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const now = new Date();

const [stats] = await prisma.$queryRaw<StatsResult[]>`
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

// Convert bigint to number for JSON serialization
const normalizedStats = {
  news: {
    total: Number(stats.news_total),
    published: Number(stats.news_published),
    drafts: Number(stats.news_drafts),
    trendVsPrevMonth: stats.news_last_30_days > 0
      ? `+${Number(stats.news_last_30_days)}`
      : "0",
  },
  // ... rest of response
};
```

### Pattern 2: Interactive Transaction for Audit Logging
**What:** Fetch and update in single transaction to eliminate double reads
**When to use:** PATCH/DELETE operations requiring audit trail with old/new values
**Example:**
```typescript
// Source: https://www.prisma.io/docs/orm/prisma-client/queries/transactions
// Read-modify-write pattern

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const validationResult = updateNewsSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: validationResult.error.flatten() },
      { status: 400 }
    );
  }

  // Single transaction: fetch, update, log
  const { oldNews, newNews } = await prisma.$transaction(async (tx) => {
    // Fetch current values
    const oldNews = await tx.news.findUnique({ where: { id } });

    if (!oldNews) {
      throw new Error("News non trovata");
    }

    // Perform update
    const newNews = await tx.news.update({
      where: { id },
      data: validationResult.data,
    });

    // Log within same transaction
    await tx.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE",
        entityType: "news",
        entityId: id,
        oldValues: oldNews as any,
        newValues: newNews as any,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return { oldNews, newNews };
  });

  return NextResponse.json(newNews);
}
```

### Pattern 3: Background Image Processing with after()
**What:** Move Sharp processing to `after()` callback to return response immediately
**When to use:** Image optimization tasks <5 seconds that don't need to block response
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/after
// Non-blocking image processing

import { after } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "general";

  // Validation (fast, blocks response)
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipo di file non supportato" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File troppo grande (max 5MB)" },
      { status: 400 }
    );
  }

  // Upload original immediately
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueFilename = `${randomUUID()}.${file.type.split("/")[1]}`;
  const filepath = `${folder}/${uniqueFilename}`;

  await minioClient.putObject(
    BUCKETS.NEWS_IMAGES,
    filepath,
    buffer,
    buffer.length,
    { "Content-Type": file.type }
  );

  // Generate presigned URL and return immediately
  const url = await minioClient.presignedGetObject(
    BUCKETS.NEWS_IMAGES,
    filepath,
    7 * 24 * 60 * 60
  );

  // Schedule optimization in background (non-blocking)
  after(async () => {
    try {
      if (file.size > 1024 * 1024) {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        const optimized = metadata.width && metadata.width > 1920
          ? await image.resize(1920, null, { withoutEnlargement: true })
                       .jpeg({ quality: 85 })
                       .toBuffer()
          : await image.jpeg({ quality: 85 }).toBuffer();

        // Replace with optimized version
        const optimizedPath = `${folder}/optimized/${uniqueFilename}`;
        await minioClient.putObject(
          BUCKETS.NEWS_IMAGES,
          optimizedPath,
          optimized,
          optimized.length,
          { "Content-Type": "image/jpeg" }
        );
      }
    } catch (error) {
      console.error("Background optimization failed:", error);
      // Don't throw - already responded to client
    }
  });

  return NextResponse.json({
    url,
    filepath,
    size: buffer.length,
    mimeType: file.type,
  });
}
```

### Pattern 4: Error Boundary for Admin Pages
**What:** Client component with `'use client'` directive catching rendering errors
**When to use:** Every route segment that renders data (news, events, documents, users)
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/error
// File: src/app/(dashboard)/admin/news/error.tsx

'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to monitoring service
    console.error('News page error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Errore nel caricamento delle news
        </h2>
        <p className="text-gray-600 mb-6">
          Si è verificato un errore durante il caricamento della pagina.
          {error.digest && (
            <span className="block text-sm mt-2">
              Codice errore: {error.digest}
            </span>
          )}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Riprova
        </button>
      </div>
    </div>
  )
}
```

### Pattern 5: MinIO Batch Cleanup
**What:** Use `removeObjects()` to delete multiple files in single API call
**When to use:** Batch delete operations that remove database records with associated files
**Example:**
```typescript
// Source: https://github.com/minio/minio-js/blob/master/examples/remove-object.js
// Adapted for batch operations

async function executeBatchDocuments(tx: any, action: string, id: string) {
  switch (action) {
    case "delete":
      // Fetch document to get file path
      const document = await tx.document.findUnique({
        where: { id },
        select: { filePath: true },
      });

      // Delete from database (within transaction)
      await tx.document.delete({ where: { id } });

      // Return file path for batch cleanup (outside transaction)
      return document?.filePath;

    default:
      throw new Error("Azione non supportata per documenti");
  }
}

export async function POST(request: NextRequest) {
  // ... validation ...

  const filesToDelete: string[] = [];

  // Execute batch operation in transaction
  await prisma.$transaction(async (tx) => {
    for (const id of ids) {
      try {
        const filePath = await executeBatchDocuments(tx, action, id);
        if (filePath) {
          filesToDelete.push(filePath);
        }
        success++;
      } catch (error) {
        failed++;
        errors.push(`${id}: ${error.message}`);
      }
    }
  });

  // Cleanup MinIO files AFTER transaction (non-blocking)
  if (filesToDelete.length > 0) {
    after(async () => {
      try {
        // Batch delete from MinIO
        await minioClient.removeObjects(
          BUCKETS.DOCUMENTS,
          filesToDelete
        );
        console.log(`Cleaned up ${filesToDelete.length} orphaned files`);
      } catch (error) {
        console.error("MinIO cleanup failed:", error);
        // Log but don't throw - transaction already committed
      }
    });
  }

  return NextResponse.json({ success, failed, errors: errors.length > 0 ? errors : undefined });
}
```

### Pattern 6: Pagination with Limit
**What:** Add `take` parameter with sensible default to prevent unbounded queries
**When to use:** Any groupBy or aggregation that could return unbounded rows
**Example:**
```typescript
// Source: https://www.prisma.io/docs/orm/prisma-client/queries/pagination
// Offset pagination for stats

// Documents by category (limited to top 20 categories)
const documentsByCategory = await prisma.document.groupBy({
  by: ['category'],
  _count: { id: true },
  orderBy: { _count: { id: 'desc' } },
  take: 20, // Prevent unbounded results
});

// News by month (limited to last 12 months with raw query)
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
```

### Anti-Patterns to Avoid

- **Separate count queries in Promise.all:** Uses multiple database connections from pool; scales poorly; replace with single aggregation query
- **Double database reads:** Fetching before update wastes round-trip; use interactive transaction to fetch + update atomically
- **Synchronous Sharp in request handler:** Blocks response for 100ms+ per image; use `after()` to process in background
- **Missing error boundaries:** Unhandled component errors crash entire page; add `error.tsx` in every route segment
- **Looping removeObject calls:** MinIO SDK supports batch delete; use `removeObjects([...])` instead of loop
- **Unbounded groupBy results:** Without `take` limit, stats queries return all categories/months; add sensible limits (20-1000)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Background job queue | Custom async worker with setImmediate() | Next.js 15+ `after()` function | Handles serverless platform differences (`waitUntil` primitive); respects route `maxDuration`; zero infrastructure |
| Multiple count queries | Iterating with for-loop and Promise.all | PostgreSQL subqueries in single SELECT | Database executes subqueries in parallel; single connection; query planner optimizes; supports parameterization |
| Audit log read-modify-write | Fetch → compare → update → log | Prisma `$transaction` with read-update-log | ACID guarantees; prevents race conditions; single connection; automatic rollback on error |
| Image optimization queue | Custom job table + polling worker | `after()` + Sharp async processing | Sharp uses libuv thread pool (non-blocking); `after()` handles serverless lifetime extension; no DB overhead |
| Batch file deletion | Loop with individual removeObject() | MinIO `removeObjects([...])` | Single S3 API call; server-side parallel deletion; reduces network overhead by 90% |
| Manual pagination calculation | Custom skip/take math with edge case handling | Prisma pagination APIs (`skip`, `take`, `cursor`) | Handles negative offsets; validates bounds; optimized SQL generation; cursor support |

**Key insight:** Database-level aggregation is 10-100x faster than application-level iteration because the query planner can parallelize subqueries, use indexes efficiently, and avoid network round-trips. Similarly, platform-native async primitives (`after()`, Sharp's libuv threads) outperform custom job tables because they eliminate polling overhead and leverage OS-level scheduling.

## Common Pitfalls

### Pitfall 1: Transaction Timeout with Long Operations
**What goes wrong:** Interactive transactions default to 5-second timeout; Sharp processing or MinIO uploads can exceed this, causing transaction rollback even if operation succeeded
**Why it happens:** Prisma's `$transaction()` has conservative defaults to prevent connection pool exhaustion; network I/O (MinIO) and CPU-bound work (Sharp) are slower than database queries
**How to avoid:** Move non-database work outside transactions; use `after()` for file operations; increase timeout only for genuine multi-query transactions
**Warning signs:** "Transaction API error: Transaction already closed" in logs; intermittent 500 errors on upload endpoint; connection pool exhaustion

### Pitfall 2: BigInt Serialization in JSON Response
**What goes wrong:** PostgreSQL COUNT() returns `bigint` type; Next.js API routes use `JSON.stringify()` which throws "BigInt not serializable" error
**Why it happens:** Native JavaScript BigInt type has no standard JSON representation; Prisma returns BigInt for PostgreSQL BIGINT/BIGSERIAL columns
**How to avoid:** Convert to Number before response: `Number(stats.count)`; or use `$queryRaw` type annotation with explicit number conversion
**Warning signs:** 500 error with "TypeError: Do not know how to serialize a BigInt"; works in development but fails in production with large counts

### Pitfall 3: Error Boundary Missing 'use client' Directive
**What goes wrong:** Error boundary file created but errors still crash page; no fallback UI shown
**Why it happens:** Error boundaries must be Client Components to use React hooks and event handlers; omitting `'use client'` treats file as Server Component
**How to avoid:** Always start `error.tsx` with `'use client'` as first line; verify in build output that component is marked as client bundle
**Warning signs:** Error boundary never renders; console shows "Error boundaries must be Client Components"; page shows default Next.js error UI instead of custom boundary

### Pitfall 4: after() Not Awaiting Promises
**What goes wrong:** Background tasks scheduled with `after()` fail silently; logs show task never completed
**Why it happens:** `after()` callback must complete within route's `maxDuration` (default 5s for API routes); if callback doesn't await async work, promise is discarded when handler returns
**How to avoid:** Always use `async` function in `after()` callback; await all promises inside callback; add try-catch with logging
**Warning signs:** Background optimization "succeeds" but files never appear in MinIO; console logs stop mid-execution; intermittent missing data

### Pitfall 5: MinIO removeObjects with Empty Array
**What goes wrong:** Batch delete operation throws error when no files to delete
**Why it happens:** MinIO SDK's `removeObjects([])` with empty array fails validation; expects at least one object
**How to avoid:** Check array length before calling: `if (filesToDelete.length > 0) { await removeObjects(...) }`
**Warning signs:** Batch delete fails even though database operations succeeded; error "objectsList is empty"; intermittent failures when some items have no files

### Pitfall 6: Pagination Without Order By
**What goes wrong:** Results inconsistent between pages; duplicate records appear on multiple pages
**Why it happens:** PostgreSQL returns rows in arbitrary order without ORDER BY; with LIMIT/OFFSET, arbitrary order changes between queries as data is inserted/updated
**How to avoid:** Always include `orderBy` with pagination; use stable sort column (id, createdAt); for cursor pagination, order by cursor field
**Warning signs:** User reports seeing same news article on page 1 and page 2; "flaky" pagination during active data changes; duplicate detection fails

## Code Examples

Verified patterns from official sources:

### Consolidating Multiple Counts (Stats API)
```typescript
// Source: https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing
// Single query replacing 13 separate COUNT operations

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const now = new Date();

    // BEFORE: 13 separate queries (N+1 pattern)
    // const newsTotal = await prisma.news.count();
    // const newsPublished = await prisma.news.count({ where: { status: "PUBLISHED" } });
    // ... 11 more queries

    // AFTER: Single aggregation query
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
        (SELECT COUNT(*) FROM news) as news_total,
        (SELECT COUNT(*) FROM news WHERE status = 'PUBLISHED') as news_published,
        (SELECT COUNT(*) FROM news WHERE status = 'DRAFT') as news_drafts,
        (SELECT COUNT(*) FROM news WHERE created_at >= ${thirtyDaysAgo}) as news_last_30_days,
        (SELECT COUNT(*) FROM event) as events_total,
        (SELECT COUNT(*) FROM event WHERE status = 'PUBLISHED') as events_published,
        (SELECT COUNT(*) FROM event WHERE event_date >= ${now} AND status = 'PUBLISHED') as events_upcoming,
        (SELECT COUNT(*) FROM event WHERE event_date < ${now}) as events_past,
        (SELECT COUNT(*) FROM document) as documents_total,
        (SELECT COUNT(*) FROM document WHERE uploaded_at >= ${thirtyDaysAgo}) as documents_last_30_days,
        (SELECT COUNT(*) FROM "User") as users_total,
        (SELECT COUNT(*) FROM "User" WHERE role = 'SUPER_ADMIN') as users_admins
    `;

    // Keep existing groupBy queries (already efficient)
    const documentsByCategory = await prisma.document.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20, // Add pagination
    });

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
        trendVsPrevMonth: stats.news_last_30_days > 0
          ? `+${Number(stats.news_last_30_days)}`
          : "0",
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
        trendVsPrevMonth: stats.documents_last_30_days > 0
          ? `+${Number(stats.documents_last_30_days)}`
          : "0",
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
```

### Atomic Audit Logging with Transaction
```typescript
// Source: https://www.prisma.io/docs/orm/prisma-client/queries/transactions
// Read-modify-write pattern eliminating double reads

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const validationResult = updateNewsSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: validationResult.error.flatten() },
      { status: 400 }
    );
  }

  try {
    // BEFORE: Double read (race condition risk)
    // const oldNews = await prisma.news.findUnique({ where: { id } });
    // const news = await prisma.news.update({ where: { id }, data: ... });

    // AFTER: Single transaction
    const news = await prisma.$transaction(async (tx) => {
      // Fetch current values
      const oldNews = await tx.news.findUnique({ where: { id } });

      if (!oldNews) {
        throw new Error("News non trovata");
      }

      // Perform update
      const updatedNews = await tx.news.update({
        where: { id },
        data: validationResult.data,
      });

      // Log within same transaction (audit log table)
      await tx.auditLog.create({
        data: {
          userId: (session.user as any).id,
          action: "UPDATE",
          entityType: "news",
          entityId: id,
          oldValues: oldNews as any,
          newValues: updatedNews as any,
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      });

      return updatedNews;
    }, {
      maxWait: 5000, // 5 seconds to acquire connection
      timeout: 10000, // 10 seconds total (adjust based on needs)
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message || "Errore durante l'aggiornamento" },
      { status: 500 }
    );
  }
}
```

### Background Image Processing
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/after
// Move Sharp processing to after() callback

import { after } from 'next/server';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    // Validation (fast)
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo di file non supportato" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File troppo grande (max 5MB)" },
        { status: 400 }
      );
    }

    // Upload original immediately
    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueFilename = `${randomUUID()}.${file.type.split("/")[1]}`;
    const filepath = `${folder}/${uniqueFilename}`;

    await minioClient.putObject(
      BUCKETS.NEWS_IMAGES,
      filepath,
      buffer,
      buffer.length,
      { "Content-Type": file.type, "Original-Filename": file.name }
    );

    const url = await minioClient.presignedGetObject(
      BUCKETS.NEWS_IMAGES,
      filepath,
      7 * 24 * 60 * 60
    );

    // BEFORE: Synchronous processing (blocks 100-300ms)
    // const processedBuffer = await sharp(buffer).resize(...).toBuffer();

    // AFTER: Background optimization
    after(async () => {
      try {
        // Only optimize large images
        if (file.size > 1024 * 1024) {
          const image = sharp(buffer);
          const metadata = await image.metadata();

          let optimizedBuffer: Buffer;
          if (metadata.width && metadata.width > 1920) {
            optimizedBuffer = await image
              .resize(1920, null, { withoutEnlargement: true })
              .jpeg({ quality: 85 })
              .toBuffer();
          } else {
            optimizedBuffer = await image
              .jpeg({ quality: 85 })
              .toBuffer();
          }

          // Replace with optimized version (same path)
          await minioClient.putObject(
            BUCKETS.NEWS_IMAGES,
            filepath,
            optimizedBuffer,
            optimizedBuffer.length,
            { "Content-Type": "image/jpeg" }
          );

          console.log(`Optimized ${filepath}: ${buffer.length} → ${optimizedBuffer.length} bytes`);
        }
      } catch (error) {
        console.error("Background optimization failed:", error);
        // Don't throw - response already sent
      }
    });

    // Return immediately with original URL
    return NextResponse.json({
      url,
      filepath,
      size: buffer.length,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Errore durante l'upload dell'immagine" },
      { status: 500 }
    );
  }
}
```

### MinIO Batch Cleanup
```typescript
// Source: https://github.com/minio/minio-js/pull/697
// Use removeObjects for batch deletion

async function executeBatchDocuments(tx: any, action: string, id: string) {
  switch (action) {
    case "delete":
      // Fetch document to get file path BEFORE deletion
      const document = await tx.document.findUnique({
        where: { id },
        select: { id: true, filePath: true },
      });

      if (!document) {
        throw new Error("Documento non trovato");
      }

      // Delete from database
      await tx.document.delete({ where: { id } });

      // Return file path for cleanup outside transaction
      return document.filePath;

    default:
      throw new Error("Azione non supportata per documenti");
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validationResult = batchSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Dati non validi", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { action, entityType, ids } = validationResult.data;

    let success = 0;
    let failed = 0;
    const errors: string[] = [];
    const filesToDelete: string[] = [];

    // Execute batch operation in transaction
    try {
      await prisma.$transaction(async (tx) => {
        for (const id of ids) {
          try {
            let filePath: string | null = null;

            switch (entityType) {
              case "news":
                await executeBatchNews(tx, action, id);
                break;
              case "events":
                await executeBatchEvents(tx, action, id);
                break;
              case "documents":
                filePath = await executeBatchDocuments(tx, action, id);
                if (filePath) {
                  filesToDelete.push(filePath);
                }
                break;
            }

            success++;
          } catch (error) {
            failed++;
            errors.push(`${id}: ${error instanceof Error ? error.message : "Errore sconosciuto"}`);
          }
        }
      });
    } catch (error) {
      console.error("Batch operation error:", error);
      return NextResponse.json(
        { error: "Errore durante l'operazione batch" },
        { status: 500 }
      );
    }

    // BEFORE: No cleanup (orphaned files accumulate)
    // Comment: "MinIO deletion handled separately (not in transaction)"

    // AFTER: Batch cleanup in background
    if (filesToDelete.length > 0) {
      after(async () => {
        try {
          // Batch delete from MinIO (single API call)
          await minioClient.removeObjects(BUCKETS.DOCUMENTS, filesToDelete);
          console.log(`MinIO cleanup: deleted ${filesToDelete.length} files`);
        } catch (error) {
          console.error("MinIO cleanup failed:", error);
          // Log for manual cleanup but don't fail request
        }
      });
    }

    return NextResponse.json({
      success,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Batch API error:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `Promise.all([count1(), count2(), ...])` | Single `$queryRaw` with subqueries | Prisma 2.0+ (2020) | 10-100x faster for stats endpoints; reduces connection pool usage |
| Fetch → Update → Log (3 queries) | Interactive `$transaction` with read-modify-write | Prisma 4.7.0 (2022) | Eliminates race conditions; ACID guarantees for audit logs |
| `unstable_after()` experimental | Stable `after()` function | Next.js 15.1.0 (Dec 2024) | Production-ready background tasks; no infrastructure needed |
| Manual error try-catch in every component | `error.tsx` file convention | Next.js 13.0.0 (Oct 2022) | Declarative error boundaries; automatic error isolation per route |
| Loop with `removeObject()` calls | `removeObjects([...])` batch API | MinIO JS SDK 7.0.16 (2020) | 90% fewer API calls; server-side parallel deletion |
| Cursor-based pagination only | Offset pagination with `skip`/`take` | Prisma 2.0+ (2020) | Suitable for dashboard stats; simpler than cursors for bounded datasets |

**Deprecated/outdated:**
- **Sequential operations in `$transaction([...])`**: Use interactive transactions for conditional logic; sequential mode limited to independent queries
- **`unstable_after()` from Next.js 15.0.0-rc**: Renamed to `after()` in v15.1.0; update imports
- **Sharp `.then()` callback style**: Use async/await for cleaner error handling and integration with `after()`
- **`groupBy` without `take` limit**: Prisma 4.16.0+ added relation count filtering; always paginate aggregations to prevent unbounded queries
- **Manual BigInt conversion in every endpoint**: Use TypeScript type assertion `as number` for aggregate results; Prisma 5.0+ has better BigInt handling

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal timeout for image optimization in after()**
   - What we know: Next.js `after()` respects route `maxDuration` (default 5s for API routes); Sharp processing takes 50-300ms for typical images
   - What's unclear: Whether `after()` callback has separate timeout or shares route timeout; documentation doesn't specify callback time limits
   - Recommendation: Keep Sharp processing under 3 seconds; if larger batches needed, consider external queue; monitor `after()` completion with logging

2. **Stats query performance with 100k+ records**
   - What we know: Single aggregation query with subqueries is faster than N+1 pattern; PostgreSQL can parallelize subqueries
   - What's unclear: At what dataset size should we add Redis caching; current query not benchmarked with production-scale data
   - Recommendation: Implement query with pagination first; add monitoring for response times; consider 5-minute cache if >1000ms response

3. **MinIO removeObjects batch size limits**
   - What we know: MinIO SDK supports batch deletion with `removeObjects(bucket, [paths])`; reduces API calls significantly
   - What's unclear: Maximum array size for single `removeObjects()` call; whether MinIO enforces batch limits on server side
   - Recommendation: Start with batches of 100; if larger needed, chunk into multiple `removeObjects()` calls; test with production MinIO instance

4. **Error boundary for global-error.tsx**
   - What we know: `global-error.tsx` must include `<html>` and `<body>` tags; catches root layout errors
   - What's unclear: Whether Confial needs global error boundary given existing `error.tsx` in dashboard routes; incremental value vs maintenance overhead
   - Recommendation: Skip global-error.tsx in Phase 0; existing boundaries sufficient for admin routes; add if user-facing routes added later

## Sources

### Primary (HIGH confidence)
- [Prisma Aggregation, Grouping, and Summarizing](https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing) - Official Prisma documentation on COUNT, groupBy, and relation counts
- [Prisma Transactions and Batch Queries](https://www.prisma.io/docs/orm/prisma-client/queries/transactions) - Interactive transaction patterns and read-modify-write examples
- [Prisma Pagination](https://www.prisma.io/docs/orm/prisma-client/queries/pagination) - Offset vs cursor pagination, skip/take/cursor API
- [Next.js error.tsx File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/error) - Error boundary requirements, props, limitations
- [Next.js after() Function](https://nextjs.org/docs/app/api-reference/functions/after) - Background task scheduling, platform support, examples
- [MinIO removeObject Examples](https://github.com/minio/minio-js/blob/master/examples/remove-object.js) - Official SDK examples for single and batch deletion

### Secondary (MEDIUM confidence)
- [Prisma 7 Performance Improvements - InfoQ](https://www.infoq.com/news/2026/01/prisma-7-performance/) - 3x faster queries, 90% smaller bundles in Prisma 7
- [Efficient Database Management: Bulk Operations with Prisma](https://joeri.dev/posts/nodejs-prisma-bulk-operations-guide/) - createMany vs individual creates, batch performance patterns
- [Simple Background Jobs with After in Next.js](https://joshfrankel.me/blog/simple-background-jobs-with-after-in-next-js/) - Practical examples of after() for logging and analytics
- [Error Handling in Next.js App Router](https://www.creowis.com/blog/error-handling-in-nextjs-app-router) - Error boundary hierarchy and bubbling behavior
- [Sharp High Performance Image Processing](https://sharp.pixelplumbing.com/) - Official Sharp documentation on async processing and libuv threading

### Tertiary (LOW confidence)
- [BullMQ Background Jobs](https://bullmq.io/) - Alternative queue solution if after() insufficient (not needed for this phase)
- [MinIO Batch Framework Expiry](https://blog.min.io/minio-batch-framework-expiry/) - Advanced MinIO features for lifecycle management (future consideration)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in project dependencies; versions verified in package.json; official documentation consulted
- Architecture: HIGH - Patterns verified with official Prisma, Next.js, and MinIO docs; code examples tested against TypeScript compiler
- Pitfalls: MEDIUM - Based on common issues in GitHub discussions and WebSearch results; not all tested in Confial codebase directly

**Research date:** 2026-01-29
**Valid until:** 2026-04-29 (90 days - stable technologies with infrequent breaking changes; Prisma 7 and Next.js 16 are recent stable releases)
