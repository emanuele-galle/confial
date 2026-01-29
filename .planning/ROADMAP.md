# Roadmap: FAILMS Dashboard Enhancement

## Overview

This roadmap transforms the FAILMS admin dashboard from basic CRUD to professional-grade CMS through 8 phases. The journey begins with critical technical debt resolution (Phase 0) to prevent N+1 query patterns from compounding, then systematically adds dashboard stats with Tremor charts (Phase 1), TipTap editor with concurrent edit safety (Phase 2), media library with AI focal points (Phase 3), PostgreSQL full-text search (Phase 4), transactional bulk operations with CSV export (Phase 5), mobile responsive design (Phase 6), and SEO tools with readability scores (Phase 7). This delivers 50% reduction in content creation time while maintaining <500ms dashboard performance and WCAG 2.1 AA accessibility.

## Phases

**Phase Numbering:**
- Integer phases (0-7): Planned milestone work
- Decimal phases (1.1, 2.1): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 0: Technical Debt Resolution** - Fix N+1 queries, add pagination, error boundaries before enhancement work
- [ ] **Phase 1: Dashboard Overview Enhancement** - Animated stats cards, Tremor charts, activity feed with caching
- [ ] **Phase 2: Advanced Editor** - TipTap with slash commands, media picker, link dialog, concurrent edit safety
- [ ] **Phase 3: Media Library** - Centralized management with smart cropping, AI focal points, on-the-fly thumbnails
- [ ] **Phase 4: Advanced Search** - PostgreSQL FTS with GIN indices, Cmd+K interface, faceted filters
- [ ] **Phase 5: Bulk Operations** - CSV import/export, transactional batch delete, formula injection protection
- [ ] **Phase 6: Mobile & Accessibility** - Responsive breakpoints, bottom nav, WCAG 2.1 AA compliance, high contrast mode
- [ ] **Phase 7: SEO Tools** - Readability scores, keyword density, Google preview, content templates

## Phase Details

### Phase 0: Technical Debt Resolution

**Goal**: Establish clean foundation by eliminating N+1 query patterns, adding pagination, and implementing error boundaries before enhancement work compounds these issues

**Depends on**: Nothing (must execute first)

**Requirements**: DEBT-01, DEBT-02, DEBT-03, DEBT-04, DEBT-05, DEBT-06

**Success Criteria** (what must be TRUE):
  1. Stats API executes <10 database queries per page load (down from current 13+)
  2. All stats queries have pagination with maximum 1000 row limit
  3. Audit logging creates entries in single transaction without double reads
  4. Admin pages have error boundaries that prevent full dashboard crash on component failures
  5. Batch delete operations clean up orphaned MinIO files automatically

**Plans**: TBD

Plans:
- [ ] TBD (determined during plan-phase)

### Phase 1: Dashboard Overview Enhancement

**Goal**: Deliver real-time dashboard with animated stats, trend charts, and activity feed while establishing code-splitting patterns to prevent bundle size bloat

**Depends on**: Phase 0 (requires optimized stats queries)

**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DASH-07, DASH-08, DASH-09, DASH-10

**Success Criteria** (what must be TRUE):
  1. Dashboard displays 4 animated stat cards with sparklines and percentage change indicators
  2. Dashboard shows 30-day trend chart with time range selector (7d/30d/90d) using Tremor AreaChart
  3. Activity feed displays recent actions from AuditLog with cursor-based pagination
  4. Dashboard stats load in <500ms with Next.js fetch caching (300s revalidation)
  5. Page bundle size remains <300KB per page (charts code-split with dynamic imports)

**Plans**: TBD

Plans:
- [ ] TBD (determined during plan-phase)

### Phase 2: Advanced Editor

**Goal**: Replace basic textarea with TipTap WYSIWYG editor featuring slash commands, media library integration, and optimistic locking to prevent concurrent edit data loss

**Depends on**: Phase 0 (requires error boundaries for editor crashes)

**Requirements**: EDIT-01, EDIT-02, EDIT-03, EDIT-04, EDIT-05, EDIT-06, EDIT-07, EDIT-08, EDIT-09, EDIT-10

**Success Criteria** (what must be TRUE):
  1. Content forms display TipTap editor with rich formatting (bold, italic, headings, lists, links, images)
  2. Editor supports YouTube/Vimeo embeds, table insertion, and text alignment options
  3. Editor shows bubble menu on text selection and slash commands for quick formatting
  4. Editor integrates media library picker for image insertion with preview
  5. Concurrent edits are prevented via optimistic locking with "currently editing" indicators

**Plans**: TBD

Plans:
- [ ] TBD (determined during plan-phase)

### Phase 3: Media Library

**Goal**: Centralized media management with virtual scrolling, smart cropping using AI focal point detection, and on-the-fly thumbnail generation to replace scattered upload flows

**Depends on**: Phase 0 (requires async job processing for thumbnails)

**Requirements**: MEDIA-01, MEDIA-02, MEDIA-03, MEDIA-04, MEDIA-05, MEDIA-06, MEDIA-07, MEDIA-08, MEDIA-09, MEDIA-10, MEDIA-11, MEDIA-12, MEDIA-13, MEDIA-14, MEDIA-15, MEDIA-16

**Success Criteria** (what must be TRUE):
  1. Standalone media page at /dashboard/media displays virtual scrolled grid of all uploaded images
  2. Media library supports multi-file drag-drop upload with progress tracking
  3. Users can crop images with react-easy-crop using multiple aspect ratios (16:9, 4:3, 1:1, free)
  4. AI-powered focal point detection using Claude vision determines smart crop centers automatically
  5. Thumbnails generate on-the-fly via API endpoint with Sharp optimization
  6. Media has folder organization and tag system for categorization

**Plans**: TBD

Plans:
- [ ] TBD (determined during plan-phase)

### Phase 4: Advanced Search

**Goal**: Implement fast cross-entity search using PostgreSQL full-text search with GIN indices, achieving <100ms query times with highlighted results and faceted filters

**Depends on**: Phase 3 (content must exist to search)

**Requirements**: SRCH-01, SRCH-02, SRCH-03, SRCH-04, SRCH-05, SRCH-06, SRCH-07, SRCH-08, SRCH-09, SRCH-10, SRCH-11, SRCH-12

**Success Criteria** (what must be TRUE):
  1. Database has search_vector tsvector columns on news, events, documents with GIN indices
  2. Global search component returns cross-entity results with Italian language stemming
  3. Search results display highlights using ts_headline for matched terms
  4. Search has faceted filters sidebar (status, date range, author, category)
  5. Search queries respond in <100ms with Next.js fetch caching
  6. Search supports keyboard navigation (arrows, Enter) and debounced input (300ms)

**Plans**: TBD

Plans:
- [ ] TBD (determined during plan-phase)

### Phase 5: Bulk Operations

**Goal**: Enable efficient bulk content management with CSV import/export, transactional batch operations, and formula injection protection to prevent security vulnerabilities

**Depends on**: Phase 4 (selection patterns established)

**Requirements**: BULK-01, BULK-02, BULK-03, BULK-04, BULK-05, BULK-06, BULK-07, BULK-08, BULK-09, BULK-10

**Success Criteria** (what must be TRUE):
  1. CSV import supports News and Events with Zod validation and progress tracking via SSE
  2. CSV import uses transactions for all-or-nothing processing (no partial imports)
  3. CSV export supports all entities (News, Events, Documents) with formula injection sanitization
  4. Batch delete and batch status change operations use transactions with MinIO cleanup
  5. All bulk operations create comprehensive audit log entries for forensics

**Plans**: TBD

Plans:
- [ ] TBD (determined during plan-phase)

### Phase 6: Mobile & Accessibility

**Goal**: Transform desktop-only dashboard into fully responsive mobile experience with WCAG 2.1 AA compliance, achieving Lighthouse accessibility score >90

**Depends on**: Phase 5 (requires all features complete to prioritize mobile components)

**Requirements**: MOBL-01, MOBL-02, MOBL-03, MOBL-04, MOBL-05, MOBL-06, A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, A11Y-06, A11Y-07, A11Y-08, A11Y-09

**Success Criteria** (what must be TRUE):
  1. Dashboard responsive at sm/md/lg breakpoints with intentional component reduction on mobile
  2. Mobile devices display bottom navigation and swipeable sidebar with Framer Motion gestures
  3. All touch targets minimum 44x44px on mobile interfaces
  4. Color contrast meets WCAG AA standards (#018856 changed to #016030)
  5. Skip links, ARIA labels, and screen reader support implemented across all admin pages
  6. High contrast mode toggle available with focus-visible styling on all interactive elements
  7. Lighthouse accessibility score >90 and axe-core audit passes with 0 critical issues

**Plans**: TBD

Plans:
- [ ] TBD (determined during plan-phase)

### Phase 7: SEO Tools

**Goal**: Provide content creators with SEO guidance through readability scores, keyword density visualization, Google search preview, and reusable content templates

**Depends on**: Phase 6 (requires all content forms complete)

**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09, SEO-10

**Success Criteria** (what must be TRUE):
  1. Content forms display SEO panel with Flesch Reading Ease score and keyword density visualization
  2. SEO panel shows Google Search preview for both desktop and mobile with meta title/description
  3. Top phrases extraction displays using NLP (compromise.js) to identify keyword opportunities
  4. Content templates system allows users to save and load templates with category organization
  5. Standalone templates page at /dashboard/templates manages all saved templates

**Plans**: TBD

Plans:
- [ ] TBD (determined during plan-phase)

## Progress

**Execution Order:**
Phases execute in numeric order: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 0. Technical Debt Resolution | 0/TBD | Not started | - |
| 1. Dashboard Overview Enhancement | 0/TBD | Not started | - |
| 2. Advanced Editor | 0/TBD | Not started | - |
| 3. Media Library | 0/TBD | Not started | - |
| 4. Advanced Search | 0/TBD | Not started | - |
| 5. Bulk Operations | 0/TBD | Not started | - |
| 6. Mobile & Accessibility | 0/TBD | Not started | - |
| 7. SEO Tools | 0/TBD | Not started | - |

---
*Last updated: 2026-01-29 after roadmap creation*
