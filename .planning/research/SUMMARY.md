# Project Research Summary

**Project:** FAILMS Admin Dashboard Enhancement
**Domain:** Content Management System (CMS) Admin Interface
**Researched:** 2026-01-29
**Confidence:** HIGH

## Executive Summary

FAILMS is a labor union content management system requiring admin dashboard enhancements to reduce content management time by 50%. Expert CMS development practices emphasize three priorities: performance (dashboard load <500ms), accessibility (WCAG Level A minimum for public sector), and modern UX patterns (Cmd+K search, mobile-first responsive, rich text editing). The codebase already uses a solid Next.js 16 + React 19 + Prisma 7 + PostgreSQL 18 stack.

The recommended approach layers enhancement libraries onto the existing stack: Tremor for charts (built on Recharts), TipTap for WYSIWYG editing, react-easy-crop for image handling, and PostgreSQL full-text search (defer Meilisearch until proven necessary at >100k rows). This approach keeps bundle size under 300KB per page through aggressive code-splitting and dynamic imports. The key architectural pattern is background job processing for heavy operations (image optimization, CSV imports) to prevent API timeouts.

The critical risks center on performance degradation patterns that work in development but fail at production scale: N+1 query patterns (already present in codebase), unindexed full-text search (degrades to 5s at 100k rows), and synchronous image processing (causes 30s timeouts). Prevention requires establishing performance budgets and load testing at realistic scale during each phase, not after deployment. Additionally, CSV export features require formula injection protection from day one to prevent Excel-based remote code execution attacks.

## Key Findings

### Recommended Stack

The project should leverage its existing Next.js 16 + React 19 foundation and add specialized libraries for dashboard enhancements. Research shows modern admin dashboards prioritize developer velocity through pre-built components while maintaining strict bundle size discipline.

**Core technologies (already in place):**
- Next.js 16.x: App Router with server components — proven foundation for admin dashboards
- React 19.x: UI library with modern hooks — compatible with all recommended libraries
- Prisma 7.x: ORM with PostgreSQL support — enables complex queries with eager loading to prevent N+1
- PostgreSQL 18.x: Database with full-text search — built-in FTS sufficient for <100k rows with proper GIN indexes
- TailwindCSS 4.x: Utility-first CSS — consistent styling without custom CSS burden

**Enhancement libraries (to add):**
- Tremor 3.18.7: Pre-built chart components — 35+ accessible chart types, built on Recharts, perfect for admin dashboards (~140KB gzipped, requires code-splitting)
- TipTap 3.18.0: React-first WYSIWYG editor — modern alternative to Draft.js/Quill, modular extensions, Notion-style slash commands available (~50KB for starter-kit)
- react-easy-crop 5.5.6: Image cropping UI — mobile-friendly with drag/zoom, handles focal point selection for smart cropping (~15KB)
- react-dropzone 14.3.8: Drag-and-drop upload — industry standard, simple hook API, built-in validation (~10KB)
- csv-parse/csv-stringify 6.1.0/6.6.0: CSV processing — streaming API for memory efficiency, handles large exports/imports (~5KB combined)
- jest-axe 10.0.0: Accessibility testing — integrates axe-core with Jest, catches 57% of WCAG issues automatically

**Bundle size total: ~220KB gzipped** (leaves 80KB buffer within 300KB constraint)

**Search strategy:** Start with PostgreSQL FTS using tsvector columns and GIN indexes (achieves <100ms at 100k rows). Defer Meilisearch to post-MVP only if PostgreSQL FTS doesn't meet performance targets. Research shows most CMSs over-engineer search prematurely.

### Expected Features

Research into WordPress, Ghost, Strapi, and modern SaaS dashboards reveals clear feature tiers. Users compare admin interfaces to established CMSs, so missing table stakes features makes product feel incomplete.

**Must have (table stakes for v1):**
- Dashboard Overview: Real-time stats (optimized, <200ms), activity feed
- WYSIWYG Editor: Rich text formatting, link management, image insertion
- Media Library: Upload interface (drag-drop), grid/list view, search/filter
- Search: Basic full-text across content, entity filters (News/Events/Documents)
- Bulk Operations: Select multiple, bulk delete, bulk status change
- Mobile: Responsive layout, touch-optimized tables (card view on mobile)
- SEO: Meta fields (title, description, slug) with character counts
- Accessibility: Keyboard navigation, focus indicators, screen reader support

**Should have (competitive advantages for v1.x):**
- WYSIWYG Editor: Slash commands (Notion-style), AI content assistance (Gemini integration)
- Media Library: Focal point selection (smart cropping), auto-optimization, auto-tagging (AI)
- Search: Keyboard shortcut (Cmd+K), result highlighting, recent items
- Bulk Operations: CSV export (for reporting), CSV import (migrations)
- Mobile: Bottom navigation, offline draft saving (PWA)
- SEO: Readability score (Yoast-style), SERP preview, keyword density
- Accessibility: Alt text enforcement, color contrast checker

**Defer (avoid scope creep, v2+):**
- Real-time collaborative editing (Google Docs-style) — high complexity, low ROI for async labor union workflows
- Advanced workflow/approval system — creates bureaucracy, most teams have 1-2 approvers max
- Built-in newsletter builder — scope creep into email platform, use dedicated tools
- Multi-language content management (i18n) — no confirmed requirement, doubles database complexity
- Revision history with rollback — storage bloat, rare actual usage, audit log sufficient
- Custom fields builder (meta fields UI) — becomes schemaless mess, keep typed schema in code
- File version control — storage costs multiply, use timestamped filenames if needed
- Advanced analytics dashboard — use Google Analytics/Plausible, don't reinvent
- Built-in social media posting — API complexity, maintenance burden, use Buffer/Hootsuite

### Architecture Approach

The codebase follows modern Next.js App Router patterns with API routes and Prisma ORM. Enhancement features should layer onto this foundation without architectural rewrites. The key pattern is **separating synchronous user-facing operations from asynchronous background processing** to maintain sub-500ms dashboard performance.

**Major components:**

1. **Dashboard Statistics Layer** — Real-time metrics with aggressive caching and optimized queries. Must address existing N+1 query pattern (documented in CONCERNS.md) before adding new statistics. Use Prisma `include` for eager loading, implement Redis caching for computed aggregates, add query count monitoring to prevent regressions.

2. **Rich Text Editor Layer** — TipTap integration with modular extensions, dynamic imports to prevent bundle bloat. Implement optimistic locking (version field in database) to prevent concurrent edit data loss. Auto-save drafts to separate table, show "currently editing" indicators for multi-user coordination.

3. **Media Management Layer** — MinIO integration with pre-signed URLs for direct client-to-storage uploads (bypass API proxy). Background job processing via N8N webhooks for heavy operations (image optimization, virus scanning, AI auto-tagging). Implement focal point storage for smart cropping across aspect ratios.

4. **Search Layer** — PostgreSQL full-text search with pre-computed tsvector columns and GIN indexes. Generate tsvector via database triggers (not application code). Implement Cmd+K modal interface with keyboard navigation. Track search performance, trigger Meilisearch migration if queries consistently exceed 100ms at scale.

5. **Bulk Operations Layer** — Explicit transaction wrappers for all bulk operations (Prisma `$transaction`) to prevent partial data corruption. Implement CSV export with formula injection sanitization (prefix `=+-@\t\r` with single quote). Process bulk imports in batches of 100 records via background jobs. Create comprehensive audit log for forensics and compliance.

### Critical Pitfalls

Research identified eight critical pitfalls common in admin dashboard projects. These patterns work in development but fail at production scale or create security vulnerabilities.

1. **Bundle Size Explosion from Uncontrolled Chart Library Imports** — Importing entire chart libraries causes >1MB bundles and 5s load times. Solution: Dynamic imports for all charts (`next/dynamic` with `ssr: false`), import only needed TipTap extensions, use `next/bundle-analyzer` to enforce 300KB budget. Address in Phase 1 before pattern spreads.

2. **PostgreSQL Full-Text Search Degrades Below 100ms at Scale** — FTS performs well with 10k test rows but degrades to 2-5s at 100k+ rows without proper indexing. Solution: Pre-compute tsvector columns with database triggers, create GIN indexes, defer ranking to top 100 results only. Load test with 200k rows before launch. Address in Phase 3.

3. **Bulk Operations Cause Partial Data Corruption Without Transactions** — ORM bulk operations (Prisma `deleteMany`) aren't atomic by default, causing partial deletions when failures occur midway. Solution: Wrap all bulk operations in explicit `$transaction` blocks, validate constraints before execution, implement optimistic locking for concurrent edit protection. Address in Phase 4.

4. **CSV Export Enables Formula Injection Attacks** — User-generated content exported to CSV executes as formulas in Excel (e.g., `=cmd|'/c calc'!A1`), enabling RCE on admin workstations. Solution: Sanitize all fields with `sanitizeForCSV()` function that prefixes dangerous characters with single quote, use `escapeFormulae: true` in CSV library, add security test with malicious payload. Address in Phase 4 before export feature ships.

5. **Image Upload Processing Blocks Request Thread** — Synchronous image processing (resize, optimize, virus scan) causes 30s API timeouts with large uploads. Solution: Accept upload immediately, process in background via N8N webhook, show processing status with polling endpoint, implement pre-signed URLs for direct MinIO uploads. Address in Phase 5.

6. **Mobile Responsive Dashboard Treats Mobile as Shrunk Desktop** — Applying responsive CSS to desktop layout creates unusable mobile interface with tiny text and cramped tables. Solution: Mobile-first design, cut 50% of desktop components for mobile, replace tables with card layouts, ensure 44px touch targets, test on real devices. Address in Phase 6.

7. **N+1 Query Pattern in Statistics API** — Already present in codebase (documented in CONCERNS.md). Makes 1 query for content list + N queries for each item's stats, creating 101 queries for 100 items. Solution: Use Prisma eager loading (`include` with relations), implement dataloader pattern for complex aggregations, add query count monitoring. **Must fix before Phase 1 to prevent compounding.**

8. **TipTap Editor Breaks on Concurrent Edits** — Last-write-wins strategy causes silent data loss when two admins edit simultaneously. Solution: Implement optimistic locking with version field, show "currently editing" indicator, add conflict resolution UI, consider TipTap Collab with Yjs for real-time collaboration. Address in Phase 2.

## Implications for Roadmap

Based on research, suggested six-phase structure that sequences work by dependencies, groups related features, and prevents pitfalls through proper ordering:

### Phase 0: Technical Debt Resolution (CRITICAL — Before Phase 1)

**Rationale:** Must fix existing N+1 query pattern and missing pagination before adding dashboard statistics features. New features will compound these problems, making them exponentially harder to fix later.

**Delivers:** Clean foundation for dashboard enhancements
- Fix N+1 query pattern in stats API (convert to Prisma eager loading with `include`)
- Add pagination to all stats queries (default limit 50, max 100)
- Eliminate double database reads in audit logging
- Add error boundaries to admin pages (prevent full dashboard crash)
- Add query count monitoring (alert if >10 queries per page)

**Technical debt items:** All documented in CONCERNS.md as blockers for enhancement work

**Success criteria:** APM shows <10 queries per dashboard page, <500ms response time, no unpaginated queries

### Phase 1: Dashboard Statistics & Visualization

**Rationale:** Core value proposition is "50% time reduction" — must prove this with fast, informative dashboard first. Charts are highest bundle risk, so establish code-splitting pattern early before team develops bad habits.

**Delivers:** Real-time dashboard with optimized statistics
- Tremor chart components (dynamic imports, <300KB per page)
- Optimized stats queries (<200ms response, aggressive caching)
- Activity feed (recent edits/publishes with user attribution)
- Performance monitoring (bundle analyzer in CI/CD)

**Addresses features:** Dashboard Overview - Real-time Stats, Activity Feed

**Avoids pitfalls:** Bundle size explosion (dynamic imports mandatory), N+1 queries (eager loading pattern established)

**Research flag:** Standard patterns — Tremor documentation comprehensive, no additional research needed

### Phase 2: Rich Text Editor Enhancement

**Rationale:** Content creation is core workflow, must work flawlessly before adding peripheral features. TipTap integration requires concurrent edit handling from start (difficult to retrofit).

**Delivers:** Modern WYSIWYG editor with collaboration safety
- TipTap integration with starter-kit extensions (dynamic import)
- Image insertion from media library
- Link management with bubble menu
- Optimistic locking (version field) to prevent concurrent edit data loss
- "Currently editing" indicator for multi-user coordination
- Auto-save drafts to separate table

**Addresses features:** WYSIWYG Editor - Rich Text, Links, Images

**Avoids pitfalls:** Concurrent edit data loss (optimistic locking), bundle bloat (modular extensions only)

**Uses stack:** TipTap 3.18.0, @tiptap/starter-kit, @tiptap/extension-image

**Research flag:** May need deeper research — TipTap collaboration patterns if real-time editing becomes requirement

### Phase 3: Advanced Search

**Rationale:** Search performance issues invisible until production scale, must implement proper FTS architecture from start (not as later optimization). Depends on content being in database (Phase 2 ensures editing works).

**Delivers:** Fast full-text search with modern UX
- PostgreSQL FTS with pre-computed tsvector columns
- GIN indexes for <100ms queries at 200k rows
- Database triggers for automatic tsvector updates
- Cmd+K modal interface with keyboard navigation
- Entity filters (News/Events/Documents tabs)
- Result highlighting (PostgreSQL ts_headline)
- Performance monitoring (alert if >100ms queries)

**Addresses features:** Search - Basic Full-Text, Entity Filters, Keyboard Shortcut, Result Highlighting

**Avoids pitfalls:** FTS performance degradation (proper indexing from start), load tested with realistic data scale

**Research flag:** Standard patterns — PostgreSQL FTS well-documented, may need research if Meilisearch migration required

### Phase 4: Bulk Operations & CSV

**Rationale:** Efficiency multiplier for content management, but high risk for data corruption and security vulnerabilities. Must implement transactions and sanitization from start (cannot retrofit safely).

**Delivers:** Safe bulk operations with audit trail
- Selection UI (checkboxes, select all)
- Bulk delete with confirmation modal
- Bulk status change (draft/publish/archive)
- Explicit transaction wrappers (Prisma `$transaction`)
- CSV export with formula injection protection
- Comprehensive audit log (user, timestamp, affected IDs)
- MinIO orphaned file cleanup (integrate with bulk delete)

**Addresses features:** Bulk Operations - Select, Delete, Status Change, CSV Export

**Avoids pitfalls:** Partial data corruption (transactions), CSV formula injection (sanitization), audit trail gaps (comprehensive logging)

**Addresses technical debt:** MinIO cleanup not implemented in batch delete

**Research flag:** May need deeper research — CSV import in v2 has complex validation requirements

### Phase 5: Media Management Enhancement

**Rationale:** Image handling is performance bottleneck (synchronous processing on hot path documented in CONCERNS.md). Architecture decision (background jobs vs synchronous) must be made at phase start, difficult to migrate later.

**Delivers:** Scalable media management with background processing
- Upload interface (react-dropzone, drag-drop, multi-file)
- Pre-signed MinIO URLs (direct client-to-storage, bypass API)
- Background processing via N8N webhooks (optimization, virus scan)
- Focal point selection UI (react-easy-crop)
- Smart cropping with focal point awareness
- Processing status polling endpoint
- Grid/list view with search/filter

**Addresses features:** Media Library - Upload, Grid View, Search, Focal Point

**Avoids pitfalls:** Image processing blocking (background jobs), API timeouts (pre-signed URLs)

**Uses stack:** react-dropzone, react-easy-crop, MinIO integration, N8N workflows

**Addresses technical debt:** Image upload processing on hot path

**Research flag:** Standard patterns — Well-documented, no additional research needed

### Phase 6: Mobile Responsive Design

**Rationale:** Mobile UX cannot be bolted on at end — requires intentional component reduction and layout redesign. Must come after core features complete so mobile design can make informed decisions about what to show/hide.

**Delivers:** Full mobile editing experience
- Mobile-first responsive breakpoints
- Touch-optimized navigation (bottom nav on mobile)
- Card-based layouts (replace tables on <768px)
- 44px minimum touch targets
- Reduced component density (50% of desktop metrics)
- Hide/defer charts on mobile (link to dedicated view)
- Real device testing (iOS/Android)

**Addresses features:** Mobile - Responsive Layout, Touch Optimization, Bottom Navigation

**Avoids pitfalls:** Mobile as shrunk desktop (intentional limitation and redesign)

**Research flag:** Standard patterns — Mobile dashboard best practices well-documented

### Phase Ordering Rationale

- **Phase 0 first:** Technical debt compounds exponentially if not fixed before adding features. N+1 queries discovered early prevent performance crisis later.
- **Statistics before editor:** Proving efficiency gains validates project before investing in complex editor features.
- **Editor before search:** Need content in database before search becomes useful. TipTap concurrent edit handling difficult to retrofit.
- **Search before bulk ops:** Users need to find content before bulk operations make sense. FTS architecture must be right from start.
- **Bulk ops before media:** Selection UI patterns established, reused for media management. CSV sanitization lessons apply to image filename handling.
- **Media before mobile:** Mobile design decisions informed by complete feature set. Background processing architecture established for other async operations.
- **Mobile last:** Requires all features complete to make informed decisions about mobile component prioritization.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Rich Text Editor):** If real-time collaboration becomes requirement, need research on TipTap Collab + Yjs operational transforms
- **Phase 3 (Advanced Search):** If PostgreSQL FTS doesn't meet performance targets, need Meilisearch integration research (Docker setup, sync logic, migration strategy)
- **Phase 4 (Bulk Operations):** CSV import in v2 has complex validation and error handling requirements, likely needs dedicated research phase

Phases with standard patterns (skip research-phase):
- **Phase 0 (Technical Debt):** Well-documented ORM patterns, no research needed
- **Phase 1 (Statistics):** Tremor documentation comprehensive, established patterns
- **Phase 5 (Media Management):** Direct client uploads and background jobs are standard patterns
- **Phase 6 (Mobile):** Mobile dashboard best practices well-documented

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via npm (2026-01-29), official docs consulted, bundle sizes measured with bundlephobia. Tremor, TipTap, PostgreSQL FTS all production-proven. |
| Features | HIGH | Comprehensive competitor analysis (WordPress, Ghost, Strapi), modern SaaS dashboard research (2026 sources), clear table stakes vs differentiators. Feature dependencies mapped. |
| Architecture | HIGH | Codebase analysis completed (STACK.md, ARCHITECTURE.md, CONCERNS.md), existing patterns understood, enhancement layers well-defined. Background job pattern proven in production. |
| Pitfalls | HIGH | Research based on 2026 sources, real-world case studies, OWASP security guidance, existing technical debt documented. Performance budgets defined with measurable thresholds. |

**Overall confidence:** HIGH

Research is comprehensive and actionable. All recommended libraries are production-ready with active maintenance. Performance budgets are measurable (dashboard <500ms, search <100ms, bundle <300KB). Security concerns identified with concrete mitigations. Phase ordering is dependency-driven with clear rationale.

### Gaps to Address

While research confidence is high, the following areas need validation during implementation:

- **Search performance at scale:** Load testing with 200k+ rows required to validate PostgreSQL FTS <100ms target. If exceeded, trigger Meilisearch migration research. Set up monitoring to detect degradation early.

- **Concurrent editing patterns:** Simple optimistic locking (version field) recommended for v1. If users frequently encounter conflicts, may need to upgrade to TipTap Collab with operational transforms (requires additional research).

- **AI content assistance:** Deferred to post-MVP but high value differentiator. Need research on Gemini prompt engineering for labor union content (tone, terminology, compliance requirements). Budget token costs before implementation.

- **CSV import validation:** Deferred to v2 but complex validation requirements. Need research on error handling strategies (fail entire batch vs partial import with error report), preview/dry-run UX patterns.

- **Mobile usage patterns:** Assumptions about mobile component prioritization (50% reduction) need validation with actual usage analytics. May need to adjust based on real user behavior.

- **Bundle size reality check:** 220KB estimate assumes perfect tree-shaking. Real-world bundle may be 250-280KB. Monitor with `next/bundle-analyzer` in CI/CD, adjust if exceeding 300KB budget.

## Sources

### Primary (HIGH confidence)

**Stack Research:**
- [Tremor Documentation](https://www.tremor.so/) — Next.js integration guide, component library
- [TipTap Editor Docs](https://tiptap.dev/docs/editor/getting-started/install/nextjs) — Next.js App Router setup
- [react-easy-crop npm](https://www.npmjs.com/package/react-easy-crop) — v5.5.6 verified 2026-01-29
- [csv-parse npm](https://www.npmjs.com/package/csv-parse) — v6.1.0 verified 2026-01-29
- [jest-axe npm](https://www.npmjs.com/package/jest-axe) — v10.0.0 verified 2026-01-29
- [Recharts Bundle Size](https://bundlephobia.com/package/recharts) — 139KB gzipped verified
- [Tremor Bundle Size](https://bundlephobia.com/package/@tremor/react) — 494KB uncompressed verified

**Feature Research:**
- [Admin Dashboard: Ultimate Guide 2026](https://www.weweb.io/blog/admin-dashboard-ultimate-guide-templates-examples) — Modern dashboard patterns
- [21+ Best Next.js Admin Dashboard Templates 2026](https://nextjstemplates.com/blog/admin-dashboard-templates) — Feature comparison
- [WCAG 2.2 Accessibility Checklist 2026](https://theclaymedia.com/wcag-2-2-accessibility-checklist-2026/) — Compliance requirements
- [WordPress vs Ghost vs Strapi comparison](https://strapi.io/headless-cms/comparison/wordpressheadless-vs-ghost) — Competitor feature analysis

**Architecture Research:**
- [Next.js Dashboard Performance Best Practices](https://www.ksolves.com/blog/next-js/best-practices-for-saas-dashboards) — Code-splitting patterns
- [PostgreSQL FTS vs Dedicated Search Engines](https://nomadz.pl/en/blog/postgres-full-text-search-or-meilisearch-vs-typesense) — Performance thresholds
- [Supabase: Postgres FTS Guide](https://supabase.com/blog/postgres-full-text-search-vs-the-rest) — Implementation patterns

**Pitfalls Research:**
- [OWASP CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection) — Attack vectors and prevention
- [PostgreSQL FTS: 200M Rows Case Study](https://medium.com/@yogeshsherawat/using-full-text-search-fts-in-postgresql-for-over-200-million-rows-a-case-study-e0a347df14d0) — Performance optimization
- [Database Transactions Guide](https://blog.bytebytego.com/p/a-guide-to-database-transactions) — Transaction patterns
- [How We Cut React Bundle Size by 40%](https://dev.to/gouranga-das-khulna/how-we-cut-our-react-bundle-size-by-40-with-smart-code-splitting-2chi) — Code-splitting case study

### Secondary (MEDIUM confidence)

- [Which Rich Text Editor Framework 2025](https://liveblocks.io/blog/which-rich-text-editor-framework-should-you-choose-in-2025) — TipTap vs Lexical vs Slate
- [Meilisearch: When Postgres FTS Stops Being Good Enough](https://www.meilisearch.com/blog/postgres-full-text-search-limitations) — Migration triggers
- [Concurrency and Automatic Conflict Resolution](https://dev.to/frosnerd/concurrency-and-automatic-conflict-resolution-4i9o) — Optimistic locking strategies
- [CSV Formula Injection Prevention Methods](https://www.cyberchief.ai/2024/09/csv-formula-injection-attacks.html) — Sanitization techniques

### Codebase Analysis (VERIFIED)

- `/var/www/projects/confial/.planning/codebase/CONCERNS.md` — Technical debt documentation (N+1 queries, missing pagination, image processing on hot path)
- `/var/www/projects/confial/.planning/codebase/STACK.md` — Current stack inventory (Next.js 16, React 19, Prisma 7, PostgreSQL 18)
- `/var/www/projects/confial/.planning/codebase/ARCHITECTURE.md` — System architecture patterns

---
*Research completed: 2026-01-29*
*Ready for roadmap: yes*
*Next step: Create ROADMAP.md using phase structure above*
