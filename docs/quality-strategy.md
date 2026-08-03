# Engineering quality strategy

## Quality objective

Quality means the smallest understandable design that protects user data, behaves predictably, and can change without rewriting unrelated code. Coverage is supporting evidence; passing lines without exercising authorization, persistence, and failure behavior is not sufficient.

## Engineering principles

- **KISS**: choose Django, DRF, PostgreSQL, React, and browser capabilities directly before adding layers or services. Prefer one obvious flow over configurable infrastructure without a current requirement.
- **YAGNI**: do not build generic repositories, event buses, plugin systems, search infrastructure, or category engines for hypothetical scale.
- **Single responsibility**: models enforce data invariants, serializers validate API input/output, views translate HTTP, services own multi-model or transactional workflows, typed frontend modules own transport, and components own presentation/interactions.
- **Open/closed where change is real**: allowlisted sort strategies and semantic category tokens may be extended without conditionals scattered across the UI. Do not introduce extension points before the second real variant.
- **Interface segregation**: expose task-specific component props and API payloads instead of passing full server objects everywhere.
- **Dependency inversion at side-effect boundaries**: isolate HTTP, time/debounce, and browser storage when tests require control; do not wrap Django ORM or React primitives merely to satisfy a pattern name.
- **DRY after evidence**: tolerate small duplication until a stable repeated concept appears. A premature shared abstraction is harder to remove than two clear implementations.
- **Secure by default**: authenticated ownership is part of every queryset and mutation, not a controller-level afterthought.

SOLID is a design lens, not a request to create one class per action. A direct serializer or model method remains preferable when it is cohesive, testable, and used in one place.

## Application boundaries

### Backend

- Keep API views thin and owner-scoped before object lookup.
- Put atomic reorder, restoration, or other multi-write behavior in explicit services using `transaction.atomic()`.
- Keep query behavior observable; use `select_related`, annotations, and query-count assertions where list endpoints could regress.
- Use data migrations for deterministic categories and normal schema migrations for every model change.
- Return one predictable error shape and never leak another user's object existence.

### Frontend

- Use Server Components for route-level data and static landing content; keep client boundaries around forms, search input, editor state, autosave, drag-and-drop, and motion only.
- Keep API access in typed modules and parse failure responses at one boundary.
- Store shareable filter/sort state in the URL; keep transient editor and optimistic state local.
- Model loading, empty, no-results, saving, saved, failure, and rollback states explicitly.
- Add shadcn/ui, Motion, or dnd kit only with the slice that uses it and customize it to the product design.

## Test layers

| Layer | Primary tools | Purpose | Runs |
| --- | --- | --- | --- |
| Backend unit/domain | pytest, pytest-django | Constraints, validation, services, ordering, timestamps, and edge cases. | Every relevant commit and CI. |
| Backend API integration | DRF `APIClient` | JSON contracts, sessions, CSRF-sensitive behavior, permissions, filtering, query counts, and database persistence. CSRF cases enable enforcement explicitly. | Every backend feature and CI. |
| Frontend unit/component | Vitest, React Testing Library | Pure transformations and interactive client behavior such as forms, autosave states, undo, and optimistic rollback. | Every relevant frontend feature and CI. |
| Browser E2E | Playwright | Real register-to-notes journey, Server Components, navigation, cookies, reload persistence, and responsive behavior. | Core milestone gate and CI. |
| Accessibility | Playwright plus axe, keyboard and screen-reader-oriented manual checks | Automated detectable issues plus behavior automation cannot judge. | P0 gate and final submission. |
| Infrastructure smoke | Docker health checks and HTTP probes | Service startup, migrations, database connectivity, and exposed ports. | Infrastructure changes and clean-clone audit. |

Next.js notes that async Server Components are better covered end to end while ecosystem unit support is incomplete. Browser tests therefore cover those routes; unit tests remain focused on pure logic and Client Components.

## Mandatory backend test matrix

### Accounts and sessions

- Registration hashes passwords, normalizes the identity, rejects duplicates, and validates malformed input.
- Login succeeds and fails without leaking sensitive credential details.
- Session persistence, logout invalidation, unauthenticated responses, and the real CSRF-cookie/header flow are covered with CSRF checks explicitly enabled.

### Categories and notes

- Seed migration is deterministic and category counts include only the authenticated user's active notes.
- Create, retrieve, list, and patch cover valid input, required fields, length bounds, whitespace policy, and missing objects.
- Every detail and collection operation proves that user A cannot read, infer, update, delete, restore, or reorder user B's notes.
- Filtering, search, pagination metadata, and each allowlisted order compose correctly and use deterministic tie-breakers; page reads exclude deleted and foreign notes, while unknown ordering is rejected or handled by the documented contract.
- Autosave updates only supplied fields and returns the persisted `updated_at` value.
- Soft deletion excludes a note from normal reads; restore preserves content and cannot cross ownership boundaries.
- Reorder validates the complete active identifier set, rejects duplicates/foreign IDs, rolls back on error, and persists atomically.
- List endpoints have a query-count regression test once their final shape is known.

## Mandatory frontend and E2E scenarios

- Register, create a note, change category, autosave, close, reload, and observe persisted content.
- Filter, search, sort, and return through browser history without losing URL state.
- Render the first note page on the server, then cover automatic loading, explicit fallback, retry, completion, deduplication, and the full filtered total.
- Simulate recoverable autosave, delete/restore, and reorder failures without losing the last confirmed state.
- Reorder with pointer and keyboard; announce lift, position change, drop, and cancellation.
- Sign out and verify protected routes no longer render private data.
- Exercise empty, no-results, loading, validation, server-error, reduced-motion, and horizontal/vertical overflow states at representative mobile and desktop widths.

Tests query visible roles, labels, and user-observable output. CSS selectors, internal hook state, implementation-specific snapshots, and arbitrary sleeps are avoided.

## Coverage and quality gates

- Keep the backend project threshold at **80% or higher** throughout development; domain and authorization code should normally exceed it because meaningful success, validation, and permission branches are mandatory.
- A feature may not lower coverage without a documented reason, and coverage never replaces a missing ownership or failure-path assertion.
- Frontend coverage is enforced for testable client/domain modules at 90% statements, 80% branches, 85% functions, and 95% lines. Async Server Components remain covered through E2E evidence rather than architecture-distorting unit seams.
- CI requires zero lint warnings, successful type checking, Ruff, all tests, the Next.js production build, and a clean production dependency audit.
- Flaky tests are defects. Use isolated users/data, deterministic clocks where behavior depends on time, explicit readiness, and no order-dependent state.

## Review checklist

Before a feature commit:

1. Trace the diff to requirement IDs and verify the smallest complete vertical slice.
2. Review every query and mutation for ownership, validation, and transaction boundaries.
3. Exercise success, empty, recoverable error, and unauthorized behavior.
4. Check small, medium, and large layouts; keyboard focus; labels; contrast; and reduced motion.
5. Run relevant focused tests, then `make check` before the milestone commit.
6. Review the diff for unnecessary abstractions, dependencies, debug output, secrets, and unrelated changes.
7. Update contracts and documentation in the same commit.

## Primary references

- [Django testing documentation](https://docs.djangoproject.com/en/6.0/topics/testing/)
- [Django REST Framework testing guide](https://www.django-rest-framework.org/api-guide/testing/)
- [Next.js testing guide](https://nextjs.org/docs/app/guides/testing)
- [Playwright testing best practices](https://playwright.dev/docs/best-practices)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
