# Codebase Concerns

**Analysis Date:** 2026-01-29

## Tech Debt

**WIP State and Uncommitted Batch Updates:**
- Issue: Dashboard enhancements committed as "WIP: Dashboard enhancements in progress" (commit 77fc5e8) with mixed batch operation implementation, schema migrations, and seed data
- Files: `src/app/api/admin/batch/route.ts`, `src/app/api/admin/*/route.ts`, `prisma/schema.prisma`, `prisma/seed.ts`
- Impact: Future maintenance burden; commit message doesn't provide clear implementation status; seed data includes 469 lines of test data that shouldn't be in production commits
- Fix approach: Cherry-pick clean commits, separate seed data into optional migration script, document batch operation implementation status

**N+1 Query Pattern in Stats API:**
- Issue: Stats endpoint performs 13+ sequential database queries using `Promise.all([])` but each count query is separate without proper query batching
- Files: `src/app/api/admin/stats/route.ts` (lines 18-64)
- Impact: Performance degradation with large datasets; multiple round-trips to database; vulnerable to slow performance on high-traffic dashboards
- Fix approach: Use raw SQL aggregation query or reduce separate count calls; consider caching for 5-10 minutes

**Slug Collision Detection Loop:**
- Issue: Blocking while-loop checking for unique slug (lines 98-101 in `src/app/api/admin/news/route.ts`)
- Files: `src/app/api/admin/news/route.ts`, `src/app/api/admin/events/route.ts`
- Impact: Database query per collision; could timeout if many duplicates; inefficient for bulk operations
- Fix approach: Use unique constraint with ON CONFLICT or implement batch slug generation with collision handling

**Double Database Reads for Audit Logging:**
- Issue: PATCH and DELETE operations fetch record twice: once for audit log comparison, once for operation
- Files: `src/app/api/admin/news/[id]/route.ts` (lines 54, 56 for PATCH; lines 90, 92 for DELETE)
- Impact: Extra database round-trips; could cause race conditions if record modified between reads; inefficient transaction handling
- Fix approach: Use Prisma transaction to fetch and update in single operation; capture old values in transaction

**Uncaught Transaction Errors in Batch Operations:**
- Issue: Batch operation wraps transaction in try-catch but continues processing on transaction-level errors (lines 39-67 in `src/app/api/admin/batch/route.ts`)
- Files: `src/app/api/admin/batch/route.ts`
- Impact: Partial batch success with unclear transaction state; audit logs may be incomplete; client receives success count but transaction may have rolled back
- Fix approach: Throw on transaction failure; implement proper partial success reporting if needed; add error context logging

## Performance Bottlenecks

**Stats API Multiple Database Calls:**
- Problem: Raw SQL for monthly news data plus 12 separate COUNT queries in parallel batches (lines 50-64)
- Files: `src/app/api/admin/stats/route.ts`
- Cause: Each stat category uses separate `.count()` calls; no aggregation pipeline
- Improvement path: Use single raw SQL query with GROUP BY and AGGREGATE functions; implement Redis cache for 5-10 minute TTL; consider materialized views for complex stats

**Large Home Page Component:**
- Problem: 773 lines in `src/app/page.tsx` with all hero carousel logic, animations, and static data inline
- Files: `src/app/page.tsx`
- Cause: Single component handles render state, animation state, data transformation, and layout
- Improvement path: Extract carousel logic into `<HeroCarousel />` component; move slide data to separate file; split into smaller sub-components; implement code-splitting for animations

**Image Upload Processing on Hot Path:**
- Problem: Sharp image processing happens synchronously in API request (lines 53-70 in `src/app/api/upload/route.ts`)
- Files: `src/app/api/upload/route.ts`
- Cause: Image optimization (resize, JPEG encode) blocks response for 100ms+ files
- Improvement path: Implement async job queue for image processing; return presigned URL immediately, optimize in background; implement progressive image loading with placeholder

**Notification Polling Every 60 Seconds:**
- Problem: Fixed 60-second polling interval with no incremental updates or Web Socket fallback
- Files: `src/components/admin/notification-dropdown.tsx` (line 75)
- Cause: Fetches all notifications every 60s even if none are new
- Improvement path: Implement cursor-based pagination, fetch only since last timestamp; consider Server-Sent Events (SSE) for real-time updates

## Missing Critical Features

**Pagination Not Implemented in Stats Queries:**
- Issue: Document and news grouping queries don't limit results
- Files: `src/app/api/admin/stats/route.ts` (lines 41-57)
- Impact: With 1000+ documents or months of news, stats endpoint returns all rows; memory and performance issues
- Priority: High - blocks production at scale

**No Error Boundaries for Admin Pages:**
- Issue: Only one error.tsx exists for news; events, documents, users pages lack error handlers
- Files: Missing `src/app/(dashboard)/admin/events/error.tsx`, `src/app/(dashboard)/admin/documents/error.tsx`, etc.
- Impact: Unhandled component errors crash entire page; poor UX; no graceful fallback
- Priority: High - affects reliability

**MinIO Cleanup Not Implemented in Batch Delete:**
- Issue: Comment in batch delete function states "MinIO deletion handled separately (not in transaction)" but no cleanup is actually called
- Files: `src/app/api/admin/batch/route.ts` (lines 139-141)
- Impact: Orphaned files accumulate in MinIO storage; storage costs increase; no cleanup mechanism exists
- Priority: High - data integrity and cost issue

**Audit Log Not Logged for Batch Operations:**
- Issue: Batch delete/publish operations don't create audit logs
- Files: `src/app/api/admin/batch/route.ts`
- Impact: No audit trail for bulk changes; compliance risk; cannot trace who did what in bulk operations
- Priority: High - compliance and security

**Slug Uniqueness Not Enforced at Database Level:**
- Issue: Slug is unique at database level but collision detection is in application layer
- Files: `prisma/schema.prisma` (lines 89, 114)
- Impact: Race condition if two requests create slug simultaneously; database constraint allows application bugs to cause conflicts
- Priority: Medium - edge case but critical when it occurs

## Fragile Areas

**Bulk Actions Without Request Deduplication:**
- Files: `src/app/api/admin/batch/route.ts`
- Why fragile: No idempotency key or request deduplication; if client retries request, same batch processes twice; double-publishes articles, archive same items twice
- Safe modification: Add idempotency key field to schema; check for duplicate requests before processing; implement job scheduling with idempotency
- Test coverage: No integration tests for batch operations; no tests for partial failures

**Image Upload Without Validation Signatures:**
- Files: `src/app/api/upload/route.ts`
- Why fragile: Only validates MIME type header and file size; no magic bytes verification; malicious file could pass validation
- Safe modification: Use `file-type` package to verify actual file content; implement virus scanning integration; validate image dimensions
- Test coverage: No tests for invalid file types disguised as images

**Notification Dropdown State Synchronization:**
- Files: `src/components/admin/notification-dropdown.tsx`
- Why fragile: Local state can diverge from server if multiple tabs open; 60-second polling creates stale state between refreshes; no optimistic updates
- Safe modification: Implement Server-Sent Events or WebSocket for real-time updates; use React Query with background sync; add versioning to track state
- Test coverage: No tests for multi-tab scenarios or state divergence

**Transaction Error Propagation:**
- Files: `src/app/api/admin/batch/route.ts`
- Why fragile: Try-catch around transaction catches error but doesn't distinguish transaction rollback from validation errors
- Safe modification: Separate validation errors from transaction errors; implement retry logic with exponential backoff; log transaction state before failure
- Test coverage: No tests for transaction rollback scenarios

## Scaling Limits

**Single-Row Audit Log Inserts in Batch Operations:**
- Current capacity: 100 items per batch = 100 audit log writes; performs loop iteration per item (line 41-59)
- Limit: With 1000+ batch operations daily, audit log table grows unbounded; query performance degrades after millions of rows
- Scaling path: Implement bulk insert for audit logs; implement retention policy (keep 90 days); partition audit_logs table by date; add database indexes for common queries

**News/Events Full-Text Search Without Index:**
- Current capacity: ILIKE search works for small datasets (<5000 items)
- Limit: Query time increases exponentially with content size; no database-level full-text search index (lines 26-29)
- Scaling path: Add PostgreSQL full-text search columns; implement trigram indexes; use search engine (Elasticsearch/Meilisearch) if needed

**Notification Polling Without Rate Limiting:**
- Current capacity: 60-second polling works with <100 users
- Limit: With 1000+ concurrent users, 1000+ requests/min to notifications endpoint; database connection pool exhaustion
- Scaling path: Implement Server-Sent Events (SSE) or WebSocket; add caching layer for unread counts; implement client-side deduplication

## Security Considerations

**Batch Operations Missing Row-Level Security (RLS):**
- Risk: Batch API accepts IDs directly without verifying user authorization per item
- Files: `src/app/api/admin/batch/route.ts`
- Current mitigation: Only ADMIN/SUPER_ADMIN can access (auth check at line 15-19)
- Recommendations: Add per-item authorization check; implement role-based access control (RBAC) for bulk operations; log authorization failures; consider SUPER_ADMIN-only restriction for batch ops

**Image Upload No Virus Scanning:**
- Risk: Malicious images or disguised executables uploaded to MinIO
- Files: `src/app/api/upload/route.ts`
- Current mitigation: MIME type and file size validation only
- Recommendations: Integrate ClamAV or similar; validate image dimensions and metadata; store uploads outside web-accessible directory; implement content-disposition headers

**Presigned URLs Expire After 7 Days:**
- Risk: Old URLs could become accessible if expiration not enforced properly
- Files: `src/app/api/upload/route.ts` (line 93)
- Current mitigation: 7-day expiration time
- Recommendations: Reduce to 1 day for sensitive documents; log all presigned URL access; add IP restriction if possible; implement download logging

**Audit Log Stores Sensitive Data:**
- Risk: Password changes, token updates could be partially logged
- Files: `src/lib/audit-log.ts` (lines 43-55)
- Current mitigation: Sanitization function redacts known sensitive keys
- Recommendations: Implement field-level exclusion whitelist instead of blacklist; audit log tests; encrypt audit log data at rest; implement audit log access controls

## Dependencies at Risk

**Next.js 16 RC / Beta Features:**
- Risk: Using latest Next.js 16.1.6 which may have undiscovered bugs; `--turbopack` flag in dev mode is experimental
- Files: `package.json`, `package.json` (line 6)
- Impact: Unexpected performance issues, build failures, or production bugs
- Migration plan: Pin to stable 16.0.x once available; consider rolling back to 15.x if stability issues emerge

**Prisma 7.3.0 Recent Release:**
- Risk: Recent major version upgrade (from 7.1.0); potential breaking changes not fully tested in production
- Files: `package.json`, `prisma/schema.prisma`
- Impact: Unexpected migration issues, query behavior changes, connection pooling problems
- Migration plan: Monitor for issues; keep updated; have rollback plan to 7.1.0 if needed

**NextAuth v5 Beta:**
- Risk: Still in beta (v5.0.0-beta.30); not recommended for production
- Files: `package.json` (line 36)
- Impact: Unexpected auth issues, security vulnerabilities, breaking changes
- Migration plan: Upgrade to v5.0.0 stable when released; monitor GitHub issues closely; have fallback auth strategy

**Sharp Image Processing:**
- Risk: Sharp has native dependencies; could fail on certain architectures or require rebuild after deployment
- Files: `package.json`, `src/app/api/upload/route.ts`
- Impact: Image upload fails on deployment if native binaries mismatch
- Migration plan: Use Docker for consistent environment; test builds in production environment; monitor for codec issues

## Test Coverage Gaps

**Batch Operations Untested:**
- What's not tested: Happy path batch delete, publish, unpublish; partial failure scenarios; idempotency; transaction rollback
- Files: `src/app/api/admin/batch/route.ts`
- Risk: Bulk operations could corrupt data unnoticed; no regression detection
- Priority: Critical

**Image Upload Error Scenarios:**
- What's not tested: File type validation failures, size limit enforcement, Sharp processing errors, MinIO connection failures
- Files: `src/app/api/upload/route.ts`
- Risk: Incomplete error handling masks bugs; users get generic errors without context
- Priority: High

**Authentication Edge Cases:**
- What's not tested: Session expiration during long operations, concurrent requests from same user, role-based access denials
- Files: `src/app/api/**/route.ts`
- Risk: Auth failures could leak data or allow unauthorized access
- Priority: High

**Stats API Performance:**
- What's not tested: Large dataset performance, concurrent requests, cache coherency
- Files: `src/app/api/admin/stats/route.ts`
- Risk: Dashboard could become unusable under load
- Priority: Medium

**Notification Real-Time Sync:**
- What's not tested: Multiple tab synchronization, stale state handling, offline scenarios
- Files: `src/components/admin/notification-dropdown.tsx`
- Risk: Users see inconsistent notification state across tabs; missing critical alerts
- Priority: Medium

---

*Concerns audit: 2026-01-29*
