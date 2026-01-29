---
phase: 07-seo-tools
plan: 02
subsystem: content-management
tags: [templates, content-reuse, api, ui, forms]

requires:
  - Phase 2 (AdvancedEditor integration)
  - Phase 0 (Database infrastructure)

provides:
  - ContentTemplate database model
  - Template CRUD API
  - Template picker component
  - Templates management page
  - Save/load template functionality

affects:
  - Future content creation workflows (faster content entry)
  - Content consistency (standardized templates)

tech-stack:
  added: []
  patterns:
    - Dialog-based template selection
    - Category-based organization
    - JSON content storage

key-files:
  created:
    - prisma/schema.prisma (ContentTemplate model)
    - src/app/api/admin/templates/route.ts
    - src/app/api/admin/templates/[id]/route.ts
    - src/components/admin/template-picker.tsx
    - src/app/(dashboard)/admin/templates/page.tsx
    - src/app/(dashboard)/admin/templates/error.tsx
  modified:
    - src/app/(dashboard)/admin/news/new/page.tsx
    - src/app/(dashboard)/admin/events/new/page.tsx

decisions:
  - id: template-json-storage
    choice: JSON column for template content
    rationale: Flexible storage for varying content structures (news vs events)
    alternatives: Separate tables per entity type (too rigid)
    date: 2026-01-29

  - id: template-category-organization
    choice: Simple category string field
    rationale: Flexible user-defined categories, no rigid taxonomy
    alternatives: Predefined category enum (limits flexibility)
    date: 2026-01-29

  - id: template-picker-layout
    choice: Sidebar categories + grid cards
    rationale: Familiar pattern from media library, efficient browsing
    alternatives: Dropdown filter + list (less visual)
    date: 2026-01-29

metrics:
  duration: 7m 27s
  completed: 2026-01-29
---

# Phase 7 Plan 02: Content Templates System Summary

**One-liner:** Template save/load system with JSON storage, category organization, and picker dialog for news and events

## What Was Built

Created complete content templates system allowing users to save and reuse content structures:

1. **Database Layer**
   - ContentTemplate model with JSON content storage
   - Foreign key to User (creator tracking)
   - Indices on category and entityType for filtering

2. **API Layer**
   - GET /api/admin/templates (list with filters)
   - POST /api/admin/templates (create template)
   - GET /api/admin/templates/[id] (fetch single)
   - PATCH /api/admin/templates/[id] (update template)
   - DELETE /api/admin/templates/[id] (delete template)
   - Zod validation for all inputs

3. **Template Picker Component**
   - Dialog-based selection interface
   - Category sidebar with counts
   - Search filtering
   - Grid layout with card preview
   - Content preview panel before selection
   - Empty and loading states

4. **Templates Management Page**
   - Standalone page at /admin/templates
   - Filter tabs: All, News, Events
   - Table view with actions
   - Delete with confirmation dialog
   - Error boundary for page crashes

5. **Form Integration**
   - "Carica da template" button on news/events forms
   - "Salva come template" dialog
   - Form field population from template content
   - Category and description metadata

## Key Technical Decisions

### JSON Storage Pattern
Chose JSONB column for template content instead of entity-specific tables. This provides flexibility for varying content structures between news and events without schema changes.

### Category Organization
User-defined categories (simple string field) rather than predefined enum. Users can create categories organically: "Comunicati stampa", "Eventi formativi", etc. More flexible than rigid taxonomy.

### Template Picker UX
Sidebar + grid layout mirrors media library pattern. Categories in left sidebar with counts, template cards in grid on right. Preview panel shows content before selection.

## Implementation Highlights

**Direct SQL Migration:**
Used direct SQL to create ContentTemplate table due to Prisma migration drift. Avoided shadow database conflicts.

**Template Content Structure:**
```typescript
interface TemplateContent {
  title?: string;
  excerpt?: string;
  body: string; // HTML from TipTap
  category?: string; // For news
  location?: string; // For events
}
```

**Async Params Handling:**
Next.js 15+ requires `await params` in route handlers:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

## Components Created

| Component | Lines | Purpose |
|-----------|-------|---------|
| TemplatePicker | 295 | Template selection dialog with category filtering |
| templates/page.tsx | 277 | Standalone templates management page |
| templates/error.tsx | 25 | Error boundary for templates page |

## API Endpoints Created

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/admin/templates | GET | List templates (filter by entityType/category) |
| /api/admin/templates | POST | Create new template |
| /api/admin/templates/[id] | GET | Fetch single template |
| /api/admin/templates/[id] | PATCH | Update template |
| /api/admin/templates/[id] | DELETE | Delete template |

## Forms Enhanced

- **News form:** Added load/save template buttons
- **Events form:** Added load/save template buttons
- Both forms populate fields from template content on load

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Button variant type error**
- **Found during:** Task 3 build
- **Issue:** Used `variant="destructive"` but Button component only supports primary/secondary/outline/ghost
- **Fix:** Changed to `variant="secondary"` with `className="bg-red-600 hover:bg-red-700"`
- **Files modified:** src/app/(dashboard)/admin/templates/page.tsx
- **Commit:** 4847273

**2. [Rule 1 - Bug] Zod error property mismatch**
- **Found during:** Initial API creation
- **Issue:** Used `error.errors` instead of `error.issues` for ZodError
- **Fix:** Changed to `error.issues` in both route files
- **Files modified:** src/app/api/admin/templates/route.ts, [id]/route.ts
- **Commit:** Fixed by linter before final commit

**3. [Rule 3 - Blocking] Prisma migration drift**
- **Found during:** Task 1 schema push
- **Issue:** `prisma db push` failed on generated column, `prisma migrate dev` failed on shadow database
- **Fix:** Used direct SQL with psql to create ContentTemplate table
- **Files modified:** None (manual SQL execution)
- **Commit:** Part of 3ca20f5

## Verification Results

✅ ContentTemplate model exists in schema
✅ API endpoints respond with proper authentication
✅ TemplatePicker component exports and integrates
✅ Templates page loads at /admin/templates
✅ News/Events forms include load/save buttons
✅ TypeScript compilation passes

## Success Criteria Met

- ✅ SEO-07: Content templates system (save template)
- ✅ SEO-08: Content templates system (load template)
- ✅ SEO-09: Template picker dialog with categories
- ✅ SEO-10: Standalone templates page at /dashboard/templates

## Performance Notes

- Templates fetch uses SWR with client-side caching
- Category counts computed in-memory (acceptable for template volumes)
- JSON content stored efficiently in PostgreSQL JSONB
- No pagination on templates list (expected low volume <100 templates)

## Next Phase Readiness

**Phase 5 (Bulk Operations):** Templates system complete, ready for CSV operations

**Potential Future Enhancements:**
- Template preview in admin list (currently only in picker)
- Template versioning (save history of template changes)
- Template duplication (clone template to create variants)
- Template import/export (share templates between instances)
- Template usage analytics (track which templates used most)

## Commits

| Task | Commit | Message | Files |
|------|--------|---------|-------|
| 1 | 3ca20f5 | feat(07-02): add ContentTemplate model and CRUD API | prisma/schema.prisma, src/app/api/admin/templates/ |
| 2 | a0ac284 | feat(07-02): add template picker dialog with category filtering | src/components/admin/template-picker.tsx |
| 3 | 4847273 | feat(07-02): add templates page and form integration | src/app/(dashboard)/admin/templates/, news/new, events/new |

---
**Duration:** 7 minutes 27 seconds
**Date:** 2026-01-29
**Phase:** 7 of 7 (SEO Tools)
**Plan:** 2 of 2 in phase
