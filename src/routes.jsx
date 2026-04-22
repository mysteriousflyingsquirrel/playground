import Home from './pages/Home.jsx'
import Info from './pages/Info.jsx'
import Calculator from './pages/Calculator.jsx'
import Calendar from './pages/Calendar.jsx'
import Apartments from './pages/Apartments.jsx'
import Bookings from './pages/Bookings.jsx'
import PaymentMethods from './pages/PaymentMethods.jsx'
import Settings from './pages/Settings.jsx'

export const navRoutes = [
  { path: '/', label: 'Home', element: <Home /> },
  { path: '/info', label: 'Info', element: <Info /> },
  { path: '/calculator', label: 'Calculator', element: <Calculator /> },
  { path: '/calendar', label: 'Calendar', element: <Calendar /> },
  { path: '/apartments', label: 'Apartments', element: <Apartments /> },
  { path: '/bookings', label: 'Bookings', element: <Bookings /> },
  { path: '/payment-methods', label: 'Payment methods', element: <PaymentMethods /> },
  { path: '/settings', label: 'Settings', element: <Settings /> },
]
