# Turbo Notes Engineering Rules

These rules apply to every human and AI contributor in this repository. A nested `AGENTS.md` may add framework-specific rules but must not weaken this file.

## Product and communication

- Use English for code, identifiers, comments, commit messages, documentation, UI copy, API payloads, and test names.
- Treat `docs/requirements.md` as the functional scope and `docs/design-system.md` as the visual source of truth. The challenge brief, reference video, and Figma file override assumptions.
- Treat `docs/delivery-plan.md` as the priority source and `docs/quality-strategy.md` as the verification contract. Do not start P1 while the documented P0 gate is incomplete.
- Mark an inference or provisional design value explicitly. Never present guessed behavior or visually estimated tokens as confirmed source data.
- Keep scope aligned with the hiring challenge. Prefer a polished core workflow over speculative features.

## Working agreement

- Read the relevant code, nearby tests, and documentation before changing behavior.
- Implement small vertical slices that can be reviewed and verified independently.
- Update documentation in the same change whenever an API contract, environment variable, architecture decision, or user-visible behavior changes.
- Do not modify unrelated files or silently rewrite user changes.
- Do not add a dependency when the platform or an existing dependency solves the problem clearly.
- Apply KISS and YAGNI before abstraction. Use SOLID principles at proven boundaries without creating pattern-only layers, wrappers, or interfaces.

## Git history

- Commit after a coherent unit is complete and its relevant checks pass. Do not commit half-working states merely to create activity.
- Do not accumulate multiple completed, unrelated concerns in the working tree. Commit a checked unit before starting the next independent concern.
- Use Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`, or `ci:`.
- Keep commits focused and explain intent in the subject. The history should make implementation sequence and elapsed time understandable.
- Never commit secrets, local `.env` files, databases, caches, coverage output, generated build artifacts, or editor state.
- Never amend, force-push, squash, or rewrite published history unless the repository owner explicitly requests it.

## Architecture

- Keep `apps/web` and `apps/api` independently testable. Their only runtime contract is the versioned REST API.
- Use `/api/v1/` for public API routes and return consistent JSON errors.
- Keep controllers/views thin. Put domain decisions in explicit services or model methods when logic is reused or non-trivial.
- Avoid premature abstraction. Extract a shared abstraction only after a real repeated concept exists.
- Store timestamps in UTC and format them for the user at the presentation boundary.

## Backend: Django and DRF

- Follow PEP 8, use type hints for application code, and format/lint with Ruff.
- Use Django migrations for every schema change; never edit an applied migration.
- Validate input at serializer/form boundaries and enforce invariants again at the domain/database layer where appropriate.
- Scope every user-owned queryset to the authenticated user. Object identifiers must never bypass authorization.
- Prevent N+1 queries with deliberate `select_related`/`prefetch_related` usage and add tests for query-sensitive code when relevant.
- Keep settings environment-driven. Fail clearly for missing production secrets; safe local defaults are allowed only for local development.
- Test happy paths, validation errors, authorization boundaries, and meaningful edge cases with pytest.
- Treat cross-user ownership, session/CSRF behavior, and transactional workflows as mandatory test cases rather than optional coverage improvements.

## Frontend: Next.js, React, Tailwind, and shadcn/ui

- Follow the nested Next.js agent rules and current bundled Next.js documentation.
- Use App Router and Server Components by default. Add `"use client"` only at the smallest boundary that needs state, event handlers, or browser APIs.
- Keep remote-data access in typed modules; do not scatter raw `fetch` calls through presentational components.
- Model loading, empty, error, and success states explicitly.
- Use semantic HTML, visible keyboard focus, correct labels, and WCAG AA contrast. Respect reduced-motion preferences.
- Build mobile-first and verify small, medium, and large layouts. Do not make desktop-only assumptions from the reference frame.
- Tailwind CSS v4 is CSS-first. Define design tokens in `apps/web/src/app/globals.css` and consume semantic tokens in components; do not place raw color values in JSX.
- Use shadcn/ui as source-owned building blocks, not an unmodified theme. Add only components required by the current slice and adapt them to the Figma design.
- Start every reusable interactive control from the relevant shadcn/ui component when one exists; do not render raw native controls directly in product components. Keep each source-owned primitive in its own `components/ui` file, then compose product-specific behavior in a separate component file when it has domain styling or logic.
- Prefer composition over large components. Keep client-side state local unless multiple distant consumers truly share it.
- Test user-observable behavior. Avoid tests coupled to internal component implementation.
- Add Motion or dnd kit only when its prioritized slice begins. Preserve keyboard/touch parity, live announcements, reduced motion, and a non-animated fallback.

## Security and privacy

- Treat all input as untrusted and all user content as private by default.
- Use Django's password hashing, CSRF protections, ORM parameterization, and secure cookie controls; do not reimplement them.
- Never log passwords, tokens, session identifiers, full authorization headers, or private note contents.
- Public Next.js variables must use the `NEXT_PUBLIC_` prefix. Secrets must remain server-only.

## Quality gate and definition of done

A change is complete when:

1. Acceptance criteria are met without known regressions.
2. Relevant tests are added or updated and pass.
3. Lint, type checking, and production build checks pass for affected apps.
4. Accessibility and responsive behavior are considered for UI changes.
5. Docs and `.env.example` match the implementation.
6. The diff contains no secrets, debug output, dead code, or unrelated formatting churn.

Run `make check` before a milestone commit. Use `docker compose config` and a local stack smoke test for infrastructure changes.

## AI-assisted development

- The human contributor owns every generated line and must be able to explain it.
- Review AI output for correctness, security, accessibility, maintainability, and license implications.
- Record material AI use and validation in the README's “AI-assisted development” section.
- Record which source or tool AI inspected, what decision or artifact it influenced, and how the result was independently verified.
- Never present AI-generated screenshots or assets as Figma exports. When a decorative source asset cannot be exported, an original generated replacement is allowed only if its provenance and prompt intent are documented, license implications are reviewed, it contains no copied interface text or branding, and the result is visually and responsively verified.
