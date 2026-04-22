---

## name: create-issue

description: >-
  Creates a GitHub issue from the user's rough idea using the same fields and
  labels as the repo's issue form. Use when the user runs `/create-issue   feature`, `/create-issue bug`, or `/create-issue chore` (or equivalent) with
  a short description, or asks to file an issue that matches the feature-bug-chore
  template.
disable-model-invocation: true

# Create issue

## When to use

- The user runs `**/create-issue feature**`, `**/create-issue bug**`, or `**/create-issue chore**` followed by a rough idea.
- They want an issue on GitHub that matches [.github/ISSUE_TEMPLATE/feature-bug-chore.yml](@.github/ISSUE_TEMPLATE/feature-bug-chore.yml) (Type dropdown, Issue body scaffold, `status:todo`).

## Preconditions

- `**gh**` is installed and authenticated (`gh auth status` shows a logged-in user with access to the repo).
- Default repo is `**origin**` on GitHub. If the user names another `owner/repo`, pass `**gh issue create -R owner/repo**`.

`gh issue create --template` applies to **markdown** templates, not this **YAML** form. Recreate the form contract with `**--title`**, `**--body`** (or `**--body-file**`), and `**--label status:todo**`.

## Parse input

1. **Type** — first token after the command: `**feature`**, `**bug`**, or `**chore**` (case-insensitive). Map to `**Feature**`, `**Bug**`, `**Chore**` (exact casing for the body).
2. **Rough idea** — remainder of the user message. If missing, ask once for a one-line description.
3. **Repo** — optional `-R owner/repo` when the user specifies it or `origin` is not the target.

## Draft issue

**Title:** concise, imperative, specific (never the template placeholder `Title`).

**Body** — Markdown mirroring a submitted issue form for that YAML (field labels from the form):

```markdown
### Type

<Feature|Bug|Chore>

### Issue

## Problem / Goal
<from rough idea>

## Expected Outcome
<infer or keep brief placeholder if unknown>

## Acceptance Criteria (rough)
- [ ] <derive from idea where obvious>
- [ ] 

## Context
<links, notes, or leave a short placeholder>
```

Use the `**##**` headings and checklist style from the template’s textarea default. Fill from the rough idea; use minimal placeholders only where the user gave no signal.

**Labels:** always `**--label status:todo`** (matches the template). Do not drop this label on error; fix auth or label configuration instead.

## Create on GitHub

1. From the **workspace git root**, ensure the default remote is correct (`git remote -v`).
2. Write the body to a **temporary file** (UTF-8), then run:
  ```bash
   gh issue create --title "<title>" --body-file "<path-to-temp-file>" --label "status:todo"
  ```
   Add `**-R owner/repo**` when applicable.
   Prefer `**--body-file**` over inline `**--body**` so multi-line Markdown works on **Windows PowerShell** without quoting failures.
3. Delete the temp file after success (or on failure if it contains no secrets—body is user-provided).
4. Print the **issue URL** and `**#n`** so the human can run `**/plan-issue #n`** (see [AGENTS.md](@AGENTS.md)).

## Failure handling

- Surface `**gh`** stderr. Common fixes: `**gh auth login**`, `**gh auth refresh**`, wrong repo (`-R`), or missing `**status:todo**` label on the GitHub repo.
- Do not create the issue without `**status:todo**` unless the user explicitly overrides in the same thread.

## References

- Issue form: [.github/ISSUE_TEMPLATE/feature-bug-chore.yml](@.github/ISSUE_TEMPLATE/feature-bug-chore.yml)
- Workflow: [AGENTS.md](@AGENTS.md)

