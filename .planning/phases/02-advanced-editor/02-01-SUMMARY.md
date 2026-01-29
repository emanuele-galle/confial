---
phase: 02-advanced-editor
plan: 01
subsystem: editor
tags: [tiptap, wysiwyg, code-splitting, bubble-menu, youtube, tables]

dependency-graph:
  requires:
    - 01-01-dashboard-stats
    - 01-02-trend-charts
  provides:
    - Advanced WYSIWYG editor with TipTap extensions
    - Code-split editor component (ssr: false)
    - Bubble menu for text selection
    - Link dialog with URL validation
  affects:
    - 02-02-slash-commands
    - 02-03-media-picker

tech-stack:
  added:
    - "@tiptap/extension-youtube@3.18.0"
    - "@tiptap/extension-table@3.18.0"
    - "@tiptap/extension-table-row@3.18.0"
    - "@tiptap/extension-table-cell@3.18.0"
    - "@tiptap/extension-table-header@3.18.0"
    - "@tiptap/extension-text-align@3.18.0"
    - "@tiptap/extension-bubble-menu@3.18.0"
    - "@tiptap/extension-link@3.18.0"
    - "@tiptap/extension-underline@3.18.0"
    - "@tiptap/extension-highlight@3.18.0"
  patterns:
    - next/dynamic code-splitting for heavy components
    - shadcn UI pattern for Dialog and Select
    - Custom positioned bubble menu (no extension React component)
    - Centralized extension configuration with factory function

key-files:
  created:
    - src/components/editor/extensions/index.ts
    - src/components/editor/bubble-menu.tsx
    - src/components/editor/link-dialog.tsx
    - src/components/editor/advanced-editor.tsx
    - src/components/editor/index.tsx
    - src/components/ui/dialog.tsx
    - src/components/ui/select.tsx
  modified:
    - package.json
    - package-lock.json

decisions:
  - decision: Custom bubble menu instead of @tiptap/extension-bubble-menu React component
    rationale: The BubbleMenu export from extension package is not a React component; built custom positioned menu with useEffect
    outcome: Works with text selection detection and positioning
  - decision: Code-split AdvancedEditor with next/dynamic
    rationale: TipTap + extensions add ~80KB; keep initial bundle small
    outcome: Editor loaded only when needed, ssr: false for client-only rendering
  - decision: Highlight extension added to bundle
    rationale: Bubble menu includes highlight button for text emphasis
    outcome: Yellow background highlight available in bubble menu

metrics:
  duration: 7.6 minutes
  completed: 2026-01-29
---

# Phase 02 Plan 01: TipTap Extensions + Code-Split Editor Summary

**One-liner:** Professional WYSIWYG editor with YouTube embeds, tables, text alignment, bubble menu, and code-splitting (80KB lazy-loaded).

## What Was Built

Transformed basic textarea into professional TipTap-based WYSIWYG editor with:

1. **Extension Bundle** (`src/components/editor/extensions/index.ts`):
   - YouTube embeds (640x360, fullscreen enabled)
   - Table support (resizable, 3x3 default)
   - Text alignment (left, center, right, justify)
   - Link with attributes (href, target, rel)
   - Underline, Highlight, Image
   - Centralized configuration via `getEditorExtensions()` factory

2. **Bubble Menu** (`src/components/editor/bubble-menu.tsx`):
   - Custom positioned menu on text selection
   - Bold, Italic, Underline, Link, Highlight buttons
   - Positioned above selection with transform calculations
   - Active state styling with #018856 brand color

3. **Link Dialog** (`src/components/editor/link-dialog.tsx`):
   - URL input with validation (absolute/relative URLs)
   - Open in new tab checkbox
   - Rel attribute dropdown (noopener noreferrer, nofollow, sponsored)
   - Pre-populates when editing existing links
   - URL preview truncated to 50 chars

4. **Advanced Editor** (`src/components/editor/advanced-editor.tsx`):
   - Comprehensive toolbar with sections:
     - Text formatting: Bold, Italic, Underline, Strikethrough
     - Headings: Dropdown (Paragraph, H1, H2, H3)
     - Alignment: Left, Center, Right, Justify
     - Lists: Bullet, Numbered
     - Media: Image (stub), YouTube, Table
     - Utilities: Link, Blockquote, Code, Undo, Redo
   - Integrates BubbleMenu and LinkDialog
   - Matches existing prose styling
   - onImageInsert prop for media picker (Plan 02-02)

5. **Code-Split Export** (`src/components/editor/index.tsx`):
   - next/dynamic wrapper with ssr: false
   - Loading placeholder (300px skeleton)
   - Backward compatible RichTextEditor export

6. **UI Components** (shadcn pattern):
   - Dialog component for modals
   - Select component for dropdowns

## Technical Decisions

### Extension Architecture
Created centralized `getEditorExtensions()` factory that returns configured extensions array. This makes the editor configurable and testable - each extension can be toggled independently.

### Bubble Menu Implementation
TipTap's BubbleMenu extension exports a ProseMirror extension, not a React component. Built custom positioned menu using `useEffect` to track selection changes and calculate coordinates with `editor.view.coordsAtPos()`.

### Code-Splitting Strategy
Used `next/dynamic` with `ssr: false` to code-split the entire editor. TipTap + all extensions ≈ 80KB, loaded only when users access editor pages. Keeps initial bundle under 300KB target.

### Link Dialog UX
Pre-populates dialog fields when editing existing links by reading `editor.getAttributes('link')`. Validates URLs with try/catch URL constructor, allowing both absolute and relative paths.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Highlight extension**
- **Found during:** Task 2 (bubble menu creation)
- **Issue:** Bubble menu included Highlight button but extension wasn't in bundle
- **Fix:** Installed @tiptap/extension-highlight and added to extensions/index.ts
- **Files modified:** src/components/editor/extensions/index.ts, package.json
- **Commit:** 8d4283d

**2. [Rule 2 - Missing Critical] Dialog and Select UI components**
- **Found during:** Task 2 (link dialog creation)
- **Issue:** LinkDialog requires Dialog and Select from shadcn, but components didn't exist
- **Fix:** Created dialog.tsx and select.tsx following shadcn UI patterns
- **Files modified:** src/components/ui/dialog.tsx, src/components/ui/select.tsx
- **Commit:** 8d4283d

**3. [Rule 1 - Bug] BubbleMenu import error**
- **Found during:** Task 2 (TypeScript compilation)
- **Issue:** @tiptap/extension-bubble-menu exports ProseMirror extension, not React component
- **Fix:** Built custom positioned bubble menu with useEffect and selection tracking
- **Files modified:** src/components/editor/bubble-menu.tsx
- **Commit:** 8d4283d

**4. [Rule 1 - Bug] Named imports for TipTap extensions**
- **Found during:** Task 1 (TypeScript compilation)
- **Issue:** Table, TableRow, etc. are named exports, not default exports
- **Fix:** Changed import statements to use destructured named imports
- **Files modified:** src/components/editor/extensions/index.ts
- **Commit:** 2dea858

**5. [Rule 1 - Bug] Optional onImageInsert handler**
- **Found during:** Task 3 (TypeScript compilation)
- **Issue:** onImageInsert is optional but passed directly to onClick (undefined not assignable)
- **Fix:** Wrapped in arrow function with optional chaining: `() => onImageInsert?.()`
- **Files modified:** src/components/editor/advanced-editor.tsx
- **Commit:** 43ddf20

## Verification Results

✅ **Build:** `npm run build` succeeded without errors
✅ **TypeScript:** `npx tsc --noEmit` passed with no errors
✅ **Code-splitting:** Dynamic import confirmed in src/components/editor/index.tsx
✅ **Extensions installed:** All 10 TipTap extensions in package.json
✅ **Commits:** 3 atomic commits (extensions → components → editor)

### Manual Testing Checklist (for Plan 02-02)
- [ ] YouTube embed works (paste URL in prompt)
- [ ] Table insertion works (3x3 grid appears)
- [ ] Text alignment buttons work (left/center/right/justify)
- [ ] Bubble menu appears on text selection
- [ ] Link dialog opens and saves links correctly
- [ ] Highlight button in bubble menu works
- [ ] Code-split editor loads with skeleton

## Next Phase Readiness

**Blockers:** None

**Recommendations for 02-02 (Slash Commands + Media Picker):**
1. Use `editor.commands.insertContent()` for slash command insertions
2. Leverage existing `onImageInsert` prop stub for media picker integration
3. Consider Tippy.js or similar for slash command dropdown positioning
4. Test YouTube embed with various URL formats (youtube.com, youtu.be)
5. Add keyboard shortcuts for slash command navigation (up/down arrows)

**Technical Debt Introduced:**
- Bubble menu positioning uses fixed positioning; may need viewport boundary detection for long selections
- YouTube insert uses prompt() (not ideal UX); consider inline dialog in 02-02
- No table manipulation controls yet (add row/col, delete, merge cells)

## Files Changed

**Created (7 files):**
- src/components/editor/extensions/index.ts (80 lines) - Extension bundle
- src/components/editor/bubble-menu.tsx (132 lines) - Selection menu
- src/components/editor/link-dialog.tsx (174 lines) - Link configuration
- src/components/editor/advanced-editor.tsx (340 lines) - Main editor
- src/components/editor/index.tsx (21 lines) - Code-split export
- src/components/ui/dialog.tsx (132 lines) - Modal component
- src/components/ui/select.tsx (169 lines) - Dropdown component

**Modified (2 files):**
- package.json - Added 10 TipTap extensions
- package-lock.json - Dependency lockfile

**Total:** 9 files, 1048 lines added

## Commits

| Commit | Message | Files |
|--------|---------|-------|
| 2dea858 | feat(02-01): install TipTap extensions and create extension bundle | 3 files |
| 8d4283d | feat(02-01): create bubble menu and link dialog components | 7 files |
| 43ddf20 | feat(02-01): create code-split advanced editor component | 2 files |

**Total:** 3 commits, all atomic and revertable

---
*Completed: 2026-01-29 | Duration: 7.6 minutes*
