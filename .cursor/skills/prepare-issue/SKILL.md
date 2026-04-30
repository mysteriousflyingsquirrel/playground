---

## name: prepare-issue

description: Prepares an existing GitHub issue for Cursor Plan Mode by creating a synced feature branch and generating a planning prompt.

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
3. Read the issue from GitHub via MCP.
4. Map extracted issue content according to the current template structure.
5. Check out local `dev`.
6. Sync local `dev` with remote `dev`.
7. Create a new feature branch from `dev`.
8. Name the branch using:
  - issue number
  - short slug derived from issue title (lowercase, hyphen-separated, alphanumeric plus hyphens)
  - example format: `feature/23-short-title`
9. Set or update issue label to `status:in-planning`.
10. Generate and show a Plan Mode prompt for the user to paste.
11. Stop.

## Failure Handling

Follow these guards exactly:

- If reading the GitHub issue fails:
  - inform the user
  - abort
  - suggest checking issue number or GitHub MCP connection
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
  - explain the label must be updated manually
  - continue only to showing the Plan Mode prompt if branch prep succeeded
- On any failure, do not continue to later steps unless explicitly safe per the rules above.

## GitHub MCP Usage

- Before calling any MCP tool, inspect the GitHub MCP tool schema/descriptor for correct parameters.
- Use GitHub MCP to read the issue and set/update labels.

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
  - ask clarifying questions until nothing important is ambiguous
  - produce an implementation plan only, not code
  - implementation happens later when the user clicks Build

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
2) Ask clarifying questions until nothing important is ambiguous.
3) Produce an implementation plan only; do not write or modify code.
4) Implementation happens later when the user clicks Build.
```

