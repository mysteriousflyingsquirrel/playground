# Create GitHub Issue

Create a GitHub issue aligned to the repository template.

## Steps

1. Confirm issue type: `Feature`, `Bug`, or `Chore`.
2. Use `.github/ISSUE_TEMPLATE/feature-bug-chore.yml` as the required structure.
3. Draft the issue body with:
   - `Problem / Goal`
   - `Expected Outcome`
   - `Acceptance Criteria (rough)` with checkboxes
   - `Context`
4. Keep scope small and implementation-ready (avoid broad or mixed goals).
5. For new issues, apply **`status:needs-plan`** only (remove any other `status:*` labels). The canonical `status:*` set is:
   - `status:needs-plan` — new issue, not yet actively planned
   - `status:in-progress` — planning or implementation in progress
   - `status:in-review` — PR open, awaiting merge
   - `status:done` — after merge (optional; GitHub may already have closed the issue via `Closes #` in the PR body)
6. Return the final issue title, labels, and body text for confirmation before submit.

## Notes

- Prefer one issue per independently shippable change.
- Use exactly one active `status:*` label at a time.
