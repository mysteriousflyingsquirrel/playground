import { useEffect, useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { navRoutes } from './routes.jsx'
import { cn } from './cn.js'
import Settings from './pages/Settings.jsx'

const THEME_STORAGE_KEY = 'playground-theme'

function NavGlyph({ children, className }) {
  return (
    <svg
      className={cn('h-5 w-5 shrink-0', className)}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

const navGlyphByPath = {
  '/': (
    <NavGlyph>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </NavGlyph>
  ),
  '/info': (
    <NavGlyph>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </NavGlyph>
  ),
  '/calculator': (
    <NavGlyph>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h2M12 11h2M16 11h2M8 15h2M12 15h2M16 15h2M8 19h8" />
    </NavGlyph>
  ),
  '/calendar': (
    <NavGlyph>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </NavGlyph>
  ),
  '/apartments': (
    <NavGlyph>
      <path d="M3 21h18M5 21V7l7-4v18M12 21V11h5v10" />
    </NavGlyph>
  ),
  '/bookings': (
    <NavGlyph>
      <path d="M8 6h13M8 6a2 2 0 1 1 4 0h-4M8 6V4m5 2V4m5 2V4M6 6H3v16h18V6h-3" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </NavGlyph>
  ),
  '/news-feed': (
    <NavGlyph>
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9h7v9a2 2 0 0 0 2 2Z" />
      <path d="M10 6h8M10 10h8M10 14h4" />
    </NavGlyph>
  ),
  '/payment-methods': (
    <NavGlyph>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </NavGlyph>
  ),
  '/settings': (
    <NavGlyph>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </NavGlyph>
  ),
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const raw = document.documentElement.dataset.theme
    return raw === 'light' || raw === 'dark' ? raw : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-bg md:flex-row">
      <aside
        className="sticky top-0 z-30 flex max-h-[100dvh] shrink-0 flex-col overflow-y-auto border-border bg-muted-bg shadow-ds-lg md:w-[300px] md:border-r md:shadow-none"
        aria-label="Application"
      >
        <div className="bg-primary px-4 py-6 text-on-primary md:px-5 md:py-7">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-on-primary/85">Taurex</p>
          <p className="mt-1.5 text-xl font-extrabold leading-tight tracking-tight">Playground</p>
          <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-on-primary/80">
            Isolated flows, shared tokens, and production-safe experiments.
          </p>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto px-2 py-3 md:flex-1 md:flex-col md:overflow-visible md:gap-0.5 md:px-3 md:py-4"
          aria-label="Primary"
        >
          {navRoutes.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex min-h-11 shrink-0 cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-[0.9375rem] font-medium no-underline transition-[background-color,border-color,box-shadow,color] duration-200 md:min-h-0 md:py-2.5',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]',
                  isActive
                    ? 'border-border bg-surface text-primary shadow-ds-md md:border-l-4 md:border-l-accent md:pl-2.5 [&_svg]:text-secondary'
                    : 'text-muted hover:border-border hover:bg-surface/70 hover:text-fg [&_svg]:text-muted hover:[&_svg]:text-secondary',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'ds-nav-item-icon-wrap',
                      isActive
                        ? 'border-secondary/30 bg-muted-bg shadow-ds-sm'
                        : 'border-border/90 bg-surface group-hover:border-secondary/25',
                    )}
                  >
                    {navGlyphByPath[path]}
                  </span>
                  <span className="min-w-0 flex-1 whitespace-nowrap">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-border bg-surface/50 px-5 py-4 text-[0.7rem] leading-snug text-muted md:block">
          <span className="font-semibold text-fg">Design baseline</span>
          <span className="mt-1 block">Light default · Plus Jakarta · Amber CTA</span>
        </div>
      </aside>
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="relative min-h-0 min-w-0 flex-1 overflow-auto">
          <div className="ds-app-main-wash pointer-events-none absolute inset-0 opacity-[0.97]" aria-hidden />
          <div className="relative mx-auto min-h-full w-full min-w-0 max-w-none px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-11">
            <Routes>
              {navRoutes.map(({ path, Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    Component === Settings ? (
                      <Settings theme={theme} setTheme={setTheme} />
                    ) : (
                      <Component />
                    )
                  }
                />
              ))}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}
