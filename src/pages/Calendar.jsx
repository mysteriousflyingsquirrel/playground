import { useId, useMemo, useState } from 'react'
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

function fromDateInputValue(value) {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return dateAtMidday(y, m - 1, d)
}

function normalizeRange(start, end) {
  if (!start || !end) return null
  return start <= end ? { start, end } : { start: end, end: start }
}

function rangeContainsDate(range, date) {
  if (!range || !date) return false
  return date >= range.start && date <= range.end
}

function rangesListContainsDate(ranges, date) {
  for (const r of ranges) {
    const a = fromDateInputValue(r.start)
    const b = fromDateInputValue(r.end)
    const n = normalizeRange(a, b)
    if (n && rangeContainsDate(n, date)) return true
  }
  return false
}

function isDateOnRangeEdgeInSeason(season, date) {
  for (const r of season.ranges) {
    const a = fromDateInputValue(r.start)
    const b = fromDateInputValue(r.end)
    const n = normalizeRange(a, b)
    if (n && rangeContainsDate(n, date) && (isSameDay(date, n.start) || isSameDay(date, n.end))) {
      return true
    }
  }
  return false
}

/**
 * If multiple seasons include a day, the active (selected) season has visual priority.
 */
function getOwningSeasonIdForDay(seasons, activeSeasonId, date) {
  const active = seasons.find((s) => s.id === activeSeasonId)
  if (active && rangesListContainsDate(active.ranges, date)) {
    return active.id
  }
  for (const s of seasons) {
    if (s.id === activeSeasonId) continue
    if (rangesListContainsDate(s.ranges, date)) return s.id
  }
  return null
}

const dayBtnBase =
  'm-0 min-h-8 cursor-pointer rounded-md border font-inherit text-xs text-fg transition-[border-color,background-color,box-shadow] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]'

function dayButtonClass(inRange, isEdge, isToday) {
  return cn(
    !isEdge && inRange && 'border-border bg-accent/15 hover:border-primary/40 hover:bg-accent/12',
    !isEdge && !inRange && 'border-border bg-bg hover:border-primary/35 hover:bg-muted-bg/80',
    isEdge && 'border-primary bg-accent/25 font-semibold text-fg hover:bg-accent/35',
    isToday && 'ring-2 ring-inset ring-primary/50',
  )
}

function MonthGrid({
  year,
  month,
  rangeStart,
  hoverDate,
  onPickDate,
  onHoverDate,
  onLeaveGrid,
  selectionEnabled,
  seasons,
  activeSeasonId,
}) {
  const monthTitle = `${MONTH_LABELS[month]} ${year}`
  const today = dateAtMidday(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  )
  const cells = useMemo(() => getMonthDays(year, month), [year, month])
  const previewRange = normalizeRange(rangeStart, hoverDate)
  const activeRange = previewRange

  return (
    <section
      className="min-w-0 rounded-2xl border border-border bg-surface p-3 shadow-ds-sm"
      aria-label={monthTitle}
      onMouseLeave={onLeaveGrid}
    >
      <h2 className="mb-1.5 text-sm font-semibold text-fg">{monthTitle}</h2>
      <div className="mb-1 grid grid-cols-7 gap-0.5" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="flex justify-center text-[0.65rem] text-muted">
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, index) => {
          if (!date) {
            return (
              <span
                key={`empty-${month}-${index}`}
                className="pointer-events-none invisible min-h-8 rounded-md border border-transparent"
              />
            )
          }

          const ownId = getOwningSeasonIdForDay(seasons, activeSeasonId, date)
          const ownSeason = ownId ? seasons.find((s) => s.id === ownId) : null
          const seasonIsEdge = ownSeason
            ? isDateOnRangeEdgeInSeason(ownSeason, date)
            : false

          const draftInRange = !!activeRange && date >= activeRange.start && date <= activeRange.end
          const draftIsEdge =
            (rangeStart && isSameDay(date, rangeStart)) ||
            (previewRange && isSameDay(date, previewRange.end))
          const showDraft = selectionEnabled && (draftInRange || draftIsEdge)
          const isToday = isSameDay(date, today)

          const seasonStyles =
            !showDraft && ownSeason
              ? {
                  backgroundColor: `${ownSeason.color}26`,
                  borderColor: ownSeason.color,
                }
              : undefined

          return (
            <button
              key={toDateInputValue(date)}
              type="button"
              disabled={!selectionEnabled}
              className={cn(
                dayBtnBase,
                showDraft
                  ? dayButtonClass(draftInRange, draftIsEdge, isToday)
                  : !ownSeason
                    ? cn(
                        'border-border bg-bg hover:border-primary/35 hover:bg-muted-bg/80',
                        isToday && 'ring-2 ring-inset ring-primary/50',
                      )
                    : cn(
                        'font-medium',
                        seasonIsEdge && 'font-semibold',
                        isToday && 'ring-1 ring-inset ring-accent',
                      ),
                !selectionEnabled && 'cursor-not-allowed opacity-50',
              )}
              style={seasonStyles}
              onClick={() => onPickDate(date)}
              onMouseEnter={() => onHoverDate(date)}
              aria-pressed={showDraft ? draftIsEdge : seasonIsEdge}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </section>
  )
}

/** Default season swatch: `--color-secondary` / Taurex bright blue */
const defaultColor = '#0F69ED'

function newId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `season-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function Calendar() {
  const formId = useId()
  const nameId = `${formId}-name`
  const colorId = `${formId}-color`

  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [seasons, setSeasons] = useState([])
  const [activeSeasonId, setActiveSeasonId] = useState(null)
  const [newSeasonName, setNewSeasonName] = useState('')
  const [newSeasonColor, setNewSeasonColor] = useState(defaultColor)
  const [rangeStart, setRangeStart] = useState(null)
  const [hoverDate, setHoverDate] = useState(null)

  const activeSeason = seasons.find((s) => s.id === activeSeasonId) ?? null
  const selectionEnabled = !!activeSeason

  function addSeason(e) {
    e.preventDefault()
    const name = newSeasonName.trim() || 'Season'
    const id = newId()
    setSeasons((prev) => [...prev, { id, name, color: newSeasonColor, ranges: [] }])
    setActiveSeasonId(id)
    setNewSeasonName('')
  }

  function removeSeason(id) {
    setSeasons((prev) => prev.filter((s) => s.id !== id))
    setActiveSeasonId((cur) => (cur === id ? null : cur))
    if (activeSeasonId === id) {
      setRangeStart(null)
      setHoverDate(null)
    }
  }

  function updateSeason(seasonId, patch) {
    setSeasons((prev) =>
      prev.map((season) => (season.id === seasonId ? { ...season, ...patch } : season)),
    )
  }

  function removeRange(seasonId, rangeIndex) {
    setSeasons((prev) =>
      prev.map((s) => {
        if (s.id !== seasonId) return s
        const next = [...s.ranges]
        next.splice(rangeIndex, 1)
        return { ...s, ranges: next }
      }),
    )
  }

  function commitRangeToActiveSeason(a, b) {
    const norm = normalizeRange(a, b)
    if (!norm || !activeSeasonId) return
    const rec = { start: toDateInputValue(norm.start), end: toDateInputValue(norm.end) }
    setSeasons((prev) =>
      prev.map((s) => {
        if (s.id !== activeSeasonId) return s
        return { ...s, ranges: [...s.ranges, rec] }
      }),
    )
  }

  function handlePickDate(date) {
    if (!activeSeason) return

    if (!rangeStart) {
      setRangeStart(date)
      setHoverDate(null)
      return
    }

    if (date <= rangeStart) {
      commitRangeToActiveSeason(date, rangeStart)
      setRangeStart(null)
      setHoverDate(null)
      return
    }

    commitRangeToActiveSeason(rangeStart, date)
    setRangeStart(null)
    setHoverDate(null)
  }

  const draftSummary = useMemo(() => {
    if (!rangeStart) return ''
    const preview = normalizeRange(rangeStart, hoverDate)
    if (preview) {
      return `${toDateInputValue(preview.start)} – ${toDateInputValue(preview.end)}`
    }
    return toDateInputValue(rangeStart)
  }, [rangeStart, hoverDate])

  return (
    <div className="ds-page">
      <header className="ds-page-header">
        <div className="ds-page-header-inner">
          <p className="ds-page-kicker">Scheduling</p>
          <h1 className="ds-page-title">Calendar</h1>
          <p className="ds-page-lede">
            Create <strong className="font-semibold text-fg">seasons</strong> with a name and color, choose an active
            season, then click two days on the grid to add a{' '}
            <strong className="font-semibold text-fg">date range</strong>. A year shows all twelve months; use the arrows
            to change year.
          </p>
        </div>
      </header>

      <section className="ds-section ring-1 ring-secondary/[0.06]" aria-labelledby="seasons-heading">
        <div className="mb-6 flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="seasons-heading" className="ds-section-title m-0">
            Seasons
          </h2>
          <p className="m-0 text-xs text-muted">Create a season, pick it as active, then paint ranges on the grid.</p>
        </div>

        <form onSubmit={addSeason} className="mb-8 flex flex-wrap items-end gap-4 border-b border-border pb-8">
          <div className="min-w-0 w-full flex-1">
            <label className="ds-field-label" htmlFor={nameId}>
              Name
            </label>
            <input
              id={nameId}
              className="ds-input w-full bg-bg"
              value={newSeasonName}
              onChange={(e) => setNewSeasonName(e.target.value)}
              placeholder="e.g. Winter training"
            />
          </div>
          <div>
            <label className="ds-field-label" htmlFor={colorId}>
              Color
            </label>
            <input
              id={colorId}
              type="color"
              className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-bg p-0.5 shadow-ds-sm transition-[border-color,box-shadow] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]"
              value={newSeasonColor}
              onChange={(e) => setNewSeasonColor(e.target.value)}
            />
          </div>
          <button type="submit" className="ds-btn-primary">
            Add season
          </button>
        </form>

        {seasons.length === 0 ? (
          <p className="text-sm text-muted">No seasons yet. Add one to start mapping ranges.</p>
        ) : (
          <ul className="flex flex-col gap-3" role="list">
            {seasons.map((s) => {
              const isActive = s.id === activeSeasonId
              return (
                <li
                  key={s.id}
                  className={cn(
                    'flex flex-col gap-2 rounded-xl border p-4 shadow-ds-sm sm:flex-row sm:items-start sm:justify-between',
                    isActive ? 'border-secondary/40 bg-muted-bg shadow-ds-md' : 'border-border bg-bg',
                  )}
                >
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <input
                      type="radio"
                      name="active-season"
                      className="h-4 w-4 shrink-0 accent-accent"
                      checked={isActive}
                      onChange={() => {
                        setActiveSeasonId(s.id)
                        setRangeStart(null)
                        setHoverDate(null)
                      }}
                      aria-label={`Select season ${s.name}`}
                    />
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm border border-border"
                      style={{ backgroundColor: s.color }}
                      aria-hidden
                    />
                    <input
                      type="text"
                      className="min-w-0 flex-1 basis-0 rounded-md border border-border bg-bg px-2 py-1 text-sm font-medium text-fg"
                      value={s.name}
                      onChange={(e) => updateSeason(s.id, { name: e.target.value })}
                      aria-label={`Season name for ${s.name || 'season'}`}
                    />
                    <input
                      type="color"
                      className="h-8 w-10 cursor-pointer rounded border border-border bg-bg p-0.5"
                      value={s.color}
                      onChange={(e) => updateSeason(s.id, { color: e.target.value })}
                      aria-label={`Season color for ${s.name || 'season'}`}
                    />
                    {s.ranges.length > 0 && (
                      <ul className="ml-0 flex w-full flex-col gap-1 pl-0 text-sm sm:ml-6 sm:mt-1 sm:pl-0" role="list">
                        {s.ranges.map((r, i) => (
                          <li key={`${r.start}-${r.end}-${i}`} className="flex items-center gap-2 text-muted">
                            <span>
                              {r.start} – {r.end}
                            </span>
                            <button
                              type="button"
                              className="m-0 cursor-pointer rounded-md border border-border px-2 py-1 text-xs font-medium text-fg transition-colors duration-200 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => removeRange(s.id, i)}
                              aria-label={`Remove range ${r.start} to ${r.end}`}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    className="m-0 shrink-0 cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium text-fg transition-colors duration-200 hover:border-destructive/45 hover:text-destructive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]"
                    onClick={() => removeSeason(s.id)}
                    aria-label={`Delete season ${s.name}`}
                  >
                    Delete season
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <div className="rounded-2xl border border-border bg-muted-bg px-4 py-4 shadow-ds-sm sm:px-6">
        <p className="m-0 text-sm leading-relaxed text-muted">
          {activeSeason ? (
            <>
              Active season: <span className="text-fg">{activeSeason.name}</span>. {draftSummary ? (
                <>Draft: {draftSummary}</>
              ) : (
                'Click a start and end day to add a range to this season.'
              )}
            </>
          ) : (
            'Select a season to enable date range selection on the calendar.'
          )}
        </p>
      </div>

      <div className={cn('ds-toolbar mx-auto w-full max-w-none gap-4 py-2 sm:px-6', 'justify-center')}>
        <button
          type="button"
          className="ds-btn-ghost inline-flex min-h-11 min-w-11 items-center justify-center px-2 py-2"
          onClick={() => setViewYear((y) => y - 1)}
          aria-label="Previous year"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="min-w-[8rem] text-center text-2xl font-extrabold tabular-nums tracking-tight text-fg" aria-live="polite">
          {viewYear}
        </div>
        <button
          type="button"
          className="ds-btn-ghost inline-flex min-h-11 min-w-11 items-center justify-center px-2 py-2"
          onClick={() => setViewYear((y) => y + 1)}
          aria-label="Next year"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MONTH_LABELS.map((_, month) => (
          <MonthGrid
            key={`${viewYear}-${month}`}
            year={viewYear}
            month={month}
            rangeStart={rangeStart}
            hoverDate={hoverDate}
            onPickDate={handlePickDate}
            onHoverDate={setHoverDate}
            onLeaveGrid={() => setHoverDate(null)}
            selectionEnabled={selectionEnabled}
            seasons={seasons}
            activeSeasonId={activeSeasonId}
          />
        ))}
      </div>
    </div>
  )
}
