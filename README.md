# NeuralDesk — AI SaaS Dashboard

A production-style AI SaaS admin dashboard built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Recharts, TanStack Query, and Zustand.

🚀 **Live Demo:** [https://ai-saas-dashboard-phi.vercel.app](https://ai-saas-dashboard-phi.vercel.app)

---

## Screenshots

| Overview | Analytics |
|---|---|
| Stats, revenue chart, usage donut, activity feed | Usage trends + model performance charts |

| Users | Settings |
|---|---|
| Search, filter, sort, paginate, bulk select | Profile, API keys, notifications, appearance |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **If you hit a stale cache or port conflict**, use the fresh start script:
> ```bash
> npm run dev:fresh
> ```
> This deletes `.next/` before starting, clearing any stale build artifacts.

### Build for production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + tw-animate-css |
| UI Components | shadcn/ui + Radix primitives |
| Icons | Lucide React |
| Charts | Recharts 3 |
| Data Fetching | TanStack React Query v5 |
| Global State | Zustand v5 |
| Forms | React Hook Form + Zod |
| Theming | next-themes (light / dark / system) |
| Date Utilities | date-fns v4 |
| Deployment | Vercel |

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — providers, fonts, metadata
│   ├── page.tsx                # Redirects / → /overview
│   ├── globals.css             # CSS variables (light/dark), Tailwind base
│   └── (dashboard)/            # Route group — all dashboard pages
│       ├── layout.tsx          # Sidebar + Navbar shell
│       ├── loading.tsx         # Route-level loading skeleton
│       ├── error.tsx           # Route-level error boundary
│       ├── overview/           # Main dashboard: stats, charts, activity
│       ├── analytics/          # Usage trends + model performance charts
│       ├── models/             # AI model catalog with detail dialog
│       ├── users/              # User management table
│       ├── billing/            # Plan info, comparison, invoice history
│       └── settings/           # Profile, API keys, notifications, appearance
├── components/
│   ├── layout/                 # Sidebar, Navbar, ThemeToggle
│   ├── dashboard/              # Feature charts and tables
│   └── ui/                     # shadcn/ui primitives + ChartErrorBoundary
├── lib/
│   ├── api/                    # Mock API client + domain modules
│   ├── hooks/                  # React Query hooks per domain
│   ├── mock/                   # Static mock data (4 files, 365 days)
│   ├── store/                  # Zustand global store
│   ├── chart-utils.ts          # CSS variable → chart color helpers
│   ├── constants.ts            # App name, nav items, current user
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
├── providers/                  # QueryProvider, ThemeProvider
└── types/                      # TypeScript interfaces (4 domain files)
```

---

## Features

| Feature | Details |
|---|---|
| **6 dashboard pages** | Overview, Analytics, Models, Users, Billing, Settings |
| **Dark / light mode** | next-themes with system preference support |
| **Charts** | Area, line, bar, donut — all theme-aware via CSS variables |
| **Date range filter** | 7d / 30d / 90d / 1y — wired to Analytics charts |
| **Users table** | Search, filter by plan/status, sort all columns, paginate, bulk select |
| **Models catalog** | Responsive card grid with detail dialog |
| **Billing** | Plan comparison, API usage progress bar, invoice history |
| **Settings** | Profile form with avatar upload, API key management, notification toggles, density preview |
| **Error handling** | ChartErrorBoundary on every chart + route-level error.tsx |
| **Loading states** | Skeleton fallbacks per component + route-level loading.tsx |
| **Mock API** | Registry pattern — swap handlers for real fetch calls with no other changes |

---

## Swapping mock data for a real API

Each domain module in `src/lib/api/` registers mock handlers:

```ts
// src/lib/api/users.ts
registerEndpoint("/users", () => MOCK_USERS);
```

Replace the handler with a real fetch:

```ts
registerEndpoint("/users", () =>
  fetch("/api/users").then((r) => r.json())
);
```

---

## Simulating API errors (dev only)

To test error UI, open the browser console and run:

```js
import { apiClient } from "@/lib/api/client";
apiClient.setErrorRate(0.3); // 30% random failure rate
```

---

## Deployment

This project is deployed on **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BinteHawa5051/ai-saas-dashboard)

To deploy your own copy:
1. Fork this repo
2. Go to [vercel.com](https://vercel.com) and import the fork
3. No environment variables required — click Deploy

---

## Notes

- **No authentication** — all routes are open. Add middleware or an auth provider before using in production.
- **External images** — avatars (DiceBear) and thumbnails (Unsplash) require network access.
- **Mock data only** — no real backend or database is connected.
