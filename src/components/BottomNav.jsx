import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useMenu } from '../MenuContext.jsx'

export default function BottomNav() {
  const [open, setOpen] = useState(false)
  const { menu } = useMenu()
  const { items, Icon, modal } = menu

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-20">
      {open && modal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-20"
          onClick={() => setOpen(false)}
        >
          <ul
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 grid grid-cols-2 gap-4 text-center bloom-pop"
            onClick={e => e.stopPropagation()}
          >
            {items.map(({ to, onClick, label, Icon }) => (
              <li key={label}>
                {to ? (
                  <NavLink
                    to={to}
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center w-24"
                  >
                    <Icon className="w-6 h-6 mb-1" aria-hidden="true" />
                    {label}
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      onClick?.()
                    }}
                    className="flex flex-col items-center w-24"
                  >
                    <Icon className="w-6 h-6 mb-1" aria-hidden="true" />
                    {label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {open && !modal && (
        <ul className="mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg text-sm overflow-hidden py-2">
          {items.map(({ to, onClick, label, Icon }) => (
            <li key={label}>
              {to ? (
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
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onClick?.()
                  }}
                  className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600 text-left"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </button>
              )}
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
        <Icon className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  )
}
