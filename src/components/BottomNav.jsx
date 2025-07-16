import { NavLink } from 'react-router-dom'
import {
  House,
  ListBullets,
  CalendarBlank,
  UserCircle,
} from 'phosphor-react'

export default function BottomNav() {
  const items = [
    { to: '/', label: 'Home', Icon: House },
    { to: '/myplants', label: 'My Plants', Icon: ListBullets },
    { to: '/timeline', label: 'Timeline', Icon: CalendarBlank },
    { to: '/profile', label: 'Profile', Icon: UserCircle },
  ]

  return (
    <nav
      className="fixed bottom-4 inset-x-4 bg-white/90 dark:bg-gray-700/90 rounded-full backdrop-blur-md shadow-lg px-8 pt-2 pb-3 flex justify-between items-center pb-safe"
    >
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1 text-xs font-medium transition-colors duration-150 rounded-full ${isActive ? 'text-accent' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`flex items-center justify-center w-10 h-8 rounded-full ${isActive ? 'bg-accent/20' : ''}`}>
                <Icon
                  weight={isActive ? 'fill' : 'regular'}
                  className={`w-6 h-6 ${isActive ? 'animate-bounce-once' : ''}`}
                  aria-hidden="true"
                />
              </span>
              <span className="sr-only">{label}</span>
              {isActive && <span className="text-xs">{label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
