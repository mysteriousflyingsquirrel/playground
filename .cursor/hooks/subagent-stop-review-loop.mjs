/**
 * manual-review-followup — if subagent summary contains [[BLOCKING]], nudge coding-clanker + re-review.
 * When coding-clanker completes successfully, set GitHub issue label status:in-review (see issue-status-labels.mjs).
 */
import fs from 'node:fs'
import { applyCodingClankerStopLabel } from './issue-status-labels.mjs'

const stdin = fs.readFileSync(0, 'utf8')
let payload = {}
try {
  payload = JSON.parse(stdin || '{}')
} catch {
  process.stdout.write('{}')
  process.exit(0)
}

const stopResult = applyCodingClankerStopLabel(payload)

const summary = String(payload.summary || '')
if (!summary.includes('[[BLOCKING]]') && (stopResult?.ok || stopResult?.skipped)) {
  process.stdout.write('{}')
  process.exit(0)
}

const messages = []
if (summary.includes('[[BLOCKING]]')) {
  messages.push(
    'Subagent reported [[BLOCKING]]. Click Build on the accepted plan again, then re-run /build-and-run, /code-review, and /ui-review (or UI N/A per ui-review-clanker instructions). Use /github-publish only after the branch is ready.'
  )
}
if (!(stopResult?.ok || stopResult?.skipped)) {
  messages.push(
    'coding-clanker completed but issue label transition to status:in-review failed. Fix gh auth/permissions and update labels manually before proceeding.'
  )
}

process.stdout.write(JSON.stringify({ followup_message: messages.join('\n\n') }))
process.exit(0)
