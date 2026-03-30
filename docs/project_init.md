# Project Init

## Purpose

Use this file as the setup checklist for bringing a new repo onto this Cursor operating model.

This file also serves as the maintenance ledger for operating-model changes in this repo. When anything related to rules, commands, skills, hooks, CI, review flow, setup policy, or day-to-day operating-model usage is added, changed, or removed, update this file in the same change.

## Bootstrap Checklist

### Repo basics

- [ ] Confirm repository purpose, stack, and primary verification command.
- [ ] Add a source-aligned operating model doc at `docs/operating_model.md`.
- [ ] Add a short usage guide at `docs/operating_model_cheatsheet.md`.
- [ ] Decide whether root `AGENTS.md` will be a pointer file. Default: yes, pointer only.

### Cursor instruction layer

- [ ] Create `.cursor/rules/`.
- [ ] Add an always-apply workflow rule.
- [ ] Add at least one stack-specific rule pointing to canonical files.
- [ ] Add a planning rule tied to issue shape or acceptance criteria.
- [ ] Keep rules short and reference real files instead of copying large guidance.

### Reusable workflows

- [ ] Create `.cursor/commands/`.
- [ ] Add only repeatable slash workflows that the team will actually use.
- [ ] Create `.cursor/skills/` only for higher-value workflows that should not live in always-on rules.

### Review and verification

- [ ] Add `.github/pull_request_template.md`.
- [ ] Add `.github/workflows/` with the smallest real CI check set.
- [ ] Document only commands that exist in `package.json`.
- [ ] Add `lint`, `typecheck`, and `test` only after the corresponding tooling is installed.

### MCP and optional controls

- [ ] Add `.cursor/mcp.json` only when an MCP server is actually needed.
- [ ] Add `.cursor/hooks.json` only when a concrete policy or automation need exists.
- [ ] Document optional Bugbot, worktrees, or Team Rules only if they are in use.

## Current Operating Model Components

### Present in this repo

- `docs/operating_model.md`
- `docs/operating_model_cheatsheet.md`
- `docs/project_init.md`
- `.cursor/rules/workflow.mdc`
- `.cursor/rules/frontend-stack.mdc`
- `.cursor/rules/planning.mdc`
- `.cursor/commands/review-changes.md`
- `.cursor/commands/create-pr.md`
- `.cursor/commands/plan-issue.md`
- `.cursor/commands/create-issue.md`
- `.cursor/skills/operating-model-maintenance/SKILL.md`
- `AGENTS.md`
- `.github/pull_request_template.md`
- `.github/workflows/ci.yml`
- `.cursor/mcp.json`

### Current verification commands

- `npm run build`

### Current repo notes

- No `lint`, `typecheck`, or `test` script is installed yet.
- Hooks are documented in the operating model but not enabled in the repo.

## Change Log

### 2026-03-29

- Added `docs/operating_model.md` alignment to official Cursor artifacts and terminology.
- Added `docs/operating_model_cheatsheet.md` as the short, day-to-day operating-model usage guide.
- Refined `docs/operating_model_cheatsheet.md` into an end-to-end feature delivery checklist with prompt examples from issue creation through PR prep.
- Added `.cursor/rules/` starter rule set for workflow, planning, and frontend stack guidance.
- Added `AGENTS.md` as a minimal pointer to canonical rule and operating-model sources.
- Added `.cursor/commands/` starter commands for review, PR prep, and issue-to-plan work.
- Added `.cursor/skills/operating-model-maintenance/SKILL.md` for explicit maintenance of operating-model artifacts.
- Added `.github/pull_request_template.md` and `.github/workflows/ci.yml` for minimal review and build validation.

### 2026-03-30

- Renamed `docs/cursor_operating_model.md` to `docs/operating_model.md` and updated all references.
- Added `.cursor/commands/create-issue.md` for issue drafting aligned to the issue template.
- Standardized minimum GitHub status labels for issue lifecycle tracking.
- Removed `.cursor/plans` storage assumptions from operating-model docs and skills.

### 2026-03-31

- Simplified GitHub `status:*` lifecycle to four labels: `needs-plan`, `in-progress`, `in-review`, `done`.
- Documented PR body `Closes #` / `Fixes #` for automatic issue close on merge; updated `.cursor/commands/pr.md` and `.github/pull_request_template.md`.

### 2026-04-01

- Renamed `.cursor/commands/pr.md` to `create-pr.md` (slash: `/create-pr`).
- Renamed `.cursor/commands/review.md` to `review-changes.md` (slash: `/review-changes`).

## Update Rule

Whenever something affecting the operating model is installed, added, changed, or removed, update this file in the same change.

Minimum update steps:

1. Update the relevant checklist item or current-state inventory.
2. Add a dated changelog entry describing what changed and why.
3. If the change alters daily usage, update `docs/operating_model_cheatsheet.md` as well.
4. If the change alters working conventions or the conceptual model, update `docs/operating_model.md` or `.cursor/rules/` as well.
