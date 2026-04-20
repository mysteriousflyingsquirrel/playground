# Project Init

## Purpose

Setup and maintenance checklist for this repository (stack, CI, hygiene, and Cursor operating assets). Update this file when those areas change.

## Bootstrap Checklist

### Repo basics

- [ ] Confirm repository purpose, stack, and primary verification command.
- [ ] Keep root `AGENTS.md` aligned with how humans and agents are expected to work here.

### Cursor operating model (Cursor 3–aligned)

- [ ] Rules under `.cursor/rules/` match team policy; see [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md).
- [ ] Skills under `.cursor/skills/<name>/SKILL.md` stay in sync with workflow changes.
- [ ] Subagents under `.cursor/agents/*.md` reflect roles you actually delegate.
- [ ] `.cursor/hooks.json` and the remaining `.cursor/hooks/*.mjs` stay safe on all OSes (Node-based hooks here); trusted workspace required for hooks to run (see **Cursor hooks reliability** below).

### Cursor hooks reliability (issue labels)

Project hooks ([`.cursor/hooks.json`](../.cursor/hooks.json)) update GitHub `status:*` labels via **`subagentStart`** and **`subagentStop`** when **Task → coding-clanker** (or **github-clanker**) runs. If Cursor never executes those hooks, `gh issue edit` is never called from automation, regardless of terminal `gh` health. Official product behavior: [Cursor Hooks](https://cursor.com/docs/hooks) (project hooks, troubleshooting).

**Trust and workspace**

- [ ] Mark this repository folder as a **trusted workspace** (Command Palette → **Manage Workspace Trust**). Project hooks run only in trusted workspaces.
- [ ] Open **this repo** as the workspace root that contains `.cursor/hooks.json` (single-folder workspace, or a multi-root workspace where this folder is a root). Reopen the window after changing trust if hooks still do not run.

**Agent entrypoint**

- [ ] Trigger label hooks from **Agent Chat or Cmd+K** using the **Task** tool to delegate **coding-clanker** (for example **`/implement-plan #n`** or the plan **Build** step when it routes to coding-clanker). Include **`#<n>`** in the delegated task text so [`subagent-start-review-gate.mjs`](../.cursor/hooks/subagent-start-review-gate.mjs) can resolve the issue. Tab hooks are separate from these Agent lifecycle hooks.

**Verify in Cursor**

- [ ] Use **Cursor Settings → Hooks** to inspect configured hooks and whether **`subagentStart`** / **`subagentStop`** executed; open the **Hooks** output channel for errors (timeouts, JSON, missing **`node`**).
- [ ] Cursor watches `hooks.json` and reloads on save; if hooks are still absent, **restart Cursor**.

**Smoke test (labels)**

- [ ] Ensure the five `status:*` labels exist on GitHub (section below).
- [ ] Start **Task → coding-clanker** with **`#n`** in the task → confirm **`subagentStart`** in Hooks output and **`status:in-progress`** on the issue.
- [ ] Let the subagent finish **successfully** → confirm **`subagentStop`** ran and the issue shows **`status:in-review`** (or read any follow-up message if `gh issue edit` failed).

**If hooks still never run**

- **Remote / SSH:** Hooks receive `CURSOR_CODE_REMOTE` when applicable; confirm whether hooks run in your remote workspace (product behavior).
- **`node` on PATH:** Commands use `node .cursor/hooks/*.mjs`. If the Hooks channel shows spawn errors, fix PATH for Cursor’s environment or switch `hooks.json` to an absolute path to `node` after you confirm the path locally.
- **Timeouts:** [`hooks.json`](../.cursor/hooks.json) sets **`subagentStart`** timeout **8** (seconds). Slow `gh` or network can hit it; increase only if the Hooks output shows a timeout.

### GitHub issue status labels (automated workflow)

Create these labels once in the repository (UI or CLI):

- `status:todo`
- `status:in-progress`
- `status:in-review`
- `status:ready-to-merge`
- `status:done`

Example:

```bash
gh label create "status:todo" --color 4D8CFE --description "Issue exists and local implementation has not started."
gh label create "status:in-progress" --color FBCA04 --description "Build / implementation in progress"
gh label create "status:in-review" --color 1D76DB --description "Local implementation ready for build-and-run and review"
gh label create "status:ready-to-merge" --color 5319E7 --description "PR open into dev; awaiting human merge"
gh label create "status:done" --color 0E8A16 --description "Merged to dev; issue closed"
```

Only one `status:*` label should exist at a time. Hooks move issues from `todo` to `in-progress` to `in-review` when **coding-clanker** runs locally (`gh` must be installed and authenticated), then to **`status:ready-to-merge`** when **github-clanker** completes successfully. **`github-clanker`** publishes the reviewed feature branch with a PR into `dev`. [issue-status-on-pr-merge.yml](../.github/workflows/issue-status-on-pr-merge.yml) applies `status:done`, removes the other status labels, and closes linked issues when a PR merges into `dev`.

### GitHub branch protection and PR requirements

- [ ] Protect `dev` from direct pushes; require pull requests.
- [ ] Protect `main` from direct pushes; require pull requests.
- [ ] Require the repo's CI checks on PRs into `dev` and `main` (at minimum the current build check).
- [ ] Keep `.github/pull_request_template.md` aligned with the PR body contract: `## Summary`, `## Test plan`, and `Closes #n`.
- [ ] Keep merged-branch cleanup automation enabled for same-repo branches.

### Review and verification

- [ ] Keep `.github/pull_request_template.md` aligned with the current operating model.
- [ ] Add `.github/workflows/` with the smallest useful CI check set.
- [ ] Document only commands that exist in `package.json`.
- [ ] Add `lint`, `typecheck`, and `test` only after the corresponding tooling is installed.

## Current state

### Verification

- `npm run build`

### Cursor artifacts in this repo

| Area | Paths |
|------|--------|
| Agent instructions | [AGENTS.md](../AGENTS.md) |
| Project rules | `.cursor/rules/operating-model-build.mdc`, `.cursor/rules/ui-system.mdc`, `.cursor/rules/architecture.mdc`, `.cursor/rules/git-workflow.mdc` |
| Skills | `.cursor/skills/create-issue/`, `plan-from-issue/`, `build-and-run/`, `review/`, `github-publish/`, `sync-dev/` (each contains `SKILL.md`) |
| Subagents | `.cursor/agents/coding-clanker.md`, `review-clanker.md`, `github-clanker.md` |
| Hooks | `.cursor/hooks.json`, `shell-policy.mjs`, `subagent-start-review-gate.mjs`, `subagent-stop-review-loop.mjs`, `issue-status-labels.mjs` |
| Architecture map | [docs/cursor-operating-model-architecture.md](cursor-operating-model-architecture.md) |
| Overview | [docs/cursor-system-overview.md](cursor-system-overview.md) |
| Doc index | [docs/cursor_sources.md](cursor_sources.md) |

### Notes

- Styling: **Tailwind CSS v4** with the official **Vite plugin** (`tailwindcss`, `@tailwindcss/vite` in [package.json](../package.json)); conditional classes use **`clsx`** + **`tailwind-merge`** via [src/cn.js](../src/cn.js).
- No `lint`, `typecheck`, or `test` script is installed yet.
- The visible human workflow is: GitHub issue (`/create-issue feature|bug|chore …` or the web UI), `/plan-from-issue #n`, the accepted plan’s Build button, `/build-and-run`, `/review`, `/github-publish #n`, then merge on GitHub and `/sync-dev` locally.
- `coding-clanker` owns implementation, `review-clanker` is report-only, and `github-clanker` owns commit, push, and PR publication. If cloud execution is introduced later, document auth, secrets, network, and testability prerequisites before relying on it.

## Change Log

### 2026-04-19

- Documented **`/create-issue`** (slash skill + `gh issue create`) in [operating-model-tutorial.md](operating-model-tutorial.md), [cursor-system-overview.md](cursor-system-overview.md), and [.cursor/rules/git-workflow.mdc](../.cursor/rules/git-workflow.mdc); aligned **`plan-from-issue`** references and status-label owner text in [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md).
- Operating model: always-on Build delegation rule, `/build-and-run` steers to Cursor Browser, merged **`/review`** + **`review-clanker`**, and github-clanker hook sets **`status:ready-to-merge`** after publish.
- Issue status labels: added **`status:ready-to-merge`** after **`github-clanker`**; hardened hook **`gh`** invocation (Windows `gh.exe` resolution, git top-level `cwd`, richer failure logs).
- Documented **Cursor hooks reliability (Option A)**: trusted workspace, workspace root, Agent + Task path, Hooks settings UI and output channel, smoke test, and edge cases (`CURSOR_CODE_REMOTE`, `node` PATH, hook timeouts).

### 2026-04-18

- Simplified the visible human UX to `Issue outside Cursor -> /plan-from-issue #n -> Build button -> /build-and-run -> /code-review -> /ui-review -> /github-publish #n -> Dev -> Human integration test -> Main`.
- Trimmed the workflow-specific hooks down to shell policy plus coding-clanker label automation, and removed older fix-loop and release-readiness skill steps from the main operating model.

### 2026-04-14

- Documented GitHub issue status labels (`status:todo`, `status:in-progress`, `status:in-review`, `status:done`); hooks + [.github/workflows/issue-status-on-pr-merge.yml](../.github/workflows/issue-status-on-pr-merge.yml) automate transitions around **coding-clanker** and PR merge to `dev`.

### 2026-04-12

- Added Cursor 3–aligned scaffold: `AGENTS.md`, `.cursor/rules`, `.cursor/skills`, `.cursor/agents`, `.cursor/hooks.json` + Node hook scripts, and [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md).

### 2026-04-11

- Removed the previous Cursor-oriented operating model (project rules, slash commands, skills, operating-model docs, and saved-plan policy) in preparation for a new operating model.
