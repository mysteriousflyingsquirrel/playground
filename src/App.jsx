import { Routes, Route, NavLink } from 'react-router-dom'
import { navRoutes } from './routes.jsx'
import { cn } from './cn.js'

export default function App() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-[220px] shrink-0 border-r border-border bg-surface py-5">
        <div className="mb-3 border-b border-border px-5 pb-4 text-base font-semibold tracking-wide text-fg">
          Playground
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navRoutes.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-3 py-2 text-[0.9375rem] no-underline transition-colors',
                  isActive
                    ? 'bg-accent/12 text-accent'
                    : 'text-muted hover:bg-accent/8 hover:text-fg',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-h-0 flex-1 overflow-auto px-10 py-8">
        <Routes>
          {navRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </main>
    </div>
  )
}
