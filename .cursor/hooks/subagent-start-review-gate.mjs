/**
 * review-gate — validates coding-clanker start when applicable.
 */
import fs from 'node:fs'
import {
  extractIssueNumber,
  isCodingClankerSubagent,
  validateCodingClankerIssueContext,
} from './issue-status-labels.mjs'

const stdin = fs.readFileSync(0, 'utf8')
let payload = {}
try {
  payload = JSON.parse(stdin || '{}')
} catch {
  process.stdout.write(JSON.stringify({ permission: 'allow' }))
  process.exit(0)
}

const type = payload.subagent_type || ''
console.error(
  `[subagentStart] type=${type} keys=${Object.keys(payload).join(',')} ` +
    `task=${String(payload.task || '').slice(0, 120)} ` +
    `prompt=${String(payload.prompt || '').slice(0, 120)} ` +
    `desc=${String(payload.description || '').slice(0, 120)}`
)

if (isCodingClankerSubagent(payload)) {
  const issue = extractIssueNumber(
    payload.task,
    payload.prompt,
    payload.description,
    payload.summary
  )
  if (!issue) {
    process.stdout.write(
      JSON.stringify({
        permission: 'deny',
        user_message:
          'coding-clanker start blocked: include an issue reference like #16 in the delegated task.',
        agent_message:
          'Include #<n> in the coding-clanker task text (for example "Build Issue #16"). Plans created by /plan-issue should carry that issue number into the Build step.',
      })
    )
    process.exit(0)
  }

  const validation = validateCodingClankerIssueContext(payload)
  if (!validation.ok) {
    process.stdout.write(
      JSON.stringify({
        permission: 'deny',
        user_message:
          'coding-clanker start blocked: cannot verify GitHub issue context. Ensure gh auth is active, origin points to GitHub, and issue # exists in this repo.',
        agent_message:
          'Fix GitHub context before delegation (gh auth status, correct origin repo, valid issue number), then retry coding-clanker.',
      })
    )
    process.exit(0)
  }
}

process.stdout.write(JSON.stringify({ permission: 'allow' }))
process.exit(0)
