import { useState } from 'react'

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
    <div className="page">
      <h1>Settings</h1>
      <p className="page-lead">
        Example preferences for this playground app. Values stay in memory only
        until you refresh the page.
      </p>

      <section className="info-section">
        <h2>Notifications & UI</h2>
        <div className="settings-row">
          <label className="settings-label" htmlFor="settings-email-notify">
            <input
              id="settings-email-notify"
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            Email notifications
          </label>
        </div>
        <div className="settings-row">
          <label className="settings-label" htmlFor="settings-compact">
            <input
              id="settings-compact"
              type="checkbox"
              checked={compactUi}
              onChange={(e) => setCompactUi(e.target.checked)}
            />
            Compact UI
          </label>
        </div>
        <div className="settings-row">
          <label className="settings-label" htmlFor="settings-tooltips">
            <input
              id="settings-tooltips"
              type="checkbox"
              checked={tooltipsEnabled}
              onChange={(e) => setTooltipsEnabled(e.target.checked)}
            />
            Show tooltips
          </label>
        </div>
        <div className="settings-row">
          <label className="settings-field-label" htmlFor="settings-density">
            Theme density
          </label>
          <select
            id="settings-density"
            className="settings-select"
            value={themeDensity}
            onChange={(e) => setThemeDensity(e.target.value)}
          >
            <option value="spacious">Spacious</option>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </section>

      <section className="info-section">
        <h2>Calendar</h2>
        <div className="settings-row">
          <label className="settings-field-label" htmlFor="settings-cal-view">
            Default calendar view
          </label>
          <select
            id="settings-cal-view"
            className="settings-select"
            value={calendarView}
            onChange={(e) => setCalendarView(e.target.value)}
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>
        <fieldset className="settings-fieldset">
          <legend className="settings-legend">Week starts on</legend>
          <div className="settings-radio-group">
            <label className="settings-label" htmlFor="settings-week-sun">
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
            <label className="settings-label" htmlFor="settings-week-mon">
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

      <section className="info-section">
        <h2>Profile & workspace</h2>
        <div className="settings-row">
          <label className="settings-field-label" htmlFor="settings-display-name">
            Display name
          </label>
          <input
            id="settings-display-name"
            type="text"
            className="settings-input"
            autoComplete="name"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="settings-row">
          <label className="settings-field-label" htmlFor="settings-workspace">
            Workspace label
          </label>
          <input
            id="settings-workspace"
            type="text"
            className="settings-input"
            placeholder="e.g. Personal, Team East"
            value={workspaceLabel}
            onChange={(e) => setWorkspaceLabel(e.target.value)}
          />
        </div>
        <div className="settings-row">
          <label className="settings-field-label" htmlFor="settings-language">
            Language
          </label>
          <select
            id="settings-language"
            className="settings-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div className="settings-row">
          <label className="settings-field-label" htmlFor="settings-items-page">
            Items per page
          </label>
          <input
            id="settings-items-page"
            type="text"
            className="settings-input"
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
