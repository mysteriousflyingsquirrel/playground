---

## name: publish-issue

description: Delegate GitHub publication to github-clanker. Use when the user types `/publish-issue #123` to commit the current reviewed branch, push it, and create or update a PR into dev.
disable-model-invocation: true

# GitHub publish

Use this skill only to delegate **[github-clanker](@.cursor/agents/github-clanker.md)**.

## Inputs

- Required issue number or issue link, as in `**/publish-issue #123`**.

## Steps

1. Identify the current feature branch.
2. Gather the latest verification context from the local branch (for example the latest successful `npm run build` and local review completion).
3. Delegate `**github-clanker`** with the issue number, current branch, and publish-ready context.
4. After successful delegation result, update issue labels explicitly:
  - Remove the current `status:*` label if present.
  - Add `status:ready-to-merge`.
5. Do not replace the subagent with inline commit or PR work unless delegation is impossible.

## Notes

- This command is only for reviewed work that is ready to publish.
- `github-clanker` must target `**dev`** and must not merge the PR.