# Operating model tutorial (minimal commands)

This repo is designed so the human only uses the GitHub issue (`**/create-issue**` or the web UI), the accepted plan as context, `**/implement-plan #n**` for implementation, and a small set of slash skills.

Replace `#42` with your issue number everywhere it appears.

## GitHub issue status labels (automation)

Hooks update `**status:***` labels on the linked issue when `**coding-clanker**` and `**github-clanker**` run (requires `gh` authenticated against the repo). Only one `status:*` label should be on the issue at a time.


| When                                                               | Label                        |
| ------------------------------------------------------------------ | ---------------------------- |
| Issue created (template or `**/create-issue**`)                    | `status:todo`                |
| `**coding-clanker` starts** (`**/implement-plan`**)                | `status:in-progress`         |
| `**coding-clanker` finishes successfully**                         | `status:in-review`           |
| `**github-clanker` finishes successfully** (`**/github-publish`**) | `status:ready-to-merge`      |
| **PR merged into `dev`** (GitHub Action)                           | `status:done` (issue closes) |


## 1. Issue

Either:

- Run `**/create-issue feature**`, `**/create-issue bug**`, or `**/create-issue chore**` with a rough idea (see [.cursor/skills/create-issue/SKILL.md](../.cursor/skills/create-issue/SKILL.md); requires authenticated `**gh**`), or
- Create the issue in the GitHub web UI using [.github/ISSUE_TEMPLATE/feature-bug-chore.yml](../.github/ISSUE_TEMPLATE/feature-bug-chore.yml).

Example (replace the trailing text with your idea):

```text
/create-issue feature Short description of the change
```

**Issue status:** the template and `**/create-issue`** both apply `**status:todo`**.

## 2. Plan

Turn on **Plan Mode** and run:

```text
/plan-from-issue #42
```

The GitHub issue is the source of truth. No pasted issue body or second planning prompt is needed.

**Issue status:** unchanged (`**status:todo`**) until you start implementation (next step).

## 3. Implementation (`/implement-plan`)

Run:

```text
/implement-plan #42
```

See [.cursor/skills/implement-plan/SKILL.md](../.cursor/skills/implement-plan/SKILL.md): the chat agent delegates `**coding-clanker**` via **Task**. Use the same accepted plan as context so scope and branch naming stay aligned.

If review sends work back for changes, run `**/implement-plan #42`** again on the same plan and branch.

**Issue status:** when `**coding-clanker` starts**, hooks set `**status:in-progress`**. When it finishes successfully, hooks set `**status:in-review`**.

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

**Issue status:** unchanged (`**status:in-review`**); no label hook runs here.

## 5. Manual review

Run:

```text
/review
```

This delegates `**review-clanker**` (combined code and UI). When no **UI files** changed (paths matching the globs in [.cursor/rules/ui-system.mdc](../.cursor/rules/ui-system.mdc): `src/**/*.{js,jsx,ts,tsx,css}`, `apps/**/*.{js,jsx,ts,tsx,css}`, `packages/**/*.{js,jsx,ts,tsx,css}`), the report’s UI section is `**UI: N/A`**.

**Issue status:** unchanged (`**status:in-review`**); no label hook runs here.

## 6. GitHub publish

Run:

```text
/github-publish #42
```

This delegates `**github-clanker**` to commit the reviewed branch, push it, and create or update one PR into `dev`.

**Issue status:** when `**github-clanker` finishes successfully**, hooks set `**status:ready-to-merge`**.

## 7. Dev

Merge the PR into `dev` in GitHub.

Expected post-merge automation:

- issue gets `**status:done`**
- issue closes
- merged same-repo feature branch is deleted

**Issue status:** merge-to-`**dev`** automation applies `**status:done`**, removes other `**status:*`** labels, and closes the linked issue.

## 8. Sync local `dev` (after merge)

In Cursor, run:

```text
/sync-dev
```

That follows [.cursor/skills/sync-dev/SKILL.md](../.cursor/skills/sync-dev/SKILL.md): fetch, check out `**dev**`, and pull latest so your workspace matches GitHub before the next issue.

Shell equivalent:

```bash
git fetch origin
git checkout dev
git pull origin dev
```

**Issue status:** already `**status:done`** on GitHub; no further label change from this step.

## 9. Human integration test

Validate behavior on `dev` after merge.

If integration fails after merge, open a follow-up issue (`**/create-issue`** or the web UI) or reopen the original issue.

**Issue status:** new or reopened issues use `**status:todo`** again as needed.

## 10. Main

Merge `dev` to `main` in GitHub as a human-only step.

**Issue status:** no change from merge to `**main`** in this repo’s automation ( `**status:done`** still means merged to `**dev`** ).

## Rework loop

If `**/review`** returns `**[[BLOCKING]]`**:

1. Run `**/implement-plan #42**` again (same accepted plan / branch as appropriate).
2. Re-run `**/build-and-run**`.
3. Re-run `**/review**`.
4. Use `**/github-publish #42**` only after the branch is ready.

**Issue status:** each successful `**coding-clanker`** pass again moves `**in-progress` → `in-review`**. Each successful `**/github-publish`** again sets `**ready-to-merge**` when `**github-clanker**` completes.

## See also

- [AGENTS.md](../AGENTS.md) — canonical workflow contract
- [.cursor/skills/create-issue/SKILL.md](../.cursor/skills/create-issue/SKILL.md) — `**/create-issue**` from Cursor
- [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md) — components, hooks, and enforcement map
- [cursor-system-overview.md](cursor-system-overview.md) — short index of repo-to-product mapping

