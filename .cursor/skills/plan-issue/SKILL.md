---

## name: plan-issue
description: Produce a structured implementation plan directly from a GitHub issue. Use when the user types `/plan-issue #123` and the GitHub issue already contains the details.
disable-model-invocation: true

# Plan from issue

## When to use

- A GitHub issue already exists and contains the implementation details. If there is no issue yet, create one with `**/create-issue**` (see [.cursor/skills/create-issue/SKILL.md](@.cursor/skills/create-issue/SKILL.md)) or the web UI using the same template.
- The human wants planning to be as short as possible: `**/plan-issue #123**` and nothing more.
- Use with [AGENTS.md](@AGENTS.md): turn on [Plan mode](https://cursor.com/docs/agent/plan-mode), then run this skill.

## Inputs

- Required: issue number or issue link.
- Optional constraints (deadline, out of scope).

## Label transition

On successful completion of `/plan-issue #n`:

- Remove the current `status:*` label if present.
- Add `status:ready-to-implement`.

## Output structure

1. **Goal** — one paragraph tied to the issue.
2. **Acceptance criteria** — checklist mapped to issue items.
3. **Technical approach** — files to touch, routes/components if UI, data flow if any.
4. **Verification** — only commands from [package.json](@package.json) (e.g. `npm run build`).
5. **Risks / open questions** — short list.
6. **Build handoff** — a compact section that gives the Build button enough context:
  - `Issue: #<n>`
  - `Suggested branch: feature/issue-<n>-short-slug`
  - `Build owner: coding-clanker`
  - `Build note: Click Build on this accepted plan.`
  - `Build execution: The agent handling Build must delegate via Task → coding-clanker (not inline edits); task text must include #<n>.`
  - Alternatively the human can run `**/implement-issue #<n>`** so the chat agent delegates `**coding-clanker**` without using the Build button.

## References

- Creating issues: [.cursor/skills/create-issue/SKILL.md](@.cursor/skills/create-issue/SKILL.md)
- Issue template: [.github/ISSUE_TEMPLATE/feature-bug-chore.yml](@.github/ISSUE_TEMPLATE/feature-bug-chore.yml)
- Architecture: [.cursor/rules/architecture.mdc](@.cursor/rules/architecture.mdc)

After the plan is accepted, the human should click **Build** on the accepted plan, or run `**/implement-issue #n`** (see [.cursor/skills/implement-issue/SKILL.md](@.cursor/skills/implement-issue/SKILL.md)) so the handling agent delegates **Task → coding-clanker**. This repo steers the Build step toward **coding-clanker** (see [.cursor/agents/coding-clanker.md](@.cursor/agents/coding-clanker.md)), but that routing is best-effort, so the plan must carry the issue number and suggested branch naming clearly. `coding-clanker` owns implementation on the feature branch; `github-clanker` later handles commit, push, and PR publication once review is ready.