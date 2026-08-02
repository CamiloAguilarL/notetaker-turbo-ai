.DEFAULT_GOAL := help

.PHONY: bootstrap build check down format help lint logs ps test up

help: ## Show available commands.
	@awk 'BEGIN {FS = ":.*## "; printf "Usage: make <target>\n\n"} /^[a-zA-Z_-]+:.*?## / {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

bootstrap: ## Create local env file when missing and build all containers.
	@test -f .env || cp .env.example .env
	docker compose build

build: ## Build production bundles locally.
	cd apps/web && npm run build

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
	cd apps/web && npm run lint
	cd apps/web && npm run typecheck
	cd apps/api && uv run ruff check .

format: ## Format backend code and check frontend formatting through ESLint.
	cd apps/api && uv run ruff format .
	cd apps/web && npm run lint

test: ## Run the automated test suite.
	cd apps/api && uv run pytest

check: lint test build ## Run the pre-commit quality gate.
