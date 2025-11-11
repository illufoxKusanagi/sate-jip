# 🚀 Quick Start: Using New API Utilities

**Last Updated:** November 11, 2025

---

## 📦 What's Available

### 1. Response Utilities (`/src/lib/api/response.ts`)
```typescript
successResponse(data, message?, count?)      // 200 OK
createdResponse(data, message?)              // 201 Created
errorResponse(error, status?, details?)      // Custom error
validationErrorResponse(errors)              // 400 Bad Request
notFoundResponse(resource?)                  // 404 Not Found
unauthorizedResponse(message?)               // 401 Unauthorized
forbiddenResponse(message?)                  // 403 Forbidden
noContentResponse()                          // 204 No Content
```

### 2. Error Utilities (`/src/lib/api/errors.ts`)
```typescript
handleApiError(error, context)               // Catch-all handler
validateSchema(schema, data)                 // Zod validation
safeParseJson(request)                       // Safe JSON parsing
ApiError(message, status, details)           // Custom error class
NotFoundError(resource)                      // 404 error class
ValidationError(message, errors)             // 400 error class
DatabaseError(message, details)              // 500 error class
```

### 3. Validation Schemas (`/src/lib/validations/`)
```typescript
// Server
serverSchema              // Full validation
updateServerSchema        // Partial validation

// Admin
adminSchema               // Full validation
updateAdminSchema         // Partial validation

// Location
locationSchema            // Full validation
updateLocationSchema      // Partial validation
```

---

## 🎯 Quick Examples

### Example 1: Simple GET Handler
```typescript
import { successResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { db } from "@/lib/db/connection";
import { users } from "@/lib/db/schema";

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    return successResponse(allUsers, undefined, allUsers.length);
  } catch (error) {
    return handleApiError(error, "GET /api/users");
  }
}
```

### Example 2: POST with Validation
```typescript
import { successResponse } from "@/lib/api/response";
import { handleApiError, safeParseJson, validateSchema } from "@/lib/api/errors";
import { db } from "@/lib/db/connection";
import { users } from "@/lib/db/schema";
import { userSchema } from "@/lib/validations/user";

export async function POST(request: NextRequest) {
  try {
    const body = await safeParseJson(request);
    const validatedData = validateSchema(userSchema, body);
    
    const result = await db.insert(users).values(validatedData);
    return successResponse(result, "User created successfully");
  } catch (error) {
    return handleApiError(error, "POST /api/users");
  }
}
```

### Example 3: PUT with Existence Check
```typescript
import { successResponse, notFoundResponse } from "@/lib/api/response";
import { handleApiError, validateSchema } from "@/lib/api/errors";
import { db } from "@/lib/db/connection";
import { users } from "@/lib/db/schema";
import { updateUserSchema } from "@/lib/validations/user";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    if (existing.length === 0) {
      return notFoundResponse("User");
    }
    
    const body = await safeParseJson(request);
    const validatedData = validateSchema(updateUserSchema, body);
    
    await db.update(users).set(validatedData).where(eq(users.id, id));
    return successResponse(null, "User updated successfully");
  } catch (error) {
    return handleApiError(error, "PUT /api/users/[id]");
  }
}
```

### Example 4: DELETE with Check
```typescript
import { successResponse, notFoundResponse } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { db } from "@/lib/db/connection";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    if (existing.length === 0) {
      return notFoundResponse("User");
    }
    
    await db.delete(users).where(eq(users.id, id));
    return successResponse(null, "User deleted successfully");
  } catch (error) {
    return handleApiError(error, "DELETE /api/users/[id]");
  }
}
```

### Example 5: Complex Validation (Duplicates)
```typescript
import { successResponse, errorResponse } from "@/lib/api/response";
import { handleApiError, validateSchema } from "@/lib/api/errors";
import { db } from "@/lib/db/connection";
import { users } from "@/lib/db/schema";
import { userSchema } from "@/lib/validations/user";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await safeParseJson(request);
    const validatedData = validateSchema(userSchema, body);
    
    // Check for duplicate email
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);
    
    if (existing.length > 0) {
      return errorResponse(
        `Email ${validatedData.email} is already registered`,
        409 // Conflict
      );
    }
    
    const result = await db.insert(users).values(validatedData);
    return successResponse(result, "User created successfully");
  } catch (error) {
    return handleApiError(error, "POST /api/users");
  }
}
```

---

## 🎨 Creating New Validation Schema

```typescript
// /src/lib/validations/your-entity.ts
import { z } from "zod";

export const yourSchema = z.object({
  // String validations
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name too long"),
  
  // Email
  email: z
    .string()
    .email("Invalid email format"),
  
  // Number validations
  age: z
    .number()
    .int("Must be integer")
    .min(18, "Must be 18+")
    .max(100, "Invalid age"),
  
  // Optional fields
  nickname: z.string().optional(),
  
  // Default values
  role: z.string().default("user"),
  
  // Enum
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  
  // Array
  tags: z.array(z.string()).default([]),
  
  // Custom validation
  password: z
    .string()
    .min(8, "Password min 8 chars")
    .regex(/[A-Z]/, "Need uppercase")
    .regex(/[0-9]/, "Need number"),
  
  // IP Address
  ipAddress: z
    .string()
    .ip("Invalid IP")
    .or(z.literal("")),
  
  // URL
  website: z
    .string()
    .url("Invalid URL")
    .optional(),
  
  // Date
  birthDate: z.string().datetime(),
  
  // Boolean
  isActive: z.boolean().default(true),
});

// Partial for updates
export const updateYourSchema = yourSchema.partial();

// Type inference
export type YourData = z.infer<typeof yourSchema>;
```

---

## 🔄 Migration Checklist

When refactoring existing API routes:

### Step 1: Add Imports
```typescript
// Old imports
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { yourTable } from "@/lib/db/schema";

// Add new imports
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api/response";
import { handleApiError, validateSchema, safeParseJson } from "@/lib/api/errors";
import { yourSchema } from "@/lib/validations/your-entity";
```

### Step 2: Create Validation Schema (if not exists)
```typescript
// Create: /src/lib/validations/your-entity.ts
export const yourSchema = z.object({
  // ... your fields
});
```

### Step 3: Replace Response Returns
```typescript
// ❌ Old
return NextResponse.json({ success: true, data: result });

// ✅ New
return successResponse(result, "Optional message");
```

### Step 4: Add Input Validation
```typescript
// ❌ Old
const data = await request.json();

// ✅ New
const body = await safeParseJson(request);
const data = validateSchema(yourSchema, body);
```

### Step 5: Update Error Handling
```typescript
// ❌ Old
catch (error) {
  console.error("Error:", error);
  return NextResponse.json(
    { error: "Failed" },
    { status: 500 }
  );
}

// ✅ New
catch (error) {
  return handleApiError(error, "POST /api/your-route");
}
```

### Step 6: Add Existence Checks (PUT/DELETE)
```typescript
// Check before update/delete
const existing = await db
  .select()
  .from(yourTable)
  .where(eq(yourTable.id, id))
  .limit(1);

if (existing.length === 0) {
  return notFoundResponse("Your Resource");
}
```

### Step 7: Add Business Logic Validation
```typescript
// Example: Check duplicates
const duplicate = await db
  .select()
  .from(yourTable)
  .where(eq(yourTable.uniqueField, data.uniqueField))
  .limit(1);

if (duplicate.length > 0) {
  return errorResponse("Already exists", 409);
}
```

---

## 🎯 HTTP Status Code Guide

Use appropriate status codes:

| Code | Function                    | Use Case                    |
| ---- | --------------------------- | --------------------------- |
| 200  | `successResponse()`         | Successful GET, PUT         |
| 201  | `createdResponse()`         | Successful POST             |
| 204  | `noContentResponse()`       | Successful DELETE (no body) |
| 400  | `validationErrorResponse()` | Invalid input data          |
| 401  | `unauthorizedResponse()`    | Not authenticated           |
| 403  | `forbiddenResponse()`       | Not authorized              |
| 404  | `notFoundResponse()`        | Resource not found          |
| 409  | `errorResponse(msg, 409)`   | Conflict (duplicate)        |
| 500  | `errorResponse(msg, 500)`   | Server error                |

---

## 🐛 Error Handling Best Practices

### 1. Always Use Context String
```typescript
// ✅ Good - easy to find in logs
handleApiError(error, "POST /api/users")

// ❌ Bad - hard to debug
handleApiError(error, "Error")
```

### 2. Specific Error Messages
```typescript
// ✅ Good - helpful to user
errorResponse(`Email ${email} is already registered`, 409)

// ❌ Bad - generic
errorResponse("Duplicate", 409)
```

### 3. Check Before Operations
```typescript
// ✅ Good - prevents errors
if (existing.length === 0) {
  return notFoundResponse("User");
}
await db.update(...);

// ❌ Bad - might fail silently
await db.update(...);
```

### 4. Validation First
```typescript
// ✅ Good - fail fast
const data = validateSchema(schema, body);
await checkDuplicates(data);
await db.insert(...);

// ❌ Bad - waste DB query
await checkDuplicates(body);
const data = validateSchema(schema, body);
await db.insert(...);
```

---

## 📚 Additional Resources

- **Full Code Review:** `/docs/CODE_REVIEW_AND_IMPROVEMENTS.md`
- **Implementation Summary:** `/docs/IMPLEMENTATION_SUMMARY.md`
- **Server API (Refactored):** `/src/app/api/server-data/`
- **Validation Schemas:** `/src/lib/validations/`
- **API Utilities:** `/src/lib/api/`

---

## 🎓 Learning Path

1. ✅ Read this quick start guide
2. ✅ Review refactored server-data API routes
3. ⏳ Practice: Refactor one small API route (e.g., configs)
4. ⏳ Create validation schema for that route
5. ⏳ Test with Postman/curl
6. ⏳ Refactor remaining routes

---

**Questions?** Check the full documentation or the refactored server-data API for working examples!

