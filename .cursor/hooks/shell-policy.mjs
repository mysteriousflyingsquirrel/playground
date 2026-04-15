/**
 * Conceptual: pr-open-trigger + strict PR base dev / no push to main or dev.
 * beforeShellExecution — return permission JSON.
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'

const stdin = fs.readFileSync(0, 'utf8')
let payload = {}
try {
  payload = JSON.parse(stdin || '{}')
} catch {
  printAllow()
  process.exit(0)
}

const command = String(payload.command || '')

function printAllow() {
  process.stdout.write(
    JSON.stringify({
      permission: 'allow',
    })
  )
}

function printDeny(userMessage, agentMessage) {
  process.stdout.write(
    JSON.stringify({
      permission: 'deny',
      user_message: userMessage,
      agent_message: agentMessage,
    })
  )
}

// Block pushes to protected branches (explicit refspecs only)
if (/\bgit\s+push\b/i.test(command)) {
  const pushToMain =
    /\bmain\b/.test(command) ||
    /:main\b/.test(command) ||
    /refs\/heads\/main\b/.test(command)
  const pushToDev =
    /\sorigin\s+dev(?:\s|$)/i.test(command) ||
    /:dev(?:\s|$)/i.test(command) ||
    /refs\/heads\/dev\b/.test(command) ||
    /\supstream\s+dev(?:\s|$)/i.test(command)

  if (pushToMain) {
    printDeny(
      'Push to main blocked by project hook.',
      'Do not push to main. Use a feature branch and gh pr create --base dev; main is human-release only.'
    )
    process.exit(0)
  }
  if (pushToDev) {
    printDeny(
      'Push to dev blocked by project hook.',
      'Do not push to dev. Push only your feature branch; a human merges the PR into dev.'
    )
    process.exit(0)
  }

  // Also block bare push when currently on protected branch.
  const hasExplicitRefSpec =
    /:/.test(command) ||
    /\sorigin\s+\S+/.test(command) ||
    /\supstream\s+\S+/.test(command)
  if (!hasExplicitRefSpec) {
    try {
      const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf8',
        cwd: process.cwd(),
      }).trim()
      if (currentBranch === 'main' || currentBranch === 'dev') {
        printDeny(
          `Push from ${currentBranch} blocked by project hook.`,
          `Do not push while checked out on ${currentBranch}. Switch to a feature branch and push that branch only; PRs must target dev.`
        )
        process.exit(0)
      }
    } catch {
      // Fail open if current branch cannot be resolved.
    }
  }
}

// Enforce PR base dev for gh pr create
if (/\bgh(\.exe)?\s+pr\s+create\b/i.test(command)) {
  const hasBaseDev = /--base(\s+|=)dev\b/i.test(command)
  const hasBaseMain = /--base(\s+|=)main\b/i.test(command)
  const hasIssueCloseRef = /\b(Closes|Fixes)\s+#\d+\b/i.test(command)
  if (hasBaseMain || !hasBaseDev) {
    printDeny(
      'PR must target dev.',
      'Re-run with an explicit dev base, e.g. gh pr create --base dev (and do not use --base main). Agents must not open PRs to main.'
    )
    process.exit(0)
  }
  if (!hasIssueCloseRef) {
    printDeny(
      'PR body must link issue closure.',
      'Re-run gh pr create and include "Closes #<n>" or "Fixes #<n>" in the PR body so label automation can transition to status:done after merge to dev.'
    )
    process.exit(0)
  }
  process.stdout.write(
    JSON.stringify({
      permission: 'allow',
      agent_message:
        'PR targets dev. Next: delegate code-review-agent, then ui-review-agent (skip ui-review-agent with UI N/A if no src/**/*.{js,jsx,css} changed).',
    })
  )
  process.exit(0)
}

printAllow()
process.exit(0)
