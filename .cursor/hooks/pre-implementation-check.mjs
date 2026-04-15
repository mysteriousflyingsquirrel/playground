/**
 * Maps to conceptual hook: pre-implementation-check (beforeSubmitPrompt).
 * Hard gate: implementation must be delegated to builder-agent.
 */
import fs from 'node:fs'

const stdin = fs.readFileSync(0, 'utf8')

function out(obj) {
  process.stdout.write(JSON.stringify(obj))
}

let payload = {}
try {
  payload = JSON.parse(stdin || '{}')
} catch {
  out({ continue: true })
  process.exit(0)
}

const prompt = String(payload.prompt || '')
const looksImplement =
  /\b(implement|implementation|build(\s+out)?|write\s+code|start\s+(coding|implementation)|code\s+it|create|add|fix|change|modify|update|ship|deliver)\b/i.test(
    prompt
  ) || /\b(do\s+it|go\s+ahead)\b/i.test(prompt)

const referencesWorkflowContext = /#\d+|\.cursor\/plans\/|\/plan-from-issue|approved\s+plan/i.test(
  prompt
)

const mentionsBuilderAgent = /\bbuilder-agent\b/i.test(prompt)

if ((looksImplement || referencesWorkflowContext) && !mentionsBuilderAgent) {
  out({
    continue: false,
    user_message:
      'Implementation is blocked unless it is explicitly delegated to builder-agent. Re-run using builder-agent with the approved plan and issue number (for example: "delegate builder-agent for Issue #16").',
  })
  process.exit(0)
}

out({ continue: true })
process.exit(0)
