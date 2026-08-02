# Submission checklist

Use this list after implementation freezes. It separates repository readiness from the external actions that still require the candidate’s GitHub, recording, and submission-form accounts.

## Repository preflight

- [ ] `git status --short` is empty and no local `.env`, database, coverage output, Playwright artifact, or editor state is tracked.
- [ ] `docker compose config --quiet` succeeds from a fresh `.env` copied from `.env.example`.
- [ ] `make check` passes from the supported Docker environment.
- [ ] `make e2e` passes for desktop, tablet, and mobile.
- [ ] `docker compose ps` shows healthy `db`, `api`, and `web` services.
- [ ] Web, API health, and Django admin open on ports 3000, 8000, and 8000 respectively; PostgreSQL maps to 5432.
- [ ] The README quick start, environment tables, feature status, AI-use claims, and deferred scope match the code.
- [ ] The demo seed command is idempotent and no password appears in source or shell history.
- [ ] The focused commit history is understandable without squashing or rewriting it.

## Public GitHub repository

- [ ] Create or confirm the intended public repository.
- [ ] Push the complete `main` branch without force-pushing or rewriting the recorded history.
- [ ] Confirm GitHub Actions passes on the public commit.
- [ ] Open the repository in a signed-out/incognito browser and verify that README links and images render.
- [ ] Confirm `.env` is absent and `.env.example` contains local-only placeholders rather than real credentials.
- [ ] Copy the exact public repository URL for the submission form.

## Demo video

- [ ] Follow [the five-minute script](demo-script.md) and keep the final recording at or below five minutes.
- [ ] Record in English at a readable resolution with notifications hidden.
- [ ] Do not expose passwords, `.env`, cookies, tokens, private note data, or unrelated tabs.
- [ ] Show the real local application, persistence after reload, one keyboard-accessible enhancement, and concise quality evidence.
- [ ] Listen to the uploaded result once and verify audio, focus, text readability, and sharing permissions.
- [ ] Open the video link in a signed-out/incognito browser.

## Submission form

- [ ] Provide the public GitHub URL.
- [ ] Provide the accessible demo-video URL.
- [ ] State that the application is intentionally local-only and requires Docker Desktop with Compose v2.
- [ ] Do not claim deployment, collaboration, rich text, offline sync, or other deferred features.
- [ ] Open every submitted link one final time before sending the form.

The repository cannot perform the GitHub publication, recording, permission, or form-submission steps without the candidate’s accounts. Those are the only intentionally external handoff actions.
