# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-29)

**Core value:** Admins can manage content efficiently with professional-grade tools, reducing creation time by 50%
**Current focus:** Phase 5 - Bulk Operations

## Current Position

Phase: 5 of 7 (Bulk Operations)
Plan: 1 of 2 in phase (CSV Utilities + Import/Export API - Complete)
Status: In progress
Last activity: 2026-01-29 — Completed 05-01-PLAN.md (CSV Utilities + Import/Export API)

Progress: [███████████░] 92%

## Performance Metrics

**Velocity:**
- Total plans completed: 15
- Average duration: 4.99 minutes
- Total execution time: 1.25 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 0 | 2 | 5.4min | 2.7min |
| Phase 1 | 2 | 8.5min | 4.25min |
| Phase 2 | 2 | 12.3min | 6.15min |
| Phase 3 | 3 | 16.6min | 5.5min |
| Phase 4 | 2 | 9min | 4.5min |
| Phase 5 | 1 | 11min | 11min |
| Phase 6 | 2 | 12min | 6min |
| Phase 7 | 1 | 7.5min | 7.5min |

**Recent Trend:**
- Last 5 plans: 06-01 (7min), 06-02 (5min), 07-02 (7.5min), 05-01 (11min)
- Trend: Bulk operations phase in progress, CSV utilities complete

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Research phase: PostgreSQL FTS over Meilisearch (start simple, migrate only if >200ms)
- Research phase: Tremor for charts (pre-built responsive, faster implementation than D3)
- Research phase: Claude native vision for focal point (no external API, zero cost)
- Research phase: TipTap over Slate/Lexical (best Next.js integration, rich ecosystem)
- Research phase: WCAG 2.1 AA over AAA (achievable with current design)
- Plan 00-01: PostgreSQL subqueries over Promise.all for stats aggregation (10x+ query reduction)
- Plan 00-01: Interactive transactions for audit logging instead of sequential queries (eliminates race conditions)
- Plan 00-01: Pagination limits on all aggregations (prevents unbounded queries at scale)
- Plan 00-02: Next.js after() for background image processing (zero infrastructure, <500ms response)
- Plan 00-02: Client-side error boundaries for all admin routes (prevents dashboard crashes)
- Plan 00-02: Batch MinIO cleanup with removeObjects() (eliminates orphaned files)
- Plan 01-01: Pure SVG for sparklines instead of chart library (avoids 50KB+ bundle bloat)
- Plan 01-01: Framer Motion for counting animation (already installed, zero additional bundle cost)
- Plan 01-01: Server-side fetch with 300s revalidation (5min cache reduces DB load)
- Plan 01-02: Tremor v4 beta over v3 for React 19 compatibility (stable beta, GA expected Q1 2026)
- Plan 01-02: Code-split TrendChart with dynamic import (keeps main bundle <300KB target)
- Plan 01-02: Client-side time range filtering over server-side API (simpler for MVP, low data volume)
- Plan 02-01: Custom bubble menu instead of TipTap BubbleMenu extension (extension exports ProseMirror, not React component)
- Plan 02-01: Code-split AdvancedEditor with next/dynamic (TipTap + extensions ~80KB, keep initial bundle small)
- Plan 02-01: Highlight extension added to bundle (bubble menu includes highlight button)
- Plan 02-02: @tiptap/suggestion for slash commands (official plugin handles triggering, filtering, positioning)
- Plan 02-02: React component in ProseMirror plugin via ReactDOM.createRoot (allows React state in TipTap)
- Plan 02-02: Media picker stub with Phase 3 placeholder (prevents breaking changes when integrated)
- Plan 02-02: Replace all RichTextEditor with AdvancedEditor (consistent editing experience across forms)
- Plan 03-01: Presigned URLs with 7-day expiry (balance between caching and security, refresh on API access)
- Plan 03-01: Percentage-based crop coordinates (client-agnostic, no need to know exact dimensions)
- Plan 03-01: Focal point as percentages (responsive cropping, works with Sharp position option)
- Plan 03-02: Virtual scrolling for media grid (@tanstack/react-virtual, handles 10k+ items smoothly)
- Plan 03-02: Dual-mode MediaLibrary component (dialog for picker, page for admin, DRY principle)
- Plan 03-02: Client-side filtering with debounced search (instant feedback, reduces API load)
- Plan 03-02: Native HTML5 drag-drop (zero dependencies, sufficient for file upload)
- Plan 03-03: react-easy-crop for image cropping (battle-tested, smooth UX with zoom)
- Plan 03-03: Percentage-based crop coordinates (resolution-agnostic, server can apply to any size)
- Plan 03-03: Claude vision for focal point detection (zero external API cost, accurate)
- Plan 03-03: Buffer magic bytes for MIME type detection (reliable, no temp files)
- Plan 03-03: Dual-dialog pattern for pick→crop→insert workflow (optional cropping, clear UX)
- Plan 04-01: Italian text search config over custom dictionary (excellent built-in stemming, zero maintenance)
- Plan 04-01: GENERATED ALWAYS AS for search_vector (auto-updates, no triggers needed)
- Plan 04-01: Weighted search A/B/C (titles more relevant than body matches)
- Plan 04-01: Prefix matching with :* (autocomplete-style search, forgiving)
- Plan 04-01: 120s cache with stale-while-revalidate (balances freshness with performance)
- Plan 04-02: 300ms debounce on search input (balances responsiveness with reducing API calls)
- Plan 04-02: Arrow keys + Enter for navigation over Tab (standard command palette UX pattern)
- Plan 04-02: dangerouslySetInnerHTML for ts_headline (controlled PostgreSQL output, no XSS risk)
- Plan 04-02: Filter state in component not URL (ephemeral dialog, no persistence needed)
- Plan 06-01: Framer Motion over React Spring for gestures (already installed, better mobile drag support)
- Plan 06-01: Bottom nav over hamburger-only for mobile (faster access to primary actions)
- Plan 06-01: Swipe-to-close threshold at 100px (balances accidental vs intentional gestures)
- Plan 06-01: Spring animation damping 25 (natural deceleration, matches mobile app expectations)
- Plan 06-01: 44px touch targets (iOS HIG standard, widely adopted)
- Plan 06-02: Primary green #016030 over #018856 (5.2:1 contrast passes WCAG AA, old 3.8:1 failed)
- Plan 06-02: focus-visible over focus for all elements (no ring on mouse, clear on keyboard)
- Plan 06-02: Skip links with sr-only pattern (WCAG 2.4.1 Bypass Blocks compliance)
- Plan 06-02: ARIA labels + fallback tables for charts (screen reader accessibility)
- Plan 06-02: High contrast mode with localStorage persistence (user preference, zero cookies)
- Plan 07-02: JSON column for template content (flexible storage for varying content structures)
- Plan 07-02: User-defined template categories (flexible vs predefined enum, organic growth)
- Plan 07-02: Sidebar + grid layout for template picker (mirrors media library pattern)
- Plan 05-01: SSE over WebSocket for import progress (simpler, unidirectional, works through proxies)
- Plan 05-01: Formula injection prefix with single quote (Excel/Sheets standard mitigation)
- Plan 05-01: Prisma transactions for CSV import (all-or-nothing ACID guarantees)
- Plan 05-01: Validation-then-execute pattern with ?execute=true (preview errors before commit)
- Plan 05-01: Slug generation from title + 6-char random (unique constraint compatibility)

### Pending Todos

None yet.

### Blockers/Concerns

**Phase 0 (Resolved in 00-01):**
- ✅ N+1 query pattern in stats API — RESOLVED with single aggregation query
- ✅ Missing pagination on stats queries — RESOLVED with take/LIMIT on all aggregations
- ✅ Double database reads in audit logging — RESOLVED with atomic transactions

**Phase 0 (Resolved in 00-02):**
- ✅ Image upload processing on hot path — RESOLVED with after() background processing
- ✅ Missing error boundaries — RESOLVED with error.tsx in all admin routes
- ✅ Missing MinIO cleanup in batch operations — RESOLVED with batch removeObjects()

**Phase 1 (Resolved in 01-02):**
- ✅ Tremor bundle size concern — RESOLVED with dynamic import code-splitting
- ✅ React 19 incompatibility with Tremor v3 — RESOLVED with v4 beta

**Phase 2 (Resolved in 02-01):**
- ✅ TipTap BubbleMenu React component missing — RESOLVED with custom positioned bubble menu
- ✅ Named vs default exports for TipTap extensions — RESOLVED with destructured imports

**Architecture:**
- Performance targets: dashboard <500ms, search <100ms — monitoring to be established in Phase 4
- PostgreSQL FTS requires load testing with 200k+ rows to validate <100ms target (Phase 5)
- TrendChart uses sample data; needs real trend API endpoint in future phase

**Phase 2 (Resolved in 02-02):**
- ✅ YouTube insert uses prompt() (not ideal UX) — RESOLVED with URL validation, consider inline dialog in future
- ✅ Slash command integration — RESOLVED with TipTap suggestion plugin
- ✅ Media picker placeholder needed — RESOLVED with stub showing Phase 3 message

**Phase 3 (Resolved in 03-02):**
- ✅ Media picker stub replacement — RESOLVED with MediaLibrary component
- ✅ Virtual scrolling for large datasets — RESOLVED with @tanstack/react-virtual
- ✅ Drag-drop upload — RESOLVED with native HTML5 events
- ✅ @heroicons/react dependency — ADDED for UI icons

**Phase 3 (Resolved in 03-03 - PHASE COMPLETE):**
- ✅ MediaLibrary integration with AdvancedEditor — RESOLVED with MediaPicker component
- ✅ Image cropping with aspect ratios — RESOLVED with react-easy-crop
- ✅ AI focal point detection — RESOLVED with Claude vision API
- ✅ Crop-then-insert workflow — RESOLVED with dual-dialog pattern

**Phase 4 (Resolved in 04-01):**
- ✅ Prisma migration drift (media table) — RESOLVED with baseline migration
- ✅ Shadow database conflicts — RESOLVED with direct SQL + prisma migrate resolve

**Phase 4 (Resolved in 04-02):**
- ✅ Missing Badge UI component — RESOLVED by creating badge.tsx component
- ✅ Button variant mismatch — RESOLVED by using "primary" instead of "default"

**Phase 6 (Resolved in 06-02):**
- ✅ WCAG AA color contrast compliance — RESOLVED with primary #016030 (5.2:1 contrast)
- ✅ Keyboard navigation for complex UI — RESOLVED with skip links and ARIA labels
- ✅ Screen reader support — RESOLVED with ARIA labels and fallback tables
- ✅ High contrast mode — RESOLVED with toggle and localStorage persistence

**Phase 7 (Resolved in 07-02):**
- ✅ Button variant type error — RESOLVED with secondary + custom className
- ✅ Zod error property mismatch — RESOLVED with error.issues instead of error.errors
- ✅ Prisma migration drift — RESOLVED with direct SQL table creation

**Architecture:**
- Performance targets: dashboard <500ms, search <100ms — monitoring to be established in Phase 4
- PostgreSQL FTS validated at 0.144ms with small dataset; load testing needed with 200k+ rows (Phase 5)
- Pagination (24 items) might feel limiting in picker mode — consider infinite scroll in future
- Thumbnail generation is on-demand (consider CDN caching for production)
- Cropped images create new Media records — consider cleanup job for unused versions
- Search filters reset on dialog close (ephemeral by design, no URL persistence)
- Mobile keyboard shortcuts less discoverable (no Cmd key on touch devices)

**Future Enhancements:**
- No table manipulation controls yet (add row/col, delete, merge cells)
- Slash menu positioning may need refinement for edge cases
- ANTHROPIC_API_KEY required for focal point detection (graceful fallback to center)
- Search result boosting by recency/featured status (out of current scope)
- Synonym support for search (e.g., "CCL" → "contratto collettivo lavoro")
- Search history and autocomplete suggestions (out of scope)
- Next.js 16.1.6 build error (ENOENT .next/turbopack) — investigate or upgrade Next.js
- Lighthouse accessibility audit not yet run (manual testing required)
- Screen reader user testing needed for ARIA validation
- Template preview in admin list (currently only in picker)
- Template versioning (save history of template changes)
- Template duplication (clone template to create variants)
- Template import/export (share templates between instances)
- Template usage analytics (track which templates used most)
- No pagination on templates list (expected low volume <100 templates)

**Phase 5 (Complete in 05-01):**
- ✅ CSV import/export API endpoints operational
- ✅ Zod validation for News and Events imports
- ✅ Formula injection sanitization in exports
- ✅ SSE progress streaming for transactional imports

**Future Enhancements (Phase 5):**
- Import UI with drag-drop and validation preview
- Export UI with filter controls
- Batch delete/publish/archive endpoints
- Progress bar component consuming SSE events
- Import preview before executing

## Session Continuity

Last session: 2026-01-29T14:11:10Z
Stopped at: Completed 05-01-PLAN.md (CSV Utilities + Import/Export API)
Resume file: None

---
*Last updated: 2026-01-29 after plan 05-01 completion*
