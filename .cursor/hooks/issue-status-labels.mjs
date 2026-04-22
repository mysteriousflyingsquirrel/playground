/**
 * Shared issue-context helpers for hook validation.
 * Fail-open: never throws; logs to stderr on recoverable gh failures.
 */
import { execSync } from 'node:child_process'

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

/** Task + prompt + description + summary (Cursor populates different fields per release). */
function agentTextBlob(payload) {
  return [payload.task, payload.prompt, payload.description, payload.summary]
    .map((x) => String(x || ''))
    .join('\n')
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
  if (/\/implement-issue\b/i.test(blob) || /\/plan-issue\b/i.test(blob)) return true
  const desc = String(payload.description || '')
  if (/coding/i.test(desc) && /clanker/i.test(desc) && /approved plan/i.test(desc)) return true
  if (/builder/i.test(desc) && /approved plan/i.test(desc)) return true
  return false
}

export function validateCodingClankerIssueContext(payload) {
  if (!isCodingClankerSubagent(payload)) return { ok: true, issue: null, repo: null }
  const issue = extractIssueNumber(
    payload.task,
    payload.prompt,
    payload.description,
    payload.summary
  )
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
  if (/\/publish-issue\b/i.test(blob) || /\bpublish-issue\b/i.test(blob)) return true
  if (/github[-\s]publish/i.test(blob)) return true
  const desc = String(payload.description || '')
  if (/github/i.test(desc) && /clanker/i.test(desc) && /publish/i.test(desc)) return true
  return false
}
