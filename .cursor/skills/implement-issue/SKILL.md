---

## name: implement-issue
description: >-
  Delegates post-plan implementation to coding-clanker after an accepted plan exists.
  Use when the user types `/implement-issue #123` with the GitHub issue number, or asks
  to run that slash command, so the handling agent uses Task → coding-clanker instead
  of implementing inline.
disable-model-invocation: true

# Implement plan

Use this skill only to delegate **[coding-clanker](@.cursor/agents/coding-clanker.md)**.

## When to use

- An **accepted plan** exists (saved in the workspace or clearly summarized in the thread).
- The GitHub issue `**#n`** is the source of truth for scope and acceptance criteria. If no issue exists yet, create one with `**/create-issue**` (see [.cursor/skills/create-issue/SKILL.md](@.cursor/skills/create-issue/SKILL.md)) or the web UI before planning.
- The human runs `**/implement-issue #n**` (or equivalent wording with the issue number).

## Inputs

- **Required:** Issue number or issue URL (must yield a single issue id), as in `**/implement-issue #123`**.
- **Optional:** Path to the accepted plan file, or short constraints from the human (deadline, out of scope).

## Steps

1. Parse `**#n`**. Every delegation to `**coding-clanker**` must include `**#n**` in the Task prompt.
2. Collect context for `**coding-clanker**`: accepted plan text or path, issue **#n**, suggested branch `**feature/issue-<n>-short-slug`** unless the human asks to reuse an existing feature branch.
3. **Delegate `coding-clanker`** via **Task** with `subagent_type` `**coding-clanker`**. Do **not** replace the subagent with inline implementation unless delegation is impossible.
4. Remind `**coding-clanker`**: follow the plan and [AGENTS.md](@AGENTS.md); run `**npm run build**` from [package.json](@package.json); do **not** commit, push, or open or update a PR.
5. Update issue labels explicitly after successful delegation:
   - Read current labels for issue `#n`.
   - Remove the current `status:*` label if present (`status:todo`, `status:ready-to-implement`, `status:ready-to-review`, `status:ready-to-publish`, `status:blocked`, `status:ready-to-merge`, `status:done`).
   - Add `status:ready-to-review`.

## Notes

- Prefer **Agent mode** so the handling agent can invoke **Task** successfully.
- If implementation needs another pass after review, the human can run `**/implement-issue #n`** again on the same branch.