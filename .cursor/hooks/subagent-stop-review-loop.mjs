/**
 * manual-review-followup — if subagent summary contains [[BLOCKING]], nudge coding-clanker + re-review.
 */
import fs from 'node:fs'

const stdin = fs.readFileSync(0, 'utf8')
let payload = {}
try {
  payload = JSON.parse(stdin || '{}')
} catch {
  process.stdout.write('{}')
  process.exit(0)
}

const summary = String(payload.summary || '')
if (!summary.includes('[[BLOCKING]]')) {
  process.stdout.write('{}')
  process.exit(0)
}

const messages = []
if (summary.includes('[[BLOCKING]]')) {
  messages.push(
    'Subagent reported [[BLOCKING]]. Click Build on the accepted plan again, then re-run /build-and-run and /review-issue. Use /publish-issue only after the branch is ready.'
  )
}

process.stdout.write(JSON.stringify({ followup_message: messages.join('\n\n') }))
process.exit(0)
