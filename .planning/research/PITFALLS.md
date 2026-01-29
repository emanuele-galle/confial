# Pitfalls Research: Dashboard Enhancement Project

**Domain:** Admin Dashboard Enhancements (Next.js + Advanced UI/UX)
**Researched:** 2026-01-29
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Bundle Size Explosion from Uncontrolled Chart Library Imports

**What goes wrong:**
Importing entire chart libraries (Tremor/Recharts) or rich text editors (TipTap) without code splitting causes initial bundle to exceed 1MB+, resulting in dashboard load times over 5 seconds on 3G connections. The problem compounds when multiple heavy components load on the same page.

**Why it happens:**
Developers use standard imports (`import { BarChart } from '@tremor/react'`) instead of dynamic imports, causing all chart dependencies to bundle into the main JavaScript file. Recharts (Tremor's foundation) alone adds ~50KB, while TipTap with all extensions can add 100-200KB.

**How to avoid:**
1. **Always use dynamic imports for charts and rich editors:**
   ```typescript
   const BarChart = dynamic(() => import('@tremor/react').then(mod => ({ default: mod.BarChart })), {
     loading: () => <ChartSkeleton />,
     ssr: false
   });
   ```
2. **Import only needed TipTap extensions** (not the entire StarterKit)
3. **Set bundle size budget**: max 300KB for dashboard pages
4. **Use `next/bundle-analyzer`** to audit before deployment

**Warning signs:**
- Initial page load time > 2 seconds
- Lighthouse performance score drops below 80
- Bundle analyzer shows single chunk > 500KB
- Users report slow dashboard on mobile

**Phase to address:**
Phase 1 (Charts & Statistics) — establish code-splitting pattern immediately to prevent compounding in later phases

**Real-world example:**
[How We Cut Our React Bundle Size by 40% with Smart Code-Splitting](https://dev.to/gouranga-das-khulna/how-we-cut-our-react-bundle-size-by-40-with-smart-code-splitting-2chi) — team reduced dashboard load from 3.2s to 1.8s by lazy-loading chart components.

---

### Pitfall 2: PostgreSQL Full-Text Search Degrades Below 100ms at Scale

**What goes wrong:**
PostgreSQL full-text search performs well in development (<10k rows) but degrades to 2-5 seconds response time when content exceeds 100k rows. The problem is invisible until production scale, causing dashboard search to become unusable.

**Why it happens:**
Developers calculate `tsvector` on-the-fly in WHERE clauses instead of pre-computing and indexing. Without GIN indexes, PostgreSQL scans full table for each search query. Additionally, using `ts_rank` for relevance scoring fetches all matching rows before limiting, multiplying query time.

**How to avoid:**
1. **Pre-compute tsvector column with trigger:**
   ```sql
   ALTER TABLE content ADD COLUMN search_vector tsvector;
   CREATE INDEX idx_search_vector ON content USING GIN(search_vector);
   CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE ON content
     FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger(search_vector, 'pg_catalog.italian', title, body);
   ```
2. **Defer ranking** — fetch IDs with basic match first, rank only top 100 results
3. **Set performance target** — search must return results in <100ms at 200k rows
4. **Load test with production-scale data** (not just 100 test rows)

**Warning signs:**
- Search queries taking >500ms in production
- Slow Query Log shows `ts_query` without index usage
- Database CPU spikes during search operations
- EXPLAIN ANALYZE shows Seq Scan on content table

**Phase to address:**
Phase 3 (Advanced Search) — implement proper FTS architecture from start, not as optimization later

**Real-world example:**
[PostgreSQL Full-Text Search: 200M Rows Case Study](https://medium.com/@yogeshsherawat/using-full-text-search-fts-in-postgresql-for-over-200-million-rows-a-case-study-e0a347df14d0) — query times dropped from 12s to <1s with proper indexing.

---

### Pitfall 3: Bulk Operations Cause Partial Data Corruption Without Transactions

**What goes wrong:**
Bulk delete/update operations fail midway through execution, leaving database in inconsistent state. For example, deleting 50 content items succeeds for 30 records, fails on record 31 due to foreign key constraint, but first 30 records are already deleted. No rollback occurs, and audit trail is incomplete.

**Why it happens:**
ORM bulk operations (Prisma `deleteMany`, `updateMany`) do NOT wrap in transactions by default. Each record processes independently, and failures don't rollback previous successes. Developers assume bulk operations are atomic, but they're actually sequential independent operations.

**How to avoid:**
1. **Always wrap bulk operations in explicit transactions:**
   ```typescript
   await prisma.$transaction(async (tx) => {
     const deleted = await tx.content.deleteMany({ where: { id: { in: ids } } });
     await tx.auditLog.create({ data: { action: 'BULK_DELETE', count: deleted.count } });
   });
   ```
2. **Validate all constraints before execution** (check foreign keys, required fields)
3. **Implement optimistic locking** — check `updatedAt` timestamp to prevent concurrent edit conflicts
4. **Add bulk operation tests** with failure scenarios (simulate constraint violations)
5. **Log transaction boundaries** to audit log for debugging

**Warning signs:**
- Audit log count doesn't match actual changes
- Users report "partial deletions" or "some records didn't update"
- Database integrity constraint violations in logs
- Orphaned records (foreign key references deleted parents)

**Phase to address:**
Phase 4 (Bulk Operations) — critical to implement from start, cannot retrofit safely

**Real-world example:**
[Database Transactions: From ACID to Concurrency Control](https://blog.bytebytego.com/p/a-guide-to-database-transactions) — explains why explicit transactions are mandatory for bulk operations.

---

### Pitfall 4: CSV Export Enables Formula Injection Attacks

**What goes wrong:**
User-generated content exported to CSV files executes malicious formulas when opened in Excel/LibreOffice. Attacker injects payload like `=cmd|'/c calc'!A1` into profile name, which executes when admin downloads CSV export. This can exfiltrate data, execute commands, or compromise admin workstations.

**Why it happens:**
Developers treat CSV as plain text format and don't sanitize formula characters (`=`, `+`, `-`, `@`, tab, carriage return) at beginning of cells. Spreadsheet applications interpret these as formulas by default, creating remote code execution vector.

**How to avoid:**
1. **Sanitize all user-controlled fields before CSV export:**
   ```typescript
   function sanitizeForCSV(value: string): string {
     if (!value) return value;
     const firstChar = value.charAt(0);
     if (['=', '+', '-', '@', '\t', '\r'].includes(firstChar)) {
       return `'${value}`; // Prefix with single quote to force literal text
     }
     return value;
   }
   ```
2. **Apply to ALL fields** (names, emails, descriptions, custom fields — everything)
3. **Use CSV library with built-in protection** (papaparse with `escapeFormulae: true`)
4. **Add security test** — export malicious content and verify it doesn't execute
5. **Document in security policy** — CSV injection is OWASP recognized attack

**Warning signs:**
- CSV exports don't sanitize user input
- No security testing for export features
- Excel displays security warnings when opening exported files
- User-controlled content begins with `=`, `+`, `-`, or `@`

**Phase to address:**
Phase 4 (Bulk Operations) — export functionality introduced here, must prevent from start

**Real-world example:**
[OWASP CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection) — official OWASP documentation with attack vectors and prevention.

---

### Pitfall 5: Image Upload Processing Blocks Request Thread

**What goes wrong:**
Image uploads process synchronously on the request thread (resize, optimize, virus scan), causing API timeouts after 30 seconds for large images. Dashboard becomes unresponsive during uploads, and concurrent requests queue behind the blocking operation.

**Why it happens:**
Developers implement image processing in the API route handler instead of background job. Sharp.js/Jimp operations (resize, format conversion) are CPU-intensive and block Node.js event loop. The pattern works fine in development with small test images but fails in production with 10MB+ uploads.

**How to avoid:**
1. **Accept upload immediately, process in background:**
   ```typescript
   // API route: accept and return immediately
   const upload = await prisma.upload.create({ data: { url: rawUrl, status: 'PENDING' } });
   await queue.add('process-image', { uploadId: upload.id }); // N8N webhook or BullMQ
   return res.json({ id: upload.id, status: 'PENDING' });
   ```
2. **Use MinIO pre-signed URLs** for direct client-to-storage uploads (bypass API entirely)
3. **Set aggressive timeout limits** — if processing takes >5 seconds, force background
4. **Show processing status** — polling endpoint for upload status, real-time via WebSocket
5. **Implement virus scanning** (ClamAV via N8N workflow, not in hot path)

**Warning signs:**
- API route timeouts during image uploads
- High CPU usage on API server during uploads
- Users report "upload failed" for large images
- Concurrent requests slow down during image processing

**Phase to address:**
Phase 5 (Media Management) — architecture decision must be made at phase start

**Technical debt in codebase:**
CONCERNS.md documents "Image upload processing on hot path (synchronous)" as existing technical debt. This pitfall will compound the problem if not addressed.

---

### Pitfall 6: Mobile Responsive Dashboard Treats Mobile as Shrunk Desktop

**What goes wrong:**
Dashboard renders all desktop components on mobile at smaller size, resulting in unusable interface with tiny text, cramped tables, and non-functional charts. Navigation requires horizontal scrolling, and touch targets are too small (< 44px). Admin users abandon mobile dashboard entirely.

**Why it happens:**
Developers apply responsive CSS (Tailwind breakpoints) to desktop layout instead of designing separate mobile experience. They assume "responsive = working on mobile" but don't test actual mobile workflows. The mindset is "make it fit" instead of "redesign for mobile."

**How to avoid:**
1. **Mobile-first design principle** — design mobile layout first, enhance for desktop
2. **Cut 50% of desktop components for mobile** — show only critical metrics/actions
3. **Replace data tables with card layouts** on mobile (<768px)
4. **Hide charts on mobile** — link to dedicated chart view instead of cramming
5. **Touch targets minimum 44x44px** (iOS HIG standard)
6. **Test on real devices** — not just Chrome DevTools responsive mode
7. **Implement dashboard toggle** — "Mobile View" vs "Desktop View" option

**Warning signs:**
- Horizontal scrolling on mobile viewport
- Text smaller than 16px (requires zoom to read)
- Chart libraries render but are unreadable
- Touch targets overlap or too small to tap accurately
- Google Search Console reports "Mobile Usability Issues"

**Phase to address:**
Phase 6 (Responsive Design) — dedicated phase required, cannot bolt on at end

**Real-world example:**
[Admin Dashboard: Ultimate Guide 2026](https://www.weweb.io/blog/admin-dashboard-ultimate-guide-templates-examples) — emphasizes mobile dashboard is NOT a shrunk desktop, requires intentional limitation and redesign.

---

### Pitfall 7: N+1 Query Pattern in Statistics API

**What goes wrong:**
Statistics dashboard makes 1 query to fetch content list, then N additional queries to get stats for each content item (views, likes, comments). With 100 content items, this creates 101 database queries, taking 5+ seconds to render dashboard. Performance degrades linearly with content count.

**Why it happens:**
ORM makes N+1 queries easy to write accidentally (`content.forEach(async item => item.stats())`). Developers don't notice in development with 10 test records, but production has 1000+ records. The pattern is invisible in code review because it looks clean and maintainable.

**How to avoid:**
1. **Use ORM eager loading** (Prisma `include` or `select` with relations)
   ```typescript
   const content = await prisma.content.findMany({
     include: {
       stats: true,        // Single JOIN instead of N queries
       _count: { select: { comments: true } }
     }
   });
   ```
2. **Implement dataloader pattern** for complex aggregations (batch + cache)
3. **Add query count monitoring** — log total queries per request, alert if > 10
4. **Use database views** for pre-computed statistics
5. **Add performance test** — benchmark with 1000 records, require <500ms

**Warning signs:**
- Dashboard page load time increases linearly with content count
- Database connection pool exhaustion under load
- APM shows hundreds of queries for single page render
- Logs show repeated identical queries with different IDs

**Phase to address:**
Phase 1 (Charts & Statistics) — prevent from start, costly to refactor later

**Technical debt in codebase:**
CONCERNS.md explicitly documents "N+1 query pattern in stats API" as existing problem. This pitfall must be addressed to prevent compounding with new features.

---

### Pitfall 8: TipTap Editor Breaks on Concurrent Edits

**What goes wrong:**
Two admins edit the same content simultaneously. Admin A saves changes, then Admin B saves 30 seconds later. Admin B's save overwrites Admin A's changes completely with no warning or conflict resolution. Work is silently lost, causing frustration and data loss.

**Why it happens:**
Standard REST PUT/PATCH endpoints use "last write wins" strategy with no optimistic locking. TipTap provides real-time collaboration features (Yjs, Tiptap Collab) but these aren't implemented, so concurrent edits aren't detected. Developers assume admin users won't collide, but in practice they frequently do.

**How to avoid:**
1. **Implement optimistic locking with version field:**
   ```typescript
   // Require version parameter in update request
   const updated = await prisma.content.update({
     where: { id, version: body.version },  // Fails if version changed
     data: { ...body, version: { increment: 1 } }
   });
   if (!updated) throw new ConflictError('Content modified by another user');
   ```
2. **Show "currently editing" indicator** — display which users are viewing/editing
3. **Auto-save drafts** — save to separate draft table, not production content
4. **Conflict resolution UI** — show diff and let user choose merge strategy
5. **Consider real-time collaboration** — TipTap Collab with Yjs for simultaneous editing

**Warning signs:**
- Users report "my changes disappeared"
- Audit log shows multiple saves to same content within minutes
- Content reverts to older state unexpectedly
- No version tracking in database schema

**Phase to address:**
Phase 2 (Rich Text Editor) — concurrent edit handling must be part of editor architecture

**Real-world example:**
[Concurrency and Automatic Conflict Resolution](https://dev.to/frosnerd/concurrency-and-automatic-conflict-resolution-4i9o) — explains version vectors and optimistic locking strategies.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Loading all chart libraries in main bundle | Faster development (no dynamic import config) | 200-300KB bundle bloat, slow dashboard | Never — always code-split charts |
| Computing tsvector in WHERE clause | No schema changes required | 10x slower queries at scale | Only in MVP with <10k rows |
| Skipping transaction wrappers for bulk ops | Simpler code, fewer lines | Data corruption, audit trail gaps | Never — transactions are mandatory |
| Synchronous image processing in API route | Works in development | Timeouts, blocking, poor UX | Never — always use background jobs |
| No optimistic locking on content updates | Fewer database fields | Silent data loss from concurrent edits | Only for truly single-user systems |
| Inline styles instead of Tailwind for mobile | Quick responsive fixes | Inconsistent breakpoints, maintainability nightmare | Never — use design system |
| Eager loading ALL relations by default | Complete data in one query | Over-fetching, slow queries | Only for small datasets (<100 rows) |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| MinIO file uploads | Uploading through API proxy (slow, timeout-prone) | Use pre-signed URLs for direct client-to-MinIO uploads |
| N8N image processing | Calling N8N synchronously and waiting for response | Trigger N8N webhook async, poll status endpoint for completion |
| PostgreSQL FTS | Using basic LIKE queries for search (<10k rows) | Implement proper FTS with GIN indexes and tsvector from start |
| Prisma transactions | Assuming `$transaction` is automatic | Explicitly wrap bulk operations, test rollback scenarios |
| TipTap extensions | Importing entire StarterKit bundle | Import only needed extensions (Bold, Italic, Link, etc.) |
| Tremor charts | Server-side rendering charts (hydration mismatch) | Set `ssr: false` in dynamic import, charts are client-only |
| Context7 MCP | Assuming training data is current | ALWAYS query Context7 for library documentation, verify versions |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unindexed FTS queries | Search response time >2s | Create GIN indexes on tsvector columns | >100k rows |
| Loading all content for stats | Dashboard slow (>3s load time) | Paginate stats queries, implement infinite scroll | >1000 items |
| Synchronous image processing | API timeouts (>30s) | Move to background jobs (N8N workflow) | >5MB uploads |
| No chart code splitting | Initial page load >3s | Dynamic imports for all chart components | >3 charts per page |
| ts_rank on all results | Search ranking slow (>1s) | Rank only top 100 matches, not all results | >10k search results |
| Bulk operations without batching | Memory exhaustion, OOM errors | Process in batches of 100 records | >1000 records |
| Missing pagination in stats | Database connection pool exhaustion | Always paginate, default limit 50 | >500 concurrent users |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| No CSV sanitization on export | Formula injection → RCE on admin workstation | Prefix =+-@\t\r with single quote, use escapeFormulae: true |
| Missing file type validation | Malware upload via image field | Validate MIME type server-side, scan with ClamAV via N8N |
| No rate limiting on search | DOS via expensive FTS queries | Rate limit search endpoint (10 req/min per IP) |
| Exposing presigned URLs in logs | Temporary URL leakage | Redact URLs from logs, set short expiry (5 min) |
| No audit log for bulk deletes | Compliance violation, no forensics | Log every bulk operation with user, timestamp, affected IDs |
| Search query injection | SQL injection via ts_query | Use parameterized queries, validate search syntax |
| No RBAC on stats endpoints | Data leakage to unauthorized users | Implement role checks, filter stats by user permissions |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No loading states for charts | Dashboard appears broken, users refresh repeatedly | Skeleton loaders, show "Loading statistics..." |
| Bulk operations without confirmation | Accidental mass deletion, no undo | Confirmation modal: "Delete 47 items?" with preview |
| Search returns no results silently | Users think feature is broken | Show "No results for 'query'" with suggestions |
| Mobile dashboard too dense | Unusable on phone, requires horizontal scroll | Reduce metrics by 50%, card-based layout, vertical scroll |
| Image upload with no progress | Users don't know if upload is working | Progress bar, show file name, upload speed, ETA |
| Rich text editor autosave without indicator | Users don't know if changes are saved | "Saving..." → "Saved at 10:34 AM" indicator |
| Stats dashboard without date range filter | Can't compare periods, shows all-time only | Date range picker with presets (Last 7 days, Last month) |
| No empty states for new users | Blank dashboard looks broken | Onboarding: "Add your first content" with CTA |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Search:** Full-text search "works" but has no GIN indexes — verify `EXPLAIN ANALYZE` shows "Bitmap Index Scan"
- [ ] **Bulk Delete:** Deletes records but doesn't clean up MinIO files — verify orphaned file cleanup job exists
- [ ] **CSV Export:** Exports data but vulnerable to formula injection — verify sanitization with `=cmd|'/c calc'!A1` test payload
- [ ] **Image Upload:** Accepts uploads but no virus scanning — verify ClamAV integration or equivalent
- [ ] **Charts:** Render correctly but bloat bundle — verify code-split with `next/bundle-analyzer`
- [ ] **Rich Text Editor:** Saves content but loses concurrent edits — verify optimistic locking with version field
- [ ] **Mobile Dashboard:** Displays on mobile but unusable — verify touch targets ≥44px, no horizontal scroll
- [ ] **Statistics:** Shows numbers but N+1 queries — verify single query with JOINs, not loop of queries
- [ ] **Bulk Operations:** Complete successfully but no audit trail — verify audit log records user, timestamp, affected IDs
- [ ] **Presigned URLs:** Work but logged in plaintext — verify URL redaction in logs and monitoring

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Bundle size explosion | LOW | 1. Add bundle analyzer, 2. Identify large chunks, 3. Refactor to dynamic imports, 4. Deploy |
| FTS performance degradation | MEDIUM | 1. Add GIN indexes (5-30 min), 2. Add tsvector column, 3. Create trigger, 4. Backfill data |
| Data corruption from partial bulk op | HIGH | 1. Restore from backup, 2. Replay audit log, 3. Add transactions, 4. Re-test, 5. Re-deploy |
| CSV injection exploit | MEDIUM | 1. Rotate admin credentials, 2. Scan workstations, 3. Add sanitization, 4. Notify affected users |
| Image processing timeouts | LOW | 1. Move processing to N8N workflow, 2. Add status polling endpoint, 3. Update frontend |
| Mobile UX unusable | MEDIUM | 1. Hide non-critical components on mobile, 2. Convert tables to cards, 3. Test on real devices |
| Concurrent edit data loss | MEDIUM | 1. Add version field to schema, 2. Implement optimistic locking, 3. Add conflict resolution UI |
| N+1 query performance | LOW | 1. Add eager loading to query, 2. Test with production data scale, 3. Monitor query count |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Bundle size explosion | Phase 1 (Charts) | Bundle analyzer shows <300KB per page, Lighthouse score >80 |
| N+1 query pattern | Phase 1 (Charts) | APM shows <10 queries per dashboard page, <500ms response time |
| FTS performance degradation | Phase 3 (Search) | Search returns results in <100ms with 200k rows, GIN indexes present |
| Bulk operation data corruption | Phase 4 (Bulk Ops) | Transaction rollback test succeeds, audit log matches actual changes |
| CSV formula injection | Phase 4 (Bulk Ops) | Security test with `=calc` payload doesn't execute in Excel |
| Image processing blocking | Phase 5 (Media) | Upload API returns in <2s, processing happens in background |
| Mobile UX unusable | Phase 6 (Responsive) | Touch targets ≥44px, no horizontal scroll, mobile-specific layout |
| Concurrent edit conflicts | Phase 2 (Rich Text) | Optimistic locking test fails stale update, conflict resolution UI exists |

## Existing Technical Debt to Address

From codebase analysis (CONCERNS.md), the following issues will compound if not fixed during enhancement:

| Existing Debt | Impact on Enhancement | Must Fix By |
|---------------|----------------------|-------------|
| N+1 query pattern in stats API | Phase 1 charts will make it worse | Before Phase 1 |
| Missing pagination in stats queries | Phase 1 will add more unpaginated queries | Before Phase 1 |
| Double database reads in audit logging | Phase 4 bulk ops will double the waste | Before Phase 4 |
| Image upload processing on hot path | Phase 5 media features will compound timeouts | Before Phase 5 |
| No error boundaries on admin pages | New phases will crash entire dashboard on error | Before Phase 1 |
| MinIO cleanup not implemented in batch delete | Phase 4 bulk delete will orphan files | During Phase 4 |

## Performance Budget Constraints

From project context, these targets cannot be compromised:

| Metric | Target | Critical Threshold | Mitigation if Exceeded |
|--------|--------|-------------------|------------------------|
| Dashboard load time | <500ms | >1s | Remove features, aggressive code splitting |
| Search response time | <100ms | >200ms | Add indexes, reduce result set, cache queries |
| Bundle size per page | <300KB | >500KB | Dynamic imports mandatory, remove unused libraries |
| API endpoint timeout | <5s | >10s | Move to background jobs, return "processing" status |
| Database query count | <10/page | >20/page | Add eager loading, implement dataloader pattern |

## Sources

**Performance & Bundle Size:**
- [Next.js Dashboard Performance Best Practices](https://www.ksolves.com/blog/next-js/best-practices-for-saas-dashboards)
- [How We Cut React Bundle Size by 40% with Code-Splitting](https://dev.to/gouranga-das-khulna/how-we-cut-our-react-bundle-size-by-40-with-smart-code-splitting-2chi)
- [TipTap vs TinyMCE: Bundle Size Comparison](https://medium.com/@faisalmujtaba/tiptap-vs-tinymce-the-modern-vs-classic-rich-text-editor-showdown-7e197b8be9a3)
- [Next.js Dynamic Import Patterns 2026](https://daily.dev/blog/code-splitting-with-dynamic-imports-in-nextjs)

**Database & Search:**
- [PostgreSQL FTS: 200M Rows Case Study](https://medium.com/@yogeshsherawat/using-full-text-search-fts-in-postgresql-for-over-200-million-rows-a-case-study-e0a347df14d0)
- [PostgreSQL Full-Text Search Limitations](https://www.meilisearch.com/blog/postgres-full-text-search-limitations)
- [High-Performance Full Text Search in Postgres](https://risingwave.com/blog/implementing-high-performance-full-text-search-in-postgres/)

**Security:**
- [OWASP CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection)
- [CSV Formula Injection Prevention Methods](https://www.cyberchief.ai/2024/09/csv-formula-injection-attacks.html)
- [Next.js Security Update December 2025](https://nextjs.org/blog/security-update-2025-12-11)
- [Critical Next.js CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478)

**Transactions & Concurrency:**
- [Database Transactions Guide](https://blog.bytebytego.com/p/a-guide-to-database-transactions)
- [Concurrency and Automatic Conflict Resolution](https://dev.to/frosnerd/concurrency-and-automatic-conflict-resolution-4i9o)
- [Transaction and Bulk Copy Operations](https://learn.microsoft.com/en-us/dotnet/framework/data/adonet/sql/transaction-and-bulk-copy-operations)

**Mobile & UX:**
- [Admin Dashboard Ultimate Guide 2026](https://www.weweb.io/blog/admin-dashboard-ultimate-guide-templates-examples)
- [Mobile-Friendly Dashboard Design](https://www.deducive.com/blog/2018/11/30/how-to-build-a-mobile-dashboard-in-google-data-studio)

**Codebase Analysis:**
- `/home/sviluppatore/.planning/codebase/CONCERNS.md` — Existing technical debt documentation
- `/home/sviluppatore/.planning/codebase/STACK.md` — Current technology stack
- `/home/sviluppatore/.planning/codebase/ARCHITECTURE.md` — System architecture patterns

---

*Pitfalls research for: Admin Dashboard Enhancements*
*Researched: 2026-01-29*
*Confidence: HIGH (verified with 2026 sources and codebase analysis)*
