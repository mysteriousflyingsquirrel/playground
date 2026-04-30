---
name: create-issue
description: Creates a GitHub issue from a rough request using the repository issue form structure. Use when the user asks to open, file, or create an issue from incomplete requirements.
---

# Create Issue

## Goal

Create one GitHub issue from a rough request with minimal clarification, then stop.

## Behavior Rules

- Reuse the repository's `.github/ISSUE_TEMPLATE/issue.yml` structure.
- Keep clarifying questions short and minimal.
- Ask questions only when required information is missing or ambiguous.
- Do not plan implementation.
- Do not create branches.
- Do not edit code.
- Apply the initial label `status:todo`.
- End after the issue is created and the URL is shared.

## Required Issue Content

Always produce issue content that strictly follows the current repository issue form schema in `.github/ISSUE_TEMPLATE/issue.yml`.

Do not hardcode sections, field names, option lists, or checkbox counts in this skill. Treat the template as the single source of truth.

## Workflow

1. Read `.github/ISSUE_TEMPLATE/issue.yml`.
2. Parse the rough request into:
  - issue title
  - values for the exact fields defined in the current template
  - markdown body that matches the current template structure
3. If essential information is missing, ask 1-3 short clarifying questions.
4. Fill any still-missing non-essential fields with concise, neutral placeholders that still conform to template expectations.
5. Create the issue through GitHub MCP with:
  - label `status:todo`
  - body matching the current template structure exactly
6. Return the created issue URL and stop.

## Clarification Heuristics

Ask only for blockers:

- **A required template field** has no reliable value.
- **A required template constraint** cannot be satisfied (for example required option choice or minimum checklist items).
- **No clear problem/goal** can be mapped into the required template fields.

Avoid asking about implementation details, architecture, branch strategy, or solution design.

## GitHub MCP Usage

Before calling any MCP tool, inspect the GitHub MCP tool schema/descriptor for correct parameters.
Then call the GitHub issue-creation tool with the prepared title, body, and label.