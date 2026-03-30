# Plan From Issue

Turn an issue or rough request into a concrete implementation plan.

## Steps

1. Resolve issue source first: GitHub issue URL/number or pasted issue text.
2. If the source is a GitHub issue, set it to **`status:in-progress`** and remove any other `status:*` labels so planning shows as active on the board.
3. Start from the problem, expected outcome, and acceptance criteria.
4. If an issue exists, align to `.github/ISSUE_TEMPLATE/feature-bug-chore.yml`.
5. Search the codebase for the files most likely to be affected.
6. Ask clarifying questions only when missing answers would change the implementation.
7. Produce a phased plan with concrete files, real commands, and verification steps.
8. If the work changes the operating model, include updates to `docs/project_init.md`.
