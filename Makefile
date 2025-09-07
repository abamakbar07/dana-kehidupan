PNPM=pnpm

.PHONY: dev build test e2e lint db-push db-migrate db-seed worker docker-up docker-down

dev:
	$(PNPM) dev

build:
	$(PNPM) build

test:
	$(PNPM) test

e2e:
	$(PNPM) e2e

lint:
	$(PNPM) lint

db-push:
	$(PNPM) db:push

db-migrate:
	$(PNPM) db:migrate

db-seed:
	$(PNPM) db:seed

worker:
	$(PNPM) --filter @dana/worker worker

docker-up:
	docker compose up --build

docker-down:
	docker compose down -v
