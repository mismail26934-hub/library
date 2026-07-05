# Booky — Library Web App

A responsive library web application where users can log in, browse books, borrow them
(with optimistic UI), write reviews, and track their loan history.

## Tech Stack

- **React 18 + TypeScript** — UI + type safety
- **Vite** — build tool / dev server
- **Tailwind CSS v4** — styling
- **shadcn-style UI components** — consistent, accessible primitives (hand-built)
- **Redux Toolkit** — auth token/user, UI filters, and cart state
- **TanStack Query** — data fetching, caching, and **optimistic updates**
- **React Hook Form + Zod** — forms & validation
- **Framer Motion** — subtle animations
- **sonner** — toast notifications
- **date-fns** — date formatting

## Features

| Page | Features |
| --- | --- |
| Login / Register | Auth forms, token persistence |
| Home | Hero + recommended books |
| Book List | Category filter, rating filter, debounced search, pagination |
| Book Detail | Stock, reviews, **optimistic borrow**, add-to-cart |
| My Loans | Tabs (All/Active/Returned/Overdue), return action |
| Cart | Multi-borrow checkout with per-book duration |
| Profile | User info, loan statistics, profile update |

### Optimistic UI

Borrowing a book instantly decrements `availableCopies` in the cache
(`src/features/loans/useLoans.ts`) and rolls back on error. Deleting a review
optimistically removes it from the list too.

## State Management

- `authSlice` — token + user (persisted to `localStorage`)
- `uiSlice` — search / category / rating filters
- `cartSlice` — local cart of books to borrow together
- TanStack Query — all server state (books, detail, loans, reviews, profile)

## Getting Started

```bash
npm install
npm run dev
```

The app expects the API base URL in `.env`:

```
VITE_API_URL=https://library-backend-production-b9cf.up.railway.app/api
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

The included `vercel.json` rewrites all routes to `index.html` for SPA routing.
Set `VITE_API_URL` as an environment variable in your Vercel project.

## Project Structure

```
src/
  app/          # redux store, hooks, query client
  components/   # shared components + ui/ primitives
  features/     # auth, books, loans, reviews, profile, cart (slices + hooks)
  lib/          # axios, api layer, utils, query keys
  pages/        # route pages
  store/        # uiSlice
  types/        # shared TypeScript types
```
