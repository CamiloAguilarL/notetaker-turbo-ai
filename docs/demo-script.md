# Five-minute demo script

This script is deliberately evidence-first. Rehearse it once, keep the browser at a readable zoom, and do not spend recording time waiting for builds or typing long content.

## Before recording

1. Start the stack in the background:

   ```bash
   docker compose up --build -d
   ```

2. Create the idempotent local walkthrough account and enter a private local password when prompted:

   ```bash
   make seed-demo DEMO_EMAIL=demo@example.com
   ```

3. Run `make check` and `make e2e` before recording. Keep the final summaries available in a second terminal.
4. Open [http://localhost:3000](http://localhost:3000) at 1440×900, sign out, and close unrelated tabs or notifications.
5. Prepare the repository history with `git log --oneline --decorate -15` and make sure `git status --short` is empty.

Never reveal the demo password, `.env`, cookies, session identifiers, or private browser data in the recording.

## 0:00–0:35 — Product and source framing

Show the public landing page.

> “Turbo Notes is a private, focused notebook built for Turbo AI’s Senior Full Stack challenge. I extracted the required journey from the brief, the Figma prototype, and the walkthrough video, then protected that core before adding a few high-return enhancements. The result is a local monorepo with Next.js, Django REST Framework, and PostgreSQL.”

Point out the soft cream canvas, rounded pastel cards, quiet controls, and direct registration/sign-in actions. Avoid a long visual tour here.

## 0:35–1:05 — Authentication and privacy boundary

Open sign in, enter the prepared account off-camera or with the password field obscured, and submit.

> “Authentication uses Django sessions and CSRF protection. Notes are private by default: every category count, collection, detail update, delete, restore, and reorder operation is scoped to the authenticated owner.”

Briefly identify the account utility and sign-out control. Do not open Django admin.

## 1:05–1:55 — Dashboard and responsive visual system

Show the populated notebook.

> “The dashboard follows the source hierarchy instead of a generic admin template: a flat canvas, lightweight category navigation, minimal search and sort controls, and three-pixel rounded category borders. Category counts come from the API and the layout moves from one to three columns without changing the information hierarchy.”

Select School, return to All Categories, and briefly resize to a narrow viewport if the recording tool makes that smooth.

> “All filter and sort state lives in the URL, so reload, history navigation, and return-from-editor behavior remain predictable.”

## 1:55–2:40 — Editor and reliable autosave

Open “System design study plan,” edit one sentence, and change its category.

> “The editor keeps the paper-like category surface from the reference. Changes autosave after a short debounce through a serialized request queue. The status is announced as unsaved, saving, saved, or recoverable error, and closing flushes the latest draft before navigation.”

Close the note, reopen it, and point out that content and category persisted.

## 2:40–3:35 — Discovery and accessible manual organization

Search for “interview,” clear it, select Category sorting, then select Manual order in the unfiltered notebook.

> “Search is case-insensitive and composes with category and deterministic sorting. Manual mode persists the owner’s complete active-note order atomically. The client updates optimistically and restores the last confirmed order if the request fails.”

Use a visible drag handle once, then focus a move-earlier or move-later control and activate it with the keyboard.

> “Drag handles support pointer and touch. Explicit keyboard controls, position labels, screen-reader instructions, and live announcements make the same workflow available without visual coordinates.”

Reload to demonstrate persistence.

## 3:35–4:10 — Reversible deletion and interaction quality

Open a note, choose Delete, show the confirmation, confirm, then use Undo.

> “Deletion is a recoverable soft delete. The latest draft is flushed first, the note disappears from normal queries, and Undo restores the complete record. Motion is intentionally restrained to short transform and layout transitions. It respects the device’s reduced-motion preference and never replaces text feedback.”

## 4:10–4:45 — Engineering evidence

Switch to the terminal and show only the final summaries from `make check` and `make e2e`.

> “The local quality gate runs dependency auditing, Prettier, ESLint, TypeScript, Ruff, 38 frontend tests with enforced coverage, 24 backend tests with enforced coverage, and the Next.js production build. Playwright exercises the real journey at five viewports from 1440 to 390 pixels with responsive geometry assertions and Axe scans, ownership regressions are covered in the API suite, and the same Dockerized gate runs in GitHub Actions.”

Show two or three focused commits, not the entire log.

## 4:45–5:00 — AI use and prioritization

Return to the README AI section.

> “I used Codex to accelerate source inspection, requirement traceability, scaffolding, implementation, and repetitive browser verification. I independently reviewed every change and used tests, accessibility scans, production builds, visual comparison, and focused commits as evidence. P0 remained protected; pinning, shortcuts, and a full trash screen were deliberately deferred before quality or demo readiness.”

End on the product, not the terminal.
