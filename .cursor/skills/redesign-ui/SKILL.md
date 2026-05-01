---
name: redesign-ui
description: Radically redesigns presentation (layout, structure, styling, components) so the UI fully embodies docs/design/design-system.md—including theme tokens, colors, typography, and shadows; allows large JSX/CSS restructures when scope is explicit or application-wide work is authorized. Use for radical UI redesign, full-page visual rebuild, match design system, restructure markup, or rebuilding the shell plus all main pages—not for incremental polish (use polish-ui for small, reuse-first passes).
disable-model-invocation: true
---

# Redesign UI

Use **`polish-ui`** for incremental tweaks, smallest-surface changes, and reuse-first polish. Use **`redesign-ui`** for **radical**, design-system–driven presentation rebuilds when scope is clear or explicitly full-app.

## Skill purpose

This skill is **not** incremental polish. It **radically redesigns** presentation (layout, structure, styling, components, **and theme**) so the result **fully embodies** `docs/design/design-system.md` as the single source of truth. Prior visual appearance is **not** a constraint: the agent may replace large chunks of JSX/CSS and restructure the DOM for clarity, hierarchy, and DS patterns.

**Theme is in scope:** A redesign pass **must** align `src/index.css` (and any theme entry points such as `main.jsx` / `index.html`) with the **Global Rules** palette, typography, shadows, and the **Implementation mapping** table in the design system—not only page layout.

It must remain clearly **different** from the project skill `polish-ui` (small scope, reuse-first, smallest surface on vague requests).

## Preconditions

1. Read `docs/design/design-system.md` fully **including “Authority & scope”** and **Global Rules**. If missing: stop and tell the user to add it.
2. Identify scope: **explicit** page/route/component list from the user, OR the user explicitly authorizes **application-wide** UI (shell + all main pages). If scope is vague and the user did not authorize whole-app work: ask **one short** clarification question listing options (single page vs named set vs full app) and stop until answered.

## Principles

- **Source of truth:** Typography, color roles, spacing/shadow tokens, component specs, anti-patterns, and implementation mapping from the design system override local habits and legacy styling.
- **Theme tokens:** All screen work must read as Taurex: **light baseline**, primary blue, **amber CTA accent**, surfaces and borders per DS. Raw hex in JSX is discouraged when semantic utilities exist.
- **Radical presentation changes allowed:** New layout grids, new section structure, new class patterns, consolidating/removing redundant wrappers, replacing ad-hoc styles with DS-aligned patterns—even if the diff is large.
- **Reuse when it speeds DS alignment:** Prefer shared tokens and existing internal primitives **only when** they already match the design system; do not preserve legacy styling just because it exists.
- **Preserve product behavior by default:** Same routes, navigation targets, data fetching, event handlers, validation rules, and permissions—unless the user explicitly asks for behavior changes. Visual redesign must not silently remove required actions or content.
- **No new UI libraries** unless the user explicitly approves adding one.
- **Do not change** backend logic, API contracts, data models, or auth unless explicitly requested.

## Theme & token guardrails (mandatory)

When executing **redesign-ui**, always:

1. **Open `src/index.css`** — Confirm `@theme` color variables match the DS **Color Palette** / implementation table (`--color-bg`, `--color-surface`, `--color-fg`, `--color-muted`, `--color-muted-bg`, `--color-primary`, `--color-accent`, etc.). Update hex values if the design system changed or drifted.
2. **Aliases** — Keep `--color-background` / `--color-foreground` in sync if present (same values as `--color-bg` / `--color-fg`) so docs and code agree.
3. **Dark optional** — If the app supports `data-theme='dark'`, define companion tokens under `:root[data-theme='dark']`; ensure **light is default** per Anti-Patterns unless the user explicitly wants dark-first.
4. **Never** add `@theme --spacing-xs` (or similar) if it shadows Tailwind scales and breaks utilities like `max-w-xs`; follow the warning in the design system **Spacing** section.
5. **Verify utilities** — Semantic Tailwind classes (`bg-bg`, `text-fg`, `text-muted`, `bg-accent`, `border-border`, `shadow-ds-md`, …) must resolve to those variables after edits.

Skipping steps 1–5 is a failed redesign for **theme** even if layout improves.

## Execution expectations

- Map design-system **page patterns** only where the screen’s purpose fits (see DS **Authority** — marketing patterns are not mandatory for app shells).
- **Theme:** Complete the **Theme & token guardrails** checklist above; UI chrome (sidebar, main background, cards, primary buttons) must visibly follow Taurex roles (not generic gray/legacy palette).
- Apply **accessibility** and **anti-pattern** rules from the design system (focus states, contrast, motion, no emoji-as-icons, cursor on clickables, etc.).
- When the design system is ambiguous, follow **Global Rules** and **Implementation mapping**, not the optional Style Guidelines block.
- After edits: run the project’s usual build/check if available; fix obvious breakages.
- **Closing summary must include:**
  - What was redesigned (layout **and** theme/tokens)
  - Files touched (must mention `src/index.css` if tokens changed)
  - **Token verification:** confirm DS palette roles mapped to `--color-*` (brief bullet list)
  - Behavior preserved vs changed
  - Follow-ups out of scope

## Workflow

1. **Pre-read DS** — Read `docs/design/design-system.md` fully (Authority + Global Rules + guardrails); abort if missing.
2. **Confirm scope** — Enforce precondition 2; do not start implementation until scope is explicit or whole-app is authorized.
3. **Inspect current UI** — Open scoped files: markup, styles, shared layout/shell, **`src/index.css`**.
4. **Theme pass** — Apply **Theme & token guardrails**; align tokens before or alongside page work.
5. **Redesign implementation** — Rebuild presentation per Principles; large diffs are acceptable within scope.
6. **Verify against DS** — Re-read Global Rules; confirm a11y and anti-patterns; confirm no optional Style Guidelines overrode Global Rules.
7. **Summarize** — Use the required closing summary format from Execution expectations.

## Path and examples

When adding examples or path strings in comments or docs, use forward slashes only (for example `src/pages/Home.jsx`), not Windows-style backslashes.
