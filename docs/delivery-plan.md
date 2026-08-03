# Delivery plan

## Timebox and priority rule

The challenge text contains conflicting limits: **7 days** and **72 hours**. Until clarified, work is ordered so the core workflow can be demonstrated after every milestone and a credible submission remains possible under the shorter window.

Priority definitions:

- **P0**: required for a coherent end-to-end demo.
- **P1**: selected high-value completeness or differentiation after the P0 gate passes.
- **P2**: explicitly optional; implement only with verified surplus time.

Target time allocation across the complete challenge:

- **55% — P0 vertical slices**: authentication, notes API, dashboard, editor, and autosave.
- **25% — quality**: tests, security boundaries, accessibility, responsive behavior, and failure states alongside those slices.
- **10% — selected P1**: deletion, discovery/organization, landing, and conditional interaction polish.
- **10% — submission buffer**: clean-clone verification, documentation, demo data, walkthrough, and link audit.

Quality is not a final-day phase. The allocation identifies emphasis; every vertical slice includes its own tests and review before it is committed.

## Milestones

### M0 — Foundation (complete)

- Git repository and contribution rules.
- Next.js, Tailwind CSS v4, shadcn/ui, Django, DRF, PostgreSQL.
- Docker Compose, environment contract, health checks, lint, tests, build, and security audit.
- Evidence-backed requirements and architecture documentation.

### M1 — Authentication (P0, complete)

- Custom user model decision before domain migrations.
- Register, login, logout, current-user, CSRF/session flow.
- Accessible auth pages aligned with Figma.
- Validation and authorization tests.

### M2 — Notes domain API (P0, complete)

- Category seed migration and note model.
- User-scoped list, retrieve, create, and patch endpoints.
- Category counts, filtering, ordering, validation, and permission tests.
- OpenAPI or concise endpoint examples if time permits.

### M3 — Dashboard (P0, complete)

- Authenticated layout, category navigation, counts, and filtering.
- Empty, loading, error, and populated states.
- Responsive note-card grid using semantic category tokens.
- Component and API integration tests.

### M4 — Editor and autosave (P0, complete)

- Create and edit flows.
- Category selector and editor recoloring.
- Debounced autosave with saving/saved/error states.
- Close behavior that preserves pending content.
- Date formatting and ordering refresh.

### M5 — Core hardening and P0 gate (complete)

- End-to-end happy path and authorization regression tests.
- Keyboard, focus, screen-reader, responsive, and reduced-motion pass.
- Final Figma comparison and token correction if access is available.
- API query review, deterministic ordering, error contract review, and autosave failure/retry verification.
- P0 acceptance-criteria audit against `requirements.md`.

P1 work is blocked until the gate in `evaluation-strategy.md` passes.

### M6 — High-return enhancements (P1)

Implement in this order and stop when the protected submission buffer would be affected:

1. Soft deletion with accessible undo. **Complete:** owner-scoped persistence/API, latest-draft flush, confirmation, temporary Undo, recoverable errors, component coverage, and five-viewport E2E/Axe evidence.
2. Search plus recently edited, oldest edited, and category sorting. **Complete:** allowlisted API queries, URL-composed filters, explicit no-results behavior, deterministic tie-breakers, API/component coverage, and five-viewport E2E/Axe evidence.
3. Minimal public landing using real product visuals and authentication actions. **Complete:** visitor and authenticated CTAs, source-aligned product composition, responsive layout, production build, and E2E/Axe coverage.
4. Manual ordering with accessible drag-and-drop. **Complete:** owner-scoped transactional persistence, exact-set validation, optimistic rollback, pointer/touch sensor, keyboard controls, live position announcements, and five-viewport E2E/Axe evidence.
5. One restrained Motion-based interaction language. **Complete:** global user-preference policy, transform-only landing/editor entrances, grid layout transitions, autosave-state feedback, reduced-motion E2E evidence, and five-viewport Axe coverage.
6. Progressive note loading. **Complete:** owner-scoped 12-note API pages, a server-rendered first page, automatic sentinel loading, accessible load/retry/completion states, full-result totals, focused API/component coverage, and five-viewport E2E evidence.
7. Unified overflow treatment. **Complete:** one tokenized horizontal/vertical scrollbar across the document, category navigation, editor, selects, and dialogs, with category inheritance, stable gutters where useful, forced-colors fallback, and component regression coverage.

Each enhancement is a complete vertical slice: persistence and API contract, responsive UI, loading/error/empty states, tests, documentation, and a focused commit. Do not install dnd kit or Motion before its slice starts.

### M7 — Submission package

- README process/decisions update, demo seed data, and five-minute English walkthrough script. **Complete.**
- Final AI-use and scope-decision record with only verified claims. **Complete.**
- Clean-clone Docker setup, full quality gate, production build, health checks, and five-viewport E2E/Axe run. **Complete:** the finalized runtime tree passed from a separate clone built directly from committed lockfiles.
- Local Git history, ignored-artifact scan, documentation links, and submission checklist. **Complete.** Public GitHub publication, signed-out link verification, video recording/upload, and form submission remain candidate-owned external actions.

## Suggested schedule

| Window | Outcome |
| --- | --- |
| Day 1 | Foundation and requirements. |
| Day 2 | Authentication end to end. |
| Day 3 | Notes/category model and API. |
| Day 4 | Dashboard, cards, filters, empty state. |
| Day 5 | Editor, reliable autosave, and complete P0 journey. |
| Day 6 | Core hardening, then deletion/search/sorting/landing if the P0 gate passes. |
| Day 7 | Conditional drag/motion only with surplus; README, demo data, video, final audit, submission. |

For a 72-hour interpretation, combine M1/M2 on the first implementation day, M3/M4 on the second, and reserve the final day for reliability, accessibility, documentation, and the demo. Only deletion, search/sorting, or the low-cost landing may enter that shorter plan after the P0 gate; drag-and-drop and Motion are first to be cut. In the current implementation every selected P1 slice passed its conditional gate; work now moves exclusively to the protected submission package.

## Commit strategy

Use one coherent commit per completed, checked unit. Examples:

- `feat(auth): add session registration flow`
- `feat(notes): add user-scoped note endpoints`
- `feat(web): build responsive notes dashboard`
- `feat(web): autosave note edits`
- `feat(notes): add reversible note deletion`
- `feat(web): add note search and sorting`
- `feat(web): persist accessible manual ordering`
- `test(e2e): cover core notes journey`
- `docs: finalize challenge handoff`

Avoid catch-all commits, artificial checkpoint commits, and commits that knowingly fail relevant checks. The chronological history should communicate decisions and elapsed implementation time without requiring the reviewer to reverse-engineer unrelated diffs.

## Time-management guardrails

- Finish authorization and note persistence before decorative polish.
- Do not start P1 while a P0 acceptance criterion or ownership test is incomplete.
- Add tests with each domain slice rather than postponing all tests to the end.
- Reserve a final uninterrupted block for a clean-clone setup test and demo recording.
- If blocked by Figma tokens, continue with semantic provisional values and replace them in one isolated commit when access arrives.
- Cut P2 first, then Motion, then drag-and-drop, rather than compressing security, accessibility, tests, or the submission buffer.
- Update milestone status and the README only after behavior is implemented and verified; planning language must not imply completion.
