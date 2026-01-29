# Feature Research

**Domain:** Admin Dashboard Enhancement for Content Management System
**Researched:** 2026-01-29
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist in modern CMS admin dashboards (2025-2026). Missing these = product feels incomplete compared to WordPress/Ghost/Strapi.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Dashboard Overview - Real-time Stats** | Standard in all modern CMS (WordPress, Ghost, Strapi) - users expect quick metrics at login | MEDIUM | Current stats API slow (800ms, N+1). Need caching + optimized queries. Charts using lightweight lib (Chart.js/Recharts) |
| **Dashboard Overview - Activity Feed** | Users expect "what happened recently" visibility for team coordination | LOW | Stream of recent edits/publishes with user attribution. Simple chronological list |
| **WYSIWYG Editor - Rich Text Formatting** | Basic formatting (bold, italic, headings, lists) is non-negotiable for content creators | LOW | Already have Tiptap - ensure all standard marks/nodes work |
| **WYSIWYG Editor - Link Management** | Adding/editing hyperlinks is fundamental for web content | LOW | Bubble menu for link insertion, validation for URLs |
| **WYSIWYG Editor - Image Insertion** | Inline images expected in any modern editor (WordPress, Ghost all have this) | MEDIUM | Integration with media library, drag-drop upload |
| **Media Library - Upload Interface** | Drag-drop or click-to-upload is baseline UX for file management | LOW | Multi-file upload with progress indicators |
| **Media Library - Grid/List View** | Users expect to browse media visually, not just filenames | LOW | Thumbnail grid view (default) + optional list view |
| **Media Library - Search/Filter** | Finding specific media in library of 100+ files requires search | MEDIUM | Search by filename, filter by type (image/doc/video), date range |
| **Search - Basic Full-Text** | Users expect to find content by typing keywords (like Cmd+K in Notion) | MEDIUM | PostgreSQL full-text search across News/Events/Documents titles and content |
| **Search - Entity Filters** | Need to filter "only News" or "only Events" in search results | LOW | Tabs or dropdown to filter by content type |
| **Bulk Operations - Select Multiple** | Checkbox selection for bulk actions is table stakes (all CMS have this) | LOW | Checkbox column in tables, "select all" option |
| **Bulk Operations - Delete Multiple** | Mass delete is expected for cleanup/content management | LOW | Batch delete with confirmation modal |
| **Bulk Operations - Status Change** | Bulk publish/draft/archive expected for workflow efficiency | MEDIUM | Batch update status with optimistic UI |
| **Mobile - Responsive Layout** | Mobile access expected for quick edits/approvals on-the-go | MEDIUM | Responsive breakpoints, touch-friendly targets (44px min) |
| **Mobile - Touch-Optimized Tables** | Data tables must work on mobile (horizontal scroll, sticky columns) | MEDIUM | Consider card view on mobile instead of cramped tables |
| **SEO - Meta Fields** | Title, description, slug editing expected in any web CMS | LOW | Fields in edit forms, character count indicators |
| **Accessibility - Keyboard Navigation** | WCAG Level A requirement - all functionality via keyboard (Tab, Enter, Esc) | MEDIUM | Focus management, skip links, no keyboard traps |
| **Accessibility - Focus Indicators** | High-contrast outlines on focused elements (WCAG 2.1.1) | LOW | CSS focus-visible styles, visible across all components |
| **Accessibility - Screen Reader Support** | ARIA labels, semantic HTML expected for professional admin tools | MEDIUM | Proper heading hierarchy, ARIA landmarks, descriptive labels |

### Differentiators (Competitive Advantage)

Features that set the product apart from basic CMS dashboards. Not required for launch, but valuable for user delight and competitive positioning.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Dashboard Overview - Customizable Widgets** | Users prioritize metrics they care about (views, recent events, pending reviews) | HIGH | Drag-drop dashboard builder - high complexity, defer to v2+ |
| **WYSIWYG Editor - Slash Commands** | Modern editor UX (Notion-style) - type "/" to insert blocks without toolbar hunting | MEDIUM | Tiptap slash commands extension available. Boosts editing speed 30-50% per user research |
| **WYSIWYG Editor - AI Content Assistance** | Suggest improvements, generate summaries, rewrite tone for labor union audience | HIGH | Gemini Flash integration. High value for non-technical content creators. Differentiator vs competitors |
| **WYSIWYG Editor - Table of Contents** | Auto-generate TOC from headings for long-form content (union reports, policy docs) | MEDIUM | Parse heading nodes, generate anchor links. Useful for document-heavy use case |
| **Media Library - Focal Point Selection** | Smart cropping for hero images ensures important content visible at all aspect ratios | MEDIUM | Visual focal point picker. WordPress/Drupal have this - prevents cropped-off faces in banners |
| **Media Library - Auto-Tagging** | AI-generated tags for images using Gemini Vision API | HIGH | Reduces manual tagging effort. Consider after manual tagging proven useful |
| **Media Library - Image Optimization** | Auto-compress/resize on upload to save bandwidth and improve page load | MEDIUM | Sharp/Imagemagick integration. Improves frontend performance significantly |
| **Search - Keyboard Shortcut (Cmd+K)** | Global search from anywhere in admin - modern SaaS UX pattern | LOW | Modal search dialog activated by Cmd/Ctrl+K. Users expect this in 2026 tools |
| **Search - Result Highlighting** | Highlight matched terms in search results for scan-ability | LOW | PostgreSQL ts_headline function. Improves UX significantly |
| **Search - Recent Items** | Show recent edits before user types (like Spotlight/Alfred) | MEDIUM | Session-based recents tracking. Speeds up navigation to recently-edited content |
| **Bulk Operations - CSV Export** | Export filtered content to CSV for external analysis/reporting | MEDIUM | Useful for union reporting workflows. Export News/Events for newsletter generation |
| **Bulk Operations - CSV Import** | Bulk import events/news from spreadsheets (migration, batch creation) | HIGH | Complex validation, error handling. Useful for initial data migration or annual event calendars |
| **Mobile - Bottom Navigation** | Thumb-friendly navigation on mobile (iOS/Android pattern) | LOW | Bottom nav bar on mobile breakpoint. Better ergonomics than top nav |
| **Mobile - Offline Draft Saving** | Save drafts locally when offline, sync when reconnected | HIGH | PWA + IndexedDB. Useful for field workers with spotty connectivity. Complex, defer to v2 |
| **SEO - Readability Score** | Flesch-Kincaid or similar score to ensure content understandable by target audience | MEDIUM | Yoast-style readability analysis. Helpful for non-technical writers ensuring clarity |
| **SEO - SERP Preview** | Live preview of how content appears in Google search results | LOW | Mock Google result card. Helps writers optimize titles/descriptions |
| **SEO - Keyword Density** | Track keyword usage to optimize for search terms (union-specific terms) | MEDIUM | Text analysis for target keywords. Lower priority - focus on readability first |
| **Accessibility - Alt Text Enforcement** | Require alt text for images before publish (WCAG 1.1.1) | LOW | Validation rule blocking publish if images missing alt. Enforces compliance |
| **Accessibility - Color Contrast Checker** | Warn if text/background combinations fail WCAG AA contrast ratios | MEDIUM | Automated checking of content colors. Ensures published content meets standards |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems. Explicitly NOT building these to prevent scope creep.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Real-time Collaborative Editing (Google Docs-style)** | "Modern CMS should have multi-user editing" | High technical complexity (WebSockets, conflict resolution, operational transforms). Most admin teams work asynchronously, not simultaneously. ROI low for labor union use case | Simple "locked by user X" indicator when editing. Prevents conflicts without complexity |
| **Advanced Workflow/Approval System** | "We need multi-level approvals before publish" | Creates bureaucracy bottlenecks. Most teams have 1-2 approvers max. Complex state machines hard to maintain | Simple draft/review/published status with role-based publish permission. If more needed, use external approval tool |
| **Built-in Newsletter Builder** | "We want to send emails from CMS" | CMS becomes email platform - scope creep into deliverability, bounce handling, unsubscribe management. Better tools exist (Mailchimp, SendGrid) | CSV export of content for import into dedicated email tools. Or webhook to N8N for automation |
| **Multi-language Content Management (i18n)** | "We might need Italian and English versions" | Doubles database complexity (content tables, fallbacks, language switcher). No confirmed requirement yet | Build when actually needed, not speculatively. Most labor unions operate in single language |
| **Revision History with Rollback** | "We want to see all past versions" | Storage bloat, complex UI to browse diffs, rare actual usage (most edits are additive, not destructive) | Audit log of who changed what when (metadata only). If critical, add database-level triggers later |
| **Custom Fields Builder (Meta Fields UI)** | "Let users define their own fields without dev" | Becomes schemaless mess - validation issues, migration headaches, hard to reason about data model | Predefined fields in code. If new field needed, ship a migration. Keeps data model clean and typed |
| **File Version Control** | "Keep all versions of uploaded files" | Storage costs multiply, complex UI to browse versions, edge cases (which version is referenced in old content?) | Replace file overwrites existing. Use timestamped filenames if versions critical. Most media files don't change |
| **Advanced Analytics Dashboard** | "We want traffic reports, conversion funnels, etc." | CMS becomes analytics platform - scope creep. Google Analytics/Plausible do this better | Embed Google Analytics/Plausible iframe in dashboard or link to external tool |
| **Built-in Social Media Posting** | "Publish to Facebook/Twitter from CMS" | API complexity, auth flows, rate limits, platform policy changes break integration. Maintenance burden | Manual copy-paste or use dedicated social media management tool (Buffer, Hootsuite) |

## Feature Dependencies

```
[Media Library - Basic Upload]
    └──requires──> [Media Library - Grid View] (can't manage what you can't see)
                       └──requires──> [Media Library - Search] (useless without search at scale)

[WYSIWYG Editor - Image Insertion]
    └──requires──> [Media Library - Basic Upload]

[Media Library - Focal Point]
    └──requires──> [Media Library - Basic Upload]
    └──enhances──> [Image Optimization] (focal point used for smart crop)

[Search - Full-Text]
    └──requires──> [Database indexes on content fields]
    └──enhances──> [Keyboard Shortcut Cmd+K] (shortcut useless without working search)

[Bulk Operations - CSV Export]
    └──requires──> [Bulk Selection + Filtering]

[Bulk Operations - CSV Import]
    └──requires──> [Validation logic for entities]
    └──conflicts──> [Manual WYSIWYG editing] (imported content bypasses editor - ensure HTML sanitization)

[SEO - SERP Preview]
    └──requires──> [Meta Fields] (title, description to preview)

[Accessibility - Alt Text Enforcement]
    └──requires──> [Media Library - Image Management]

[Mobile - Responsive Layout]
    └──enables──> [All other mobile features] (foundation for mobile UX)

[Dashboard Overview - Real-time Stats]
    └──requires──> [Optimized Stats API] (or it's too slow to be real-time)
```

### Dependency Notes

- **Media Library features are sequential:** Upload → View → Search. Can't skip steps without poor UX.
- **WYSIWYG editor depends on Media Library:** Can't insert images without media management infrastructure.
- **Search enhances Keyboard Shortcut:** Cmd+K is just a modal - needs working search backend to be useful.
- **Bulk operations share foundation:** Selection UI + entity filtering required for both CSV export and batch actions.
- **SEO features build on meta fields:** Preview and analysis require structured meta data to work with.
- **Mobile responsive is foundational:** All mobile-specific features require responsive base layout first.
- **Stats dashboard needs performance:** Real-time stats useless if queries take 5+ seconds. Optimization is prerequisite.

## MVP Definition

### Launch With (v1)

Minimum viable product - what's needed to validate "50% time reduction in content management".

- [x] **Dashboard Overview - Real-time Stats** - Essential to prove efficiency gains (current: 800ms API, need <200ms)
- [x] **Dashboard Overview - Activity Feed** - Team coordination for multi-user environment
- [x] **WYSIWYG Editor - Rich Text + Links + Images** - Core content creation workflow
- [x] **Media Library - Upload + Grid View + Search** - Can't manage media without these three
- [ ] **Search - Basic Full-Text + Entity Filters** - Finding content is table stakes (users compare to Cmd+F in Google Docs)
- [ ] **Bulk Operations - Select + Delete + Status Change** - Efficiency feature for content cleanup/workflow
- [ ] **Mobile - Responsive Layout** - Quick approvals on mobile is part of "50% time reduction" value prop
- [ ] **SEO - Meta Fields** - Professional web content requires title/description/slug
- [ ] **Accessibility - Keyboard Nav + Focus Indicators** - WCAG Level A compliance is non-negotiable for labor union (public sector)

**Rationale:** These are all table stakes features. Missing any would make product feel incomplete vs WordPress/Ghost. Together they deliver on core value (efficiency) while meeting baseline expectations.

### Add After Validation (v1.x)

Features to add once core is working and users validate efficiency gains.

- [ ] **WYSIWYG Editor - Slash Commands** - Add when users request faster editing workflows (wait for feedback first)
- [ ] **Media Library - Focal Point** - Add when users complain about cropped images (validate problem exists)
- [ ] **Media Library - Image Optimization** - Add when page load performance becomes issue (measure first)
- [ ] **Search - Keyboard Shortcut (Cmd+K)** - Quick win after search proven useful
- [ ] **Search - Result Highlighting** - UX polish after basic search validated
- [ ] **Bulk Operations - CSV Export** - Add when users request reporting/newsletter workflows
- [ ] **Mobile - Bottom Navigation** - Add if mobile usage metrics show significant traffic (>20%)
- [ ] **SEO - Readability Score** - Add when content quality becomes focus (after volume achieved)
- [ ] **SEO - SERP Preview** - Add when SEO becomes priority (after content published regularly)
- [ ] **Accessibility - Alt Text Enforcement** - Add to enforce compliance after workflow established

**Trigger for v1.x:** User feedback, usage metrics, or specific pain points identified in production.

### Future Consideration (v2+)

Features to defer until product-market fit established and team requests confirm value.

- [ ] **WYSIWYG Editor - AI Content Assistance** - High value but high complexity. Wait for user demand.
- [ ] **WYSIWYG Editor - Table of Contents** - Niche feature for long-form content. Validate use case first.
- [ ] **Media Library - Auto-Tagging** - Only valuable if manual tagging proven useful in v1.x
- [ ] **Search - Recent Items** - Nice-to-have UX polish, not critical path
- [ ] **Bulk Operations - CSV Import** - Complex validation. Only if migration or bulk creation becomes regular workflow
- [ ] **Mobile - Offline Draft Saving** - Complex PWA work. Only if field workers report connectivity issues
- [ ] **SEO - Keyword Density** - Lower priority than readability. Add if SEO becomes strategic focus
- [ ] **Accessibility - Color Contrast Checker** - Advanced compliance. Add if content uses custom colors frequently
- [ ] **Dashboard Overview - Customizable Widgets** - High complexity, moderate value. Build when dashboard usage high

**Why defer:** Either high complexity/low confirmed demand, or nice-to-have polish that doesn't impact core value prop.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| **Dashboard Stats Optimization** | HIGH (proves efficiency gains) | MEDIUM (query optimization + caching) | P1 |
| **Full-Text Search** | HIGH (findability is table stakes) | MEDIUM (PostgreSQL FTS + indexes) | P1 |
| **Bulk Operations** | HIGH (efficiency multiplier) | MEDIUM (selection UI + batch queries) | P1 |
| **Mobile Responsive** | HIGH (approvals on-the-go) | MEDIUM (responsive breakpoints) | P1 |
| **SEO Meta Fields** | HIGH (professional content) | LOW (form fields + validation) | P1 |
| **Keyboard Navigation** | HIGH (accessibility compliance) | MEDIUM (focus management) | P1 |
| **WYSIWYG Editor Basics** | HIGH (already have Tiptap) | LOW (ensure features work) | P1 |
| **Media Library Basics** | HIGH (content management core) | MEDIUM (upload + storage + UI) | P1 |
| **Activity Feed** | MEDIUM (team coordination) | LOW (simple query + UI) | P1 |
| **Slash Commands** | MEDIUM (editing speed) | MEDIUM (Tiptap extension) | P2 |
| **Focal Point** | MEDIUM (image quality) | MEDIUM (visual picker + storage) | P2 |
| **Image Optimization** | MEDIUM (performance) | MEDIUM (Sharp integration) | P2 |
| **Cmd+K Search** | MEDIUM (modern UX) | LOW (modal + shortcut handler) | P2 |
| **CSV Export** | MEDIUM (reporting workflow) | MEDIUM (serialization logic) | P2 |
| **Bottom Nav Mobile** | MEDIUM (mobile ergonomics) | LOW (CSS + routing) | P2 |
| **Readability Score** | MEDIUM (content quality) | MEDIUM (text analysis) | P2 |
| **SERP Preview** | MEDIUM (SEO optimization) | LOW (mock UI component) | P2 |
| **Alt Text Enforcement** | MEDIUM (compliance) | LOW (validation rule) | P2 |
| **AI Content Assistance** | HIGH (differentiation) | HIGH (Gemini integration + prompt engineering) | P3 |
| **Auto-Tagging** | LOW (unproven need) | HIGH (Vision API + training) | P3 |
| **CSV Import** | LOW (migration one-time) | HIGH (validation + error handling) | P3 |
| **Offline Drafts** | LOW (niche use case) | HIGH (PWA + sync logic) | P3 |
| **Keyword Density** | LOW (SEO nice-to-have) | MEDIUM (text analysis) | P3 |
| **Customizable Dashboard** | MEDIUM (personalization) | HIGH (drag-drop builder) | P3 |

**Priority key:**
- **P1 (Must have for launch):** Table stakes features, high user value, required for core value prop (50% time reduction)
- **P2 (Should have, add when possible):** Differentiators with medium user value, or polish for table stakes features
- **P3 (Nice to have, future consideration):** High complexity/low confirmed demand, or advanced features to validate demand first

## Competitor Feature Analysis

| Feature | WordPress | Ghost CMS | Strapi | Our Approach |
|---------|-----------|-----------|--------|--------------|
| **Dashboard Stats** | Dashboard widgets (slow, plugin-dependent) | Clean minimal stats (fast) | Admin dashboard with analytics | Real-time optimized stats (<200ms) with caching. Balance WordPress flexibility with Ghost speed |
| **WYSIWYG Editor** | Gutenberg (block-based, complex) | Mobiledoc (minimal, distraction-free) | Rich text editor (customizable) | Tiptap with slash commands - modern like Notion, familiar UX, extensible for AI features |
| **Media Library** | Comprehensive (upload, crop, edit) | Basic (upload, alt text) | Digital asset management | WordPress-level features (focal point, optimization) with Ghost-level simplicity |
| **Search** | Poor native search (plugins required) | Basic content search | No built-in search | PostgreSQL full-text search with Cmd+K shortcut - better than WordPress, feature-rich vs Ghost |
| **Bulk Operations** | CSV import/export via plugins | Limited bulk actions | GraphQL bulk mutations | Native CSV export in v1.x, import in v2+ (avoid WordPress plugin bloat) |
| **Mobile Experience** | Responsive but cluttered | No mobile editor (limitation) | Mobile-responsive admin | Full mobile editing with touch optimization - better than all three competitors |
| **SEO Tools** | Yoast/Rank Math plugins (comprehensive) | Built-in meta fields + structured data | No built-in SEO | Meta fields in v1, readability + SERP preview in v1.x (Yoast-inspired without bloat) |
| **Accessibility** | WCAG compliant (admin and frontend) | Limited accessibility focus | Developer-dependent | WCAG Level A in v1, Level AA in v1.x (match WordPress compliance) |
| **Collaborative Features** | Locking mechanism, revision history | Real-time multi-user (complex) | Role-based access control | Simple "locked by user X" (avoid Ghost complexity, match WordPress simplicity) |
| **Extensibility** | Plugin ecosystem (30k+ plugins) | Limited (intentional simplicity) | Custom plugins + API | Focused feature set, no plugin system (avoid WordPress complexity hell) |

**Strategic Positioning:**
- **Faster than WordPress:** Optimized queries, no plugin bloat, modern tech stack (Next.js vs PHP)
- **More capable than Ghost:** Search, bulk ops, advanced SEO tools, mobile editing (Ghost deliberately minimal)
- **Simpler than Strapi:** Pre-built features vs "build your own" (Strapi is headless framework, we're opinionated CMS)
- **Differentiation:** AI content assistance (none of the three have this natively), labor union-specific workflows

## Sources

### Modern Admin Dashboard Features (2026)
- [Admin Dashboard: Ultimate Guide, Templates & Examples (2026)](https://www.weweb.io/blog/admin-dashboard-ultimate-guide-templates-examples)
- [Top Admin Dashboard Design Ideas for 2026](https://www.fanruan.com/en/blog/top-admin-dashboard-design-ideas-inspiration)
- [21+ Best Next.js Admin Dashboard Templates - 2026](https://nextjstemplates.com/blog/admin-dashboard-templates)

### WYSIWYG Editor Features (2026)
- [Slash Command | React Tiptap Editor](https://reactjs-tiptap-editor.vercel.app/extensions/SlashCommand/index.html)
- [10 Best React WYSIWYG Rich Text Editors in 2026 (Open Source)](https://reactscript.com/best-rich-text-editor/)
- [Tiptap Slash Commands Extension](https://tiptap.dev/docs/examples/experiments/slash-commands)
- [Tiptap BubbleMenu Extension](https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu)

### Media Library Best Practices (2026)
- [Custom Crop & Focal Point | Frontify Knowledge Base](https://help.frontify.com/en/articles/3111371-custom-crop-focal-point)
- [How to Set the Focal Point on WordPress Images](https://wpmayor.com/set-focal-point-wordpress-images/)
- [Media Library | Sanity](https://www.sanity.io/media-library)

### Search Features (2026)
- [16 Best React Dashboards in 2026 | Untitled UI](https://www.untitledui.com/blog/react-dashboards)
- [Productive Live List and Table Search Filter WordPress](https://www.cminds.com/wordpress-plugins-library/fast-live-search-filter-for-wordpress/)

### Bulk Operations (2026)
- [Export, update, and import bulk work items with CSV files - Azure Boards](https://learn.microsoft.com/en-us/azure/devops/boards/queries/import-work-items-from-csv?view=azure-devops)
- [Bulk import data with the GraphQL Admin API](https://shopify.dev/docs/api/usage/bulk-operations/imports)

### Mobile Responsive Design (2026)
- [Free Tailwind CSS Admin Dashboard Template - TailAdmin](https://tailadmin.com/)
- [Top Admin Dashboard Design Ideas for 2026](https://www.fanruan.com/en/blog/top-admin-dashboard-design-ideas-inspiration)

### SEO Tools (2026)
- [Yoast SEO – Advanced SEO with real-time guidance and built-in AI](https://wordpress.org/plugins/wordpress-seo/)
- [The #1 WordPress SEO Plugin in 2026 – Rank Math](https://rankmath.com/wordpress/plugin/seo-suite/)
- [Top SEO Content Writing Tools to Watch in 2026](https://www.analyticsinsight.net/seo/best-seo-content-writing-tools-for-2026)

### Accessibility Standards (2026)
- [WCAG 2.2 Accessibility Checklist 2026 (Complete Guide)](https://theclaymedia.com/wcag-2-2-accessibility-checklist-2026/)
- [WCAG 2.1.1 Keyboard Accessibility Explained | UXPin](https://www.uxpin.com/studio/blog/wcag-211-keyboard-accessibility-explained/)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)

### CMS Competitor Analysis (2026)
- [WordPress Headless vs Ghost](https://strapi.io/headless-cms/comparison/wordpressheadless-vs-ghost)
- [Ghost vs Strapi | What are the differences?](https://stackshare.io/stackups/ghost-vs-strapi)
- [Strapi vs Wordpress, In-Depth Comparison](https://www.vocso.com/blog/strapi-vs-wordpress/)
- [Ghost vs. WordPress: Which is Better for Blogging in 2026?](https://highfivethemes.com/blog/ghost-vs-wordpress/)

### Anti-Patterns and Scope Creep
- [Scope Creep Anti-Pattern | minware](https://www.minware.com/guide/anti-patterns/scope-creep)
- [Feature Creep Anti-Pattern | minware](https://www.minware.com/guide/anti-patterns/feature-creep)

---
*Feature research for: FAILMS Admin Dashboard Enhancement*
*Researched: 2026-01-29*
*Next Step: Use this to inform REQUIREMENTS.md and phase structure in ROADMAP.md*
