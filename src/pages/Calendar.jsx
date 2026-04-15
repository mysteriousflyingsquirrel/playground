import { useMemo, useState } from 'react'

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
    <section className="calendar-month" aria-label={monthTitle} onMouseLeave={onLeaveGrid}>
      <h2 className="calendar-month-title">{monthTitle}</h2>
      <div className="calendar-grid calendar-grid--weekdays" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="calendar-weekday">
            {label}
          </span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((date, index) => {
          if (!date) {
            return <span key={`empty-${month}-${index}`} className="calendar-day calendar-day--disabled" />
          }

          const activeRange = selectedRange ?? previewRange
          const inRange =
            !!activeRange && date >= activeRange.start && date <= activeRange.end
          const isEdge =
            (rangeStart && isSameDay(date, rangeStart)) || (rangeEnd && isSameDay(date, rangeEnd))
          const isToday = isSameDay(date, today)
          const classNames = [
            'calendar-day',
            inRange ? 'calendar-day--in-range' : '',
            isEdge ? 'calendar-day--edge' : '',
            isToday ? 'calendar-day--today' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={toDateInputValue(date)}
              type="button"
              className={classNames}
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
    <div className="page">
      <h1>Calendar</h1>
      <p className="page-lead">
        Select a <strong>date range</strong> by clicking a start and end date.
      </p>

      <label className="calendar-field-label" htmlFor="calendar-range">
        Selected range
      </label>
      <input
        id="calendar-range"
        className="calendar-range-field"
        type="text"
        readOnly
        placeholder="No dates selected"
        value={rangeText}
      />

      <div className="calendar-nav">
        <button type="button" className="calendar-nav-btn" onClick={() => shiftMonths(-1)}>
          Prev
        </button>
        <div className="calendar-nav-label">
          {monthLabel(leftMonth.year, leftMonth.month)} /{' '}
          {monthLabel(rightMonth.year, rightMonth.month)}
        </div>
        <button type="button" className="calendar-nav-btn" onClick={() => shiftMonths(1)}>
          Next
        </button>
      </div>

      <div className="calendar-months">
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
