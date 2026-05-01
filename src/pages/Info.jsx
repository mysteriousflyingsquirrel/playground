function IconCheck() {
  return (
    <svg className="ds-list-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconStep({ n }) {
  return (
    <span
      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-primary bg-muted-bg text-xs font-bold text-primary"
      aria-hidden
    >
      {n}
    </span>
  )
}

export default function Info() {
  return (
    <div className="ds-page">
      <header className="ds-page-header">
        <div className="ds-page-header-inner">
          <p className="ds-page-kicker">Overview</p>
          <h1 className="ds-page-title">About this project</h1>
          <p className="ds-page-lede">
            This app is a <strong className="font-semibold text-fg">developer playground</strong>: a React + Vite shell where you
            can try ideas, spike features, and experiment without touching production code.
          </p>
        </div>
      </header>

      <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2 lg:gap-8 lg:items-start">
        <section className="ds-section ring-1 ring-primary/[0.06]">
          <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted-bg text-secondary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </span>
            <h2 className="ds-section-title m-0">What it is for</h2>
          </div>
          <ul className="mt-0 w-full min-w-0 list-none space-y-4 p-0">
            <li className="ds-list-check">
              <IconCheck />
              <span>Prototype UI flows and components in isolation.</span>
            </li>
            <li className="ds-list-check">
              <IconCheck />
              <span>Mimic real product features—routing, forms, lists, and calendars—in a safe space.</span>
            </li>
            <li className="ds-list-check">
              <IconCheck />
              <span>
                Extend navigation by editing <code className="ds-kbd">src/routes.jsx</code> and adding a page under{' '}
                <code className="ds-kbd">src/pages/</code>.
              </span>
            </li>
          </ul>
        </section>

        <section className="ds-section ring-1 ring-secondary/[0.08]">
          <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted-bg text-secondary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="ds-section-title m-0">Add a new page</h2>
          </div>
          <ol className="relative mt-0 w-full min-w-0 list-none space-y-5 p-0">
            <div className="absolute bottom-2 left-[15px] top-10 hidden w-px bg-border md:block" aria-hidden />
            <li className="relative ds-list-check">
              <IconStep n={1} />
              <span>
                Create <code className="ds-kbd">src/pages/YourPage.jsx</code>.
              </span>
            </li>
            <li className="relative ds-list-check">
              <IconStep n={2} />
              <span>
                Import it in <code className="ds-kbd">src/routes.jsx</code> and append an entry to{' '}
                <code className="ds-kbd">navRoutes</code>.
              </span>
            </li>
            <li className="relative ds-list-check">
              <IconStep n={3} />
              <span>
                Use semantic utilities from <code className="ds-kbd">src/index.css</code> for consistent chrome.
              </span>
            </li>
          </ol>
        </section>
      </div>
    </div>
  )
}
