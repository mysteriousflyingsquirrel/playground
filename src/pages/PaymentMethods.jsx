import { useState } from 'react'

const PREDEFINED_METHODS = [
  'Visa',
  'Mastercard',
  'PayPal',
  'Apple Pay',
  'Bank transfer',
]

const fieldLabel = 'mb-1.5 block text-sm text-muted'
const inputLike =
  'w-full max-w-[22rem] rounded-lg border border-border bg-surface px-3 py-2.5 font-inherit text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const btnSecondary =
  'm-0 cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 font-inherit text-sm font-medium text-fg transition-colors hover:border-accent-dim hover:bg-accent/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const btnPrimary =
  'm-0 cursor-pointer rounded-lg border border-accent-dim bg-accent/[0.22] px-3 py-2 font-inherit text-sm font-semibold text-fg transition-colors hover:bg-accent/[0.32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

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
    <div className="max-w-2xl">
      <h1 className="mb-3 text-[1.75rem] font-semibold">Payment methods</h1>
      <p className="mb-6 text-[1.05rem] leading-normal text-muted [&_strong]:text-fg">
        Choose from predefined method types and manage your list. No card numbers or other
        sensitive details are collected here—this page is for layout and flow only.
      </p>

      <section className="mb-7" aria-labelledby="payment-methods-add-heading">
        <h2 id="payment-methods-add-heading" className="mb-2 text-base font-semibold text-fg">
          Add a method
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 basis-[12rem]">
            <label className={fieldLabel} htmlFor="payment-method-type">
              Method type
            </label>
            <select
              id="payment-method-type"
              className={inputLike}
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
          <button type="button" className={btnPrimary} onClick={addMethod}>
            Add
          </button>
        </div>
      </section>

      <section aria-labelledby="payment-methods-list-heading">
        <h2 id="payment-methods-list-heading" className="mb-2 text-base font-semibold text-fg">
          Your methods
        </h2>
        {methods.length === 0 ? (
          <p className="m-0 text-[0.9375rem] text-muted">No methods added yet.</p>
        ) : (
          <ul className="m-0 list-none divide-y divide-border rounded-[10px] border border-border bg-surface p-0">
            {methods.map((name, index) => (
              <li
                key={`${name}-${index}`}
                className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-3"
              >
                <span className="text-[0.9375rem] text-fg">{name}</span>
                <button
                  type="button"
                  className={btnSecondary}
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
  )
}
