---

## name: review-issue
description: Delegate combined code and UI review to review-clanker. Use when the user types `/review-issue #123` after local feature review (/build-and-run).
disable-model-invocation: true

# Review

Use this skill only to delegate **[review-clanker](@.cursor/agents/review-clanker.md)**.

## Steps

1. Parse the issue number from `/review-issue #n`.
2. Delegate `**review-clanker`** instead of doing an inline checklist review.
3. Keep the review scoped to the current branch or diff.
4. Apply status transition based on review outcome:
  - If no `[[BLOCKING]]`: remove the current `status:*` label and add `status:ready-to-publish`.
  - If `[[BLOCKING]]` is present: remove the current `status:*` label and add `status:blocked`.
5. If the review returns `**[[BLOCKING]]**`, tell the user to click **Build** on the accepted plan again, then re-run `**/build-and-run`** and `**/review-issue #n**`.

## Notes

- Do **not** replace the subagent with a manual prose checklist unless delegation is impossible.
- `**review-clanker`** emits `**UI: N/A**` in the UI section when no UI files changed. UI files are those matching the globs in [.cursor/rules/ui-system.mdc](@.cursor/rules/ui-system.mdc): `src/**/*.{js,jsx,ts,tsx,css}`, `apps/**/*.{js,jsx,ts,tsx,css}`, `packages/**/*.{js,jsx,ts,tsx,css}`.
- `/review-issue` without an issue number should ask for one before delegation.

