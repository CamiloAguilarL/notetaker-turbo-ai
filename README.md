# Turbo Notes

Turbo Notes is a private notes-taking hiring challenge built as a local-first monorepo with Next.js, Django REST Framework, and PostgreSQL. It includes session authentication, category-based organization, search and sorting, accessible manual ordering, a responsive notes dashboard, an autosaving editor, reversible note deletion, and a minimal public landing.

## Current status

The complete P0 product journey and its documented quality gate are complete:

- Email/password registration, login, session persistence, route protection, and logout with Django sessions and CSRF protection.
- Private user-scoped note creation, retrieval, updates, deterministic ordering, reversible soft deletion, and four seeded categories with scoped counts.
- Responsive empty/populated dashboards, URL-backed category filters, semantic category colors, loading/error states, and accessible note cards.
- Debounced full-text note search plus recently edited, oldest edited, and category ordering; every view composes through durable URL state and deterministic API ordering.
- Atomic manual ordering in the unfiltered notebook with optimistic updates, rollback feedback, pointer/touch drag handles, keyboard move controls, position announcements, and reload persistence.
- Plain-text editor with category changes, serialized debounced autosave, saving/error/retry states, last-edited metadata, and close-time flush.
- Accessible delete confirmation and an eight-second Undo action that restores the complete note without losing its category or latest draft.
- Next.js 16.2.12, React 19, Tailwind CSS 4, dnd kit, and customized source-owned shadcn/ui `Button`, `Input`, and `AlertDialog` components.
- Django 6.0.7 and Django REST Framework 3.17.1 with a database-aware health endpoint and a consistent JSON error contract.
- PostgreSQL 17, Django, and Next.js orchestrated through Docker Compose.
- Ruff, pytest with enforced backend coverage, ESLint, TypeScript, Vitest with enforced frontend coverage, Playwright E2E plus Axe accessibility scans at three breakpoints, production builds, and npm security auditing.
- A GitHub Actions quality gate that reuses the same Dockerized checks as local development.
- Product requirements, architecture, delivery/evaluation priorities, quality strategy, and provisional design tokens in `docs/`.
- A source-aligned visual fidelity pass covering authentication, empty/populated dashboards, cards, controls, responsive editor composition, and original transparent stationery illustrations.
- A public Server Component landing page with visitor registration/login actions and a personalized return-to-notes action for authenticated users.

The selected P1 enhancements—reversible deletion, search/deterministic sorting, the public landing, and accessible manual ordering—are complete across their relevant API, responsive UI, failure handling, unit tests, E2E, and accessibility checks. The manual-order interaction is stable, so the final conditional Motion slice is now eligible without displacing the submission buffer.

## Repository structure

```text
.
├── apps/
│   ├── api/                  # Django and Django REST Framework
│   └── web/                  # Next.js App Router, Vitest, and Playwright
├── docs/
│   ├── architecture.md
│   ├── delivery-plan.md
│   ├── design-system.md
│   ├── evaluation-strategy.md
│   ├── quality-strategy.md
│   └── requirements.md
├── .env.example              # Local environment contract
├── AGENTS.md                 # Engineering and AI contribution rules
├── docker-compose.yml
└── Makefile
```

## Quick start

Prerequisites:

- Docker Desktop with Docker Compose v2
- `make`

Start all services:

```bash
cp .env.example .env
make up
```

Open:

- Web: [http://localhost:3000](http://localhost:3000)
- API health: [http://localhost:8000/api/v1/health/](http://localhost:8000/api/v1/health/)
- Django admin: [http://localhost:8000/admin/](http://localhost:8000/admin/)

Stop services without deleting PostgreSQL data:

```bash
make down
```

The API container applies pending Django migrations before starting the development server. PostgreSQL data persists in a named Docker volume.

## Common commands

| Command | Purpose |
| --- | --- |
| `make bootstrap` | Create `.env` when absent and build containers. |
| `make up` | Build and start the complete local stack. |
| `make down` | Stop the stack while preserving local database data. |
| `make logs` | Follow logs from all services. |
| `make ps` | Show container and health status. |
| `make audit` | Audit production frontend dependencies. |
| `make lint` | Run ESLint, TypeScript, and Ruff checks. |
| `make test` | Run frontend and backend tests with enforced coverage. |
| `make e2e` | Build the official Playwright image and run the core browser journey. |
| `make build` | Create the Next.js production build. |
| `make check` | Run the local quality gate. |

The Make targets run their checks inside the project containers, so they use the same dependency and database environment on every machine. The applications can also be run independently from `apps/web` with npm and `apps/api` with uv, but Docker Compose remains the supported local integration path because it supplies PostgreSQL and the correct service-to-service URLs.

## Evaluation-driven delivery

The implementation order is intentionally tied to Turbo AI's four assessment criteria:

- **Functionality**: finish the source-derived authentication, dashboard, category, editor, persistence, and autosave journey before optional work.
- **Code quality**: deliver each vertical slice with ownership, validation, error behavior, tests, responsive behavior, and documentation rather than postponing quality to the end.
- **Creativity**: demonstrate AI-assisted research and verification, then add useful product differentiation such as reversible deletion, search/sorting, accessible manual ordering, and one restrained motion language when the core is stable.
- **Time management**: protect the P0 gate and submission buffer; cut P2, Motion, and drag-and-drop before cutting security, tests, accessibility, or demo readiness.

The planned time allocation is 55% P0 slices, 25% quality work performed alongside them, 10% selected P1 enhancements, and 10% submission verification and presentation. These percentages are prioritization guardrails, not retrospective time claims.

Selected P1 work is ordered as deletion with undo (complete), search and sorting (complete), a minimal landing (complete), accessible manual ordering (complete), then conditional motion. Pinning, keyboard shortcuts, and a complete trash screen remain P2. See the [evaluation strategy](docs/evaluation-strategy.md) for scoring and go/no-go conditions.

## Environment variables

Copy `.env.example` to `.env`. The committed example contains local-only values; `.env` is ignored by Git.

### PostgreSQL

| Variable | Used by | Description |
| --- | --- | --- |
| `POSTGRES_DB` | PostgreSQL, Compose | Local database name. |
| `POSTGRES_USER` | PostgreSQL, Compose | Local database user. |
| `POSTGRES_PASSWORD` | PostgreSQL, Compose | Local database password; never reuse outside local development. |
| `POSTGRES_PORT` | Compose | Host port mapped to PostgreSQL port 5432. |
| `DATABASE_URL` | Django | Complete database connection URL. Compose rewrites the host to `db`. |

### Django API

| Variable | Visibility | Description |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | Secret | Signs Django sessions and security-sensitive values. |
| `DJANGO_DEBUG` | Server-only | Enables Django debug behavior locally. |
| `DJANGO_ALLOWED_HOSTS` | Server-only | Comma-separated hosts Django may serve. |
| `DJANGO_CORS_ALLOWED_ORIGINS` | Server-only | Browser origins allowed to call the API. |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | Server-only | Origins trusted for unsafe session-authenticated requests. |

### Next.js

| Variable | Visibility | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Public/browser | Browser-facing, versioned API base URL. It is bundled into client code. |
| `API_INTERNAL_URL` | Server-only | API base URL reachable from Next.js inside the Docker network. |

No deployment environment is defined yet. Before any non-local use, secrets, debug flags, allowed hosts, cookie security, and production servers must be configured explicitly.

## Product and technical documentation

- [Requirements](docs/requirements.md): evidence-backed behavior, acceptance criteria, exclusions, and open questions.
- [Architecture](docs/architecture.md): service boundaries, data model, API direction, and security decisions.
- [Design system](docs/design-system.md): Tailwind v4 token contract, shadcn/ui policy, and Figma access status.
- [Delivery plan](docs/delivery-plan.md): priority order for the challenge timebox.
- [Evaluation strategy](docs/evaluation-strategy.md): criteria mapping, enhancement scoring, gates, and demo evidence.
- [Quality strategy](docs/quality-strategy.md): KISS/SOLID boundaries, test matrix, coverage policy, and review gate.
- [Engineering rules](AGENTS.md): coding, testing, Git, security, frontend, backend, and AI rules.

## Source material

- [Challenge Figma file](https://www.figma.com/design/nIqpRyEWKPYqYsW7RMfi3S/Notes-Taking-App-Challenge)
- [Interactive Figma prototype](https://www.figma.com/proto/nIqpRyEWKPYqYsW7RMfi3S/Notes-Taking-App-Challenge?node-id=1-2&p=f&m=dev&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=34%3A889&show-proto-sidebar=1)
- [Reference walkthrough video](https://drive.google.com/file/d/1yexyRO8qCElTYBFR9wrJCfZsqsBcTZgQ/view)

The public prototype and the full 3:52 video were reviewed. The connected Figma account can view the public prototype but cannot read design variables because the MCP integration requires edit access. Current color values are therefore visually estimated and explicitly marked provisional in the design-system document.

## AI-assisted development

OpenAI Codex was used as an implementation and review assistant to:

- translate the written brief into traceable functional and non-functional requirements;
- inspect the public Figma prototype interactively through browser control, including empty, populated, filtered, editor, and category-selector states;
- review the full 3:52 Google Drive walkthrough through browser control to capture registration, login, empty dashboard, creation, category switching, filtering, and editing behavior;
- revisit source frames for a dedicated visual-fidelity pass that removed unnecessary dashboard chrome, corrected rounded note geometry, softened controls, and moved editor controls outside its colored writing surface;
- attempt structured Figma design-context and variable extraction through the Figma MCP integration, document the edit-access limitation, and keep visually estimated tokens explicitly provisional;
- scaffold and configure the Next.js and Django workspaces;
- define Docker, environment, testing, linting, and documentation contracts;
- research current official Next.js, Django/DRF, Motion, dnd kit, and Playwright guidance before selecting architecture, testing, animation, and accessible drag-and-drop approaches;
- identify and replace vulnerable transitive PostCSS and Sharp versions with audited overrides;
- validate the local UI at desktop, tablet, and mobile viewports and smoke-test the Dockerized web, API, and database services;
- detect and fix a server/client timestamp hydration mismatch through live browser diagnostics;
- exercise the real landing, registration, note creation, autosave, reload persistence, filtering, search, sorting, manual reordering, category change, reversible deletion, logout, route protection, and automated accessibility scans in Playwright;
- generate two original transparent colored-pencil/watercolor stationery illustrations for authentication and the empty state, remove their chroma backgrounds, and inspect the resulting RGBA assets at desktop and mobile sizes.

AI accelerated source comparison, scaffolding, implementation, documentation, dependency review, original illustration creation, and repetitive verification. It was not used to invent unavailable Figma values, present generated illustrations as Figma exports, or justify unverified completion claims.

Generated work was checked with ESLint, TypeScript, Vitest and enforced coverage, Playwright, a Next.js production build, Ruff, pytest and enforced coverage, `npm audit`, Docker health checks, HTTP smoke tests, and visual browser inspection. AI output is not treated as authoritative: the repository owner remains responsible for reviewing, understanding, and presenting every decision. Material AI-assisted changes must record the inspected source, the decision influenced, and the independent validation performed.
