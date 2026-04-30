---
name: publish-changes
description: Prepares the current branch for a GitHub pull request into dev with safety checks and commit/push workflow. Works for issue branches and vibe branches with no linked issue.
---

# Publish Changes

## Purpose

Prepare the current branch for a pull request into `dev`, create the PR, and stop. Do not merge. Do not implement new code.

## Rules

- Never push to `main`.
- Never merge the pull request.
- Stop after PR creation (and related issue updates, if possible).
- Do not add product-, stack-, or architecture-specific assumptions.
- If there is a failure, do not continue to later steps unless explicitly safe.

## Workflow

1. Identify context
  - Detect the current branch.
  - Parse branch name and user prompt for an issue number like `#123` or `123` in issue-like contexts.
  - Track `related_issue` as optional.
  - If no issue is found, continue in "no-linked-issue" mode (vibe-branch compatible).
2. Branch safety checks
  - If branch is `main`: inform user, abort, suggest creating a feature branch first.
  - If branch is `dev` and user did not explicitly allow using `dev`: inform user, abort, suggest creating a feature or vibe branch first.
3. Inspect local changes
  - Review git status and changed files.
  - Determine whether changes appear clearly related to the PR intent.
  - If unclear or potentially unrelated: ask user what to include before committing.
4. Commit preparation
  - Stage only relevant files.
  - Create a clear commit message focused on intent and impact.
  - If commit fails: inform user, abort, suggest checking `git status` or resolving local issues.
5. Push
  - Push current branch to remote.
  - If push fails: inform user, abort, suggest checking remote access or branch protection.
6. Create pull request into `dev`
  - Use `gh pr create` to create the PR (base: `dev`, head: current branch).
  - Include a concise description with required sections:
    - Summary
    - Related issue
    - Changes made
    - Verification
    - Notes / risks
  - If `related_issue` exists, include it explicitly in the PR body and add a closing keyword line: `Closes #<related_issue>`.
  - If PR creation fails: inform user, abort, suggest checking `gh` authentication/repository context or creating the PR manually.
7. Issue follow-up (only when `related_issue` exists)
  - Replace the current status label with `status:ready-to-merge` (do not stack status labels) after PR creation.
  - If the issue is already `closed` when checked, replace the current status label with `status:done` instead.
  - Add an issue comment using a structured Markdown format (not a single-line sentence) containing the PR link and next action.
  - If issue update fails but PR exists: keep the PR and tell the user exactly which labels to remove, which status label to add, and that a comment with the PR link must be added manually.
8. Stop
  - Report PR URL and key outcomes.
  - Do not merge, do not continue to release/deploy tasks.

## PR Description Template

Use this structure:

```markdown
## Summary
[1-3 concise bullets]

## Related issue
[Issue number/link, or "None"]
[If present, also include: `Closes #<number>`]

## Changes made
- [Change 1]
- [Change 2]

## Verification
- [Automated checks run, if any]
- [Manual verification performed, if any]
- [If none: "Not run"]

## Notes / risks
- [Known risk, follow-up, or "None"]
```

## Failure Handling Matrix

- Branch is `main`
  - Action: Abort immediately.
  - Message: Must use a feature branch before opening PR.
- Branch is `dev` without explicit user permission
  - Action: Abort immediately.
  - Message: Use a feature or vibe branch, or explicitly allow `dev`.
- Unclear unrelated working tree changes
  - Action: Pause and ask user which files/changes to include.
- Commit fails
  - Action: Abort.
  - Message: Check local repository state (`git status`) and resolve issues.
- Push fails
  - Action: Abort.
  - Message: Check remote permissions, auth, and branch protection.
- PR creation fails
  - Action: Abort.
  - Message: Check `gh` authentication/repository context or open PR manually.
- Issue label/comment update fails
  - Action: Do not roll back PR.
  - Message: Provide manual steps to replace the current status label with `status:ready-to-merge` (or `status:done` if issue is already closed) and add an issue comment with PR link.

## GitHub CLI Usage

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

Use these commands where appropriate:

```bash
gh pr create --base "dev" --head "<branch>" --title "<title>" --body "<body>"
gh issue view <number> --json number,title,body,labels,url,state
gh issue edit <number> --remove-label "<previous-status>" --add-label "status:ready-to-merge"
gh issue comment <number> --body "$(cat <<'EOF'
## PR Ready To Merge

- PR: <pr-url>
- Branch: <head-branch> -> dev
- Status: `status:ready-to-merge`

## Next Action

- Please review and merge when approved.
EOF
)"
```

If no `related_issue` exists, skip issue commands and continue with PR creation only.
If `related_issue` exists, ensure the PR body contains `Closes #<number>` so GitHub closes it automatically on merge.

Notes:

- Supported status labels only:
  - `status:todo`
  - `status:in-planning`
  - `status:in-progress`
  - `status:ready-to-review`
  - `status:ready-to-merge`
  - `status:done`
- Always replace the previous `status:*` label instead of stacking.
- Status policy:
  - Use `status:ready-to-merge` after PR creation while issue is open.
  - Use `status:done` when the issue is closed.
- If a `gh` command fails, inform the user, abort when unsafe to continue, and suggest the most likely manual fix.

## Output Expectations

When successful, provide:

- PR URL
- Base/head branches
- Commit used
- Whether an issue was linked
- Whether issue label/comment updates succeeded (or `not applicable` when no issue is linked)

When unsuccessful, provide:

- Exact failed step
- Why it failed (if known)
- Immediate next user action

