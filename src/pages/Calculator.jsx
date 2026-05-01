import { useCallback, useState } from 'react'
import { cn } from '../cn.js'

const OPS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => (b === 0 ? null : a / b),
}

function formatNumber(n) {
  if (!Number.isFinite(n)) return '0'
  const v = Number.parseFloat(Number(n).toPrecision(12))
  return String(v)
}

const btnBase =
  'm-0 min-h-[2.75rem] min-w-0 cursor-pointer rounded-lg border border-border bg-surface px-2 py-2 font-inherit text-[1.05rem] font-semibold text-fg shadow-ds-sm transition-[border-color,background-color,box-shadow] duration-200 hover:border-secondary/45 hover:shadow-ds-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]'

const btnOp =
  'border-primary/30 bg-muted-bg text-primary hover:border-primary/50 hover:bg-muted-bg/90'
const btnEquals =
  'border-accent bg-accent text-on-accent shadow-ds-md transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-ds-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState(null)
  const [pendingOp, setPendingOp] = useState(null)
  const [overwrite, setOverwrite] = useState(false)
  const [error, setError] = useState(false)

  const readDisplay = useCallback(() => {
    const n = parseFloat(display)
    return Number.isFinite(n) ? n : 0
  }, [display])

  const clearError = useCallback(() => {
    setError(false)
    setDisplay('0')
    setMemory(null)
    setPendingOp(null)
    setOverwrite(true)
  }, [])

  const inputDigit = useCallback(
    (digit) => {
      if (error) {
        clearError()
        setDisplay(String(digit))
        setOverwrite(false)
        return
      }
      if (overwrite) {
        setDisplay(String(digit))
        setOverwrite(false)
        return
      }
      setDisplay((prev) => {
        const d = Number(digit)
        if (prev === '0' && d !== 0) return String(digit)
        if (prev === '-0' && d !== 0) return '-' + String(digit)
        if (prev === '0' && d === 0) return '0'
        return prev + String(digit)
      })
    },
    [error, overwrite, clearError],
  )

  const inputDot = useCallback(() => {
    if (error) {
      clearError()
      setDisplay('0.')
      setOverwrite(false)
      return
    }
    if (overwrite) {
      setDisplay('0.')
      setOverwrite(false)
      return
    }
    setDisplay((prev) => (prev.includes('.') ? prev : prev + '.'))
  }, [error, overwrite, clearError])

  const applyPending = useCallback((left, op, right) => {
    const fn = OPS[op]
    if (!fn) return left
    return fn(left, right)
  }, [])

  const commitOperator = useCallback(
    (nextOp) => {
      if (error) return
      const input = readDisplay()

      if (memory === null) {
        setMemory(input)
        setPendingOp(nextOp)
        setOverwrite(true)
        return
      }

      if (pendingOp === null) {
        setMemory(input)
        setPendingOp(nextOp)
        setOverwrite(true)
        return
      }

      if (overwrite) {
        setPendingOp(nextOp)
        return
      }

      const result = applyPending(memory, pendingOp, input)
      if (result === null) {
        setError(true)
        setDisplay('Cannot divide by zero')
        setMemory(null)
        setPendingOp(null)
        setOverwrite(true)
        return
      }

      const shown = formatNumber(result)
      setMemory(result)
      setDisplay(shown)
      setPendingOp(nextOp)
      setOverwrite(true)
    },
    [error, memory, pendingOp, overwrite, readDisplay, applyPending],
  )

  const equals = useCallback(() => {
    if (error) return
    if (memory === null || pendingOp === null) {
      setOverwrite(true)
      return
    }
    const input = readDisplay()
    const result = applyPending(memory, pendingOp, input)
    if (result === null) {
      setError(true)
      setDisplay('Cannot divide by zero')
      setMemory(null)
      setPendingOp(null)
      setOverwrite(true)
      return
    }
    setDisplay(formatNumber(result))
    setMemory(null)
    setPendingOp(null)
    setOverwrite(true)
  }, [error, memory, pendingOp, readDisplay, applyPending])

  const clearEntry = useCallback(() => {
    if (error) {
      clearError()
      return
    }
    setDisplay('0')
    setOverwrite(true)
  }, [error, clearError])

  return (
    <div className="ds-page">
      <header className="ds-page-header">
        <div className="ds-page-header-inner">
          <p className="ds-page-kicker">Tools</p>
          <h1 className="ds-page-title">Calculator</h1>
          <p className="ds-page-lede">
            Basic operations (+ − × ÷). <strong className="font-semibold text-fg">CE</strong> clears the current entry;{' '}
            <strong className="font-semibold text-fg">=</strong> completes the calculation.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-md lg:max-w-lg">
        <section
          className="w-full max-w-none rounded-2xl border border-border bg-surface p-6 shadow-ds-xl ring-1 ring-primary/[0.06] sm:p-8"
          aria-label="Calculator"
        >
          <output
            className="mb-5 block min-h-16 w-full min-w-0 break-all rounded-xl border border-border bg-muted-bg/80 px-4 py-4 text-right text-3xl font-bold tabular-nums leading-snug text-fg shadow-inner shadow-ds-sm"
            htmlFor="calculator-keys"
            aria-live="polite"
          >
            {display}
          </output>
          <div id="calculator-keys" className="grid w-full min-w-0 grid-cols-4 gap-2.5">
            <button type="button" className={btnBase} onClick={clearEntry}>
              CE
            </button>
            <span className="invisible min-h-[2.75rem]" aria-hidden="true" />
            <span className="invisible min-h-[2.75rem]" aria-hidden="true" />
            <button type="button" className={cn(btnBase, btnOp)} onClick={() => commitOperator('/')}>
              ÷
            </button>

            <button type="button" className={btnBase} onClick={() => inputDigit(7)}>
              7
            </button>
            <button type="button" className={btnBase} onClick={() => inputDigit(8)}>
              8
            </button>
            <button type="button" className={btnBase} onClick={() => inputDigit(9)}>
              9
            </button>
            <button type="button" className={cn(btnBase, btnOp)} onClick={() => commitOperator('*')}>
              ×
            </button>

            <button type="button" className={btnBase} onClick={() => inputDigit(4)}>
              4
            </button>
            <button type="button" className={btnBase} onClick={() => inputDigit(5)}>
              5
            </button>
            <button type="button" className={btnBase} onClick={() => inputDigit(6)}>
              6
            </button>
            <button type="button" className={cn(btnBase, btnOp)} onClick={() => commitOperator('-')}>
              −
            </button>

            <button type="button" className={btnBase} onClick={() => inputDigit(1)}>
              1
            </button>
            <button type="button" className={btnBase} onClick={() => inputDigit(2)}>
              2
            </button>
            <button type="button" className={btnBase} onClick={() => inputDigit(3)}>
              3
            </button>
            <button type="button" className={cn(btnBase, btnOp)} onClick={() => commitOperator('+')}>
              +
            </button>

            <button type="button" className={cn(btnBase, 'col-span-2')} onClick={() => inputDigit(0)}>
              0
            </button>
            <button type="button" className={btnBase} onClick={inputDot}>
              .
            </button>
            <button type="button" className={cn(btnBase, btnEquals)} onClick={equals}>
              =
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
