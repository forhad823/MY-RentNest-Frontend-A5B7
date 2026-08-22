# 🔌 RentNest Frontend — API Integration Map

At-a-glance reference of every backend endpoint consumed by this frontend, and the exact component/page that calls it.

> **Base URL**: `BACKEND_API_URL` / `NEXT_PUBLIC_BACKEND_API_URL` (default `http://localhost:5000`)
> **All requests** flow through the unified wrapper in [`lib/api-client.ts`](lib/api-client.ts) (`apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`) with automatic HTTP-only cookie propagation (`accessToken` / `refreshToken`).
> **Response envelope**: every endpoint returns `{ success, statusCode, message, data, meta? }`.

---

## 1. Authentication — `service/auth.ts`

Driven by Server Actions in `app/(authGroup)/_actions/authAction.ts`.

| Endpoint | Method | Service Function | Consumed By |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | `registerUser()` → `registerAction` | `RegisterForm.tsx` (`/register`) |
| `/api/auth/login` | POST | `loginUser()` → `loginAction` (sets session cookies + role redirect) | `LoginForm.tsx` (`/login`) |
| `/api/auth/refresh-token` | POST | `getNewAccessToken()` ([`service/refreshToken.ts`](service/refreshToken.ts)) | `proxy.ts` (silent JWT auto-refresh on navigation) |
| `/api/auth/me` | GET | `getCurrentUser()` → `getCurrentUserAction` | Profile verification hook |
| *(logout)* | — | `logoutAction` (clears cookies server-side) | `user-nav.tsx` dropdown |

---

## 2. Public Catalog (No Auth) — `service/property.ts`

| Endpoint | Method | Service Function | Consumed By |
| :--- | :--- | :--- | :--- |
| `/api/categories` | GET | `getCategories()` | Landing page hero/categories grid, `/properties` filter sidebar, Property form category select |
| `/api/properties` | GET | `getProperties(filters)` — supports `searchTerm`, `location`, `categoryId`, `minPrice`, `maxPrice`, `bedroomCount`, `bathroomCount`, `amenities`, `page`, `limit`, `sortBy`, `sortOrder` | Landing page featured section, `/properties` catalog with pagination (`meta`) |
| `/api/properties/:id` | GET | `getPropertyById(id)` | `/properties/[id]` detail page, tenant dashboard titles, pay page summary, reviews page, property edit prefill |

---

## 3. Tenant — Rentals & Reviews

| Endpoint | Method | Service Function | Consumed By |
| :--- | :--- | :--- | :--- |
| `/api/rentals` | POST | `submitRentalRequest()` → `submitRentalRequestAction` | `RequestRentalModal.tsx` on property detail page |
| `/api/rentals` | GET | `getRentalRequests()` | `/dashboard/tenant` request history table |
| `/api/rentals/:id` | GET | `getRentalRequestById()` | `/dashboard/tenant/requests/[id]/pay` checkout verification |
| `/api/reviews` | POST | `submitReview()` | `ReviewForm.tsx` on `/dashboard/tenant/reviews` |

## 4. Payments (Stripe) — `service/payment.ts`

| Endpoint | Method | Service Function | Consumed By |
| :--- | :--- | :--- | :--- |
| `/api/payments/create` | POST | `createCheckoutSession({ rentalRequestId })` → returns `checkoutUrl` | `CheckoutClient.tsx` (redirects to Stripe Checkout) |
| `/api/payments` | GET | `getPayments()` | `/dashboard/tenant` payment history tab |
| `/api/payments/:id` | GET | `getPaymentById()` | Payment detail lookups |

---

## 5. Landlord — Listings & Incoming Requests — `service/landlord.ts`

| Endpoint | Method | Service Function | Consumed By |
| :--- | :--- | :--- | :--- |
| `/api/landlord/properties` | GET | `getLandlordProperties()` | `/dashboard/landlord` overview table + metrics |
| `/api/landlord/properties` | POST | `createProperty()` | `PropertyForm.tsx` (`/dashboard/landlord/properties/new`) |
| `/api/landlord/properties/:id` | PUT | `updateProperty()` | `PropertyForm.tsx` (`/dashboard/landlord/properties/[id]/edit`) |
| `/api/landlord/properties/:id` | DELETE | `deleteProperty()` | `DeletePropertyButton.tsx` (with confirm dialog) |
| `/api/landlord/requests` | GET | `getLandlordRentalRequests()` | `/dashboard/landlord/requests` incoming table |
| `/api/landlord/requests/:id` | PATCH | `updateRentalRequestStatus({ status })` | `RequestsClientTable.tsx` — Approve / Reject buttons |

---

## 6. Admin Moderation — `service/admin.ts`

| Endpoint | Method | Service Function | Consumed By |
| :--- | :--- | :--- | :--- |
| `/api/admin/users` | GET | `getAllUsers()` | `/dashboard/admin` stats + user moderation table, `/dashboard/admin/users` |
| `/api/admin/users/:id` | PATCH | `updateUserStatus({ activeStatus })` | `UsersManagementTable.tsx` — Ban / Unban toggle |
| `/api/admin/properties` | GET | `getAllProperties()` | `/dashboard/admin` listing metrics, `/dashboard/admin/properties` oversight table |
| `/api/admin/rentals` | GET | `getAllRentals()` | `/dashboard/admin` request metrics, `/dashboard/admin/rentals` audit table |

---

## 7. Session & Route Protection (no direct endpoint call)

- [`proxy.ts`](proxy.ts) — verifies JWT cookies on every matched route, silently refreshes expired access tokens, and guards role prefixes: `/dashboard/tenant` (TENANT), `/dashboard/landlord` (LANDLORD), `/dashboard/admin` (ADMIN).
- [`lib/auth-session.ts`](lib/auth-session.ts) — server-side cookie decoding for `getServerSession()` used by all dashboard pages.
