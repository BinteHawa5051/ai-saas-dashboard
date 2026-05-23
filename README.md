# NeuralDesk — AI SaaS Dashboard

A production-style AI SaaS admin dashboard built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Recharts, TanStack Query, and Zustand.

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

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — providers, fonts, metadata
│   ├── page.tsx                # Redirects / → /overview
│   ├── globals.css             # CSS variables (light/dark), Tailwind base
│   └── (dashboard)/            # Route group — all dashboard pages
│       ├── layout.tsx          # Sidebar + Navbar shell
│       ├── overview/           # Main dashboard with stats, charts, activity
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
│   ├── mock/                   # Static mock data (4 files)
│   ├── store/                  # Zustand global store
│   ├── chart-utils.ts          # CSS variable → chart color helpers
│   ├── constants.ts            # App name, nav items, current user
│   └── utils.ts                # cn() helper
├── providers/                  # QueryProvider, ThemeProvider
└── types/                      # TypeScript interfaces (4 domain files)
```

---

## Key features

| Feature | Details |
|---|---|
| **6 dashboard pages** | Overview, Analytics, Models, Users, Billing, Settings |
| **Dark mode** | next-themes, system/light/dark |
| **Charts** | Recharts — area, line, bar, donut; all theme-aware |
| **Date range filter** | 7d / 30d / 90d / 1y — wired to Analytics and Overview charts |
| **Users table** | Search, filter by plan/status, sort, paginate, bulk select |
| **Models catalog** | Card grid with detail dialog |
| **Billing** | Plan comparison, usage progress, invoice history |
| **Settings** | Profile form, API key management, notifications, appearance |
| **Mock API** | Registry pattern — swap `registerEndpoint` handlers for real fetch calls |

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

Or replace `apiClient.get()` calls in the hooks directly with your preferred HTTP client.

---

## Simulating API errors (dev only)

To test error UI, open the browser console and run:

```js
// 30% random failure rate
import { apiClient } from "@/lib/api/client";
apiClient.setErrorRate(0.3);
```

---

## Notes

- **No authentication** — all routes are open. Add middleware or an auth provider before deploying.
- **External images** — avatars (DiceBear) and thumbnails (Unsplash) require network access. Offline = broken images.
- **Python venv/** — if present in the project root, it is unrelated to the Next.js app and can be ignored or deleted.
