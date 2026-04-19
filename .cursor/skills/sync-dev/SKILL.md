---
name: sync-dev
description: After a PR is merged to dev on GitHub, fetch and check out local dev and pull latest. Use when the user types /sync-dev to reset the workspace for the next feature.
disable-model-invocation: true
---

# Sync local `dev`

Human housekeeping after **`github-clanker`** and a **human merge of the PR into `dev` on GitHub**. This is **not** delegated to `github-clanker` or any other subagent.

## When to use

- The PR is merged on GitHub and you want this clone on **`dev`**, matching **`origin/dev`**, before starting the next issue or feature branch.

## Steps

1. Check for a dirty working tree (for example **`git status --porcelain`**). If there is any output, **stop** and tell the user to commit, stash, or discard changes before switching branches.
2. Run **`git fetch origin`**.
3. Run **`git checkout dev`**.
4. Run **`git pull origin dev`**.
5. Report **`git branch --show-current`**, **`git status -sb`**, and **`git log -1 --oneline`** so the user sees the updated baseline.

## Notes

- Optional cleanup: to remove an old merged feature branch locally, use **`git branch -d branch-name`** (separate from this skill).

Equivalent shell sequence:

```bash
git fetch origin
git checkout dev
git pull origin dev
```
