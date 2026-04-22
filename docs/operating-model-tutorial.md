# Operating model tutorial (minimal commands)

This repo is designed so the human only uses the GitHub issue (`**/create-issue**` or the web UI), the accepted plan as context, `**/implement-issue #n**` for implementation, and a small set of slash skills.

Replace `#42` with your issue number everywhere it appears.

## GitHub issue status labels (command-owned)

Slash command flows update `**status:***` labels explicitly with remove-then-add behavior (requires `gh` authenticated against the repo). Only one `status:*` label should be on the issue at a time.


| When                                                               | Label                        |
| ------------------------------------------------------------------ | ---------------------------- |
| Issue created (template or `**/create-issue**`)                       | `status:todo`                |
| Successful `**/plan-issue #n`**                                       | `status:ready-to-implement`  |
| Successful `**/implement-issue #n`**                                  | `status:ready-to-review`     |
| Successful `**/review-issue #n`** (no `[[BLOCKING]]`)                | `status:ready-to-publish`    |
| `**/review-issue #n`** with `[[BLOCKING]]`                           | `status:blocked`             |
| Successful `**/publish-issue #n`**                                    | `status:ready-to-merge`      |
| **PR merged into `dev`** (GitHub Action)                              | `status:done` (issue closes) |


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
/plan-issue #42
```

The GitHub issue is the source of truth. No pasted issue body or second planning prompt is needed.

**Issue status:** successful `**/plan-issue #n`** removes the current `**status:*`** label and sets `**status:ready-to-implement`**.

## 3. Implementation (`/implement-issue`)

Run:

```text
/implement-issue #42
```

See [.cursor/skills/implement-issue/SKILL.md](../.cursor/skills/implement-issue/SKILL.md): the chat agent delegates `**coding-clanker**` via **Task**. Use the same accepted plan as context so scope and branch naming stay aligned.

If review sends work back for changes, run `**/implement-issue #42`** again on the same plan and branch.

**Issue status:** `**/implement-issue #n`** removes the current `**status:*`** label and sets `**status:ready-to-review`** after successful implementation delegation.

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

**Issue status:** unchanged (`**status:ready-to-review`**) unless you re-run `/implement-issue #n` or complete `/review-issue #n`.

## 5. Manual review

Run:

```text
/review-issue #42
```

This delegates `**review-clanker**` (combined code and UI). When no **UI files** changed (paths matching the globs in [.cursor/rules/ui-system.mdc](../.cursor/rules/ui-system.mdc): `src/**/*.{js,jsx,ts,tsx,css}`, `apps/**/*.{js,jsx,ts,tsx,css}`, `packages/**/*.{js,jsx,ts,tsx,css}`), the report’s UI section is `**UI: N/A`**.

**Issue status:** if review succeeds without `**[[BLOCKING]]`**, `**/review-issue #42`** removes the current `**status:*`** label and sets `**status:ready-to-publish`**. If review returns `**[[BLOCKING]]`**, `**/review-issue #42`** removes the current `**status:*`** label and sets `**status:blocked`**.

## 6. GitHub publish

Run:

```text
/publish-issue #42
```

This delegates `**github-clanker**` to commit the reviewed branch, push it, and create or update one PR into `dev`.

**Issue status:** after successful publish, `**/publish-issue #42`** removes the current `**status:*`** label and sets `**status:ready-to-merge`**.

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

If `**/review-issue`** returns `**[[BLOCKING]]`**:

1. Run `**/implement-issue #42**` again (same accepted plan / branch as appropriate).
2. Re-run `**/build-and-run**`.
3. Re-run `**/review-issue #42**`.
4. Use `**/publish-issue #42**` only after the branch is ready.

**Issue status:** each successful `**/plan-issue #42`** pass sets `**status:ready-to-implement`**, each successful `**/implement-issue #42`** pass sets `**status:ready-to-review`**, each successful `**/review-issue #42`** sets `**status:ready-to-publish`** (or `**status:blocked`** on `**[[BLOCKING]]`), and each successful `**/publish-issue #42`** sets `**status:ready-to-merge`**.

## See also

- [AGENTS.md](../AGENTS.md) — canonical workflow contract
- [.cursor/skills/create-issue/SKILL.md](../.cursor/skills/create-issue/SKILL.md) — `**/create-issue**` from Cursor
- [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md) — components, hooks, and enforcement map
- [cursor-system-overview.md](cursor-system-overview.md) — short index of repo-to-product mapping

