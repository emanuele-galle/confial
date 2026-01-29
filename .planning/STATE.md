# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-29)

**Core value:** Admins can manage content efficiently with professional-grade tools, reducing creation time by 50%
**Current focus:** Phase 4 - Advanced Search

## Current Position

Phase: 4 of 7 (Advanced Search)
Plan: 2 of 3 in phase (Search UI - Complete)
Status: In progress
Last activity: 2026-01-29 — Completed 04-02-PLAN.md (Search UI with Cmd+K)

Progress: [█████████░] 90%

## Performance Metrics

**Velocity:**
- Total plans completed: 11
- Average duration: 4.8 minutes
- Total execution time: 0.88 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 0 | 2 | 5.4min | 2.7min |
| Phase 1 | 2 | 8.5min | 4.25min |
| Phase 2 | 2 | 12.3min | 6.15min |
| Phase 3 | 3 | 16.6min | 5.5min |
| Phase 4 | 2 | 9min | 4.5min |

**Recent Trend:**
- Last 5 plans: 03-02 (7min), 03-03 (5min), 04-01 (6min), 04-02 (3min)
- Trend: UI components getting faster (03-02: 7min → 04-02: 3min)

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

**Architecture:**
- Performance targets: dashboard <500ms, search <100ms — monitoring to be established in Phase 4
- PostgreSQL FTS validated at 0.144ms with small dataset; load testing needed with 200k+ rows (Phase 5)
- Pagination (24 items) might feel limiting in picker mode — consider infinite scroll in future
- Thumbnail generation is on-demand (consider CDN caching for production)
- Cropped images create new Media records — consider cleanup job for unused versions
- Search filters reset on dialog close (ephemeral by design, no URL persistence)
- Mobile keyboard shortcuts less discoverable (no Cmd key on touch devices)

**Future Phases:**
- No table manipulation controls yet (add row/col, delete, merge cells)
- Slash menu positioning may need refinement for edge cases
- ANTHROPIC_API_KEY required for focal point detection (graceful fallback to center)
- Search result boosting by recency/featured status (out of current scope)
- Synonym support for search (e.g., "CCL" → "contratto collettivo lavoro")
- Search history and autocomplete suggestions (out of scope)
- ARIA attributes for screen reader accessibility (future work)

## Session Continuity

Last session: 2026-01-29T14:03:04Z
Stopped at: Completed 04-02-PLAN.md (Search UI with Cmd+K)
Resume file: None

---
*Last updated: 2026-01-29 after plan 04-02 completion*
