# 🏠 RentNest — Rental Property Marketplace (Frontend)

RentNest is a full-featured rental property marketplace frontend built with **Next.js 16** (App Router), **React 19**, and **Tailwind CSS v4**. It connects **tenants**, **landlords**, and **admins** through role-based dashboards — from browsing listings and submitting rental requests to Stripe payments, reviews, and platform moderation.

> 🔗 Designed to pair with the RentNest Node/Express + Prisma REST API (cookie-based JWT sessions).

## ✨ Features

- **Public marketplace** — landing page, category browsing, multi-criteria property search (price, bedrooms, location, amenities) with pagination
- **Authentication** — register as Tenant or Landlord, HTTP-only JWT cookie sessions with silent token refresh
- **Tenant dashboard** — rental request tracking, approved-request checkout via Stripe, payment history, and post-stay reviews
- **Landlord dashboard** — property listing CRUD, incoming request approve/reject, occupancy metrics
- **Admin console** — platform statistics, global property/request oversight, user ban/unban moderation
- **Route protection** — Next.js 16 `proxy.ts` middleware with role-based guards and automatic access-token renewal
- **Modern UX** — dark/light theme, toast notifications, instant skeleton loading states on navigation, fully responsive

## 🛠️ Tech Stack

| Layer      | Technology                                                                                   |
| :--------- | :------------------------------------------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router, Server Components & Actions, Proxy Middleware) |
| UI         | React 19, Tailwind CSS v4, shadcn/ui, Radix UI, lucide-react, Sonner                         |
| State/Auth | HTTP-only cookie JWT sessions (`jsonwebtoken`), Server Actions                               |
| Payments   | Stripe Checkout (backend-driven sessions)                                                    |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- A running instance of the RentNest backend API

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env` file (see [.env.example](.env.example)):

```env
# Server-side only
BACKEND_API_URL=http://localhost:5000
JWT_ACCESS_SECRET=access-secret      # must match backend
JWT_REFRESH_SECRET=refresh-secret    # must match backend

# Client + server
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000
```

### 3. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

| Command      | Description              |
| :----------- | :----------------------- |
| `pnpm dev`   | Start development server |
| `pnpm build` | Production build         |
| `pnpm start` | Serve production build   |
| `pnpm lint`  | Run ESLint               |

## 🔐 Role-Based Access

| Role     | Routes                                 | Capabilities                                     |
| :------- | :------------------------------------- | :----------------------------------------------- |
| Guest    | `/`, `/properties`, `/properties/[id]` | Browse, search, view listings                    |
| TENANT   | `/dashboard/tenant/*`                  | Request rentals, pay via Stripe, review stays    |
| LANDLORD | `/dashboard/landlord/*`                | Manage listings, approve/reject requests         |
| ADMIN    | `/dashboard/admin/*`                   | Platform stats, user ban/unban, global oversight |

Unauthenticated visits to protected routes redirect to `/login?redirectTo=...`; wrong-role visits are blocked by the proxy middleware.

## 📁 Project Structure (key paths)

```text
app/
├── (authGroup)/          # /login, /register + auth server actions
├── (publicGroup)/        # Landing page, property catalog & details
├── dashboard/
│   ├── tenant/           # Requests, payments, reviews
│   ├── landlord/         # Listings CRUD, incoming requests
│   └── admin/            # Stats, users, properties, rentals oversight
└── payment/              # Stripe success/cancel callbacks
components/
├── shared/               # Navbar, footer, filters, skeletons
├── tenantRelated/        # Rental modal, checkout, review form
├── landlordRelated/      # Property form, request table, delete button
├── adminRelated/         # User ban/unban management table
└── ui/                   # shadcn/ui primitives
service/                  # Typed fetch layer per domain (auth, property, …)
lib/                      # api-client, session utils, types
proxy.ts                  # Route guards + silent JWT refresh
```

See [`API_INTEGRATION.md`](API_INTEGRATION.md) for the full endpoint ↔ component mapping.

## ☁️ Deployment (Vercel)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Add environment variables: `BACKEND_API_URL`, `NEXT_PUBLIC_BACKEND_API_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (production backend values).
3. Deploy, then set your backend's `APP_URL` / CORS origin to the deployed frontend domain so cookies and Stripe redirects work cross-domain.

---
