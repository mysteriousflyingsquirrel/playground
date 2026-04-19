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
- [ ] `.cursor/hooks.json` and the remaining `.cursor/hooks/*.mjs` stay safe on all OSes (Node-based hooks here); trusted workspace required for hooks to run.

### GitHub issue status labels (automated workflow)

Create these labels once in the repository (UI or CLI):

- `status:todo`
- `status:in-progress`
- `status:in-review`
- `status:done`

Example:

```bash
gh label create "status:todo" --color 4D8CFE --description "Issue exists and local implementation has not started."
gh label create "status:in-progress" --color FBCA04 --description "Build / implementation in progress"
gh label create "status:in-review" --color 1D76DB --description "Local implementation or PR is awaiting review"
gh label create "status:done" --color 0E8A16 --description "Merged to dev; issue closed"
```

Only one `status:*` label should exist at a time. Hooks move issues from `todo` to `in-progress` to `in-review` when **coding-clanker** runs locally (`gh` must be installed and authenticated). **`github-clanker`** publishes the reviewed feature branch with a PR into `dev`. [issue-status-on-pr-merge.yml](../.github/workflows/issue-status-on-pr-merge.yml) applies `status:done`, removes the other status labels, and closes linked issues when a PR merges into `dev`.

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
| Project rules | `.cursor/rules/ui-system.mdc`, `.cursor/rules/architecture.mdc`, `.cursor/rules/git-workflow.mdc` |
| Skills | `.cursor/skills/plan-from-issue/`, `build-and-run/`, `code-review/`, `ui-review/`, `github-publish/` (each contains `SKILL.md`) |
| Subagents | `.cursor/agents/coding-clanker.md`, `code-review-clanker.md`, `ui-review-clanker.md`, `github-clanker.md` |
| Hooks | `.cursor/hooks.json`, `shell-policy.mjs`, `subagent-start-review-gate.mjs`, `subagent-stop-review-loop.mjs`, `issue-status-labels.mjs` |
| Architecture map | [docs/cursor-operating-model-architecture.md](cursor-operating-model-architecture.md) |
| Overview | [docs/cursor-system-overview.md](cursor-system-overview.md) |
| Doc index | [docs/cursor_sources.md](cursor_sources.md) |

### Notes

- No `lint`, `typecheck`, or `test` script is installed yet.
- The visible human workflow is: GitHub issue outside Cursor, `/plan-from-issue #n`, the accepted plan’s Build button, `/build-and-run`, `/code-review`, `/ui-review`, and `/github-publish #n`.
- `coding-clanker` owns implementation, review agents are report-only, and `github-clanker` owns commit, push, and PR publication. If cloud execution is introduced later, document auth, secrets, network, and testability prerequisites before relying on it.

## Change Log

### 2026-04-18

- Simplified the visible human UX to `Issue outside Cursor -> /plan-from-issue #n -> Build button -> /build-and-run -> /code-review -> /ui-review -> /github-publish #n -> Dev -> Human integration test -> Main`.
- Trimmed the workflow-specific hooks down to shell policy plus coding-clanker label automation, and removed older fix-loop and release-readiness skill steps from the main operating model.

### 2026-04-14

- Documented GitHub issue status labels (`status:todo`, `status:in-progress`, `status:in-review`, `status:done`); hooks + [.github/workflows/issue-status-on-pr-merge.yml](../.github/workflows/issue-status-on-pr-merge.yml) automate transitions around **coding-clanker** and PR merge to `dev`.

### 2026-04-12

- Added Cursor 3–aligned scaffold: `AGENTS.md`, `.cursor/rules`, `.cursor/skills`, `.cursor/agents`, `.cursor/hooks.json` + Node hook scripts, and [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md).

### 2026-04-11

- Removed the previous Cursor-oriented operating model (project rules, slash commands, skills, operating-model docs, and saved-plan policy) in preparation for a new operating model.
