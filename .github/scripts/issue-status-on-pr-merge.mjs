/**
 * On PR merge to dev: add status:done, drop prior status labels, close linked issues.
 * Issue numbers: PR body (Closes/Fixes/Resolves #n) and head branch issue-<n> per builder naming.
 */
import { spawnSync } from 'node:child_process'

const body = String(process.env.PR_BODY || '')
const headRef = String(process.env.HEAD_REF || '')

const fromBody = new Set()
const re =
  /(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s*#(\d+)/gi
let m
while ((m = re.exec(body)) !== null) {
  fromBody.add(parseInt(m[1], 10))
}

const fromBranch = new Set()
const bm = headRef.match(/(?:^|[/-])issue-(\d+)/i)
if (bm) fromBranch.add(parseInt(bm[1], 10))

const nums = [...new Set([...fromBody, ...fromBranch])]
if (nums.length === 0) {
  console.log('No issue numbers from PR body or head ref; nothing to do.')
  process.exit(0)
}

const STATUS = {
  needsPlan: 'status:needs-plan',
  done: 'status:done',
  inProgress: 'status:in-progress',
  inReview: 'status:in-review',
}

function gh(args) {
  const r = spawnSync('gh', args, { encoding: 'utf8', shell: false })
  if (r.status !== 0) {
    console.error('gh failed:', args.join(' '), r.stderr || r.stdout)
  }
  return r.status === 0
}

for (const n of nums) {
  gh(['issue', 'edit', String(n), '--add-label', STATUS.done])
  gh(['issue', 'edit', String(n), '--remove-label', STATUS.needsPlan])
  gh(['issue', 'edit', String(n), '--remove-label', STATUS.inProgress])
  gh(['issue', 'edit', String(n), '--remove-label', STATUS.inReview])
  gh(['issue', 'close', String(n)])
}

console.log('Updated issues:', nums.join(', '))
