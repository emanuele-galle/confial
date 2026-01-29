# Testing Patterns

**Analysis Date:** 2026-01-29

## Test Framework

**Runner:**
- Vitest 4.0.18 (installed in package.json, not configured)
- No vitest.config.ts file present in project
- Config command: `npm run vitest` (not in scripts - would need to be added)

**Assertion Library:**
- Not configured yet
- Common choice with Vitest: Chai or native assertions

**Run Commands:**
```bash
npm run type-check          # TypeScript type checking (tsc --noEmit)
npm run lint               # ESLint check
npm run build              # Next.js production build
npm run dev                # Development server
```

**Note:** No test commands defined in `package.json`. Testing infrastructure exists but not yet implemented.

## Test File Organization

**Current Status:** No test files found in `src/`

**Recommended Location Pattern (if implemented):**
- Co-located with source files (Next.js pattern)
- Adjacent to component: `ComponentName.tsx` → `ComponentName.test.tsx`
- Adjacent to utilities: `utils.ts` → `utils.test.ts`
- Adjacent to schemas: `news.ts` → `news.test.ts`

**Directory Structure:**
```
src/
├── components/
│   ├── admin/
│   │   ├── ImageUpload.tsx
│   │   └── ImageUpload.test.tsx
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx
├── lib/
│   ├── schemas/
│   │   ├── news.ts
│   │   └── news.test.ts
│   ├── utils.ts
│   └── utils.test.ts
└── app/
    └── api/
        ├── admin/
        │   └── news/
        │       ├── route.ts
        │       └── route.test.ts
```

## Validation Patterns (Type Safety as Testing)

The project emphasizes **compile-time validation** over runtime tests:

**Zod Schema Validation:**
```typescript
// src/lib/schemas/news.ts
export const createNewsSchema = z.object({
  title: z.string().min(1, "Titolo obbligatorio").max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Contenuto obbligatorio"),
  coverImage: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  metaTitle: z.string().max(60).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
```

**Runtime Validation in API Routes:**
```typescript
// src/app/api/admin/news/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validationResult = createNewsSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: validationResult.error.flatten() },
      { status: 400 }
    );
  }

  const { title, publishedAt, ...rest } = validationResult.data;
  // Type-safe usage of data
}
```

**TypeScript Compile-Time Validation:**
- Type-safe API contracts via Zod inference
- Component prop types enforce correct usage
- NextAuth session types ensure auth properties exist
- Interface enforcement for UI components

## Validation Layers

**Input Validation:**

**Frontend (React Hook Form + Zod):**
```typescript
// src/app/(dashboard)/admin/news/new/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewsSchema, CreateNewsInput } from "@/lib/schemas/news";

export default function NewsCreatePage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateNewsInput>({
    resolver: zodResolver(createNewsSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      coverImage: "",
      featured: false,
      status: "DRAFT",
      metaTitle: "",
      metaDescription: "",
    },
  });

  const onSubmit = async (data: CreateNewsInput) => {
    try {
      const response = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("News creata con successo!");
        router.push("/admin/news");
      } else {
        const error = await response.json();
        toast.error(error.error || "Errore nella creazione della news");
      }
    } catch (error) {
      toast.error("Errore di rete");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Titolo" required error={errors.title}>
        <input {...register("title")} />
      </FormField>
      {/* More fields */}
    </form>
  );
}
```

**Backend (Zod safeParse):**
```typescript
// API route validation
const validationResult = createNewsSchema.safeParse(body);

if (!validationResult.success) {
  return NextResponse.json(
    { error: "Dati non validi", details: validationResult.error.flatten() },
    { status: 400 }
  );
}

// Access type-safe data
const { title, content } = validationResult.data;
```

**File Upload Validation:**
```typescript
// src/components/admin/ImageUpload.tsx
const uploadFile = async (file: File) => {
  // Type validation
  if (!file.type.startsWith("image/")) {
    alert("Seleziona un file immagine");
    return;
  }

  // Size validation
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    alert(`File troppo grande. Dimensione massima: ${maxSizeMB}MB`);
    return;
  }

  // API-side validation (src/app/api/upload/route.ts)
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_SIZE = 5 * 1024 * 1024;

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipo di file non supportato. Usa JPEG, PNG, WebP o GIF" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File troppo grande (max 5MB)" },
      { status: 400 }
    );
  }
};
```

## Error Testing

**Pattern in Components:**
```typescript
// src/app/(dashboard)/admin/news/error.tsx
"use client";

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("News error:", error);
  }, [error]);

  return (
    <div className="bg-white rounded-xl border border-red-200 p-12">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Si è verificato un errore
          </h2>
          <p className="text-gray-600 mb-4">
            Impossibile caricare le news. Riprova più tardi.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <Button onClick={reset}>Riprova</Button>
      </div>
    </div>
  );
}
```

**Pattern in API Routes:**
```typescript
// src/app/api/upload/route.ts
try {
  // Operations...
} catch (error) {
  console.error("Image upload error:", error);
  return NextResponse.json(
    { error: "Errore durante l'upload dell'immagine" },
    { status: 500 }
  );
}
```

## Mocking Strategy

**No mocking framework installed**

**If implementing tests, recommended approach:**
```typescript
// Would use Vitest's built-in mocking (no external library needed)
import { vi } from "vitest";

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock NextAuth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: "1", email: "test@example.com", role: "ADMIN" }
  })
}));

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    news: {
      findMany: vi.fn(),
      create: vi.fn(),
    }
  }
}));
```

**What to Mock:**
- External HTTP requests (fetch, API calls)
- NextAuth sessions
- Database layer (Prisma)
- File system operations (MinIO uploads)

**What NOT to Mock:**
- Zod validation (should run actual validation)
- Type checking (compile-time only)
- Component rendering (use integration tests instead)
- nextRouter behavior (use next/navigation directly)

## Test Coverage Gaps

**Areas WITHOUT tests (current state):**
- API route handlers (all routes in `src/app/api/`)
- Form submission flows
- File upload validation
- Authentication flows
- Error boundaries
- Loading states

**Recommended Priority for Testing:**

**High Priority:**
- API validation: POST/PATCH/DELETE routes with safeParse
- Authentication: Session checking, role-based access
- Upload validation: File type/size checks, image optimization

**Medium Priority:**
- Form error handling: Zod schema validation feedback
- Slug generation: Collision detection in POST /news
- Audit logging: Action tracking in PATCH/DELETE

**Low Priority:**
- UI component rendering (components are simple and stable)
- Loading states (Next.js Suspense handles these)
- Premium animation components (pure styling, no logic)

## Type Safety (Primary Testing Strategy)

The project uses **TypeScript strict mode** as the primary validation layer:

**Strict TypeScript Benefits:**
```typescript
// Type inference from Zod prevents runtime errors
const data: CreateNewsInput = { /* Compiler ensures shape */ };

// Session typing ensures auth properties exist
const userId = (session.user as any).id; // Cast needed but typed usage

// NextResponse typing ensures status codes are correct
return NextResponse.json(news, { status: 201 });

// Interface enforcement for components
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}
```

**Compile-time validation command:**
```bash
npm run type-check    # tsc --noEmit - catches type errors before runtime
```

## Setup Instructions (If Tests Needed)

**Install test dependencies:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest @vitest/ui
npm install --save-dev msw  # For API mocking
```

**Create vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Add test script to package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

*Testing analysis: 2026-01-29*
