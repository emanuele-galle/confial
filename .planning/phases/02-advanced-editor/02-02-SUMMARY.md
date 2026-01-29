---
phase: 02-advanced-editor
plan: 02
subsystem: editor
tags: [slash-commands, notion-style, media-picker, form-integration, tiptap]

dependency-graph:
  requires:
    - 02-01-tiptap-extensions
  provides:
    - Slash command menu (Notion-style)
    - Media picker stub (Phase 3 placeholder)
    - AdvancedEditor integrated in all content forms
  affects:
    - 03-01-media-library
    - All future content forms

tech-stack:
  added:
    - "@tiptap/suggestion@3.18.0"
  patterns:
    - TipTap Suggestion plugin for slash commands
    - React component rendering in ProseMirror plugin
    - Keyboard navigation with Arrow keys + Enter
    - Floating menu positioning with viewport boundary detection
    - Callback-based extension configuration

key-files:
  created:
    - src/components/editor/extensions/slash-commands.ts
    - src/components/editor/slash-commands.tsx
    - src/components/editor/media-picker-stub.tsx
  modified:
    - src/components/editor/extensions/index.ts
    - src/components/editor/advanced-editor.tsx
    - src/app/(dashboard)/admin/news/new/page.tsx
    - src/app/(dashboard)/admin/news/[id]/edit/page.tsx
    - src/app/(dashboard)/admin/events/new/page.tsx
    - src/app/(dashboard)/admin/events/[id]/edit/page.tsx

decisions:
  - decision: Use @tiptap/suggestion plugin for slash commands
    rationale: Official TipTap extension for command menus; handles triggering, filtering, and positioning
    outcome: Works with "/" character trigger, filters as user types
  - decision: Render React component via ReactDOM.createRoot in plugin
    rationale: TipTap suggestion expects DOM manipulation; createRoot allows React component rendering
    outcome: SlashCommandMenu renders properly with state management
  - decision: Media picker stub shows Phase 3 placeholder
    rationale: Media library not yet built; stub prevents breaking changes when integrated
    outcome: Users see clear message about future feature
  - decision: Replace all RichTextEditor usages with AdvancedEditor
    rationale: Consistent editing experience across all content forms
    outcome: News and Events forms now have slash commands, bubble menu, and TipTap extensions

metrics:
  duration: 4.7 minutes
  completed: 2026-01-29
---

# Phase 02 Plan 02: Slash Commands + Form Integration Summary

**One-liner:** Notion-style slash commands with 10 formatting options, media picker stub, and AdvancedEditor integrated into all News/Events forms.

## What Was Built

Completed the advanced editor integration with slash commands and form replacements:

1. **Slash Commands Extension** (`src/components/editor/extensions/slash-commands.ts`):
   - Uses @tiptap/suggestion plugin for command menu
   - Triggers on "/" character with fuzzy search filtering
   - 10 command options:
     - Heading 1, 2, 3 (H1, H2, H3)
     - Bullet List, Numbered List
     - Blockquote, Code Block
     - Image (opens media picker stub)
     - YouTube Video (URL prompt with validation)
     - Table (3x3 default)
   - Executes editor commands or triggers callbacks
   - Deletes slash trigger text after selection

2. **Slash Command Menu** (`src/components/editor/slash-commands.tsx`):
   - Floating menu positioned at cursor with viewport boundary detection
   - Keyboard navigation: ArrowUp/ArrowDown, Enter to select, Escape to close
   - Visual design:
     - White background, shadow-xl, rounded-xl
     - Icon in 32x32 gray container
     - Title + description for each command
     - Selected item highlighted with bg-gray-100
   - Auto-scrolls selected item into view
   - Filters items as user types query

3. **Media Picker Stub** (`src/components/editor/media-picker-stub.tsx`):
   - Dialog component with "Phase 3" message
   - Placeholder grid showing 4 mock media items
   - Visual preview of future media library
   - Close button to dismiss
   - Opened by slash command or toolbar Image button

4. **Extension Integration** (`src/components/editor/extensions/index.ts`):
   - Added SlashCommands to extension array
   - Updated EditorExtensionsConfig interface with callbacks:
     - onMediaPicker: Opens media picker stub
     - onYoutube: Opens YouTube URL prompt
   - Extensions now accept configuration options

5. **AdvancedEditor Updates** (`src/components/editor/advanced-editor.tsx`):
   - Added mediaPickerOpen state
   - handleMediaPicker callback opens stub dialog
   - handleYouTubeInsert validates URL and inserts video
   - Image toolbar button now opens media picker stub
   - YouTube toolbar button uses same handler as slash command
   - MediaPickerStub component rendered conditionally

6. **Form Replacements** (4 files):
   - **News create page**: RichTextEditor → AdvancedEditor
   - **News edit page**: RichTextEditor → AdvancedEditor
   - **Events create page**: RichTextEditor → AdvancedEditor
   - **Events edit page**: RichTextEditor → AdvancedEditor
   - All import statements updated
   - All component props remain identical (content, onChange, placeholder)

## Technical Decisions

### Slash Command Architecture

Used TipTap's official Suggestion plugin which handles:
- Trigger detection ("/" character)
- Query extraction (text after "/")
- Item filtering (fuzzy search on command titles)
- Command execution (delete trigger, run command)

This avoids reinventing the wheel and ensures compatibility with future TipTap versions.

### React Component in ProseMirror Plugin

TipTap Suggestion expects DOM manipulation in its render lifecycle. Solution:
1. Create DOM element on onStart
2. Use ReactDOM.createRoot() to mount React component
3. Update component props on onUpdate
4. Clean up on onExit

This allows full React state management (keyboard navigation, hover states) within the ProseMirror plugin.

### Media Picker Stub Design

Created placeholder dialog instead of stub button to:
- Show clear "Phase 3" messaging with context
- Demonstrate future media library UI pattern
- Allow immediate slash command integration
- Prevent breaking changes when real media library is added

### Form Integration Strategy

Replaced all RichTextEditor usages at once to:
- Ensure consistent editing experience across all content types
- Avoid mixed editor states in codebase
- Test slash commands immediately in all forms
- Simplify future editor enhancements (one component to update)

### YouTube Validation

Added URL validation to prevent invalid embeds:
- Check for "youtube.com", "youtu.be", or "vimeo.com"
- Alert user if URL is invalid
- Only insert video if validation passes

This prevents broken embeds and improves UX.

## Deviations from Plan

None - plan executed exactly as written. All auto-fixes were anticipated:

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] @tiptap/suggestion not installed**
- **Found during:** Task 1 (TypeScript compilation)
- **Issue:** Extension imports @tiptap/suggestion but package not in node_modules
- **Fix:** Installed @tiptap/suggestion@3.18.0
- **Files modified:** package.json, package-lock.json
- **Commit:** c5809c6

**2. [Rule 1 - Bug] TypeScript implicit any types**
- **Found during:** Task 1 (TypeScript compilation)
- **Issue:** Suggestion plugin callback parameters had implicit any types
- **Fix:** Added explicit types: { editor: Editor; range: any; props: any } and { query: string }
- **Files modified:** src/components/editor/extensions/slash-commands.ts
- **Commit:** c5809c6

## Verification Results

✅ **Build:** `npm run build` succeeded without errors or warnings
✅ **TypeScript:** `npx tsc --noEmit` passed with no errors
✅ **Imports:** All 4 forms import AdvancedEditor instead of RichTextEditor
✅ **Extensions:** SlashCommands in extension array with callbacks
✅ **Files exist:** slash-commands.ts, slash-commands.tsx, media-picker-stub.tsx created

### Manual Testing Checklist (for next session)

- [ ] Type "/" in News create form → slash menu appears
- [ ] Type "/tit" → filters to only "Titolo 1", "Titolo 2", "Titolo 3"
- [ ] Arrow keys navigate menu items
- [ ] Enter key selects command and inserts formatting
- [ ] Escape key closes menu
- [ ] Select "Immagine" → media picker stub opens with Phase 3 message
- [ ] Select "Video YouTube" → URL prompt appears
- [ ] Paste YouTube URL → video embeds in editor
- [ ] Select "Tabella" → 3x3 table inserted
- [ ] Events create form has same slash command functionality
- [ ] News edit form loads existing content and allows slash commands
- [ ] Events edit form loads existing content and allows slash commands

## Next Phase Readiness

**Blockers:** None

**Recommendations for 02-03 (Media Library Integration):**
1. Replace MediaPickerStub with real MediaPicker component
2. Update onMediaPicker callback to insert selected image URL into editor
3. Add image upload functionality in media picker dialog
4. Consider focal point detection for inserted images (Claude native vision)
5. Test slash command image insertion with real media library

**Technical Debt Introduced:**

- YouTube insertion uses prompt() (not ideal UX); consider inline dialog with preview
- No keyboard shortcut for slash commands (could add Cmd+/ to show menu)
- Slash menu positioning may need refinement for edge cases (bottom of viewport)
- No slash command for divider/horizontal rule (could add if requested)

## Files Changed

**Created (3 files):**
- src/components/editor/extensions/slash-commands.ts (203 lines) - TipTap extension
- src/components/editor/slash-commands.tsx (128 lines) - React menu component
- src/components/editor/media-picker-stub.tsx (66 lines) - Placeholder dialog

**Modified (6 files):**
- src/components/editor/extensions/index.ts - Added SlashCommands extension
- src/components/editor/advanced-editor.tsx - Integrated callbacks and stub
- src/app/(dashboard)/admin/news/new/page.tsx - RichTextEditor → AdvancedEditor
- src/app/(dashboard)/admin/news/[id]/edit/page.tsx - RichTextEditor → AdvancedEditor
- src/app/(dashboard)/admin/events/new/page.tsx - RichTextEditor → AdvancedEditor
- src/app/(dashboard)/admin/events/[id]/edit/page.tsx - RichTextEditor → AdvancedEditor

**Dependencies:**
- package.json - Added @tiptap/suggestion@3.18.0
- package-lock.json - Lockfile updated

**Total:** 9 files, 397 lines added, 8 lines removed

## Commits

| Commit | Message | Files |
|--------|---------|-------|
| c5809c6 | feat(02-02): create slash commands extension and menu | 4 files |
| 7e92321 | feat(02-02): integrate slash commands and media picker stub | 3 files |
| 46cc154 | feat(02-02): replace RichTextEditor with AdvancedEditor in all forms | 4 files |

**Total:** 3 commits, all atomic and revertable

---
*Completed: 2026-01-29 | Duration: 4.7 minutes*
