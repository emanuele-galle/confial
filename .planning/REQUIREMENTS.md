# Requirements: FAILMS Dashboard Enhancement

**Defined:** 2026-01-29
**Core Value:** Admins can manage content efficiently with professional-grade tools, reducing creation time by 50%

## v1 Requirements

### Phase 0: Technical Debt Resolution (CRITICAL)

- [ ] **DEBT-01**: Stats API optimized from N+1 pattern to single aggregation query
- [ ] **DEBT-02**: Stats queries include pagination (limit 1000 rows default)
- [ ] **DEBT-03**: Audit logging uses single transaction (no double reads)
- [ ] **DEBT-04**: Image upload processing moved to background (async job queue or immediate return)
- [ ] **DEBT-05**: Error boundaries added to all admin pages (news, events, documents, users)
- [ ] **DEBT-06**: MinIO cleanup implemented in batch delete operations

### Phase 1: Dashboard Overview Enhancement

- [ ] **DASH-01**: Stats cards show animated counters with Framer Motion
- [ ] **DASH-02**: Stats cards display mini sparkline charts (last 7 days)
- [ ] **DASH-03**: Stats cards show trend indicators with percentage change
- [ ] **DASH-04**: Dashboard displays 30-day trend chart with Tremor AreaChart
- [ ] **DASH-05**: Trend chart has time range selector (7d/30d/90d)
- [ ] **DASH-06**: Activity feed shows recent actions from AuditLog
- [ ] **DASH-07**: Activity feed uses cursor-based pagination
- [ ] **DASH-08**: Activity feed updates via SWR polling (30s interval)
- [ ] **DASH-09**: Stats API uses Next.js fetch caching (revalidate: 300s)
- [ ] **DASH-10**: Dashboard layout is 4-col stats grid (responsive: 2-col tablet, 1-col mobile)

### Phase 2: Advanced Editor

- [ ] **EDIT-01**: TipTap editor installed with starter-kit extensions
- [ ] **EDIT-02**: Editor supports YouTube/Vimeo video embeds
- [ ] **EDIT-03**: Editor supports table insert and editing
- [ ] **EDIT-04**: Editor supports text alignment (left/center/right/justify)
- [ ] **EDIT-05**: Editor has bubble menu on text selection
- [ ] **EDIT-06**: Editor supports slash commands for quick formatting
- [ ] **EDIT-07**: Editor integrates media library picker for image insertion
- [ ] **EDIT-08**: Editor has link dialog with preview and attributes (target, rel)
- [ ] **EDIT-09**: Editor is code-split with dynamic import (not in initial bundle)
- [ ] **EDIT-10**: Editor works in BlogPostForm and EventForm

### Phase 3: Media Library

- [ ] **MEDIA-01**: Media Library dialog shows virtual scrolled grid
- [ ] **MEDIA-02**: Media Library supports multi-file drag & drop upload
- [ ] **MEDIA-03**: Media Library has infinite scroll pagination
- [ ] **MEDIA-04**: Media Library has search and filter sidebar
- [ ] **MEDIA-05**: Media has folder organization system
- [ ] **MEDIA-06**: Media has tag system (array field)
- [ ] **MEDIA-07**: Media crop modal with react-easy-crop integration
- [ ] **MEDIA-08**: Media crop supports aspect ratios (16:9, 4:3, 1:1, free)
- [ ] **MEDIA-09**: Media has AI-powered focal point detection (Claude vision)
- [ ] **MEDIA-10**: Media generates thumbnails on-the-fly with Sharp
- [ ] **MEDIA-11**: Standalone media page at /dashboard/media
- [ ] **MEDIA-12**: API endpoint GET /api/media/list with pagination
- [ ] **MEDIA-13**: API endpoint POST /api/media/upload (multi-file)
- [ ] **MEDIA-14**: API endpoint PATCH /api/media/[id] (update metadata)
- [ ] **MEDIA-15**: API endpoint GET /api/media/[id]/thumbnail (on-the-fly resize)
- [ ] **MEDIA-16**: API endpoint POST /api/media/crop (with coordinates)

### Phase 4: Advanced Search

- [ ] **SRCH-01**: Database migration adds search_vector tsvector column to news
- [ ] **SRCH-02**: Database migration adds search_vector tsvector column to events
- [ ] **SRCH-03**: Database migration adds search_vector tsvector column to documents
- [ ] **SRCH-04**: GIN indices created on all search_vector columns
- [ ] **SRCH-05**: Search supports Italian language stemming configuration
- [ ] **SRCH-06**: Global search component with debounced input (300ms)
- [ ] **SRCH-07**: Search returns cross-entity results (News, Events, Documents)
- [ ] **SRCH-08**: Search results show highlights with ts_headline
- [ ] **SRCH-09**: Search has faceted filters sidebar (status, date range, author, category)
- [ ] **SRCH-10**: Search supports keyboard navigation (arrows + Enter)
- [ ] **SRCH-11**: Search API endpoint < 100ms response time
- [ ] **SRCH-12**: Search results cached with Next.js fetch (revalidate: 120s)

### Phase 5: Bulk Operations

- [ ] **BULK-01**: CSV import supports News entity with validation
- [ ] **BULK-02**: CSV import supports Events entity with validation
- [ ] **BULK-03**: CSV import validates with Zod schemas before processing
- [ ] **BULK-04**: CSV import uses transactions (all-or-nothing)
- [ ] **BULK-05**: CSV import shows progress tracking via SSE
- [ ] **BULK-06**: CSV export supports News, Events, Documents entities
- [ ] **BULK-07**: CSV export sanitizes formulas (prevent CSV injection)
- [ ] **BULK-08**: CSV export includes all metadata fields
- [ ] **BULK-09**: Batch delete wrapped in transaction with MinIO cleanup
- [ ] **BULK-10**: Batch status change (publish/archive) uses transaction

### Phase 6: Mobile & Accessibility

- [ ] **MOBL-01**: Dashboard responsive at sm breakpoint (1-col stack)
- [ ] **MOBL-02**: Dashboard responsive at md breakpoint (2-col stats, swipeable sidebar)
- [ ] **MOBL-03**: Dashboard responsive at lg breakpoint (4-col stats, fixed sidebar)
- [ ] **MOBL-04**: Bottom navigation component for mobile devices
- [ ] **MOBL-05**: Swipeable sidebar with Framer Motion drag gestures
- [ ] **MOBL-06**: All touch targets minimum 44x44px
- [ ] **A11Y-01**: Color contrast fixed (#018856 → #016030) for WCAG AA
- [ ] **A11Y-02**: Skip links added to dashboard layout for keyboard navigation
- [ ] **A11Y-03**: ARIA labels added to charts, notifications, activity feed
- [ ] **A11Y-04**: Screen reader support with fallback tables for charts
- [ ] **A11Y-05**: Focus-visible styling improved across all interactive elements
- [ ] **A11Y-06**: High contrast mode toggle implemented
- [ ] **A11Y-07**: Keyboard navigation works for all admin workflows (arrows, Esc, Enter)
- [ ] **A11Y-08**: Lighthouse Accessibility score > 90
- [ ] **A11Y-09**: axe-core audit passes with 0 critical issues

### Phase 7: SEO Tools

- [ ] **SEO-01**: SEO panel component created for content forms
- [ ] **SEO-02**: Flesch Reading Ease readability score calculated
- [ ] **SEO-03**: Keyword density visualization displayed
- [ ] **SEO-04**: Google Search preview (desktop) with meta title/description
- [ ] **SEO-05**: Google Search preview (mobile) with meta title/description
- [ ] **SEO-06**: Top phrases extraction with NLP (compromise.js)
- [ ] **SEO-07**: Content templates system (save template)
- [ ] **SEO-08**: Content templates system (load template)
- [ ] **SEO-09**: Template picker dialog with categories
- [ ] **SEO-10**: Standalone templates page at /dashboard/templates

## v2 Requirements

### Future Enhancements (Post-MVP)

- **PERF-01**: Meilisearch migration (only if PostgreSQL FTS > 200ms after 30 days)
- **PERF-02**: Redis caching layer (only if concurrent users > 10)
- **COLLAB-01**: Real-time collaborative editing with Yjs + WebSocket
- **SCHED-01**: Scheduled publishing with cron jobs
- **EMAIL-01**: Email notification system for content approvals
- **HOOK-01**: Webhooks for external integrations
- **ANAL-01**: GA4 analytics integration in dashboard
- **I18N-01**: Multi-language support for content

## Out of Scope

| Feature | Reason |
|---------|--------|
| Redis caching infrastructure | Next.js fetch caching + SWR sufficient for current load; add only if proven bottleneck |
| Real-time collaborative editing | High complexity (Yjs, WebSocket, conflict resolution); not core value for labor union use case |
| Built-in newsletter builder | Separate product domain; N8N workflows handle email distribution |
| Revision history with rollback | Database complexity (snapshot storage); audit log sufficient for compliance |
| Custom fields builder | Over-engineering; fixed content schema works for labor union needs |
| File version control | Document management system scope; MinIO versioning disabled to save storage |
| Advanced workflow approvals | Organization doesn't require multi-tier approval process |
| Social media posting integration | N8N workflows already handle Facebook/LinkedIn posting |
| Multi-language i18n | Labor union serves Italian audience only; not needed |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEBT-01 | Phase 0 | Complete |
| DEBT-02 | Phase 0 | Complete |
| DEBT-03 | Phase 0 | Complete |
| DEBT-04 | Phase 0 | Complete |
| DEBT-05 | Phase 0 | Complete |
| DEBT-06 | Phase 0 | Complete |
| DASH-01 | Phase 1 | Pending |
| DASH-02 | Phase 1 | Pending |
| DASH-03 | Phase 1 | Pending |
| DASH-04 | Phase 1 | Pending |
| DASH-05 | Phase 1 | Pending |
| DASH-06 | Phase 1 | Pending |
| DASH-07 | Phase 1 | Pending |
| DASH-08 | Phase 1 | Pending |
| DASH-09 | Phase 1 | Pending |
| DASH-10 | Phase 1 | Pending |
| EDIT-01 | Phase 2 | Pending |
| EDIT-02 | Phase 2 | Pending |
| EDIT-03 | Phase 2 | Pending |
| EDIT-04 | Phase 2 | Pending |
| EDIT-05 | Phase 2 | Pending |
| EDIT-06 | Phase 2 | Pending |
| EDIT-07 | Phase 2 | Pending |
| EDIT-08 | Phase 2 | Pending |
| EDIT-09 | Phase 2 | Pending |
| EDIT-10 | Phase 2 | Pending |
| MEDIA-01 | Phase 3 | Pending |
| MEDIA-02 | Phase 3 | Pending |
| MEDIA-03 | Phase 3 | Pending |
| MEDIA-04 | Phase 3 | Pending |
| MEDIA-05 | Phase 3 | Pending |
| MEDIA-06 | Phase 3 | Pending |
| MEDIA-07 | Phase 3 | Pending |
| MEDIA-08 | Phase 3 | Pending |
| MEDIA-09 | Phase 3 | Pending |
| MEDIA-10 | Phase 3 | Pending |
| MEDIA-11 | Phase 3 | Pending |
| MEDIA-12 | Phase 3 | Pending |
| MEDIA-13 | Phase 3 | Pending |
| MEDIA-14 | Phase 3 | Pending |
| MEDIA-15 | Phase 3 | Pending |
| MEDIA-16 | Phase 3 | Pending |
| SRCH-01 | Phase 4 | Pending |
| SRCH-02 | Phase 4 | Pending |
| SRCH-03 | Phase 4 | Pending |
| SRCH-04 | Phase 4 | Pending |
| SRCH-05 | Phase 4 | Pending |
| SRCH-06 | Phase 4 | Pending |
| SRCH-07 | Phase 4 | Pending |
| SRCH-08 | Phase 4 | Pending |
| SRCH-09 | Phase 4 | Pending |
| SRCH-10 | Phase 4 | Pending |
| SRCH-11 | Phase 4 | Pending |
| SRCH-12 | Phase 4 | Pending |
| BULK-01 | Phase 5 | Pending |
| BULK-02 | Phase 5 | Pending |
| BULK-03 | Phase 5 | Pending |
| BULK-04 | Phase 5 | Pending |
| BULK-05 | Phase 5 | Pending |
| BULK-06 | Phase 5 | Pending |
| BULK-07 | Phase 5 | Pending |
| BULK-08 | Phase 5 | Pending |
| BULK-09 | Phase 5 | Pending |
| BULK-10 | Phase 5 | Pending |
| MOBL-01 | Phase 6 | Pending |
| MOBL-02 | Phase 6 | Pending |
| MOBL-03 | Phase 6 | Pending |
| MOBL-04 | Phase 6 | Pending |
| MOBL-05 | Phase 6 | Pending |
| MOBL-06 | Phase 6 | Pending |
| A11Y-01 | Phase 6 | Pending |
| A11Y-02 | Phase 6 | Pending |
| A11Y-03 | Phase 6 | Pending |
| A11Y-04 | Phase 6 | Pending |
| A11Y-05 | Phase 6 | Pending |
| A11Y-06 | Phase 6 | Pending |
| A11Y-07 | Phase 6 | Pending |
| A11Y-08 | Phase 6 | Pending |
| A11Y-09 | Phase 6 | Pending |
| SEO-01 | Phase 7 | Pending |
| SEO-02 | Phase 7 | Pending |
| SEO-03 | Phase 7 | Pending |
| SEO-04 | Phase 7 | Pending |
| SEO-05 | Phase 7 | Pending |
| SEO-06 | Phase 7 | Pending |
| SEO-07 | Phase 7 | Pending |
| SEO-08 | Phase 7 | Pending |
| SEO-09 | Phase 7 | Pending |
| SEO-10 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 76 total
- Mapped to phases: 76 (8 phases including Phase 0)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-29*
*Last updated: 2026-01-29 after initialization*
