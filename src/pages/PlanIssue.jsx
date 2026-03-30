export default function PlanIssue() {
  return (
    <div className="page">
      <h1>Plan an issue</h1>
      <p className="page-lead">
        Turn an issue or rough request into a concrete implementation plan.
      </p>

      <section className="info-section">
        <h2>Steps</h2>
        <ol>
          <li>Start from the problem, expected outcome, and acceptance criteria.</li>
          <li>
            If an issue exists, align to{' '}
            <code>.github/ISSUE_TEMPLATE/feature-bug-chore.yml</code>.
          </li>
          <li>Search the codebase for the files most likely to be affected.</li>
          <li>
            Ask clarifying questions only when missing answers would change the
            implementation.
          </li>
          <li>
            Produce a phased plan with concrete files, real commands, and
            verification steps.
          </li>
          <li>
            If the work changes the operating model, include updates to{' '}
            <code>docs/project_init.md</code>.
          </li>
        </ol>
      </section>
    </div>
  )
}
