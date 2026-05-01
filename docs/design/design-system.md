# Design System Master File


---

**Project:** Taurex
**Generated:** 2026-04-30 22:26:59
**Category:** SaaS (General)

---

## Authority & scope (read first)

| Layer | Status |
|-------|--------|
| **Global Rules** (palette, typography, spacing table, shadows table) | **Authoritative** for this product |
| **Component Specs** (buttons, cards, inputs, modals) | **Authoritative** for interaction and proportions; resolve conflicts with Anti-Patterns as noted below |
| **Anti-Patterns** | **Authoritative** for accessibility and UX guardrails |
| **Style Guidelines — “SaaS Mobile (High-Tech Boutique)”** | **Reference only — not default.** Describes an optional native/mobile aesthetic (dual fonts, glassmorphism, Reanimated, etc.). **Do not apply** to the web Playground shell unless the user explicitly requests that aesthetic |
| **Page Pattern — Enterprise Gateway** | Marketing-site pattern; use for landing/marketing flows only when the screen purpose matches |

**Conflict resolution:** If Style Guidelines contradict Global Rules (e.g. dual fonts vs Plus Jakarta only), **follow Global Rules**. If Component Specs suggest `transform` on hover and Anti-Patterns forbid layout shift, **prefer elevation/shadow/opacity** for hover; any motion must respect `prefers-reduced-motion`.

---

## Global Rules

### Color Palette

Semantic roles below match **`src/index.css`** `@theme`. Use tokens in UI code—not raw hex—unless prototyping. Keep **`docs/design/design-system.md`** and **`src/index.css`** `@theme` values in sync when updating palette hex.

#### Brand palette (logo)

Colors sampled from the Taurex **bull + house** mark (two blues + white). Use these as the **canonical brand hues** for mapping into semantic tokens.

| Logo role | Hex | Maps to semantic tokens |
|-----------|-----|-------------------------|
| Dark navy | `#052A57` | **`--color-primary`**, **`--color-fg`** / **`--color-foreground`**, **`--color-ring`** (focus); pairs with **`--color-on-primary`** `#FFFFFF` on filled navy UI |
| Bright blue | `#0F69ED` | **`--color-secondary`** (links, icons, highlights, gradients with navy) |
| Background | `#FFFFFF` | **`--color-bg`** / **`--color-background`**; **`--color-surface`** for cards/panels on white |

**Implementation note:** The **accent / CTA** token (`--color-accent`) remains **amber** in this document for product scanability and WCAG-tested pairings unless the product explicitly moves primary actions to **bright blue** (`#0F69ED`) with **`--color-on-accent`** set for sufficient contrast.

| Role | Hex | Implementation token | Tailwind examples |
|------|-------------|----------------------|-------------------|
| Background (page) | `#FFFFFF` | `--color-bg` *(alias: `--color-background`)* | `bg-bg` |
| Surface (cards, panels) | `#FFFFFF` | `--color-surface` | `bg-surface` |
| Foreground (primary text) | `#052A57` | `--color-fg` *(alias: `--color-foreground`)* | `text-fg` |
| **Muted text** (secondary labels, helper copy) | `#5B6478` | `--color-muted` | `text-muted` |
| **Muted surface** (tinted fills, nav active bg) | `#E9EEF6` | `--color-muted-bg` | `bg-muted-bg` |
| Border | `#DBEAFE` | `--color-border` | `border-border` |
| Primary | `#052A57` | `--color-primary` | `text-primary`, `border-primary`, `bg-primary/…` |
| On primary | `#FFFFFF` | `--color-on-primary` | (pairs with primary fills) |
| Secondary | `#0F69ED` | `--color-secondary` | `text-secondary`, borders |
| Accent / CTA | `#D97706` | `--color-accent` | `bg-accent`, `text-accent` |
| On accent | `#FFFFFF` | `--color-on-accent` | text on amber buttons |
| Destructive | `#DC2626` | `--color-destructive` | destructive actions |
| Ring (focus) | `#052A57` | `--color-ring` | focus rings / outlines |

**Color Notes:** Brand blues from logo (**navy `#052A57`**, **bright `#0F69ED`**, **white `#FFFFFF`**) drive primary / secondary / background roles; muted + border stay supportive neutrals/tints; amber CTA highlights unless CTAs are intentionally switched to bright blue for full logo alignment.

### Typography

- **Heading Font:** Plus Jakarta Sans
- **Body Font:** Plus Jakarta Sans
- **Mood:** enterprise, saas, b2b, professional, indigo, modern, approachable, legible
- **Google Fonts:** [Plus Jakarta Sans](https://fonts.google.com/share?selection.family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400)

**CSS Import (already in project):**

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap');
```

### UI scale (root `rem`)

The Playground applies a **global UI scale** so the shell and pages read slightly denser without per-component refactors:

- **Implementation:** In `src/index.css` (`@layer base`), **`html { font-size: 90%; }`** — effectively **~10% smaller** type, spacing, and most layout derived from **`rem`** (Tailwind spacing/typography utilities, `@theme` `--spacing-*` values in `rem`, etc.).
- **Intent:** One knob for full-app density; keep token **roles** and **ratios** unchanged.
- **Does not scale:** Values authored in **fixed `px`** (for example **`--shadow-ds-*`** offsets in this repo, and typical **`1px`** borders) stay absolute; they may look **slightly heavier** relative to shrunken text—acceptable unless you convert those to `rem` for strict proportionality.

### Copy width (full horizontal measure)

In the **Taurex Playground** web shell, **reading text and labels use the full width** of their container (no artificial “reading column” cap). This keeps dense app screens aligned with wide layouts and tables.

- **Main column:** Routed content sits in a **`w-full max-w-none`** wrapper with **horizontal padding only** (`src/App.jsx`)—no global `max-w-6xl`-style limit on page width.
- **Page headers:** **`.ds-page-header-inner`** is **`max-w-none`** so kicker, title, and lede span the full header card.
- **Section copy:** **`.ds-section-prose`**, ledes, and list copy use **`max-w-none`** / **`w-full`** patterns; do not narrow body copy with `max-w-prose`, `max-w-3xl`, etc., unless an explicit **marketing** screen follows the Enterprise Gateway pattern and calls for a measure cap.
- **Forms:** Primary **`ds-input` / `ds-select`** fields use **`w-full`** within their grid or flex column (no fixed `max-w-[22rem]` caps on playground settings-style screens).
- **Exceptions:** Controls that are **not** paragraph text (native **color** pickers, icon-only buttons, fixed numeric toolkits like a calculator **key grid** that still uses `w-full` on the shell) may use intrinsic or component-local sizing; surrounding **titles and help text** still follow full measure above.

### Spacing (design tokens)

| Token | Value | Usage |
|-------|-------|-------|
| tight | `4px` / `0.25rem` | Tight gaps |
| sm | `8px` / `0.5rem` | Icon gaps, inline spacing |
| md | `16px` / `1rem` | Standard padding |
| lg | `24px` / `1.5rem` | Section padding |
| xl | `32px` / `2rem` | Large gaps |
| 2xl | `48px` / `3rem` | Section margins |
| 3xl | `64px` / `4rem` | Hero padding |

**Tailwind / `@theme` implementation:** This repo maps spacing through Tailwind’s scale (e.g. `--spacing-md`, `--spacing-lg` in `src/index.css`). **Do not** define a custom `--spacing-xs` token in `@theme`—it conflicts with Tailwind utilities such as `max-w-xs`.

### Shadow depths

Design intent:

| Level | Value | Usage |
|-------|-------|-------|
| sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| md | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| lg | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| xl | `0 20px 25px rgba(0,0,0,0.15)` | Heroes, featured cards |

**Implementation:** Utilities `shadow-ds-sm`, `shadow-ds-md`, `shadow-ds-lg`, `shadow-ds-xl` in `src/index.css` (`--shadow-ds-*`).

---

## Component Specs

Interpret with **Anti-Patterns**: avoid hover transforms that reflow content; use **shadow/opacity** on hover where possible.

### Buttons

- **Primary / CTA:** background Accent (`--color-accent`), text on-accent; `border-radius` 8px; font-weight 600; transitions 150–300ms; `cursor: pointer`.
- **Secondary:** transparent background; border 2px Primary (`--color-primary`); text Primary.

Illustrative CSS (hex values match tokens above):

```css
/* Primary CTA */
.btn-primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: opacity 200ms ease, box-shadow 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.92;
  box-shadow: var(--shadow-ds-md, 0 4px 6px rgb(0 0 0 / 0.1));
}

/* Secondary */
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: border-color 200ms ease, background-color 200ms ease;
  cursor: pointer;
}
```

### Cards

- Prefer **surface** (`--color-surface`) for elevated panels on **background** (`--color-bg`).
- Radius 12px; padding consistent with spacing md/lg; shadow md; hover may deepen shadow (no layout jump).

### Inputs

- Border neutral; focus ring uses **Ring** (`--color-ring`) with subtle spread (see existing focus styles in app).

### Modals

- Overlay, modal surface, radius, max-width as in product; use shadow xl for elevation.

---

## Style Guidelines (reference — not default web shell)

**Style label:** SaaS Mobile (High-Tech Boutique)

**Keywords:** saas, electric blue, gradient, fintech, spring animation, dual font, glassmorphism, boutique, premium, etc.

**Applies to:** Conceptual / native-mobile explorations only unless explicitly requested.

**Do not** treat this block as mandatory for the Taurex Playground web app; **Global Rules** define the web baseline.

### Page Pattern (marketing): Enterprise Gateway

Use when building **marketing** paths: hero → industries → roles → logos → contact. Not required for authenticated app shells.

---

## Anti-Patterns (Do NOT Use)

- ❌ Excessive animation

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid transforms that move layout; subtle opacity/shadow OK
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Use transitions (150–300ms)
- ❌ **Invisible focus states** — Focus states must be visible for keyboard navigation

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] **Copy width:** Page ledes, section prose, and form fields in app flows use **full container width** (`max-w-none` / `w-full` where applicable); no stray `max-w-*` caps on main reading text unless the screen is an approved narrow marketing pattern
- [ ] Colors come from **tokens** (`--color-*` / Tailwind semantic utilities), not ad-hoc hex in components
- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150–300ms)
- [ ] Text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
