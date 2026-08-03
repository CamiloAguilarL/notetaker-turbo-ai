# Evaluation strategy

## Objective

The challenge should be easy to evaluate from the repository, the running application, and the five-minute walkthrough. Each assessment criterion maps to implementation evidence; claims in the README must point to code, tests, commits, or demonstrated behavior.

## Criteria-to-evidence map

| Criterion | Delivery strategy | Evidence to preserve |
| --- | --- | --- |
| Functionality | Complete the traceable P0 journey before enhancements; add only high-value P1 capabilities with acceptance criteria. | Requirement IDs, API and UI tests, seeded demo journey, responsive screenshots, walkthrough chapters. |
| Code quality | Apply KISS and SOLID at real boundaries, enforce ownership and validation, and test user-observable behavior. | Focused modules, migrations, typed contracts, coverage report, CI checks, authorization and error-path tests. |
| Creativity | Use AI as a research, implementation, and verification multiplier; add one purposeful motion language and accessible manual organization. | README AI log, Figma/browser evidence, design-token mapping, accessible drag-and-drop, reduced-motion demonstration. |
| Time management | Use milestone gates, focused commits, explicit deferrals, and a protected submission buffer. | Chronological Git history, milestone status, priority labels, deferred-scope list, final decision summary. |

## Enhancement scoring

Scores use a 1–5 scale. Value estimates usefulness and evaluator visibility; effort and risk estimate delivery cost. A feature is not selected solely because it is visually impressive.

| Candidate | Value | Effort | Risk | Decision | Rationale |
| --- | ---: | ---: | ---: | --- | --- |
| Responsive product flow | 5 | 3 | 2 | P0 | Required quality and essential usability, not an extra. |
| Delete with undo | 5 | 2 | 2 | P1 | Completes the note lifecycle and creates useful error/undo states. |
| Search | 5 | 2 | 1 | P1 | High everyday value with a small, testable API/UI surface. |
| Date/category sorting | 4 | 2 | 1 | P1 | Makes growing note collections understandable. |
| Minimal landing | 3 | 1 | 1 | P1 | Improves first impression and product framing at low cost. |
| Manual order and drag-and-drop | 4 | 4 | 3 | Conditional P1 | Distinctive and demonstrable, but requires persistence, rollback, touch, and keyboard parity. |
| Purposeful motion | 3 | 2 | 2 | Conditional P1 | Adds polish when tied to state; easy to overuse or harm accessibility. |
| Keyboard shortcuts | 2 | 2 | 2 | P2 | Helpful for frequent users but less important than core correctness. |
| Pinning | 2 | 2 | 2 | P2 | Useful, but overlaps sorting and manual order. |
| Full trash view | 2 | 3 | 2 | P2 | Soft deletion enables it later; not required for the P1 undo flow. |
| End-user AI features | 2 | 5 | 4 | Deferred | Would distract from the requested notes workflow and require a trustworthy AI product contract. |

## P1 go/no-go gate

No selected P1 work starts until all of the following are true:

1. Registration, login, logout, note creation, filtering, editing, autosave, and reload persistence pass end to end.
2. Cross-user access is denied for every note endpoint and covered by tests.
3. The active milestone passes lint, type checking, backend tests, production build, and dependency audit.
4. P0 screens work at small, medium, and large widths with keyboard-visible focus.
5. Enough time remains for accessibility review, a clean-clone test, README completion, and demo recording.

Conditional P1 work has a second gate. Manual ordering begins only if search, deterministic sorting, and deletion are stable. Motion begins only after target interactions are final, so animation does not hide incomplete behavior or cause UI rework.

## P0 gate result — August 2, 2026

The P1 go/no-go gate passed with the following repository evidence:

1. Playwright covers registration, note creation, category filtering, editing, serialized autosave, close-time flush, reload persistence, logout, and protected-route redirection.
2. DRF integration tests prove owner-scoped lists and deny foreign retrieve/update access without leaking object existence.
3. `make check` passes production dependency audit, Prettier, ESLint, TypeScript, Ruff, Vitest coverage thresholds, pytest coverage threshold, and the Next.js production build.
4. The Playwright journey and Axe scans pass at 390px, 820px, and 1440px; editor fields have visible focus treatment and global reduced-motion fallback.
5. The Figma prototype and walkthrough were compared manually. Exact Figma token extraction remains unavailable because the connected MCP requires edit access, so provisional semantic values remain explicitly labeled rather than blocking functional work.

Selected P1 work may proceed in the documented order. Manual ordering was initially blocked until deletion, search, and deterministic sorting became stable; its completed interaction contract now opens the Motion gate.

Reversible deletion, search, deterministic sorting, the public landing, and manual ordering are now complete. Evidence includes owner-scoped soft-delete/restore, search/order, reorder-validation, ownership, timestamp-preservation, and transaction-rollback API tests; frontend confirmation/failure/Undo, query-state, optimistic-reorder, and rollback component tests; preservation of the latest draft before deletion; visitor/authenticated landing actions; production builds; and the complete Playwright journey with Axe scans at desktop, tablet, and mobile breakpoints.

The manual-order gate passed: the API atomically validates the owner's complete active-note set, leaves content-edit timestamps unchanged, and rejects duplicate, incomplete, or foreign identifiers. The responsive client provides pointer/touch drag activation, explicit keyboard move controls, screen-reader instructions and live announcements, optimistic persistence, failure rollback, and durable URL/reload state.

The Motion gate also passed after target interactions stabilized. Motion is limited to short transform and layout transitions on the landing composition, ordinary note grid, editor surface, and autosave text. An initial opacity approach was rejected when live Axe scans identified transient low-contrast frames; the final transform-only system preserves text contrast at every frame. The global configuration follows the device preference, and the mobile Playwright run explicitly emulates reduced motion and asserts that spatial transforms are disabled.

## Final verification result — August 2, 2026

The complete local submission gate passes with the following evidence:

1. `make check` reports zero production npm vulnerabilities and passes Prettier, ESLint, TypeScript, Ruff, 31 frontend tests, 24 backend tests, enforced coverage thresholds, and the Next.js production build.
2. Frontend coverage reaches 94.70% statements, 86.99% branches, 93.47% functions, and 96.53% lines; backend coverage reaches 97.32%.
3. The final Playwright journey passes in all 3 configured projects with Axe scans at desktop, tablet, and mobile widths; the mobile project also asserts the reduced-motion behavior.
4. Anonymous authentication mutations reject missing CSRF tokens, authenticated writes preserve the same protection, and cross-user note access remains owner-scoped without leaking object existence.
5. A separate clean clone of the final runtime tree built fresh Docker images from committed lockfiles, passed the complete quality and E2E gates, reached healthy status for PostgreSQL, Django, and Next.js, and returned HTTP 200 from the web and API health endpoints.
6. The final interface audit covers a focused skip link, invalid-field focus, modal overflow, touch targets, native control contrast, responsive layouts, and the reference-aligned soft visual treatment.

Only public GitHub publication, recording/uploading the walkthrough, signed-out link checks, and the submission form require the candidate's external accounts.

## Demonstration plan

The final video should spend most of its five minutes on evidence:

1. Product framing and source-derived priorities.
2. Register or sign in, then create and autosave a note.
3. Filter, search, sort, edit, reload, and verify persistence.
4. Demonstrate selected P1 interactions, including keyboard and reduced-motion behavior where implemented.
5. Show the user-ownership test, coverage result, CI gate, Docker setup, and focused commit history.
6. Close with explicit tradeoffs, deferred scope, and how AI accelerated research and verification.

Do not claim an enhancement in the README or demo until its acceptance criteria and relevant tests pass.
