---
name: ui-review
description: Delegate manual UI review to ui-review-clanker. Use when the user types `/ui-review` after `/code-review` and UI-relevant files changed.
disable-model-invocation: true
---

# UI review

Use this skill only to delegate **[ui-review-clanker](@.cursor/agents/ui-review-clanker.md)** when UI review is actually needed.

## Steps

1. Check whether the current change set touches **`src/**/*.{js,jsx,css}`**.
2. If it does **not**, return **UI N/A** and do not delegate.
3. If it does, delegate **`ui-review-clanker`** instead of doing an inline checklist review.
4. If the review returns **`[[BLOCKING]]`**, tell the user to click **Build** on the accepted plan again, then re-run **`/build-and-run`**, **`/code-review`**, and **`/ui-review`**.

## Notes

- Do **not** replace the subagent with a manual prose checklist unless delegation is impossible.
- This skill assumes **`/code-review`** already happened or is happening first.
