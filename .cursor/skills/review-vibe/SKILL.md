---
name: review-vibe
description: Reviews implementation changes for vibe branches before publishing, without issue workflows. Use when the user asks for review-vibe or requests a non-issue pre-PR review of local changes.
---

# Review Vibe

## Goal

Run a reusable, implementation-focused review step for non-issue work before opening a pull request.

## Scope And Boundaries

- Trigger only when explicitly requested as `review-vibe`.
- Use GitHub CLI (`gh`) for GitHub checks if needed, but do not post comments or update issue labels.
- Do not use GitHub MCP.
- Do not implement new code unless the user explicitly asks for fixes after the review.
- Do not create a pull request.
- Do not merge anything.

## Workflow

1. Inspect local implementation context.
2. Compare implementation against requested scope and branch intent.
3. Run relevant verification commands.
4. Decide review result: passed or blocked.
5. Return a structured review summary and stop.

## Step-By-Step Procedure

### 1) Inspect Branch And Changes

Inspect:

```bash
git branch --show-current
git status --short
git diff --name-only
```

Branch safety gate:

- If current branch is `main` or `dev`, warn the user and abort unless the user explicitly confirms this is intended.

Change inspection requirements:

- Summarize changed files and high-level purpose.
- Check whether branch name and changed files appear aligned with branch intent.
- Check for obvious unrelated changes.

Failure handling:

- If changed files cannot be inspected, inform the user and abort.
- On this failure, do not continue.

### 2) Compare Implementation To Intent

- Review user-requested scope and expected outcome against the observed implementation.
- If UI files changed, read `docs/design/design-system.md` and review the implementation against it.
- Explicitly review UI-related changes against `.cursor/rules/03-design-system.mdc`.
- Determine:
  - covered expectations
  - partially covered expectations
  - missing expectations
  - risks or ambiguities
- For UI changes, record whether design-system usage is compliant, partially compliant, or non-compliant, with concrete evidence for any deviations.

### 3) Verification Commands

- Run relevant repository verification commands when discoverable (for example test/lint/build commands defined in project docs or scripts).
- If no reliable command is discoverable quickly, recommend the most relevant verification command(s) instead of inventing commands.

Failure handling:

- If verification commands fail, report the failure and treat it as a blocker unless the user explicitly says otherwise.

### 4) Decide Result

- **Passed**: no blockers, expected scope appears satisfied, and no critical verification failures.
- **Blocked**: any blocker exists (missing expectations, critical risk, unrelated changes requiring cleanup, or verification failure not waived by user).

### 5) Return Review Summary

- Return a structured local review summary only.
- Do not post GitHub comments.
- Do not edit issue labels.

## Safe-Stop Rules

On any failure, do not continue to later steps unless it is explicitly safe.

Safe examples:

- Verification command missing: continue with explicit "not run" and recommendation.

Unsafe examples:

- Branch safety gate failed without user confirmation.
- Change inspection failed.

## Final Output Format

Always include:

- branch
- review result: `passed` or `blocked`
- expectations review
- changed files summary
- verification performed
- design-system compliance review for UI-related changes (against `.cursor/rules/03-design-system.mdc`)
- blockers or risks
- next recommended action

Use this template:

```markdown
Branch: <branch-name>
Review result: <passed|blocked>

Expectations review:
- <expectation>: <covered|partial|missing> - <evidence>

Changed files summary:
- <area/file group>: <what changed>
- Unrelated changes: <none|details>

Verification performed:
- <command>: <pass|fail|not run> - <notes>

Design-system compliance (UI changes):
- <compliant|partial|non-compliant> - <evidence and deviations>

Blockers or risks:
- <none|itemized blockers/risks>

Next recommended action:
- <single best next step>
```
