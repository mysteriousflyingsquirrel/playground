---
name: prepare-vibe
description: Prepares a safe exploratory feature branch from dev without creating a GitHub issue or implementing code. Use when the user asks to start vibe-coding, exploratory work, or quick experiments on a clean vibe/ branch.
---

# Prepare Vibe

## Purpose

Prepare a safe feature branch for exploratory work when there is no existing GitHub issue.

## Inputs

- Optional short topic from the user, for example: `prepare-vibe ui-cleanup`
- If no topic is provided, use a date-based or generic fallback name

## Rules

- Do not create a GitHub issue.
- Do not ask many questions.
- Do not implement code.
- Do not modify project files except Git branch state.
- Stop immediately after the branch is prepared and reported.
- If current branch is not `dev`, ask exactly one branch-state question with options and wait for user choice before continuing.

## Workflow

Follow these steps in order. If a step fails, stop and apply the matching failure handling below.

1. Identify topic input:
  - Parse optional topic text after `prepare-vibe`.
2. Check current branch.
  - If already on `dev`, continue.
  - If not on `dev`, ask what to do and stop until user chooses one option:
    - Move current changes to a new branch, then continue with `dev`.
    - Continue anyway by switching to `dev` directly.
    - Abort and stay on the current branch.
3. Check out local `dev` branch.
4. Sync local `dev` with remote `dev`:
  - Fetch remote updates.
  - Fast-forward local `dev` to match `origin/dev` when possible.
5. Build branch slug:
  - If topic exists: convert topic to a short lowercase slug using letters, numbers, and hyphens.
  - If no topic: use a simple fallback such as `vibe/YYYY-MM-DD` or `vibe/scratch`.
6. Create and check out the new branch from synced `dev`:
  - Branch format: `vibe/<slug>`
7. Verify current branch name.
8. Stop.

## Failure Handling

- If current branch is not `dev` and user did not choose an option:
  - Inform the user and pause.
  - Do not proceed with checkout/sync/branch creation.
- If checking out `dev` fails:
  - Inform the user and abort.
  - Suggest checking whether `dev` exists locally or remotely.
- If syncing `dev` fails:
  - Inform the user and abort.
  - Suggest pulling/fetching manually or resolving Git conflicts first.
- If creating the `vibe/` branch fails:
  - Inform the user and abort.
  - Suggest checking whether the branch already exists or whether the working tree is clean.
- On any failure:
  - Do not continue to later steps unless it is explicitly safe.

## Output Format

Return a short result containing:

1. The created branch name.
2. A reminder that exploratory work should happen on this branch.
3. A reminder that the user can later create a GitHub issue or PR if the work should be kept.

