# Dana Kehidupan – Personal Finance App (Monorepo)

Production-grade scaffold using Next.js 15 (App Router), Prisma, PostgreSQL, Redis, BullMQ, NextAuth, Tailwind/shadcn-like UI, Vitest, and Playwright.

## Quick Start

- Copy `.env.example` to `.env` and adjust if needed
- Install deps: `pnpm i`
- Provision DB: `pnpm db:migrate` (or `pnpm db:push` for dev)
- Seed demo data: `pnpm db:seed`
- Dev servers: `pnpm dev`
  - Web on http://localhost:3000
  - Worker: `pnpm worker` (optional)

Demo credentials printed by seed (defaults):
- Email: demo@example.com
- Password: demo1234

## Monorepo Layout

- `apps/web` – Next.js app (App Router, server actions, REST routes)
- `apps/worker` – BullMQ worker (recurring rules, FX refresh, budget rollover)
- `packages/ui` – Shared UI components (shadcn-like primitives)
- `packages/config` – Shared ESLint/Prettier/TS config
- `prisma` – Prisma schema and seed script

## Scripts

- `pnpm dev` – Run web dev server
- `pnpm build` – Build all
- `pnpm test` – Vitest unit/component tests
- `pnpm e2e` – Playwright tests (web must be running)
- `pnpm db:push` / `pnpm db:migrate` – Prisma db sync
- `pnpm db:seed` – Seed demo data
- `pnpm worker` – Start BullMQ worker

## Features (MVP)

- Accounts & Transactions with CSV import (basic mapping)
- Budgets with planned vs actual for current month
- Reports dashboard (category breakdown)
- Auth via NextAuth (Credentials + Email OTP with JSON transport)
- PWA manifest and service worker (basic offline shell)
- Security headers via `next-safe-middleware`

See `ARCHITECTURE.md`, `SECURITY.md`, and `CONTRIBUTING.md` for details.
