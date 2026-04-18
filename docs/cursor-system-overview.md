# Cursor System Overview

This file is an **index**, not a second workflow specification.

Use it to understand how the repo maps Cursor product concepts to local files. The canonical operating model lives in:

- [AGENTS.md](../AGENTS.md) — source of truth for the workflow contract
- [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md) — rules, hooks, subagents, and GitHub automation wiring
- [operating-model-tutorial.md](operating-model-tutorial.md) — copy-paste prompts for each step
- [cursor_sources.md](cursor_sources.md) — official Cursor doc index used by this repo

## Cursor concepts used here

| Cursor concept | Repo usage |
|---|---|
| [Plan Mode](https://cursor.com/docs/agent/plan-mode) | Required for complex feature work before Build |
| [Subagents](https://cursor.com/docs/subagents) | `builder-agent`, `code-review-agent`, `ui-review-agent` |
| [Rules](https://cursor.com/docs/rules) | Persistent workflow, git, architecture, and UI guidance |
| [Hooks](https://cursor.com/docs/hooks) | Local safety checks for prompts, shell commands, and review follow-ups |
| [Cloud Agent best practices](https://cursor.com/docs/cloud-agent/best-practices) | Treated as future-facing guidance; this repo is local-first unless cloud prerequisites are documented |

## Repo operating model at a glance

Issue → Plan → Build → Auto review → Fix loop → Dev → Human test → Main

- **Issue** starts as `status:needs-plan`
- **Build** runs only through `builder-agent`
- **Auto review** runs `code-review-agent`, then `ui-review-agent` when UI changed
- **Dev** merge to `dev` sets `status:done`, closes the issue, and deletes the merged same-repo branch
- **Human test** happens after merge to `dev`
- **Main** promotion is human-only

## Where to look for details

- Workflow and definitions: [AGENTS.md](../AGENTS.md)
- Hook behavior and enforcement map: [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md)
- Prompt recipes: [operating-model-tutorial.md](operating-model-tutorial.md)
- Setup and GitHub settings: [project_init.md](project_init.md)
