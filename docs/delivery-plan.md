# Delivery plan

## Timebox and priority rule

The challenge text contains conflicting limits: **7 days** and **72 hours**. Until clarified, work is ordered so the core workflow can be demonstrated after every milestone and a credible submission remains possible under the shorter window.

Priority definitions:

- **P0**: required for a coherent end-to-end demo.
- **P1**: important polish or completeness after every P0 is stable.
- **P2**: explicitly optional; implement only with verified surplus time.

## Milestones

### M0 — Foundation (complete)

- Git repository and contribution rules.
- Next.js, Tailwind CSS v4, shadcn/ui, Django, DRF, PostgreSQL.
- Docker Compose, environment contract, health checks, lint, tests, build, and security audit.
- Evidence-backed requirements and architecture documentation.

### M1 — Authentication (P0)

- Custom user model decision before domain migrations.
- Register, login, logout, current-user, CSRF/session flow.
- Accessible auth pages aligned with Figma.
- Validation and authorization tests.

### M2 — Notes domain API (P0)

- Category seed migration and note model.
- User-scoped list, retrieve, create, and patch endpoints.
- Category counts, filtering, ordering, validation, and permission tests.
- OpenAPI or concise endpoint examples if time permits.

### M3 — Dashboard (P0)

- Authenticated layout, category navigation, counts, and filtering.
- Empty, loading, error, and populated states.
- Responsive note-card grid using semantic category tokens.
- Component and API integration tests.

### M4 — Editor and autosave (P0)

- Create and edit flows.
- Category selector and editor recoloring.
- Debounced autosave with saving/saved/error states.
- Close behavior that preserves pending content.
- Date formatting and ordering refresh.

### M5 — Submission quality (P0/P1)

- End-to-end happy path and authorization regression tests.
- Keyboard, focus, screen-reader, responsive, and reduced-motion pass.
- Final Figma comparison and token correction if access is available.
- README process/decisions update, demo seed data, and five-minute English walkthrough script.
- Clean public GitHub history and working links.

## Suggested schedule

| Window | Outcome |
| --- | --- |
| Day 1 | Foundation and requirements. |
| Day 2 | Authentication end to end. |
| Day 3 | Notes/category model and API. |
| Day 4 | Dashboard, cards, filters, empty state. |
| Day 5 | Editor and reliable autosave. |
| Day 6 | Tests, accessibility, responsive polish, Figma correction. |
| Day 7 | README, demo data, video, final audit, submission. |

For a 72-hour interpretation, combine M1/M2 on the first implementation day, M3/M4 on the second, and reserve the final day for reliability, accessibility, documentation, and the demo.

## Commit strategy

Use one coherent commit per completed, checked unit. Examples:

- `feat(auth): add session registration flow`
- `feat(notes): add user-scoped note endpoints`
- `feat(web): build responsive notes dashboard`
- `feat(web): autosave note edits`
- `test(e2e): cover core notes journey`
- `docs: finalize challenge handoff`

Avoid catch-all commits, artificial checkpoint commits, and commits that knowingly fail relevant checks. The chronological history should communicate decisions and elapsed implementation time without requiring the reviewer to reverse-engineer unrelated diffs.

## Time-management guardrails

- Finish authorization and note persistence before decorative polish.
- Do not implement items listed as out of scope in `requirements.md` while a P0 is incomplete.
- Add tests with each domain slice rather than postponing all tests to the end.
- Reserve a final uninterrupted block for a clean-clone setup test and demo recording.
- If blocked by Figma tokens, continue with semantic provisional values and replace them in one isolated commit when access arrives.
