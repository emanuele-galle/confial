# External Integrations

**Analysis Date:** 2026-01-29

## APIs & External Services

**None detected** - CONFIAL is a self-contained CMS with no external API integrations currently configured.

## Data Storage

**Databases:**
- PostgreSQL 18
  - Connection: Via environment variable `DATABASE_URL` in `.env`
  - Format: `postgresql://confial_user:xK9mNpL2vQ7wR4tY8uZ3aB6cD0eF5gH1@127.0.0.1:5441/confial_db`
  - Adapter: `@prisma/adapter-pg@7.3.0`
  - Client: `@prisma/client@7.3.0`
  - Location: Database is managed externally (VPS PostgreSQL service)

**File Storage:**
- MinIO S3-compatible object storage
  - Endpoint: `http://127.0.0.1:9000` (local)
  - Access: Configured in `src/lib/minio.ts`
  - Credentials: `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` from environment
  - Buckets: `src/lib/minio.ts` manages three buckets:
    - `confial-news-images` - News article cover images
    - `confial-events-images` - Event cover images
    - `confial-documents` - Document uploads (PDFs, etc.)
  - Image optimization: sharp 0.34.5 processes uploads (resize to 1920px, JPEG compression at 85%)
  - URL generation: Presigned URLs with 7-day expiration via `minioClient.presignedGetObject()`

**Caching:**
- None (no Redis or caching layer configured)

## Authentication & Identity

**Auth Provider:**
- Custom implementation with NextAuth.js v5.0.0-beta.30

**Implementation Details:**

Location: `src/lib/auth.config.ts`, `src/lib/auth.ts`

Provider: Credentials (email/password)
- Email validation required
- Password minimum 8 characters (enforced via Zod schema)
- Password hashing: bcrypt 6.0.0 with salt rounds
- Credentials stored in PostgreSQL `users` table (`password` field)

API Route: `src/app/api/auth/[...nextauth]/route.ts`
- Exports NextAuth handlers (GET, POST)
- Wraps with `handlers` from `src/lib/auth.ts`

Session Configuration:
- Strategy: JWT (stateless)
- Max age: 30 days
- Custom callbacks in auth config:
  - `jwt()` callback - Inject user `id` and `role` into token
  - `session()` callback - Expose `id` and `role` to session object

Database Schema Integration:
- User model: `src/prisma/schema.prisma` (users table)
  - Fields: id, email, name, password (bcrypt), role (ADMIN | SUPER_ADMIN), emailVerified, image, createdAt, updatedAt, lastLoginAt
  - Relations: newsArticles, documents, auditLogs, notifications
- Account, Session, VerificationToken models - Present but unused (Credentials provider doesn't use them)

Protected Routes:
- Auth middleware wraps all admin dashboard routes
- `await auth()` checks session in API routes
- Returns 401 if no session found
- Session contains: user.id, user.email, user.name, user.role

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, DataDog, etc.)
- Console logging for errors only (`console.error()`)

**Logs:**
- Server-side logs to stdout/PM2 logs
- Error logging in API routes and lib functions:
  - `src/lib/audit-log.ts` - Logs failures but doesn't crash main operation
  - `src/app/api/upload/route.ts` - Console errors for upload failures

**Audit Logging:**
- Custom audit log system in `src/lib/audit-log.ts`
  - AuditLog model tracks user actions:
    - Fields: id, userId, action (CREATE|UPDATE|DELETE|LOGIN|LOGOUT), entityType (news|events|documents|users), entityId, oldValues (JSON), newValues (JSON), ipAddress, userAgent, createdAt
    - Indexes on userId, entityType+entityId, createdAt
  - Log function: `logAction()` - Async, non-blocking (failures don't affect main operation)
  - IP extraction: From `x-forwarded-for` or `x-real-ip` headers (proxy support)
  - Sensitive data sanitization: `sanitizeValues()` redacts password/token/secret/apiKey fields before logging
  - API route: `src/app/api/admin/audit-log/route.ts` - Retrieve audit logs with pagination

## CI/CD & Deployment

**Hosting:**
- VPS at 193.203.190.63
- PM2 process manager on port 3020
- Traefik reverse proxy (SSL/TLS termination via Docker)

**CI Pipeline:**
- Not configured (no GitHub Actions workflow detected in VPS-local project)
- Manual deployment via `zero-downtime-deploy.sh` script

**Build & Start Commands:**
- Development: `npm run dev` (with Turbopack)
- Build: `npm run build`
- Production: `npm start` (Next.js server)

## Environment Configuration

**Required env vars:**
```
DATABASE_URL              postgresql://...  (PostgreSQL connection)
AUTH_SECRET              Random JWT secret (mZp6L1foOS/k7Grz...)
AUTH_URL                 https://failms.org (Origin for auth)
AUTH_TRUST_HOST          true (Trust proxy headers)
MINIO_ACCESS_KEY         vps_minio_admin (MinIO user)
MINIO_SECRET_KEY         VpsMinioSecure2024 (MinIO password)
NODE_ENV                 production
PORT                     3020 (PM2 port)
NEXT_PUBLIC_SITE_URL     https://failms.org (Public app URL)
```

**Secrets location:**
- `.env` file in project root (not committed, VPS-only)
- Loaded via `dotenv@17.2.3` at runtime

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Admin Dashboard API Routes

**News Management:**
- `src/app/api/admin/news/route.ts` - GET (paginated list with search/filter), POST (create)
- `src/app/api/admin/news/[id]/route.ts` - PUT, DELETE (update/delete by id)
- Filters: search (title/excerpt/content), status (DRAFT|PUBLISHED|ARCHIVED), featured flag
- Pagination: page, limit parameters
- Slug generation: Auto-generated from title, collision detection with counter

**Events Management:**
- `src/app/api/admin/events/route.ts` - GET, POST
- `src/app/api/admin/events/[id]/route.ts` - PUT, DELETE
- Event-specific fields: eventDate, eventTime, location, registrationOpen, maxParticipants

**Documents:**
- `src/app/api/admin/documents/route.ts` - Presumed GET, POST endpoints
- Document metadata: filename, filepath (unique), fileSize, mimeType, category, downloadCount

**Users:**
- `src/app/api/admin/users/route.ts` - GET (list users)
- `src/app/api/admin/users/[id]/route.ts` - PUT, DELETE
- User roles: ADMIN, SUPER_ADMIN
- Password change: `src/app/api/admin/settings/change-password/route.ts`

**Image Upload:**
- `src/app/api/upload/route.ts` - POST multipart form
  - Auth required: YES (session check)
  - File types: JPEG, PNG, WebP, GIF (MIME validation)
  - Max size: 5MB
  - Optimization: sharp resizes > 1920px width to JPEG, quality 85
  - Storage: MinIO presigned URLs with 7-day expiration
  - Response: { url, filepath, size, mimeType }

**Notifications:**
- `src/app/api/notifications/route.ts` - GET (list user notifications)
- `src/app/api/notifications/[id]/route.ts` - PATCH (mark as read)
- `src/app/api/notifications/mark-all-read/route.ts` - POST (bulk mark read)

**Statistics:**
- `src/app/api/admin/stats/route.ts` - Presumed GET endpoint for dashboard analytics

**Batch Operations:**
- `src/app/api/admin/batch/route.ts` - Presumed bulk operations endpoint

---

*Integration audit: 2026-01-29*
