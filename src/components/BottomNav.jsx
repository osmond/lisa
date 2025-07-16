import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  ListBulletIcon,
  CalendarIcon,
  PersonIcon,
} from '@radix-ui/react-icons'

const iconProps = {
  className: 'w-6 h-6',
  'aria-hidden': 'true',
}

const HomeIconComponent = () => <HomeIcon {...iconProps} />
const ListIcon = () => <ListBulletIcon {...iconProps} />
const CalendarIconComponent = () => <CalendarIcon {...iconProps} />
const UserIcon = () => <PersonIcon {...iconProps} />

export default function BottomNav() {
  const items = [
    { to: '/', label: 'Home', icon: HomeIconComponent },
    { to: '/myplants', label: 'My Plants', icon: ListIcon },
    { to: '/timeline', label: 'Timeline', icon: CalendarIconComponent },
    { to: '/profile', label: 'Profile', icon: UserIcon },
  ]

  return (
    <nav
      className="fixed bottom-4 inset-x-4 bg-white dark:bg-gray-700 rounded-2xl shadow-lg px-6 py-3 flex justify-between items-center pb-safe"
    >
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors duration-150 ${isActive ? 'text-accent' : 'text-gray-500 hover:text-gray-700'}`
          }
        >
          <Icon className="w-6 h-6" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
