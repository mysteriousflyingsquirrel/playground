import { NavLink } from 'react-router-dom'
import { cn } from '../cn.js'

function IconSpark() {
  return (
    <svg className="h-6 w-6 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4l1.4-1.4M17 7l1.4-1.4" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function IconLayers() {
  return (
    <svg className="h-6 w-6 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinejoin="round" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg className="h-6 w-6 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
    </svg>
  )
}

const destinations = [
  {
    to: '/info',
    kicker: 'Orientation',
    title: 'Project overview',
    description: 'How routing, pages, and the design system connect in this workspace.',
  },
  {
    to: '/calculator',
    kicker: 'Tools',
    title: 'Calculator',
    description: 'Keyboard-friendly numeric pad with Taurex accent on the equals action.',
  },
  {
    to: '/calendar',
    kicker: 'Scheduling',
    title: 'Season calendar',
    description: 'Paint seasons on a full-year grid with named ranges and colors.',
  },
  {
    to: '/bookings',
    kicker: 'Operations',
    title: 'Bookings table',
    description: 'Dense reservations list with nights and currency formatting.',
  },
  {
    to: '/apartments',
    kicker: 'Listings',
    title: 'Example stays',
    description: 'Carousel imagery and copy blocks similar to a guest browsing flow.',
  },
  {
    to: '/news-feed',
    kicker: 'Content',
    title: 'News feed',
    description: 'Expandable article cards with imagery and secondary actions.',
  },
  {
    to: '/payment-methods',
    kicker: 'Billing',
    title: 'Payment methods',
    description: 'Add and remove method types with amber primary actions.',
  },
  {
    to: '/settings',
    kicker: 'Preferences',
    title: 'Settings',
    description: 'Forms, theme toggle persistence, and dense preference controls.',
  },
]

export default function Home() {
  return (
    <div className="ds-page">
      <header className="ds-page-header">
        <div className="ds-page-header-inner">
          <p className="ds-page-kicker">Welcome</p>
          <h1 className="ds-page-title">Build and preview in isolation</h1>
          <p className="ds-page-lede">
            This shell mirrors Taurex tokens—<strong className="font-semibold text-fg">light baseline</strong>, navy primary,
            bright blue highlights, and <strong className="font-semibold text-fg">amber CTAs</strong>—so experiments stay aligned
            with the design system.
          </p>
        </div>
      </header>

      <div className="grid w-full min-w-0 gap-4 sm:grid-cols-3">
        <div className="ds-stat">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="ds-stat-value">10</p>
              <p className="ds-stat-label">Example screens</p>
            </div>
            <IconLayers />
          </div>
        </div>
        <div className="ds-stat">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="ds-stat-value">DS</p>
              <p className="ds-stat-label">Single token source</p>
            </div>
            <IconSpark />
          </div>
        </div>
        <div className="ds-stat">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="ds-stat-value">A11y</p>
              <p className="ds-stat-label">Focus + contrast first</p>
            </div>
            <IconShield />
          </div>
        </div>
      </div>

      <section className="ds-section">
        <h2 className="ds-section-title">Quick orientation</h2>
        <p className="ds-section-prose mt-3">
          Each route is self-contained—forms, tables, media, and calendars share the same semantic utilities (
          <code className="ds-kbd">bg-surface</code>, <code className="ds-kbd">text-muted</code>,{' '}
          <code className="ds-kbd">shadow-ds-md</code>) so refactors stay predictable.
        </p>
      </section>

      <div>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-muted">Explore destinations</h2>
          <p className="w-full text-xs text-muted sm:text-right">
            Cards lift on hover using shadow only—no layout shift per design system anti-patterns.
          </p>
        </div>
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {destinations.map(({ to, kicker, title, description }) => (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'group ds-card-interactive flex min-h-[10.5rem] flex-col border-2 border-transparent p-6 no-underline outline-none transition-[border-color,box-shadow,opacity] duration-200',
                'hover:border-secondary/20 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/25',
              )}
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent">{kicker}</p>
              <p className="mt-2 text-lg font-bold tracking-tight text-fg">{title}</p>
              <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted">{description}</p>
              <span className="mt-5 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-secondary transition-colors duration-200 group-hover:text-primary">
                Open screen
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
