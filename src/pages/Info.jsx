export default function Info() {
  return (
    <div className="page">
      <h1>About this project</h1>
      <p className="page-lead">
        This app is a <strong>developer playground</strong>: a small React + Vite
        shell where you can try ideas, spike features, and experiment without
        touching production code.
      </p>
      <section className="info-section">
        <h2>What it’s for</h2>
        <ul>
          <li>Prototype UI flows and components in isolation.</li>
          <li>Mimic real product features (routing, forms, lists, etc.) in a safe space.</li>
          <li>Reuse the sidebar pattern: add a route in <code>src/routes.jsx</code> and a page under <code>src/pages/</code>.</li>
        </ul>
      </section>
      <section className="info-section">
        <h2>Add a new page</h2>
        <ol>
          <li>Create <code>src/pages/YourPage.jsx</code>.</li>
          <li>Import it in <code>src/routes.jsx</code> and append an entry to <code>navRoutes</code>.</li>
        </ol>
      </section>
    </div>
  )
}
