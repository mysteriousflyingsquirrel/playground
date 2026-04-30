import Home from './pages/Home.jsx'
import Info from './pages/Info.jsx'
import Calculator from './pages/Calculator.jsx'
import Calendar from './pages/Calendar.jsx'
import Apartments from './pages/Apartments.jsx'
import Bookings from './pages/Bookings.jsx'
import PaymentMethods from './pages/PaymentMethods.jsx'
import Settings from './pages/Settings.jsx'
import NewsFeed from './pages/NewsFeed.jsx'

export const navRoutes = [
  { path: '/', label: 'Home', Component: Home },
  { path: '/info', label: 'Info', Component: Info },
  { path: '/calculator', label: 'Calculator', Component: Calculator },
  { path: '/calendar', label: 'Calendar', Component: Calendar },
  { path: '/apartments', label: 'Apartments', Component: Apartments },
  { path: '/bookings', label: 'Bookings', Component: Bookings },
  { path: '/news-feed', label: 'News feed', Component: NewsFeed },
  { path: '/payment-methods', label: 'Payment methods', Component: PaymentMethods },
  { path: '/settings', label: 'Settings', Component: Settings },
]
