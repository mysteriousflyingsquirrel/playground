# Planning: Planning Page

**Issue:** Planning Page  
**Status:** ready

---

## Problem / Goal

Create an additional page that introduces users to how to plan issues, displaying the "Minimal Manual Planning Loop" content.

---

## Expected Outcome

A fully working "Planning" page accessible via the sidebar, following the existing page style and patterns.

---

## Acceptance Criteria

- [ ] Button in sidebar exists and is clickable
- [ ] Page loads when clicked
- [ ] Page UI follows the same style as existing pages (Home, Info)
- [ ] Page displays the "Minimal Manual Planning Loop" content

---

## Implementation Plan

1. **Create the page component**
   - Create `src/pages/Planning.jsx`
   - Follow the same structure as `Info.jsx` (uses `div.page`, `h1`, `p.page-lead`, `section.info-section`)
   - Display the planning loop content:
     - Core Flow steps
     - Status transitions diagram/list

2. **Register the route**
   - Import `Planning` in `src/routes.jsx`
   - Add entry to `navRoutes`: `{ path: '/planning', label: 'Planning', element: <Planning /> }`

---

## Content to Display

```
Minimal Manual Planning Loop (Clean Version)

Core Flow:
1. Create issue → status:needs-plan
2. Comment → @cursor plan this issue
3. Agent creates/updates plan markdown
4. If questions exist → status:awaiting-answers
5. You answer → comment
6. Comment → @cursor refine plan
7. Loop until no questions
8. Agent sets → status:ready
```

---

## Open Questions

_No open questions - requirements are clear._

---

## Notes

- No backend/database required (static content page)
- Follows existing patterns in codebase
- Simple implementation with no external dependencies
