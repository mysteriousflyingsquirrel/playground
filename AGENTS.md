# Project Instructions

Operating flow: **Issue → Plan → Build → Auto review → Fix loop → integrate on `dev` → human test → promote to `main`.** The canonical workflow contract lives here. Wiring and enforcement details live in [docs/cursor-operating-model-architecture.md](docs/cursor-operating-model-architecture.md). Prompt examples live in [docs/operating-model-tutorial.md](docs/operating-model-tutorial.md). Official Cursor product references are indexed in [docs/cursor_sources.md](docs/cursor_sources.md).

## Source-aligned principles

- Use [Plan Mode](https://cursor.com/docs/agent/plan-mode) for complex work. Every behavioral change starts from an accepted plan saved into the workspace.
- Use [subagents](https://cursor.com/docs/subagents) only where context isolation is worth it: `builder-agent`, `code-review-agent`, and `ui-review-agent`.
- Use [rules](https://cursor.com/docs/rules) for persistent guidance and [hooks](https://cursor.com/docs/hooks) for local guardrails. Do not rely on hooks alone for guarantees that belong on GitHub.
- Treat automation as local-first. If [cloud agent](https://cursor.com/docs/cloud-agent) execution is ever allowed, document auth, secrets, network, and testability prerequisites first.

## Branch policy (strict)

Subagents, cloud agents, and any automated actor in this workflow must:

- Work only in the **primary workspace clone**. **No `git worktree add`** and no extra linked checkout directories.
- Work only on a **feature branch**; **commit and push only that branch** to the remote.
- Open pull requests with **`gh pr create --base dev`** (or equivalent). **Never** use `--base main`.
- **Never** push, merge, or commit directly to **`dev`** or **`main`**. Integration onto `dev` is a **human** merge of the PR.

**`main`** is off limits for agents: no PRs to `main`, no pushes to `main`, no agent-driven merges into `main`. Moving work from `dev` to `main` is **human-only** after [release-readiness](.cursor/skills/release-readiness/SKILL.md).

## GitHub issue status labels

Only one of these labels should exist on an issue at a time:

- **`status:needs-plan`** — issue exists and Build has not started yet. This includes planning in progress and plan approved but builder not started.
- **`status:in-progress`** — `builder-agent` is actively building or fixing review findings on a feature branch.
- **`status:in-review`** — PR is open and ready for review or re-review.
- **`status:done`** — PR has been merged to `dev`, issue is closed, and branch cleanup is handled by automation. In this repo, `done` means **merged to `dev`**, not human-tested and not promoted to `main`.

Transition owners:

- Issue template applies **`status:needs-plan`**.
- Builder start hook applies **`status:in-progress`** and removes the other status labels.
- Builder stop hook applies **`status:in-review`** and removes the other status labels.
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

- `builder-agent` opens the PR with this structure.
- After each meaningful push, `builder-agent` or the fix loop refreshes the PR body with `gh pr edit` so the **Summary** stays current.
- `Closes #n` or `Fixes #n` must survive every PR body update because merge automation depends on it.

## Definitions

- **Accepted plan** — plan approved in Plan Mode and saved into the workspace, or a plan path/summary explicitly handed to `builder-agent`.
- **`[[BLOCKING]]`** — exact token that review agents must emit on its own line when merge should not proceed.
- **UI N/A** — parent skips `ui-review-agent` only when no file matching `src/**/*.{js,jsx,css}` changed.

## Single path (how to work)

1. **Issue** — Tie work to a GitHub issue ([.github/ISSUE_TEMPLATE/feature-bug-chore.yml](.github/ISSUE_TEMPLATE/feature-bug-chore.yml)). Keep the issue number in prompts, plan, and PR body. Issue starts as **`status:needs-plan`**.
2. **Plan** — Turn on [Plan Mode](https://cursor.com/docs/agent/plan-mode). Run **`/plan-from-issue`** once and get the plan accepted before any implementation. Save the accepted plan into the workspace before Build.
3. **Build** — Delegate **`builder-agent`** with the handoff checklist in [.cursor/agents/builder-agent.md](.cursor/agents/builder-agent.md): issue, accepted plan, acceptance criteria, branch name, and PR body contract. Builder creates the feature branch from latest `dev`, implements, runs **`npm run build`**, pushes that branch only, opens or updates the PR to **`dev`**, keeps the PR Summary current, and transitions the issue through **`status:in-progress`** and **`status:in-review`**.
4. **Auto review** — In order: delegate **`code-review-agent`**, then **`ui-review-agent`**, unless the change touches **no** UI-relevant files under `src/` (see [.cursor/agents/ui-review-agent.md](.cursor/agents/ui-review-agent.md)); if UI N/A, skip `ui-review-agent` and state that in the thread. Merge-blocking reviews must emit **`[[BLOCKING]]`**.
5. **Fix loop** — If any review includes **`[[BLOCKING]]`**, run **`/fix-from-review`**, then delegate **`builder-agent`** again on the **same** feature branch. Re-run **`npm run build`**, refresh the PR Summary, then re-run **`code-review-agent`** and **`ui-review-agent`** (with the same UI N/A rule) until there is no blocking. During each builder pass the issue returns to **`status:in-progress`**, then back to **`status:in-review`** when the PR is ready again.
6. **Dev** — **Human** merges the PR into **`dev`** on GitHub. On merge, automation sets issue **`status:done`**, closes linked issues, and deletes the merged feature branch (same-repo branches only).
7. **Human test** — Validate acceptance criteria on **`dev`** (deployed, preview, or local checkout). If this fails after merge, open a follow-up issue or reopen the original issue; this workflow does not add a separate QA label.
8. **Main** — Run **`/release-readiness`**, then **human** promotes **`dev` → `main`** only. Issue state does not change here.

## Rules and automation

- **Rules:** [.cursor/rules/git-workflow.mdc](.cursor/rules/git-workflow.mdc), [.cursor/rules/architecture.mdc](.cursor/rules/architecture.mdc), [.cursor/rules/ui-system.mdc](.cursor/rules/ui-system.mdc) when applicable.
- **Hooks:** [.cursor/hooks.json](.cursor/hooks.json) — hard pre-implementation gate requiring explicit `builder-agent` delegation for implementation/workflow-execution prompts, post-edit **`npm run build`** when `src/` changed, shell policy for PR base and risky `git push` (including bare pushes from `dev`/`main`), denial of **`git worktree add`**, subagent follow-up on **`[[BLOCKING]]`**, and builder start/stop label transitions. See the architecture doc for the wiring table.
- **GitHub Actions:** merge-to-`dev` workflows own **`status:done`**, issue closure, and merged branch deletion.
- **GitHub settings:** branch protection on `dev` and `main` should require pull requests and the required checks documented in [docs/project_init.md](docs/project_init.md).

## Verification

- Use only scripts defined in [package.json](package.json). Today that is **`npm run build`** after substantive app changes.
- Do not invent `lint`, `typecheck`, or `test` until those scripts exist.

## Maintenance

- Repo setup and inventory: [docs/project_init.md](docs/project_init.md).
- Cursor doc index: [docs/cursor_sources.md](docs/cursor_sources.md).
