# Review Local Changes

Review the current local changes against the operating model.

## Steps

1. Inspect the changed files and summarize the intended behavior change.
2. Look for correctness risks, regressions, and missing verification.
3. Prefer findings over praise.
4. If checks exist, recommend the smallest relevant verification command.
5. If operating-model files changed, confirm `docs/project_init.md` was updated too.
6. If daily workflow guidance changed, confirm `docs/operating_model_cheatsheet.md` was updated too.

## Output

Return:

- Findings first, ordered by severity
- Open questions or assumptions
- Short change summary last
