# AGENTS.md

Binding workflow rules for AI agents and contributors working in this repository. Domain and product rules live in [documents/AGENTS.md](./documents/AGENTS.md); this file is about **how to work**.

## Git workflow — obey strictly

1. **Never push.** The repository owner pushes (and force-pushes) themselves. Commit locally only.
2. **One atomic commit per topic.** Never mix unrelated fixes, features, formatting, or docs in one commit.
3. **Conventional Commits** with the `recognizer` scope, e.g. `fix(recognizer): …`. The body explains the why, not just the what.
4. **Every commit bumps the version**: `version` in `package.json` and both version fields in `package-lock.json` (root and `packages[""]`). Patch bump per ordinary commit; minor bumps are deliberate milestone commits. No exceptions — the whole history follows this rule.
5. Never commit build output, test reports, caches, or scratch files.

## Quality gates — before every commit

Run the affected checks and keep them green; before finishing a task, run the full pipeline:

```bash
./localPipeline.sh        # format, doc links, lint, typecheck, unit tests, build, e2e
```

- E2E runs against the **production build** (`vite preview`), not the dev server.
- Prove fixes for real: break the fix and watch the guarding test fail, then restore it. UI changes get verified in a real browser (screenshots), across all three languages and mobile + desktop widths.

## After significant work

Self-review the changes (correctness, architecture, duplication, conventions). Fix what the review finds — each finding as its own atomic commit. Report findings honestly, including the ones deliberately not fixed and why.

## Code rules

- Game rules, timing, rankings, storage, and layout stay in framework-free TypeScript under `src/domain/` with injected randomness and time.
- Every user-facing string goes through the typed translation tables in `src/i18n/` in **all three languages** (en, hr, de) — a hardcoded UI string is a defect.
- Browser storage stays behind the versioned, validated adapter; migrate or repair old data, never discard user rankings for a repairable defect.
- Keep README and [documents/C4_architecture.md](./documents/C4_architecture.md) in sync with structural changes — same change set.
