---
name: code-review
description: Delegate manual technical review to code-review-clanker. Use when the user types `/code-review` after local feature review.
disable-model-invocation: true
---

# Code review

Use this skill only to delegate **[code-review-clanker](@.cursor/agents/code-review-clanker.md)**.

## Steps

1. Identify the current local branch or diff and the latest accepted plan if it is available.
2. Delegate **`code-review-clanker`** instead of doing an inline checklist review.
3. Keep the review scoped to the current branch or diff.
4. If the review returns **`[[BLOCKING]]`**, tell the user to click **Build** on the accepted plan again, then re-run **`/build-and-run`** and **`/code-review`**.

## Notes

- Do **not** replace the subagent with a manual prose checklist unless delegation is impossible.
- `ui-review-clanker` is a separate step driven by **`/ui-review`**.
