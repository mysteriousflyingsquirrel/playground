# Cursor Operating Model (Source-Aligned)

## Purpose

Define a reusable, Cursor-docs-aligned operating model for software development with Cursor.

This model is grounded in Cursor's documented patterns:
- Plan-first development
- Agent-driven execution
- Verifiable goals
- Review as a system
- Rules, commands, skills, and hooks as layered controls

## Official References

- [Cursor Rules](https://www.cursor.com/docs/context/rules)
- [Cursor Agent Skills](https://cursor.com/docs/context/skills)
- [Cursor Hooks](https://cursor.com/docs/agent/hooks)
- [Cursor Bugbot](https://cursor.com/docs/bugbot)
- [Cursor Worktrees](https://www.cursor.com/docs/configuration/worktrees)
- [Cursor agent best practices](https://www.cursor.com/blog/agent-best-practices)

---

## 1. Core System Model

### 1.1 Intent Layer (Human)

- Defines the problem
- Sets constraints
- Resolves ambiguity
- Approves plans
- Validates outcomes

### 1.2 Planning Layer (Agent)

- Searches the codebase
- Identifies relevant files
- Maps dependencies
- Asks clarifying questions
- Produces a structured plan before implementation

### 1.3 Execution Layer (Agent)

- Writes and updates code
- Runs available project commands
- Iterates toward a verifiable outcome

### 1.4 Review Layer (Agent + Human)

- Local validation
- Local Agent Review
- PR review via CI and optional Bugbot
- Human validation before merge

### 1.5 Automation Layer

- Reusable slash commands
- CI workflows
- Optional scheduled or event-driven maintenance

### 1.6 Control Layer

- Project Rules
- Optional `AGENTS.md`
- Skills
- Optional Hooks
- Sandboxing and worktree isolation

---

## 2. Role Separation

### Human

- Defines intent
- Sets priority and scope
- Approves the plan
- Makes final trade-off decisions

### Agent

- Researches the codebase
- Proposes the implementation plan
- Executes the approved work
- Runs checks that exist in the repo
- Reviews and summarizes results

---

## 3. Canonical Workflow

1. Define the problem.
2. Use Plan Mode for non-trivial work.
3. Let the agent research the codebase.
4. Clarify missing or ambiguous requirements.
5. Approve the plan.
6. Implement.
7. Run available verification commands.
8. Review locally.
9. Open a pull request.
10. Review via CI, optional Bugbot, and human validation.
11. Merge.

Notes:
- Start a new conversation for a new task or when the current chat loses focus.
- Use `@Past Chats` when prior work is relevant.
- Tag files only when you know they are the right files; otherwise let the agent search.
- Resolve issue source early for planning workflows: GitHub issue URL/number versus pasted issue text.
- Use a single active `status:*` label per GitHub issue. Lifecycle: `status:needs-plan` (new) → `status:in-progress` (planning or coding) → `status:in-review` (PR open) → optionally `status:done` after merge.
- To **auto-close an issue when a PR merges**, include `Closes #<n>` or `Fixes #<n>` in the PR **body** (not only the title).

---

## 4. Persistent Components

### 4.1 `docs/operating_model.md`

Canonical explanation of the operating model and how Cursor artifacts fit together.

### 4.2 `docs/project_init.md`

Bootstrap checklist and maintenance ledger for operating-model changes across the repo.

### 4.3 `docs/operating_model_cheatsheet.md`

Short, day-to-day usage guide for applying the operating model in real work.

This file should stay concise, practical, and repo-truthful. It is not a replacement for this document.

### 4.4 `.cursor/rules/`

Primary source of project-specific agent guidance.

Use small `.mdc` files with clear scope:
- `alwaysApply: true` for global workflow rules
- `globs` for file-scoped rules
- `description` for intelligent/manual discovery

Rules should stay short, actionable, and point at canonical files with `@file` references instead of copying large guides.

### 4.5 `AGENTS.md`

Optional, human-readable pointer file at the repo root.

If used, keep it minimal and defer to `.cursor/rules/` and this document. It should not duplicate detailed instructions.

### 4.6 `.cursor/commands/`

Reusable slash workflows for repeatable operations such as review, PR preparation, or issue-to-plan translation.

### 4.7 `.cursor/skills/` and `.agents/skills/`

Project-level skills that package reusable workflows or domain-specific operating knowledge.

Use skills for tasks that are too specific or too heavy for always-on rules.
UI/UX guidance should become a skill only once it is a repeated workflow with stable conventions.

### 4.8 `.cursor/hooks.json`

Optional control point for policy and automation. Hooks should only be added once a concrete need exists, such as formatting, shell guardrails, or secret scanning.

### 4.9 `.github/workflows/` and `.github/pull_request_template.md`

CI and review scaffolding that turns expectations into explicit checks and review steps.

---

## 5. Verification Model

Cursor works best when the repo exposes real pass/fail signals.

Current rule for this repo:
- Reference only commands that actually exist
- Today, `npm run build` is the main verification command
- Keep command examples compatible with the primary local shell environment (PowerShell in this workspace)

Future additions such as `lint`, `typecheck`, and `test` should only be documented once they exist in `package.json`.

Testing principles:
1. Define expected behavior first.
2. Validate tests before implementation when using TDD.
3. Implement against the expected behavior.
4. Ensure checks pass.

Constraint:
- Do not modify tests just to force a pass.

---

## 6. Review Model

Use layered review rather than relying on a single checkpoint.

- During implementation: watch diffs and stop the agent if it heads in the wrong direction.
- Before push: run local checks and use local Agent Review when useful.
- On pull requests: rely on CI and optional Bugbot for automated review.
- Before merge: perform human review for correctness, scope, and trade-offs.

## 6.1 Mode Handoffs

Use explicit handoffs to reduce execution ambiguity:
- Plan approved -> move to implementation mode with approved scope only.
- Ask mode -> guidance and analysis only, no file or system changes.
- Debug mode -> runtime-evidence-first workflow before fixes.

## 6.2 Wrong Project / Port Triage

When UI behavior suggests the wrong project is loaded:
- Verify the active browser URL and dev server port.
- Restart the dev server on an explicit port when collisions are likely.
- Hard refresh after server/port changes to clear stale bundles.

---

## 7. Template Folder Structure

```text
repo-root/
├── .cursor/
│   ├── commands/
│   ├── rules/
│   └── skills/
├── .github/
│   ├── workflows/
│   └── pull_request_template.md
├── AGENTS.md
├── docs/
│   ├── operating_model.md
│   ├── operating_model_cheatsheet.md
│   └── project_init.md
├── src/
└── README.md
```

Notes:
- `.cursor/context/` is not part of the canonical template.
- `.agents/skills/` is also supported by Cursor, but this template defaults to `.cursor/skills/` for project-local discoverability.

---

## 8. Structural Principles

- Separate intent, planning, execution, review, and control.
- Keep persistent guidance small and version-controlled.
- Prefer discoverability over hidden conventions.
- Keep static context minimal; use search and plans for the rest.
- Preserve human override at every important decision point.

## 9. Documentation Maintenance

When the operating model changes, update the relevant docs in the same change:

- Update `docs/project_init.md` for setup impact, current-state inventory, and changelog.
- Update `docs/operating_model_cheatsheet.md` for day-to-day workflow changes.
- Update `docs/operating_model.md` when the conceptual model, artifact map, or repo conventions change.

---

## 10. Final Abstraction

Humans define intent.  
Agents plan, execute, and review.  
Rules and workflows shape repeatability.  
CI and review provide verification.  

Result: a reusable operating model for AI-driven software development with Cursor.
