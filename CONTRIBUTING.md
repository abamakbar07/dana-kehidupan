# Contributing

## Workflow

- Use Conventional Commits (`feat:`, `fix:`, `chore:` ...)
- Open a PR to `main`. Ensure CI passes (typecheck, lint, test, build)
- Keep PRs scoped and well-described

## Setup

- `pnpm i` then `pnpm db:push` and `pnpm db:seed`
- Run dev: `pnpm dev`

## Code Style

- TypeScript strict mode
- Small, composable modules
- Server actions co-located with route folders
- Zod validation on all inputs

## Tests

- Unit tests with Vitest for utilities
- Component tests with @testing-library/react
- E2E with Playwright (auth flow, import wizard, create transaction, budget set)
