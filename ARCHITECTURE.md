# Architecture Overview

- App: Next.js 15 with App Router and React Server Components, using server actions for CRUD and mirrored REST routes under `/api/*`.
- Auth: NextAuth with Credentials and Email OTP (JSON transport dev-only), Prisma adapter.
- DB: PostgreSQL via Prisma. Strong relational model with unique indexes and soft-delete-ready fields.
- Background Jobs: BullMQ workers (`apps/worker`) for recurring rules, FX refresh, and budget rollover.
- Caching: Redis ready (used by BullMQ, future caching hooks via Upstash-compatible interface).
- Storage: Local adapter writes to `apps/web/public/uploads` in dev; interface ready for S3/GCS.
- UI: TailwindCSS with shared UI primitives in `packages/ui` (shadcn-like patterns).
- Testing: Vitest for unit/component, Playwright for e2e.

## Module Boundaries

- `apps/web/lib/*` – adapters, providers, utilities.
- `apps/web/app/*` – routes, server actions co-located, and API routes under `/api`.
- `packages/ui` – framework-agnostic React components.
- `apps/worker` – queues, processors, schedule setup.

## Data Flow

- Client submits forms to server actions (RSC) -> Zod validation -> Prisma -> revalidate path.
- REST API mirrors actions for programmatic access.
- Worker jobs periodically create/update rows via Prisma.

## Extensibility

- `FxRateProvider` and `StorageAdapter` interfaces support swapping implementations.
- Feature flags can be introduced via env or JSON config.
- Add bank integrations under `SyncConnection` and `Institution`.
