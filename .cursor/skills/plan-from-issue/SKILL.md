---
name: plan-from-issue
description: Produce a structured implementation plan directly from a GitHub issue. Use when the user types `/plan-from-issue #123` and the GitHub issue already contains the details.
disable-model-invocation: true
---

# Plan from issue

## When to use

- A GitHub issue already exists and contains the implementation details.
- The human wants planning to be as short as possible: **`/plan-from-issue #123`** and nothing more.
- Use with [AGENTS.md](@AGENTS.md): turn on [Plan mode](https://cursor.com/docs/agent/plan-mode), then run this skill.

## Inputs

- Required: issue number or issue link.
- Optional constraints (deadline, out of scope).

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

## References

- Issue template: [.github/ISSUE_TEMPLATE/feature-bug-chore.yml](@.github/ISSUE_TEMPLATE/feature-bug-chore.yml)
- Architecture: [.cursor/rules/architecture.mdc](@.cursor/rules/architecture.mdc)

After the plan is accepted, the human should click **Build** on the accepted plan. There is no separate build slash command. This repo steers that Build step toward **coding-clanker** (see [.cursor/agents/coding-clanker.md](@.cursor/agents/coding-clanker.md)), so the plan must carry the issue number and suggested branch naming clearly. `coding-clanker` owns implementation on the feature branch; `github-clanker` later handles commit, push, and PR publication once review is ready.
