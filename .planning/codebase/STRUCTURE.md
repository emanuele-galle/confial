# Codebase Structure

**Analysis Date:** 2026-01-29

## Directory Layout

```
/var/www/projects/confial/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with fonts and metadata
│   │   ├── globals.css         # Global Tailwind styles
│   │   ├── (auth)/             # Route group: authentication pages
│   │   │   ├── layout.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/        # Route group: admin dashboard (protected)
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx
│   │   │       ├── news/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── news-list-client.tsx
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── [id]/
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx
│   │   │       ├── events/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── events-list-client.tsx
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── [id]/
│   │   │       │       ├── edit/
│   │   │       │       │   └── page.tsx
│   │   │       │       └── page.tsx
│   │   │       ├── documents/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── documents-list-client.tsx
│   │   │       │   └── new/
│   │   │       │       └── page.tsx
│   │   │       ├── users/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── [id]/
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx
│   │   │       ├── settings/
│   │   │       │   └── page.tsx
│   │   │       ├── error.tsx   # Error boundary for dashboard routes
│   │   │       └── news/
│   │   │           └── error.tsx  # Specific error boundary
│   │   ├── api/                # API routes (REST endpoints)
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── admin/
│   │   │   │   ├── news/
│   │   │   │   │   ├── route.ts           # GET list, POST create
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts       # GET detail, PUT update, DELETE
│   │   │   │   ├── events/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── documents/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── users/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── batch/
│   │   │   │   │   └── route.ts           # Bulk operations (delete, publish, etc.)
│   │   │   │   ├── stats/
│   │   │   │   │   └── route.ts           # Dashboard statistics
│   │   │   │   ├── audit-log/
│   │   │   │   │   └── route.ts           # Audit trail
│   │   │   │   └── settings/
│   │   │   │       └── change-password/
│   │   │   │           └── route.ts
│   │   │   ├── upload/
│   │   │   │   └── route.ts               # File upload to MinIO
│   │   │   ├── notifications/
│   │   │   │   ├── route.ts
│   │   │   │   ├── mark-all-read/
│   │   │   │   │   └── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── documents/                 # Public document endpoints
│   │   │       ├── route.ts
│   │   │       ├── [id]/
│   │   │       │   └── route.ts
│   │   │       └── [id]/
│   │   │           └── download/
│   │   │               └── route.ts
│   │   └── servizi/                       # Public service pages
│   │       ├── page.tsx
│   │       ├── consumatori/
│   │       ├── vertenze/
│   │       ├── inquilinato/
│   │       ├── istituto-studi/
│   │       ├── caf/
│   │       ├── legale/
│   │       └── patronato/
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Primitive UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── premium/        # Premium animated components
│   │   │       ├── reveal-on-scroll.tsx
│   │   │       ├── glow-card.tsx
│   │   │       ├── magnetic-button.tsx
│   │   │       ├── text-reveal.tsx
│   │   │       ├── parallax-section.tsx
│   │   │       ├── floating-element.tsx
│   │   │       └── animated-counter.tsx
│   │   ├── admin/              # Dashboard-specific components
│   │   │   ├── dashboard-sidebar.tsx      # Navigation sidebar
│   │   │   ├── dashboard-header.tsx       # Top header bar
│   │   │   ├── stat-card.tsx              # Dashboard stat display
│   │   │   ├── search-bar.tsx             # List search filter
│   │   │   ├── filter-dropdown.tsx        # Status/featured filter
│   │   │   ├── bulk-actions-bar.tsx       # Checkbox + bulk ops
│   │   │   ├── image-upload.tsx           # Image upload widget
│   │   │   ├── form-field.tsx             # Form field wrapper
│   │   │   └── notification-dropdown.tsx  # User notifications
│   │   ├── layout/             # Layout wrapper components
│   │   │   ├── conditional-layout.tsx     # Routes layout branching
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   ├── editor/             # Rich text editing
│   │   │   └── rich-text-editor.tsx       # TipTap editor with extensions
│   │   ├── sections/           # Page section components
│   │   │   └── ...tsx
│   │   └── providers/          # Context providers
│   │       ├── session-provider.tsx       # NextAuth SessionProvider
│   │       └── toaster-provider.tsx       # Sonner toast manager
│   │
│   └── lib/                    # Shared utilities and configuration
│       ├── auth.ts             # NextAuth export
│       ├── auth.config.ts      # NextAuth config (Credentials provider)
│       ├── prisma.ts           # Prisma singleton
│       ├── utils.ts            # Helper utilities (cn, etc.)
│       ├── minio.ts            # MinIO client
│       ├── audit-log.ts        # Audit logging
│       └── schemas/            # Zod validation schemas
│           ├── news.ts         # createNewsSchema, updateNewsSchema
│           ├── user.ts         # createUserSchema, updateUserSchema
│           ├── event.ts        # createEventSchema, updateEventSchema
│           └── document.ts     # createDocumentSchema
│
├── prisma/                     # Database schema and migrations
│   ├── schema.prisma           # Data models (News, User, Document, Event, etc.)
│   ├── migrations/
│   └── seed.ts                 # Initial data seeding
│
├── public/                     # Static assets
│   ├── icons/
│   ├── images/
│   └── manifest.json
│
├── .github/                    # GitHub Actions
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts          # Tailwind v4.1 PostCSS config
```

## Directory Purposes

**`src/app/(dashboard)/admin/`:**
- Purpose: Admin dashboard interface for content management
- Contains: List pages, detail/edit pages, error boundaries
- Key files: `page.tsx` (list), `[id]/edit/page.tsx` (form), `*-list-client.tsx` (interactive list)
- Access: Protected by `(dashboard)/layout.tsx` auth check

**`src/app/api/admin/`:**
- Purpose: CRUD REST endpoints for dashboard operations
- Contains: Route handlers with POST/GET/PUT/DELETE
- Key files: `news/route.ts`, `users/route.ts`, `documents/route.ts`, `batch/route.ts`
- Pattern: All routes validate session before querying

**`src/components/admin/`:**
- Purpose: Reusable dashboard UI components
- Contains: Sidebar, header, search, filters, bulk actions, stat cards
- Key files: `dashboard-sidebar.tsx`, `search-bar.tsx`, `bulk-actions-bar.tsx`
- Usage: Imported by dashboard pages and layouts

**`src/lib/schemas/`:**
- Purpose: Zod validation for API request bodies
- Contains: Schema definitions with TypeScript type inference
- Key files: `news.ts`, `user.ts`, `event.ts`, `document.ts`
- Pattern: Each has `create*Schema` (required fields) and `update*Schema` (all partial)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout for all pages (fonts, metadata, global CSS)
- `src/app/(auth)/login/page.tsx`: Login page (public, no auth required)
- `src/app/(dashboard)/admin/page.tsx`: Dashboard home (authenticated)

**Configuration:**
- `src/lib/auth.config.ts`: NextAuth configuration with Credentials provider
- `src/lib/prisma.ts`: Prisma singleton with PostgreSQL adapter
- `tsconfig.json`: Path alias `@/*` → `src/*`

**Core Logic:**
- `src/lib/audit-log.ts`: Audit trail recording
- `src/lib/minio.ts`: S3-compatible file storage client
- `src/components/layout/conditional-layout.tsx`: Route branching (auth vs public)

**Testing:**
- No test directory yet (Vitest configured in package.json)
- Recommended: `src/**/*.test.ts`, `src/**/*.spec.ts`

## Naming Conventions

**Files:**
- List pages: `page.tsx` (server component)
- Client interactive lists: `*-list-client.tsx` (marked "use client")
- Edit pages: `[id]/edit/page.tsx`
- API routes: `route.ts` in directory matching the endpoint path
- Components: PascalCase (e.g., `DashboardSidebar.tsx`)
- Utilities: camelCase (e.g., `audit-log.ts`)

**Directories:**
- Route groups (layout scoping): Wrapped in parentheses `(auth)`, `(dashboard)`
- Dynamic routes: Square brackets `[id]`, `[...nextauth]`
- Feature-based: `admin/`, `news/`, `events/` group related routes
- Flat component structure: `components/ui/`, `components/admin/`, `components/layout/`

## Where to Add New Code

**New Feature (e.g., add "Blog Comments"):**

1. **Database Model** → `prisma/schema.prisma`
2. **API Routes:**
   - List: `src/app/api/admin/comments/route.ts` (GET, POST)
   - Detail: `src/app/api/admin/comments/[id]/route.ts` (GET, PUT, DELETE)
3. **Validation Schema** → `src/lib/schemas/comment.ts`
4. **Dashboard Pages:**
   - List: `src/app/(dashboard)/admin/comments/page.tsx` + `*-list-client.tsx`
   - Detail: `src/app/(dashboard)/admin/comments/[id]/edit/page.tsx`
5. **Components** → `src/components/admin/` if needed (form fields, filters)
6. **Navigation** → Update `src/components/admin/dashboard-sidebar.tsx` navigation array

**New Admin Component:**
- Implementation: `src/components/admin/my-component.tsx`
- Import path: `@/components/admin/my-component`
- Pattern: Use "use client" if interactive (state, event handlers)

**Utilities:**
- Shared helpers: `src/lib/utils.ts` or new file like `src/lib/helpers.ts`
- Client utilities: Can also go in `src/components/admin/` if component-specific
- Example: Toast notifications use `sonner` directly (already imported)

## Special Directories

**`src/app/api/auth/[...nextauth]/`:**
- Purpose: NextAuth credential validation and session management
- Generated: NO (manually configured)
- Committed: YES
- Notes: Catches all `/api/auth/*` requests and delegates to NextAuth

**`.next/`:**
- Purpose: Build output and type cache
- Generated: YES
- Committed: NO (in .gitignore)

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: YES
- Committed: NO

**`prisma/migrations/`:**
- Purpose: Database migration history
- Generated: YES (by `prisma migrate dev`)
- Committed: YES (tracks schema evolution)

---

*Structure analysis: 2026-01-29*
