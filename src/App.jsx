import { Routes, Route, NavLink } from 'react-router-dom'
import { navRoutes } from './routes.jsx'

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">Playground</div>
        <nav className="sidebar-nav">
          {navRoutes.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link--active' : '')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <Routes>
          {navRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </main>
    </div>
  )
}
