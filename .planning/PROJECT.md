# FAILMS Dashboard Enhancement

## What This Is

A comprehensive enhancement of the FAILMS (content management system) admin dashboard for Confial labor union. This project upgrades the existing Next.js 16 admin interface with 8 major feature sets: enhanced dashboard overview with real-time stats and charts, advanced WYSIWYG editor with TipTap extensions, centralized media library with smart cropping, cross-entity search, bulk operations, mobile optimization, SEO tools, and WCAG 2.1 AA accessibility compliance.

## Core Value

Admins can manage content (News, Events, Documents) efficiently with professional-grade tools that match modern CMS standards, reducing content creation time by 50% while improving quality and SEO performance.

## Requirements

### Validated

<!-- Existing capabilities from current codebase (brownfield) -->

- ✓ Admin authentication with NextAuth v5 — existing
- ✓ CRUD operations for News, Events, Documents — existing
- ✓ Basic stats API endpoint — existing (needs enhancement)
- ✓ Batch operations framework — existing (partial WIP)
- ✓ Audit logging system — existing
- ✓ Notifications system — existing
- ✓ Image upload to MinIO — existing
- ✓ Prisma ORM with PostgreSQL 18 — existing
- ✓ Server/Client component architecture (App Router) — existing

### Active

<!-- New requirements for this enhancement project -->

- [ ] **Dashboard Overview**: Animated stats cards with sparklines and trend indicators
- [ ] **Dashboard Overview**: Tremor/Recharts integration for 30-day trend charts
- [ ] **Dashboard Overview**: Real-time activity feed with cursor-based pagination
- [ ] **Dashboard Overview**: Next.js caching with revalidation (replacing Redis for MVP)
- [ ] **Editor**: TipTap advanced extensions (YouTube embed, tables, text alignment, bubble menu)
- [ ] **Editor**: Slash commands Notion-style for quick formatting
- [ ] **Editor**: Media Library picker integration within editor
- [ ] **Editor**: Link dialog with preview and attributes
- [ ] **Media Library**: Centralized media management with virtual scroll
- [ ] **Media Library**: Smart image cropping with react-easy-crop
- [ ] **Media Library**: AI-powered focal point detection using Claude native vision
- [ ] **Media Library**: Folder organization and tag system
- [ ] **Media Library**: On-the-fly thumbnail generation with Sharp
- [ ] **Search**: PostgreSQL full-text search with GIN indices on News, Events, Documents
- [ ] **Search**: Global search component with debounced input and keyboard navigation
- [ ] **Search**: Cross-entity results with highlights (ts_headline)
- [ ] **Search**: Faceted filters sidebar (status, date range, author, category)
- [ ] **Search**: Next.js caching for frequent queries
- [ ] **Bulk Operations**: CSV import for News and Events with Zod validation
- [ ] **Bulk Operations**: CSV export for all entities with progress tracking
- [ ] **Bulk Operations**: Enhanced batch delete/publish with transaction safety
- [ ] **Mobile**: Responsive breakpoints (lg/md/sm) with component adaptations
- [ ] **Mobile**: Bottom navigation for mobile devices
- [ ] **Mobile**: Swipeable sidebar with Framer Motion gestures
- [ ] **Mobile**: Touch targets minimum 44x44px
- [ ] **SEO**: Flesch Reading Ease readability score
- [ ] **SEO**: Keyword density visualization
- [ ] **SEO**: Google Search preview (desktop + mobile)
- [ ] **SEO**: Top phrases extraction with NLP
- [ ] **SEO**: Content templates system (save/load)
- [ ] **Accessibility**: WCAG 2.1 AA color contrast fixes (#018856 → #016030)
- [ ] **Accessibility**: Skip links for keyboard navigation
- [ ] **Accessibility**: ARIA labels for charts, notifications, complex UI
- [ ] **Accessibility**: Screen reader support with fallback tables for charts
- [ ] **Accessibility**: Focus-visible styling improvements
- [ ] **Accessibility**: High contrast mode toggle

### Out of Scope

- Redis caching infrastructure — Deferred to post-MVP; use Next.js fetch caching + SWR instead
- Meilisearch integration — Only if PostgreSQL FTS proves insufficient after 30 days
- Real-time collaboration (Yjs + WebSocket) — v2 feature, not core value
- Cloudflare Images integration — MinIO sufficient for MVP
- Advanced analytics (GA4 in dashboard) — Separate project
- Scheduled publishing with cron — v2 feature
- Email notification system — Separate project
- Webhooks for external integrations — v2 feature

## Context

**Current State (from codebase map):**
- Next.js 16.1.6 with App Router, React 19, Prisma 7.3.0, PostgreSQL 18
- Admin dashboard at `/admin` with route groups: (auth), (dashboard), (public)
- Existing WIP features: stats API (101 lines, N+1 query pattern), batch operations (partial), notifications (60s polling)
- Recent commit (77fc5e8): "WIP: Dashboard enhancements in progress" with mixed implementations
- Tech debt identified: N+1 queries in stats API, missing pagination, no caching layer, double database reads in audit logging

**User Base:**
- Internal admin users (labor union staff)
- Content creators managing news, events, organizational documents
- Frequency: Daily content updates, weekly bulk imports

**Known Issues to Address:**
- Stats API performance (13+ sequential database queries)
- Notification polling inefficiency (fixed 60s interval)
- Large home page component (773 lines, needs splitting)
- Missing error boundaries on admin pages
- No MinIO cleanup in batch delete operations
- Lack of mobile responsiveness

## Constraints

- **Tech Stack**: Must use existing Next.js 16 App Router + Prisma + PostgreSQL; no framework changes
- **Performance**: Dashboard stats must load < 500ms (currently ~800ms); search queries < 100ms
- **Bundle Size**: Keep total JS < 300KB (Tremor + TipTap = +150KB; need code-splitting)
- **Zero Downtime**: All enhancements must be backward compatible; no breaking changes
- **Infrastructure**: No new services for MVP (no Redis, no Meilisearch, no additional Docker containers)
- **Accessibility**: Must pass Lighthouse Accessibility score > 90 and axe-core audit with 0 critical issues
- **Browser Support**: Modern browsers only (Chrome/Firefox/Safari/Edge last 2 versions)
- **Timeline**: Phased rollout over 6-8 weeks; MVP features first, nice-to-have features after

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skip Redis for MVP, use Next.js caching | Avoid infrastructure complexity; Next.js fetch with revalidate + SWR sufficient for current load | — Pending |
| PostgreSQL FTS over Meilisearch | Start simple; Meilisearch only if queries > 200ms after 30 days | — Pending |
| Tremor for charts over custom D3 | Pre-built responsive charts; faster implementation; smaller bundle than full D3 | — Pending |
| Claude native vision for focal point | No external API needed; instant processing; zero cost | — Pending |
| TipTap over Slate/Lexical | Best Next.js integration; rich ecosystem of extensions; proven in production | — Pending |
| react-easy-crop over custom canvas | Battle-tested; handles edge cases; smaller bundle than implementing from scratch | — Pending |
| WCAG 2.1 AA over AAA | AA is achievable with current design; AAA would require major redesign | — Pending |
| Code-splitting for heavy components | Tremor charts, TipTap editor dynamic import to keep initial bundle small | — Pending |

---
*Last updated: 2026-01-29 after initialization*
