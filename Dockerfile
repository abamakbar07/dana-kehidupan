# Multi-stage Dockerfile for apps/web
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/web/package.json ./apps/web/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN pnpm install --frozen-lockfile || pnpm install

FROM deps AS build
COPY . .
RUN pnpm --filter @dana/web build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/apps/web/.next ./apps/web/.next
COPY --from=build /app/apps/web/public ./apps/web/public
COPY apps/web/package.json apps/web/next.config.mjs ./apps/web/
COPY node_modules ./node_modules
EXPOSE 3000
CMD ["pnpm","--filter","@dana/web","start"]

