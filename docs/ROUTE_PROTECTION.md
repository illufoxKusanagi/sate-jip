# Route Protection & Access Control Guide

## Overview

This guide explains how to implement authentication-based route protection and role-based access control in the SATE-ITIK application.

---

## 🔒 Route Protection Strategy

### Three Layers of Protection:

1. **Middleware** (Server-side) - Prevents unauthorized access before page loads
2. **Sidebar** (UI) - Hides routes user cannot access
3. **Component** (Client-side) - Additional checks for actions/features

---

## 📁 File Structure

```
src/
├── middleware.ts              # Server-side route protection
├── app/
│   ├── context/
│   │   └── auth-context.tsx   # Auth state management
│   ├── login/
│   │   └── page.tsx          # Login page (public)
│   ├── dashboard/
│   │   └── page.tsx          # Protected route
│   ├── admins/
│   │   └── page.tsx          # Admin-only route
│   └── locations/
│       └── page.tsx          # Admin-only route
└── components/
    └── sidebar/
        └── app-sidebar.tsx    # Hide routes based on auth
```

---

## 🛡️ Method 1: Middleware Protection (RECOMMENDED)

### How It Works:
- Runs on **server-side** before any page loads
- Checks authentication token from cookies
- Redirects unauthorized users to login
- Blocks admin-only routes for regular users

### Configuration:

**File: `src/middleware.ts`**

```typescript
// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/admins',
  '/locations',
  '/dataConfig',
  '/activityCalendar',
  '/server-management',
  '/server-data',
];

// Define admin-only routes
const adminOnlyRoutes = [
  '/admins',
  '/locations',
  '/server-management',
  '/server-data',
];

// Public routes (no auth required)
const publicRoutes = [
  '/login',
  '/api/login',
];
```

### Flow:
1. User visits `/admins`
2. Middleware checks if route is protected ✅
3. Middleware checks if token exists in cookies
4. If no token → Redirect to `/login?redirect=/admins`
5. If token valid → Check role
6. If role is 'admin' → Allow access ✅
7. If role is 'user' → Redirect to `/dashboard`

### Benefits:
- ✅ **Secure** - Runs on server, can't be bypassed
- ✅ **Fast** - Blocks unauthorized requests before page loads
- ✅ **Centralized** - One file controls all route protection
- ✅ **SEO-friendly** - Proper redirects for search engines

---

## 🎨 Method 2: Sidebar Route Hiding

### How It Works:
Hide navigation items based on user authentication and role.

### Implementation:

**File: `src/components/sidebar/app-sidebar.tsx`**

```tsx
import { useAuth } from "@/app/context/auth-context";

export function AppSidebar() {
  const { open } = useSidebar();
  const { isAuthenticated, user, isAdmin } = useAuth();

  // Define which items require admin
  const tikItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      requiresAuth: true,
      requiresAdmin: false,
    },
    {
      title: "Penanggung-Jawab",
      url: "/admins",
      icon: PersonStandingIcon,
      requiresAuth: true,
      requiresAdmin: true,  // ⬅️ Admin only
    },
    {
      title: "Lokasi",
      url: "/locations",
      icon: Pin,
      requiresAuth: true,
      requiresAdmin: true,  // ⬅️ Admin only
    },
    {
      title: "Config",
      url: "/dataConfig",
      icon: Cog,
      requiresAuth: true,
      requiresAdmin: false,
    },
  ];

  // Filter items based on auth and role
  const visibleTikItems = tikItems.filter(item => {
    if (item.requiresAdmin && !isAdmin()) return false;
    if (item.requiresAuth && !isAuthenticated) return false;
    return true;
  });

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* ... header ... */}
      
      <SidebarContent>
        <SidebarGroup>
          <Collapsible defaultOpen>
            <CollapsibleTrigger>
              Jaringan Intra Pemerintah
            </CollapsibleTrigger>
            <CollapsibleContent>
              {visibleTikItems.map((item) => (
                <SidebarMenuButton key={item.title} asChild>
                  <Link href={item.url}>
                    <item.icon />
                    {open && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
```

### Benefits:
- ✅ **Better UX** - Users don't see routes they can't access
- ✅ **Clean UI** - No confusing unauthorized links
- ✅ **Responsive** - Updates when auth state changes

---

## 🔐 Method 3: Component-Level Protection

### Use Case:
Protect specific actions within a page (edit, delete buttons, etc.)

### Implementation:

**Example: Data Config Page**

```tsx
import { useAuth } from "@/app/context/auth-context";

export default function DataConfigPage() {
  const { isAdmin } = useAuth();

  const columns = [
    // ... data columns ...
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {isAdmin() && (
            <>
              <Button onClick={() => handleEdit(row.original)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button onClick={() => handleDelete(row.original)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Data Config</h1>
      {isAdmin() && (
        <Button onClick={handleCreate}>
          Add New Config
        </Button>
      )}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
```

---

## 🎯 Complete Protection Example

### Protecting `/admins` route:

**1. Middleware (Server-side):**
```typescript
// src/middleware.ts
const adminOnlyRoutes = ['/admins'];
// Redirects non-admins trying to access /admins
```

**2. Sidebar (Hide link):**
```tsx
// src/components/sidebar/app-sidebar.tsx
const tikItems = [
  {
    title: "Penanggung-Jawab",
    url: "/admins",
    requiresAdmin: true,  // Hidden from non-admins
  },
];
```

**3. Page Component (Additional check):**
```tsx
// src/app/admins/page.tsx
export default function AdminsPage() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin()) {
    redirect('/dashboard');
  }
  
  return <AdminContent />;
}
```

---

## 🚀 Quick Setup Guide

### Step 1: Install middleware dependencies
```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

### Step 2: Create middleware file
Create `src/middleware.ts` with route protection logic (see above).

### Step 3: Update auth context
Add `isAdmin()` helper function:

```typescript
// src/app/context/auth-context.tsx
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: () => boolean;  // ⬅️ Add this
  login: (username: string, token: string, role: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ... existing code ...
  
  const isAdmin = () => user?.role === 'admin';
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin,  // ⬅️ Add this
      login, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Step 4: Update sidebar
Add role-based filtering to sidebar items (see Method 2 above).

### Step 5: Test
1. Login as admin → should see all routes
2. Login as user → should NOT see admin routes
3. Try accessing `/admins` as user → should redirect

---

## 📋 Route Access Matrix

| Route                | Public | Authenticated User | Admin |
| -------------------- | ------ | ------------------ | ----- |
| `/login`             | ✅      | ✅                  | ✅     |
| `/dashboard`         | ❌      | ✅                  | ✅     |
| `/dataConfig`        | ❌      | ✅                  | ✅     |
| `/activityCalendar`  | ❌      | ✅                  | ✅     |
| `/admins`            | ❌      | ❌                  | ✅     |
| `/locations`         | ❌      | ❌                  | ✅     |
| `/server-management` | ❌      | ❌                  | ✅     |
| `/server-data`       | ❌      | ❌                  | ✅     |

---

## 🔧 Troubleshooting

### Issue: Middleware not working
**Solution:** Make sure `src/middleware.ts` is at root of `src/` folder, not in subdirectory.

### Issue: Token not found in middleware
**Solution:** Ensure login API sets cookie:
```typescript
response.cookies.set('admin-token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
});
```

### Issue: Infinite redirect loop
**Solution:** Make sure `/login` is in `publicRoutes` array.

### Issue: Role check failing
**Solution:** Verify JWT includes role:
```typescript
const token = jwt.sign(
  { userId, username, role },  // ⬅️ Include role
  secret
);
```

---

## 🎨 Best Practices

1. **Always use middleware** for route protection (server-side is secure)
2. **Hide UI elements** users can't access (better UX)
3. **Double-check in components** for critical actions
4. **Use TypeScript** for type-safe role checks
5. **Test all roles** thoroughly before deployment
6. **Log access attempts** for security monitoring

---

## 🔄 Next Steps

1. ✅ Implement middleware protection
2. ✅ Update auth context with `isAdmin()` helper
3. ✅ Filter sidebar items based on role
4. ✅ Test with different user roles
5. 🔜 Add role-based action buttons in tables
6. 🔜 Implement audit logging for admin actions
7. 🔜 Add "Access Denied" page with better messaging

---

## 📚 Related Files

- `src/middleware.ts` - Server-side route protection
- `src/app/context/auth-context.tsx` - Auth state and helpers
- `src/components/sidebar/app-sidebar.tsx` - Navigation with role filtering
- `src/app/api/login/route.ts` - Authentication endpoint
- `src/lib/db/schema.ts` - User role definition

---

## 🚨 Security Notes

- ⚠️ **Never** rely on client-side checks alone
- ⚠️ **Always** validate user role on server (API routes)
- ⚠️ **Use** httpOnly cookies for tokens (prevents XSS)
- ⚠️ **Implement** CSRF protection for production
- ⚠️ **Rotate** JWT secrets regularly
- ⚠️ **Set** appropriate token expiration times
