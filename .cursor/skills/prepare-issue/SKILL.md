---
name: prepare-issue
description: Prepares an existing GitHub issue for Cursor Plan Mode by creating a synced feature branch and generating a planning prompt.
--- 

# Prepare Issue

## Goal

Given an issue reference like `prepare-issue #23`, prepare planning context and branch state, then stop.

## Behavior Rules

- Do not ask clarifying questions.
- Do not implement code.
- Do not modify project files except Git branch state.
- Operate in a project-agnostic way. Do not assume any specific stack, product, architecture, or infrastructure.
- Stop immediately after branch preparation and Plan Mode prompt output.
- Treat `.github/ISSUE_TEMPLATE/issue.yml` as the single source of truth for issue structure.

## Input

- Accept an issue number from the user command, e.g. `#23` in `prepare-issue #23`.
- Parse the issue number as an integer and validate it before continuing.

## Required Workflow

1. Read `.github/ISSUE_TEMPLATE/issue.yml` from the current repository.
2. Parse the template to determine:
  - required fields/sections
  - details structure and headings
  - where acceptance criteria live in the issue body
3. Read the issue from GitHub via `gh`.
4. Map extracted issue content according to the current template structure.
5. Check out local `dev`.
6. Sync local `dev` with remote `dev`.
7. Create a new feature branch from `dev`.
8. Name the branch using:
  - issue number
  - short slug derived from issue title (lowercase, hyphen-separated, alphanumeric plus hyphens)
  - example format: `feature/23-short-title`
9. Replace the current status label with `status:in-planning` (do not stack status labels).
10. Generate and show a Plan Mode prompt for the user to paste.
11. Stop.

## Failure Handling

Follow these guards exactly:

- If reading the GitHub issue fails:
  - inform the user
  - abort
  - suggest checking issue number, `gh` authentication, or repository remote configuration
- If checking out `dev` fails:
  - inform the user
  - abort
  - suggest checking whether `dev` exists locally or remotely
- If syncing `dev` fails:
  - inform the user
  - abort
  - suggest pulling/fetching manually or resolving Git conflicts first
- If creating the feature branch fails:
  - inform the user
  - abort
  - suggest checking whether the branch already exists or whether the working tree is clean
- If updating issue label fails:
  - inform the user
  - keep the prepared branch if it was already created
  - explain exactly which labels must be removed and which single status label must be added manually
  - continue only to showing the Plan Mode prompt if branch prep succeeded
- On any failure, do not continue to later steps unless explicitly safe per the rules above.

## GitHub CLI Usage

Use `gh` to read issue content and update labels.

Before any `gh` command, verify CLI availability and auth:

```bash
gh --version
gh auth status
```

If either check fails:
- inform the user
- abort
- suggest running:
  - `gh auth login`
  - `gh auth status`

Preferred command shapes:

```bash
gh issue view <number> --json number,title,body,labels,url
# remove existing status label(s), then add status:in-planning
gh issue edit <number> --remove-label "<previous-status-1>" --remove-label "<previous-status-2>" --add-label "status:in-planning"
```

Notes:
- Run from the target repository so `gh` resolves the correct remote.
- Supported status labels only:
  - `status:todo`
  - `status:in-planning`
  - `status:in-progress`
  - `status:ready-to-review`
  - `status:ready-to-merge`
- Always replace the previous `status:*` label instead of stacking.
- If a `gh` command fails, inform the user, abort when unsafe to continue, and suggest the most likely manual fix.

## Template Compatibility Requirement

- Do not hardcode field names beyond what is discovered in `.github/ISSUE_TEMPLATE/issue.yml`.
- If the template changes, adapt extraction and summary generation to the new template without modifying this skill.
- When a canonical "acceptance criteria" section is not explicitly present, infer equivalent testable criteria from the template-defined required details sections and list them as acceptance criteria in the Plan Mode prompt.

## Git Operations

Use safe, explicit Git operations:

1. Confirm repository state and current branch.
2. Checkout `dev`.
3. Fetch remote updates.
4. Sync local `dev` with remote `dev` (fast-forward when possible).
5. Create and checkout the feature branch from synced `dev`.
6. Report the final branch name in output.

Do not run destructive Git commands.

## Plan Mode Prompt Template

Always output a paste-ready prompt with these sections filled from the issue, current template interpretation, and repository state:

- Issue number
- Issue title
- Issue body summary
- Acceptance criteria
- Current branch name
- Instructions:
  - inspect the relevant codebase before planning
  - during Plan Mode, do not implement code
  - during Plan Mode, produce a clear implementation plan
  - implementation happens later when the user clicks Build
  - when Build starts, replace issue status label `status:in-planning` with `status:in-progress`
  - when implementation is complete, verify acceptance criteria as far as possible, summarize implementation, set `status:ready-to-review`, and add a structured Markdown issue comment for human review
  - do not set `status:ready-to-review` if implementation failed, blockers remain, checks fail, or important acceptance criteria are incomplete
  - if incomplete/blocked, keep `status:in-progress` and post a structured Markdown comment that clearly states what is blocked or incomplete

Use these issue comment formats in Build mode:

```markdown
## Implementation Ready For Review

- Scope: <implemented scope summary>
- Acceptance criteria: <met|partially met> - <evidence>
- Verification: <commands and outcomes>

## Next Action

- Please perform human review.
```

```markdown
## Implementation Blocked

- Blocker: <what is blocked or incomplete>
- Impact: <which acceptance criteria are affected>
- Verification: <commands and outcomes, if any>

## Next Action

- <single best next step to unblock>
```

Use this exact structure:

```text
Plan this GitHub issue:

Issue: #<number> - <title>
Current branch: <branch-name>

Issue summary:
<concise summary of issue body>

Acceptance criteria:
- <criterion 1>
- <criterion 2>
- <criterion 3>

Instructions:
1) Inspect the relevant codebase and current patterns before planning.
2) During Plan Mode, do not write or modify code.
3) During Plan Mode, produce a clear implementation plan.
4) Implementation happens later when the user clicks Build.
5) When Build starts, replace the related GitHub issue status label from `status:in-planning` to `status:in-progress`.
6) When you believe implementation is complete:
   - verify the acceptance criteria as far as possible
   - summarize what was implemented
   - replace the current status label with `status:ready-to-review`
   - add a structured GitHub issue comment saying implementation is ready for human review
7) Do not set `status:ready-to-review` if implementation failed, blockers remain, checks fail, or important acceptance criteria are incomplete.
8) If blocked or incomplete, keep `status:in-progress` and add a structured GitHub issue comment describing what is blocked or incomplete and the next action.
```

