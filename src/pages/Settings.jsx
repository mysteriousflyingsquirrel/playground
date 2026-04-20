import { useState } from 'react'

const fieldLabel = 'mb-1.5 block text-sm text-muted'
const inputLike =
  'w-full max-w-[22rem] rounded-lg border border-border bg-surface px-3 py-2.5 font-inherit text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const checkLabel =
  'inline-flex cursor-pointer items-center gap-2 text-[0.9375rem] text-fg'

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [compactUi, setCompactUi] = useState(false)
  const [themeDensity, setThemeDensity] = useState('comfortable')
  const [calendarView, setCalendarView] = useState('month')
  const [weekStart, setWeekStart] = useState('monday')
  const [displayName, setDisplayName] = useState('')
  const [workspaceLabel, setWorkspaceLabel] = useState('')
  const [tooltipsEnabled, setTooltipsEnabled] = useState(true)
  const [language, setLanguage] = useState('en')
  const [itemsPerPage, setItemsPerPage] = useState('25')

  return (
    <div className="max-w-2xl">
      <h1 className="mb-3 text-[1.75rem] font-semibold">Settings</h1>
      <p className="mb-6 text-[1.05rem] leading-normal text-muted [&_strong]:text-fg">
        Example preferences for this playground app. Values stay in memory only until you refresh
        the page.
      </p>

      <section className="mb-7">
        <h2 className="mb-2 text-base font-semibold text-fg">Notifications & UI</h2>
        <div className="mb-4">
          <label className={checkLabel} htmlFor="settings-email-notify">
            <input
              id="settings-email-notify"
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            Email notifications
          </label>
        </div>
        <div className="mb-4">
          <label className={checkLabel} htmlFor="settings-compact">
            <input
              id="settings-compact"
              type="checkbox"
              checked={compactUi}
              onChange={(e) => setCompactUi(e.target.checked)}
            />
            Compact UI
          </label>
        </div>
        <div className="mb-4">
          <label className={checkLabel} htmlFor="settings-tooltips">
            <input
              id="settings-tooltips"
              type="checkbox"
              checked={tooltipsEnabled}
              onChange={(e) => setTooltipsEnabled(e.target.checked)}
            />
            Show tooltips
          </label>
        </div>
        <div className="mb-0">
          <label className={fieldLabel} htmlFor="settings-density">
            Theme density
          </label>
          <select
            id="settings-density"
            className={inputLike}
            value={themeDensity}
            onChange={(e) => setThemeDensity(e.target.value)}
          >
            <option value="spacious">Spacious</option>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </section>

      <section className="mb-7">
        <h2 className="mb-2 text-base font-semibold text-fg">Calendar</h2>
        <div className="mb-4">
          <label className={fieldLabel} htmlFor="settings-cal-view">
            Default calendar view
          </label>
          <select
            id="settings-cal-view"
            className={inputLike}
            value={calendarView}
            onChange={(e) => setCalendarView(e.target.value)}
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>
        <fieldset className="m-0 mt-4 border-none p-0">
          <legend className="mb-2 text-sm font-semibold text-muted">Week starts on</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <label className={checkLabel} htmlFor="settings-week-sun">
              <input
                id="settings-week-sun"
                type="radio"
                name="weekStart"
                value="sunday"
                checked={weekStart === 'sunday'}
                onChange={() => setWeekStart('sunday')}
              />
              Sunday
            </label>
            <label className={checkLabel} htmlFor="settings-week-mon">
              <input
                id="settings-week-mon"
                type="radio"
                name="weekStart"
                value="monday"
                checked={weekStart === 'monday'}
                onChange={() => setWeekStart('monday')}
              />
              Monday
            </label>
          </div>
        </fieldset>
      </section>

      <section className="mb-7">
        <h2 className="mb-2 text-base font-semibold text-fg">Profile & workspace</h2>
        <div className="mb-4">
          <label className={fieldLabel} htmlFor="settings-display-name">
            Display name
          </label>
          <input
            id="settings-display-name"
            type="text"
            className={inputLike}
            autoComplete="name"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className={fieldLabel} htmlFor="settings-workspace">
            Workspace label
          </label>
          <input
            id="settings-workspace"
            type="text"
            className={inputLike}
            placeholder="e.g. Personal, Team East"
            value={workspaceLabel}
            onChange={(e) => setWorkspaceLabel(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className={fieldLabel} htmlFor="settings-language">
            Language
          </label>
          <select
            id="settings-language"
            className={inputLike}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div className="mb-0">
          <label className={fieldLabel} htmlFor="settings-items-page">
            Items per page
          </label>
          <input
            id="settings-items-page"
            type="text"
            className={inputLike}
            inputMode="numeric"
            placeholder="25"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
          />
        </div>
      </section>
    </div>
  )
}
