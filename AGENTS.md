# Project Instructions

Operating flow: **Issue on GitHub → `/plan-from-issue #n` → Plan Build button → `coding-clanker` → `/build-and-run [app]` → `/review` → `/github-publish #n` → merge to `dev` → `/sync-dev` → human integration test → merge to `main`.** The canonical workflow contract lives here. Wiring and enforcement details live in [docs/cursor-operating-model-architecture.md](docs/cursor-operating-model-architecture.md). Command examples live in [docs/operating-model-tutorial.md](docs/operating-model-tutorial.md). Official Cursor product references are indexed in [docs/cursor_sources.md](docs/cursor_sources.md).

## Source-aligned principles

- Use [Plan Mode](https://cursor.com/docs/agent/plan-mode) for complex work. Every behavioral change starts from an accepted plan saved into the workspace.
- Keep the human surface minimal: GitHub issue outside Cursor, then only the Build button and the repo’s slash skills.
- Use [subagents](https://cursor.com/docs/subagents) only where context isolation is worth it: `coding-clanker`, `review-clanker`, and `github-clanker`.
- Use [rules](https://cursor.com/docs/rules) for persistent guidance and a **small** [hook](https://cursor.com/docs/hooks) set for Git safety and issue labels.
- Treat automation as local-first. If [cloud agent](https://cursor.com/docs/cloud-agent) execution is ever allowed, document auth, secrets, network, and testability prerequisites first.
- Cursor does **not** expose a repo-local way to hard-bind the Plan Build button to a named subagent. This repo steers Build toward `coding-clanker`, but that routing is best-effort rather than a hard product guarantee.

## Branch policy (strict)

Subagents, cloud agents, and any automated actor in this workflow must:

- Work only in the **primary workspace clone**. **No `git worktree add`** and no extra linked checkout directories.
- Work only on a **feature branch**. `coding-clanker` creates or reuses the branch for implementation. `github-clanker` may commit and push **only that branch**.
- Open pull requests with **`gh pr create --base dev`** (or equivalent). **Never** use `--base main`.
- **Never** push, merge, or commit directly to **`dev`** or **`main`**. Integration onto `dev` is a **human** merge of the PR.

**`main`** is off limits for agents: no PRs to `main`, no pushes to `main`, and no agent-driven merges into `main`. Moving work from `dev` to `main` is **human-only** after human integration checks on `dev`.

## GitHub issue status labels

Only one of these labels should exist on an issue at a time:

- **`status:todo`** — issue exists and local implementation has not started yet.
- **`status:in-progress`** — `coding-clanker` is actively building or reworking on a feature branch.
- **`status:in-review`** — local implementation is ready for `/build-and-run`, review-agent feedback, or an open PR.
- **`status:done`** — PR has been merged to `dev`, issue is closed, and branch cleanup is handled by automation. In this repo, `done` means **merged to `dev`**, not human-tested and not promoted to `main`.

Transition owners:

- Issue template applies **`status:todo`**.
- Coding-clanker start hook applies **`status:in-progress`** and removes the other status labels.
- Coding-clanker stop hook applies **`status:in-review`** and removes the other status labels.
- Github-clanker successful completion hook applies **`status:in-review`** and removes the other status labels (re-asserts PR review state).
- Merge-to-`dev` GitHub Action applies **`status:done`**, removes the other status labels, closes the issue, and deletes the merged same-repo feature branch.

## PR body contract

Every PR must include and keep current:

```md
## Summary
- Bullet list of what changed

## Test plan
- [ ] Verification step(s)

Closes #n
```

- `github-clanker` opens or updates the PR with this structure.
- After each meaningful push, `github-clanker` refreshes the PR body with `gh pr edit` so the **Summary** stays current.
- `Closes #n` or `Fixes #n` must survive every PR body update because merge automation depends on it.

## Definitions

- **Accepted plan** — plan approved in Plan Mode and saved into the workspace.
- **`[[BLOCKING]]`** — exact token that review agents must emit on its own line when Build, publish, or merge should not proceed.
- **UI N/A** — inside **`review-clanker`** output: the **UI findings** section is exactly **`UI: N/A`** when no file matching `src/**/*.{js,jsx,css}` changed.

## Single path (how to work)

1. **Issue** — Create and maintain the GitHub issue outside Cursor using [.github/ISSUE_TEMPLATE/feature-bug-chore.yml](.github/ISSUE_TEMPLATE/feature-bug-chore.yml). Issue starts as **`status:todo`**.
2. **Plan** — Turn on [Plan Mode](https://cursor.com/docs/agent/plan-mode) and run **`/plan-from-issue #42`**. The issue itself is the source of truth; no second issue prompt is needed. The accepted plan should carry the issue number and recommended branch naming clearly enough for Build.
3. **Build** — Click **Build** on the accepted plan. This repo is configured so Build should route to **`coding-clanker`**. Coding clanker creates or reuses the feature branch from latest `dev`, implements locally, runs **`npm run build`**, leaves the working tree ready for review, and transitions the issue through **`status:in-progress`** and **`status:in-review`**. Coding clanker does **not** commit, push, or open or update the PR. If Cursor does not route Build correctly, retry with a manual `coding-clanker` delegation as a fallback.
4. **Human feature review/test** — Run **`/build-and-run`** (or **`/build-and-run appname`** in a multi-app repo). That command installs dependencies if needed, runs **`npm run build`**, starts the app locally, and opens the app URL with Cursor’s **Browser** tool (in-IDE), not the OS default browser. If feedback requires implementation changes, use the accepted plan’s **Build** step again.
5. **Manual review** — Run **`/review`**. This delegates **`review-clanker`** (combined code and UI report). If the result contains **`[[BLOCKING]]`**, go back to **Build**, then re-run **`/build-and-run`** and **`/review`**.
6. **GitHub publish** — Run **`/github-publish #42`** only after local review is ready. This delegates **`github-clanker`** to commit the current feature branch, push only that branch, and create or update one PR into **`dev`**.
7. **Dev** — **Human** merges the PR into **`dev`** on GitHub. On merge, automation sets issue **`status:done`**, closes linked issues, and deletes the merged feature branch (same-repo branches only). Run **`/sync-dev`** so this clone checks out **`dev`** and matches **`origin/dev`** before the next feature.
8. **Human integration test** — Validate acceptance criteria on **`dev`** (deployed, preview, or local checkout). If this fails after merge, open a follow-up issue or reopen the original issue.
9. **Main** — **Human** promotes **`dev` → `main`** only. Issue state does not change here.

## Rules and automation

- **Rules:** [.cursor/rules/operating-model-build.mdc](.cursor/rules/operating-model-build.mdc), [.cursor/rules/git-workflow.mdc](.cursor/rules/git-workflow.mdc), [.cursor/rules/architecture.mdc](.cursor/rules/architecture.mdc), [.cursor/rules/ui-system.mdc](.cursor/rules/ui-system.mdc) when applicable.
- **Hooks:** [.cursor/hooks.json](.cursor/hooks.json) — shell policy for PR base and risky `git push`, denial of **`git worktree add`**, coding-clanker and github-clanker issue label transitions, and `[[BLOCKING]]` follow-up nudges. See the architecture doc for the wiring table.
- **GitHub Actions:** merge-to-`dev` workflows own **`status:done`**, issue closure, and merged branch deletion.
- **GitHub settings:** branch protection on `dev` and `main` should require pull requests and the required checks documented in [docs/project_init.md](docs/project_init.md).

## Verification

- Use only scripts defined in [package.json](package.json). Today that is **`npm run build`** after substantive app changes.
- Do not invent `lint`, `typecheck`, or `test` until those scripts exist.

## Maintenance

- Repo setup and inventory: [docs/project_init.md](docs/project_init.md).
- Cursor doc index: [docs/cursor_sources.md](docs/cursor_sources.md).
