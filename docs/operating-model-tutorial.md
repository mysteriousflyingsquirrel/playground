# Operating model tutorial (dummy prompts)

One **prompt per step** for the flow in [AGENTS.md](../AGENTS.md): **Issue → Plan → Build → Auto review → Fix loop → Dev → Human test → Main**.

Replace `#42` with your issue number everywhere it appears.

Skills use **`/`** in Agent. If a skill does not appear, check **Cursor Settings → Rules** and confirm project skills are loaded.

---

## 1. Issue

**Goal:** Tie work to a GitHub issue.

**Outside Cursor:** Create the issue using [.github/ISSUE_TEMPLATE/feature-bug-chore.yml](../.github/ISSUE_TEMPLATE/feature-bug-chore.yml).

**Prompt:**

```text
I am working issue #42. Issue body: [paste the full issue]. Restate the acceptance criteria in your own words and confirm you will use them as the definition of done.
```

---

## 2. Plan

**Goal:** Produce an implementation plan before coding. Turn on **Plan Mode** in Cursor, then send the prompt below ([Plan mode](https://cursor.com/docs/agent/plan-mode)).

**Prompt:**

```text
/plan-from-issue

Issue #42 — [short title]. Paste the issue goal and acceptance criteria here if needed. Output sections: Goal, Acceptance criteria, Technical approach (files and routes to touch), Verification (npm run build only), Risks.
```

---

## 3. Build

**Goal:** Implement the approved plan and open **one PR into `dev`** (never `main`).

**Prompt:**

```text
/implement-from-plan

Implement the approved plan for #42. Use the builder-agent if the change is large. Create a branch, complete the work, run npm run build, then open the PR with: gh pr create --base dev --title "feat: …" --body "Closes #42". Do not use --base main.
```

---

## 4. Auto review

**Goal:** Review the change before merging the PR to `dev`.

**Prompt:**

```text
Review the current PR/branch for #42 in two passes: (1) code and architecture per .cursor/rules/architecture.mdc, (2) UI per .cursor/rules/ui-system.mdc for any src/ changes. Give verdict, findings with severity, and put [[BLOCKING]] on its own line if the PR must not merge to dev yet.
```

---

## 5. Fix loop

**Goal:** Clear blocking review items and re-verify.

**Prompt:**

```text
/fix-from-review

Fix every blocking and important finding from the last review for #42. Run npm run build after edits. Say what you changed.
```

Repeat this step until there is no **`[[BLOCKING]]`** in the latest review (or you explicitly accept the risk).

---

## 6. Dev

**Goal:** Merge into **`dev`** on GitHub.

**You:** Merge the PR into **`dev`** in the GitHub UI (not `main`).

**Prompt (after merge, for a short record in chat):**

```text
Summarize what is now on dev for #42: merged PR link, files touched, and the exact npm run build command you last ran successfully.
```

---

## 7. Human test

**Goal:** Validate behavior on **`dev`** (deployed, preview, or local checkout of `dev`).

**Prompt:**

```text
Give me a numbered manual test checklist for issue #42 derived only from its acceptance criteria. I will run it on dev myself.
```

---

## 8. Main

**Goal:** Human promotion **`dev` → `main`** only.

**Prompt:**

```text
/release-readiness

We are about to promote dev to main. Walk through the release-readiness checklist from AGENTS.md and .cursor/rules/git-workflow.mdc; list anything still missing before merge (CI, QA, etc.). Do not merge; I will do the dev-to-main merge in GitHub.
```

**You:** Perform the actual **`dev` → `main`** merge or release PR in GitHub.

---

## End-to-end (same prompts in order)

1. Issue — prompt from §1  
2. Plan — prompt from §2  
3. Build — prompt from §3  
4. Auto review — prompt from §4  
5. Fix loop — prompt from §5 (repeat until clean)  
6. Dev — merge in GitHub, then prompt from §6  
7. Human test — prompt from §7  
8. Main — prompt from §8, then merge in GitHub  

---

## See also

- [AGENTS.md](../AGENTS.md) — orchestration and branch policy  
- [cursor-operating-model-architecture.md](cursor-operating-model-architecture.md) — components and hooks  
- [cursor-system-overview.md](cursor-system-overview.md) — rules, skills, subagents, hooks list  

If `CURSOR_STRICT_PLAN_GATE=1` is set, keep **`#42`** (or your issue number) in prompts that start implementation so the plan gate hook allows them.
