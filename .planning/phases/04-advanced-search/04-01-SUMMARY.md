---
phase: "04"
plan: "01"
subsystem: "search-infrastructure"
tags: ["postgresql", "full-text-search", "italian-stemming", "search-api", "performance"]

requires:
  - "Phase 03: Media Library (database schema established)"

provides:
  - "PostgreSQL full-text search infrastructure with Italian language support"
  - "Cross-entity search API across News, Events, Documents"
  - "Highlighted search results with ts_headline"
  - "Faceted filtering and pagination"

affects:
  - "Phase 04-02: Search UI component will consume /api/search endpoint"
  - "Phase 05: Load testing will validate <100ms performance target"

tech-stack:
  added:
    - "PostgreSQL tsvector columns with GENERATED ALWAYS AS"
    - "GIN indices for fast full-text search"
    - "Italian text search configuration (built-in PostgreSQL)"
  patterns:
    - "Raw SQL with $queryRawUnsafe for FTS operations"
    - "UNION ALL for cross-entity search"
    - "ts_headline for highlighted snippets"
    - "ts_rank for relevance scoring"

key-files:
  created:
    - "prisma/migrations/20260129135143_add_search_vectors/migration.sql"
    - "src/lib/search.ts"
    - "src/app/api/search/route.ts"
  modified:
    - "prisma/schema.prisma (added searchVector Unsupported fields)"

decisions:
  - decision: "Use Italian text search configuration over custom dictionary"
    rationale: "PostgreSQL's built-in 'italian' config provides excellent stemming (lavoratori→lavor, sindacato→sindac) without additional setup"
    alternatives: "Custom snowball dictionary, external service (Meilisearch)"
    impact: "Zero-maintenance stemming, works out of the box"

  - decision: "GENERATED ALWAYS AS for search_vector columns"
    rationale: "Auto-updates on content changes, eliminates manual trigger maintenance"
    alternatives: "Triggers, application-level updates"
    impact: "Zero code needed to maintain search index, guaranteed consistency"

  - decision: "Weighted search (titles A, excerpts/descriptions B, content/location C)"
    rationale: "Title matches are more relevant than body matches"
    alternatives: "Uniform weight, boost by recency"
    impact: "Better search result quality, matches user expectations"

  - decision: "Prefix matching with :* suffix on query terms"
    rationale: "Supports autocomplete-style search (typing 'lav' matches 'lavoratori')"
    alternatives: "Exact match only, trigram similarity"
    impact: "Better UX for progressive search, forgiving of incomplete words"

  - decision: "120s cache with stale-while-revalidate=60"
    rationale: "Balances freshness with performance, reduces DB load"
    alternatives: "No cache, 300s cache like dashboard stats"
    impact: "Fast repeat searches, DB protected from query storms"

metrics:
  duration: "6 minutes"
  completed: "2026-01-29"

---

# Phase 04 Plan 01: Database Migration + Search API Summary

**One-liner:** PostgreSQL FTS with Italian stemming (lavoratori→lavor), cross-entity search API, highlighted results via ts_headline, 0.144ms query time

## What Was Delivered

### Database Infrastructure

**Migration:** `20260129135143_add_search_vectors`

- Added `search_vector tsvector` columns to `news`, `events`, `documents` tables
- Used `GENERATED ALWAYS AS` for automatic updates (no triggers needed)
- Weighted search: titles (A weight) > excerpts/descriptions (B) > content/location (C)
- Created GIN indices: `news_search_idx`, `events_search_idx`, `documents_search_idx`
- Italian text search configuration for proper stemming

**Performance:**
- 0.144ms execution time for typical query (tested with EXPLAIN ANALYZE)
- Well under <100ms target (will need load testing with 200k+ rows in Phase 5)

### Search Library (`src/lib/search.ts`)

**Core function:** `searchAll(query, filters, limit, offset)`

**Features:**
- Cross-entity search via UNION ALL query
- Query sanitization (escapes tsquery special chars)
- Prefix matching (`:*` suffix) for autocomplete-style search
- ts_headline for highlighted snippets with `<mark>` tags
- ts_rank for relevance scoring
- Faceted filtering:
  - Entity types (news, events, documents)
  - Status (DRAFT, PUBLISHED, ARCHIVED)
  - Date range (dateFrom, dateTo)
  - Author ID (for news)
  - Category (for documents)
- Pagination with configurable limit/offset
- Performance tracking (`took` field in response)

**Example query:**
```typescript
await searchAll("lavoratori", { types: ["news"], status: "PUBLISHED" }, 20, 0)
// Returns: { results: [...], total: N, query: "lavoratori", took: 5 }
```

### Search API (`src/app/api/search/route.ts`)

**Endpoint:** `GET /api/search?q={query}&types={types}&status={status}&...`

**Features:**
- Authentication required (NextAuth session check)
- Query parameters:
  - `q`: search query (required)
  - `types`: comma-separated entity types (optional, defaults to all)
  - `status`: content status filter (optional)
  - `dateFrom`, `dateTo`: date range (optional)
  - `authorId`: filter by author (optional)
  - `category`: document category filter (optional)
  - `page`: pagination page (default 1)
  - `limit`: results per page (default 20, max 50)
- Response includes pagination metadata:
  - `page`, `limit`, `total`, `totalPages`
- Cache headers: `Cache-Control: private, max-age=120, stale-while-revalidate=60`
- Error handling with 500 response on database errors

**Example response:**
```json
{
  "results": [
    {
      "id": "cmkyhrdcd0003tzl8oit6iyuz",
      "type": "news",
      "title": "Sicurezza sul Lavoro: Nuove Linee Guida",
      "headline": "Sicurezza sul <mark>Lavoro</mark>: Nuove Linee Guida per...",
      "url": "/admin/news/cmkyhrdcd0003tzl8oit6iyuz/edit",
      "status": "PUBLISHED",
      "date": "2026-01-29T12:00:00.000Z",
      "rank": 0.6946919
    }
  ],
  "total": 3,
  "query": "lavoro",
  "took": 5,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

## Technical Implementation Details

### Italian Stemming Verification

```sql
SELECT to_tsvector('italian', 'lavoratori sindacali');
-- Result: 'lavor':1 'sindacal':2

-- Demonstrates:
-- lavoratori → lavor
-- sindacali → sindacal
-- This allows "lavoratore" query to match "lavoratori" in content
```

### Search Vector Generation (Automatic)

```sql
-- News example (auto-generated, no manual maintenance):
search_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('italian', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('italian', coalesce(excerpt, '')), 'B') ||
  setweight(to_tsvector('italian', coalesce(content, '')), 'C')
) STORED;
```

### Query Sanitization

```typescript
// Input: "sindacato & lavoratori!"
// After sanitization: "sindacato:* & lavoratori:*"
//
// Escapes: & | ! ( ) : *
// Adds :* for prefix matching
// Joins with & (AND) for better results
```

### Cross-Entity UNION Query Pattern

```sql
WITH search_results AS (
  SELECT ... FROM news WHERE search_vector @@ to_tsquery(...)
  UNION ALL
  SELECT ... FROM events WHERE search_vector @@ to_tsquery(...)
  UNION ALL
  SELECT ... FROM documents WHERE search_vector @@ to_tsquery(...)
)
SELECT * FROM search_results
ORDER BY rank DESC, date DESC
LIMIT 20 OFFSET 0
```

## Verification Results

### Migration Status
```bash
$ npx prisma migrate status
Database schema is up to date!
```

### GIN Indices Exist
```bash
$ psql ... -c "SELECT indexname FROM pg_indexes WHERE indexname LIKE '%search_idx';"
news_search_idx
events_search_idx
documents_search_idx
```

### Italian Stemming Works
```bash
$ psql ... -c "SELECT to_tsvector('italian', 'lavoratori sindacali');"
'lavor':1 'sindacal':2
```

### Performance Test
```bash
$ EXPLAIN ANALYZE SELECT ... WHERE search_vector @@ to_tsquery('italian', 'sindac:*') ...
Execution Time: 0.144 ms  ✓ Well under <100ms target
```

### Search Results Test
```bash
$ psql ... -c "SELECT title, ts_headline(...) FROM news WHERE search_vector @@ to_tsquery('italian', 'lavor:*');"
Sicurezza sul <mark>Lavoro</mark>: Nuove Linee Guida...
Welfare Aziendale: ... per i <mark>Lavoratori</mark>
Sindacato <mark>lavoratori</mark>
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Prisma migration drift resolution**
- **Found during:** Task 1 (migration creation)
- **Issue:** Media table was created outside migrations in Phase 3, causing drift detection
- **Fix:** Created baseline migration to sync migration history with actual database state
- **Files modified:** `prisma/migrations/20260129135200_baseline/migration.sql`
- **Rationale:** Blocked ability to create new migrations; required to proceed

**2. [Rule 3 - Blocking] Shadow database conflict**
- **Found during:** Task 1 (migration creation)
- **Issue:** `prisma migrate dev` failed due to shadow database containing existing types
- **Fix:** Applied migration SQL directly via psql, marked as applied in Prisma history
- **Files modified:** None (workflow change)
- **Rationale:** Prisma's shadow DB approach conflicted with existing schema; direct SQL + resolve was cleaner

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | a69076d | feat(04-01): add full-text search infrastructure with Italian stemming |
| 2 | 817b323 | feat(04-01): add cross-entity search API with highlighted results |

## Next Phase Readiness

### Unblocked Work
- **Phase 04-02:** Search UI component can now consume `/api/search` endpoint
- **Phase 04-03:** Advanced filters can extend existing faceted filtering

### Known Limitations
- Performance validated with small dataset (~10 news items)
- Load testing needed with 200k+ rows to confirm <100ms target holds
- Cache strategy may need adjustment based on content update frequency

### Performance Considerations
- GIN index size grows with content volume (monitor disk usage)
- Consider pg_trgm extension if fuzzy matching needed (not in plan)
- Search query complexity (UNION ALL across 3 tables) scales linearly

### Future Enhancements (Out of Scope)
- Search result boosting by recency/featured status
- Synonym support (e.g., "CCL" → "contratto collettivo lavoro")
- Fuzzy matching for typo tolerance
- Search analytics (popular queries, zero-result queries)

## Architecture Notes

### Why PostgreSQL FTS Over External Service

**Decision rationale (from research phase):**
- Start simple: built-in FTS avoids external dependencies
- Italian stemming works excellently with PostgreSQL's 'italian' config
- <100ms target achievable with GIN indices
- Migrate to Meilisearch only if performance degrades >200ms at scale

**Validated in this phase:**
- 0.144ms query time confirms PostgreSQL FTS is sufficient for now
- Zero operational overhead (no separate service to maintain)
- Data stays in PostgreSQL (simpler transactions, no sync issues)

### Search Vector Generated Columns

**Benefits:**
- Zero maintenance: updates automatically on INSERT/UPDATE
- Always consistent: no chance of stale search index
- Transparent: application code doesn't know about search_vector

**Trade-offs:**
- Slightly slower writes (tsvector generation on every update)
- Cannot be async/background (happens in same transaction)
- Acceptable for admin dashboard (low write frequency)

### Cache Strategy

**120s max-age, 60s stale-while-revalidate:**
- Balances freshness with performance
- Admin searches often repeat (e.g., typing progressively)
- Prevents DB query storms during autocomplete
- Stale-while-revalidate ensures instant response even during revalidation

## Metrics

**Execution time:** 6 minutes

**Task breakdown:**
- Task 1 (Database migration): ~4 minutes (including drift resolution)
- Task 2 (Search library + API): ~2 minutes

**Performance:**
- Search query execution: 0.144ms (current dataset size)
- Target: <100ms (SRCH-11 requirement)
- Margin: 99.856ms headroom before optimization needed

**Code stats:**
- Search library: 200 lines (searchAll function + types)
- Search API: 67 lines (authentication, parsing, response)
- Migration SQL: 30 lines (3 tables × search_vector + indices)

## Lessons Learned

1. **Prisma migration drift:** When direct SQL changes are made (e.g., in Phase 3), create placeholder migration immediately to avoid drift
2. **Italian stemming quality:** PostgreSQL's built-in 'italian' config works better than expected (lavoratori→lavor, sindacato→sindac)
3. **Generated columns:** Perfect for search vectors in low-write scenarios (admin dashboards)
4. **Testing raw SQL:** EXPLAIN ANALYZE provides concrete performance numbers early

## Related Documentation

- **SRCH Requirements:** `.planning/research/REQUIREMENTS.md` (SRCH-01 through SRCH-14)
- **PostgreSQL FTS:** `.planning/research/STACK.md` (section on search infrastructure)
- **Roadmap:** `.planning/ROADMAP.md` (Phase 4 overview)

---

**Completed:** 2026-01-29
**Duration:** 6 minutes
**Status:** ✅ All success criteria met
