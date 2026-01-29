# Technology Stack

**Analysis Date:** 2026-01-29

## Languages

**Primary:**
- TypeScript 5.9.3 - All source code, API routes, configuration
- JavaScript (JSX/TSX) - React components and Next.js pages

**Secondary:**
- SQL (PostgreSQL) - Database schema via Prisma

## Runtime

**Environment:**
- Node.js 24.13.0

**Package Manager:**
- npm 11.8.0
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack framework with App Router, API routes, image optimization
- React 19.2.4 - Component library

**UI & Styling:**
- TailwindCSS 4.1.18 - Utility-first CSS framework
- Radix UI - Headless component primitives
  - @radix-ui/react-dialog 1.1.15
  - @radix-ui/react-dropdown-menu 2.1.16
  - @radix-ui/react-label 2.1.8
  - @radix-ui/react-select 2.2.6
  - @radix-ui/react-tabs 1.1.13

**Forms & Validation:**
- React Hook Form 7.71.1 - Form state management
- Zod 4.3.6 - TypeScript-first schema validation
- @hookform/resolvers 5.2.2 - Zod integration for RHF

**Rich Text Editor:**
- TipTap 3.17.1 - Headless WYSIWYG editor
  - @tiptap/react 3.17.1
  - @tiptap/starter-kit 3.17.1
  - @tiptap/extension-image 3.17.1
  - @tiptap/extension-placeholder 3.17.1

**Testing:**
- Vitest 4.0.18 - Unit and component testing framework
- Unit tests co-located with source files (`*.test.ts`, `*.test.tsx`)

**Build/Dev:**
- Turbopack - Fast incremental bundler for dev mode (`next dev --turbopack`)
- TypeScript - Type checking and compilation

## Key Dependencies

**Critical:**
- @auth/prisma-adapter 2.11.1 - NextAuth.js Prisma integration
- next-auth 5.0.0-beta.30 - Authentication middleware
  - Credentials provider (email/password)
  - JWT session strategy
  - Custom callback hooks

**Database & ORM:**
- @prisma/client 7.3.0 - Database client and query builder
- @prisma/adapter-pg 7.3.0 - PostgreSQL adapter for Prisma
- pg 8.17.2 - Native PostgreSQL driver

**Storage & Files:**
- minio 8.0.6 - MinIO SDK for object storage
- @types/minio 7.1.0 - TypeScript types for MinIO
- sharp 0.34.5 - Image optimization/resizing

**Security:**
- bcrypt 6.0.0 - Password hashing and verification
- @types/bcrypt 6.0.0 - TypeScript types

**UI Components & Animation:**
- lucide-react 0.563.0 - Icon library
- framer-motion 12.29.2 - Animation library
- clsx 2.1.1 - Conditional className utilities
- tailwind-merge 3.4.0 - Merge Tailwind classes without conflicts
- class-variance-authority 0.7.1 - Component variant system
- sonner 2.0.7 - Toast notifications

**Utilities:**
- date-fns 4.1.0 - Date manipulation and formatting
- dotenv 17.2.3 - Environment variable loading

## Configuration

**Environment:**
- `.env` file in project root contains:
  - `DATABASE_URL` - PostgreSQL connection string
  - `AUTH_SECRET` - NextAuth.js JWT secret
  - `AUTH_URL` - Auth.js origin (https://failms.org)
  - `AUTH_TRUST_HOST` - Trust proxy headers
  - `MINIO_ACCESS_KEY` - MinIO access credentials
  - `MINIO_SECRET_KEY` - MinIO secret credentials
  - `NODE_ENV` - production
  - `PORT` - 3020 (PM2 managed)
  - `NEXT_PUBLIC_SITE_URL` - Public app URL

**Build Configuration:**

TypeScript - `tsconfig.json`:
- Target: ES2017
- Strict mode enabled
- Module resolution: bundler
- Path alias: `@/*` → `./src/*`
- Strict null checks, no implicit any

Next.js - `next.config.ts`:
- Turbopack enabled for dev (`--turbopack` flag)
- Image optimization with remote pattern whitelist
  - Allowed domain: `confialtv.it` (HTTPS)

Tailwind - Default configuration with `@tailwindcss/postcss 4.1.18`

## Platform Requirements

**Development:**
- Node.js 24.13.0
- npm 11.8.0
- PostgreSQL 18+ (for DATABASE_URL connection)
- MinIO server accessible at `127.0.0.1:9000`
- TypeScript 5.9.3 (dev dependency)

**Production:**
- Node.js 24.13.0 runtime
- PostgreSQL 18+ database
- MinIO S3-compatible object storage
- Environment variables configured (DATABASE_URL, AUTH_SECRET, MINIO credentials)
- HTTPS enabled (AUTH_URL must match domain)
- Port 3020 exposed (PM2 managed on VPS)

**Build Output:**
- `.next/` directory (Next.js build artifacts)
- Builds run via `npm run build`
- Static export not used (full SSR + API routes required)

---

*Stack analysis: 2026-01-29*
