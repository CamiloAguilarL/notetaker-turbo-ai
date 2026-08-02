.DEFAULT_GOAL := help

.PHONY: audit bootstrap build check down e2e format help lint logs ps test up

help: ## Show available commands.
	@awk 'BEGIN {FS = ":.*## "; printf "Usage: make <target>\n\n"} /^[a-zA-Z_-]+:.*?## / {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

bootstrap: ## Create local env file when missing and build all containers.
	@test -f .env || cp .env.example .env
	docker compose build

build: ## Build production bundles locally.
	docker compose run --rm --no-deps web npm run build

up: ## Build and start the local stack.
	@test -f .env || cp .env.example .env
	docker compose up --build

down: ## Stop the local stack without deleting database data.
	docker compose down

logs: ## Follow service logs.
	docker compose logs --follow

ps: ## Show local service health.
	docker compose ps

lint: ## Run frontend and backend static checks.
	docker compose run --rm --no-deps web npm run format:check
	docker compose run --rm --no-deps web npm run lint
	docker compose run --rm --no-deps web npm run typecheck
	docker compose run --rm --no-deps api ruff format --check .
	docker compose run --rm --no-deps api ruff check .

format: ## Format backend and frontend source code.
	docker compose run --rm --no-deps api ruff format .
	docker compose run --rm --no-deps web npm run format

test: ## Run the automated test suite.
	docker compose run --rm --no-deps web npm run test:coverage
	docker compose run --rm api pytest

e2e: ## Run the core browser journey in the Playwright container.
	docker compose --profile test build e2e
	docker compose --profile test run --rm e2e

audit: ## Audit production frontend dependencies.
	docker compose run --rm --no-deps web npm audit --omit=dev

check: audit lint test build ## Run the pre-commit quality gate.
