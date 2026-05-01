import { useState } from 'react'

export default function Settings({ theme, setTheme }) {
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
    <div className="ds-page">
      <header className="ds-page-header">
        <div className="ds-page-header-inner">
          <p className="ds-page-kicker">Preferences</p>
          <h1 className="ds-page-title">Settings</h1>
          <p className="ds-page-lede">
            Example preferences for this playground app. Most options stay in memory only until you refresh;{' '}
            <strong className="font-semibold text-fg">color theme</strong> (light or dark) is saved in this browser. The default
            is light to match the Taurex design baseline.
          </p>
        </div>
      </header>

      <div className="grid w-full min-w-0 gap-6 xl:grid-cols-12 xl:items-start xl:gap-8">
        <section className="ds-section xl:col-span-5 ring-1 ring-secondary/[0.08]" aria-labelledby="settings-notifications-heading">
          <h2 id="settings-notifications-heading" className="ds-section-title border-b border-border pb-4">
            Notifications & UI
          </h2>
          <div className="mt-6 space-y-5">
            <div>
              <label className="ds-check-label" htmlFor="settings-email-notify">
                <input
                  id="settings-email-notify"
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                Email notifications
              </label>
            </div>
            <div>
              <label className="ds-check-label" htmlFor="settings-compact">
                <input
                  id="settings-compact"
                  type="checkbox"
                  checked={compactUi}
                  onChange={(e) => setCompactUi(e.target.checked)}
                />
                Compact UI
              </label>
            </div>
            <div>
              <label className="ds-check-label" htmlFor="settings-tooltips">
                <input
                  id="settings-tooltips"
                  type="checkbox"
                  checked={tooltipsEnabled}
                  onChange={(e) => setTooltipsEnabled(e.target.checked)}
                />
                Show tooltips
              </label>
            </div>
            <div>
              <label className="ds-field-label" htmlFor="settings-color-theme">
                Color theme
              </label>
              <select
                id="settings-color-theme"
                className="ds-select w-full"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="ds-field-label" htmlFor="settings-density">
                Theme density
              </label>
              <select
                id="settings-density"
                className="ds-select w-full"
                value={themeDensity}
                onChange={(e) => setThemeDensity(e.target.value)}
              >
                <option value="spacious">Spacious</option>
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex min-w-0 flex-col gap-6 xl:col-span-7">
          <section className="ds-section ring-1 ring-primary/[0.06]" aria-labelledby="settings-calendar-heading">
            <h2 id="settings-calendar-heading" className="ds-section-title border-b border-border pb-4">
              Calendar
            </h2>
            <div className="mt-6 space-y-6">
              <div>
                <label className="ds-field-label" htmlFor="settings-cal-view">
                  Default calendar view
                </label>
                <select
                  id="settings-cal-view"
                  className="ds-select w-full"
                  value={calendarView}
                  onChange={(e) => setCalendarView(e.target.value)}
                >
                  <option value="month">Month</option>
                  <option value="week">Week</option>
                  <option value="agenda">Agenda</option>
                </select>
              </div>
              <fieldset className="m-0 rounded-xl border border-border bg-muted-bg/30 p-4">
                <legend className="mb-3 px-1 text-sm font-bold text-muted">Week starts on</legend>
                <div className="flex flex-wrap gap-x-10 gap-y-3">
                  <label className="ds-check-label" htmlFor="settings-week-sun">
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
                  <label className="ds-check-label" htmlFor="settings-week-mon">
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
            </div>
          </section>

          <section className="ds-section ring-1 ring-accent/10" aria-labelledby="settings-profile-heading">
            <h2 id="settings-profile-heading" className="ds-section-title border-b border-border pb-4">
              Profile & workspace
            </h2>
            <div className="mt-6 grid w-full min-w-0 gap-5 sm:grid-cols-2 sm:gap-x-6">
              <div className="sm:col-span-2">
                <label className="ds-field-label" htmlFor="settings-display-name">
                  Display name
                </label>
                <input
                  id="settings-display-name"
                  type="text"
                  className="ds-input"
                  autoComplete="name"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="ds-field-label" htmlFor="settings-workspace">
                  Workspace label
                </label>
                <input
                  id="settings-workspace"
                  type="text"
                  className="ds-input"
                  placeholder="e.g. Personal, Team East"
                  value={workspaceLabel}
                  onChange={(e) => setWorkspaceLabel(e.target.value)}
                />
              </div>
              <div>
                <label className="ds-field-label" htmlFor="settings-language">
                  Language
                </label>
                <select
                  id="settings-language"
                  className="ds-select w-full"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div>
                <label className="ds-field-label" htmlFor="settings-items-page">
                  Items per page
                </label>
                <input
                  id="settings-items-page"
                  type="text"
                  className="ds-input"
                  inputMode="numeric"
                  placeholder="25"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
