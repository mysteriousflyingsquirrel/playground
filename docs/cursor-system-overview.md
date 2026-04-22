# Cursor System Overview

This file is an **index**, not a second workflow specification.

Use it to understand how the repo maps Cursor product concepts to local files. The canonical operating model lives in:

- [AGENTS.md](../AGENTS.md) — source of truth for the workflow contract
- [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md) — rules, hooks, subagents, and GitHub automation wiring
- [operating-model-tutorial.md](operating-model-tutorial.md) — copy-paste prompts for each step
- [cursor_sources.md](cursor_sources.md) — official Cursor doc index used by this repo

## Cursor concepts used here


| Cursor concept                                                                   | Repo usage                                                                                              |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [Plan Mode](https://cursor.com/docs/agent/plan-mode)                             | Required for complex feature work before `**/implement-issue`**                                          |
| [Subagents](https://cursor.com/docs/subagents)                                   | `coding-clanker`, `review-clanker`, `github-clanker`                                                    |
| [Rules](https://cursor.com/docs/rules)                                           | Persistent workflow, git, architecture, and UI guidance                                                 |
| [Hooks](https://cursor.com/docs/hooks)                                           | Minimal local safety checks for shell policy, coding-clanker start validation, and review-loop nudges |
| [Cloud Agent best practices](https://cursor.com/docs/cloud-agent/best-practices) | Treated as future-facing guidance; this repo is local-first unless cloud prerequisites are documented   |


## Repo operating model at a glance

Issue (GitHub UI or `/create-issue`) → `/plan-issue #n` → `/implement-issue #n` → `/build-and-run [app]` → `/review-issue #n` → `/publish-issue #n` → Dev (merge on GitHub) → `/sync-dev` → Human integration test → Main

- **Issue** starts as `status:todo`; successful `**/plan-issue #n`** sets `status:ready-to-implement`, successful `**/implement-issue #n`** sets `status:ready-to-review`, successful `**/review-issue #n`** sets `status:ready-to-publish` (or `status:blocked` on `[[BLOCKING]]`), and successful `**/publish-issue #n`** sets `status:ready-to-merge` until merge to `dev`
- **Implementation** is `**/implement-issue #n`** → **Task** → `coding-clanker`. Cursor’s Plan **Build** button (if used) is only steerable via rules, not hard-bound from the repo (see [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md))
- `**/build-and-run`** installs if needed, runs `npm run build`, starts the app, and opens the local URL with Cursor’s **Browser** tool (in-IDE)
- `**/review-issue #n`** delegates `review-clanker` (code + UI; `**UI: N/A**` when no UI files changed)
- `**/publish-issue**` delegates `github-clanker`
- **Dev** merge to `dev` sets `status:done`, closes the issue, and deletes the merged same-repo branch
- `**/sync-dev`** updates the local clone to `**dev**` after that merge (fetch, checkout `dev`, pull `origin dev`)
- **Human integration test** happens after merge to `dev`
- **Main** promotion is human-only

## Where to look for details

- Workflow and definitions: [AGENTS.md](../AGENTS.md)
- Hook behavior and enforcement map: [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md)
- Prompt recipes: [operating-model-tutorial.md](operating-model-tutorial.md)
- Setup and GitHub settings: [project_init.md](project_init.md)