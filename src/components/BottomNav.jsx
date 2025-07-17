import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useMenu } from '../MenuContext.jsx'

export default function BottomNav() {
  const [open, setOpen] = useState(false)
  const { menu } = useMenu()
  const { items, Icon } = menu

  return (
    <div className="fixed bottom-4 right-4 z-20">
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onClick={() => setOpen(false)}
        >
          <ul
            className="relative bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 space-y-4 bloom-pop text-lg"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              &times;
            </button>
            {items.map(({ to, onClick, label, Icon }) => (
              <li key={label}>
                {to ? (
                  <NavLink
                    to={to}
                    onClick={() => setOpen(false)}
                    title={label}
                    className="flex items-center gap-3 hover:text-accent"
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    {label}
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      onClick?.()
                    }}
                    title={label}
                    className="flex items-center gap-3 w-full text-left hover:text-accent"
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    {label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Open navigation menu"
        title="Open navigation menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="bg-accent text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700"
      >
        <Icon className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  )
}
