import { useState } from 'react'

const PREDEFINED_METHODS = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Bank transfer']

export default function PaymentMethods() {
  const [methods, setMethods] = useState([])
  const [selected, setSelected] = useState(PREDEFINED_METHODS[0])

  const addMethod = () => {
    setMethods((prev) => [...prev, selected])
  }

  const removeAt = (index) => {
    setMethods((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="ds-page">
      <header className="ds-page-header">
        <div className="ds-page-header-inner">
          <p className="ds-page-kicker">Billing</p>
          <h1 className="ds-page-title">Payment methods</h1>
          <p className="ds-page-lede">
            Choose from predefined method types and manage your list. No card numbers or other sensitive details are collected
            here—this page is for layout and flow only.
          </p>
        </div>
      </header>

      <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2 lg:gap-8 lg:items-start">
        <section className="ds-section ring-1 ring-accent/15" aria-labelledby="payment-methods-add-heading">
          <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted-bg text-accent">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </span>
            <h2 id="payment-methods-add-heading" className="ds-section-title m-0">
              Add a method
            </h2>
          </div>
          <p className="ds-section-prose mt-0">
            Primary actions use the amber CTA token; secondary actions stay outlined in primary navy.
          </p>
          <div className="mt-6 flex flex-wrap items-end gap-4">
            <div className="min-w-0 w-full flex-1">
              <label className="ds-field-label" htmlFor="payment-method-type">
                Method type
              </label>
              <select
                id="payment-method-type"
                className="ds-select w-full"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {PREDEFINED_METHODS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="ds-btn-primary" onClick={addMethod}>
              Add method
            </button>
          </div>
        </section>

        <section className="ds-section ring-1 ring-primary/[0.06]" aria-labelledby="payment-methods-list-heading">
          <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted-bg text-secondary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </span>
            <h2 id="payment-methods-list-heading" className="ds-section-title m-0">
              Your methods
            </h2>
          </div>
          {methods.length === 0 ? (
            <div className="mt-2 rounded-2xl border border-dashed border-border bg-muted-bg/50 px-5 py-10 text-center">
              <p className="m-0 text-[0.9375rem] text-muted">
                No methods added yet. Pick a type and use <span className="font-semibold text-fg">Add method</span>.
              </p>
            </div>
          ) : (
            <ul className="mt-2 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface shadow-ds-sm">
              {methods.map((name, index) => (
                <li
                  key={`${name}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-3 bg-bg px-4 py-3.5 transition-colors duration-150 hover:bg-muted-bg/40"
                >
                  <span className="text-[0.9375rem] font-medium text-fg">{name}</span>
                  <button
                    type="button"
                    className="ds-btn-secondary px-3 py-2 text-xs"
                    onClick={() => removeAt(index)}
                    aria-label={`Remove ${name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
