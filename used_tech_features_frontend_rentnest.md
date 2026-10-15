# Used Tech Features & Features Impact Analysis

> A complete inventory of every **React.js**, **Next.js**, **Browser API**, and **JavaScript language feature** used across this RentNest frontend — where they appear, why they matter, and what breaks without them.

---

### 🧭 Quick Navigation

- [⚛️ React Hooks](#react-hooks) — **6 features**
- [🧩 React Concepts & Keywords](#react-concepts--keywords) — **6 features**
- [▲ Next.js Features](#nextjs-features) — **24 features**
- [🌐 Browser APIs](#browser-apis) — **12 features**
- [🟨 JavaScript / TypeScript Language Features](#javascript--typescript-language-features) — **20 features**
- [🔌 Third-Party Library Integration](#third-party-library-integration) — **4 features**

<details>
<summary><strong>📚 How to use this document</strong></summary>

1. Choose a category from the navigation above.
2. Click a feature title to open its details.
3. Read **Where Used** to locate it in the project.
4. Read **Why** to understand its purpose.
5. Read the **Without...** explanation to understand its impact.

</details>

---

## ⚛️ React Hooks

### 1. `useState`

| Where Used                 | Why                                                                      |
| -------------------------- | ------------------------------------------------------------------------ |
| `LoginForm.tsx`            | Manages `email`, `password`, `showPassword`, `isLoading`                 |
| `RegisterForm.tsx`         | Manages `name`, `email`, `password`, `role`, `showPassword`, `isLoading` |
| `navbar.tsx`               | Controls mobile drawer open/close (`isOpen`)                             |
| `DeletePropertyButton.tsx` | Tracks loading state during deletion                                     |
| `PropertyForm.tsx`         | Manages all 10+ form fields for property create/edit                     |
| `UsersManagementTable.tsx` | Manages `users`, `updatingId`, `searchTerm`, `roleFilter`                |
| `RequestsClientTable.tsx`  | Manages `requests` list and `updatingId`                                 |
| `ReviewForm.tsx`           | Manages `rating`, `hoverRating`, `comment`, `loading`, `error`           |
| `CheckoutClient.tsx`       | Manages `loading` and `error`                                            |
| `RequestRentalModal.tsx`   | Manages `open`, `isSubmitted`                                            |
| `PropertyImageGallery.tsx` | Manages `selectedIdx` for thumbnail selection                            |
| `HeroSearchForm.tsx`       | Manages `searchTerm`, `location`                                         |

> **Without `useState`:** Every form would have zero interactivity — no typed text, no loading spinners, no toggled checkboxes, no tracked filters. The entire user-facing UI would be purely static HTML with no way to capture or react to input.

---

### 2. `useEffect`

| Where Used      | Why                                                  |
| --------------- | ---------------------------------------------------- |
| `app/error.tsx` | Logs error object to console after component renders |

```tsx
useEffect(() => {
  console.error(error);
}, [error]);
```

> **Without `useEffect`:** Error objects would never reach your error logging service or browser console — you'd have silent, invisible failures with no debugging path.

---

### 3. `useTransition`

| Where Used               | Why                                                           |
| ------------------------ | ------------------------------------------------------------- |
| `RequestRentalModal.tsx` | Wraps the server action call inside a non-blocking transition |

```tsx
const [isPending, startTransition] = useTransition();
// ...
startTransition(async () => {
  await submitRentalRequestAction({ ... });
});
```

> **Without `useTransition`:** The modal UI would freeze completely during the server action call. The user couldn't click cancel or interact with anything until the network request finishes, making the modal feel unresponsive.

---

### 4. `useMemo`

| Where Used                 | Why                                                                     |
| -------------------------- | ----------------------------------------------------------------------- |
| `UsersManagementTable.tsx` | Memoizes the filtered users list based on `searchTerm` and `roleFilter` |

```tsx
const filteredUsers = useMemo(() => {
  const term = searchTerm.trim().toLowerCase();
  return users.filter((user) => { ... });
}, [users, searchTerm, roleFilter]);
```

> **Without `useMemo`:** The entire user list would be re-filtered on every single keystroke and every unrelated re-render, causing noticeable lag when the table contains hundreds of users.

---

### 5. `useRef`

| Where Used                    | Why                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `property-filter-sidebar.tsx` | Stores 4 debounce timer IDs (`setTimeout` refs) without triggering re-renders |

```tsx
const searchTermTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const locationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const minPriceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const maxPriceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

> **Without `useRef`:** Timer IDs would need to live in `useState`, meaning every keystroke in a filter input would cause a re-render (since the timer ref itself is "state"), creating a cascading render storm.

---

### 6. `useSyncExternalStore`

| Where Used            | Why                                                                   |
| --------------------- | --------------------------------------------------------------------- |
| `hooks/use-mobile.ts` | Subscribes to `window.matchMedia` for responsive breakpoint detection |

```tsx
const isMobile = React.useSyncExternalStore(
  subscribe,
  () => window.innerWidth < MOBILE_BREAKPOINT,
  () => false, // SSR fallback
);
```

> **Without `useSyncExternalStore`:** You'd need to manually manage `matchMedia.addEventListener`, handle tearing between concurrent renders, and provide your own SSR-safe fallback — all of which are easy to get wrong and would produce hydration mismatches.

---

## 🧩 React Concepts & Keywords

### 7. `"use client"` Directive

| Where Used                          | Why                                                             |
| ----------------------------------- | --------------------------------------------------------------- |
| `LoginForm.tsx`, `RegisterForm.tsx` | Need `useState`, `useRouter`, `useSearchParams`, event handlers |
| `navbar.tsx`                        | Needs `useState`, `usePathname`, click handlers                 |
| `hero-search.tsx`                   | Needs `useState`, `useRouter`, form submit handler              |
| `PropertyImageGallery.tsx`          | Needs `useState` for image selection                            |
| `property-filter-sidebar.tsx`       | Needs `useRef`, `useRouter`, `useSearchParams`                  |
| `pagination-controls.tsx`           | Needs `useRouter`, `useSearchParams`                            |
| `UsersManagementTable.tsx`          | Needs `useState`, `useMemo`, `useRouter`                        |
| `RequestsClientTable.tsx`           | Needs `useState`, `useRouter`                                   |
| `DeletePropertyButton.tsx`          | Needs `useState`, `useRouter`, `confirm()`                      |
| `PropertyForm.tsx`                  | Needs `useState`, `useRouter`, form state                       |
| `ReviewForm.tsx`                    | Needs `useState`, `useRouter`, form state                       |
| `CheckoutClient.tsx`                | Needs `useState`, `window.location.href`                        |
| `RequestRentalModal.tsx`            | Needs `useState`, `useTransition`, `useRouter`                  |
| `user-nav.tsx`                      | Needs `useRouter`, `toast()`                                    |
| `app/error.tsx`                     | Needs `useEffect`, `reset()` callback                           |
| `app/not-found.tsx`                 | Needs `window.history.back()`                                   |

> **Without `"use client"`:** Every interactive component would crash with "Cannot use hooks in a Server Component." No forms, no buttons, no navigation — the app would be a collection of static pages with zero user interaction.

---

### 8. `"use server"` Directive

| Where Used                               | Why                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| `app/(authGroup)/_actions/authAction.ts` | `registerAction`, `loginAction`, `logoutAction` — server-side auth mutations |
| `service/rentalAction.ts`                | `submitRentalRequestAction` — server-side rental submission                  |
| `service/revalidateCache.ts`             | `revalidatePropertiesCache` — server-side cache invalidation                 |

> **Without `"use server"`:** Client components would need to call separate API routes via `fetch()` to perform mutations. You'd lose automatic cookie forwarding, TypeScript safety across the server boundary, and the simplicity of calling server functions like regular async functions.

---

### 9. `React.ReactNode` Type

| Where Used                   | Why                                                    |
| ---------------------------- | ------------------------------------------------------ |
| `app/layout.tsx`             | `children: React.ReactNode` in root layout             |
| `app/(authGroup)/layout.tsx` | `children: React.ReactNode` in auth layout             |
| `RequestRentalModal.tsx`     | `trigger?: React.ReactNode` for custom trigger element |

> **Without `React.ReactNode`:** TypeScript would reject valid JSX, strings, numbers, arrays, and null/undefined as children, forcing you to use `any` or create overly-specific type unions.

---

### 10. `React.FormEvent` / `React.SubmitEvent`

| Where Used         | Why                                                 |
| ------------------ | --------------------------------------------------- |
| `LoginForm.tsx`    | `handleSubmit(e: React.FormEvent<HTMLFormElement>)` |
| `RegisterForm.tsx` | `handleSubmit(e: React.FormEvent<HTMLFormElement>)` |
| `PropertyForm.tsx` | `handleSubmit(e: React.SubmitEvent)`                |
| `ReviewForm.tsx`   | `handleSubmit(e: React.FormEvent)`                  |

> **Without `React.FormEvent`:** The form event parameter would have no type information, making `e.preventDefault()`, `e.currentTarget`, and other form methods unsafe to call without manual casting.

---

### 11. `React.SVGProps<SVGSVGElement>`

| Where Used                        | Why                                                                       |
| --------------------------------- | ------------------------------------------------------------------------- |
| `app/dashboard/landlord/page.tsx` | `BuildingIcon(props: React.SVGProps<SVGSVGElement>)` inline SVG component |

> **Without `React.SVGProps`:** The custom SVG component wouldn't accept standard SVG attributes (`width`, `height`, `className`, `xmlns`, etc.) as props, breaking the component API.

---

### 12. `React.RefObject`

| Where Used                    | Why                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `property-filter-sidebar.tsx` | Typing debounce timer refs: `React.RefObject<ReturnType<typeof setTimeout> \| null>` |

> **Without `React.RefObject`:** Timer refs would have no type safety, making it easy to accidentally call `.current` methods that don't exist on the stored value.

---

## ▲ Next.js Features

### 13. Server Components (Default)

| Where Used                                             | Why                                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `app/(publicGroup)/page.tsx`                           | Fetches categories + properties directly in component body with `Promise.all()` |
| `app/(publicGroup)/properties/page.tsx`                | Reads `searchParams` and fetches filtered properties                            |
| `app/(publicGroup)/properties/[id]/page.tsx`           | Fetches property by ID and session in parallel                                  |
| `app/dashboard/admin/page.tsx`                         | Fetches users, properties, rentals concurrently                                 |
| `app/dashboard/admin/properties/page.tsx`              | Fetches all properties for admin                                                |
| `app/dashboard/admin/rentals/page.tsx`                 | Fetches all rental requests                                                     |
| `app/dashboard/admin/users/page.tsx`                   | Fetches all users                                                               |
| `app/dashboard/landlord/page.tsx`                      | Fetches landlord properties and requests                                        |
| `app/dashboard/landlord/properties/new/page.tsx`       | Fetches categories for form dropdown                                            |
| `app/dashboard/landlord/properties/[id]/edit/page.tsx` | Fetches property + categories in parallel                                       |
| `app/dashboard/landlord/requests/page.tsx`             | Fetches rental requests                                                         |
| `app/dashboard/tenant/page.tsx`                        | Fetches requests, payments, and hydrates properties                             |
| `app/dashboard/tenant/reviews/page.tsx`                | Fetches property for review form                                                |
| `app/dashboard/tenant/requests/[id]/pay/page.tsx`      | Fetches rental request and property                                             |
| `app/payment/cancel/page.tsx`                          | Static page shell                                                               |
| `app/payment/success/page.tsx`                         | Static page shell                                                               |

> **Without Server Components:** Every page would need `"use client"`, pushing all data fetching to the client. This would mean: no SEO (content not in initial HTML), slower loads (waterfall fetches), larger bundle sizes, and no direct access to `cookies()` or `jwt.verify()` on the server.

---

### 14. Loading States (`loading.tsx`)

| Where Used                                      | What It Shows                                      |
| ----------------------------------------------- | -------------------------------------------------- |
| `app/loading.tsx`                               | Full-screen spinner during root layout transitions |
| `app/(publicGroup)/loading.tsx`                 | `SimpleLoaderSkeleton` for public routes           |
| `app/(publicGroup)/properties/loading.tsx`      | `PropertyGridSkeleton` for catalog page            |
| `app/(publicGroup)/properties/[id]/loading.tsx` | `PropertyDetailSkeleton` for detail page           |
| `app/dashboard/loading.tsx`                     | `DashboardSkeleton` for all dashboard routes       |

> **Without `loading.tsx`:** Users would stare at a blank white screen or the previous page content during every server-side data fetch. The app would feel broken and unresponsive during navigation.

---

### 15. Error Boundary (`error.tsx`)

| Where Used      | Why                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `app/error.tsx` | Catches rendering errors anywhere under root layout, displays error UI with `reset()` callback |

```tsx
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) { ... }
```

> **Without `error.tsx`:** Any rendering error would crash the entire page with a blank screen. Users would have no way to recover except hard-refreshing, and developers would get no error digest for debugging.

---

### 16. Custom Not Found Page (`not-found.tsx`)

| Where Used          | Why                                                        |
| ------------------- | ---------------------------------------------------------- |
| `app/not-found.tsx` | Branded 404 page with "Go back" and "Back to home" buttons |

Programmatically triggered via:

- `notFound()` in `properties/[id]/page.tsx`, `landlord/properties/[id]/edit/page.tsx`, `tenant/requests/[id]/pay/page.tsx`, `tenant/reviews/page.tsx`
- `NextResponse.redirect(new URL("/not-found", ...))` in `proxy.ts`

> **Without `not-found.tsx`:** Users hitting missing URLs would see Next.js's generic unstyled "404 - This page could not be found" — no branding, no navigation links, no helpful next steps.

---

### 17. Dynamic Routes (`[id]`)

| Where Used                               | URL Pattern                               |
| ---------------------------------------- | ----------------------------------------- |
| `properties/[id]/page.tsx`               | `/properties/:id`                         |
| `landlord/properties/[id]/edit/page.tsx` | `/dashboard/landlord/properties/:id/edit` |
| `tenant/requests/[id]/pay/page.tsx`      | `/dashboard/tenant/requests/:id/pay`      |

Parameter access via async `params` (Next.js 16):

```tsx
const { id } = await params;
```

> **Without dynamic routes:** You'd need to create a separate `page.tsx` file for every single property, payment, and request in the system — physically impossible for dynamic content.

---

### 18. Route Groups (`(authGroup)`, `(publicGroup)`)

| Where Used       | Why                                                                 |
| ---------------- | ------------------------------------------------------------------- |
| `(authGroup)/`   | Groups `/login` and `/register` with a centered auth layout wrapper |
| `(publicGroup)/` | Groups `/` and `/properties/*` with shared loading skeletons        |

> **Without route groups:** You'd need to either duplicate layout code across every page, create a complex nesting structure that pollutes URLs (e.g., `/auth/login`), or abandon shared layouts entirely.

---

### 19. Static Metadata Export

| Where Used                     | Example                                 |
| ------------------------------ | --------------------------------------- |
| `app/(publicGroup)/page.tsx`   | `title: "RentNest \| Find & Rent..."`   |
| `app/dashboard/admin/page.tsx` | `title: "Admin Dashboard \| RentNest"`  |
| All dashboard pages            | Unique `title` + `description` per page |

> **Without metadata:** Every page would show "RentNest" or the folder name in the browser tab. Search engines would have no context about page content, destroying SEO.

---

### 20. Dynamic Metadata (`generateMetadata`)

| Where Used                 | Why                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `properties/[id]/page.tsx` | Fetches property data to generate `title: "${property.title} \| RentNest"` and `description` |

```tsx
export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const res = await getPropertyById(id);
  return { title: `${property.title} | RentNest`, ... };
}
```

> **Without `generateMetadata`:** Every property detail page would have the same generic title in browser tabs and Google search results. Users couldn't distinguish between `/properties/abc` and `/properties/xyz`.

---

### 21. Nested Layouts

| Where Used                   | What It Provides                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| `app/layout.tsx`             | Root shell: `<html>`, `<body>`, font setup, `<Toaster>`, `<Navbar>` wrapped in `<Suspense>` |
| `app/(authGroup)/layout.tsx` | Centers auth forms vertically with `min-h-[calc(100vh-4rem)]`                               |

> **Without nested layouts:** Every page would need to repeat the `<html>`, `<body>`, font loading, toaster setup, and navbar code. Changing the navbar would require editing every single page file.

---

### 22. `next/font/google`

| Where Used       | Why                                          |
| ---------------- | -------------------------------------------- |
| `app/layout.tsx` | `Inter` font with CSS variable `--font-sans` |

```tsx
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

> **Without `next/font`:** Fonts would load via external CSS `@import` or `<link>` tags, causing: 1) a flash of unstyled text (FOUT), 2) layout shifts as fonts load, 3) an extra network request blocking render.

---

### 23. `next/image`

| Where Used                   | Why                                                        |
| ---------------------------- | ---------------------------------------------------------- |
| `properties/page.tsx`        | `fill` + `unoptimized` for property thumbnails             |
| `properties/[id]/page.tsx`   | `fill` + `priority` + `unoptimized` for gallery hero image |
| `property-image-gallery.tsx` | `fill` + `priority` for main display image                 |
| `property-image-gallery.tsx` | `fill` for thumbnail bar images                            |

Key props used:

- `fill` — Makes image cover parent container (no explicit width/height needed)
- `priority` — Preloads above-the-fold images to prevent LCP delay
- `unoptimized` — Skips Next.js optimization for external images (postimg.cc)

> **Without `next/image`:** Raw `<img>` tags would: load all images eagerly (no lazy loading), provide no responsive sizing, no WebP conversion, no CLS prevention, and no automatic priority hints for Core Web Vitals.

---

### 24. `next/link`

| Where Used                | Frequency                                             |
| ------------------------- | ----------------------------------------------------- |
| Throughout the entire app | Every navigation link, button navigation, breadcrumbs |

> **Without `next/link`:** Every navigation would trigger a full page reload, destroying client-side state, causing a white flash, re-downloading all JavaScript, and making the app feel like a traditional multi-page website instead of an SPA.

---

### 25. `useRouter` (next/navigation)

| Where Used                    | Key Methods                               |
| ----------------------------- | ----------------------------------------- |
| `LoginForm.tsx`               | `router.push()`, `router.refresh()`       |
| `RegisterForm.tsx`            | `router.push()`                           |
| `navbar.tsx`                  | `router.push()` (mobile menu link clicks) |
| `user-nav.tsx`                | `router.push()`, `router.refresh()`       |
| `HeroSearchForm.tsx`          | `router.push()`                           |
| `pagination-controls.tsx`     | `router.push()`                           |
| `property-filter-sidebar.tsx` | `router.push()`                           |
| `DeletePropertyButton.tsx`    | `router.refresh()`                        |
| `PropertyForm.tsx`            | `router.push()`, `router.refresh()`       |
| `UsersManagementTable.tsx`    | `router.refresh()`                        |
| `RequestsClientTable.tsx`     | `router.refresh()`                        |
| `RequestRentalModal.tsx`      | `router.push()`, `router.refresh()`       |
| `ReviewForm.tsx`              | `router.push()`, `router.refresh()`       |

`router.refresh()` — Re-fetches the current route's server components, picking up newly set cookies or invalidated caches without a full navigation.

> **Without `useRouter`:** Programmatic navigation after form submission would be impossible. `router.refresh()` wouldn't exist, so after mutations, users would need to manually reload to see updated data.

---

### 26. `usePathname` (next/navigation)

| Where Used   | Why                                             |
| ------------ | ----------------------------------------------- |
| `navbar.tsx` | Highlights the currently active navigation link |

```tsx
pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground";
```

> **Without `usePathname`:** The navbar would have no way to know which page the user is on. No active link highlighting — users would lose their sense of location within the app.

---

### 27. `useSearchParams` (next/navigation)

| Where Used                    | Why                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `LoginForm.tsx`               | Reads `?redirectTo=` to redirect after login                                        |
| `RegisterForm.tsx`            | Reads `?redirectTo=` for post-registration redirect                                 |
| `pagination-controls.tsx`     | Reads current page params, builds next page URL                                     |
| `property-filter-sidebar.tsx` | Reads all filter params (`searchTerm`, `location`, `categoryId`, `amenities`, etc.) |

> **Without `useSearchParams`:** Filter state would need to live in React state or a global store, meaning filter selections disappear on page refresh, lose URL shareability, and can't be deep-linked.

---

### 28. `cookies()` (next/headers)

| Where Used                               | Why                                                                                      |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| `app/(authGroup)/_actions/authAction.ts` | Sets `accessToken` and `refreshToken` HTTP-only cookies on login; deletes them on logout |
| `lib/api-client.ts`                      | Reads all cookies server-side and forwards them as `Cookie` header                       |
| `service/refreshToken.ts`                | Reads cookies to send refresh token to backend                                           |

```tsx
const cookieStore = await cookies();
cookieStore.set("accessToken", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 1 * 24 * 60 * 60,
});
```

> **Without `cookies()`:** You couldn't set secure HTTP-only cookies from the server. Authentication tokens would need to be stored in `localStorage` (XSS vulnerable) or managed entirely on the client (losing the security benefits of server-controlled sessions).

---

### 29. Cache Control (`cache`, `next.revalidate`, `next.tags`)

| Where Used            | Strategy                                                                        |
| --------------------- | ------------------------------------------------------------------------------- |
| `service/admin.ts`    | `cache: "no-store"`, `next: { revalidate: 0 }` — always fresh                   |
| `service/property.ts` | `next: { revalidate: 60 * 60 * 24, tags: ["properties"] }` — 24h cache with tag |
| `service/landlord.ts` | `next: { revalidate: 0 }` — always fresh for dashboard                          |
| `service/payment.ts`  | `next: { revalidate: 0 }` — always fresh                                        |
| `service/rental.ts`   | No caching — default behavior                                                   |

> **Without cache control:** All data would either be cached forever (stale data) or never cached (slow loads). You lose the ability to have "hot" dashboard data that's always fresh while catalog data is efficiently cached.

---

### 30. `revalidateTag` & `revalidatePath`

| Where Used                   | Why                                                                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `service/revalidateCache.ts` | Called after property create/update/delete to invalidate `"properties"` tag cache and revalidate `/` and `/properties` paths |

```tsx
revalidateTag("properties", { expire: 0 });
revalidatePath("/");
revalidatePath("/properties");
```

> **Without `revalidateTag`/`revalidatePath`:** After creating or deleting a property, the catalog page would show stale data until the 24-hour cache expires. Users would see their new property listed but it wouldn't appear on the homepage, or vice versa.

---

### 31. Next.js 16 Proxy (`proxy.ts`)

| Where Used | Why                                                                                                                                                                                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `proxy.ts` | Runs on every matched request: verifies JWTs, auto-refreshes expired access tokens using refresh tokens, redirects authenticated users away from auth routes, blocks unauthenticated users from protected routes, enforces role-based access control (TENANT/LANDLORD/ADMIN) |

Matcher config:

```tsx
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
};
```

> **Without the proxy:** All route protection would need to be duplicated in every page component. Token refresh would happen only after a 401 error (causing a flash of unauthorized content). Role-based routing would be inconsistent — a TENANT could access `/dashboard/admin` and only get an error on the page itself.

---

### 32. `Suspense`

| Where Used                          | Fallback                   | What It Wraps                                                |
| ----------------------------------- | -------------------------- | ------------------------------------------------------------ |
| `app/layout.tsx`                    | `<NavbarSkeleton />`       | `<SessionNavbar />` (async server component reading cookies) |
| `app/(authGroup)/login/page.tsx`    | Spinner                    | `<LoginForm />` (uses `useSearchParams`)                     |
| `app/(authGroup)/register/page.tsx` | Spinner                    | `<RegisterForm />` (uses `useSearchParams`)                  |
| `app/(publicGroup)/page.tsx`        | `<PropertyGridSkeleton />` | Categories + featured properties sections                    |
| `properties/page.tsx`               | `<Loader2>` spinner        | Filter sidebar (uses `useSearchParams`)                      |
| `properties/page.tsx`               | `null`                     | `<PaginationControls />` (uses `useSearchParams`)            |

> **Without `Suspense`:** Every component using `useSearchParams` would need to be wrapped in Suspense anyway (it's required). Without it, the app crashes with a build error. Additionally, you'd lose streaming — the navbar would block the entire page render while resolving cookies.

---

### 33. `notFound()` (next/navigation)

| Where Used                               | When                                             |
| ---------------------------------------- | ------------------------------------------------ |
| `properties/[id]/page.tsx`               | When `getPropertyById(id)` returns null          |
| `landlord/properties/[id]/edit/page.tsx` | When property not found or not owned by landlord |
| `tenant/requests/[id]/pay/page.tsx`      | When rental request not found                    |
| `tenant/reviews/page.tsx`                | When `propertyId` missing or property not found  |

> **Without `notFound()`:** You'd need to manually render a 404-like UI or return `null`, breaking the page layout and giving no indication to the user (or search engines) that the resource doesn't exist.

---

### 34. `redirect()` (next/navigation)

| Where Used                               | Condition                                                       |
| ---------------------------------------- | --------------------------------------------------------------- |
| `app/dashboard/admin/page.tsx`           | Redirects to `/login` if not authenticated, to `/` if not ADMIN |
| `app/dashboard/landlord/page.tsx`        | Same pattern for LANDLORD role                                  |
| `app/dashboard/tenant/page.tsx`          | Same pattern for TENANT role                                    |
| All admin sub-pages                      | Role + auth verification                                        |
| `landlord/properties/[id]/edit/page.tsx` | Redirects if not property owner                                 |

> **Without `redirect()`:** Every protected page would need to manually check auth, render a loading state, then call `router.push()`. Server-side redirect is instant and doesn't render any UI, while client-side redirect would flash the page content before redirecting.

---

### 35. Async Server Component `params` & `searchParams` (Next.js 16)

| Where Used                               | Pattern                                                                      |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| `properties/[id]/page.tsx`               | `params: Promise<{ id: string }>` → `const { id } = await params`            |
| `landlord/properties/[id]/edit/page.tsx` | Same async pattern                                                           |
| `tenant/requests/[id]/pay/page.tsx`      | Same async pattern                                                           |
| `properties/page.tsx`                    | `searchParams: Promise<{ searchTerm?: string; ... }>` → `await searchParams` |
| `tenant/reviews/page.tsx`                | `searchParams: Promise<{ propertyId?: string; ... }>`                        |

> **Without async params/searchParams (Next.js 16):** In Next.js 15+, params and searchParams are Promises. If you tried to access them synchronously (like in Next.js 14), you'd get `undefined` values and every dynamic page would fail to render.

---

### 36. `export const instant = false`

| Where Used                   | Why                                          |
| ---------------------------- | -------------------------------------------- |
| `app/layout.tsx`             | Disables instant navigation for root layout  |
| `app/(publicGroup)/page.tsx` | Disables instant navigation for landing page |
| `properties/page.tsx`        | Disables instant navigation for catalog      |

> **Without this export:** Next.js 16 would attempt instant client-side navigation, which can cause issues when the page depends on server-side cookies or async session data that isn't available yet during prerendering.

---

## 🌐 Browser APIs

### 37. `window.matchMedia`

| Where Used            | Why                                                         |
| --------------------- | ----------------------------------------------------------- |
| `hooks/use-mobile.ts` | Subscribes to viewport width changes below 768px breakpoint |

```tsx
const mql = window.matchMedia(MOBILE_BREAKPOINT);
mql.addEventListener("change", onChange);
```

> **Without `matchMedia`:** You'd need to listen to `window.resize` events (which fire dozens of times per second during resizing) and manually debounce. `matchMedia` fires only when the breakpoint is actually crossed, and it's significantly more performant.

---

### 38. `window.innerWidth`

| Where Used            | Why                                                        |
| --------------------- | ---------------------------------------------------------- |
| `hooks/use-mobile.ts` | Synchronous check: `window.innerWidth < MOBILE_BREAKPOINT` |

> **Without `innerWidth`:** No way to determine viewport width for conditional mobile/desktop rendering logic.

---

### 39. `URLSearchParams`

| Where Used                    | Why                                                      |
| ----------------------------- | -------------------------------------------------------- |
| `hero-search.tsx`             | Builds search URL: `params.set("searchTerm", ...)`       |
| `pagination-controls.tsx`     | Reads and extends existing params for page navigation    |
| `property-filter-sidebar.tsx` | Reads/deletes/sets/gets multiple params for filter state |
| `service/property.ts`         | Builds API query strings from filter objects             |
| `proxy.ts`                    | `request.nextUrl.searchParams` for reading query strings |

> **Without `URLSearchParams`:** You'd need to manually split/join/query strings, handle URL encoding, and manage duplicate keys — a common source of bugs and security issues.

---

### 40. `window.location.href`

| Where Used           | Why                                                                            |
| -------------------- | ------------------------------------------------------------------------------ |
| `CheckoutClient.tsx` | `window.location.href = response.data.checkoutUrl` — hard navigation to Stripe |

> **Without `window.location.href`:** `router.push()` wouldn't work for external URLs (Stripe checkout). You'd have no way to navigate to a different domain from a Next.js client component.

---

### 41. `window.history.back()`

| Where Used          | Why                                                            |
| ------------------- | -------------------------------------------------------------- |
| `app/not-found.tsx` | "Go back" button navigates to previous page in browser history |

```tsx
const handleGoBack = () => {
  if (typeof window !== "undefined") {
    window.history.back();
  }
};
```

> **Without `history.back()`:** The 404 page would have no way to return the user to where they were. The only option would be a hardcoded link, which might not be where the user actually came from.

---

### 42. `setTimeout` / `clearTimeout`

| Where Used                    | Why                                                               |
| ----------------------------- | ----------------------------------------------------------------- |
| `property-filter-sidebar.tsx` | Debounce mechanism — delays URL updates by 500ms while user types |

```tsx
timerRef.current = setTimeout(() => {
  router.push(`/properties?${params.toString()}`);
}, 500);
```

> **Without `setTimeout`:** Every keystroke in a filter input would immediately trigger a URL change and server fetch. Typing "New York" would fire 8 separate server requests instead of 1 after the user stops typing.

---

### 43. `confirm()` (Native Browser Dialog)

| Where Used                 | Why                                          |
| -------------------------- | -------------------------------------------- |
| `DeletePropertyButton.tsx` | Confirms property deletion before proceeding |
| `UsersManagementTable.tsx` | Confirms ban/unban action before proceeding  |

> **Without `confirm()`:** You'd need to build a custom confirmation modal for every destructive action — a significant amount of extra code and inconsistency across the app.

---

### 44. `fetch()` (Browser Fetch API)

| Where Used                | Why                                       |
| ------------------------- | ----------------------------------------- |
| `lib/api-client.ts`       | Centralized HTTP client for all API calls |
| `service/refreshToken.ts` | Direct fetch to `/api/auth/refresh-token` |

Options used: `credentials: "include"`, `headers`, `body`, `method`

> **Without `fetch`:** No way to communicate with the backend API. The entire data layer would collapse.

---

### 45. `new Headers()`

| Where Used          | Why                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `lib/api-client.ts` | Builds request headers: checks `Content-Type`, sets `Cookie`, handles `FormData` detection |

> **Without `new Headers()`:** Header manipulation would require manual string concatenation, which is error-prone and doesn't handle duplicate headers or case-insensitive lookup.

---

### 46. `new URL()`

| Where Used | Why                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `proxy.ts` | Constructs redirect URLs: `new URL("/login", request.url)`, `new URL("/not-found", request.url)` |

> **Without `new URL()`:** URL construction would require string concatenation, which breaks when the base URL has a path component or when the redirect path contains special characters.

---

### 47. `process.env`

| Where Used                               | Variables                                        |
| ---------------------------------------- | ------------------------------------------------ |
| `lib/api-client.ts`                      | `BACKEND_API_URL`, `NEXT_PUBLIC_BACKEND_API_URL` |
| `app/(authGroup)/_actions/authAction.ts` | `JWT_ACCESS_SECRET`, `NODE_ENV`                  |
| `proxy.ts`                               | `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`        |
| `lib/auth-session.ts`                    | `JWT_ACCESS_SECRET`                              |
| `service/refreshToken.ts`                | `NODE_ENV`                                       |

> **Without `process.env`:** Database URLs, API secrets, and backend URLs would need to be hardcoded — a massive security risk and maintenance nightmare.

---

### 48. `typeof window !== "undefined"`

| Where Used          | Why                                                              |
| ------------------- | ---------------------------------------------------------------- |
| `lib/api-client.ts` | Guards server-side `cookies()` import to avoid browser execution |
| `app/not-found.tsx` | Guards `window.history.back()` to avoid SSR crash                |

```tsx
if (typeof window === "undefined") {
  const { cookies } = await import("next/headers");
  // ...
}
```

> **Without this check:** Server code would try to access `window` (crashing in Node.js), and browser code would try to import `next/headers` (crashing in the browser).

---

## 🟨 JavaScript / TypeScript Language Features

### 49. `async/await`

| Where Used                                                          | Frequency                  |
| ------------------------------------------------------------------- | -------------------------- |
| Every server component, every service function, every event handler | Throughout entire codebase |

> **Without `async/await`:** Every asynchronous operation would require `.then()/.catch()` chains, making the code deeply nested and extremely hard to read. Error handling would be particularly painful.

---

### 50. `try/catch/finally`

| Where Used                    | Why                                             |
| ----------------------------- | ----------------------------------------------- |
| Every form submission handler | Catches errors and displays toast notifications |
| Every server component        | Catches API failures gracefully                 |
| `lib/api-client.ts`           | Catches JSON parse failures                     |
| `utils/jwt.ts`                | Catches JWT verification failures               |
| `lib/auth-session.ts`         | Catches cookie read failures                    |

> **Without `try/catch`:** Any API error, network failure, or unexpected data would crash the entire page with an unhandled promise rejection. Users would see blank screens instead of error messages.

---

### 51. `Promise.all()`

| Where Used                                         | What It Parallelizes                                       |
| -------------------------------------------------- | ---------------------------------------------------------- |
| `properties/page.tsx`                              | `getCategories()` + `getProperties()`                      |
| `properties/[id]/page.tsx`                         | `getPropertyById(id)` + `getServerSession()`               |
| `dashboard/admin/page.tsx`                         | `getAllUsers()` + `getAllProperties()` + `getAllRentals()` |
| `dashboard/landlord/page.tsx`                      | `getLandlordProperties()` + `getLandlordRentalRequests()`  |
| `dashboard/landlord/properties/[id]/edit/page.tsx` | `getPropertyById(id)` + `getCategories()`                  |
| `dashboard/tenant/page.tsx`                        | `getRentalRequests()` + `getPayments()`                    |

> **Without `Promise.all()`:** Each API call would wait for the previous one to finish. The admin dashboard (3 calls) would take 3x longer. The tenant dashboard (2 calls + N property hydrations) could take many seconds.

---

### 52. `Promise.all()` with `map()` — Data Hydration Pattern

| Where Used                  | Why                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `dashboard/tenant/page.tsx` | Fetches property details for each rental request that lacks embedded property data |

```tsx
const requests: TRentalRequest[] = await Promise.all(
  rawRequests.map(async (req) => {
    if (req.property) return req;
    const propRes = await getPropertyById(req.propertyId);
    return { ...req, property: propRes.data || undefined };
  }),
);
```

> **Without this pattern:** Each property would need to be fetched sequentially, or the tenant dashboard would show "Property ID: abc123..." instead of actual property names and locations.

---

### 53. `Array.reduce()`

| Where Used                  | Why                                                                  |
| --------------------------- | -------------------------------------------------------------------- |
| `dashboard/tenant/page.tsx` | Computes total amount paid: `.reduce((sum, p) => sum + p.amount, 0)` |

> **Without `reduce()`:** You'd need a manual loop with an accumulator variable — more verbose and error-prone for what should be a one-liner.

---

### 54. `Array.filter()` + `Array.map()`

| Where Used                    | Why                                                       |
| ----------------------------- | --------------------------------------------------------- |
| All dashboard pages           | `.filter(u => u.role === "TENANT")` for role-based counts |
| `properties/page.tsx`         | `.map()` to render property cards                         |
| `property-filter-sidebar.tsx` | `.filter()` for amenities toggle                          |
| `UsersManagementTable.tsx`    | `.filter()` for client-side search                        |

> **Without `filter()`/`map()`:** Manual for-loops with conditional pushing — more verbose, harder to read, and more likely to introduce bugs.

---

### 55. `Array.from({ length: N })`

| Where Used           | Why                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------- |
| `page-skeletons.tsx` | Generates placeholder skeleton arrays: `Array.from({ length: 6 }).map((_, i) => ...)` |

> **Without `Array.from`:** You'd need to manually create `[1,2,3,4,5,6]` or use other workarounds, which are less flexible when the count changes.

---

### 56. Spread Operator (`...`)

| Where Used                                                                                      | Why                                             |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| State updates: `setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u))` | Creates immutable copies without mutating state |
| API options: `apiGet(url, { ...options, method: "GET" })`                                       | Extends default config                          |
| Object destructuring spread in `RequestRentalModal.tsx`                                         | Merges property data                            |

> **Without spread:** You'd need `Object.assign()` or manual property copying, which is more verbose and doesn't handle nested objects.

---

### 57. Optional Chaining (`?.`)

| Where Used                 | Frequency                                                                      |
| -------------------------- | ------------------------------------------------------------------------------ |
| Throughout entire codebase | `property?.title`, `session?.user`, `response?.data`, `decodedAccess?.success` |

> **Without `?.`:** Every potentially-undefined property access would need verbose `&&` checks: `property && property.title`. Deep nesting like `request?.tenant?.name` would become unreadable.

---

### 58. Nullish Coalescing (`??`)

| Where Used            | Why                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------- |
| `properties/page.tsx` | `resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1` (implied via `??`) |
| Throughout            | `session.user.name ?? "User"`, `property.images ?? []`                                 |

> **Without `??`:** Using `\|\|` would treat `0`, `""`, and `false` as falsy, potentially overriding legitimate values with defaults. `??` only falls back on `null` or `undefined`, so a page number of `0` or an empty (but valid) array stays intact.

---

### 59. `instanceof` Type Guard

| Where Used       | Why                                                   |
| ---------------- | ----------------------------------------------------- |
| All catch blocks | `error instanceof Error ? error.message : "Fallback"` |

> **Without `instanceof`:** You couldn't safely access `.message` on caught errors. Using `any` would be unsafe, and TypeScript wouldn't narrow the type.

---

### 60. TypeScript Generics (`<T>`)

| Where Used          | Why                                                                            |
| ------------------- | ------------------------------------------------------------------------------ |
| `lib/api-client.ts` | `apiFetch<T>()`, `apiGet<T>()`, `apiPost<T>()` — every API function is generic |
| `lib/types.ts`      | `TApiResponse<T>`, `TActionResponse<T>`                                        |

```tsx
export async function apiGet<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<TApiResponse<T>>;
```

> **Without generics:** You'd need separate function implementations for every data type (`getUsers()`, `getProperties()`, `getRentals()`, etc.) or use `any` everywhere, losing all type safety.

---

### 61. TypeScript `Record<K, V>`

| Where Used            | Why                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `lib/badge-styles.ts` | Maps enum values to CSS classes: `Record<PropertyAvailability, Record<Variant, string>>` |

> **Without `Record`:** You'd use plain objects without type checking, allowing typos in keys and missing enum cases to go undetected.

---

### 62. TypeScript `Partial<T>`

| Where Used         | Why                                                             |
| ------------------ | --------------------------------------------------------------- |
| `lib/types.ts`     | `tenant?: Partial<TUser>` — API returns user without all fields |
| `service/admin.ts` | `TApiResponse<Partial<TAdminUser>>` — update response           |

> **Without `Partial`:** You'd need separate types for "full user" and "partial user," or use `any` for API responses that don't include all fields.

---

### 63. TypeScript `unknown` Error Type

| Where Used       | Why                                                      |
| ---------------- | -------------------------------------------------------- |
| All catch blocks | `catch (error: unknown)` instead of `catch (error: any)` |

> **Without `unknown`:** Using `any` would allow unsafe property access on errors without type checking. `unknown` forces you to narrow the type first (via `instanceof`), preventing runtime crashes.

---

### 64. Template Literals

| Where Used                                                            | Why                          |
| --------------------------------------------------------------------- | ---------------------------- |
| URL building: `` `/properties/${id}` ``                               | Dynamic route construction   |
| CSS classes: `` `bg-${color}-500/10` ``                               | Conditional Tailwind classes |
| Error messages: `` `Request failed with status ${response.status}` `` | Dynamic strings              |

> **Without template literals:** String concatenation with `+` operators — harder to read, easier to miss spaces, and more error-prone with mixed types.

---

### 65. Destructuring

| Where Used | Frequency                                                                     |
| ---------- | ----------------------------------------------------------------------------- |
| Every file | Object: `const { id } = await params`, `const { title, location } = property` |
|            | Array: `const [email, setEmail] = useState("")`                               |
|            | Function params: `function Error({ error, reset })`                           |

> **Without destructuring:** Every property access would need `params.id`, `state[0]`, etc. — much more verbose and harder to scan quickly.

---

### 66. Ternary Operator

| Where Used     | Frequency                                                                     |
| -------------- | ----------------------------------------------------------------------------- |
| Throughout JSX | `isLoading ? <Loader /> : <Submit />`, `user ? <UserNav /> : <AuthButtons />` |

> **Without ternary:** Every conditional render would need an `if/else` block outside JSX, making components much longer and harder to reason about.

---

### 67. Short-Circuit Evaluation (`&&`)

| Where Used                                           | Why                                               |
| ---------------------------------------------------- | ------------------------------------------------- |
| Conditional rendering: `{isOwner && <EditButton />}` | Only renders when condition is truthy             |
|                                                      | `{pendingRequests > 0 && <Badge>{count}</Badge>}` |

> **Without `&&`:** Every conditional render would need a full ternary with `null` as the falsy branch: `{condition ? <Component /> : null}`.

---

### 68. `ReadableStream` / Streaming SSR (via Suspense)

| Where Used                   | Why                                             |
| ---------------------------- | ----------------------------------------------- |
| Root layout with `Suspense`  | Navbar streams in independently of main content |
| Landing page with `Suspense` | Property grid streams in after hero section     |

> **Without streaming:** The entire page would block until all data is fetched. A slow API call would delay the entire page, even parts that don't depend on that data.

---

## 🔌 Third-Party Library Integration

### 69. `jwt.verify()` & `jwt.decode()` (jsonwebtoken)

| Where Used                               | Why                                                                           |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| `utils/jwt.ts`                           | `jwtUtils.verifyToken()` — verifies JWT integrity + expiry                    |
| `lib/auth-session.ts`                    | `jwt.verify()` — decodes session from access token                            |
| `app/(authGroup)/_actions/authAction.ts` | `jwt.verify()` with `jwt.decode()` fallback — extracts user role for redirect |
| `proxy.ts`                               | Via `jwtUtils.verifyToken()` — verifies both access and refresh tokens        |

> **Without `jsonwebtoken`:** Server-side JWT verification would need a custom implementation or a different library. Without JWT auth entirely, there would be no way to identify or authorize users.

---

### 70. `toast()` (sonner)

| Where Used               | Why                                                            |
| ------------------------ | -------------------------------------------------------------- |
| Every form component     | Success: `toast.success("Property created!")`                  |
| Every error handler      | Error: `toast.error(err.message)`                              |
| `RequestRentalModal.tsx` | With description: `toast.success(msg, { description: "..." })` |

> **Without `toast`:** User feedback would need custom alert components, state management for show/hide, and manual timeout logic. There would be no way to communicate success/failure without blocking the UI with `alert()`.

---

### 71. `cn()` Utility (clsx + tailwind-merge)

| Where Used                   | Why                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| `navbar.tsx`                 | `cn("transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")` |
| `property-image-gallery.tsx` | `cn("border-2 ...", selected ? "border-primary" : "border-transparent")`                          |
| `app/layout.tsx`             | `cn("h-full antialiased", "font-sans", inter.variable)`                                           |

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

> **Without `cn()`:** Conflicting Tailwind classes (e.g., `bg-red-500 bg-blue-500`) would break styles because Tailwind doesn't know which to apply. `tailwind-merge` intelligently resolves conflicts. Without `clsx`, conditional class joining would require manual array joining with spaces.

---

### 72. `class-variance-authority` (CVA)

| Where Used                                                      | Why                                                                                                                  |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| All UI components (`button.tsx`, `badge.tsx`, `card.tsx`, etc.) | Defines variant-based styling: `variant: "default" \| "destructive" \| "outline"`, `size: "default" \| "sm" \| "lg"` |

> **Without CVA:** Every component variant would need manual `if/else` class concatenation. Adding a new variant would require editing the component internals instead of just passing a prop.

---

## Summary Statistics

| Category                  | Count  |
| ------------------------- | ------ |
| React Hooks Used          | 6      |
| React Concepts/Keywords   | 5      |
| Next.js Features          | 24     |
| Browser APIs              | 12     |
| JS/TS Language Features   | 20     |
| Third-Party Integrations  | 4      |
| **Total Unique Features** | **72** |

---

_Generated by analyzing 64 source files across `app/`, `components/`, `hooks/`, `lib/`, `service/`, `utils/`, and `proxy.ts`._
