# Product requirements

## Purpose and evidence

This document translates the hiring challenge, public Figma prototype, and 3:52 walkthrough video into an implementation backlog. It distinguishes direct evidence from implementation decisions so that inferred behavior is never mistaken for an explicit requirement.

Evidence labels:

- **Brief**: stated in the written Turbo AI challenge.
- **Video**: directly visible in the reference walkthrough.
- **Prototype**: directly visible or interactive in the public Figma prototype.
- **Owner**: explicitly selected by the repository owner after the source review.
- **Recommendation**: proposed enhancement supported by product research and challenge value.
- **Decision**: necessary implementation choice, not explicitly shown.
- **Open**: source material is inconsistent or insufficient.

## Product goal

An authenticated user can capture personal notes, assign each note to a visual category, quickly find and organize their work, and return to edit existing content in a focused interface.

## Users

- **Visitor**: can register or sign in.
- **Authenticated user**: can see and modify only their own notes.
- **Administrator**: can use Django admin for local inspection; this is a developer aid, not a product UI.

## Functional requirements

### Authentication

| ID | Priority | Requirement | Evidence | Acceptance criteria |
| --- | --- | --- | --- | --- |
| AUTH-01 | P0 | Register with email and password. | Video | The form validates required fields, rejects an existing identity, creates an account securely, and enters the authenticated experience on success. |
| AUTH-02 | P0 | Sign in with email and password. | Video | Valid credentials create an authenticated session; invalid credentials produce a specific, non-sensitive error. |
| AUTH-03 | P0 | Persist and protect the authenticated session. | Decision | Reloading preserves the session, unauthenticated access redirects to sign in, and one user can never read or mutate another user's notes. |
| AUTH-04 | P0 | Sign out. | Decision | The session is invalidated and protected content is no longer available. A sign-out control is required even though it is not shown in the walkthrough. |
| AUTH-05 | P1 | Move between registration and login. | Video | Both screens expose the reciprocal navigation link and preserve accessible focus behavior. |

Password reset, email verification, social login, and profile management are not shown and are out of MVP scope.

### Notes dashboard and categories

| ID | Priority | Requirement | Evidence | Acceptance criteria |
| --- | --- | --- | --- | --- |
| DASH-01 | P0 | Show a useful empty state when the user has no notes. | Video | The dashboard keeps category navigation and the “New Note” action available while presenting clear empty-state guidance. |
| DASH-02 | P0 | Show notes as a responsive card grid. | Video, Prototype | Every card shows a human-readable date, category, title, and a content preview; dates use `Today`/`Yesterday`, omit the year during the current UTC year, and include it for older years; long text is safely truncated, compact screens use denser card heights, and intermediate widths add columns fluidly without horizontal page overflow. |
| DASH-03 | P0 | Order notes by most recently updated first. | Decision | A newly created or edited note appears first and ordering is deterministic for identical timestamps. |
| CAT-01 | P0 | Show the category list and per-category note counts. | Video, Prototype | Counts reflect the authenticated user's current notes and update after create or category change. |
| CAT-02 | P0 | Filter notes by category and return to all notes. | Video, Prototype | The selected filter is visually and semantically identified; the grid contains only matching notes; “All Categories” restores the complete list. |
| CAT-03 | P0 | Use a stable color identity for every category. | Video, Prototype | Sidebar dot, note card, editor surface, and category selector use the same semantic category token. |

The seeded categories are **Random Thoughts**, **School**, **Personal**, and **Drama**. Drama is included because it is explicitly selectable in the prototype editor even though the dashboard and video samples show only the first three. Categories remain database data rather than values hard-coded in API views or React components.

### Note creation and editing

| ID | Priority | Requirement | Evidence | Acceptance criteria |
| --- | --- | --- | --- | --- |
| NOTE-01 | P0 | Start a note from the “New Note” action. | Video, Prototype | A new editor opens with a default category, editable title, editable body, and no unrelated dashboard controls. |
| NOTE-02 | P0 | Assign or change a note category in the editor. | Video, Prototype | Selecting another category persists the relationship and immediately updates the editor's semantic color treatment. |
| NOTE-03 | P0 | Edit note title and body as plain text. | Video, Prototype | Title and body accept keyboard input, retain intentional line breaks, validate defined length limits, and preserve content after closing/reloading. |
| NOTE-04 | P0 | Show the last-edited timestamp. | Video, Prototype | The value reflects the latest persisted change and is formatted for the user rather than exposing a raw UTC timestamp. |
| NOTE-05 | P0 | Open an existing note from its card. | Video, Prototype | The editor loads the complete title, body, category, and timestamp for the selected note. |
| NOTE-06 | P0 | Save edits without a dedicated save button. | Video, Prototype, Decision | Changes are autosaved with a short debounce; the UI communicates saving, saved, and recoverable failure states; closing waits for or safely flushes pending changes. |
| NOTE-07 | P0 | Close the editor and return to the previous dashboard context. | Video, Prototype | Closing returns to the same active category filter and the card grid reflects persisted edits. |

### Prioritized product enhancements

These requirements are deliberately sequenced after the complete P0 workflow. They may not displace authorization, persistence, autosave reliability, accessibility, or tests.

| ID | Priority | Requirement | Evidence | Acceptance criteria |
| --- | --- | --- | --- | --- |
| NOTE-08 | P1 | Delete a note with a reversible grace period. | Owner, Recommendation | The action requires clear intent, removes the note from normal views, offers an accessible undo action, and can restore the note without losing content or category. |
| SEARCH-01 | P1 | Search the authenticated user's notes. | Recommendation | A debounced, case-insensitive query matches title and content, composes with category filters and sort order, exposes a clear button, and has an explicit no-results state. |
| SORT-01 | P1 | Sort notes by last edited, oldest edited, category, or manual order. | Owner | The selected order is visible, stable across reloads through URL state, and uses deterministic tie-breakers. Category ordering is unavailable when it would be redundant. |
| PAGE-01 | P1 | Load large note collections progressively. | Owner, Recommendation | Ordinary list modes server-render the first 12 notes, load subsequent pages automatically near the grid end, expose an accessible load/retry fallback and completion state, and keep the displayed total equal to the complete filtered result. Manual ordering retains the complete active set required by its atomic contract. |
| LAND-01 | P1 | Present a minimal public landing page. | Owner | Visitors understand the product in one viewport and can register or sign in; authenticated users can continue to their notes; the page adds no product-only dependency. |
| ORDER-01 | P1 conditional | Reorder notes manually with drag-and-drop. | Owner | Manual mode works with pointer, touch, and keyboard; announces position changes; persists atomically; rolls back optimistic state after failure; and is enabled only in the unfiltered “All Categories” view. |
| MOTION-01 | P1 conditional | Use purposeful interface motion. | Owner, Recommendation | One restrained motion language communicates editor transitions, card reordering, and successful state changes; it never delays input and respects reduced-motion preferences. |
| SHORT-01 | P2 | Offer discoverable keyboard shortcuts. | Recommendation | At minimum, shortcuts can create a note, focus search, and close the editor without overriding browser or assistive-technology conventions. |
| PIN-01 | P2 | Pin important notes. | Recommendation | Pinned state is explicit, persists, composes predictably with every sort mode, and remains distinct from manual ordering. |
| TRASH-01 | P2 | Browse and restore recently deleted notes. | Recommendation | A separate trash view preserves ownership rules and supports restore or permanent deletion with clear consequences. |

The P1 conditional items have explicit go/no-go gates in `delivery-plan.md`. Rich text, Markdown, attachments, tags, sharing, collaboration, and offline synchronization remain out of challenge scope.

## Screen inventory

1. Public landing: concise value proposition, representative note composition, registration and login actions.
2. Registration: greeting, email, password, submit, link to login, decorative illustration.
3. Login: greeting, email, password, submit, link to registration, decorative illustration.
4. Empty dashboard: categories, “New Note”, centered empty-state illustration and guidance.
5. Populated dashboard: search, sorting, categories with counts, filter state, responsive note grid, “New Note”.
6. Note editor: category selector, close and delete actions, editable title and body, last-edited value, autosave status.
7. Optional trash: deleted-note list with restore and permanent-delete actions; P2 only.

## API and persistence requirements

- Use Django, Django REST Framework, and local PostgreSQL as required by the brief.
- Version product routes under `/api/v1/`.
- Use Django's password hashing and session security rather than custom cryptography.
- Validate all write payloads and return predictable JSON errors.
- Scope every note query and mutation to `request.user`.
- Create migrations for schema and seed categories deterministically.
- Store timestamps in UTC and expose ISO 8601 values through the API.
- Keep note-list responses sufficient for cards and detail responses sufficient for editing.
- Provide owner-scoped page metadata without changing the existing complete-list contract required by manual ordering.
- Prevent avoidable N+1 queries for category and owner relationships.
- Allowlist search and ordering parameters; never interpolate request values into raw SQL.
- Apply reorder operations in a transaction and reject identifiers not owned by the current user.
- Exclude soft-deleted notes from normal querysets by default.

## UX and quality requirements

- Match the Figma composition and visual hierarchy while adapting it for mobile and intermediate widths; responsive behavior is P0, not an optional enhancement.
- Support keyboard-only use, visible focus, semantic controls, labeled fields, announced form errors, and WCAG AA contrast.
- Respect `prefers-reduced-motion`; motion should communicate state rather than decorate every interaction.
- Provide explicit loading, empty, success, and recoverable error states.
- Preserve user input after recoverable API failures.
- Cover domain behavior, permissions, validation, and critical user flows with automated tests.
- Keep public browser variables separate from server-only secrets.

## Out of scope for the challenge MVP

- Cloud deployment, Terraform, or production AWS resources.
- Password recovery and email delivery.
- Account settings or avatar management.
- User-defined category creation unless Turbo confirms it.
- AI features, summarization, embeddings, or LLM integrations.
- Real-time collaboration, sharing, and offline-first conflict resolution.
- Rich text, Markdown, attachments, and tags.
- P2 enhancements while any P0 or selected P1 acceptance criterion is incomplete.

These are valid future extensions, but implementing them before the P0 workflow would reduce challenge time available for correctness and polish.

## Open questions

1. The brief says **7 days** and later says **72 hours**. Which deadline governs the submission?
2. Does Turbo expect exact Figma tokens? The connected Figma MCP currently requires edit access to read variables and design context.
