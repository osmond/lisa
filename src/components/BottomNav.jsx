import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  House,
  ListBullets,
  CalendarBlank,
  UserCircle,
  Hamburger,
} from 'phosphor-react'

export default function BottomNav() {
  const [open, setOpen] = useState(false)
  const items = [
    { to: '/', label: 'Home', Icon: House },
    { to: '/myplants', label: 'My Plants', Icon: ListBullets },
    { to: '/timeline', label: 'Timeline', Icon: CalendarBlank },
    { to: '/profile', label: 'Profile', Icon: UserCircle },
  ]

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-20">
      {open && (
        <ul className="mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg text-sm overflow-hidden py-2">
          {items.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600 ${isActive ? 'text-accent' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon weight={isActive ? 'fill' : 'regular'} className="w-4 h-4" aria-hidden="true" />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Open navigation menu"
        className="bg-accent text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700"
      >
        <Hamburger className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  )
}
