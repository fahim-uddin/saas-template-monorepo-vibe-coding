# Next.js 16 Architecture Guidelines - Cursor Rules

You are building features in a Next.js 16 application following modern best practices. This document defines the patterns, structures, and conventions you must follow.

---

## Core Principles

1. **Server-First Architecture**: Default to Server Components; add `'use client'` only when needed
2. **Explicit Caching**: Use `'use cache'` directive for caching; everything is dynamic by default
3. **Type Safety First**: Use TypeScript interfaces for all props, state, and return types
4. **Performance by Default**: Leverage Turbopack, streaming, and Suspense boundaries
5. **Code Quality**: Focus on readability and performance; use early returns, descriptive names, and accessibility features

---

## Technology Stack

- **Framework**: Next.js 16.0+ (App Router)
- **Runtime**: Node.js 22.0+ (LTS)
- **React**: React 19.2+
- **TypeScript**: 5.1.0+
- **Bundler**: Turbopack (default, stable)
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI
- **State Management**: Zustand (client-side global state)
- **URL State**: nuqs (type-safe URL parameters)

---

## File Organization

### Colocation-First Approach

Follow a **colocation-first** strategy: place components, pages, and related logic together within their route folders. This makes features self-contained, reduces context switching, and scales better than traditional global component folders.

```
/src
├── /app                          # Next.js App Router (routes)
│   ├── /(protected)                  # Route group: Core application (optional)
│   │   ├── /dashboard
│   │   │   ├── page.tsx         # Route entry point
│   │   │   ├── layout.tsx       # Dashboard layout
│   │   │   ├── loading.tsx      # Loading UI (Suspense fallback)
│   │   │   ├── error.tsx        # Error boundary
│   │   │   ├── schema.ts        # Route-specific validation (colocated)
│   │   │   └── /_components     # Dashboard-specific components (private)
│   │   │       ├── stats-card.tsx
│   │   │       └── analytics-chart.tsx
│   │   └── /settings
│   │       ├── page.tsx
│   │       └── /_components
│   ├── /(public)              # Route group: Public pages (optional)
│   │   ├── /auth
│   │   │   ├── /login
│   │   │   │   ├── page.tsx     # Login route
│   │   │   │   ├── schema.ts    # Login validation (colocated)
│   │   │   │   └── /_components # Login-specific components
│   │   │   │       └── login-form.tsx
│   │   │   ├── /register
│   │   │   │   ├── page.tsx
│   │   │   │   └── /_components
│   │   │   │       └── register-form.tsx
│   │   │   ├── /_components     # Shared auth components (segment-level)
│   │   │   │   └── github-sign-in-button.tsx
│   │   │   └── layout.tsx       # Auth layout
│   │   └── /marketing
│   ├── proxy.ts                 # Network boundary (replaces middleware.ts)
│   └── layout.tsx               # Root layout
├── /components                   # Top-level: Only UI primitives & layout elements
│   └── /ui                      # Shadcn UI components (global primitives)
│       ├── /button
│       ├── /modal
│       └── /card
├── /hooks                       # Reusable custom React hooks
├── /lib                         # Shared utilities and helpers
├── /stores                      # Zustand stores (client state)
└── /types                       # Shared TypeScript types
```

**Naming**: Files kebab-case, Components PascalCase, Hooks camelCase with `use` prefix, Server Actions in `.action.ts` files.

**Exports**: Favor named exports for components.

### Colocation Principles

1. **Route-Specific Components**: Place in `route/_components/` (e.g., `dashboard/_components/`)
2. **Segment-Shared Components**: Place in parent route `_components/` (e.g., `auth/_components/` for components shared by login and register)
3. **Global Components**: Only UI primitives (Shadcn components) in `/components/ui`
4. **Route-Specific Logic**: Colocate schema validation, types, or utilities with routes (e.g., `schema.ts` next to `page.tsx`)
5. **Shared Logic**: Keep in top-level `/lib`, `/hooks`, `/stores` when reused across multiple routes

### Route Groups (Optional)

Use route groups `(protected)` and `(public)` to organize routes without affecting URLs:
- `(protected)`: Core application logic (dashboard, settings, etc.)
- `(public)`: Public-facing routes (auth, marketing, etc.)

Route groups are optional but recommended for larger applications to maintain organization.

### When to Use Colocation

This pattern is especially useful for:
- Medium to large-scale applications with dozens of routes
- Teams working in parallel
- Projects where clear boundaries between server and client components are important
- Better modularity, faster onboarding, and improved discoverability

**Private Folders (`_components/`)**: Prefixing with underscore opts folders out of routing, following Next.js convention for better organization and editor navigation.

---

## Code Implementation Guidelines

### Early Returns
Use early returns whenever possible to improve readability and reduce nesting:

```typescript
// ✅ Good: Early return
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
    return
  }
  
  if (!product.published) {
    return <div>Product not available</div>
  }
  
  return <ProductDisplay product={product} />
}

// ❌ Bad: Nested conditions
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (product) {
    if (product.published) {
      return <ProductDisplay product={product} />
    } else {
      return <div>Product not available</div>
    }
  } else {
    notFound()
  }
}
```

### Function Declarations
- Use `const` arrow functions for event handlers and component methods
- Use `function` keyword for pure utility functions
- Always define types:

```typescript
// ✅ Good: Const arrow function for event handlers
const handleClick = (id: string, onSuccess?: () => void): void => {
  // Handle click
  onSuccess?.()
}

// ✅ Good: Function keyword for pure utility functions
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ Good: Function keyword for helper functions
function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

// ❌ Bad: Function declaration without type
function handleClick(id: string, onSuccess?: () => void) {
  // Handle click
  onSuccess?.()
}
```

### Event Handler Naming
Event functions must be named with "handle" prefix:

```typescript
'use client'

export function Button() {
  const handleClick = () => {
    // Handle click
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }
  
  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="Submit form"
    >
      Submit
    </button>
  )
}
```

### Accessibility Features
Implement accessibility features on interactive elements:

```typescript
'use client'

export function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  const handleClick = () => {
    window.location.href = href
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }
  
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Navigate to ${href}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </div>
  )
}
```

### Descriptive Naming
Use descriptive variable and function names:

```typescript
// ✅ Good: Descriptive names
const userAuthenticationToken = getAuthToken()
const isUserLoggedIn = checkAuthenticationStatus()
const handleUserLogin = async () => { }

// ❌ Bad: Abbreviated or unclear names
const token = getAuthToken()
const isAuth = checkAuth()
const login = async () => { }
```

---

## Server vs Client Components

### Default: Server Components

Components are Server Components by default (NO directive needed). They:
- Run only on the server, zero client bundle impact
- Can be async and await data directly
- Cannot use hooks, browser APIs, or event handlers

```typescript
// ✅ Server Component (default) - NO directive needed
export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params // Must await in Next.js 16
  const product = await db.products.findById(id)
  
  return (
    <div>
      <h1>{product.name}</h1>
      <AddToCartButton productId={product.id} />
    </div>
  )
}
```

### When to Add `'use client'`

Only when you need: React Hooks, Event Handlers, Browser APIs, or React Context Providers.

```typescript
'use client'

import { useState } from 'react'

export function AddToCartButton({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false)
  
  const handleClick = () => {
    setIsAdding(true)
    // Add to cart logic
  }
  
  return (
    <button
      onClick={handleClick}
      disabled={isAdding}
      aria-label="Add product to cart"
      className="px-[16px] py-[8px] bg-blue-600 text-white rounded-[8px] disabled:opacity-50"
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
```

**Keep client components small** - prefer Server Component wrappers with minimal client interactivity.

---

## Cache Components & Explicit Caching

Next.js 16 introduces Cache Components with `'use cache'` directive. **Everything is dynamic by default** unless explicitly cached.

### Enable Cache Components

```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
}
export default nextConfig
```

### Using `'use cache'` Directive

Can be used at file, component, or function level:

```typescript
// File-level
'use cache'
export async function getProducts() {
  return await db.products.findMany()
}

// Component-level
async function BlogPostList() {
  'use cache'
  const posts = await fetchPosts()
  return <div>{posts.map(...)}</div>
}

// Function-level
async function getProductData(id: string) {
  'use cache'
  return await fetch(`/api/products/${id}`).then(r => r.json())
}
```

### Cache Configuration

```typescript
import { cacheLife, cacheTag } from 'next/cache'

async function getProducts() {
  'use cache'
  cacheLife('max') // Built-in: max, hours, days, minutes
  cacheTag('products')
  return await db.products.findMany()
}

// Custom duration
async function getNewsFeed() {
  'use cache'
  cacheLife({ expire: 3600 }) // 1 hour
  cacheTag('news-feed')
  return await fetchNews()
}
```

### `'use cache: private'` (User-Specific Data)

Use when you need runtime APIs like `cookies()`, `headers()`, or `searchParams` for user-specific caching:

```typescript
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

async function getPersonalizedContent() {
  'use cache: private'
  cacheLife({ stale: 60 }) // Minimum 30 seconds required
  cacheTag('personalized-content')
  
  const cookieStore = await cookies()
  const userId = cookieStore.get('user-id')?.value
  return await getRecommendations(userId)
}
```

### `'use cache: remote'` (Shared Data in Dynamic Contexts)

Use for caching **shared data** in dynamic contexts (after `await cookies()`, `await headers()`, etc.):

```typescript
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

async function getSharedData() {
  const cookieStore = await cookies() // Dynamic context
  const locale = cookieStore.get('locale')?.value || 'en'
  
  'use cache: remote' // Cache shared data even in dynamic context
  cacheLife('hours')
  cacheTag(`shared-data-${locale}`)
  
  return await fetchSharedData(locale)
}
```

### Partial Prerendering (PPR)

Mix static, cached, and dynamic content within a single route:

```typescript
export default async function DashboardPage() {
  return (
    <div>
      {/* Static shell - renders immediately */}
      <Header />
      
      {/* Cached component - included in static shell */}
      <CachedStats />
      
      {/* Dynamic content - streams in with Suspense */}
      <Suspense fallback={<LoadingSkeleton />}>
        <LiveMetrics />
      </Suspense>
    </div>
  )
}

async function CachedStats() {
  'use cache'
  const stats = await getAggregatedStats()
  return <StatsDisplay stats={stats} />
}

async function LiveMetrics() {
  // Dynamic - fetches fresh data every request
  const metrics = await getCurrentMetrics()
  return <MetricsChart data={metrics} />
}
```

---

## Async Request APIs (Next.js 16 Breaking Change)

**All request APIs must be awaited** in Next.js 16:

```typescript
// ✅ Server Components - Must await
export default async function Page({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ sort?: string }>
}) {
  const { id } = await params
  const { sort = 'newest' } = await searchParams
  
  const cookieStore = await cookies()
  const headersList = await headers()
  const { isEnabled } = await draftMode()
  
  return <div>...</div>
}

// ✅ Client Components - Synchronous
'use client'
import { useParams, useSearchParams } from 'next/navigation'

export function ClientComponent() {
  const params = useParams() // No await needed
  const searchParams = useSearchParams()
  return <div>Product: {params.id}</div>
}
```

---

## Data Fetching Patterns

### Server Components: Direct Data Fetching (Preferred)

```typescript
export default async function ProductsPage() {
  const products = await db.products.findMany({
    where: { published: true }
  })
  return <ProductList products={products} />
}
```

### Fetch API Caching Control

**Next.js 16: fetch requests are NOT cached by default:**

```typescript
// No caching (default in Next.js 16)
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store',
})

// Explicit cache control
const data = await fetch('https://api.example.com/data', {
  cache: 'force-cache', // Cache indefinitely
})

// ISR: Revalidate after time period
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }, // Revalidate every hour
})

// Tag-based revalidation
const data = await fetch('https://api.example.com/data', {
  next: { tags: ['products'], revalidate: 3600 },
})
```

### Client-side Data Fetching (Only When Necessary)

Only for: real-time updates, user-triggered refetches, or data that changes based on client interactions.

---

## Streaming & Suspense

Use Suspense to stream slow-loading content while showing fast content immediately. **Always wrap client components in Suspense with fallback:**

```typescript
import { Suspense } from 'react'

export default async function Dashboard() {
  return (
    <div>
      <Header /> {/* Fast content renders immediately */}
      
      <Suspense fallback={<ChartSkeleton />}>
        <AnalyticsChart /> {/* Slow content streams in */}
      </Suspense>
      
      {/* ✅ Wrap client components in Suspense */}
      <Suspense fallback={<UserMenuSkeleton />}>
        <UserMenu />
      </Suspense>
    </div>
  )
}

// loading.tsx automatically wraps page.tsx in Suspense
```

---

## Server Actions

Server Actions run on the server and can be called from Client Components:

```typescript
// app/actions/user.action.ts
'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateUserProfile(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  
    await db.user.update({
      where: { id: getCurrentUserId() },
      data: { name, email }
    })
    
    revalidatePath('/profile')
    return { success: true }
}

// Using in Client Component
'use client'
import { updateUserProfile } from '@/app/actions/user.action'

export function ProfileForm({ user }: { user: User }) {
  const handleSubmit = async (formData: FormData) => {
    const result = await updateUserProfile(formData)
    if (!result.success) {
      alert(result.error)
      return
    }
    // Success handling
  }
  
  return <form action={handleSubmit}>...</form>
}
```

---

## Improved Caching APIs

### `revalidateTag()` (Updated)

**Next.js 16 requires `cacheLife` profile as second argument:**

```typescript
import { revalidateTag } from 'next/cache'

// ✅ New signature: revalidateTag(tag, profile)
revalidateTag('blog-posts', 'max') // Recommended
revalidateTag('news-feed', 'hours')
revalidateTag('products', { expire: 3600 })

// ❌ Deprecated - single argument form
revalidateTag('blog-posts') // Will show warning
```

### `updateTag()` (New - Server Actions Only)

Provides read-your-writes semantics, expiring and reading fresh data within the same request:

```typescript
'use server'
import { updateTag } from 'next/cache'

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update({ where: { id: userId }, data: profile })
  updateTag(`user-${userId}`) // User sees changes immediately
}
```

### `refresh()` (New - Server Actions Only)

Refreshes uncached data only, without touching the cache:

```typescript
'use server'
import { refresh } from 'next/cache'

export async function markNotificationAsRead(notificationId: string) {
  await db.notifications.update({
    where: { id: notificationId },
    data: { read: true }
  })
  refresh() // Refresh uncached notification count
}
```

---

## Parallel Routes

**Next.js 16: All parallel route slots now require explicit `default.js` files.** Builds fail without them.

```typescript
// app/dashboard/@analytics/default.tsx
export default function Default() {
  return null // Or call notFound()
}

// Or redirect
import { redirect } from 'next/navigation'
export default function Default() {
  redirect('/dashboard/analytics/overview')
}
```

---

## Proxy (Replaces Middleware)

Next.js 16 introduces `proxy.ts` to replace `middleware.ts`, making the network boundary explicit. Runs on Node.js runtime.

```typescript
// app/proxy.ts
import { NextResponse, type NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth-token')
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
```

> **Note**: `middleware.ts` is still available for Edge runtime but is deprecated.

---

## Turbopack File System Caching (Beta)

Enable filesystem caching in development for significantly faster compile times across restarts:

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
}
export default nextConfig
```

---

## React 19.2 Features

### View Transitions

```typescript
'use client'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const router = useRouter()
  
  return (
    <a
      href="/about"
      onClick={(e) => {
        e.preventDefault()
        document.startViewTransition(() => {
          router.push('/about')
        })
      }}
    >
      About
    </a>
  )
}
```

### `useEffectEvent()`

Stable event handler that doesn't need to be in dependency arrays:

```typescript
'use client'
import { useEffectEvent } from 'react'

export function Component() {
  const onMount = useEffectEvent(() => {
    // Access latest props/state without dependencies
  })
  
  useEffect(() => {
    onMount()
  }, []) // Safe empty deps
}
```

### `<Activity/>` Component

Built-in loading indicator component from React 19.2.

---

## Image Configuration (Next.js 16 Changes)

```typescript
// next.config.ts
const nextConfig = {
  images: {
    // Required for local images with query strings (security)
    localPatterns: [
      {
        pathname: '/images/**',
        search: '**',
      },
    ],
    // Changed from 60s to 4 hours (14400s)
    minimumCacheTTL: 14400,
    // No longer includes 16px
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Changed from [1..100] to [75]
    qualities: [75],
    // New security restriction - blocks local IP optimization by default
    dangerouslyAllowLocalIP: false, // Set to true for private networks only
    // Changed from unlimited to 3 redirects maximum
    maximumRedirects: 3,
  },
}
```

---

## State Management Strategy

### Local State (useState)
Use for UI-only concerns (dropdown open, hover states).

### URL State (nuqs)
Type-safe URL parameters with SSR support:

```typescript
// Client Component
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export function ProductFilters() {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1)
  )
  
  const handleNextPage = () => {
    setPage(page + 1)
  }
  
  return (
    <button
      onClick={handleNextPage}
      aria-label="Go to next page"
      className="px-[16px] py-[8px] bg-blue-600 text-white rounded-[8px]"
    >
      Next
    </button>
  )
}

// Server Component
import { createSearchParamsCache, parseAsInteger } from 'nuqs/server'

const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
})

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<Record<string, string | string[]>>
}) {
  const { page } = await searchParamsCache.parse(await searchParams)
  return <ProductList page={page} />
}
```

### Global Client State (Zustand)
Use for shared state across components, persistence, or global app state:

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    { name: 'sidebar-state' }
  )
)
```

---

## Styling with Tailwind CSS

### Core Principles

1. **No Inline Styles**: Use Tailwind utility classes exclusively
2. **Dark Mode**: Only add `dark:` variant when value differs from light mode
3. **Arbitrary Values**: Use exact design values: `px-[16px]`, `text-[14px]`
4. **Mobile-First**: Default styles for mobile, use `md:`, `lg:` for larger screens
5. **CSS Variables**: Use for dynamic values that persist across hydration
6. **Conditional Classes**: Use `cn()` utility with logical operators instead of ternary operators when possible

```typescript
import { cn } from '@/lib/utils'

export function Button({ variant = 'primary', disabled }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-[16px] py-[8px] rounded-[8px] text-[14px] font-medium',
        // ✅ Good: Use logical operators with cn()
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 dark:bg-gray-700',
        disabled && 'opacity-60 cursor-not-allowed',
        // ❌ Avoid: Ternary operators in className
        // variant === 'primary' ? 'bg-blue-600' : 'bg-gray-200'
      )}
      disabled={disabled}
    >
      Click me
    </button>
  )
}

// CSS Variables for dynamic styles
<aside style={{ width: 'var(--sidebar-width)' }}>
```

### Concise Conditionals
Avoid unnecessary curly braces in simple conditionals:

```typescript
// ✅ Good: Concise syntax for simple statements
if (!product) return null
if (isLoading) return <LoadingSkeleton />

// ✅ Good: Use braces for complex statements
if (product && product.published) {
  return <ProductDisplay product={product} />
}

// ❌ Bad: Unnecessary braces for simple statements
if (!product) {
  return null
}
```

### Declarative JSX
Use declarative JSX patterns instead of imperative code:

```typescript
// ✅ Good: Declarative JSX
export function ProductList({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

// ❌ Bad: Imperative approach
export function ProductList({ products }: { products: Product[] }) {
  const items: JSX.Element[] = []
  for (let i = 0; i < products.length; i++) {
    items.push(<ProductCard key={products[i].id} product={products[i]} />)
  }
  return <div>{items}</div>
}
```

---

## TypeScript Patterns

### Interface Conventions

```typescript
// Component props
interface ComponentNameProps {
  requiredProp: string
  optionalProp?: boolean
  children?: React.ReactNode
}

// Server Component props (with async params)
interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Server Action return types
interface ActionResult {
  success: boolean
  error?: string
  data?: unknown
}
```

### Type Safety Rules

1. **No `any`**: Use proper types or `unknown` with type guards
2. **Prefer `interface` over `type`** for object shapes
3. **Use `type` for unions**: `type Status = 'pending' | 'active'`
4. **Const Assertions**: Use `as const` for constant objects/arrays
5. **Avoid enums**: Use const objects with `as const`

```typescript
const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
} as const

type Status = typeof STATUS[keyof typeof STATUS]
```

---

## Performance Optimization

### Web Vitals Optimization

Optimize Core Web Vitals for better user experience and SEO:

- **LCP (Largest Contentful Paint)**: Use `priority` flag on above-the-fold images, optimize image formats (WebP), use Suspense for streaming
- **CLS (Cumulative Layout Shift)**: Always specify `width` and `height` on images, use CSS variables for dynamic values
- **FID (First Input Delay)**: Minimize JavaScript execution, use Server Components, lazy load non-critical code

### Memoization

#### React Compiler (Recommended)

Next.js 16 includes stable support for the **React Compiler**, which provides **automatic memoization** with zero manual code changes. When enabled, the compiler automatically optimizes your components — no need for `useMemo`, `useCallback`, or `React.memo`.

**Enable in `next.config.ts`:**

```typescript
const nextConfig = {
  reactCompiler: true,
};

export default nextConfig;
```

**Install the plugin:**

```bash
bun add babel-plugin-react-compiler@latest
```

With React Compiler enabled, you can write simple, clean code:

```typescript
'use client'

export function ProductList({ products }: { products: Product[] }) {
  // React Compiler automatically memoizes this computation
  const sortedProducts = products.toSorted((a, b) => a.price - b.price)
  
  // React Compiler automatically memoizes this callback
  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`)
  }
  
  return (
    <div>
      {sortedProducts.map(product => (
        <button
          key={product.id}
          onClick={() => handleProductClick(product.id)}
          type="button"
          aria-label={`View ${product.name} details`}
        >
          {product.name}
        </button>
      ))}
    </div>
  )
}
```

> **Note:** React Compiler is not enabled by default due to increased compile times (it uses Babel). Enable it when you need automatic memoization optimization.

#### Manual Memoization (Fallback)

If React Compiler is not enabled, use manual memoization hooks:

```typescript
'use client'
import { useMemo, useCallback } from 'react'

export function ProductList({ products }: { products: Product[] }) {
  const sortedProducts = useMemo(() => {
    return products.toSorted((a, b) => a.price - b.price)
  }, [products])
  
  const handleProductClick = useCallback((id: string) => {
    router.push(`/products/${id}`)
  }, [router])
  
  return (
    <div>
      {sortedProducts.map(product => (
        <button
          key={product.id}
          onClick={() => handleProductClick(product.id)}
          type="button"
          aria-label={`View ${product.name} details`}
        >
          {product.name}
        </button>
      ))}
    </div>
  )
}
```

### Dynamic Imports

```typescript
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Skip SSR if component uses browser APIs
})
```

### Image Optimization

Optimize images with WebP format, size data, and lazy loading:

```typescript
import Image from 'next/image'

// ✅ Good: Optimized image with all required props
<Image
  src="/product.webp" // Use WebP format when possible
  alt="Product description"
  width={800}
  height={600}
  priority // For above-the-fold images only
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  loading="lazy" // Default, but explicit for below-fold images
/>

// ✅ Good: Placeholder images for seed data
<Image
  src="https://placekitten.com/800/600"
  alt="Placeholder"
  width={800}
  height={600}
/>
```

**Image Best Practices:**
- Use WebP format for better compression
- Always include `width` and `height` to prevent layout shift (CLS)
- Use `priority` only for above-the-fold images (improves LCP)
- Implement lazy loading for below-fold images
- Use `placeholder="blur"` with blurDataURL for better UX
- For seed data/placeholders, use `https://placekitten.com/`

---

## Logging and Debugging

### Structured Logging

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ComponentName')

logger.info('User action performed', { userId: user.id, action: 'click' })
logger.warn('Potential issue detected', { details: errorDetails })
logger.error('Operation failed', { error: error.message, stack: error.stack })
```

### Next.js DevTools MCP

Next.js 16 introduces DevTools MCP for AI-assisted debugging:
- Unified browser and server logs
- Automatic error access with stack traces
- Context-aware debugging for routing and caching
- Integration with AI agents for diagnostics

### Development Request Logs

Next.js 16 shows where time is spent in development:
- **Compile**: Routing and compilation
- **Render**: Running your code and React rendering

Build logs show time for each step: TypeScript, collecting page data, generating static pages, etc.

---

## Error Handling

### Error Boundaries

```typescript
// app/dashboard/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const handleReset = () => {
    reset()
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleReset()
    }
  }
  
  return (
    <div className='flex flex-col items-center justify-center min-h-[400px]'>
      <h2 className='text-[24px] font-bold mb-[16px]'>Something went wrong!</h2>
      <button
        onClick={handleReset}
        onKeyDown={handleKeyDown}
        aria-label="Try again to reload the page"
        className='px-[16px] py-[8px] bg-blue-600 text-white rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        Try again
      </button>
    </div>
  )
}
```

### Not Found Pages

```typescript
// app/products/[id]/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[400px]'>
      <h2 className='text-[24px] font-bold mb-[8px]'>Product Not Found</h2>
      <Link href='/products' className='px-[16px] py-[8px] bg-blue-600 text-white rounded-[8px]'>
        View All Products
      </Link>
    </div>
  )
}
```

### Try-Catch in Server Components

```typescript
export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  try {
    const product = await getProduct(id)
    if (!product) notFound()
    return <ProductDisplay product={product} />
  } catch (error) {
    console.error('Failed to load product:', error)
    throw error // Let error boundary handle it
  }
}
```

---

## Code Quality Checklist

### Server vs Client Components
- [ ] Component is Server Component unless it needs interactivity
- [ ] `'use client'` only added when necessary (hooks, events, browser APIs)
- [ ] Client components are as small as possible
- [ ] Data fetching done on server when possible

### Caching
- [ ] Cache Components enabled if using `'use cache'`
- [ ] `revalidateTag()` includes cacheLife profile
- [ ] `updateTag()` used in Server Actions for read-your-writes
- [ ] Cache tags applied appropriately

### TypeScript
- [ ] All props have interface defined
- [ ] No `any` types used
- [ ] Async params/searchParams properly awaited
- [ ] Server Action return types defined

### Performance
- [ ] React Compiler enabled (`reactCompiler: true`) for automatic memoization, OR
- [ ] Manual `useMemo`/`useCallback` if React Compiler is not enabled
- [ ] Dynamic imports for heavy components
- [ ] Image component used for all images
- [ ] WebP format used for images
- [ ] Width and height specified for images (prevents CLS)
- [ ] Priority flag only for above-the-fold images (improves LCP)
- [ ] Client components wrapped in Suspense with fallback
- [ ] Web Vitals optimized (LCP, CLS, FID)

### Styling
- [ ] No inline styles (use Tailwind classes)
- [ ] Dark mode variants only when values differ
- [ ] Mobile-first responsive design
- [ ] CSS variables for dynamic values

### Code Quality
- [ ] Early returns used for better readability
- [ ] Event handlers named with "handle" prefix (handleClick, handleKeyDown)
- [ ] Const arrow functions for handlers, function keyword for pure utilities
- [ ] File structure follows order: component, subcomponents, helpers, constants, types
- [ ] Named exports favored for components
- [ ] Accessibility features implemented (tabIndex, aria-label, keyboard handlers)
- [ ] Types defined for all functions and variables
- [ ] Declarative JSX used throughout
- [ ] Unnecessary curly braces avoided in simple conditionals

### Colocation
- [ ] Route-specific components in `route/_components/`
- [ ] Segment-shared components in parent route `_components/`
- [ ] Global components only in `/components/ui` (UI primitives)
- [ ] Route-specific logic (schema, validation) colocated with routes
- [ ] Shared logic in top-level `/lib`, `/hooks`, `/stores`

---

## Anti-Patterns to Avoid

```typescript
// ❌ Adding 'use client' when not needed
'use client'
export default function StaticPage() {
  return <div>Static content</div>
}

// ❌ Client-side data fetching in useEffect
'use client'
export function Products() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])
  return <ProductList products={products} />
}

// ❌ Not awaiting async params
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = params.id // Error! Must await
}

// ❌ Using old middleware.ts
export function middleware(request) { } // Deprecated

// ❌ Duplicate dark mode classes
<div className='bg-white dark:bg-white'> // Redundant

// ❌ Using any type
const handleClick = (e: any) => {}
```

### ✅ Do This Instead

```typescript
// ✅ Server Component for static content (no directive needed)
export default async function StaticPage() {
  return <div>Static content</div>
}

// ✅ Fetch data on server
export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductList products={products} />
}

// ✅ Await async params
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}

// ✅ Use proxy.ts
export default function proxy(request: NextRequest) { }

// ✅ Only add dark mode when different
<div className='bg-white dark:bg-gray-900'>

// ✅ Proper types and const arrow function
const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
  // Handle click
}

// ✅ Early return pattern
const handleSubmit = async (formData: FormData): Promise<void> => {
  if (!formData.get('email')) {
    return // Early return
  }
  // Process form
}

// ✅ Accessibility features
<button
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  tabIndex={0}
  aria-label="Submit form"
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  Submit
</button>
```

---

## Additional Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Next.js 16 Release Blog](https://nextjs.org/blog/next-16)
- [React 19.2 Documentation](https://react.dev)
- [Turbopack Documentation](https://turbo.build/pack/docs)
- [nuqs Documentation](https://nuqs.47ng.com/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)



