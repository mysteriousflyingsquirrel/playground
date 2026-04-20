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
  'm-0 cursor-pointer rounded-lg border border-border bg-surface px-2 py-[0.65rem] font-inherit text-[1.05rem] font-medium text-fg transition-colors hover:border-accent-dim hover:bg-accent/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const btnOp = 'text-accent bg-accent/10 hover:bg-accent/[0.18]'
const btnEquals =
  'border-accent-dim bg-accent/[0.22] font-semibold hover:bg-accent/[0.32] hover:text-fg'

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
    <div className="max-w-2xl">
      <h1 className="mb-3 text-[1.75rem] font-semibold">Calculator</h1>
      <p className="mb-6 text-[1.05rem] leading-normal text-muted [&_strong]:text-fg">
        Basic operations (+ − × ÷), <strong>CE</strong> clears the current entry,{' '}
        <strong>=</strong> completes the calculation.
      </p>
      <section className="mt-2 max-w-xs" aria-label="Calculator">
        <output
          className="mb-3 block min-h-12 w-full break-all rounded-lg border border-border bg-surface px-4 py-3 text-right text-2xl font-medium tabular-nums leading-snug text-fg"
          htmlFor="calculator-keys"
          aria-live="polite"
        >
          {display}
        </output>
        <div id="calculator-keys" className="grid grid-cols-4 gap-2">
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
  )
}
