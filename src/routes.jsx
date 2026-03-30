import Home from './pages/Home.jsx'
import Info from './pages/Info.jsx'
import PlanIssue from './pages/PlanIssue.jsx'

export const navRoutes = [
  { path: '/', label: 'Home', element: <Home /> },
  { path: '/info', label: 'Info', element: <Info /> },
  { path: '/plan-issue', label: 'Plan Issue', element: <PlanIssue /> },
]
