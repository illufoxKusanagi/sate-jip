# 🔍 Code Review & Improvement Plan

**Date:** November 11, 2025  
**Project:** SATE-ITIK (Sistem Informasi Infrastruktur Daerah)  
**Reviewer:** Code Quality Analysis

---

## 📊 Executive Summary

### Overall Assessment: **B+ (Good, with room for improvement)**

**Strengths:**
- ✅ Well-structured Next.js 15 App Router architecture
- ✅ Consistent use of TypeScript and type safety
- ✅ Modern tech stack (Drizzle ORM, TanStack Table, Radix UI)
- ✅ Good separation of concerns (components, API routes, lib)
- ✅ Indonesian localization throughout

**Critical Issues Found:**
- ⚠️ Inconsistent database import patterns
- ⚠️ Inconsistent error response formats
- ⚠️ Missing input validation in several API routes
- ⚠️ No centralized API response utilities
- ⚠️ Inconsistent return type patterns

---

## 🐛 Critical Issues to Fix

### 1. **Inconsistent Database Import (HIGH PRIORITY)**

**Problem:** Mix of `import db from` and `import { db } from`

```typescript
// ❌ Inconsistent across files
// Some files use:
import db from "@/lib/db/connection";

// Others use:
import { db } from "@/lib/db/connection";
```

**Files Affected:**
- ❌ `/src/app/api/event/route.ts` - uses `import db from`
- ❌ `/src/app/api/server-data/route.ts` - uses `import db from`
- ❌ `/src/app/api/tickets/route.ts` - uses `import db from`
- ✅ `/src/app/api/locations/route.ts` - uses `import { db } from`
- ✅ `/src/app/api/admins/route.ts` - uses `import { db } from`

**Impact:** Potential runtime errors if exports don't match

**Solution:** 
```typescript
// ✅ RECOMMENDED: Check your /src/lib/db/connection.ts export
// If it exports as default, use: import db from "@/lib/db/connection"
// If it exports as named, use: import { db } from "@/lib/db/connection"
// Then standardize ALL files to use the same pattern
```

**Action Required:** Check `/src/lib/db/connection.ts` and standardize all imports

---

### 2. **Inconsistent API Response Formats (HIGH PRIORITY)**

**Problem:** Different response structures across endpoints

```typescript
// ❌ INCONSISTENT PATTERNS:

// Pattern 1: { success: true, data: [...] }
return NextResponse.json({ success: true, data: result });

// Pattern 2: Direct array/object
return NextResponse.json(allLocations);

// Pattern 3: { message: "..." }
return NextResponse.json({ message: "Configuration created successfully" });

// Pattern 4: { success: true, result: [...] }
return NextResponse.json({ success: true, result });
```

**Files Affected:**
- `/src/app/api/tickets/route.ts` - Uses `{ success, data, count }`
- `/src/app/api/locations/route.ts` - Returns direct array
- `/src/app/api/server-data/route.ts` - Uses `{ success, data }`
- `/src/app/api/admins/route.ts` - Returns direct array AND `{ success, result }`
- `/src/app/api/configs/route.ts` - Returns direct array

**Impact:** 
- Frontend code must handle different response formats
- Harder to create reusable fetch utilities
- More error-prone

**Solution:** Create standardized API response utilities

---

### 3. **Missing Input Validation (MEDIUM PRIORITY)**

**Problem:** Most POST/PUT endpoints don't validate input with Zod

```typescript
// ❌ NO VALIDATION:
export async function POST(request: NextRequest) {
  const data = await request.json();
  const newAdmin = {
    nama: data.fullName || "",  // No validation!
    nip: data.idNumber || "",
    // ...
  };
}

// ✅ GOOD EXAMPLE (from tickets):
const ticketSchema = z.object({
  subject: z.string().min(5),
  description: z.string().min(20),
  // ...
});
const validatedData = ticketSchema.parse(body);
```

**Files Missing Validation:**
- `/src/app/api/admins/route.ts` - POST
- `/src/app/api/admins/[id]/route.ts` - PUT
- `/src/app/api/locations/route.ts` - POST
- `/src/app/api/locations/[id]/route.ts` - PUT
- `/src/app/api/server-data/route.ts` - POST
- `/src/app/api/server-data/[id]/route.ts` - PUT
- `/src/app/api/configs/route.ts` - POST

**Impact:**
- Accepts invalid data into database
- No clear error messages for users
- Potential security vulnerabilities

---

### 4. **No Server Management Edit Functionality (HIGH PRIORITY)**

**Problem:** Server table has edit button but backend doesn't implement proper edit

```typescript
// ✅ Has DELETE
export async function DELETE(...) { ... }

// ✅ Has PUT but needs validation
export async function PUT(...) { 
  // Missing: Input validation
  // Missing: Check if server exists
  // Missing: Proper error handling
}
```

**Current Issues:**
- No validation of rack name, unit position, IP address format
- No check for duplicate unit positions in same rack
- No check if server exists before update
- Generic error messages

---

## 🏗️ Architecture Issues

### 1. **Different Styled Algorithms**

#### Database Query Patterns

```typescript
// ❌ INCONSISTENT: Different ordering approaches
// Pattern A:
const result = await db.select().from(tickets).orderBy(desc(tickets.createdAt));

// Pattern B:
const result = await db.select().from(admins).orderBy(asc(admins.nama));

// Pattern C:
const result = await db.select().from(locations).orderBy(locations.createdAt);
```

**Recommendation:** Create query builder utilities in `/src/lib/db/queries.ts`

---

#### Error Handling Patterns

```typescript
// ❌ INCONSISTENT: Three different error handling styles

// Style 1: Simple log + generic message
catch (error) {
  console.error("Error fetching tickets:", error);
  return NextResponse.json(
    { success: false, error: "Failed to fetch tickets" },
    { status: 500 }
  );
}

// Style 2: Detailed log + message + details
catch (error) {
  console.error("Error deleting event: ", error);
  return NextResponse.json(
    {
      error: "Failed to delete event",
      details: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}

// Style 3: No logging
catch (error) {
  return NextResponse.json(
    { error: "Failed to fetch locations" },
    { status: 500 }
  );
}
```

**Recommendation:** Create error handling utility in `/src/lib/api/errors.ts`

---

### 2. **Frontend Data Fetching Patterns**

```typescript
// ❌ INCONSISTENT: Different patterns for same operation

// Pattern A: Destructure response.data
const response = await fetch("/api/tickets");
const result = await response.json();
setData(Array.isArray(result.data) ? result.data : []);

// Pattern B: Use response directly
const response = await fetch("/api/locations");
const allLocations = await response.json();
setLocations(allLocations);

// Pattern C: Check success property
if (result.success) {
  setServerData(result.data);
}
```

**Recommendation:** Create API client utilities in `/src/lib/api/client.ts`

---

## ✅ Recommended Improvements

### Phase 1: Critical Fixes (Week 1)

#### 1. Standardize Database Imports
**Priority:** 🔴 HIGH  
**Effort:** 🟢 LOW (30 minutes)

```bash
# Check current export
cat src/lib/db/connection.ts

# If default export, fix all named imports
# If named export, fix all default imports
```

#### 2. Create API Response Utilities
**Priority:** 🔴 HIGH  
**Effort:** 🟡 MEDIUM (2 hours)

**File:** `/src/lib/api/response.ts`

```typescript
// Standardized API response utilities
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export function successResponse<T>(
  data: T,
  message?: string,
  count?: number
): Response {
  return NextResponse.json({
    success: true,
    data,
    ...(message && { message }),
    ...(count !== undefined && { count }),
  });
}

export function errorResponse(
  error: string,
  status: number = 500,
  details?: unknown
): Response {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details && { details }),
    },
    { status }
  );
}
```

#### 3. Create Error Handling Utilities
**Priority:** 🔴 HIGH  
**Effort:** 🟡 MEDIUM (1.5 hours)

**File:** `/src/lib/api/errors.ts`

```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown, context: string): Response {
  console.error(`[${context}]`, error);

  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode, error.details);
  }

  if (error instanceof z.ZodError) {
    return errorResponse(
      "Validation failed",
      400,
      error.errors.map((e) => ({ path: e.path, message: e.message }))
    );
  }

  return errorResponse(
    "Internal server error",
    500,
    error instanceof Error ? error.message : "Unknown error"
  );
}
```

#### 4. Add Input Validation Schemas
**Priority:** 🔴 HIGH  
**Effort:** 🟡 MEDIUM (3 hours)

**File:** `/src/lib/validations/server.ts`

```typescript
import { z } from "zod";

export const serverSchema = z.object({
  rackName: z.enum(["Rak A", "Rak B", "Rak C", "Rak D"]),
  unitPosition: z.number().int().min(1).max(42),
  unitSize: z.number().int().min(1).max(4),
  serverName: z.string().min(1, "Server name is required"),
  brand: z.string().optional(),
  assetNumber: z.string().min(1, "Asset number is required"),
  serialNumber: z.string().optional(),
  ipAddress: z
    .string()
    .ip("Invalid IP address")
    .or(z.literal("")),
  status: z.enum(["online", "offline", "maintenance", "standby"]),
  specification: z.string().nullable().optional(),
  installedApps: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const updateServerSchema = serverSchema.partial();
```

**File:** `/src/lib/validations/admin.ts`

```typescript
import { z } from "zod";

export const adminSchema = z.object({
  nama: z.string().min(1, "Nama is required"),
  nip: z.string().min(1, "NIP is required"),
  jabatan: z.string().min(1, "Jabatan is required"),
  instansi: z.string().min(1, "Instansi is required"),
  whatsapp: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, "Invalid WhatsApp number"),
});
```

**File:** `/src/lib/validations/location.ts`

```typescript
import { z } from "zod";

export const locationSchema = z.object({
  locationName: z.string().min(1, "Location name is required"),
  activationDate: z.string().min(1, "Activation date is required"),
  latitude: z.number().min(-90).max(90).or(z.string()),
  longitude: z.number().min(-180).max(180).or(z.string()),
  opdPengampu: z.string().min(1, "OPD Pengampu is required"),
  opdType: z.enum(["OPD Utama", "OPD Pendukung", "Publik", "Non OPD"]),
  ispName: z.string().min(1, "ISP name is required"),
  internetSpeed: z.number().positive().or(z.string()),
  internetRatio: z.string().min(1, "Internet ratio is required"),
  internetInfrastructure: z.enum(["KABEL", "WIRELESS"]),
  jip: z.enum(["checked", "unchecked"]),
  dropPoint: z.string().optional(),
  eCat: z.string().optional(),
  status: z.enum(["active", "inactive", "maintenance"]),
});
```

---

### Phase 2: Architecture Improvements (Week 2)

#### 5. Create API Client Utilities
**Priority:** 🟡 MEDIUM  
**Effort:** 🟡 MEDIUM (2 hours)

**File:** `/src/lib/api/client.ts`

```typescript
export async function apiClient<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(
        error.error || "Request failed",
        response.status,
        error.details
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Network error", 500, error);
  }
}

// Convenience methods
export const api = {
  get: <T>(url: string) => apiClient<T>(url),
  post: <T>(url: string, data: unknown) =>
    apiClient<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(url: string, data: unknown) =>
    apiClient<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: <T>(url: string) =>
    apiClient<T>(url, {
      method: "DELETE",
    }),
};
```

#### 6. Create Database Query Utilities
**Priority:** 🟡 MEDIUM  
**Effort:** 🟡 MEDIUM (1.5 hours)

**File:** `/src/lib/db/queries.ts`

```typescript
import { db } from "@/lib/db/connection";
import { SQL, asc, desc } from "drizzle-orm";

export type OrderDirection = "asc" | "desc";

export async function findMany<T>(
  table: any,
  options?: {
    where?: SQL;
    orderBy?: { column: any; direction: OrderDirection };
    limit?: number;
  }
) {
  let query = db.select().from(table);

  if (options?.where) {
    query = query.where(options.where) as any;
  }

  if (options?.orderBy) {
    const orderFn = options.orderBy.direction === "asc" ? asc : desc;
    query = query.orderBy(orderFn(options.orderBy.column)) as any;
  }

  if (options?.limit) {
    query = query.limit(options.limit) as any;
  }

  return await query;
}

export async function findById<T>(table: any, id: string) {
  const result = await db
    .select()
    .from(table)
    .where(eq(table.id, id))
    .limit(1);

  return result[0] || null;
}

export async function exists(table: any, condition: SQL): Promise<boolean> {
  const result = await db
    .select({ id: table.id })
    .from(table)
    .where(condition)
    .limit(1);

  return result.length > 0;
}
```

---

### Phase 3: Feature Enhancements (Week 3)

#### 7. Improve Server Management
**Priority:** 🟡 MEDIUM  
**Effort:** 🟢 LOW (1 hour)

See implementation below ⬇️

#### 8. Add Request Logging Middleware
**Priority:** 🟢 LOW  
**Effort:** 🟡 MEDIUM (1 hour)

**File:** `/src/middleware.ts` (update existing)

```typescript
// Add API logging
export function middleware(request: NextRequest) {
  const start = Date.now();
  const path = request.nextUrl.pathname;

  // Log API requests
  if (path.startsWith("/api/")) {
    console.log(`[API] ${request.method} ${path}`);
  }

  // Existing auth logic...

  // Log response time (in production, use proper logging service)
  const duration = Date.now() - start;
  console.log(`[API] ${request.method} ${path} - ${duration}ms`);

  return NextResponse.next();
}
```

---

## 📋 Refactoring Checklist

### Database Layer
- [ ] Standardize all `db` imports to use same pattern
- [ ] Create query utility functions
- [ ] Add database transaction support for complex operations
- [ ] Create type-safe query builders

### API Layer
- [ ] Implement standardized response format
- [ ] Add input validation to all POST/PUT endpoints
- [ ] Implement centralized error handling
- [ ] Add request logging
- [ ] Create API documentation (OpenAPI/Swagger)

### Frontend Layer
- [ ] Create unified API client utility
- [ ] Standardize error handling in components
- [ ] Add loading states to all data fetching
- [ ] Create reusable data fetching hooks

### Server Management
- [ ] Add input validation with Zod
- [ ] Implement duplicate detection (rack + unit position)
- [ ] Add proper error messages
- [ ] Create server health check endpoint
- [ ] Add audit logging (who changed what, when)

### Code Quality
- [ ] Run ESLint and fix warnings
- [ ] Add Prettier for code formatting
- [ ] Set up pre-commit hooks (husky + lint-staged)
- [ ] Add JSDoc comments to complex functions
- [ ] Create unit tests for critical functions

---

## 🎯 Priority Implementation Order

### Week 1 (Must Have)
1. ✅ Fix database import inconsistency
2. ✅ Create API response utilities
3. ✅ Create error handling utilities
4. ✅ Add validation schemas for all entities
5. ✅ Refactor server-data API with validation

### Week 2 (Should Have)
6. ⏳ Create API client utilities
7. ⏳ Create database query utilities
8. ⏳ Refactor all API routes to use new utilities
9. ⏳ Update frontend to use new API client

### Week 3 (Nice to Have)
10. ⏳ Add request logging
11. ⏳ Add audit logging
12. ⏳ Create API documentation
13. ⏳ Add unit tests

---

## 📈 Expected Outcomes

### Code Quality
- **Before:** Inconsistent patterns, potential bugs
- **After:** Consistent, maintainable, type-safe code

### Developer Experience
- **Before:** Must check each API route for response format
- **After:** Single source of truth, reusable utilities

### Error Handling
- **Before:** Generic errors, hard to debug
- **After:** Detailed, actionable error messages

### Maintenance
- **Before:** Changes require touching multiple files
- **After:** Centralized logic, easy to update

---

## 🔧 Tools to Add

```bash
# Code Quality
npm install -D eslint-config-next prettier
npm install -D @typescript-eslint/eslint-plugin
npm install -D husky lint-staged

# Testing
npm install -D vitest @testing-library/react
npm install -D @testing-library/jest-dom

# API Documentation
npm install swagger-ui-react swagger-jsdoc

# Logging (Production)
npm install pino pino-pretty
```

---

## 📝 Notes

- This review focuses on backend API architecture
- Frontend component patterns are generally good
- Database schema design is solid
- Main issues are consistency and missing validation
- All issues are fixable with systematic refactoring

**Next Step:** Implement Phase 1 critical fixes before adding new features.

