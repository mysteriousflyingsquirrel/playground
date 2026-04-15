/**
 * review-gate — v1 allows all subagents; optional stderr log.
 * When builder-agent starts, set GitHub issue label status:in-progress (see issue-status-labels.mjs).
 */
import fs from 'node:fs'
import {
  applyBuilderStartLabel,
  extractIssueNumber,
  isBuilderSubagent,
  validateBuilderIssueContext,
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
const task = String(payload.task || '').slice(0, 200)
console.error(`[subagentStart] type=${type} task=${task}`)

if (isBuilderSubagent(payload)) {
  const issue = extractIssueNumber(payload.task, payload.description)
  if (!issue) {
    process.stdout.write(
      JSON.stringify({
        permission: 'deny',
        user_message:
          'builder-agent start blocked: include an issue reference like #16 in the delegated task so GitHub status labels can be updated.',
        agent_message:
          'Include #<n> in the builder-agent task text (for example "Build Issue #16") so hooks can set status:in-progress and status:in-review.',
      })
    )
    process.exit(0)
  }

  const validation = validateBuilderIssueContext(payload)
  if (!validation.ok) {
    process.stdout.write(
      JSON.stringify({
        permission: 'deny',
        user_message:
          'builder-agent start blocked: cannot verify GitHub issue context for label automation. Ensure gh auth is active, origin points to GitHub, and issue # exists in this repo.',
        agent_message:
          'Fix GitHub context before delegation (gh auth status, correct origin repo, valid issue number), then retry builder-agent.',
      })
    )
    process.exit(0)
  }
}

const startResult = applyBuilderStartLabel(payload)
if (isBuilderSubagent(payload) && !startResult?.ok) {
  process.stdout.write(
    JSON.stringify({
      permission: 'deny',
      user_message:
        'builder-agent start blocked: failed to set issue status:in-progress. Resolve GitHub permissions/auth and retry.',
      agent_message:
        'Issue label transition failed at builder start; fix gh access/permissions, then rerun builder-agent so status automation stays accurate.',
    })
  )
  process.exit(0)
}

process.stdout.write(JSON.stringify({ permission: 'allow' }))
process.exit(0)
