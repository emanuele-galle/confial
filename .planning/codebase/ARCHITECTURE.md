# Architecture

**Analysis Date:** 2026-01-29

## Pattern Overview

**Overall:** Next.js 16.1.6 with App Router and Server Components

**Key Characteristics:**
- Route groups `(auth)`, `(dashboard)`, `(public)` for layout separation
- Server-rendered dashboard with client-side interactive lists
- REST API layer at `/api/admin/*` for CRUD operations
- Middleware authentication with NextAuth v5 (Credentials provider)
- Prisma ORM with PostgreSQL adapter
- Zod schemas for validation

## Layers

**Server Layer (Layout & Pages):**
- Purpose: Initial data fetching, authentication checks, server-side rendering
- Location: `src/app/(dashboard)/admin/*.tsx` pages (not marked "use client")
- Contains: Dashboard landing pages, server-side data queries
- Depends on: `@/lib/auth`, `@/lib/prisma`, Prisma schemas
- Used by: Route layouts and dashboard root pages

**Client Layer (Interactive Lists & Forms):**
- Purpose: User interactions, filtering, sorting, bulk operations
- Location: `src/app/(dashboard)/admin/*-list-client.tsx`, edit pages with "use client"
- Contains: State management (`useState`), API calls with `fetch`, event handlers
- Depends on: React hooks, API routes at `/api/admin/*`
- Used by: Server pages that delegate rendering

**API Layer:**
- Purpose: Business logic, validation, database operations, authorization
- Location: `src/app/api/admin/*/route.ts`
- Contains: GET (list/fetch), POST (create), PUT/PATCH (update), DELETE operations
- Depends on: `@/lib/prisma`, `@/lib/auth`, `@/lib/schemas/*`, `bcrypt`, `minio`
- Used by: Client components via `fetch()`

**Component Layer:**
- Purpose: Reusable UI building blocks
- Location: `src/components/ui/*`, `src/components/admin/*`, `src/components/layout/*`
- Contains: Button, Input, Dialog, Dropdown, SearchBar, FilterDropdown, StatCard, DashboardSidebar
- Depends on: Radix UI, Lucide icons, Tailwind CSS, framer-motion
- Used by: Pages and client components

**Shared Library Layer:**
- Purpose: Cross-cutting utilities, configuration, authentication
- Location: `src/lib/*`
- Contains: Prisma singleton, NextAuth config, Zod schemas, audit logging, MinIO client
- Depends on: External packages (prisma, next-auth, zod, bcrypt, minio)
- Used by: All other layers

## Data Flow

**Admin Dashboard Request Flow:**

1. User navigates to `/admin`
2. Route group layout `(dashboard)/layout.tsx` calls `auth()` (server-side)
3. If not authenticated → redirect to `/login`
4. If authenticated → render sidebar + header + main content
5. Dashboard page `admin/page.tsx` runs server-side queries via Prisma
   - Fetches stats: `prisma.news.count()`, `prisma.document.count()`, etc.
   - Fetches recent data: `prisma.news.findMany()`, `prisma.document.findMany()`
6. Page renders static content with data
7. Links point to list pages (e.g., `/admin/news`)

**List Page (News) Flow:**

1. Server page `admin/news/page.tsx` renders `<NewsListClient />`
2. Client component mounts with `"use client"`
3. `NewsListClient` has `useState` for filters, page, selected items
4. On mount: `useEffect(() => fetchNews())` hits `/api/admin/news?page=1&limit=20`
5. API route validates session via `auth()`, builds Prisma `where` clause
6. API returns paginated data with metadata
7. Client renders list with interactive controls
8. User actions (search, filter, bulk delete) trigger `fetch()` to `/api/admin/batch`

**Edit Page Flow:**

1. Server page `admin/news/[id]/edit/page.tsx` marked "use client"
2. Page fetches data via `fetch('/api/admin/news/{id}')`
3. State initialized with form data
4. Form fields update state on change
5. On submit: `fetch('/api/admin/news/{id}', { method: 'PUT' })`
6. API validates and updates Prisma
7. Toast notification shows success/error
8. Router redirects to list page on success

**State Management:**
- Local state: `useState()` for form fields, filters, selections in client components
- No global state manager (Redux/Zustand) - local state sufficient for admin context
- Session state: Managed by NextAuth provider, accessed via `auth()` on server
- Pagination state: URL query params encoded in API calls

## Key Abstractions

**Authentication Gate:**
- Purpose: Protect dashboard routes and API endpoints
- Examples: `src/lib/auth.ts`, `src/app/(dashboard)/layout.tsx`
- Pattern: All dashboard routes call `auth()` and redirect unauthenticated users to `/login`

**Validation Layer:**
- Purpose: Ensure data integrity before persistence
- Examples: `src/lib/schemas/news.ts`, `src/lib/schemas/user.ts`
- Pattern: Zod schemas with `.safeParse()` in API routes, error flattening for client

**Database Access:**
- Purpose: Single Prisma instance across request lifecycle
- Examples: `src/lib/prisma.ts`, `src/app/api/admin/news/route.ts`
- Pattern: Singleton with fallback in development, adapter-based PostgreSQL connection

**File Storage:**
- Purpose: MinIO S3-compatible bucket for images/documents
- Examples: `src/lib/minio.ts`, `src/components/admin/image-upload.tsx`
- Pattern: Upload endpoint at `/api/upload`, stores signed URLs in database

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page load
- Responsibilities: Global metadata, font loading, conditional layout wrapper

**Dashboard Layout:**
- Location: `src/app/(dashboard)/layout.tsx`
- Triggers: Navigation to `/admin` or any `/admin/*` route
- Responsibilities: Authentication check, sidebar/header rendering, session provider

**Auth Layout:**
- Location: `src/app/(auth)/layout.tsx`
- Triggers: Navigation to `/login`
- Responsibilities: Minimal layout (passthrough) for login page

**API Auth Route:**
- Location: `src/app/api/auth/[...nextauth]/route.ts`
- Triggers: NextAuth credential verification and session management
- Responsibilities: Credential validation, token generation, user lookup

## Error Handling

**Strategy:** Multiple layers with graceful degradation

**Patterns:**

1. **Route-level Error Boundary:**
   - File: `src/app/(dashboard)/admin/news/error.tsx`
   - Catches errors from descendant routes
   - Shows user-friendly error UI with digest ID
   - Provides reset button

2. **API-level Validation:**
   - Zod `safeParse()` returns errors without throwing
   - API returns `{ error: "...", details: {...} }` with status codes
   - Client handles 401 (unauthorized), 403 (forbidden), 400 (validation), 500 (server)

3. **Client-side Toast Notifications:**
   - Library: `sonner` (Toaster component in layout)
   - Pattern: `toast.error("message")` for API failures
   - Example: `fetch()` failures show toast in catch block

4. **Session Errors:**
   - On auth failure, API returns 401
   - Client-side: No automatic redirect (handled by page logic)
   - Server-side: Middleware would redirect (if configured)

## Cross-Cutting Concerns

**Logging:**
- Audit trail via `src/lib/audit-log.ts` for sensitive operations
- Console logging in error boundaries and API errors
- No centralized logging service (local only)

**Validation:**
- Zod schemas at `src/lib/schemas/*` for API request/response validation
- Schemas are Zod objects with TypeScript inference (type safety)
- Error details flattened for client-side field-level feedback

**Authentication:**
- NextAuth v5 with Credentials provider using bcrypt password comparison
- Session validated on every API request via `auth()`
- JWT stored in httpOnly cookie (NextAuth default)
- Role-based access control: SUPER_ADMIN checks in `/api/admin/users/*` routes

**Authorization:**
- Enforced at API route level (e.g., "only SUPER_ADMIN can view users")
- No client-side authorization (server is source of truth)
- Check happens in every route handler before querying database

---

*Architecture analysis: 2026-01-29*
