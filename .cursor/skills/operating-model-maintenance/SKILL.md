---
name: operating-model-maintenance
description: Maintain Cursor operating-model assets for this repo. Use when rules, commands, skills, plans policy, CI review rails, AGENTS.md, project-init guidance, or cheatsheet usage guidance are added, changed, or removed.
disable-model-invocation: true
---

# Operating Model Maintenance

Use this skill when a change affects how the repo is operated with Cursor.

## Assets Covered

- `docs/cursor_operating_model.md`
- `docs/operating_model_cheatsheet.md`
- `docs/project_init.md`
- `.cursor/rules/`
- `.cursor/commands/`
- `.cursor/skills/`
- `.cursor/plans/`
- `AGENTS.md`
- `.github/pull_request_template.md`
- `.github/workflows/`

## Workflow

1. Identify which operating-model artifacts changed.
2. Update `docs/project_init.md` in the same change.
3. Update `docs/operating_model_cheatsheet.md` when daily usage guidance changed.
4. If conventions changed, update `docs/cursor_operating_model.md` or the relevant rule file.
5. Keep root `AGENTS.md` minimal and avoid duplicating detailed instructions there.
6. Only document commands that actually exist in `package.json`.

## Output Expectations

- Summarize what changed in the operating model.
- Confirm whether `docs/project_init.md` was updated.
- Confirm whether `docs/operating_model_cheatsheet.md` was updated when needed.
- Note any future operating-model follow-up that was intentionally deferred.
