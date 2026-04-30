---
name: review-issue
description: Reviews an implemented GitHub issue before pull request creation and updates issue status labels based on review outcome. Use when the user asks to review an issue implementation, such as "review-issue #23", after build completion and while the issue is status:ready-to-review.
---

# Review Issue

## Goal

Run a reusable, implementation-focused review step after build completion and before opening a pull request.

## Scope And Boundaries

- Accept an issue number from the user, for example: `review-issue #23`.
- Use GitHub CLI (`gh`) for all GitHub operations.
- Do not use GitHub MCP.
- Do not implement new code unless the user explicitly asks for fixes after the review.
- Do not create a pull request.
- Do not merge anything.

## Supported Status Labels

- `status:todo`
- `status:in-planning`
- `status:in-progress`
- `status:ready-to-review`
- `status:ready-to-publish`
- `status:ready-to-merge`

When changing status, replace the previous status label instead of stacking status labels.

## Workflow

1. Parse the issue number from the user request.
2. Verify GitHub CLI availability and authentication.
3. Read the issue details and acceptance criteria.
4. Inspect local implementation context.
5. Compare implementation against issue requirements.
6. Run or recommend verification commands.
7. Decide review result: passed or blocked.
8. Add a structured GitHub issue comment with the review result.
9. Update status label according to the result.
10. Return a structured review summary and stop.

## Step-By-Step Procedure

### 1) Parse Request

- Extract the issue number (`<N>`) from input like `review-issue #<N>`.
- If missing, ask for the issue number and stop.

### 2) Verify `gh` Prerequisites

Run:

```bash
gh --version
gh auth status
```

Failure handling:

- If `gh` is missing or unauthenticated, inform the user, abort, and suggest:
  - `gh auth login`
  - `gh auth status`
- On this failure, do not continue.

### 3) Read Issue

Run:

```bash
gh issue view <N> --json number,title,body,labels,url
```

Interpretation:

- Capture issue number, title, body, labels, URL.
- Identify acceptance criteria from explicit sections/checklists in the issue body. If none are explicit, derive concise review checkpoints from the issue description and note that they were inferred.
- Confirm the issue is currently labeled `status:ready-to-review`. If not, warn the user and stop unless they explicitly confirm continuing.

Failure handling:

- If the issue cannot be read, inform the user, abort, and suggest checking the issue number.
- On this failure, do not continue.

### 4) Inspect Branch And Changes

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
- Check whether branch name and changed files appear related to the issue scope.
- Check for obvious unrelated changes.

Failure handling:

- If changed files cannot be inspected, inform the user and abort.
- On this failure, do not continue.

### 5) Compare Implementation To Issue

- Review issue requirements and acceptance criteria against the observed implementation.
- Determine:
  - covered criteria
  - partially covered criteria
  - missing criteria
  - risks or ambiguities

### 6) Verification Commands

- If repository verification commands exist, run relevant ones (for example test/lint/build commands defined in project docs or scripts).
- If no reliable command is discoverable quickly, recommend the most relevant verification command(s) instead of inventing commands.

Failure handling:

- If verification commands fail, report the failure and treat it as a blocker unless the user explicitly says otherwise.

### 7) Decide Result

- **Passed**: no blockers, acceptance criteria appear satisfied, and no critical verification failures.
- **Blocked**: any blocker exists (missing criteria, critical risk, unrelated changes requiring cleanup, or verification failure not waived by user).

### 8) Comment On The Issue

Post a structured Markdown comment with:

- review result (`passed` or `blocked`)
- concise evidence (criteria coverage, verification result, key blockers/risks)
- immediate next action
- If result is `blocked`, the comment must explicitly state what must be fixed.

Example command shape:

```bash
gh issue comment <N> --body "$(cat <<'EOF'
## Review Result: <passed|blocked>

## Coverage

- Criteria: <covered|partial|missing> - <evidence>

## Verification

- <command>: <pass|fail|not run>

## Blockers

- <none|what must be fixed>

## Next Action

- <single immediate next step>
EOF
)"
```

Failure handling:

- If commenting fails, keep the review result and clearly explain what must be added manually.

### 9) Update Status Label (Replace, Do Not Stack)

Target state:

- If result is **passed**: replace current status with `status:ready-to-publish`.
- If result is **blocked**: replace current status with `status:in-progress`.
- Never set `status:ready-to-merge` in this skill.

Label update method:

1. Read current labels.
2. Remove any existing label in the supported status set that is not the target label.
3. Ensure the target label exists.
4. Do not leave multiple status labels.

Example command shapes:

```bash
gh issue edit <N> --remove-label "status:ready-to-review"
gh issue edit <N> --add-label "status:ready-to-publish"
```

Failure handling:

- If label updates fail, keep the review result and clearly explain what must be updated manually.

## Safe-Stop Rules

On any failure, do not continue to later steps unless it is explicitly safe.

Safe examples:

- Comment update failed after review decision: continue only to report manual follow-up needed.
- Label update failed after comment posted: continue only to report manual follow-up needed.

Unsafe examples:

- `gh` auth failed.
- Issue read failed.
- Branch safety gate failed without user confirmation.
- Change inspection failed.

## Final Output Format

Always include:

- issue number and title
- current branch
- review result: `passed` or `blocked`
- acceptance criteria review
- changed files summary
- verification performed
- blockers or risks
- next recommended action

Use this template:

```markdown
Issue: #<number> - <title>
Branch: <branch-name>
Review result: <passed|blocked>

Acceptance criteria review:
- <criterion>: <covered|partial|missing> - <evidence>

Changed files summary:
- <area/file group>: <what changed>
- Unrelated changes: <none|details>

Verification performed:
- <command>: <pass|fail|not run> - <notes>

Blockers or risks:
- <none|itemized blockers/risks>

Issue update:
- Comment: <posted|failed - manual action required>
- Status label: <updated|unchanged|failed - manual action required>

Next recommended action:
- <single best next step>
```

