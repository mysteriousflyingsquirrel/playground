# Operating model tutorial (minimal commands)

This repo is designed so the human only uses the GitHub issue, the accepted plan’s **Build** button, and a small set of slash skills.

Replace `#42` with your issue number everywhere it appears.

## 1. Issue

Create the issue outside Cursor using [.github/ISSUE_TEMPLATE/feature-bug-chore.yml](../.github/ISSUE_TEMPLATE/feature-bug-chore.yml). New issues begin as `**status:todo`**.

## 2. Plan

Turn on **Plan Mode** and run:

```text
/plan-from-issue #42
```

The GitHub issue is the source of truth. No pasted issue body or second planning prompt is needed.

## 3. Build

Click **Build** on the accepted plan. No extra prompt is needed.

This repo steers Build toward `**coding-clanker`**. If review sends work back for changes, use **Build** on the same accepted plan again.

## 4. Human feature review/test

Run:

```text
/build-and-run
```

If a repo later has multiple apps, use:

```text
/build-and-run exampleapp
```

This command installs dependencies if needed, runs `npm run build`, starts the app, and opens the local URL with Cursor’s **Browser** tool (in-IDE), not the OS default browser.

## 5. Manual review

Run:

```text
/review
```

This delegates `**review-clanker**` (combined code and UI). When no `src/**/*.{js,jsx,css}` files changed, the report’s UI section is `**UI: N/A**`.

## 6. GitHub publish

Run:

```text
/github-publish #42
```

This delegates `**github-clanker**` to commit the reviewed branch, push it, and create or update one PR into `dev`.

## 7. Dev

Merge the PR into `dev` in GitHub.

Expected post-merge automation:

- issue gets `**status:done**`
- issue closes
- merged same-repo feature branch is deleted

## 8. Sync local `dev` (after merge)

In Cursor, run:

```text
/sync-dev
```

That follows [.cursor/skills/sync-dev/SKILL.md](../.cursor/skills/sync-dev/SKILL.md): fetch, check out **`dev`**, and pull latest so your workspace matches GitHub before the next issue.

Shell equivalent:

```bash
git fetch origin
git checkout dev
git pull origin dev
```

## 9. Human integration test

Validate behavior on `dev` after merge.

If integration fails after merge, open a follow-up issue or reopen the original issue.

## 10. Main

Merge `dev` to `main` in GitHub as a human-only step.

## Rework loop

If `**/review**` returns `**[[BLOCKING]]**`:

1. Click **Build** on the accepted plan again.
2. Re-run `**/build-and-run`**.
3. Re-run `**/review`**.
4. Use `**/github-publish #42`** only after the branch is ready.

## See also

- [AGENTS.md](../AGENTS.md) — canonical workflow contract
- [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md) — components, hooks, and enforcement map
- [cursor-system-overview.md](cursor-system-overview.md) — short index of repo-to-product mapping

