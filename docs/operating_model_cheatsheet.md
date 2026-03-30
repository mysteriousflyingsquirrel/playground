# Operating Model Cheatsheet

## When To Use This

Use this file as the fast guide for working inside this repo's Cursor operating model.

Use `docs/operating_model.md` for the full explanation and `docs/project_init.md` for setup and maintenance tracking.

## Feature Delivery Checklist

### 1. Create A GitHub Issue

Goal:
Capture the problem, expected outcome, and rough acceptance criteria before implementation starts.

Do this:
Use the existing issue template in `.github/ISSUE_TEMPLATE/feature-bug-chore.yml`.
Use `/create-issue` when you want the agent to draft issue content against this template.
Use exactly one active `status:*` label at a time:

| Phase | Label |
|--------|--------|
| New issue | `status:needs-plan` |
| Planning or implementation active | `status:in-progress` |
| PR open, awaiting merge | `status:in-review` |
| After merge (optional) | `status:done` |

When you open a PR, put **`Closes #issue`** or **`Fixes #issue`** in the PR body so GitHub closes the issue on merge (labels alone do not close issues).

Example:

```text
Create a feature issue for [feature name].

Problem / Goal:
[what is missing]

Expected Outcome:
[what should exist after implementation]

Acceptance Criteria:
- [ ] ...
- [ ] ...
- [ ] ...
```

Adapt this by replacing the placeholders with the smallest useful scope for the feature.
Keep exactly one active `status:*` label per issue.

Shortcut:

```text
/create-issue
```

### 2. Start A Fresh Cursor Chat

Goal:
Keep feature work isolated from unrelated prior context.

Do this:
Open a new chat for each new feature or major bugfix.

Example prompt:

```text
I want to implement this feature from GitHub issue #[number].
Please research the codebase first and prepare a plan before making changes.
```

Add links, screenshots, or extra constraints only if they materially affect implementation.

### 3. Ask For A Plan In Plan Mode

Goal:
Get a phased implementation plan with real files, risks, and verification steps before any edits happen.

Do this:
Tell the agent to use Plan Mode for non-trivial work.
Resolve the issue source up front (GitHub issue URL/number vs pasted issue text).

Example prompt:

```text
Use Plan Mode for this feature.
First confirm whether the source is a GitHub issue link/number or pasted issue text.
Research the relevant files, ask clarifying questions if needed, and give me a phased plan with concrete file paths, risks, and verification steps.
```

If the task is small, you can shorten this, but keep the request for concrete file paths and verification.

### 4. Refine And Approve The Plan

Goal:
Make sure the plan matches the intended scope and only references real repo capabilities.

Do this:
Review files, risks, commands, and out-of-scope items before approving implementation.

Example prompt:

```text
Revise the plan so it stays within this scope:
- [scope constraint]
- [scope constraint]

Only include commands that already exist in this repo.
```

Use this when the first plan is too broad, misses a constraint, or suggests commands the repo does not support.

### 5. Implement The Approved Plan

Goal:
Execute the accepted scope without drifting into adjacent work.

Do this:
Tell the agent to implement the approved plan and keep changes scoped.

Example prompt:

```text
Implement the approved plan now.
Keep the work scoped to the accepted steps.
If the operating model changes, update the relevant docs in the same change.
```

Add explicit exclusions if you want to protect scope further.

### 6. Verify With Real Commands

Goal:
Use the repo's actual pass/fail signals.

Do this:
Ask the agent to run only commands that already exist in `package.json`.

Example prompt:

```text
Run the relevant verification for this feature.
In this repo, use the real commands that exist and summarize the results.
```

Today that usually means `npm run build`.

### 7. Review Changes Locally

Goal:
Catch bugs, regressions, and missing verification before PR creation.

Do this:
Ask for a review pass that prioritizes findings over praise.

Example prompt:

```text
Review the current changes for bugs, regressions, and missing verification.
List findings first, then open questions, then a short summary.
```

Shortcut:

```text
/review-changes
```

### 8. Prepare The PR

Goal:
Turn the finished work into a review-ready summary with verification notes.

Do this:
Ask for PR content that includes scope, validation, and any operating-model updates.
Require verification command/result, plan reference, screenshot policy (or explicit waiver), and follow-up notes.

Example prompt:

```text
Prepare the PR contents for these changes.
Include a concise title, summary, plan reference (if any), verification commands and pass/fail status, screenshot attachment or explicit waiver for UI changes, and note any operating-model docs updated.
```

Shortcut:

```text
/create-pr
```

### 9. Update Operating-Model Docs When Needed

Goal:
Keep the operating model accurate whenever the workflow or supporting assets change.

Do this:
Update the right doc based on what changed.

- If setup or tracked assets changed: update `docs/project_init.md`
- If daily workflow changed: update `docs/operating_model_cheatsheet.md`
- If structure, concepts, or artifact mapping changed: update `docs/operating_model.md`

Example prompt:

```text
This feature changed the operating model.
Update the relevant operating-model docs in the same change and summarize what changed.
```

## Standard Flow

1. Create or refine the GitHub issue.
2. Start a fresh Cursor chat.
3. Use Plan Mode for non-trivial work.
4. Approve the plan.
5. Implement only the approved scope.
6. Run real verification commands.
7. Review locally.
8. Prepare the PR.

## When To Start A New Chat

- Start a new chat for a new task or feature.
- Start a new chat when the current conversation has become noisy or confused.
- Stay in the same chat when you are still iterating on the same task.

## When To Use `@Past Chats`

- Use `@Past Chats` when earlier work is relevant but you want a fresh conversation.
- Prefer this over copying large amounts of old chat context.

## When To Edit Rules Vs Commands Vs Skills

### Edit `.cursor/rules/` when:

- the guidance should persist across normal work
- the agent keeps making the same repo-specific mistake
- you need file-scoped or always-apply instructions

### Edit `.cursor/commands/` when:

- a slash workflow is repeated often
- the process is step-based and should be easy to invoke on demand

### Edit `.cursor/skills/` when:

- the workflow is specialized or heavier than an always-on rule
- the process benefits from an explicit reusable capability

## Common Prompt Patterns

Plan a feature:

```text
Use Plan Mode for this feature.
Research the relevant files, ask clarifying questions if needed, and give me a phased plan with concrete file paths, risks, and verification steps.
```

Implement an approved plan:

```text
Implement the approved plan now.
Keep the work scoped to the accepted steps.
If the operating model changes, update the relevant docs in the same change.
```

Review local changes:

```text
Review the current changes for bugs, regressions, and missing verification.
List findings first, then open questions, then a short summary.
```

Prepare a PR:

```text
Prepare the PR contents for these changes.
Include a concise title, summary, plan reference (if any), verification commands and pass/fail status, screenshot attachment or explicit waiver for UI changes, and note any operating-model docs updated.
```

Update operating-model docs:

```text
This feature changed the operating model.
Update the relevant operating-model docs in the same change and summarize what changed.
```

## Repo-Specific Truths

- Current verification command: `npm run build`
- Do not document `lint`, `typecheck`, or `test` until those commands actually exist in `package.json`.
- Root `AGENTS.md` is only a pointer; canonical guidance lives in `.cursor/rules/`.
- This workspace runs on Windows PowerShell, so command examples should be PowerShell-compatible.

## Mode Handoffs

- Plan approved -> switch to implementation mode and execute only approved scope.
- Ask mode -> provide guidance only; do not edit files.
- Debug mode -> use runtime evidence before proposing or applying fixes.

## Wrong Project / Port Triage

- Confirm the browser URL and dev-server port match the intended repo.
- If content/title appears from a different project, restart on an explicit port (for example `npm run dev -- --port 4173 --strictPort`).
- After switching ports/servers, perform a hard refresh to clear stale bundle state.

## What To Update When The Operating Model Changes

Update these in the same change as needed:

- `docs/project_init.md` for setup impact, inventory, and changelog
- `docs/operating_model_cheatsheet.md` for daily workflow changes
- `docs/operating_model.md` for conceptual or structural changes
- the relevant `.cursor/` or `.github/` artifact that actually changed

## Quick Links

- Operating model: `docs/operating_model.md`
- Project init: `docs/project_init.md`
- Rules: `.cursor/rules/`
- Commands: `.cursor/commands/`
- Skills: `.cursor/skills/`
- PR template: `.github/pull_request_template.md`
