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
    <nav className="fixed bottom-0 left-0 right-0 border-t dark:border-gray-600 bg-white dark:bg-gray-700 flex justify-around pt-2 pb-safe">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition-transform duration-150 ${isActive ? 'text-accent scale-110' : 'text-gray-500'}`
          }
        >
          <Icon className="mb-1 transition-colors duration-150" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
