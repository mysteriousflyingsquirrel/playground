import { useMemo, useState } from 'react'
import { cn } from '../cn.js'

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function dateAtMidday(year, month, day) {
  return new Date(year, month, day, 12, 0, 0, 0)
}

function addMonths(baseYear, baseMonth, offset) {
  const next = new Date(baseYear, baseMonth + offset, 1)
  return { year: next.getFullYear(), month: next.getMonth() }
}

function getMonthDays(year, month) {
  const firstWeekday = dateAtMidday(year, month, 1).getDay()
  const dayCount = new Date(year, month + 1, 0).getDate()
  const cells = []

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push(null)
  }

  for (let day = 1; day <= dayCount; day += 1) {
    cells.push(dateAtMidday(year, month, day))
  }

  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  return cells
}

function isSameDay(a, b) {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function toDateInputValue(date) {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function normalizeRange(start, end) {
  if (!start || !end) return null
  return start <= end ? { start, end } : { start: end, end: start }
}

const dayBtnBase =
  'm-0 min-h-9 cursor-pointer rounded-md border font-inherit text-sm text-fg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent'

function dayButtonClass(inRange, isEdge, isToday) {
  return cn(
    dayBtnBase,
    !isEdge && inRange && 'border-border bg-accent/15 hover:border-accent-dim hover:bg-accent/10',
    !isEdge && !inRange && 'border-border bg-bg hover:border-accent-dim hover:bg-accent/10',
    isEdge && 'border-accent-dim bg-accent/35 font-semibold text-fg hover:bg-accent/40',
    isToday && 'ring-1 ring-inset ring-accent',
  )
}

function MonthGrid({
  year,
  month,
  rangeStart,
  rangeEnd,
  hoverDate,
  onPickDate,
  onHoverDate,
  onLeaveGrid,
}) {
  const monthTitle = `${MONTH_LABELS[month]} ${year}`
  const today = dateAtMidday(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  )
  const cells = useMemo(() => getMonthDays(year, month), [year, month])
  const previewRange = rangeEnd ? null : normalizeRange(rangeStart, hoverDate)
  const selectedRange = normalizeRange(rangeStart, rangeEnd)

  return (
    <section
      className="min-w-[18rem] rounded-lg border border-border bg-surface p-[0.85rem]"
      aria-label={monthTitle}
      onMouseLeave={onLeaveGrid}
    >
      <h2 className="mb-2 text-base font-semibold">{monthTitle}</h2>
      <div className="mb-[0.35rem] grid grid-cols-7 gap-[0.35rem]" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="flex justify-center text-xs text-muted">
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[0.35rem]">
        {cells.map((date, index) => {
          if (!date) {
            return (
              <span
                key={`empty-${month}-${index}`}
                className="pointer-events-none invisible min-h-9 rounded-md border border-transparent"
              />
            )
          }

          const activeRange = selectedRange ?? previewRange
          const inRange =
            !!activeRange && date >= activeRange.start && date <= activeRange.end
          const isEdge =
            (rangeStart && isSameDay(date, rangeStart)) || (rangeEnd && isSameDay(date, rangeEnd))
          const isToday = isSameDay(date, today)

          return (
            <button
              key={toDateInputValue(date)}
              type="button"
              className={dayButtonClass(inRange, isEdge, isToday)}
              onClick={() => onPickDate(date)}
              onMouseEnter={() => onHoverDate(date)}
              aria-pressed={isEdge}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default function Calendar() {
  const now = new Date()
  const [baseYear, setBaseYear] = useState(now.getFullYear())
  const [baseMonth, setBaseMonth] = useState(now.getMonth())
  const [rangeStart, setRangeStart] = useState(null)
  const [rangeEnd, setRangeEnd] = useState(null)
  const [hoverDate, setHoverDate] = useState(null)

  const leftMonth = { year: baseYear, month: baseMonth }
  const rightMonth = addMonths(baseYear, baseMonth, 1)

  function shiftMonths(offset) {
    const shifted = addMonths(baseYear, baseMonth, offset)
    setBaseYear(shifted.year)
    setBaseMonth(shifted.month)
  }

  function handlePickDate(date) {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date)
      setRangeEnd(null)
      setHoverDate(null)
      return
    }

    if (date <= rangeStart) {
      setRangeStart(date)
      setRangeEnd(rangeStart)
      setHoverDate(null)
      return
    }

    setRangeEnd(date)
    setHoverDate(null)
  }

  const rangeText = useMemo(() => {
    if (!rangeStart) return ''
    if (!rangeEnd) return toDateInputValue(rangeStart)
    const range = normalizeRange(rangeStart, rangeEnd)
    return `${toDateInputValue(range.start)} - ${toDateInputValue(range.end)}`
  }, [rangeStart, rangeEnd])

  const monthLabel = (year, month) => `${MONTH_LABELS[month]} ${year}`

  return (
    <div className="max-w-2xl">
      <h1 className="mb-3 text-[1.75rem] font-semibold">Calendar</h1>
      <p className="mb-6 text-[1.05rem] leading-normal text-muted [&_strong]:text-fg">
        Select a <strong>date range</strong> by clicking a start and end date.
      </p>

      <label className="mb-1.5 block text-sm text-muted" htmlFor="calendar-range">
        Selected range
      </label>
      <input
        id="calendar-range"
        className="mb-4 w-full max-w-[22rem] rounded-lg border border-border bg-surface px-3 py-2.5 font-inherit text-fg"
        type="text"
        readOnly
        placeholder="No dates selected"
        value={rangeText}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="m-0 cursor-pointer rounded-lg border border-border bg-surface px-2.5 py-1.5 font-inherit text-fg transition-colors hover:border-accent-dim hover:bg-accent/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={() => shiftMonths(-1)}
        >
          Prev
        </button>
        <div className="font-medium text-fg">
          {monthLabel(leftMonth.year, leftMonth.month)} /{' '}
          {monthLabel(rightMonth.year, rightMonth.month)}
        </div>
        <button
          type="button"
          className="m-0 cursor-pointer rounded-lg border border-border bg-surface px-2.5 py-1.5 font-inherit text-fg transition-colors hover:border-accent-dim hover:bg-accent/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={() => shiftMonths(1)}
        >
          Next
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <MonthGrid
          year={leftMonth.year}
          month={leftMonth.month}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          hoverDate={hoverDate}
          onPickDate={handlePickDate}
          onHoverDate={setHoverDate}
          onLeaveGrid={() => setHoverDate(null)}
        />
        <MonthGrid
          year={rightMonth.year}
          month={rightMonth.month}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          hoverDate={hoverDate}
          onPickDate={handlePickDate}
          onHoverDate={setHoverDate}
          onLeaveGrid={() => setHoverDate(null)}
        />
      </div>
    </div>
  )
}
