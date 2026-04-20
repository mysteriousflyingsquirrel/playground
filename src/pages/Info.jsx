export default function Info() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-3 text-[1.75rem] font-semibold">About this project</h1>
      <p className="mb-6 text-[1.05rem] leading-normal text-muted [&_strong]:text-fg">
        This app is a <strong>developer playground</strong>: a small React + Vite shell where you
        can try ideas, spike features, and experiment without touching production code.
      </p>
      <section className="mb-7">
        <h2 className="mb-2 text-base font-semibold text-fg">What it’s for</h2>
        <ul className="m-0 list-disc pl-5 text-muted">
          <li className="mb-1.5">Prototype UI flows and components in isolation.</li>
          <li className="mb-1.5">
            Mimic real product features (routing, forms, lists, etc.) in a safe space.
          </li>
          <li className="mb-1.5">
            Reuse the sidebar pattern: add a route in{' '}
            <code className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.875em] text-accent-dim">
              src/routes.jsx
            </code>{' '}
            and a page under{' '}
            <code className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.875em] text-accent-dim">
              src/pages/
            </code>
            .
          </li>
        </ul>
      </section>
      <section className="mb-7">
        <h2 className="mb-2 text-base font-semibold text-fg">Add a new page</h2>
        <ol className="m-0 list-decimal pl-5 text-muted">
          <li className="mb-1.5">
            Create{' '}
            <code className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.875em] text-accent-dim">
              src/pages/YourPage.jsx
            </code>
            .
          </li>
          <li className="mb-1.5">
            Import it in{' '}
            <code className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.875em] text-accent-dim">
              src/routes.jsx
            </code>{' '}
            and append an entry to{' '}
            <code className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.875em] text-accent-dim">
              navRoutes
            </code>
            .
          </li>
        </ol>
      </section>
    </div>
  )
}
