/**
 * GitHub issue status labels for coding-clanker and github-clanker (hooks + shared helpers).
 * Fail-open: never throws; logs to stderr on recoverable gh failures.
 */
import { execSync, spawnSync } from 'node:child_process'

export const STATUS = {
  todo: 'status:todo',
  inProgress: 'status:in-progress',
  inReview: 'status:in-review',
  readyToMerge: 'status:ready-to-merge',
  done: 'status:done',
}

const ALL_STATUS = [
  STATUS.todo,
  STATUS.inProgress,
  STATUS.inReview,
  STATUS.readyToMerge,
  STATUS.done,
]

let cachedGhExe = null

export function extractIssueNumber(...texts) {
  for (const t of texts) {
    const m = String(t || '').match(/#(\d+)/)
    if (m) return parseInt(m[1], 10)
  }
  return null
}

/** Repository root for git/gh (hooks should run from project root; this guards cwd drift). */
export function getGitWorkspaceRoot() {
  try {
    return execSync('git rev-parse --show-toplevel', {
      encoding: 'utf8',
      cwd: process.cwd(),
    }).trim()
  } catch {
    return null
  }
}

export function getRepoSlug() {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY.trim()
  const cwd = getGitWorkspaceRoot() || process.cwd()
  try {
    const url = execSync('git remote get-url origin', {
      encoding: 'utf8',
      cwd,
    }).trim()
    const m = url.match(/github\.com[:/]([^/]+\/[^/.]+)/)
    if (!m) return null
    return m[1].replace(/\.git$/i, '')
  } catch {
    return null
  }
}

function log(...args) {
  console.error('[issue-status-labels]', ...args)
}

function resolveGhExecutable() {
  if (cachedGhExe !== null) return cachedGhExe
  if (process.platform !== 'win32') {
    cachedGhExe = 'gh'
    return cachedGhExe
  }
  const r = spawnSync('where.exe', ['gh'], {
    encoding: 'utf8',
    shell: false,
    cwd: process.cwd(),
  })
  if (r.status !== 0 || !String(r.stdout || '').trim()) {
    cachedGhExe = 'gh'
    return cachedGhExe
  }
  const lines = String(r.stdout)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
  const preferExe = lines.find((p) => /(^|[\\/])gh\.exe$/i.test(p))
  cachedGhExe = preferExe || lines[0] || 'gh'
  return cachedGhExe
}

function logGhFailure(context, r) {
  log(context, 'failed status=', r.status, 'error=', r.error?.message || '')
  if (r.stderr?.trim()) log('stderr:', r.stderr.trim())
  if (r.stdout?.trim()) log('stdout:', r.stdout.trim())
}

function gh(args) {
  const cwd = getGitWorkspaceRoot() || process.cwd()
  const exe = resolveGhExecutable()
  return spawnSync(exe, args, {
    encoding: 'utf8',
    shell: false,
    cwd,
  })
}

function ghIssueEdit(repo, issue, extraArgs) {
  const r = gh(['issue', 'edit', String(issue), '--repo', repo, ...extraArgs])
  if (r.status !== 0 || r.error) {
    logGhFailure('gh issue edit', r)
  }
  return r
}

/** Remove status labels that might be present; ignore missing-label errors. */
function removeStatusLabels(repo, issue, except) {
  for (const label of ALL_STATUS) {
    if (label === except) continue
    gh(['issue', 'edit', String(issue), '--repo', repo, '--remove-label', label])
  }
}

/** Task + description + summary (Cursor populates different fields per release). */
function agentTextBlob(payload) {
  return [payload.task, payload.description, payload.summary].map((x) => String(x || '')).join('\n')
}

/** Letters-only slug so "GithubClanker", "github_clanker", "GitHub Clanker" all match. */
function typeLetters(typ) {
  return String(typ || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

function typeMentionsCodingClanker(typ) {
  const L = typeLetters(typ)
  return L.includes('coding') && L.includes('clanker')
}

function typeMentionsGithubClanker(typ) {
  const L = typeLetters(typ)
  return L.includes('github') && L.includes('clanker')
}

export function isCodingClankerSubagent(payload) {
  const typ = String(payload.subagent_type || '')
  if (
    typ === 'coding-clanker' ||
    typ === 'coding_clanker' ||
    typ === 'builder-agent' ||
    typ === 'builder_agent'
  )
    return true
  if (typeMentionsCodingClanker(typ)) return true
  const blob = agentTextBlob(payload)
  if (/\bcoding-clanker\b/i.test(blob) || /\bcoding_clanker\b/i.test(blob)) return true
  if (/\bbuilder-agent\b/i.test(blob) || /\bbuilder_agent\b/i.test(blob)) return true
  if (/\/implement-plan\b/i.test(blob) || /\/plan-from-issue\b/i.test(blob)) return true
  const desc = String(payload.description || '')
  if (/coding/i.test(desc) && /clanker/i.test(desc) && /approved plan/i.test(desc)) return true
  if (/builder/i.test(desc) && /approved plan/i.test(desc)) return true
  return false
}

export function validateCodingClankerIssueContext(payload) {
  if (!isCodingClankerSubagent(payload)) return { ok: true, issue: null, repo: null }
  const issue = extractIssueNumber(payload.task, payload.description, payload.summary)
  if (!issue) return { ok: false, reason: 'missing_issue' }
  const repo = getRepoSlug()
  if (!repo) return { ok: false, reason: 'missing_repo', issue }
  return { ok: true, issue, repo }
}

export function isGithubClankerSubagent(payload) {
  const typ = String(payload.subagent_type || '')
  if (typ === 'github-clanker' || typ === 'github_clanker') return true
  if (typeMentionsGithubClanker(typ)) return true
  const blob = agentTextBlob(payload)
  if (/\bgithub-clanker\b/i.test(blob) || /\bgithub_clanker\b/i.test(blob)) return true
  if (/\/github-publish\b/i.test(blob) || /\bgithub-publish\b/i.test(blob)) return true
  if (/github[-\s]publish/i.test(blob)) return true
  const desc = String(payload.description || '')
  if (/github/i.test(desc) && /clanker/i.test(desc) && /publish/i.test(desc)) return true
  return false
}

/**
 * subagentStart: transition to status:in-progress when coding-clanker starts.
 */
export function applyCodingClankerStartLabel(payload) {
  if (!isCodingClankerSubagent(payload)) return { ok: true, skipped: true }
  const issue = extractIssueNumber(payload.task, payload.description, payload.summary)
  if (!issue) {
    log('skip in-progress: no #issue in task')
    return { ok: false, reason: 'missing_issue' }
  }
  const repo = getRepoSlug()
  if (!repo) {
    log('skip in-progress: could not resolve repo from origin')
    return { ok: false, reason: 'missing_repo', issue }
  }
  removeStatusLabels(repo, issue, STATUS.inProgress)
  const r = ghIssueEdit(repo, issue, ['--add-label', STATUS.inProgress])
  if (r.status !== 0) {
    log('gh issue edit in-progress failed', r.status)
    return { ok: false, reason: 'gh_label_update_failed', issue, repo }
  }
  return { ok: true, issue, repo }
}

/**
 * subagentStop: transition to status:in-review when local coding-clanker work completes successfully.
 */
export function applyCodingClankerStopLabel(payload) {
  if (!isCodingClankerSubagent(payload)) return { ok: true, skipped: true }
  if (payload.status !== 'completed') return { ok: true, skipped: true }
  const issue = extractIssueNumber(payload.task, payload.summary, payload.description)
  if (!issue) {
    log('skip in-review: no #issue in task/summary/description')
    return { ok: false, reason: 'missing_issue' }
  }
  const repo = getRepoSlug()
  if (!repo) {
    log('skip in-review: could not resolve repo from origin')
    return { ok: false, reason: 'missing_repo', issue }
  }
  removeStatusLabels(repo, issue, STATUS.inReview)
  const r = ghIssueEdit(repo, issue, ['--add-label', STATUS.inReview])
  if (r.status !== 0) {
    log('gh issue edit in-review failed', r.status)
    return { ok: false, reason: 'gh_label_update_failed', issue, repo }
  }
  return { ok: true, issue, repo }
}

/**
 * subagentStop: transition to status:ready-to-merge when github-clanker completes successfully (PR published / ready).
 */
export function applyGithubClankerStopLabel(payload) {
  if (!isGithubClankerSubagent(payload)) return { ok: true, skipped: true }
  if (payload.status !== 'completed') return { ok: true, skipped: true }
  const issue = extractIssueNumber(payload.task, payload.summary, payload.description)
  if (!issue) {
    log('skip ready-to-merge: no #issue in task/summary/description')
    return { ok: false, reason: 'missing_issue' }
  }
  const repo = getRepoSlug()
  if (!repo) {
    log('skip ready-to-merge: could not resolve repo from origin')
    return { ok: false, reason: 'missing_repo', issue }
  }
  removeStatusLabels(repo, issue, STATUS.readyToMerge)
  const r = ghIssueEdit(repo, issue, ['--add-label', STATUS.readyToMerge])
  if (r.status !== 0) {
    log('gh issue edit ready-to-merge (github-clanker) failed', r.status)
    return { ok: false, reason: 'gh_label_update_failed', issue, repo }
  }
  return { ok: true, issue, repo }
}
