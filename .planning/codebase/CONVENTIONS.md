# Coding Conventions

**Analysis Date:** 2026-01-29

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `ImageUpload.tsx`, `FormField.tsx`)
- Pages: lowercase kebab-case (e.g., `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`)
- API routes: lowercase kebab-case in dynamic segments (e.g., `[id]/route.ts`)
- Utilities: lowercase camelCase (e.g., `utils.ts`, `auth.ts`, `prisma.ts`)
- Schemas: lowercase kebab-case with plurals (e.g., `news.ts`, `user.ts`, `event.ts`)

**Functions:**
- Component functions: PascalCase (e.g., `export function FormField(...)`)
- Helper/utility functions: camelCase (e.g., `uploadFile()`, `handleDragOver()`)
- Event handlers: camelCase with `handle` prefix (e.g., `handleSubmit()`, `handleRemove()`)
- Async operations: camelCase with verb prefixes (e.g., `uploadFile()`, `generateSlug()`)

**Variables:**
- State variables: camelCase (e.g., `isDragging`, `uploading`, `urlInput`)
- Boolean flags: `is-` or `has-` prefix (e.g., `isSubmitting`, `hasError`)
- References (useRef): Descriptive camelCase (e.g., `fileInputRef`)
- Constants: UPPER_SNAKE_CASE for file-scoped constants (e.g., `MAX_SIZE`, `ALLOWED_TYPES`, `ASPECT_RATIOS`)

**Types:**
- Interfaces: PascalCase with suffix (e.g., `FormFieldProps`, `ImageUploadProps`, `ButtonProps`)
- Type aliases: PascalCase (e.g., `CreateNewsInput`, `UpdateUserInput`)
- Schema variables: camelCase with `Schema` suffix (e.g., `createNewsSchema`, `updateEventSchema`)

**Zod/Validation:**
- Schema exports: camelCase (e.g., `createNewsSchema`, `updateUserSchema`)
- Type exports from schemas: PascalCase with `Input` suffix (e.g., `CreateNewsInput`, `UpdateEventInput`)
- Inferred types: `z.infer<typeof schemaName>` pattern

## Code Style

**Formatting:**
- ESLint configuration: `eslint.config.mjs` with Next.js and TypeScript rules
- Extends: `next/core-web-vitals` and `next/typescript`
- Tab width: 2 spaces (inferred from file formatting)
- Line length: No explicit limit in config
- Semicolons: Required (TypeScript strict mode)

**Linting:**
- Tool: ESLint 9.17.0
- Config: Flat config format (`.mjs`)
- Rules: Next.js core web vitals + TypeScript best practices
- Execute: `npm run lint`

**TypeScript Compiler:**
- Strict mode: `true` (strict type checking enabled)
- Target: `ES2017`
- Type check command: `npm run type-check` (executes `tsc --noEmit`)
- No emit: Type checking only, no `.js` generation

## Import Organization

**Order:**
1. React/Next.js imports (React, next/*, next-auth)
2. Third-party UI libraries (shadcn/ui components from `@/components/ui`)
3. Third-party logic (@hookform, zod, etc.)
4. Icons (lucide-react)
5. Local components (from `@/components`)
6. Local utilities (from `@/lib`)
7. Custom hooks
8. Types/schemas

**Path Aliases:**
- `@/*` maps to `./src/*`
- Use absolute imports with `@/` prefix consistently (never relative imports)

**Example pattern:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNewsSchema } from "@/lib/schemas/news";
```

## Error Handling

**Patterns:**

**API Routes (try-catch with status codes):**
```typescript
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    // Operations
    const result = await prisma.news.create({ data });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Operation error:", error);
    return NextResponse.json(
      { error: "Errore durante l'operazione" },
      { status: 500 }
    );
  }
}
```

**Form Submission (try-catch with toast):**
```typescript
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
```

**Component Upload (inline validation + try-catch):**
```typescript
const uploadFile = async (file: File) => {
  // Validate file type inline
  if (!file.type.startsWith("image/")) {
    alert("Seleziona un file immagine");
    return;
  }

  // Validate file size inline
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    alert(`File troppo grande. Dimensione massima: ${maxSizeMB}MB`);
    return;
  }

  setUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Errore durante l'upload");
    }

    const data = await response.json();
    onChange(data.url);
  } catch (error) {
    console.error("Upload error:", error);
    alert(error instanceof Error ? error.message : "Errore durante l'upload");
  } finally {
    setUploading(false);
  }
};
```

**API Validation (Zod safeParse):**
```typescript
const validationResult = createNewsSchema.safeParse(body);

if (!validationResult.success) {
  return NextResponse.json(
    { error: "Dati non validi", details: validationResult.error.flatten() },
    { status: 400 }
  );
}
```

**Status codes used:**
- `200`: OK (GET responses)
- `201`: Created (POST successful)
- `400`: Bad Request (validation failure)
- `401`: Unauthorized (no session)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (entity doesn't exist)
- `500`: Internal Server Error (unexpected failures)

## Logging

**Framework:** `console.error()` for errors (caught exceptions only)

**Patterns:**
- API errors: Log error object with context (e.g., `console.error("Upload error:", error)`)
- React errors: Log in useEffect error boundaries (e.g., `console.error("News error:", error)`)
- Minimal logging: Only for unexpected errors, not for expected validation failures

**No logging:**
- Expected validation errors (return status 400)
- Authentication checks (return status 401)
- Expected 404s

## Comments

**When to Comment:**
- Complex business logic (slug generation, image optimization)
- Non-obvious algorithmic steps
- Workarounds or hacks (mark with TODO if needed)
- Builder pattern configurations (Zod, TipTap extensions)

**JSDoc/TSDoc:**
- Interface properties documented inline as comments
- Not used extensively; type names are self-documenting
- Used for complex props objects

**Example:**
```typescript
interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  aspectRatio?: "square" | "video" | "banner"; // 1:1, 16:9, 3:1
  maxSizeMB?: number;
  label?: string;
  folder?: "news-covers" | "events-covers" | "general";
}
```

## Function Design

**Size:** Prefer small, focused functions (< 50 lines for handlers)

**Parameters:**
- Use object destructuring for multiple params (> 2 args)
- Typed destructuring with interfaces
- Default values in destructuring

**Return Values:**
- Explicit return types in function signatures
- No implicit `any` returns
- Components return JSX or null

**Example:**
```typescript
export function ImageUpload({
  value,
  onChange,
  onRemove,
  aspectRatio = "video",
  maxSizeMB = 5,
  label = "Immagine di copertina",
  folder = "general",
}: ImageUploadProps) {
  // Implementation
}
```

## Module Design

**Exports:**
- Named exports for components: `export function ComponentName()`
- Default exports for page components: `export default function Page()`
- Named exports for utilities: `export function helperName()`, `export const CONSTANT = value`

**Barrel Files:**
- Used in `@/components/ui/premium/index.ts` for re-exporting multiple components
- Pattern: `export { ComponentOne } from "./component-one"`

**Server vs Client Components:**

**Client Components (`"use client"`):**
- All interactive components (`ImageUpload`, `RichTextEditor`, `FormField`)
- Components using hooks (useState, useEffect, useEditor, useForm)
- Event handlers
- Location: `src/components/**/*.tsx`

**Server Components (no directive):**
- Page components (`page.tsx`)
- Layout components (`layout.tsx`)
- Data fetching components
- Error boundaries (`error.tsx`)
- Loading states (`loading.tsx`)
- Serializable data only

## React Server Components & Form Patterns

**Page Components (Server):**
```typescript
export default function ServiziPage() {
  // Static data, no hooks
  const servizi = [ ... ];

  return (
    <div>
      {servizi.map((servizio) => (
        // Children can be client components
      ))}
    </div>
  );
}
```

**Client Form Components:**
```typescript
"use client";

export default function NewsCreatePage() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateNewsInput>({
    resolver: zodResolver(createNewsSchema),
  });

  const onSubmit = async (data) => {
    // Form submission to API
  };

  return <form onSubmit={handleSubmit(onSubmit)} />;
}
```

## TypeScript Type Safety

**Patterns:**

**Generic error handling:**
```typescript
catch (error) {
  alert(error instanceof Error ? error.message : "Errore durante l'upload");
}
```

**Zod inference for API contracts:**
```typescript
const createNewsSchema = z.object({
  title: z.string().min(1, "Titolo obbligatorio").max(200),
  // ...
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
```

**Type casting only when necessary:**
```typescript
// Cast session user to any for custom properties
const userId = (session.user as any).id;
const userRole = (session.user as any).role;
```

**API response typing:**
```typescript
// Use NextResponse.json with inferred typing
return NextResponse.json(news, { status: 201 });
```

---

*Convention analysis: 2026-01-29*
